import { Router } from 'express';
import { IDEController } from './ide.controller';
import { IntegrityController } from './integrity.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { enforcePrerequisites } from '../../middlewares/prerequisite.middleware';

const router = Router();

/**
 * @swagger
 * /ide/submit:
 *   post:
 *     summary: Submit code for a lesson (Secured by Prerequisites)
 *     tags: [IDE]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [language, code, lessonId]
 *             properties:
 *               language: { type: string }
 *               code: { type: string }
 *               lessonId: { type: string }
 */
router.post('/submit', authenticate, enforcePrerequisites, IDEController.submitCode as any);

/**
 * @swagger
 * /ide/upload-viva:
 *   post:
 *     summary: Link a Viva video to a submission
 *     tags: [IDE]
 */
router.post('/upload-viva', authenticate, enforcePrerequisites, IDEController.uploadViva as any);

// IDE Integrity extensions
/**
 * @swagger
 * /ide/keystrokes:
 *   post:
 *     summary: Log keystroke patterns for integrity
 *     tags: [IDE]
 */
router.post('/keystrokes', authenticate, enforcePrerequisites, IntegrityController.logKeystrokes as any);

/**
 * @swagger
 * /ide/violation:
 *   post:
 *     summary: Log a proctoring violation (eg. tab switch)
 *     tags: [IDE]
 */
router.post('/violation', authenticate, enforcePrerequisites, IntegrityController.logViolation as any);

export const ideRoutes = router;
