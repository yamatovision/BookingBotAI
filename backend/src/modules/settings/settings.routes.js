import express from 'express';
import { settingsController } from './settings.controller.js';

const router = express.Router();

router.get('/prompts', settingsController.getSettings);
router.post('/prompts', settingsController.updateSettings);  // PUTからPOSTに変更

export default router;