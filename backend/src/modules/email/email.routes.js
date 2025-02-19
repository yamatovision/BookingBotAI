// backend/src/modules/email/email.routes.js

import express from 'express';
import { emailController } from './email.controller.js';

const router = express.Router();

// 既存のルート
router.get('/templates', emailController.getTemplates);
router.post('/templates', emailController.saveTemplate);
router.put('/templates/:id', emailController.saveTemplate);
router.delete('/templates/:id', emailController.deleteTemplate);
router.get('/logs/reservation', emailController.getLogsByReservationId);
router.get('/oauth2callback', emailController.handleOAuth2Callback);
router.get('/logs', emailController.getLogs);
router.post('/test', emailController.sendTestEmail);

// 新規追加するルート
// スケジュール管理
router.post('/schedules', emailController.createSchedule);
router.get('/schedules', emailController.getSchedules);
router.get('/schedules/status', emailController.getScheduleStatus);

// スケジュール実行関連
router.post('/schedules/check', emailController.triggerScheduleCheck);
router.post('/schedules/retry', emailController.retryFailedEmails);

export default router;