import { Router } from 'express';
import { AdminController } from './reporting.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Enterprise reporting for ROI
router.get('/reports/performance', authenticate, authorize(['HR_MANAGER', 'ADMIN']), AdminController.getDepartmentReport as any);
router.get('/reports/roi', authenticate, authorize(['HR_MANAGER', 'ADMIN']), AdminController.getGlobalROI as any);

// Global overview for SuperAdmin
router.get('/stats', authenticate, authorize(['ADMIN']), AdminController.getGlobalStats as any);

// System notifications
router.post('/notify', authenticate, authorize(['ADMIN']), AdminController.sendSystemNotification as any);

export const adminRoutes = router;
