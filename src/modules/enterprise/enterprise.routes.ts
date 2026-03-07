import { Router } from 'express';
import { EnterpriseController } from './enterprise.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Learning Paths (HR Manager / Admin)
router.post('/learning-path', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.createLearningPath as any);
router.post('/learning-path/:id/course', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.addCourseToPath as any);
router.post('/assign/user', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.assignToUser as any);
router.post('/assign/group', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.assignToGroup as any);

// Invitations & Seat Management
router.post('/invite', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.inviteUser as any);
router.post('/invite/accept', authenticate, EnterpriseController.acceptInvite as any);

// GDPR & Privacy
router.get('/compliance/export', authenticate, EnterpriseController.exportGDPR as any);
router.delete('/compliance/account', authenticate, EnterpriseController.deleteAccount as any);

export const enterpriseRoutes = router;
