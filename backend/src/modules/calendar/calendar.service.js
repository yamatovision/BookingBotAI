import { google } from 'googleapis';
import { Reservation, CalendarSync, BusinessHours } from './calendar.model.js';
import { Settings } from '../settings/settings.model.js';  // Settingsモデルをインポート


class CalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // Google Calendar認証・同期関連の機能
  async generateAuthUrl(clientId) {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],state: clientId, // clientIdをstateパラメータとして含める
      prompt: 'consent' // 毎回同意画面を表示してrefresh_tokenを確実に取得
    });
    return authUrl;
  }

  async completeSyncSetup(code, clientId) {
    try {
      //認証コードからトークンを取得
      const { tokens } = await this.oauth2Client.getToken(code);
      
      // カレンダー一覧を取得して主要なカレンダーを特定
      this.oauth2Client.setCredentials(tokens);
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      const calendarList = await calendar.calendarList.list();
      const primaryCalendar = calendarList.data.items.find(cal => cal.primary);

      // 同期状態を保存
      const syncData = await CalendarSync.findOneAndUpdate(
        { clientId },
        {
          calendarId: primaryCalendar.id,
          syncEnabled: true,
          lastSyncTime: new Date(),
          syncStatus: 'active',
          auth: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiryDate: new Date(tokens.expiry_date)
          }
        },
        { upsert: true, new: true }
      );

      return {
        success: true,
        syncStatus: syncData.syncStatus,
        calendarId: syncData.calendarId
      };
    } catch (error) {
      console.error('Sync setup failed:', error);
      throw error;
    }
  }

  async getSyncStatus(clientId) {
    try {
      const syncData = await CalendarSync.findOne({ clientId });
      return syncData || { syncStatus: 'disconnected' };
    } catch (error) {
      console.error('Failed to get sync status:', error);
      throw error;
    }
  }

  async disconnectSync(clientId) {
    try {
      await CalendarSync.findOneAndUpdate(
        { clientId },
        {
          syncEnabled: false,
          syncStatus: 'disconnected',
          lastSyncTime: new Date(),
          error: null
        }
      );
    } catch (error) {
      console.error('Failed to disconnect sync:', error);
      throw error;
    }
  }

  // 既存の予約管理機能
  async getReservations(filters = {}) {
    try {
      const query = { ...filters };
      return await Reservation.find(query).sort({ datetime: -1 });
    } catch (error) {
      console.error('Error in getReservations:', error);
      throw error;
    }
  }

  async getReservationById(reservationId) {
    try {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      return reservation;
    } catch (error) {
      console.error('Error in getReservationById:', error);
      throw error;
    }
  }
  async getAvailableSlots(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // 設定から営業時間を取得
      const settings = await Settings.findOne({ type: 'calendar_settings' });
      if (!settings || !settings.calendarConfig) {
        throw new Error('Calendar settings not found');
      }

      // 曜日の取得（'monday', 'tuesday'等の形式で）
      const dayOfWeek = startOfDay.toLocaleLowerCase('en-US', { weekday: 'long' });
      const businessHours = settings.calendarConfig.businessHours[dayOfWeek];

      // その日が営業日でない場合は空配列を返す
      if (!businessHours.isOpen) {
        return [];
      }

      // 予約済み時間を取得
      const reservations = await Reservation.find({
        datetime: {
          $gte: startOfDay,
          $lt: endOfDay
        },
        status: { $in: ['confirmed', 'pending'] }
      });

      // Google Calendar連携が有効な場合は、そちらの予定も取得
      let googleEvents = [];
      const syncData = await CalendarSync.findOne({ 
        clientId: process.env.DEFAULT_CLIENT_ID,
        syncEnabled: true,
        syncStatus: 'active'
      });

      if (syncData) {
        try {
          this.oauth2Client.setCredentials({
            access_token: syncData.auth.accessToken,
            refresh_token: syncData.auth.refreshToken
          });

          const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
          const response = await calendar.events.list({
            calendarId: syncData.calendarId,
            timeMin: startOfDay.toISOString(),
            timeMax: endOfDay.toISOString(),
            singleEvents: true
          });

          googleEvents = response.data.items;
        } catch (error) {
          console.warn('Failed to fetch Google Calendar events:', error);
        }
      }

      // 予約済み時間のセット作成
      const bookedTimes = new Set([
        ...reservations.map(r => r.datetime.getHours()),
        ...googleEvents.map(event => 
          new Date(event.start.dateTime).getHours()
        )
      ]);

      // 営業時間内の利用可能な時間枠を生成
      const availableSlots = [];
      const [startHour] = businessHours.start.split(':').map(Number);
      const [endHour] = businessHours.end.split(':').map(Number);
      const interval = settings.calendarConfig.timeSlotInterval; // 30分または60分

      // interval に基づいて時間枠を生成
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const slotHour = hour;
          const isBooked = bookedTimes.has(slotHour);

          if (!isBooked) {
            availableSlots.push({
              time: timeString,
              available: true
            });
          }
        }
      }

      return availableSlots;
    } catch (error) {
      console.error('Error in getAvailableSlots:', error);
      throw error;
    }
  }

  async createReservation(reservationData) {
    try {
      const reservation = new Reservation(reservationData);
      await reservation.save();

      // Google Calendar連携が有効な場合は、イベントを作成
      const syncData = await CalendarSync.findOne({ 
        clientId: reservationData.clientId,
        syncEnabled: true,
        syncStatus: 'active'
      });

      if (syncData) {
        try {
          this.oauth2Client.setCredentials({
            access_token: syncData.auth.accessToken,
            refresh_token: syncData.auth.refreshToken
          });

          const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
          const event = {
            summary: `予約: ${reservation.customerInfo.name}様`,
            description: `
              会社名: ${reservation.customerInfo.company || '未設定'}
              電話番号: ${reservation.customerInfo.phone || '未設定'}
              メール: ${reservation.customerInfo.email}
              備考: ${reservation.customerInfo.message || 'なし'}
            `.trim(),
            start: {
              dateTime: reservation.datetime,
              timeZone: 'Asia/Tokyo',
            },
            end: {
              dateTime: new Date(new Date(reservation.datetime).getTime() + 60*60*1000),
              timeZone: 'Asia/Tokyo',
            },
          };

          const response = await calendar.events.insert({
            calendarId: syncData.calendarId,
            resource: event,
          });

          reservation.googleCalendarEventId = response.data.id;
          await reservation.save();
        } catch (error) {
          console.error('Failed to create Google Calendar event:', error);
        }
      }

      return reservation;
    } catch (error) {
      console.error('Error in createReservation:', error);
      throw error;
    }
  }

  async cancelReservation(reservationId) {
    try {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        throw new Error('Reservation not found');
      }

      reservation.status = 'cancelled';
      await reservation.save();

      // Google Calendarのイベントも削除
      if (reservation.googleCalendarEventId) {
        const syncData = await CalendarSync.findOne({ 
          clientId: reservation.clientId,
          syncEnabled: true
        });

        if (syncData) {
          try {
            this.oauth2Client.setCredentials({
              access_token: syncData.auth.accessToken,
              refresh_token: syncData.auth.refreshToken
            });

            const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
            await calendar.events.delete({
              calendarId: syncData.calendarId,
              eventId: reservation.googleCalendarEventId
            });
          } catch (error) {
            console.error('Failed to delete Google Calendar event:', error);
          }
        }
      }

      return reservation;
    } catch (error) {
      console.error('Error in cancelReservation:', error);
      throw error;
    }
  }



  async getTimeSlots(startDate, endDate) {
    try {
      console.log('Fetching time slots for:', { startDate, endDate });
  
      // 予約データの取得
      const reservations = await Reservation.find({
        datetime: {
          $gte: startDate,
          $lte: endDate
        },
        status: { $ne: 'cancelled' }
      }).sort({ datetime: 1 });
  
      console.log('Found reservations:', reservations.length);
  
      // BusinessHoursの設定を取得（defaultクライアント）
      const businessHours = await BusinessHours.findOne({ 
        clientId: 'default'
      });
  
      if (!businessHours) {
        throw new Error('Business hours settings not found');
      }
  
      const timeSlots = [];
      const currentDate = new Date(startDate);
  
      while (currentDate <= new Date(endDate)) {
        // 正しい曜日の取得
        const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const dayConfig = businessHours.businessHours[dayOfWeek];
  
        if (dayConfig && dayConfig.isOpen) {
          const [startHour] = dayConfig.start.split(':').map(Number);
          const [endHour] = dayConfig.end.split(':').map(Number);
  
          for (let hour = startHour; hour < endHour; hour++) {
            const slotDate = new Date(currentDate);
            slotDate.setHours(hour, 0, 0, 0);
  
            // その時間枠の予約を取得
            const slotReservations = reservations.filter(r => {
              const rDate = new Date(r.datetime);
              return rDate.getTime() === slotDate.getTime();
            });
  
            timeSlots.push({
              date: slotDate.toISOString().split('T')[0],
              startTime: `${hour.toString().padStart(2, '0')}:00`,
              endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
              capacity: dayConfig.slots,
              available: dayConfig.slots - slotReservations.length,
              reservations: slotReservations.length,
              blocked: false
            });
          }
        }
  
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      console.log('Generated time slots:', timeSlots.length);
      return timeSlots;
  
    } catch (error) {
      console.error('Error in getTimeSlots service:', error);
      throw new Error(`Failed to get time slots: ${error.message}`);
    }
  }
  

  async getReservationsByDate(date) {
    try {
      const targetDate = new Date(date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(targetDate.getDate() + 1);
  
      return await Reservation.find({
        datetime: {
          $gte: targetDate,
          $lt: nextDate
        }
      }).sort({ datetime: 1 });
    } catch (error) {
      console.error('Error in getReservationsByDate service:', error);
      throw error;
    }
  }
  
  
  
  async initializeBusinessHours() {
    try {
      // デフォルトの営業時間が存在するか確認
      const exists = await BusinessHours.findOne({ clientId: 'default' });
      
      if (!exists) {
        // デフォルトの営業時間を作成
        const defaultBusinessHours = new BusinessHours({
          clientId: 'default',
          businessHours: {
            monday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            tuesday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            wednesday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            thursday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            friday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            saturday: { isOpen: false, start: '12:00', end: '18:00', slots: 1 },
            sunday: { isOpen: false, start: '12:00', end: '18:00', slots: 1 }
          },
          timeSlotDuration: 60,
          reservationPeriod: {
            start: 1,
            end: 30
          }
        });
  
        await defaultBusinessHours.save();
        console.log('Default business hours initialized');
      }
    } catch (error) {
      console.error('Failed to initialize business hours:', error);
      throw error;
    }
  }
  
  
  async getBusinessHours(clientId = 'default') {
    try {
      let businessHours = await BusinessHours.findOne({ clientId });
      
      if (!businessHours) {
        // デフォルトの営業時間設定を作成
        businessHours = new BusinessHours({
          clientId,
          businessHours: {
            monday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            tuesday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            wednesday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            thursday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            friday: { isOpen: true, start: '12:00', end: '18:00', slots: 1 },
            saturday: { isOpen: false, start: '12:00', end: '18:00', slots: 1 },
            sunday: { isOpen: false, start: '12:00', end: '18:00', slots: 1 }
          },
          timeSlotDuration: 60,
          reservationPeriod: {
            start: 1,
            end: 30
          }
        });
  
        await businessHours.save();
      }
  
      return businessHours;
    } catch (error) {
      console.error('Error in getBusinessHours service:', error);
      throw new Error('Failed to get business hours');
    }
  }

  // 営業時間設定の更新
  async updateBusinessHours(clientId, settings) {
    try {
      const businessHours = await BusinessHours.findOneAndUpdate(
        { clientId },
        { $set: settings },
        { new: true, upsert: true }
      );

      // 関連する予約スケジュールのキャッシュをクリア
      // 必要に応じて実装

      return businessHours;
    } catch (error) {
      console.error('Error in updateBusinessHours service:', error);
      throw new Error('Failed to update business hours');
    }
  }

  async updateReservation(reservationId, updateData) {
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        reservationId,
        updateData,
        { new: true }
      );

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      // Google Calendarのイベントも更新
      if (reservation.googleCalendarEventId) {
        const syncData = await CalendarSync.findOne({ 
          clientId: reservation.clientId,
          syncEnabled: true
        });

        if (syncData) {
          try {
            this.oauth2Client.setCredentials({
              access_token: syncData.auth.accessToken,
              refresh_token: syncData.auth.refreshToken
            });

            const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
            const event = {
              summary: `予約: ${reservation.customerInfo.name}様`,
              description: `
                会社名: ${reservation.customerInfo.company || '未設定'}
                電話番号: ${reservation.customerInfo.phone || '未設定'}
                メール: ${reservation.customerInfo.email}
                備考: ${reservation.customerInfo.message || 'なし'}
              `.trim(),
              start: {
                dateTime: reservation.datetime,
                timeZone: 'Asia/Tokyo',
              },
              end: {
                dateTime: new Date(new Date(reservation.datetime).getTime() + 60*60*1000),
                timeZone: 'Asia/Tokyo',
              },
            };

            await calendar.events.update({
              calendarId: syncData.calendarId,
              eventId: reservation.googleCalendarEventId,
              resource: event,
            });
          } catch (error) {
            console.error('Failed to update Google Calendar event:', error);
          }
        }
      }

      return reservation;
    } catch (error) {
      console.error('Error in updateReservation:', error);
      throw error;
    }
  }
}

export default new CalendarService();