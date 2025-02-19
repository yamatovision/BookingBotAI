import cron from 'node-cron';
import emailSchedulerService from './modules/email/email-scheduler.service.js';
import mongoose from 'mongoose';
import { config } from './config/env.js';

// データベース接続
mongoose.connect(config.database.url, config.database.options)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// エラーハンドリング
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

// 毎分実行するスケジュール
cron.schedule('* * * * *', async () => {
  console.log('Running email schedule check:', new Date().toISOString());
  try {
    await emailSchedulerService.checkAndSendScheduledEmails();
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
});

// 失敗したメールの再試行（1時間ごと）
cron.schedule('0 * * * *', async () => {
  console.log('Running failed emails retry:', new Date().toISOString());
  try {
    await emailSchedulerService.retryFailedEmails();
  } catch (error) {
    console.error('Error in retry task:', error);
  }
});

console.log('Scheduler started');
