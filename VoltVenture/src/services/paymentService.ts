import type { RideSummary } from '../types/ride';
import type { PaymentResult } from '../types/payment';

export interface PaymentService {
  processPayment(summary: RideSummary): Promise<PaymentResult>;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const mockPaymentService: PaymentService = {
  async processPayment(summary: RideSummary) {
    await delay(1500);
    return {
      id: 'pay-' + Date.now(),
      amount: summary.costEur,
      method: 'Visa \u2022\u2022\u2022\u2022 4242',
      timestamp: new Date().toISOString(),
    };
  },
};

export const paymentService: PaymentService = mockPaymentService;
