import express from 'express';
import { processMessage } from './claude.controller.js';

const router = express.Router();

router.post('/message', processMessage);

export default router;
