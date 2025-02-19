import mongoose from 'mongoose';

// 既存の予約スキーマ
const ReservationSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    index: true
  },
  datetime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    company: String,
    message: String
  },
  googleCalendarEventId: {
    type: String,
    sparse: true
  },
  remindersSent: [{
    type: {
      type: String,
      enum: ['confirmation', 'reminder', 'followup']
    },
    sentAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// カレンダー同期状態のスキーマを追加
const CalendarSyncSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  calendarId: {
    type: String,
    required: true
  },
  syncEnabled: {
    type: Boolean,
    default: true
  },
  lastSyncTime: {
    type: Date,
    default: null
  },
  syncStatus: {
    type: String,
    enum: ['active', 'error', 'disconnected'],
    default: 'disconnected'
  },
  auth: {
    accessToken: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    },
    tokenExpiryDate: {
      type: Date,
      required: true
    }
  },
  error: {
    message: String,
    timestamp: Date
  }
}, {
  timestamps: true
});

const BusinessHoursSchema = new mongoose.Schema({
  businessHours: {
    monday: {
      isOpen: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      slots: { type: Number, default: 3 }
    },
    tuesday: {
      isOpen: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      slots: { type: Number, default: 3 }
    },
    wednesday: {
      isOpen: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      slots: { type: Number, default: 3 }
    },
    thursday: {
      isOpen: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      slots: { type: Number, default: 3 }
    },
    friday: {
      isOpen: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      slots: { type: Number, default: 3 }
    },
    saturday: {
      isOpen: { type: Boolean, default: false },
      start: { type: String, default: '10:00' },
      end: { type: String, default: '15:00' },
      slots: { type: Number, default: 3 }
    },
    sunday: {
      isOpen: { type: Boolean, default: false },
      start: { type: String, default: '10:00' },
      end: { type: String, default: '15:00' },
      slots: { type: Number, default: 3 }
    }
  },
  timeSlotDuration: { type: Number, default: 60 },
  reservationPeriod: {
    start: { type: Number, default: 1 },
    end: { type: Number, default: 30 }
  },
  exceptionalDays: [{
    date: { type: Date },
    isHoliday: { type: Boolean },
    note: { type: String }
  }],
  clientId: {
    type: String,
    required: true,
    index: true
  }
});

// インデックスの設定
ReservationSchema.index({ clientId: 1, datetime: 1 });
CalendarSyncSchema.index({ clientId: 1 }, { unique: true });

// モデルのエクスポート
export const Reservation = mongoose.model('Reservation', ReservationSchema);
export const CalendarSync = mongoose.model('CalendarSync', CalendarSyncSchema);
export const BusinessHours = mongoose.model('BusinessHours', BusinessHoursSchema);

