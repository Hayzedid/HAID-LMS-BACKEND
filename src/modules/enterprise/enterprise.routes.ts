import { Router } from 'express';
import { EnterpriseController } from './enterprise.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Learning Paths (HR Manager / Admin)
/**
 * @swagger
 * /enterprise/learning-path:
 *   post:
 *     summary: Create a new learning path
 *     tags: [Enterprise]
 */
router.post('/learning-path', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.createLearningPath as any);

/**
 * @swagger
 * /enterprise/learning-path/{id}/course:
 *   post:
 *     summary: Add a course to a learning path
 *     tags: [Enterprise]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.post('/learning-path/:id/course', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.addCourseToPath as any);

/**
 * @swagger
 * /enterprise/assign/user:
 *   post:
 *     summary: Bulk assign learning path to a user
 *     tags: [Enterprise]
 */
router.post('/assign/user', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.assignToUser as any);

/**
 * @swagger
 * /enterprise/assign/group:
 *   post:
 *     summary: Bulk assign learning path to a group
 *     tags: [Enterprise]
 */
router.post('/assign/group', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.assignToGroup as any);

// Invitations & Seat Management
/**
 * @swagger
 * /enterprise/invite:
 *   post:
 *     summary: Invite a user with seat tracking
 *     tags: [Enterprise]
 */
router.post('/invite', authenticate, authorize(['HR_MANAGER', 'ADMIN']), EnterpriseController.inviteUser as any);

/**
 * @swagger
 * /enterprise/invite/accept:
 *   post:
 *     summary: Accept a seat invitation
 *     tags: [Enterprise]
 */
router.post('/invite/accept', authenticate, EnterpriseController.acceptInvite as any);

// GDPR & Privacy
/**
 * @swagger
 * /enterprise/compliance/export:
 *   get:
 *     summary: Export all personal data (GDPR)
 *     tags: [Enterprise]
 */
router.get('/compliance/export', authenticate, EnterpriseController.exportGDPR as any);

/**
 * @swagger
 * /enterprise/compliance/account:
 *   delete:
 *     summary: Request account deletion (GDPR)
 *     tags: [Enterprise]
 */
router.delete('/compliance/account', authenticate, EnterpriseController.deleteAccount as any);

export const enterpriseRoutes = router;
