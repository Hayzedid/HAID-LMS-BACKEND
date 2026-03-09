import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /payment/initialize:
 *   post:
 *     summary: Initialize a new transaction
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Transaction metadata and payment URL
 */
router.post('/initialize', authenticate, PaymentController.initialize as any);

/**
 * @swagger
 * /payment/webhook:
 *   post:
 *     summary: Handle payment processor webhooks
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post('/webhook', PaymentController.handleWebhook as any); // Public but should verify signature in production

export const paymentRoutes = router;
