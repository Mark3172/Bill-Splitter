export type PaymentMethod = 'KPay' | 'AYA Pay' | 'WavePay' | 'Bank Transfer';

export type CurrencyCode = 'MMK' | 'USD' | 'EUR' | 'THB' | 'SGD' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  placement: 'prefix' | 'suffix';
  sampleAmount: string;
}

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
  currency?: CurrencyCode;
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

export interface HistoryItem {
  id: string;
  timestamp: number;
  dateStr: string;
  eventName: string;
  totalBill: string;
  numberOfPeople: string;
  currency: CurrencyCode;
  provider: PaymentMethod;
  formattedTotal: string;
  formattedShare: string;
}

