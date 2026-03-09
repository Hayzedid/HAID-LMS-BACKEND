import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /analytics/streak:
 *   get:
 *     summary: Get student current learning streak
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Current streak details
 */
router.get('/streak', authenticate, AnalyticsController.getStreak as any);

/**
 * @swagger
 * /analytics/health:
 *   get:
 *     summary: Get composite learner health score
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Health score (0-100)
 */
router.get('/health', authenticate, AnalyticsController.getHealthScore as any);

export const analyticsRoutes = router;
