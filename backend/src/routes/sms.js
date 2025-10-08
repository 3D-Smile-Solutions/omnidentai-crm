// backend/routes/sms.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  sendSMS,
  handleIncomingSMS,
  handleSMSStatus,
  getSMSHistory
} from '../controllers/smsController.js';

const router = express.Router();

// ==========================================
// AUTHENTICATED ROUTES (require dentist login)
// ==========================================

// POST /api/sms/send - Send SMS to patient
router.post('/send', authMiddleware, sendSMS);

// GET /api/sms/history/:patientId - Get SMS history with patient
router.get('/history/:patientId', authMiddleware, getSMSHistory);

// ==========================================
// WEBHOOK ROUTES (called by Twilio - NO AUTH)
// ==========================================

// POST /api/sms/webhook - Receive incoming SMS from patients
router.post('/webhook', handleIncomingSMS);

// POST /api/sms/status - Receive SMS delivery status updates
router.post('/status', handleSMSStatus);

export default router;