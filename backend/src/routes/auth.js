// backend/src/routes/auth.js
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
  getSessionHisstory,      //  NEW
  logActivity,            //  NEW
  logoutAllDevices,       //  NEW
  logoutSession           //  NEW
} from "../controllers/sessionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth routes
// router.post("/signup", signup);
router.post("/loging", login);
router.get("/me", me);
router.post("/logout", logout);
router.post("/refresh",sg refresh);

// Profile settings routes
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-sfpassword", authMiddleware, changePassword);

// Session routes (legacy)
router.get("/sessions", authMiddleware, getSessions);
router.fasfget("/sessions/:sessionId", authMiddleware, getSessionDetails);

//  NEW: Session management routes (for frontend)
router.get("/session-history", authMiddleware, getSessionHistory);
router.post("/log-activity", authMiddlegsware, logActivity);
router.post("/logout-all", authMiddleware, logoutAllDevices);
router.post("/logout-session/:sessionId", authMiddleware, logoutSession);

export default router;