export interface PaymentResult {
  id: string;
  amount: number;
  method: string;
  timestamp: string;
}

export interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiry: string; // MM/YY
  cardholderName: string;
  isDefault: boolean;
}
