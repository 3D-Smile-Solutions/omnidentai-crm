// backend/src/routes/conversationControl.js

import express from "express";
import {
  getControlStatus,
  pauseBotForConversation,
  resumeBotForConversation,
  checkShouldBotRespond
} from "../controllers/conversationControlController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // ✅ FIXED PATH

const router = express.Router();

// Public endpoint - no auth required (chat widget calls this)
router.get("/should-respond/:contactId", checkShouldBotRespond);

// Protected endpoints - require authentication
router.get("/:contactId", authMiddleware, getControlStatus);
router.post("/pause", authMiddleware, pauseBotForConversation);
router.post("/resume", authMiddleware, resumeBotForConversation);

export default router; // ✅ ADD THIS LINE