import { prisma } from '../../config/db';
import axios from 'axios';

export interface PaymentProvider {
  initializeTransaction(email: string, amount: number): Promise<{ authorization_url: string; reference: string }>;
  verifyTransaction(reference: string): Promise<boolean>;
}

/**
 * Paystack Implementation (Regional Focus: Nigeria)
 */
export class PaystackProvider implements PaymentProvider {
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_123';

  async initializeTransaction(email: string, amount: number) {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      { email, amount: amount * 100 }, // Paystack uses kobo/cents
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    );
    return {
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    };
  }

  async verifyTransaction(reference: string): Promise<boolean> {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
    return response.data.data.status === 'success';
  }
}

export const PaymentService = {
  async createTransactionRecord(studentId: string, amount: number, currency: string, provider: string, reference: string) {
    return await prisma.transaction.create({
      data: {
        studentId,
        amount,
        currency,
        provider,
        reference,
        status: 'PENDING',
      },
    });
  },

  async handleWebhook(reference: string, provider: string) {
    // 1. Verify with provider
    const p = new PaystackProvider(); // Simplified factory
    const isSuccess = await p.verifyTransaction(reference);

    if (isSuccess) {
      await prisma.transaction.update({
        where: { reference },
        data: { status: 'SUCCESS' },
      });
      // Additional logic: Enroll student in course, issue invoice etc.
    }

    return isSuccess;
  },
};
