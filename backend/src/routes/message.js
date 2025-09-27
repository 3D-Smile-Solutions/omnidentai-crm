import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getMessagesWithPatient,
  getAllMessages,
  sendMessage,
  getUnreadMessageCounts
} from "../controllers/messageController.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /messages - Get all messages for dentist (overview)
router.get("/", getAllMessages);

// GET /messages/unread-counts - Get unread message counts
router.get("/unread-counts", getUnreadMessageCounts);

// GET /messages/:patientId - Get messages with specific patient
router.get("/:patientId", getMessagesWithPatient);

// POST /messages - Send a new message
router.post("/", sendMessage);

export default router;