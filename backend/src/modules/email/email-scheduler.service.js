// backend/src/modules/email/email-scheduler.service.js

import { EmailTemplate, EmailSchedule } from './email.model.js';
import emailService from './email.service.js';

class EmailSchedulerService {
  // 送信時刻の計算
  calculateScheduledTime(reservationTime, timing) {
    const { value, unit } = timing;
    const reservationDate = new Date(reservationTime);
    
    switch (unit) {
      case 'minutes':
        return new Date(reservationDate.getTime() - value * 60000);
      case 'hours':
        return new Date(reservationDate.getTime() - value * 3600000);
      case 'days':
        return new Date(reservationDate.getTime() - value * 86400000);
      default:
        throw new Error('Invalid timing unit');
    }
  }

  // メールのスケジュール登録
  async scheduleEmail(templateId, reservationId, reservationTime) {
    try {
      const template = await EmailTemplate.findById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // confirmation typeの場合は即時送信
      if (template.type === 'confirmation') {
        return await emailService.sendEmail(templateId, reservationId);
      }

      const scheduledTime = this.calculateScheduledTime(
        reservationTime,
        template.timing
      );

      // 現在時刻より前の場合は即時送信
      if (scheduledTime <= new Date()) {
        return await emailService.sendEmail(templateId, reservationId);
      }

      // スケジュールの作成
      const schedule = new EmailSchedule({
        templateId,
        reservationId,
        scheduledTime,
        status: 'scheduled'
      });

      await schedule.save();
      
      console.log(`Email scheduled for ${scheduledTime.toISOString()}`);
      return schedule;
    } catch (error) {
      console.error('Error scheduling email:', error);
      throw error;
    }
  }

  // スケジュール済みメールの送信チェック
  async checkAndSendScheduledEmails() {
    try {
      const now = new Date();
      const schedulesToSend = await EmailSchedule
        .find({
          scheduledTime: { $lte: now },
          status: 'scheduled'
        })
        .populate('templateId')
        .populate('reservationId');

      console.log(`Found ${schedulesToSend.length} emails to send`);

      for (const schedule of schedulesToSend) {
        try {
          await emailService.sendEmail(
            schedule.templateId._id,
            schedule.reservationId._id
          );

          schedule.status = 'sent';
          schedule.updatedAt = new Date();
          await schedule.save();

          console.log(`Successfully sent scheduled email ${schedule._id}`);
        } catch (error) {
          console.error(`Failed to send scheduled email ${schedule._id}:`, error);
          
          schedule.status = 'failed';
          schedule.error = error.message;
          schedule.updatedAt = new Date();
          await schedule.save();

          // 3回まで再試行するロジックを追加可能
        }
      }
    } catch (error) {
      console.error('Error checking scheduled emails:', error);
      throw error;
    }
  }

  // 失敗したメールの再試行
  async retryFailedEmails() {
    try {
      const failedSchedules = await EmailSchedule
        .find({ status: 'failed' })
        .populate('templateId')
        .populate('reservationId');

      for (const schedule of failedSchedules) {
        try {
          await emailService.sendEmail(
            schedule.templateId._id,
            schedule.reservationId._id
          );

          schedule.status = 'sent';
          schedule.error = null;
          schedule.updatedAt = new Date();
          await schedule.save();

          console.log(`Successfully retried failed email ${schedule._id}`);
        } catch (error) {
          console.error(`Retry failed for email ${schedule._id}:`, error);
          schedule.error = error.message;
          schedule.updatedAt = new Date();
          await schedule.save();
        }
      }
    } catch (error) {
      console.error('Error retrying failed emails:', error);
      throw error;
    }
  }

  // スケジュール状態の取得
  async getScheduleStatus(templateId, reservationId) {
    return await EmailSchedule.findOne({
      templateId,
      reservationId
    }).sort({ createdAt: -1 });
  }
}

export default new EmailSchedulerService();