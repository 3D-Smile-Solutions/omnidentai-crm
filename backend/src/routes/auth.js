// backend/src/routes/authRoutes.js
import express from "express";
import { 
  // signup, 
  login, 
  me, 
  logout, 
  refresh,
  updateProfile,
  changePassword
} from "../controllers/authController.js";
import { 
  getSessions, 
  getSessionDetails,
  getSessionHistory,      // ✅ NEW
  logActivity,            // ✅ NEW
  logoutAllDevices,       // ✅ NEW
  logoutSession           // ✅ NEW
} from "../controllers/sessionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth routes
// router.post("/signup", signup);
router.post("/login", login);
router.get("/me", me);
router.post("/logout", logout);
router.post("/refresh", refresh);

// Profile settings routes
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

// Session routes (legacy)
router.get("/sessions", authMiddleware, getSessions);
router.get("/sessions/:sessionId", authMiddleware, getSessionDetails);

// ✅ NEW: Session management routes (for frontend)
router.get("/session-history", authMiddleware, getSessionHistory);
router.post("/log-activity", authMiddleware, logActivity);
router.post("/logout-all", authMiddleware, logoutAllDevices);
router.post("/logout-session/:sessionId", authMiddleware, logoutSession);

export default router;