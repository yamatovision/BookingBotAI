import mongoose from 'mongoose';

const ChatHistorySchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    index: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    lpContent: String,
    systemPrompt: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const ChatHistory = mongoose.model('ChatHistory', ChatHistorySchema);
