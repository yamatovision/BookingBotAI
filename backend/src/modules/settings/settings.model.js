import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'system_prompt', 
      'reference_content', 
      'lp_content',
      'display_settings'  // 新規追加
    ]
  },
  content: {
    type: String,
    required: function() {
      return ['system_prompt', 'reference_content', 'lp_content'].includes(this.type);
    }
  },
  // 表示設定用のフィールドを追加
  displayConfig: {
    type: {
      theme: {
        primary: {
          type: String,
          default: '#FF6B2B'
        }
      },
      displayMode: {
        type: String,
        enum: ['fixed', 'modal'],
        default: 'fixed'
      }
    },
    required: function() {
      return this.type === 'display_settings';
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Settings = mongoose.model('Settings', SettingsSchema);