// backend/routes/metrics.js
import express from 'express';
import { getOverviewMetrics } from '../controllers/metricsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/metrics/overview
 * @desc    Get overview metrics for dashboard
 * @access  Private (requires authentication)
 */
router.get('/overview', authMiddleware, getOverviewMetrics);

export default router;