// backend/routes/voice.js
import express from 'express';
import {
  generateToken,
  makeCall,
  generateOutboundTwiML,
  handleIncoming,
  handleCallStatus,
  getCallHistory
} from '../controllers/voiceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Generate access token for Twilio Voice SDK (requires authentication)
router.get('/token', authMiddleware, generateToken);

// Initiate outbound call to patient (requires authentication)
router.post('/make-call', authMiddleware, makeCall);

// Get call history (requires authentication)
router.get('/history', authMiddleware, getCallHistory);

// TwiML endpoints (called by Twilio, no auth needed)
router.get('/twiml/outbound', generateOutboundTwiML);
router.post('/incoming', handleIncoming);
router.post('/status', handleCallStatus);

export default router;