import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { PaymentService, PaystackProvider } from './payment.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('NGN'),
});

export const PaymentController = {
  async initialize(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      const email = req.user?.email; // Assuming email is in token
      if (!studentId || !email) return res.status(401).json({ error: 'Unauthorized' });

      const { amount, currency } = paymentSchema.parse(req.body);
      const provider = new PaystackProvider();
      
      const { authorization_url, reference } = await provider.initializeTransaction(email, amount);
      
      await PaymentService.createTransactionRecord(studentId, amount, currency, 'PAYSTACK', reference);

      res.status(200).json({ authorization_url, reference });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async handleWebhook(req: any, res: Response, next: NextFunction) {
    try {
      // Paystack webhook structure: req.body.data.reference
      const reference = req.body?.data?.reference;
      if (!reference) return res.status(400).json({ error: 'No reference found' });

      const success = await PaymentService.handleWebhook(reference, 'PAYSTACK');
      
      if (success) {
        res.status(200).json({ status: 'success' });
      } else {
        res.status(400).json({ status: 'failed' });
      }
    } catch (error) {
      next(error);
    }
  },
};
