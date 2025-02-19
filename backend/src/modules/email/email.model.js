// backend/src/modules/email/email.model.js

import mongoose from 'mongoose';

const EmailTemplateSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['confirmation', 'reminder', 'followup'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  variables: {
    type: [{
      key: String,
      displayName: String,
      type: {
        type: String,
        enum: ['text', 'url', 'datetime', 'number']
      },
      required: Boolean,
      defaultValue: String
    }],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  timing: {
    value: {
      type: Number,
      required: function() {
        return this.type !== 'confirmation';
      }
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      required: function() {
        return this.type !== 'confirmation';
      }
    },
    scheduledTime: Date
  },
  staffInfo: {
    name: String,
    email: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const OAuthTokenSchema = new mongoose.Schema({
  accessToken: String,
  refreshToken: String,
  expiryDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { collection: 'oauth_tokens' });

const EmailLogSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailTemplate',
    required: true
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: false
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  error: {
    type: String
  }
});


const EmailScheduleSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailTemplate',
    required: true
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true,
    index: true  // パフォーマンス向上のためのインデックス
  },
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'failed'],
    default: 'scheduled'
  },
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// インデックスの設定
EmailTemplateSchema.index({ clientId: 1, type: 1 });
EmailTemplateSchema.index({ clientId: 1, name: 1 }, { unique: true });
EmailScheduleSchema.index({ status: 1, scheduledTime: 1 });

// モデルの作成とエクスポート
export const EmailTemplate = mongoose.model('EmailTemplate', EmailTemplateSchema);
export const EmailSchedule = mongoose.model('EmailSchedule', EmailScheduleSchema);

export const OAuthToken = mongoose.model('OAuthToken', OAuthTokenSchema);
export const EmailLog = mongoose.model('EmailLog', EmailLogSchema);

