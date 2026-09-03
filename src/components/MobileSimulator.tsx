import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { PaymentMethod, ProviderConfig, CurrencyCode, CurrencyConfig, HistoryItem } from '../types';
import {
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import BottomNavBar, { NavTabType } from './BottomNavBar';
import SideDrawer from './SideDrawer';
import HistoryTab from './HistoryTab';
import PaymentTab from './PaymentTab';
import SplitTab from './SplitTab';
import ReceiptModal from './ReceiptModal';
import {
  generateReceiptImageBlob,
  copyReceiptImageOnly,
  copyQrCodeImageOnly,
  downloadReceiptImage,
  blobToDataUrl,
  ReceiptData,
} from '../utils/receiptGenerator';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  'MMK': {
    code: 'MMK',
    symbol: 'Ks',
    name: 'Myanmar Kyat',
    placement: 'suffix',
    sampleAmount: '145000',
  },
  'USD': {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    placement: 'prefix',
    sampleAmount: '85.00',
  },
  'EUR': {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    placement: 'prefix',
    sampleAmount: '75.50',
  },
  'THB': {
    code: 'THB',
    symbol: '฿',
    name: 'Thai Baht',
    placement: 'prefix',
    sampleAmount: '2400',
  },
  'SGD': {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    placement: 'prefix',
    sampleAmount: '110.00',
  },
  'GBP': {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    placement: 'prefix',
    sampleAmount: '65.00',
  },
};

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ['MMK', 'USD', 'EUR', 'THB', 'SGD', 'GBP'];

export const PROVIDER_CONFIGS: Record<PaymentMethod, ProviderConfig> = {
  'KPay': {
    name: 'KPay',
    color: '#2563EB',
    badgeBg: 'rgba(37, 99, 235, 0.15)',
    borderColor: '#3B82F6',
    defaultPlaceholder: '09771234567 (Mark)',
  },
  'AYA Pay': {
    name: 'AYA Pay',
    color: '#E11D48',
    badgeBg: 'rgba(225, 29, 72, 0.15)',
    borderColor: '#F43F5E',
    defaultPlaceholder: '09771234567',
  },
  'WavePay': {
    name: 'WavePay',
    color: '#EAB308',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    borderColor: '#FACC15',
    defaultPlaceholder: '09251234119',
  },
  'Bank Transfer': {
    name: 'Bank Transfer',
    color: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#34D399',
    defaultPlaceholder: 'CB Bank - 2001-3849-2910',
  },
};

export const PAYMENT_METHODS: PaymentMethod[] = ['KPay', 'AYA Pay', 'WavePay', 'Bank Transfer'];
const STORAGE_KEY = 'bill_splitter_data_v2';
const HISTORY_STORAGE_KEY = '@bill_splitter_history_v1';

// Sample demo QR codes (SVG data URIs for instant preview out of the box)
const SAMPLE_QR_KPAY = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%232563EB"><rect width="100" height="100" fill="%230F172A"/><rect x="10" y="10" width="25" height="25" fill="%232563EB"/><rect x="15" y="15" width="15" height="15" fill="%230F172A"/><rect x="19" y="19" width="7" height="7" fill="%232563EB"/><rect x="65" y="10" width="25" height="25" fill="%232563EB"/><rect x="70" y="15" width="15" height="15" fill="%230F172A"/><rect x="74" y="19" width="7" height="7" fill="%232563EB"/><rect x="10" y="65" width="25" height="25" fill="%232563EB"/><rect x="15" y="70" width="15" height="15" fill="%230F172A"/><rect x="19" y="74" width="7" height="7" fill="%232563EB"/><circle cx="50" cy="50" r="10" fill="%2338BDF8"/><text x="50" y="54" font-family="sans-serif" font-size="9" font-weight="bold" fill="%23000" text-anchor="middle">KP</text></svg>';

const SAMPLE_QR_WAVEPAY = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23EAB308"><rect width="100" height="100" fill="%231E1B18"/><rect x="10" y="10" width="25" height="25" fill="%23EAB308"/><rect x="15" y="15" width="15" height="15" fill="%231E1B18"/><rect x="19" y="19" width="7" height="7" fill="%23EAB308"/><rect x="65" y="10" width="25" height="25" fill="%23EAB308"/><rect x="70" y="15" width="15" height="15" fill="%231E1B18"/><rect x="74" y="19" width="7" height="7" fill="%23EAB308"/><rect x="10" y="65" width="25" height="25" fill="%23EAB308"/><rect x="15" y="70" width="15" height="15" fill="%231E1B18"/><rect x="19" y="74" width="7" height="7" fill="%23EAB308"/><circle cx="50" cy="50" r="10" fill="%23FACC15"/><text x="50" y="54" font-family="sans-serif" font-size="9" font-weight="bold" fill="%23000" text-anchor="middle">WP</text></svg>';

const SAMPLE_QR_BANK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%2310B981"><rect width="100" height="100" fill="%230F172A"/><rect x="10" y="10" width="25" height="25" fill="%2310B981"/><rect x="15" y="15" width="15" height="15" fill="%230F172A"/><rect x="19" y="19" width="7" height="7" fill="%2310B981"/><rect x="65" y="10" width="25" height="25" fill="%2310B981"/><rect x="70" y="15" width="15" height="15" fill="%230F172A"/><rect x="74" y="19" width="7" height="7" fill="%2310B981"/><rect x="10" y="65" width="25" height="25" fill="%2310B981"/><rect x="15" y="70" width="15" height="15" fill="%230F172A"/><rect x="19" y="74" width="7" height="7" fill="%2310B981"/><circle cx="50" cy="50" r="10" fill="%2334D399"/><text x="50" y="54" font-family="sans-serif" font-size="9" font-weight="bold" fill="%23000" text-anchor="middle">QR</text></svg>';

export default function MobileSimulator() {
  const [eventName, setEventName] = useState('Hotpot Dinner');
  const [totalBill, setTotalBill] = useState('145000');
  const [numberOfPeople, setNumberOfPeople] = useState('4');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('KPay');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('MMK');
  const [isDragging, setIsDragging] = useState(false);
  
  // Persisted accounts
  const [accounts, setAccounts] = useState<Record<PaymentMethod, string>>({
    'KPay': '09771234567',
    'AYA Pay': '09771234567',
    'WavePay': '09251234119',
    'Bank Transfer': 'CB Bank - 2001-3849-2910',
  });

  // Persisted QR Code data URIs
  const [qrCodes, setQrCodes] = useState<Record<PaymentMethod, string | null>>({
    'KPay': SAMPLE_QR_KPAY,
    'AYA Pay': null,
    'WavePay': SAMPLE_QR_WAVEPAY,
    'Bank Transfer': null,
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isCardCopied, setIsCardCopied] = useState(false);
  const [isQrCopied, setIsQrCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Receipt Modal state for previewing, direct copying, and downloading
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptModalDataUrl, setReceiptModalDataUrl] = useState<string | null>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

  // Copy formatting options (NO "Your Share" - clean & polite for groups)
  const [includePerPersonInCopy, setIncludePerPersonInCopy] = useState(true);
  const [copyFormatStyle, setCopyFormatStyle] = useState<'friendly' | 'clean'>('friendly');

  // History state: last 5 successful bill calculations
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Navigation & Side Drawer states
  const [activeNavTab, setActiveNavTab] = useState<NavTabType>('split');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accounts) setAccounts((prev) => ({ ...prev, ...parsed.accounts }));
        if (parsed.qrCodes) setQrCodes((prev) => ({ ...prev, ...parsed.qrCodes }));
        if (parsed.currency && CURRENCY_CONFIGS[parsed.currency as CurrencyCode]) {
          setSelectedCurrency(parsed.currency as CurrencyCode);
        }
      }

      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, []);

  const triggerHaptics = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 30, 40]);
    }
  };

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 2500);
  };

  // Helper to persist account, QR codes, and currency
  const persist = (
    updatedAccounts: Record<PaymentMethod, string>,
    updatedQrCodes: Record<PaymentMethod, string | null>,
    updatedCurrency: CurrencyCode
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accounts: updatedAccounts,
        qrCodes: updatedQrCodes,
        currency: updatedCurrency,
      }));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  };

  const handleCurrencyChange = (currCode: CurrencyCode) => {
    triggerHaptics();
    setSelectedCurrency(currCode);
    persist(accounts, qrCodes, currCode);
    showToast(`Currency set to ${currCode} (${CURRENCY_CONFIGS[currCode].symbol})`);
  };

  // Update and save account number
  const handleAccountChange = useCallback(
    (text: string) => {
      setAccounts((prev) => {
        const updated = {
          ...prev,
          [selectedMethod]: text,
        };
        persist(updated, qrCodes, selectedCurrency);
        return updated;
      });
    },
    [selectedMethod, qrCodes, selectedCurrency]
  );

  // Process uploaded image file for Bank QR (supports file input & drag-and-drop)
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, or screenshot)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Uri = event.target?.result as string;
      setQrCodes((prev) => {
        const updated = {
          ...prev,
          [selectedMethod]: base64Uri,
        };
        persist(accounts, updated, selectedCurrency);
        return updated;
      });
      triggerHaptics();
      showToast(`Bank QR Code attached successfully!`);
    };
    reader.readAsDataURL(file);
  };

  // QR Code Upload Handler from input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = '';
  };

  // Quick Demo Bank QR helper for instant preview
  const handleSetSampleQR = (method: PaymentMethod) => {
    triggerHaptics();
    const sample = method === 'KPay' ? SAMPLE_QR_KPAY : method === 'WavePay' ? SAMPLE_QR_WAVEPAY : SAMPLE_QR_BANK;
    setQrCodes((prev) => {
      const updated = {
        ...prev,
        [method]: sample,
      };
      persist(accounts, updated, selectedCurrency);
      return updated;
    });
    showToast(`Sample ${method} QR attached!`);
  };

  const handleRemoveQR = () => {
    setQrCodes((prev) => {
      const updated = {
        ...prev,
        [selectedMethod]: null,
      };
      persist(accounts, updated, selectedCurrency);
      return updated;
    });
    triggerHaptics();
    showToast(`Bank QR Code removed`);
  };

  // Drag and drop handlers for QR codes
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Helper to add quick increment to total bill
  const handleAddAmount = (increment: number) => {
    triggerHaptics();
    const current = parseFloat(totalBill.replace(/[^0-9.]/g, '')) || 0;
    const nextVal = current + increment;
    const isDecimal = ['USD', 'EUR', 'GBP', 'SGD'].includes(selectedCurrency);
    setTotalBill(isDecimal ? nextVal.toFixed(2) : String(Math.round(nextVal)));
  };

  // Helper for thousands formatting
  const formatNumber = (val: number | string) => {
    if (isNaN(Number(val)) || val === null || val === undefined) return '0';
    const parts = val.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const currentConfig = PROVIDER_CONFIGS[selectedMethod] || PROVIDER_CONFIGS['KPay'];
  const currentCurrencyConfig = CURRENCY_CONFIGS[selectedCurrency] || CURRENCY_CONFIGS['MMK'];
  const activeQR = qrCodes[selectedMethod];
  const activeAccount = accounts[selectedMethod]?.trim() || '';

  // Calculations & Conditional Formatted Text
  const calculation = useMemo(() => {
    const sanitizedBillStr = totalBill.replace(/[^0-9.]/g, '');
    const sanitizedPeopleStr = numberOfPeople.replace(/[^0-9]/g, '');

    const billNum = parseFloat(sanitizedBillStr);
    const peopleNum = parseInt(sanitizedPeopleStr, 10);

    const hasValidBill = !isNaN(billNum) && billNum > 0;
    const hasValidPeople = !isNaN(peopleNum) && peopleNum > 0;
    const isValid = hasValidBill && hasValidPeople;

    const share = isValid ? billNum / peopleNum : 0;
    const isDecimalCurrency = ['USD', 'EUR', 'GBP', 'SGD'].includes(selectedCurrency);

    const formattedShareNum = isValid
      ? isDecimalCurrency
        ? formatNumber(parseFloat(share.toFixed(2)))
        : share % 1 === 0
        ? formatNumber(share)
        : formatNumber(parseFloat(share.toFixed(2)))
      : '0';

    const formattedTotalNum = hasValidBill
      ? isDecimalCurrency && billNum % 1 !== 0
        ? formatNumber(parseFloat(billNum.toFixed(2)))
        : formatNumber(billNum)
      : (totalBill.trim() || '0');

    // Format with currency symbol according to placement
    const formattedShare =
      currentCurrencyConfig.placement === 'prefix'
        ? `${currentCurrencyConfig.symbol}${formattedShareNum}`
        : `${formattedShareNum} ${currentCurrencyConfig.symbol}`;

    const formattedTotal =
      currentCurrencyConfig.placement === 'prefix'
        ? `${currentCurrencyConfig.symbol}${formattedTotalNum}`
        : `${formattedTotalNum} ${currentCurrencyConfig.symbol}`;

    const lines: string[] = [];
    const isFriendly = copyFormatStyle === 'friendly';
    const peopleCountStr = peopleNum > 1 ? ` (${peopleNum} people)` : '';

    if (eventName.trim().length > 0) {
      lines.push(isFriendly ? `🍽️ ${eventName.trim()}` : `${eventName.trim()}`);
    }
    lines.push(isFriendly ? `💰 Total: ${formattedTotal}${peopleCountStr}` : `Total: ${formattedTotal}${peopleCountStr}`);

    if (includePerPersonInCopy && isValid) {
      lines.push(isFriendly ? `👥 Per Person: ${formattedShare}` : `Per Person: ${formattedShare}`);
    }

    if (activeAccount.length > 0) {
      lines.push(isFriendly ? `📱 Send via ${selectedMethod}: ${activeAccount}` : `Send via ${selectedMethod}: ${activeAccount}`);
    }

    if (activeQR) {
      lines.push(isFriendly ? `📷 QR Code: Included (Scan with ${selectedMethod})` : `QR Code: Attached (${selectedMethod})`);
    }

    const formattedMessage = lines.join('\n');

    return {
      isValid,
      formattedMessage,
      formattedShare,
      formattedTotal,
      billNum: isNaN(billNum) ? 0 : billNum,
      peopleNum: isNaN(peopleNum) ? 0 : peopleNum,
    };
  }, [
    eventName,
    totalBill,
    numberOfPeople,
    selectedMethod,
    activeAccount,
    activeQR,
    selectedCurrency,
    currentCurrencyConfig,
    includePerPersonInCopy,
    copyFormatStyle,
  ]);

  // Save successful calculation to History
  const saveCalculationToHistory = useCallback(
    (customCalculation?: typeof calculation) => {
      const calc = customCalculation || calculation;
      if (!calc || !calc.isValid) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        dateStr: timeStr,
        eventName: eventName.trim() || 'Bill Split',
        totalBill: totalBill.trim(),
        numberOfPeople: numberOfPeople.trim() || '2',
        currency: selectedCurrency,
        provider: selectedMethod,
        formattedTotal: calc.formattedTotal,
        formattedShare: calc.formattedShare,
      };

      setHistory((prev) => {
        const isDuplicateOfLatest =
          prev[0] &&
          prev[0].totalBill === newItem.totalBill &&
          prev[0].numberOfPeople === newItem.numberOfPeople &&
          prev[0].currency === newItem.currency &&
          prev[0].eventName === newItem.eventName;

        const filtered = isDuplicateOfLatest
          ? [newItem, ...prev.slice(1)]
          : [newItem, ...prev.filter((item) => item.id !== newItem.id)];

        const updated = filtered.slice(0, 5);
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage save history error', e);
        }
        return updated;
      });

      setIsSavedFeedback(true);
      setTimeout(() => setIsSavedFeedback(false), 2000);
    },
    [calculation, eventName, totalBill, numberOfPeople, selectedCurrency, selectedMethod]
  );

  // Auto-save successful calculation to history with debounce
  useEffect(() => {
    if (!calculation.isValid) return;
    const timer = setTimeout(() => {
      saveCalculationToHistory(calculation);
    }, 1500);
    return () => clearTimeout(timer);
  }, [
    calculation.isValid,
    calculation.formattedTotal,
    calculation.formattedShare,
    eventName,
    totalBill,
    numberOfPeople,
    selectedCurrency,
    selectedMethod,
    saveCalculationToHistory,
  ]);

  // Retrieve previous calculation from history
  const handleRetrieveHistory = (item: HistoryItem) => {
    triggerHaptics();
    setEventName(item.eventName === 'Bill Split' ? '' : item.eventName);
    setTotalBill(item.totalBill);
    setNumberOfPeople(item.numberOfPeople);
    setSelectedCurrency(item.currency);
    setSelectedMethod(item.provider);
    setActiveNavTab('split');
    showToast(`Restored split: ${item.formattedShare} per person`);
  };

  // Delete individual history item manually
  const handleDeleteHistoryItem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    triggerHaptics();
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Error deleting history item', err);
      }
      return updated;
    });
    showToast('Split removed from history');
  };

  // Clear history
  const handleClearHistory = () => {
    triggerHaptics();
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn('Clear history error', e);
    }
    showToast('Calculation history cleared');
  };

  // Helper to compile receipt metadata for canvas and sharing
  const getReceiptData = useCallback((): ReceiptData => ({
    eventName: eventName.trim() || 'Bill Split',
    formattedTotal: calculation.formattedTotal,
    peopleCount: calculation.peopleNum,
    formattedShare: calculation.formattedShare,
    provider: selectedMethod,
    providerColor: currentConfig.color,
    accountNumber: activeAccount,
    qrDataUri: activeQR,
    currencySymbol: currentCurrencyConfig.symbol,
    formattedMessage: calculation.formattedMessage,
  }), [
    eventName,
    calculation.formattedTotal,
    calculation.peopleNum,
    calculation.formattedShare,
    calculation.formattedMessage,
    selectedMethod,
    currentConfig.color,
    activeAccount,
    activeQR,
    currentCurrencyConfig.symbol,
  ]);

  // Primary: Share Bill & QR Image (Attaches generated PNG image via Web Share API)
  const handleShare = async () => {
    if (!calculation.isValid) return;

    triggerHaptics();
    setIsSharing(true);
    saveCalculationToHistory(calculation);

    try {
      const data = getReceiptData();
      let file: File | null = null;
      try {
        const blob = await generateReceiptImageBlob(data);
        const fileName = `receipt-${selectedMethod.toLowerCase().replace(/\s+/g, '-')}.png`;
        file = new File([blob], fileName, { type: 'image/png' });
      } catch (err) {
        console.warn('Could not generate receipt image for sharing', err);
      }

      // Check if navigator.share supports file attachment
      if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${eventName.trim() || 'Bill Split'} Receipt & QR`,
          text: calculation.formattedMessage,
          files: [file],
        });
        showToast('Shared Receipt with QR image!');
      } else if (navigator.share) {
        await navigator.share({
          title: `${eventName.trim() || 'Bill Split'} Summary`,
          text: calculation.formattedMessage,
        });
        showToast('Summary shared via chat!');
      } else {
        // Fallback: Copy receipt card with QR to clipboard
        await handleCopyReceiptCard();
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        console.warn('Share dismissed or failed', e);
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Invalidate generated receipt preview if calculation parameters change
  useEffect(() => {
    setReceiptModalDataUrl(null);
  }, [totalBill, numberOfPeople, selectedCurrency, selectedMethod, activeAccount, activeQR, eventName]);

  // Secondary: Copy Receipt Card Image (Copies high-res image/png directly to clipboard)
  const handleCopyReceiptCard = async () => {
    if (!calculation.isValid) return;

    triggerHaptics();
    saveCalculationToHistory(calculation);
    setIsGeneratingReceipt(true);

    try {
      const data = getReceiptData();
      const result = await copyReceiptImageOnly(data);
      if (result.dataUrl) {
        setReceiptModalDataUrl(result.dataUrl);
      }

      if (result.success) {
        setIsCardCopied(true);
        showToast('✓ Receipt Image & QR copied! Paste as photo in chat.');
        setTimeout(() => setIsCardCopied(false), 2500);
      } else {
        // Automatic clipboard write is blocked by browser/iframe restrictions
        // Immediately show the Receipt Preview Modal so user can long-press/right-click or download
        setIsReceiptModalOpen(true);
        showToast('Receipt ready! Copy photo or download PNG below.');
      }
    } catch (err) {
      console.error('Clipboard copy receipt image failed', err);
      setIsReceiptModalOpen(true);
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  // Open the Receipt Preview Modal
  const handleOpenReceiptModal = async () => {
    if (!calculation.isValid) return;
    triggerHaptics();
    setIsReceiptModalOpen(true);

    if (!receiptModalDataUrl) {
      setIsGeneratingReceipt(true);
      try {
        const data = getReceiptData();
        const blob = await generateReceiptImageBlob(data);
        const dataUrl = await blobToDataUrl(blob);
        setReceiptModalDataUrl(dataUrl);
      } catch (err) {
        console.warn('Failed to generate modal receipt image', err);
      } finally {
        setIsGeneratingReceipt(false);
      }
    }
  };

  // Copy QR Image only to clipboard
  const handleCopyQrImageOnly = async () => {
    if (!activeQR) return;
    triggerHaptics();
    try {
      const success = await copyQrCodeImageOnly(activeQR);
      if (success) {
        setIsQrCopied(true);
        showToast('QR Code image copied to clipboard!');
        setTimeout(() => setIsQrCopied(false), 2000);
      } else {
        await downloadReceiptImage(getReceiptData());
        showToast('QR image downloaded to device!');
      }
    } catch (err) {
      console.error('QR image copy failed', err);
    }
  };

  // Download Receipt Image with QR
  const handleDownloadReceipt = async () => {
    triggerHaptics();
    try {
      const data = getReceiptData();
      await downloadReceiptImage(data);
      showToast('Receipt & QR image saved!');
    } catch (err) {
      console.error('Download receipt failed', err);
    }
  };

  // Tertiary: Copy Text Only
  const handleCopyTextOnly = async () => {
    if (!calculation.isValid) return;

    triggerHaptics();
    saveCalculationToHistory(calculation);
    try {
      await navigator.clipboard.writeText(calculation.formattedMessage);
      setIsCopied(true);
      showToast('Text copied to clipboard!');
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  };

  // Copy Account Number Only
  const handleCopyAccountOnly = async () => {
    if (!activeAccount) return;
    triggerHaptics();
    try {
      await navigator.clipboard.writeText(activeAccount);
      showToast(`${selectedMethod} number copied!`);
    } catch (err) {
      console.error('Account copy failed', err);
    }
  };

  // Reset all stored data
  const handleResetAllData = () => {
    triggerHaptics();
    if (typeof window !== 'undefined' && window.confirm('Reset all saved accounts, QR codes, and history?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      setAccounts({
        'KPay': '09771234567',
        'AYA Pay': '09771234567',
        'WavePay': '09251234119',
        'Bank Transfer': 'CB Bank - 2001-3849-2910',
      });
      setQrCodes({
        'KPay': SAMPLE_QR_KPAY,
        'AYA Pay': null,
        'WavePay': SAMPLE_QR_WAVEPAY,
        'Bank Transfer': null,
      });
      setHistory([]);
      setSelectedCurrency('MMK');
      setEventName('Hotpot Dinner');
      setTotalBill('145000');
      setNumberOfPeople('4');
      setIsSideDrawerOpen(false);
      showToast('All data reset to defaults');
    }
  };

  return (
    <div className="w-full max-w-[395px] mx-auto flex flex-col bg-[#101216] text-slate-100 rounded-[3rem] border-[8px] border-[#1F2430] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] overflow-hidden relative ring-1 ring-white/10 h-[780px]">
      {/* Hidden File Input for QR Code Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="qr-file-input"
      />

      {/* Device Status Bar & Dynamic Island */}
      <div className="px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-slate-400 select-none bg-[#101216] shrink-0">
        <span className="text-[13px] font-semibold text-white/90">9:41</span>
        
        {/* Dynamic Island pill */}
        <div className="w-24 h-5 bg-black border border-white/10 rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-white/10" />
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-[10px] font-bold text-white/70">5G</span>
          <span className="inline-block w-4 h-2.5 border border-white/50 rounded-xs relative">
            <span className="block h-full bg-white w-3/4 rounded-xs" />
          </span>
        </div>
      </div>

      {/* App Header with Pro Badge & Side Tools Drawer Button */}
      <div className="px-5 pt-2 pb-2.5 flex items-center justify-between border-b border-white/5 bg-[#101216] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-white">
              Bill Splitter
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[9px] font-bold text-blue-400">
              PRO
            </span>
          </div>
          <p className="text-slate-400 text-[11px] font-medium">
            {activeNavTab === 'split' && 'Split bills & share polite receipts'}
            {activeNavTab === 'payment' && 'Manage payment info & bank QR'}
            {activeNavTab === 'history' && 'Past group bill calculations'}
          </p>
        </div>

        {/* Side Drawer Toggle & Quick Reset Action */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-open-side-drawer"
            type="button"
            onClick={() => {
              triggerHaptics();
              setIsSideDrawerOpen(true);
            }}
            title="Side Tools & Presets"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1B1F2D] hover:bg-[#23293D] text-slate-300 hover:text-white rounded-xl border border-white/10 transition active:scale-95 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px]">Tools</span>
          </button>

          <button
            id="btn-reset-demo"
            type="button"
            onClick={() => {
              triggerHaptics();
              setEventName('Hotpot Dinner');
              setTotalBill(currentCurrencyConfig.sampleAmount);
              setNumberOfPeople('4');
              showToast('Reset to demo split');
            }}
            title="Reset to sample data"
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area (Conditionally renders based on activeNavTab) */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 scrollbar-thin">
        {activeNavTab === 'split' && (
          <SplitTab
            eventName={eventName}
            setEventName={setEventName}
            totalBill={totalBill}
            setTotalBill={setTotalBill}
            numberOfPeople={numberOfPeople}
            setNumberOfPeople={setNumberOfPeople}
            selectedCurrency={selectedCurrency}
            currentCurrencyConfig={currentCurrencyConfig}
            selectedMethod={selectedMethod}
            currentConfig={currentConfig}
            activeAccount={activeAccount}
            activeQR={activeQR}
            calculation={{
              total: calculation.billNum,
              peopleCount: calculation.peopleNum,
              share: calculation.billNum / (calculation.peopleNum || 1),
              isValid: calculation.isValid,
              formattedTotal: calculation.formattedTotal,
              formattedShare: calculation.formattedShare,
              formattedMessage: calculation.formattedMessage,
            }}
            handleAddAmount={handleAddAmount}
            triggerHaptics={triggerHaptics}
            handleShare={handleShare}
            handleOpenReceiptModal={handleOpenReceiptModal}
            handleCopyReceiptCard={handleCopyReceiptCard}
            handleCopyQrImageOnly={handleCopyQrImageOnly}
            handleCopyTextOnly={handleCopyTextOnly}
            handleCopyAccountOnly={handleCopyAccountOnly}
            handleDownloadReceipt={handleDownloadReceipt}
            saveCalculationToHistory={saveCalculationToHistory}
            isSharing={isSharing}
            isCardCopied={isCardCopied}
            isQrCopied={isQrCopied}
            isCopied={isCopied}
            isSavedFeedback={isSavedFeedback}
            formatNumber={formatNumber}
            onOpenPaymentTab={() => {
              triggerHaptics();
              setActiveNavTab('payment');
            }}
            onOpenSideDrawer={() => {
              triggerHaptics();
              setIsSideDrawerOpen(true);
            }}
          />
        )}

        {activeNavTab === 'payment' && (
          <PaymentTab
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            accounts={accounts}
            handleAccountChange={handleAccountChange}
            handleCopyAccountOnly={handleCopyAccountOnly}
            handleCopyQrImageOnly={handleCopyQrImageOnly}
            handleDownloadReceipt={handleDownloadReceipt}
            isQrCopied={isQrCopied}
            activeQR={activeQR}
            fileInputRef={fileInputRef}
            handleRemoveQR={handleRemoveQR}
            handleSetSampleQR={handleSetSampleQR}
            isDragging={isDragging}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            triggerHaptics={triggerHaptics}
            onBackToSplit={() => {
              triggerHaptics();
              setActiveNavTab('split');
            }}
            paymentMethods={PAYMENT_METHODS}
            providerConfigs={PROVIDER_CONFIGS}
            qrCodes={qrCodes}
          />
        )}

        {activeNavTab === 'history' && (
          <HistoryTab
            history={history}
            onRetrieveHistory={handleRetrieveHistory}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
            onStartNewSplit={() => {
              triggerHaptics();
              setActiveNavTab('split');
            }}
          />
        )}
      </div>

      {/* In-app Toast Notification */}
      {notificationMsg && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-blue-600/95 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-xs border border-white/20 animate-in fade-in slide-in-from-top duration-200 pointer-events-none">
          {notificationMsg}
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        historyCount={history.length}
        triggerHaptics={triggerHaptics}
      />

      {/* iOS Home Indicator Bar */}
      <div className="py-1 flex justify-center bg-[#101216] select-none shrink-0">
        <div className="w-28 h-1 bg-white/20 rounded-full" />
      </div>

      {/* Side Tab Drawer */}
      <SideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
        onSelectPreset={(name, amounts, people) => {
          triggerHaptics();
          setEventName(name);
          if (amounts[selectedCurrency]) {
            setTotalBill(amounts[selectedCurrency]!);
          }
          setNumberOfPeople(people);
          setIsSideDrawerOpen(false);
          setActiveNavTab('split');
          showToast(`Loaded "${name}" preset`);
        }}
        copyFormatStyle={copyFormatStyle}
        setCopyFormatStyle={setCopyFormatStyle}
        includePerPersonInCopy={includePerPersonInCopy}
        setIncludePerPersonInCopy={setIncludePerPersonInCopy}
        formattedMessage={calculation.formattedMessage}
        onResetAllData={handleResetAllData}
        triggerHaptics={triggerHaptics}
      />

      {/* Full-Screen Receipt Image & QR Preview Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptDataUrl={receiptModalDataUrl}
        isGenerating={isGeneratingReceipt}
        onCopyImage={handleCopyReceiptCard}
        onDownload={handleDownloadReceipt}
        onShare={handleShare}
        isImageCopied={isCardCopied}
        selectedMethod={selectedMethod}
        hasQR={Boolean(activeQR)}
      />
    </div>
  );
}
