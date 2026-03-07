import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /progress/status/{courseId}:
 *   get:
 *     summary: Get student progress for a course
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/status/:courseId', authenticate, ProgressController.getStatus as any);

/**
 * @swagger
 * /progress/complete:
 *   post:
 *     summary: Manually mark a lesson as completed
 *     tags: [Progress]
 */
router.post('/complete', authenticate, ProgressController.markComplete as any);

export const progressRoutes = router;
