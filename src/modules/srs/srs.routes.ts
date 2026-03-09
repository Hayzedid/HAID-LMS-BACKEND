import { Router } from 'express';
import { SRSController } from './srs.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /srs/reviews/due:
 *   get:
 *     summary: Get all reviews due for a student today
 *     tags: [SRS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of due reviews
 */
router.get('/reviews/due', authenticate, SRSController.getDueReviews as any);

/**
 * @swagger
 * /srs/feedback:
 *   post:
 *     summary: Submit SRS feedback for a lesson
 *     tags: [SRS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lessonId, quality]
 *             properties:
 *               lessonId: { type: string, format: uuid }
 *               quality: { type: number, minimum: 1, maximum: 5, description: "1: Again, 5: Easy" }
 *     responses:
 *       200:
 *         description: Review feedback processed
 */
router.post('/feedback', authenticate, SRSController.submitFeedback as any);

export const srsRoutes = router;
