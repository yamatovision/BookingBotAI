import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { EmailTemplate, EmailLog, OAuthToken } from './email.model.js';
import { Reservation } from '../calendar/calendar.model.js';

class EmailService {
  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NODE_ENV === 'production' 
        ? process.env.PROD_REDIRECT_URI 
        : process.env.DEV_REDIRECT_URI
    );
  }

  async createTransporter() {
    try {
      // データベースからトークン情報を取得
      const tokenDoc = await OAuthToken.findOne();
      
      if (!tokenDoc) {
        throw new Error('No OAuth tokens found in database');
      }

      // OAuth2クライアントにトークンをセット
      this.oauth2Client.setCredentials({
        access_token: tokenDoc.accessToken,
        refresh_token: tokenDoc.refreshToken,
        expiry_date: tokenDoc.expiryDate
      });

      // トランスポーターの作成
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.SMTP_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: tokenDoc.refreshToken,
          accessToken: tokenDoc.accessToken
        }
      });

      // トランスポーターの検証
      await transporter.verify();
      console.log('Transporter verified successfully');

      return transporter;
    } catch (error) {
      console.error('Error creating transporter:', error);
      throw error;
    }
  }

  // テンプレート変数置換メソッド
  replaceTemplateVariables(content, reservation, clientSettings = {}) {
    if (!content) return '';
    
    let processedContent = content;
    
    // 基本変数の定義
    const baseVariables = {
      '{{name}}': reservation.customerInfo.name,
      '{{email}}': reservation.customerInfo.email,
      '{{company}}': reservation.customerInfo.company || '',
      '{{date}}': new Date(reservation.datetime).toLocaleDateString('ja-JP'),
      '{{time}}': new Date(reservation.datetime).toLocaleTimeString('ja-JP'),
      '{{phone}}': reservation.customerInfo.phone || '',
      '{{message}}': reservation.customerInfo.message || ''
    };

    // 基本変数の置換
    Object.entries(baseVariables).forEach(([key, value]) => {
      processedContent = processedContent.replace(new RegExp(key, 'g'), value || '');
    });

    return processedContent;
  }

  async sendEmail(templateId, reservationId) {
    try {
      const template = await EmailTemplate.findById(templateId);
      const reservation = await Reservation.findById(reservationId);

      if (!template || !reservation) {
        throw new Error('Template or Reservation not found');
      }

      const subject = this.replaceTemplateVariables(template.subject, reservation);
      const body = this.replaceTemplateVariables(template.body, reservation);

      const transporter = await this.createTransporter();

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: reservation.customerInfo.email,
        subject: subject,
        html: body
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);

      await EmailLog.create({
        templateId,
        reservationId,
        status: 'success'
      });

      return info;

    } catch (error) {
      console.error('Email sending error:', error);
      
      await EmailLog.create({
        templateId,
        reservationId,
        status: 'failed',
        error: error.message
      });

      throw error;
    }
  }

  async sendTestEmail(templateId, testEmail) {
    try {
      const template = await EmailTemplate.findById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const dummyReservation = {
        customerInfo: {
          name: 'テストユーザー',
          email: testEmail,
          company: 'テスト株式会社',
          phone: '03-1234-5678',
          message: 'これはテストメールです。'
        },
        datetime: new Date()
      };

      const subject = this.replaceTemplateVariables(template.subject, dummyReservation);
      const body = this.replaceTemplateVariables(template.body, dummyReservation);

      const transporter = await this.createTransporter();

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: testEmail,
        subject: subject,
        html: body
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Test message sent: %s', info.messageId);

      await EmailLog.create({
        templateId: template._id,
        status: 'success',
        sentAt: new Date()
      });

      return info;

    } catch (error) {
      console.error('Test email sending error:', error);
      
      await EmailLog.create({
        templateId,
        status: 'failed',
        error: error.message
      });

      throw error;
    }
  }

  // テンプレート管理メソッド
  async getTemplates() {
    return await EmailTemplate.find().sort({ type: 1, name: 1 });
  }
// email.service.js
async saveTemplate(templateData) {
  // timing データを新しい形式で整形
  const cleanedData = {
    ...templateData,
    timing: {
      value: templateData.timing.value,
      unit: templateData.timing.unit,
      scheduledTime: null  // 後でスケジューラーで設定される
    }
  };

  if (templateData._id) {
    return await EmailTemplate.findByIdAndUpdate(
      templateData._id,
      { ...cleanedData, updatedAt: new Date() },
      { new: true }
    );
  }
  return await EmailTemplate.create(cleanedData);
}
  async deleteTemplate(id) {
    return await EmailTemplate.findByIdAndDelete(id);
  }

  async getLogs(filters = {}) {
    return await EmailLog.find(filters)
      .populate('templateId', 'name type')
      .populate('reservationId', 'datetime customerInfo')
      .sort({ sentAt: -1 });
  }
}

export default new EmailService();