import { Router } from 'express';
import { AssessmentController } from './assessment.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Instructor/Admin only
router.post('/exam', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), AssessmentController.createExam as any);
router.get('/report/:sessionId', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), AssessmentController.getReport as any);

// Student/All Authenticated
router.post('/session', authenticate, AssessmentController.startSession as any);
router.patch('/session/:sessionId', authenticate, AssessmentController.updateSession as any);
router.post('/violation', authenticate, AssessmentController.logViolation as any);

export const assessmentRoutes = router;
