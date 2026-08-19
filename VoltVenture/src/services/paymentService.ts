import type { RideSummary } from '../types/ride';
import type { PaymentResult, SavedCard } from '../types/payment';

export interface PaymentService {
  processPayment(summary: RideSummary): Promise<PaymentResult>;
  getSavedCards(): SavedCard[];
  addCard(card: Omit<SavedCard, 'id' | 'isDefault'>): SavedCard;
  setDefault(cardId: string): void;
  getDefault(): SavedCard | undefined;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const savedCards: SavedCard[] = [
  {
    id: 'card-seed',
    last4: '4242',
    brand: 'Visa',
    expiry: '12/26',
    cardholderName: 'Test User',
    isDefault: true,
  },
];

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

  getSavedCards() {
    return [...savedCards];
  },

  addCard(card: Omit<SavedCard, 'id' | 'isDefault'>) {
    const newCard: SavedCard = {
      id: 'card-' + Date.now(),
      last4: card.last4.slice(-4), // store only last 4 digits — never full card number
      brand: card.brand,
      expiry: card.expiry,
      cardholderName: card.cardholderName,
      isDefault: false,
    };
    savedCards.push(newCard);
    return newCard;
  },

  setDefault(cardId: string) {
    const target = savedCards.find(c => c.id === cardId);
    if (!target) return;
    savedCards.forEach(c => {
      c.isDefault = false;
    });
    target.isDefault = true;
  },

  getDefault() {
    return savedCards.find(c => c.isDefault) ?? savedCards[0];
  },
};

export const paymentService: PaymentService = mockPaymentService;
