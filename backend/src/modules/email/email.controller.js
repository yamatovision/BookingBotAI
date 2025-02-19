// backend/src/modules/email/email.controller.js

import { google } from 'googleapis';
import { OAuthToken, EmailTemplate, EmailLog } from './email.model.js';
import emailService from './email.service.js';
import emailSchedulerService from './email-scheduler.service.js';

export const emailController = {
  // メールテンプレート一覧の取得
  async getTemplates(req, res) {
    try {
      const templates = await emailService.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error in getTemplates:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  async getLogsByReservationId(req, res) {
    try {
      const { reservationId } = req.query;
      if (!reservationId) {
        return res.status(400).json({
          error: 'Reservation ID is required'
        });
      }

      const logs = await emailService.getLogs({ reservationId });
      res.json(logs);
    } catch (error) {
      console.error('Error in getLogsByReservationId:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },



  async handleOAuth2Callback(req, res) {
    try {
      const { code } = req.query;
      
      if (!code) {
        throw new Error('Authorization code is missing');
      }
  
      // デバッグログ追加
      console.log('OAuth2 Callback Debug:');
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Redirect URI:', process.env.NODE_ENV === 'production' 
        ? process.env.PROD_REDIRECT_URI 
        : process.env.DEV_REDIRECT_URI);
  
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.NODE_ENV === 'production' 
          ? process.env.PROD_REDIRECT_URI 
          : process.env.DEV_REDIRECT_URI
      );
  
      // スコープを指定してトークンを取得
      const { tokens } = await oauth2Client.getToken({
        code,
        scope: [
          'https://www.googleapis.com/auth/gmail.send',
          'https://mail.google.com/'
        ]
      });
  
      console.log('Full token response:', JSON.stringify(tokens, null, 2));
  
      // トークンの有効期限を計算
      let expiryDate = null;
      if (tokens.expiry_date) {
        expiryDate = new Date(tokens.expiry_date);
      } else if (tokens.expires_in) {
        expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expires_in);
      }
  
      // デバッグログを追加
      console.log('Token processing:', {
        accessToken: tokens.access_token ? 'exists' : 'missing',
        refreshToken: tokens.refresh_token ? 'exists' : 'missing',
        expiryDate: expiryDate ? expiryDate.toISOString() : 'not set',
        expiresIn: tokens.expires_in,
        expiryDateRaw: tokens.expiry_date
      });
  
      // データベースにトークンを保存
      const tokenData = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        lastUpdated: new Date()
      };
  
      if (expiryDate && !isNaN(expiryDate.getTime())) {
        tokenData.expiryDate = expiryDate;
      }
  
      await OAuthToken.findOneAndUpdate(
        {},  // 条件なし（1つのみ保存する想定）
        tokenData,
        { upsert: true, new: true }
      );
  
      // フロントエンドのURLを環境に応じて選択
      const frontendUrl = process.env.NODE_ENV === 'production'
        ? process.env.PROD_FRONTEND_URL
        : process.env.DEV_FRONTEND_URL;
  
      // 成功時のリダイレクト
      res.redirect(`${frontendUrl}${process.env.FRONTEND_CALLBACK_PATH}?success=true`);
  
    } catch (error) {
      console.error('OAuth callback error:', error);
      console.error('Error details:', error.stack);
      
      const frontendUrl = process.env.NODE_ENV === 'production'
        ? process.env.PROD_FRONTEND_URL
        : process.env.DEV_FRONTEND_URL;
      
      res.redirect(`${frontendUrl}${process.env.FRONTEND_CALLBACK_PATH}?error=${encodeURIComponent(error.message)}`);
    }
  },

  async saveTemplate(req, res) {
    try {
      const templateData = req.body;
      
      // バリデーションを強化
      if (!templateData.name || !templateData.type || !templateData.subject || !templateData.body) {
        return res.status(400).json({
          error: 'Required fields are missing'
        });
      }
  
      // リマインダー/フォローアップの場合、timing のバリデーション
      if (templateData.type !== 'confirmation') {
        if (!templateData.timing || !templateData.timing.value || !templateData.timing.unit) {
          return res.status(400).json({
            error: 'Timing settings are required for reminder and followup templates'
          });
        }
      }
  
      const template = await emailService.saveTemplate(templateData);
      res.json(template);
    } catch (error) {
      console.error('Error in saveTemplate:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },




  // テンプレートの削除
  async deleteTemplate(req, res) {
    try {
      const { id } = req.params;
      await emailService.deleteTemplate(id);
      res.json({ message: 'Template deleted successfully' });
    } catch (error) {
      console.error('Error in deleteTemplate:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  // メール送信ログの取得
  async getLogs(req, res) {
    try {
      const { startDate, endDate, status, templateId } = req.query;
      const filters = {};

      // フィルター条件の設定
      if (startDate || endDate) {
        filters.sentAt = {};
        if (startDate) filters.sentAt.$gte = new Date(startDate);
        if (endDate) filters.sentAt.$lte = new Date(endDate);
      }
      if (status) filters.status = status;
      if (templateId) filters.templateId = templateId;

      const logs = await emailService.getLogs(filters);
      res.json(logs);
    } catch (error) {
      console.error('Error in getLogs:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  // テストメールの送信
  async sendTestEmail(req, res) {
    try {
      const { templateId, testEmail } = req.body;
      
      if (!templateId || !testEmail) {
        return res.status(400).json({
          error: 'Template ID and test email are required'
        });
      }

      await emailService.sendTestEmail(templateId, testEmail);
      res.json({ message: 'Test email sent successfully' });
    } catch (error) {
      console.error('Error in sendTestEmail:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  async createSchedule(req, res) {
    try {
      const { templateId, reservationId, reservationTime } = req.body;

      if (!templateId || !reservationId || !reservationTime) {
        return res.status(400).json({
          error: 'Required parameters missing'
        });
      }

      const schedule = await emailSchedulerService.scheduleEmail(
        templateId,
        reservationId,
        reservationTime
      );

      res.json(schedule);
    } catch (error) {
      console.error('Error in createSchedule:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  // スケジュール状態の取得
  async getScheduleStatus(req, res) {
    try {
      const { templateId, reservationId } = req.query;

      if (!templateId || !reservationId) {
        return res.status(400).json({
          error: 'Template ID and Reservation ID are required'
        });
      }

      const status = await emailSchedulerService.getScheduleStatus(
        templateId,
        reservationId
      );

      res.json(status);
    } catch (error) {
      console.error('Error in getScheduleStatus:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  // スケジュール一覧の取得
  async getSchedules(req, res) {
    try {
      const { status, startDate, endDate } = req.query;
      const query = {};

      if (status) {
        query.status = status;
      }

      if (startDate || endDate) {
        query.scheduledTime = {};
        if (startDate) {
          query.scheduledTime.$gte = new Date(startDate);
        }
        if (endDate) {
          query.scheduledTime.$lte = new Date(endDate);
        }
      }

      const schedules = await EmailSchedule.find(query)
        .populate('templateId', 'name type')
        .populate('reservationId', 'datetime customerInfo')
        .sort({ scheduledTime: 1 });

      res.json(schedules);
    } catch (error) {
      console.error('Error in getSchedules:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  // 手動でのスケジュールチェック実行
  async triggerScheduleCheck(req, res) {
    try {
      await emailSchedulerService.checkAndSendScheduledEmails();
      res.json({ message: 'Schedule check triggered successfully' });
    } catch (error) {
      console.error('Error in triggerScheduleCheck:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  // 失敗したメールの再試行
  async retryFailedEmails(req, res) {
    try {
      await emailSchedulerService.retryFailedEmails();
      res.json({ message: 'Retry process completed' });
    } catch (error) {
      console.error('Error in retryFailedEmails:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  },

  // リマインダーチェックの手動実行
  async triggerReminderCheck(req, res) {
    try {
      await emailService.checkAndSendReminders();
      res.json({ message: 'Reminder check triggered successfully' });
    } catch (error) {
      console.error('Error in triggerReminderCheck:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
};