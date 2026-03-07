import { Router } from 'express';
import { VideoController } from './video.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { enforcePrerequisites } from '../../middlewares/prerequisite.middleware';

const router = Router();

/**
 * @swagger
 * /video/heartbeat:
 *   post:
 *     summary: Log video heartbeat (Secured by Prerequisites)
 *     tags: [Video]
 */
router.post('/heartbeat', authenticate, enforcePrerequisites, VideoController.logHeartbeat as any);

/**
 * @swagger
 * /video/event:
 *   post:
 *     summary: Log video event (eg. PAUSED, SEEKED)
 *     tags: [Video]
 */
router.post('/event', authenticate, enforcePrerequisites, VideoController.logEvent as any);

/**
 * @swagger
 * /video/checkpoint:
 *   post:
 *     summary: Verify video checkpoint quiz
 *     tags: [Video]
 *     responses:
 *       200:
 *         description: Checkpoint passed
 */
router.post('/checkpoint', authenticate, enforcePrerequisites, VideoController.verifyCheckpoint as any);

/**
 * @swagger
 * /video/checkpoints/{lessonId}:
 *   get:
 *     summary: Get all checkpoints for a lesson
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of checkpoints
 */
router.get('/checkpoints/:lessonId', authenticate, VideoController.getCheckpoints as any);

/**
 * @swagger
 * /video/session/{lessonId}:
 *   get:
 *     summary: Get current video session status
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/session/:lessonId', authenticate, enforcePrerequisites, VideoController.getSession as any);

export const videoRoutes = router;
