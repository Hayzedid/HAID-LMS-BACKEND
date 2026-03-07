import { Router } from 'express';
import { VideoController } from './video.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { enforcePrerequisites } from '../../middlewares/prerequisite.middleware';

const router = Router();

router.post('/heartbeat', authenticate, enforcePrerequisites, VideoController.logHeartbeat as any);
router.post('/event', authenticate, enforcePrerequisites, VideoController.logEvent as any);
router.post('/checkpoint', authenticate, enforcePrerequisites, VideoController.verifyCheckpoint as any);
router.get('/checkpoints/:lessonId', authenticate, VideoController.getCheckpoints as any);
router.get('/session/:lessonId', authenticate, enforcePrerequisites, VideoController.getSession as any);

export const videoRoutes = router;
