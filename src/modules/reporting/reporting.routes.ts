import { Router } from 'express';
import { AdminController } from './reporting.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Enterprise reporting for ROI
/**
 * @swagger
 * /admin/reports/performance:
 *   get:
 *     summary: Get performance report for a department
 *     tags: [Admin]
 */
router.get('/reports/performance', authenticate, authorize(['HR_MANAGER', 'ADMIN']), AdminController.getDepartmentReport as any);

/**
 * @swagger
 * /admin/reports/roi:
 *   get:
 *     summary: Get global ROI report
 *     tags: [Admin]
 */
router.get('/reports/roi', authenticate, authorize(['HR_MANAGER', 'ADMIN']), AdminController.getGlobalROI as any);

// Global overview for SuperAdmin
/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get global system statistics
 *     tags: [Admin]
 */
router.get('/stats', authenticate, authorize(['ADMIN']), AdminController.getGlobalStats as any);

// System notifications
/**
 * @swagger
 * /admin/notify:
 *   post:
 *     summary: Send system-wide notification
 *     tags: [Admin]
 */
router.post('/notify', authenticate, authorize(['ADMIN']), AdminController.sendSystemNotification as any);

export const adminRoutes = router;
