import express from 'express';
import { processMessage, detectIntentOnly } from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/message', authenticate, processMessage);
router.post('/intent', detectIntentOnly);

export default router;


