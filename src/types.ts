export type PaymentMethod = 'KPay' | 'AYA Pay' | 'WavePay' | 'Bank Transfer';

export interface ProviderConfig {
  name: PaymentMethod;
  color: string;
  badgeBg: string;
  borderColor: string;
  defaultPlaceholder: string;
}

export interface ProviderData {
  accounts: Record<PaymentMethod, string>;
  qrCodes: Record<PaymentMethod, string | null>;
}

export interface SplitResult {
  formattedTotal: string;
  formattedShare: string;
  totalNumber: number;
  shareNumber: number;
  peopleCount: number;
  isValid: boolean;
  messageText: string;
}

