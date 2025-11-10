// backend/routes/usageRoutes.js
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getUsageStats,
  getDailyUsage,
  getCostBreakdown,
  debugUsageCategories, // ✅ Add debug endpoint
} from "../controllers/twilioUsageController.js";

const router = express.Router();

// ✅ Protect all routes with authentication
router.use(authMiddleware);

// ✅ Main unified endpoint (this is what frontend uses now)
router.get("/stats", getUsageStats);

// ✅ Debug endpoint (useful for troubleshooting)
router.get("/debug", debugUsageCategories);

// ⚠️ Deprecated endpoints (kept for backward compatibility)
// These now redirect to getUsageStats internally
router.get("/daily", getDailyUsage);
router.get("/costs", getCostBreakdown);

export default router;
