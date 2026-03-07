import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/initialize', authenticate, PaymentController.initialize as any);
router.post('/webhook', PaymentController.handleWebhook as any); // Public but should verify signature in production

export const paymentRoutes = router;
