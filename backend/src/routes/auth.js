// backend/src/routes/authRoutes.js
import express from "express";
import { 
  signup, 
  login, 
  me, 
  logout, 
  refresh,
  updateProfile,    // ADD THIS
  changePassword    // ADD THIS
} from "../controllers/authController.js";
import { getSessions, getSessionDetails } from "../controllers/sessionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";  // ADD THIS IMPORT

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", me);
router.post("/logout", logout);
router.post("/refresh", refresh);

// NEW: Settings routes (protected with authMiddleware)
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
// session routes
router.get("/sessions", authMiddleware, getSessions);
router.get("/sessions/:sessionId", authMiddleware, getSessionDetails);
export default router;