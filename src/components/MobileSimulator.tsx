import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { PaymentMethod, ProviderConfig, CurrencyCode, CurrencyConfig, HistoryItem } from '../types';
import {
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Share2,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
  Sparkles,
  Coins,
  Clock,
  ArrowUpRight,
  BookmarkCheck,
  QrCode,
  RefreshCw,
  Users,
  Eye,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';

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

const PROVIDER_CONFIGS: Record<PaymentMethod, ProviderConfig> = {
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

const PAYMENT_METHODS: PaymentMethod[] = ['KPay', 'AYA Pay', 'WavePay', 'Bank Transfer'];
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
  const [isSharing, setIsSharing] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Copy formatting options (NO "Your Share" - clean & polite for groups)
  const [includePerPersonInCopy, setIncludePerPersonInCopy] = useState(true);
  const [copyFormatStyle, setCopyFormatStyle] = useState<'friendly' | 'clean'>('friendly');
  const [showTextPreview, setShowTextPreview] = useState(true);

  // History state: last 5 successful bill calculations
  const [history, setHistory] = useState<HistoryItem[]>([]);

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
          setHistory(parsedHistory.slice(0, 5));
        }
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
  }, []);

  // Save to localStorage helper
  const persist = (
    updatedAccounts: Record<PaymentMethod, string>,
    updatedQrCodes: Record<PaymentMethod, string | null>,
    updatedCurrency: CurrencyCode = selectedCurrency
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
    // Reset input value so same file can be re-uploaded if desired
    e.target.value = '';
  };

  // Quick Demo Bank QR helper for instant preview
  const handleUseSampleBankQR = () => {
    triggerHaptics();
    setQrCodes((prev) => {
      const updated = {
        ...prev,
        [selectedMethod]: SAMPLE_QR_BANK,
      };
      persist(accounts, updated, selectedCurrency);
      return updated;
    });
    showToast('Demo Bank QR Code applied!');
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

  const triggerHaptics = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 30, 40]);
    }
  };

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 2500);
  };

  // Quick preset helper with currency awareness
  const handleQuickPreset = (name: string, defaultAmounts: Record<CurrencyCode, string>, people: string) => {
    triggerHaptics();
    setEventName(name);
    setTotalBill(defaultAmounts[selectedCurrency] || defaultAmounts['MMK']);
    setNumberOfPeople(people);
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

    // Conditional text formatted strictly for sharing with friends (NO "Your Share"):
    // - Polite 'Per Person' phrasing instead of 'Your Share'
    // - Option to omit per-person share if sender only wants to share total & payment info
    // - Omit Event Name if empty
    // - Omit Send via line if Account Number is empty
    const lines: string[] = [];
    const isFriendly = copyFormatStyle === 'friendly';
    const peopleCountStr = peopleNum > 1 ? ` (${peopleNum} people)` : '';

    if (eventName.trim().length > 0) {
      lines.push(isFriendly ? `🍽️ ${eventName.trim()}` : `${eventName.trim()}`);
    }
    lines.push(isFriendly ? `💰 Total: ${formattedTotal}${peopleCountStr}` : `Total: ${formattedTotal}${peopleCountStr}`);

    // Nicely formatted per-person share without ever saying "Your Share"
    if (includePerPersonInCopy && isValid) {
      lines.push(isFriendly ? `👥 Per Person: ${formattedShare}` : `Per Person: ${formattedShare}`);
    }

    if (activeAccount.length > 0) {
      lines.push(isFriendly ? `📱 Send via ${selectedMethod}: ${activeAccount}` : `Send via ${selectedMethod}: ${activeAccount}`);
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
    selectedCurrency,
    currentCurrencyConfig,
    includePerPersonInCopy,
    copyFormatStyle,
  ]);

  // Save successful calculation to History (stores last 5 calculations in localStorage)
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
    showToast(`Restored split: ${item.formattedShare} per person`);
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

  // Primary: Share Bill & QR
  const handleShare = async () => {
    if (!calculation.isValid) return;

    triggerHaptics();
    setIsSharing(true);
    saveCalculationToHistory(calculation);

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Bill Split Summary',
          text: calculation.formattedMessage,
        });
        showToast('Shared successfully!');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(calculation.formattedMessage);
        showToast('Summary copied to clipboard!');
      }
    } catch (e) {
      console.warn('Share dismissed', e);
    } finally {
      setIsSharing(false);
    }
  };

  // Secondary: Copy Text Only
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

  return (
    <div className="w-full max-w-[395px] mx-auto flex flex-col bg-[#101216] text-slate-100 rounded-[3rem] border-[8px] border-[#1F2430] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] overflow-hidden relative ring-1 ring-white/10">
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
      <div className="px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-slate-400 select-none bg-[#101216]">
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

      {/* App Header */}
      <div className="px-6 pt-2 pb-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              Bill Splitter
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-bold text-blue-400">
              PRO
            </span>
          </div>
          <p className="text-slate-400 text-xs font-medium mt-0.5">
            Clean group splits & payment QR sharing
          </p>
        </div>

        <button
          id="btn-reset-demo"
          onClick={() => {
            setEventName('Hotpot Dinner');
            setTotalBill(currentCurrencyConfig.sampleAmount);
            setNumberOfPeople('4');
          }}
          title="Reset to sample data"
          className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Demo Presets */}
      <div className="px-6 py-1.5 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] uppercase font-bold tracking-wider text-white/30 whitespace-nowrap">Presets:</span>
        <button
          onClick={() =>
            handleQuickPreset(
              'Hotpot Dinner',
              { MMK: '145000', USD: '140.00', EUR: '130.00', THB: '4800', SGD: '180.00', GBP: '110.00' },
              '4'
            )
          }
          className="px-2.5 py-1 bg-[#1A1D24] hover:bg-[#232732] text-slate-300 text-[11px] font-medium rounded-lg border border-white/5 transition whitespace-nowrap active:scale-95"
        >
          🍲 Hotpot (4p)
        </button>
        <button
          onClick={() =>
            handleQuickPreset(
              'Friday Ride',
              { MMK: '18500', USD: '24.00', EUR: '21.00', THB: '450', SGD: '30.00', GBP: '18.00' },
              '3'
            )
          }
          className="px-2.5 py-1 bg-[#1A1D24] hover:bg-[#232732] text-slate-300 text-[11px] font-medium rounded-lg border border-white/5 transition whitespace-nowrap active:scale-95"
        >
          🚕 Ride (3p)
        </button>
        <button
          onClick={() =>
            handleQuickPreset(
              'Coffee & Boba',
              { MMK: '14000', USD: '14.00', EUR: '12.50', THB: '280', SGD: '18.00', GBP: '11.00' },
              '2'
            )
          }
          className="px-2.5 py-1 bg-[#1A1D24] hover:bg-[#232732] text-slate-300 text-[11px] font-medium rounded-lg border border-white/5 transition whitespace-nowrap active:scale-95"
        >
          ☕ Boba (2p)
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="px-6 pt-2 pb-6 space-y-4 overflow-y-auto max-h-[660px] scrollbar-thin">
        
        {/* 2. THE "PREMIUM RECEIPT" LIVE PREVIEW */}
        <div className="bg-[#171A21] border border-[#2B3140] rounded-2xl p-4 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: currentConfig.color }}
          />

          {/* Top Receipt Badge */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2 bg-[#1F232E] px-2.5 py-1 rounded-full border border-white/5">
              <span
                className="w-2 h-2 rounded-full shadow-sm"
                style={{ backgroundColor: currentConfig.color }}
              />
              <span className="text-[10px] font-bold tracking-wider text-slate-200 uppercase">
                {selectedMethod} RECEIPT • {selectedCurrency}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                {currentCurrencyConfig.symbol}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                READY TO SHARE
              </span>
            </div>
          </div>

          {/* Receipt Body: Formatted Text with Monospace Math */}
          <div className="space-y-2 text-xs text-slate-200 relative z-10">
            {eventName.trim().length > 0 && (
              <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                <span className="text-sm">🍽️</span>
                <span className="font-bold text-white truncate text-xs">{eventName.trim()}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-0.5 px-1">
              <div className="flex items-center gap-2 text-slate-400">
                <span>💰</span>
                <span>Total Amount:</span>
              </div>
              <span className="font-mono font-bold text-slate-100 text-sm">
                {calculation.formattedTotal}
              </span>
            </div>

            {/* HIGH-CONTRAST PER-PERSON BLOCK (Polite, NO 'Your Share') */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#202533] to-[#181C26] px-3.5 py-2.5 rounded-xl border border-white/10 shadow-inner relative overflow-hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm">
                  👥
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Per Person</span>
                  <span className="text-[10px] text-slate-400">
                    Equal split ({calculation.peopleNum || 1} {calculation.peopleNum === 1 ? 'person' : 'people'})
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className="font-mono font-extrabold text-base tracking-tight block"
                  style={{ color: currentConfig.color }}
                >
                  {calculation.formattedShare}
                </span>
                <span className="text-[9px] font-medium text-slate-400">
                  each
                </span>
              </div>
            </div>

            {activeAccount.length > 0 && (
              <div className="flex items-center justify-between bg-[#12151C] px-3 py-2 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="text-sm">📱</span>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                      Send via {selectedMethod}
                    </span>
                    <span className="font-mono text-slate-200 font-bold text-xs truncate block">
                      {activeAccount}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeAccount);
                    triggerHaptics();
                    showToast(`Copied ${selectedMethod} account!`);
                  }}
                  className="px-2 py-1 bg-white/10 hover:bg-white/15 text-[10px] font-bold text-slate-200 rounded-md transition whitespace-nowrap active:scale-95"
                >
                  Copy No.
                </button>
              </div>
            )}
          </div>

          {/* Dashed Horizontal Divider */}
          <div className="border-b border-dashed border-[#343B4E] my-3.5 relative z-10" />

          {/* Receipt Bottom: Centered Glowing QR Code Preview */}
          <div className="flex flex-col items-center justify-center relative z-10">
            {activeQR ? (
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-[104px] h-[104px] rounded-2xl overflow-hidden p-1.5 bg-black border-2 transition-all flex items-center justify-center shadow-lg"
                  style={{
                    borderColor: currentConfig.color,
                    boxShadow: `0 0 16px ${currentConfig.color}40`,
                  }}
                >
                  <img
                    src={activeQR}
                    alt="Payment QR Code"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-slate-200 font-semibold">
                    Scan with Any Banking App
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  KBZPay • Wave • AYA • CB Bank & all wallets
                </span>
              </div>
            ) : (
              <button
                type="button"
                id="btn-receipt-attach-qr"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center py-3 px-4 rounded-xl border border-dashed border-white/15 hover:border-blue-500/50 hover:bg-blue-500/5 w-full group transition text-center"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center mb-1 group-hover:bg-blue-500/20 transition">
                  <QrCode className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition" />
                </div>
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition">
                  + Attach Any Bank or Wallet QR Code
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Tap to upload QR screenshot (KBZ, AYA, Wave, CB, etc.)
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 3. INPUT CONTROLS */}
        <div className="space-y-3.5">
          {/* Currency Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Currency
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                <strong className="text-blue-400">{currentCurrencyConfig.code}</strong> ({currentCurrencyConfig.symbol})
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1 p-1 bg-[#181818] border border-[#2A2A2A] rounded-2xl">
              {SUPPORTED_CURRENCIES.map((code) => {
                const isSelected = selectedCurrency === code;
                const config = CURRENCY_CONFIGS[code];
                return (
                  <button
                    key={code}
                    id={`btn-currency-${code.toLowerCase()}`}
                    type="button"
                    onClick={() => handleCurrencyChange(code)}
                    className={`py-1.5 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={`${config.name} (${config.symbol})`}
                  >
                    <span className="text-xs font-bold leading-tight">{config.symbol}</span>
                    <span className="text-[9px] opacity-75 font-mono">{code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event / Location Name (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Event / Location Name
              </label>
              <span className="text-[10px] text-slate-500">Optional</span>
            </div>
            <input
              id="input-event-name"
              type="text"
              placeholder="e.g., Hotpot Dinner, Grab ride"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2E2E2E] focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition"
            />
          </div>

          {/* Numeric Row: Amount & Split */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-7">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  Total Bill Amount
                </label>
                <span className="text-[10px] text-slate-400 font-mono font-semibold">
                  {currentCurrencyConfig.symbol}
                </span>
              </div>
              <div className="relative flex items-center">
                {currentCurrencyConfig.placement === 'prefix' && (
                  <span className="absolute left-3.5 font-mono font-bold text-blue-400 text-sm pointer-events-none select-none">
                    {currentCurrencyConfig.symbol}
                  </span>
                )}
                <input
                  id="input-total-bill"
                  type="text"
                  inputMode="decimal"
                  placeholder={currentCurrencyConfig.sampleAmount}
                  value={totalBill}
                  onChange={(e) => setTotalBill(e.target.value)}
                  className={`w-full bg-[#1A1D24] border border-[#2B3140] focus:border-blue-500 rounded-xl py-2.5 text-sm font-mono font-semibold text-white placeholder:text-slate-500 outline-none transition ${
                    currentCurrencyConfig.placement === 'prefix' ? 'pl-8 pr-3.5' : 'pl-3.5 pr-12'
                  }`}
                />
                {currentCurrencyConfig.placement === 'suffix' && (
                  <span className="absolute right-3 font-mono font-bold text-blue-400 text-xs pointer-events-none select-none bg-[#242938] px-1.5 py-0.5 rounded border border-white/10">
                    {currentCurrencyConfig.symbol}
                  </span>
                )}
              </div>

              {/* Quick Increment Chips */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[9px] text-slate-500 font-medium uppercase">Add:</span>
                {(['MMK', 'THB'].includes(selectedCurrency)
                  ? [5000, 10000, 50000]
                  : [5, 10, 25]
                ).map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => handleAddAmount(inc)}
                    className="px-1.5 py-0.5 bg-[#202532] hover:bg-[#282F3F] border border-white/5 rounded text-[10px] font-mono font-bold text-slate-300 transition active:scale-95"
                  >
                    +{formatNumber(inc)}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-5">
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                No. of People
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptics();
                    const current = parseInt(numberOfPeople, 10) || 1;
                    if (current > 1) setNumberOfPeople(String(current - 1));
                  }}
                  className="w-8 h-10 bg-[#1A1D24] border border-[#2B3140] hover:bg-[#232732] rounded-lg text-slate-300 text-base font-bold flex items-center justify-center transition active:scale-95"
                >
                  -
                </button>
                <input
                  id="input-people-count"
                  type="text"
                  inputMode="numeric"
                  placeholder="2"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  className="w-full bg-[#1A1D24] border border-[#2B3140] focus:border-blue-500 rounded-xl py-2 text-center text-sm font-mono font-semibold text-white placeholder:text-slate-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptics();
                    const current = parseInt(numberOfPeople, 10) || 0;
                    setNumberOfPeople(String(current + 1));
                  }}
                  className="w-8 h-10 bg-[#1A1D24] border border-[#2B3140] hover:bg-[#232732] rounded-lg text-slate-300 text-base font-bold flex items-center justify-center transition active:scale-95"
                >
                  +
                </button>
              </div>

              {/* Quick People Count Pills */}
              <div className="flex items-center justify-between gap-1 mt-1.5">
                {['2', '3', '4', '5'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      triggerHaptics();
                      setNumberOfPeople(num);
                    }}
                    className={`flex-1 py-0.5 rounded text-[10px] font-mono font-bold transition active:scale-95 ${
                      numberOfPeople === num
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#202532] text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {num}p
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method Selector (Horizontal Chips) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Payment Provider
            </label>
            <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method;
                const config = PROVIDER_CONFIGS[method];
                const hasQR = !!qrCodes[method];
                return (
                  <button
                    key={method}
                    id={`btn-payment-${method.toLowerCase().replace(/\s+/g, '-')}`}
                    type="button"
                    onClick={() => {
                      triggerHaptics();
                      setSelectedMethod(method);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'text-white shadow-lg'
                        : 'bg-[#1E1E1E] border border-[#2E2E2E] text-slate-400 hover:text-slate-200'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: config.color,
                            boxShadow: `0 4px 12px ${config.color}50`,
                          }
                        : undefined
                    }
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{method}</span>
                    {hasQR && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account / Phone Number */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                {selectedMethod} Phone / Account Number
              </label>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" />
                AsyncStorage
              </span>
            </div>
            <input
              id="input-account-number"
              type="text"
              placeholder={`Enter your ${selectedMethod} details`}
              value={accounts[selectedMethod] || ''}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2E2E2E] focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder:text-slate-500 outline-none transition"
            />
          </div>

          {/* Bank / Payment QR Code Section (Supports Any Bank or Wallet) */}
          <div className="bg-[#181818] border border-[#282828] rounded-2xl p-3.5 space-y-2.5">
            {/* Header with clear title and friendly multi-bank badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Bank / Payment QR Code</h4>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Any Bank Accepted
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upload screenshot from <strong>any</strong> bank or wallet app (KBZPay, WavePay, AYA, CB Bank, PromptPay, etc.).
            </p>

            {/* Active QR Preview Card or Drag-and-Drop Dropzone */}
            {activeQR ? (
              <div className="bg-[#202020] border border-[#2E2E2E] rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-black border border-white/15 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                    <img
                      src={activeQR}
                      alt="Uploaded Bank QR"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">
                        Bank QR Attached
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Ready for receipts & 1-tap sharing
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    id="btn-replace-bank-qr"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-[#2A2A2A] hover:bg-[#333333] border border-white/10 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition active:scale-95"
                    title="Upload another bank QR code"
                  >
                    <RefreshCw className="w-3 h-3 text-slate-400" />
                    <span>Change QR</span>
                  </button>
                  <button
                    type="button"
                    id="btn-remove-bank-qr"
                    onClick={handleRemoveQR}
                    className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-400 rounded-lg transition active:scale-95"
                    title="Remove QR code"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processFile(file);
                }}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-[#333333] hover:border-slate-500 bg-[#1C1C1C]'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-0.5">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    id="btn-upload-bank-qr"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-white hover:text-blue-400 transition"
                  >
                    Upload Any Bank QR Code
                  </button>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Tap to browse or drag & drop QR screenshot
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      id="btn-choose-qr-file"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95"
                    >
                      Choose Image
                    </button>
                    <button
                      type="button"
                      id="btn-use-sample-qr"
                      onClick={handleUseSampleBankQR}
                      className="px-3 py-1.5 bg-[#262626] hover:bg-[#303030] text-slate-300 border border-white/10 text-xs font-semibold rounded-lg transition active:scale-95"
                    >
                      ✨ Try Demo QR
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. ACTION BUTTONS & SHARING HUB */}
        <div className="space-y-3 pt-2">
          {/* Live Copy Text Preview Box */}
          <div className="bg-[#151821] border border-[#282E3E] rounded-2xl p-3.5 shadow-lg relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                  Text to Share Preview
                </span>
              </div>

              {/* Format Style Selector */}
              <div className="flex items-center gap-1 bg-[#1A1E29] p-0.5 rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptics();
                    setCopyFormatStyle('friendly');
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                    copyFormatStyle === 'friendly'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ✨ Emoji
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptics();
                    setCopyFormatStyle('clean');
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                    copyFormatStyle === 'clean'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📝 Plain
                </button>
              </div>
            </div>

            {/* Monospace Code Preview Box */}
            <div className="bg-[#0E1017] border border-white/5 rounded-xl p-2.5 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-line select-all">
              {calculation.formattedMessage}
            </div>

            {/* Toggle: Include Per Person Amount */}
            <div className="flex items-center justify-between pt-2.5 px-0.5">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] text-slate-300 font-medium">
                  Include split line ({calculation.formattedShare})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptics();
                  setIncludePerPersonInCopy((prev) => !prev);
                }}
                className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  includePerPersonInCopy ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm block" />
              </button>
            </div>
          </div>

          {/* Primary: Share Bill & QR */}
          <button
            id="btn-share-bill-qr"
            type="button"
            disabled={!calculation.isValid || isSharing}
            onClick={handleShare}
            className={`w-full font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all ${
              calculation.isValid
                ? 'text-white active:scale-[0.98]'
                : 'bg-[#1A1D24] text-slate-600 border border-[#2B3140] cursor-not-allowed opacity-60'
            }`}
            style={
              calculation.isValid
                ? {
                    backgroundColor: currentConfig.color,
                    boxShadow: `0 4px 20px ${currentConfig.color}60`,
                  }
                : undefined
            }
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-extrabold tracking-wide">
              {isSharing
                ? 'Opening Share Dialog...'
                : activeQR
                ? 'Share Bill & QR Code'
                : 'Share Bill Summary'}
            </span>
          </button>

          {/* Secondary: Copy Text Only */}
          <button
            id="btn-copy-text-only"
            type="button"
            disabled={!calculation.isValid || isCopied}
            onClick={handleCopyTextOnly}
            className={`w-full font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 border transition-all text-xs active:scale-[0.98] ${
              isCopied
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md'
                : calculation.isValid
                ? 'bg-[#181B24] border-[#2A3142] hover:bg-[#202533] text-slate-200'
                : 'bg-[#14161E] border-[#222735] text-slate-600 cursor-not-allowed'
            }`}
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">✓ Clean Text Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>📋 Copy Text Only (Ready to Share)</span>
              </>
            )}
          </button>

          {/* Manual Save to History Button / Feedback */}
          <button
            id="btn-save-to-history"
            type="button"
            disabled={!calculation.isValid}
            onClick={() => saveCalculationToHistory(calculation)}
            className={`w-full font-semibold py-2.5 rounded-2xl flex items-center justify-center gap-2 border transition-all text-xs active:scale-[0.98] ${
              isSavedFeedback
                ? 'bg-blue-950/50 border-blue-500 text-blue-300'
                : calculation.isValid
                ? 'bg-[#14161F] border-[#232838] hover:bg-[#1C2130] text-slate-300'
                : 'bg-[#12141A] border-[#1C202B] text-slate-600 cursor-not-allowed'
            }`}
          >
            {isSavedFeedback ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>✓ Saved to History!</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Save to History</span>
              </>
            )}
          </button>

          {notificationMsg && (
            <p className="text-center text-xs text-emerald-400 font-medium animate-fade-in pt-1">
              ✓ {notificationMsg}
            </p>
          )}
        </div>

        {/* 6. HISTORY SECTION (Last 5 Calculations in Storage) */}
        <div className="mt-5 bg-[#181818] border border-[#262626] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Recent Splits
              </h3>
              <span className="px-1.5 py-0.5 rounded-full bg-[#262626] text-[10px] font-mono text-slate-400">
                {history.length}/5
              </span>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[11px] font-medium text-red-400 hover:text-red-300 transition flex items-center gap-1"
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-xs text-slate-500 leading-relaxed">
                No recent splits yet. Your last 5 calculations will automatically appear here for quick retrieval.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleRetrieveHistory(item)}
                  className="group p-2.5 bg-[#202020] hover:bg-[#252525] border border-[#2D2D2D] hover:border-slate-600 rounded-xl transition-all cursor-pointer select-none"
                  title="Click to retrieve calculation"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {item.eventName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                        • {item.dateStr}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-blue-400 group-hover:text-blue-300 flex items-center gap-0.5 flex-shrink-0 bg-blue-950/40 border border-blue-900/50 px-1.5 py-0.5 rounded-md">
                      <span>Load</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  <div className="flex items-end justify-between pt-1.5 border-t border-white/5">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                        Per Person
                      </span>
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {item.formattedShare}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-slate-300 block">
                        Total: {item.formattedTotal}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.numberOfPeople} people • {item.provider}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
