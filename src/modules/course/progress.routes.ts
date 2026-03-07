import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/status/:courseId', authenticate, ProgressController.getStatus as any);
router.post('/complete', authenticate, ProgressController.markComplete as any);

export const progressRoutes = router;
