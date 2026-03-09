import { Router } from 'express';
import { AssessmentController } from './assessment.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /assessment/exam:
 *   post:
 *     summary: Create a new proctored exam
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Exam created
 */
router.post('/exam', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), AssessmentController.createExam as any);

/**
 * @swagger
 * /assessment/report/{sessionId}:
 *   get:
 *     summary: Get performance report for a session
 *     tags: [Assessment]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/report/:sessionId', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), AssessmentController.getReport as any);

// Student/All Authenticated
/**
 * @swagger
 * /assessment/session:
 *   post:
 *     summary: Start an assessment session
 *     tags: [Assessment]
 */
router.post('/session', authenticate, AssessmentController.startSession as any);

/**
 * @swagger
 * /assessment/session/{sessionId}:
 *   patch:
 *     summary: Update assessment session (eg. saving answers)
 *     tags: [Assessment]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 */
router.patch('/session/:sessionId', authenticate, AssessmentController.updateSession as any);

/**
 * @swagger
 * /assessment/violation:
 *   post:
 *     summary: Log an exam proctoring violation
 *     tags: [Assessment]
 */
router.post('/violation', authenticate, AssessmentController.logViolation as any);

export const assessmentRoutes = router;
