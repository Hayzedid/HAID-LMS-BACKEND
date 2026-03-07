import { Router } from 'express';
import { VideoController } from './video.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/heartbeat', authenticate, VideoController.logHeartbeat as any);
router.post('/event', authenticate, VideoController.logEvent as any);
router.post('/checkpoint', authenticate, VideoController.verifyCheckpoint as any);
router.get('/checkpoints/:lessonId', authenticate, VideoController.getCheckpoints as any);
router.get('/session/:lessonId', authenticate, VideoController.getSession as any);

export const videoRoutes = router;
