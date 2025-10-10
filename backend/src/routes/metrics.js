// backend/routes/metrics.js
import express from 'express';
import { getOverviewMetrics, getPatientMapData } from '../controllers/metricsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/metrics/overview
 * @desc    Get overview metrics for dashboard
 * @access  Private (requires authentication)
 */
router.get('/overview', authMiddleware, getOverviewMetrics);
/**
 * @route   GET /api/metrics/patient-map
 * @desc    Get patient distribution map data
 * @access  Private (requires authentication)
 */
router.get('/patient-map', authMiddleware, getPatientMapData);

export default router;