import { Router } from 'express';
import { AITutorController } from './ai.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Ask a question to the AI Tutor
 *     tags: [AI]
 */
router.post('/chat', authenticate, AITutorController.askTutor as any);

export const aiRoutes = router;
