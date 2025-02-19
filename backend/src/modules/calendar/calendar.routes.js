import express from 'express';
import { calendarController } from './calendar.controller.js';

const router = express.Router();

// 既存の予約管理ルート
router.get('/reservations', calendarController.getReservations);
router.get('/slots', calendarController.getAvailableSlots);
router.post('/reservations', calendarController.createReservation);

router.get('/reservations/by-date', calendarController.getReservationsByDate);
router.put('/reservations/:id/cancel', calendarController.cancelReservation);
router.put('/reservations/:id', calendarController.updateReservation);
router.get('/reservations/:id', calendarController.getReservationById);

router.get('/time-slots', calendarController.getTimeSlots);  // 追加
router.get('/business-hours', calendarController.getBusinessHours);
router.put('/business-hours', calendarController.updateBusinessHours);



// Google Calendar同期管理用のルートを追加
router.post('/sync/connect', calendarController.initiateSync);
router.get('/sync/status', calendarController.getSyncStatus);
router.post('/sync/disconnect', calendarController.disconnectSync);
router.get('/sync/callback', calendarController.handleOAuthCallback); // OAuth2コールバック用

export default router;