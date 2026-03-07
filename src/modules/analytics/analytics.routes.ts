import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/streak', authenticate, AnalyticsController.getStreak as any);
router.get('/health', authenticate, AnalyticsController.getHealthScore as any);

export const analyticsRoutes = router;
