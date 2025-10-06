// ============================================
// backend/src/routes/settingsRoutes.js
// ============================================
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  updateProfile,
  changePassword,
  updateNotifications,
  updateAppearance,
  logoutAll,
  updateChatWidget,
  updateIntegrations,
  testIntegration
} from '../controllers/settingsController.js';
const router = express.Router();

// Profile settings
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

// Preferences
router.put('/notifications', authMiddleware, updateNotifications);
router.put('/appearance', authMiddleware, updateAppearance);

// Security
router.post('/logout-all', authMiddleware, logoutAll);

// Chat widget & Integrations
router.put('/chat-widget', authMiddleware, updateChatWidget);
router.put('/integrations', authMiddleware, updateIntegrations);
router.post('/test/:integration', authMiddleware, testIntegration);

export default router;