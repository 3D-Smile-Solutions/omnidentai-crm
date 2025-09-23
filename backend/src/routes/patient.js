// patient.js
import express from "express";
import { getPatients } from "../controllers/patientController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only logged-in dentists can fetch their patients
router.get("/", authMiddleware, getPatients);

export default router;
