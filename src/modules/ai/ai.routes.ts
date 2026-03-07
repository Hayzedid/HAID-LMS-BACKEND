import { Router } from 'express';
import { AITutorController } from './ai.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/chat', authenticate, AITutorController.askTutor as any);

export const aiRoutes = router;
