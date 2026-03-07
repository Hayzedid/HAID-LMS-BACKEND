import { Router } from 'express';
import { SRSController } from './srs.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/due', authenticate, SRSController.getDueReviews as any);
router.post('/feedback', authenticate, SRSController.submitFeedback as any);

export const srsRoutes = router;
