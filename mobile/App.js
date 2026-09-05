import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Share,
  Modal,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

const PAYMENT_PROVIDERS = [
  { id: 'KPay', label: 'KPay', color: '#2563EB' },
  { id: 'AYA Pay', label: 'AYA Pay', color: '#E11D48' },
  { id: 'WavePay', label: 'WavePay', color: '#EAB308' },
  { id: 'Bank Transfer', label: 'Bank Transfer', color: '#10B981' },
];

const CURRENCIES = [
  { id: 'MMK', symbol: 'Ks', label: 'MMK (Ks)', placement: 'suffix', sample: '145000' },
  { id: 'USD', symbol: '$', label: 'USD ($)', placement: 'prefix', sample: '85.00' },
  { id: 'EUR', symbol: '€', label: 'EUR (€)', placement: 'prefix', sample: '75.50' },
  { id: 'THB', symbol: '฿', label: 'THB (฿)', placement: 'prefix', sample: '2400' },
  { id: 'SGD', symbol: 'S$', label: 'SGD (S$)', placement: 'prefix', sample: '110.00' },
  { id: 'GBP', symbol: '£', label: 'GBP (£)', placement: 'prefix', sample: '65.00' },
];

const DEMO_PRESETS = [
  {
    name: 'Hotpot Dinner',
    amounts: { MMK: '145000', USD: '140.00', EUR: '130.00', THB: '4800', SGD: '180.00', GBP: '110.00' },
    people: '4',
    icon: '🍲',
    desc: '4 people equal split',
  },
  {
    name: 'Friday Ride',
    amounts: { MMK: '18500', USD: '24.00', EUR: '21.00', THB: '450', SGD: '30.00', GBP: '18.00' },
    people: '3',
    icon: '🚕',
    desc: '3 people cab fare',
  },
  {
    name: 'Coffee & Boba',
    amounts: { MMK: '14000', USD: '14.00', EUR: '12.50', THB: '280', SGD: '18.00', GBP: '11.00' },
    people: '2',
    icon: '☕',
    desc: '2 people afternoon drinks',
  },
  {
    name: 'BBQ Gathering',
    amounts: { MMK: '280000', USD: '260.00', EUR: '240.00', THB: '8900', SGD: '340.00', GBP: '210.00' },
    people: '6',
    icon: '🍖',
    desc: '6 people meat & grill',
  },
  {
    name: 'Party Drinks',
    amounts: { MMK: '95000', USD: '90.00', EUR: '85.00', THB: '3200', SGD: '120.00', GBP: '75.00' },
    people: '5',
    icon: '🥂',
    desc: '5 people night out',
  },
];

const DEFAULT_ACCOUNTS = {
  KPay: '09771234567',
  'AYA Pay': '09771234567',
  WavePay: '09251234119',
  'Bank Transfer': 'CB Bank - 2001-3849-2910',
};

const SAMPLE_QR_KPAY =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAAByklEQVR42u1bWw7CMAzLDfjkBPxwLY7PJUBCmgrNSpM+nUTaB1TaWq9e6zoy3R5P6XW53t/X8ePnb97+aflpP1rO2vOLbZcOnhSAhwJI31HNLcMBjwZQANYZMNtx/twJANguyp9M/fg1gJfTOH81esCFJaoAeD6N86FWjr8V8Coa56OdAXgEAOmWNgPwchoXFpdRM7yWxlMB70DjnoD/LuvbSstJ+/BCGrPTIAAsOjmspfHZzjRKSy+n8dkkDwe8lbSsBbzDdzjzJRI6AOmjCB2AlImEDkDKRPJA43Qw5IHG6YSRBxqnE0noAKRMJA805ldpwzRmANumMbMtOZKWHmicdkEeaPy1SnugcXqLV2lpm8b8edgwjWvPwybPyS6lpXkaa1ZpMywgDzRWGgBGpGW4lg5cS/M0rjoPm5WW4Vpady090DjtwqW0DNcyCuJREMeWluFaRkE8CuLA0jJcyyiIR0HcgrQM1zIK4lEQR5WWXcLDSK5l9/AwQEEcOiGuKYhLc0sWpKUutwTpWranS8Fcyy6BaaSCOHpCXCwtdelSbNdSF5hGdS0NJMRlBXHdtmRBWuryw3iuZXu6FM+1bAGMGuPBTYhLP6UXEkoMa18mWr0AAAAASUVORK5CYII=';
const SAMPLE_QR_WAVEPAY =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAAByklEQVR42u1byw7CMAzLkRtH/oHf56/4CpCQpkKz0qRPJ5F2gEpb69VrXUem5+Miva63+/s6fvz8zds/LT/tR8tZe36x7dLBkwLwUADpO6q5ZTjg0QAKwDoDZjvOnzsBANtF+ZOpH78G8HIa569GD7iwRBUAz6dxPtTK8bcCXkXjfLQzAI8AIN3SZgBeTuPC4jJqhtfSeCrgHWjcE/DfZX1baTlpH15IY3YaBIBFJ4e1ND7bmUZp6eU0Ppvk4YC3kpa1gHf4Dme+REIHIH0UoQOQMpHQAUiZSB5onA6GPNA4nTDyQON0IgkdgJSJ5IHG/CptmMYMYNs0ZrYlR9LSA43TLsgDjb9WaQ80Tm/xKi1t05g/Dxumce152OQ52aW0NE9jzSpthgXkgcZKA8CItAzX0oFraZ7GVedhs9IyXEvrrqUHGqdduJSW4VpGQTwK4tjSMlzLKIhHQRxYWoZrGQXxKIhbkJbhWkZBPAriqNKyS3gYybXsHh4GKIhDJ8Q1BXFpbsmCtNTlliBdy/Z0KZhr2SUwjVQQR0+Ii6WlLl2K7VrqAtOorqWBhLisIK7blixIS11+GM+1bE+X4rmWLYBRYzy4CXHpp/QC3j12lkvYFu8AAAAASUVORK5CYII=';
const SAMPLE_QR_BANK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAAByUlEQVR42u1bWw7CMAzLDeCPO3BLjsXtQEKaCs1Kkz6dRNoHVNpar17rOjJdnw/pdbnd39fx4+dv3v5p+Wk/Ws7a84ttlw6eFICHAkjfUc0twwGPBlAA1hkw23H+3AkA2C7Kn0z9+DWAl9M4fzV6wIUlqgB4Po3zoVaOvxXwKhrno50BeAQA6ZY2A/ByGhcWl1EzvJbGUwHvQOOegP8u69tKy0n78EIas9MgACw6Oayl8dnONEpLL6fx2SQPB7yVtKwFvMN3OPMlEjoA6aMIHYCUiYQOQMpE8kDjdDDkgcbphJEHGqcTSegApEwkDzTmV2nDNGYA26Yxsy05kpYeaJx2QR5o/LVKe6BxeotXaWmbxvx52DCNa8/DJs/JLqWleRprVmkzLCAPNFYaAEakZbiWDlxL8zSuOg+blZbhWlp3LT3QOO3CpbQM1zIK4lEQx5aW4VpGQTwK4sDSMlzLKIhHQdyCtAzXMgriURBHlZZdwsNIrmX38DBAQRw6Ia4piEtzSxakpS63BOlatqdLwVzLLoFppII4ekJcLC116VJs11IXmEZ1LQ0kxGUFcd22ZEFa6vLDeK5le7oUz7VsAYwa48FNiEs/pRf2B+Nfxx6G9wAAAABJRU5ErkJggg==';

const DEFAULT_QR_CODES = {
  KPay: SAMPLE_QR_KPAY,
  'AYA Pay': null,
  WavePay: SAMPLE_QR_WAVEPAY,
  'Bank Transfer': null,
};

const STORAGE_KEY = '@bill_splitter_data_v2';
const HISTORY_STORAGE_KEY = '@bill_splitter_history_v1';

const formatNumber = (val) => {
  if (isNaN(val) || val === null || val === undefined) return '0';
  const parts = val.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const ANDROID_TOP_INSET = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0;

function NavTabIcon({ name, active }) {
  const color = active ? '#2DD4BF' : '#8E8E93';
  if (name === 'split') {
    return (
      <View style={navIconStyles.box}>
        <View style={[navIconStyles.receipt, { borderColor: color }]}>
          <View style={[navIconStyles.receiptLine, { backgroundColor: color }]} />
          <View style={[navIconStyles.receiptLineShort, { backgroundColor: color }]} />
          <View style={[navIconStyles.receiptLine, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }
  if (name === 'payment') {
    return (
      <View style={navIconStyles.qrBox}>
        <View style={[navIconStyles.qrFinder, { top: 0, left: 0, borderColor: color }]} />
        <View style={[navIconStyles.qrFinder, { top: 0, right: 0, borderColor: color }]} />
        <View style={[navIconStyles.qrFinder, { bottom: 0, left: 0, borderColor: color }]} />
        <View style={[navIconStyles.qrFinderInner, { top: 2.5, left: 2.5, backgroundColor: color }]} />
        <View style={[navIconStyles.qrFinderInner, { top: 2.5, right: 2.5, backgroundColor: color }]} />
        <View style={[navIconStyles.qrFinderInner, { bottom: 2.5, left: 2.5, backgroundColor: color }]} />
        <View style={[navIconStyles.qrCell, { right: 1, bottom: 1, backgroundColor: color }]} />
        <View style={[navIconStyles.qrCell, { right: 6, bottom: 6, backgroundColor: color }]} />
        <View style={[navIconStyles.qrCell, { right: 1, bottom: 6, backgroundColor: color }]} />
      </View>
    );
  }
  return (
    <View style={navIconStyles.box}>
      <View style={[navIconStyles.clock, { borderColor: color }]}>
        <View style={[navIconStyles.clockHour, { backgroundColor: color }]} />
        <View style={[navIconStyles.clockMinute, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

const navIconStyles = StyleSheet.create({
  box: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  receipt: {
    width: 15,
    height: 18,
    borderWidth: 1.6,
    borderRadius: 3,
    paddingHorizontal: 2.5,
    paddingVertical: 3,
    justifyContent: 'space-between',
  },
  receiptLine: { height: 1.5, borderRadius: 1 },
  receiptLineShort: { height: 1.5, borderRadius: 1, width: '65%' },
  qrBox: { width: 20, height: 20, position: 'relative' },
  qrFinder: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderWidth: 1.7,
    borderRadius: 1.5,
  },
  qrFinderInner: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 0.5,
  },
  qrCell: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 0.5,
  },
  clock: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockHour: { position: 'absolute', width: 1.5, height: 5, top: 3, borderRadius: 1 },
  clockMinute: { position: 'absolute', width: 5, height: 1.5, left: 9, top: 8, borderRadius: 1 },
});

export default function App() {
  const [eventName, setEventName] = useState('Hotpot Dinner');
  const [totalBill, setTotalBill] = useState('145000');
  const [numberOfPeople, setNumberOfPeople] = useState('4');
  const [selectedProvider, setSelectedProvider] = useState('KPay');
  const [selectedCurrency, setSelectedCurrency] = useState('MMK');
  const [accounts, setAccounts] = useState({ ...DEFAULT_ACCOUNTS });
  const [qrCodes, setQrCodes] = useState({ ...DEFAULT_QR_CODES });
  const [isCopied, setIsCopied] = useState(false);
  const [isCardCopied, setIsCardCopied] = useState(false);
  const [isQrCopied, setIsQrCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeNavTab, setActiveNavTab] = useState('split');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [includePerPersonInCopy, setIncludePerPersonInCopy] = useState(true);
  const [copyFormatStyle, setCopyFormatStyle] = useState('friendly');

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.accounts) setAccounts((prev) => ({ ...prev, ...parsed.accounts }));
          if (parsed.qrCodes) setQrCodes((prev) => ({ ...prev, ...parsed.qrCodes }));
          if (parsed.currency) setSelectedCurrency(parsed.currency);
        }

        const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          if (Array.isArray(parsedHistory)) {
            setHistory(parsedHistory.slice(0, 5));
          }
        }
      } catch (error) {
        console.error('Error reading data from AsyncStorage:', error);
      }
    };
    loadPersistedData();
  }, []);

  const persistData = async (newAccounts, newQrCodes, newCurrency = selectedCurrency) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accounts: newAccounts,
          qrCodes: newQrCodes,
          currency: newCurrency,
        })
      );
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  const triggerHaptics = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Haptics are optional on web / unsupported devices
    }
  };

  const showToast = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 2500);
  };

  const handleAccountChange = useCallback(
    (text) => {
      const updatedAccounts = {
        ...accounts,
        [selectedProvider]: text,
      };
      setAccounts(updatedAccounts);
      persistData(updatedAccounts, qrCodes, selectedCurrency);
    },
    [accounts, qrCodes, selectedProvider, selectedCurrency]
  );

  const handlePickQrImage = async () => {
    try {
      await Haptics.selectionAsync();
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photos to upload a payment QR code.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        const updatedQrCodes = {
          ...qrCodes,
          [selectedProvider]: imageUri,
        };
        setQrCodes(updatedQrCodes);
        persistData(accounts, updatedQrCodes);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast('Bank QR Code attached successfully!');
      }
    } catch (error) {
      console.error('Failed to pick QR image:', error);
      Alert.alert('Error', 'Could not select the QR image. Please try again.');
    }
  };

  const handleRemoveQrImage = async () => {
    await Haptics.selectionAsync();
    const updatedQrCodes = {
      ...qrCodes,
      [selectedProvider]: null,
    };
    setQrCodes(updatedQrCodes);
    persistData(accounts, updatedQrCodes);
    showToast('Bank QR Code removed');
  };

  const handleSetSampleQR = async (method) => {
    await triggerHaptics();
    const sample =
      method === 'KPay' ? SAMPLE_QR_KPAY : method === 'WavePay' ? SAMPLE_QR_WAVEPAY : SAMPLE_QR_BANK;
    const updatedQrCodes = {
      ...qrCodes,
      [method]: sample,
    };
    setQrCodes(updatedQrCodes);
    persistData(accounts, updatedQrCodes);
    showToast(`Sample ${method} QR attached!`);
  };

  const currentProviderConfig = useMemo(() => {
    return PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider) || PAYMENT_PROVIDERS[0];
  }, [selectedProvider]);

  const currentCurrencyConfig = useMemo(() => {
    return CURRENCIES.find((c) => c.id === selectedCurrency) || CURRENCIES[0];
  }, [selectedCurrency]);

  const activeAccount = accounts[selectedProvider] || '';
  const activeQrUri = qrCodes[selectedProvider] || null;

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
      : totalBill.trim() || '0';

    const formattedShare =
      currentCurrencyConfig.placement === 'prefix'
        ? `${currentCurrencyConfig.symbol}${formattedShareNum}`
        : `${formattedShareNum} ${currentCurrencyConfig.symbol}`;

    const formattedTotal =
      currentCurrencyConfig.placement === 'prefix'
        ? `${currentCurrencyConfig.symbol}${formattedTotalNum}`
        : `${formattedTotalNum} ${currentCurrencyConfig.symbol}`;

    const lines = [];
    const isFriendly = copyFormatStyle === 'friendly';
    const peopleCountStr = peopleNum > 1 ? ` (${peopleNum} people)` : '';

    if (eventName.trim().length > 0) {
      lines.push(isFriendly ? `🍽️ ${eventName.trim()}` : eventName.trim());
    }
    lines.push(
      isFriendly
        ? `💰 Total: ${formattedTotal}${peopleCountStr}`
        : `Total: ${formattedTotal}${peopleCountStr}`
    );
    if (includePerPersonInCopy && isValid) {
      lines.push(isFriendly ? `👥 Per Person: ${formattedShare}` : `Per Person: ${formattedShare}`);
    }
    if (activeAccount.trim().length > 0) {
      lines.push(
        isFriendly
          ? `📱 Send via ${selectedProvider}: ${activeAccount.trim()}`
          : `Send via ${selectedProvider}: ${activeAccount.trim()}`
      );
    }
    if (activeQrUri) {
      lines.push(
        isFriendly
          ? `📷 QR Code: Included (Scan with ${selectedProvider})`
          : `QR Code: Attached (${selectedProvider})`
      );
    }

    return {
      isValid,
      billNum: isNaN(billNum) ? 0 : billNum,
      peopleNum: isNaN(peopleNum) ? 0 : peopleNum,
      formattedTotal,
      formattedShare,
      formattedMessage: lines.join('\n'),
    };
  }, [
    eventName,
    totalBill,
    numberOfPeople,
    selectedProvider,
    activeAccount,
    activeQrUri,
    selectedCurrency,
    currentCurrencyConfig,
    includePerPersonInCopy,
    copyFormatStyle,
  ]);

  const saveCalculationToHistory = useCallback(
    async (customCalculation = null) => {
      const calc = customCalculation || calculation;
      if (!calc || !calc.isValid) return;

      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          dateStr: timeStr,
          eventName: eventName.trim() || 'Bill Split',
          totalBill: totalBill.trim(),
          numberOfPeople: numberOfPeople.trim() || '2',
          currency: selectedCurrency,
          provider: selectedProvider,
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
          const updatedHistory = filtered.slice(0, 5);
          AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory)).catch((err) =>
            console.error('Error saving history to AsyncStorage:', err)
          );
          return updatedHistory;
        });

        setIsSavedFeedback(true);
        setTimeout(() => setIsSavedFeedback(false), 2000);
      } catch (error) {
        console.error('Error saving to history:', error);
      }
    },
    [calculation, eventName, totalBill, numberOfPeople, selectedCurrency, selectedProvider]
  );

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
    selectedProvider,
    saveCalculationToHistory,
  ]);

  const shareQrOrText = async () => {
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (activeQrUri && isSharingAvailable) {
      await Clipboard.setStringAsync(calculation.formattedMessage);
      await Sharing.shareAsync(activeQrUri, {
        dialogTitle: `Bill Split: ${calculation.formattedShare} per person`,
        mimeType: 'image/jpeg',
        UTI: 'public.jpeg',
      });
      return true;
    }
    await Share.share({
      message: calculation.formattedMessage,
      title: 'Bill Splitter Summary',
    });
    return false;
  };

  const handleShareBillAndQR = async () => {
    if (!calculation.isValid) return;
    try {
      setIsSharing(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      saveCalculationToHistory(calculation);
      await shareQrOrText();
    } catch (error) {
      console.error('Error sharing bill:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyTextOnly = async () => {
    if (!calculation.isValid) return;
    try {
      await Clipboard.setStringAsync(calculation.formattedMessage);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      saveCalculationToHistory(calculation);
      setIsCopied(true);
      showToast('Text copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying text to clipboard:', error);
    }
  };

  const handleCopyAccountOnly = async () => {
    if (!activeAccount.trim()) return;
    await triggerHaptics();
    try {
      await Clipboard.setStringAsync(activeAccount.trim());
      showToast(`${selectedProvider} number copied!`);
    } catch (error) {
      console.error('Account copy failed:', error);
    }
  };

  const copyImageFromUri = async (uri) => {
    if (!uri) return false;
    if (uri.startsWith('data:image') && uri.includes(',')) {
      const base64 = uri.split(',')[1];
      if (Clipboard.setImageAsync) {
        await Clipboard.setImageAsync(base64);
        return true;
      }
    }
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(uri, {
        dialogTitle: 'Payment QR',
        mimeType: 'image/png',
      });
      return true;
    }
    return false;
  };

  const handleCopyQrImageOnly = async () => {
    if (!activeQrUri) return;
    await triggerHaptics();
    try {
      const success = await copyImageFromUri(activeQrUri);
      if (success) {
        setIsQrCopied(true);
        showToast('QR Code image copied!');
        setTimeout(() => setIsQrCopied(false), 2000);
      }
    } catch (error) {
      console.error('QR image copy failed:', error);
    }
  };

  const handleCopyReceiptCard = async () => {
    if (!calculation.isValid) return;
    await triggerHaptics();
    saveCalculationToHistory(calculation);
    try {
      await Clipboard.setStringAsync(calculation.formattedMessage);
      if (activeQrUri) {
        await copyImageFromUri(activeQrUri);
      }
      setIsCardCopied(true);
      showToast('Receipt ready! Paste or share from the sheet.');
      setTimeout(() => setIsCardCopied(false), 2500);
    } catch (error) {
      console.error('Copy receipt failed:', error);
      setIsReceiptModalOpen(true);
    }
  };

  const handleDownloadReceipt = async () => {
    await triggerHaptics();
    try {
      if (activeQrUri) {
        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (isSharingAvailable) {
          await Sharing.shareAsync(activeQrUri, {
            dialogTitle: 'Save receipt QR',
            mimeType: 'image/png',
          });
          showToast('Receipt & QR image ready to save!');
          return;
        }
      }
      await Clipboard.setStringAsync(calculation.formattedMessage);
      showToast('Receipt text copied. Attach a QR from Pay & QR to save an image.');
    } catch (error) {
      console.error('Download receipt failed:', error);
    }
  };

  const handleOpenReceiptModal = async () => {
    if (!calculation.isValid) return;
    await triggerHaptics();
    setIsReceiptModalOpen(true);
  };

  const handleAddAmount = async (increment) => {
    await triggerHaptics();
    const current = parseFloat(totalBill.replace(/[^0-9.]/g, '')) || 0;
    const nextVal = current + increment;
    const isDecimal = ['USD', 'EUR', 'GBP', 'SGD'].includes(selectedCurrency);
    setTotalBill(isDecimal ? nextVal.toFixed(2) : String(Math.round(nextVal)));
  };

  const handleCurrencyChange = async (currId) => {
    await triggerHaptics();
    setSelectedCurrency(currId);
    persistData(accounts, qrCodes, currId);
    const curr = CURRENCIES.find((c) => c.id === currId);
    showToast(`Currency set to ${currId} (${curr ? curr.symbol : ''})`);
  };

  const handleRetrieveHistory = async (item) => {
    try {
      await Haptics.selectionAsync();
      setEventName(item.eventName === 'Bill Split' ? '' : item.eventName);
      setTotalBill(item.totalBill);
      setNumberOfPeople(item.numberOfPeople);
      if (item.currency) setSelectedCurrency(item.currency);
      if (item.provider) setSelectedProvider(item.provider);
      setActiveNavTab('split');
      showToast(`Restored split: ${item.formattedShare} per person`);
    } catch (error) {
      console.error('Error retrieving history item:', error);
    }
  };

  const handleDeleteHistoryItem = async (id) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
          console.error('Error updating history in AsyncStorage:', err)
        );
        return updated;
      });
      showToast('Split removed from history');
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setHistory([]);
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      showToast('Calculation history cleared');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleResetDemo = async () => {
    await triggerHaptics();
    setEventName('Hotpot Dinner');
    setTotalBill(currentCurrencyConfig.sample);
    setNumberOfPeople('4');
    showToast('Reset to demo split');
  };

  const handleResetAllData = () => {
    Alert.alert('Reset all stored data?', 'This restores demo accounts, QR codes, and history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await triggerHaptics();
          const nextAccounts = { ...DEFAULT_ACCOUNTS };
          const nextQr = { ...DEFAULT_QR_CODES };
          setAccounts(nextAccounts);
          setQrCodes(nextQr);
          setHistory([]);
          setSelectedCurrency('MMK');
          setEventName('Hotpot Dinner');
          setTotalBill('145000');
          setNumberOfPeople('4');
          setIsSideDrawerOpen(false);
          await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
          persistData(nextAccounts, nextQr, 'MMK');
          showToast('All data reset to defaults');
        },
      },
    ]);
  };

  const headerSubtitle =
    activeNavTab === 'split'
      ? 'Split bills & share polite receipts'
      : activeNavTab === 'payment'
      ? 'Manage payment info & bank QR'
      : 'Past group bill calculations';

  const amountIncrements = ['MMK', 'THB'].includes(selectedCurrency)
    ? [5000, 10000, 50000]
    : [5, 10, 25];

  const renderSplitTab = () => (
    <View style={styles.tabStack}>
      <View style={styles.eventRow}>
        <Text style={styles.eventEmoji}>🍽️</Text>
        <TextInput
          style={styles.eventInput}
          placeholder="Event / Location Name (e.g. Hotpot Dinner)"
          placeholderTextColor="#636366"
          value={eventName}
          onChangeText={setEventName}
          returnKeyType="next"
        />
        {eventName ? (
          <TouchableOpacity onPress={() => setEventName('')} hitSlop={8}>
            <Text style={styles.clearX}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.card}>
        <View style={styles.heroTop}>
          <View style={styles.heroBadgeRow}>
            <View style={[styles.dot, { backgroundColor: currentProviderConfig.color }]} />
            <Text style={styles.mutedSmall}>
              {selectedProvider} · {selectedCurrency}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleOpenReceiptModal}
            disabled={!calculation.isValid}
            style={[styles.previewChip, !calculation.isValid && styles.disabled]}
          >
            <Text style={styles.previewChipText}>👁 Preview</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCenter}>
          <Text style={styles.heroLabel}>
            PER PERSON · {calculation.peopleNum || 0}{' '}
            {calculation.peopleNum === 1 ? 'PERSON' : 'PEOPLE'}
          </Text>
          <Text style={styles.heroAmount}>{calculation.formattedShare}</Text>
          <Text style={styles.heroSub}>
            of {calculation.formattedTotal} total
            {eventName.trim() ? ` · ${eventName.trim()}` : ''}
          </Text>
          <View
            style={[
              styles.equalBadge,
              { backgroundColor: `${currentProviderConfig.color}22` },
            ]}
          >
            <Text style={[styles.equalBadgeText, { color: currentProviderConfig.color }]}>
              {calculation.isValid ? 'Equal split' : 'Enter bill'}
            </Text>
          </View>
        </View>

        {activeAccount.trim().length > 0 ? (
          <View style={styles.accountStrip}>
            <Text style={styles.mutedSmall}>{selectedProvider}</Text>
            <View style={styles.accountStripRight}>
              <Text style={styles.accountMono} numberOfLines={1}>
                {activeAccount}
              </Text>
              <TouchableOpacity onPress={handleCopyAccountOnly} hitSlop={8}>
                <Text style={styles.copyGlyph}>⧉</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {activeQrUri ? (
          <View style={styles.qrStrip}>
            <View style={styles.qrStripImageWrap}>
              <Image source={{ uri: activeQrUri }} style={styles.qrStripImage} resizeMode="contain" />
            </View>
            <View style={styles.qrStripInfo}>
              <Text style={styles.qrStripTitle}>Scan to pay</Text>
              <Text style={styles.mutedTiny} numberOfLines={1}>
                {selectedProvider} QR · friends can scan
              </Text>
              <View style={styles.qrStripActions}>
                <TouchableOpacity
                  onPress={handleCopyQrImageOnly}
                  style={[styles.miniPill, isQrCopied && styles.miniPillSuccess]}
                >
                  <Text style={[styles.miniPillText, isQrCopied && styles.miniPillTextSuccess]}>
                    {isQrCopied ? 'Copied' : 'Copy QR'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDownloadReceipt} style={styles.miniIconBtn}>
                  <Text style={styles.miniPillText}>↓</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.card}>
        <View style={styles.billPeopleRow}>
          <View style={styles.billCol}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Total bill</Text>
              <Text style={styles.monoDim}>{currentCurrencyConfig.symbol}</Text>
            </View>
            <View style={styles.billInputWrap}>
              {currentCurrencyConfig.placement === 'prefix' ? (
                <Text style={styles.currencyAffix}>{currentCurrencyConfig.symbol}</Text>
              ) : null}
              <TextInput
                style={[
                  styles.billInput,
                  currentCurrencyConfig.placement === 'prefix' && { paddingLeft: 28 },
                ]}
                placeholder={currentCurrencyConfig.sample}
                placeholderTextColor="#636366"
                keyboardType="numeric"
                value={totalBill}
                onChangeText={setTotalBill}
                returnKeyType="next"
              />
              {currentCurrencyConfig.placement === 'suffix' ? (
                <Text style={styles.currencySuffix}>{currentCurrencyConfig.symbol}</Text>
              ) : null}
            </View>
            <View style={styles.chipRowWrap}>
              {amountIncrements.map((inc) => (
                <TouchableOpacity
                  key={inc}
                  onPress={() => handleAddAmount(inc)}
                  style={styles.incChip}
                >
                  <Text style={styles.incChipText}>+{formatNumber(inc)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.peopleCol}>
            <Text style={styles.fieldLabel}>People</Text>
            <View style={styles.peopleStepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={async () => {
                  await triggerHaptics();
                  const current = parseInt(numberOfPeople, 10) || 1;
                  if (current > 1) setNumberOfPeople(String(current - 1));
                }}
              >
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.peopleInput}
                placeholder="2"
                placeholderTextColor="#636366"
                keyboardType="number-pad"
                value={numberOfPeople}
                onChangeText={setNumberOfPeople}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={async () => {
                  await triggerHaptics();
                  const current = parseInt(numberOfPeople, 10) || 0;
                  setNumberOfPeople(String(current + 1));
                }}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chipRowWrap}>
              {['2', '3', '4', '5'].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={async () => {
                    await triggerHaptics();
                    setNumberOfPeople(num);
                  }}
                  style={[styles.peopleChip, numberOfPeople === num && styles.peopleChipOn]}
                >
                  <Text
                    style={[styles.peopleChipText, numberOfPeople === num && styles.peopleChipTextOn]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.payingRow}
          onPress={async () => {
            await triggerHaptics();
            setActiveNavTab('payment');
          }}
        >
          <View style={styles.payingLeft}>
            <View style={[styles.walletDot, { backgroundColor: currentProviderConfig.color }]}>
              <Text style={styles.walletGlyph}>₩</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payingLabel}>Paying to</Text>
              <Text style={styles.payingValue} numberOfLines={1}>
                {selectedProvider}
                {activeAccount ? ` · ${activeAccount}` : ''}
              </Text>
            </View>
          </View>
          <Text style={styles.changeLink}>Change ›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.primaryPill, !calculation.isValid && styles.primaryPillDisabled]}
        onPress={handleShareBillAndQR}
        disabled={!calculation.isValid || isSharing}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryPillText}>
          {isSharing
            ? 'Preparing Share Sheet...'
            : activeQrUri
            ? 'Share Bill & QR Image'
            : 'Share Bill Summary'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.receiptAction, isCardCopied && styles.receiptActionSuccess]}
        onPress={handleCopyReceiptCard}
        disabled={!calculation.isValid || isCardCopied}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.receiptActionTitle, isCardCopied && styles.successText]}>
            {isCardCopied
              ? '✓ Receipt Image Copied!'
              : `Copy Receipt Image ${activeQrUri ? '+ QR Code' : ''}`}
          </Text>
          <Text style={styles.receiptActionSub}>
            {isCardCopied
              ? 'Ready to paste as photo in chat'
              : 'Copies high-res photo to paste directly into chat'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOpenReceiptModal}
          disabled={!calculation.isValid}
          style={styles.eyeBtn}
        >
          <Text style={styles.mutedSmall}>👁</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.twoCol}>
        <TouchableOpacity
          style={[styles.secondaryPill, isCopied && styles.receiptActionSuccess]}
          onPress={handleCopyTextOnly}
          disabled={!calculation.isValid || isCopied}
        >
          <Text style={[styles.secondaryPillText, isCopied && styles.successText]}>
            {isCopied ? 'Text Copied!' : 'Copy Text Only'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryPill}
          onPress={handleDownloadReceipt}
          disabled={!calculation.isValid}
        >
          <Text style={styles.secondaryPillText}>Save PNG</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.bookmarkBtn}
        onPress={() => saveCalculationToHistory(calculation)}
        disabled={!calculation.isValid}
      >
        <Text style={[styles.bookmarkText, isSavedFeedback && styles.accentText]}>
          {isSavedFeedback ? '✓ Saved to History' : 'Bookmark this Split'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toolsHint}
        onPress={async () => {
          await triggerHaptics();
          setIsSideDrawerOpen(true);
        }}
      >
        <Text style={styles.mutedSmall}>⚡ Presets & currency ({selectedCurrency})</Text>
        <Text style={styles.accentText}>Tools</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentTab = () => (
    <View style={styles.tabStack}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment provider</Text>
        <Text style={styles.mutedTiny}>Wallet or bank for friends to pay</Text>
        <View style={{ marginTop: 12, gap: 8 }}>
          {PAYMENT_PROVIDERS.map((provider) => {
            const isSelected = selectedProvider === provider.id;
            const hasQR = !!qrCodes[provider.id];
            return (
              <TouchableOpacity
                key={provider.id}
                style={[styles.providerRow, isSelected && styles.providerRowOn]}
                onPress={async () => {
                  await triggerHaptics();
                  setSelectedProvider(provider.id);
                }}
              >
                <View style={styles.payingLeft}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isSelected ? provider.color : `${provider.color}99` },
                    ]}
                  />
                  <Text style={[styles.providerName, isSelected && styles.providerNameOn]}>
                    {provider.label}
                  </Text>
                </View>
                <View style={styles.payingLeft}>
                  {hasQR ? <View style={styles.qrReadyDot} /> : null}
                  {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginTop: 14 }}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>{selectedProvider} phone / account</Text>
            <Text style={styles.accentTiny}>Auto-saved</Text>
          </View>
          <View style={styles.accountInputWrap}>
            <TextInput
              style={styles.accountInput}
              placeholder={`Enter your ${selectedProvider} details`}
              placeholderTextColor="#636366"
              value={activeAccount}
              onChangeText={handleAccountChange}
              keyboardType={selectedProvider === 'Bank Transfer' ? 'default' : 'phone-pad'}
              returnKeyType="done"
            />
            {activeAccount ? (
              <TouchableOpacity onPress={handleCopyAccountOnly} style={styles.inlineCopy}>
                <Text style={styles.inlineCopyText}>Copy</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.labelRow}>
          <Text style={styles.sectionTitle}>{selectedProvider} QR</Text>
          <Text style={styles.mutedTiny}>Photo / screenshot</Text>
        </View>
        {activeQrUri ? (
          <View style={styles.qrLargeWrap}>
            <View style={styles.qrLargeFrame}>
              <Image source={{ uri: activeQrUri }} style={styles.qrLargeImage} resizeMode="contain" />
            </View>
            <Text style={styles.qrStripTitle}>Scan to get paid via {selectedProvider}</Text>
            <Text style={styles.mutedTiny}>Included when sharing the bill summary</Text>
            <View style={styles.twoCol}>
              <TouchableOpacity
                style={[styles.secondaryPill, isQrCopied && styles.miniPillSuccess]}
                onPress={handleCopyQrImageOnly}
              >
                <Text style={[styles.secondaryPillText, isQrCopied && styles.miniPillTextSuccess]}>
                  {isQrCopied ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryPill} onPress={handleDownloadReceipt}>
                <Text style={styles.secondaryPillText}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.qrEditRow}>
              <TouchableOpacity onPress={handlePickQrImage}>
                <Text style={styles.accentText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRemoveQrImage}>
                <Text style={styles.dangerText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadDashed} onPress={handlePickQrImage}>
            <Text style={styles.uploadIcon}>☁</Text>
            <Text style={styles.qrStripTitle}>Upload QR screenshot</Text>
            <Text style={styles.mutedTiny}>KBZPay, Wave, AYA, CB, PromptPay — tap to choose</Text>
          </TouchableOpacity>
        )}
        {!activeQrUri ? (
          <TouchableOpacity
            onPress={() => handleSetSampleQR(selectedProvider)}
            style={styles.sampleQrBtn}
          >
            <Text style={styles.accentText}>✦ Use sample {selectedProvider} QR</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.primaryPill}
        onPress={async () => {
          await triggerHaptics();
          setActiveNavTab('split');
        }}
      >
        <Text style={styles.primaryPillText}>✓ Done, return to Split</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabStack}>
      <View style={styles.labelRow}>
        <View>
          <Text style={styles.pageTitle}>History</Text>
          <Text style={styles.mutedTiny}>
            {history.length > 0
              ? `${history.length} saved split${history.length > 1 ? 's' : ''}`
              : 'No saved splits yet'}
          </Text>
        </View>
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={styles.dangerText}>Clear all</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyHistory}>
          <View style={styles.emptyIconWrap}>
            <NavTabIcon name="history" active={false} />
          </View>
          <Text style={styles.emptyTitle}>No saved splits yet</Text>
          <Text style={styles.emptyCopy}>
            Share or bookmark a bill and it shows up here for quick restore.
          </Text>
          <TouchableOpacity
            style={styles.emptyCta}
            onPress={async () => {
              await triggerHaptics();
              setActiveNavTab('split');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyCtaText}>+  Create first split</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          {history.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.historyRow, index === history.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => handleRetrieveHistory(item)}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.historyMeta}>
                  {item.dateStr} · {item.provider}
                </Text>
                <Text style={styles.historyName} numberOfLines={1}>
                  {item.eventName}
                </Text>
                <Text style={styles.mutedTiny}>
                  {item.numberOfPeople} people · {item.formattedTotal}
                </Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyShare}>{item.formattedShare}</Text>
                <View style={styles.historyActions}>
                  <View style={styles.loadChip}>
                    <Text style={styles.loadChipText}>Load ↗</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteHistoryItem(item.id)}
                    hitSlop={8}
                  >
                    <Text style={styles.dangerText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const RootView = Platform.OS === 'ios' ? SafeAreaView : View;

  return (
    <RootView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={[styles.header, { paddingTop: ANDROID_TOP_INSET + 12 }]}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <View style={styles.titleRow}>
              <Text style={styles.appTitle}>Bill Splitter</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>
            <Text style={styles.appSubtitle}>{headerSubtitle}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.toolsBtn}
              onPress={async () => {
                await triggerHaptics();
                setIsSideDrawerOpen(true);
              }}
            >
              <Text style={styles.toolsBtnText}>⚙ Tools</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResetDemo} hitSlop={8} style={styles.resetBtn}>
              <Text style={styles.resetGlyph}>↺</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {activeNavTab === 'split' && renderSplitTab()}
          {activeNavTab === 'payment' && renderPaymentTab()}
          {activeNavTab === 'history' && renderHistoryTab()}
        </ScrollView>

        {notificationMsg ? (
          <View style={styles.toast} pointerEvents="none">
            <Text style={styles.toastText}>{notificationMsg}</Text>
          </View>
        ) : null}

        <View style={styles.bottomNav}>
          {[
            { id: 'split', label: 'Split' },
            { id: 'payment', label: 'Pay & QR' },
            { id: 'history', label: 'History' },
          ].map((tab) => {
            const active = activeNavTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.navItem}
                onPress={async () => {
                  await triggerHaptics();
                  setActiveNavTab(tab.id);
                }}
              >
                {active ? <View style={styles.navActiveLine} /> : null}
                <View style={styles.navIconWrap}>
                  <NavTabIcon name={tab.id} active={active} />
                  {tab.id === 'history' && history.length > 0 ? (
                    <View style={styles.navBadge}>
                      <Text style={styles.navBadgeText}>{history.length}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </KeyboardAvoidingView>

      <Modal visible={isSideDrawerOpen} animationType="slide" transparent onRequestClose={() => setIsSideDrawerOpen(false)}>
        <View style={styles.drawerRoot}>
          <TouchableOpacity style={styles.drawerScrim} onPress={() => setIsSideDrawerOpen(false)} />
          <View style={styles.drawerPanel}>
            <View style={styles.drawerHeader}>
              <Text style={styles.sectionTitle}>⚙ Side Tools & Presets</Text>
              <TouchableOpacity onPress={() => setIsSideDrawerOpen(false)}>
                <Text style={styles.clearX}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.drawerSection}>Quick Presets (1-Tap Fill)</Text>
              {DEMO_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  style={styles.presetRow}
                  onPress={async () => {
                    await triggerHaptics();
                    setEventName(preset.name);
                    if (preset.amounts[selectedCurrency]) {
                      setTotalBill(preset.amounts[selectedCurrency]);
                    }
                    setNumberOfPeople(preset.people);
                    setIsSideDrawerOpen(false);
                    setActiveNavTab('split');
                    showToast(`Loaded "${preset.name}" preset`);
                  }}
                >
                  <View style={styles.payingLeft}>
                    <Text style={{ fontSize: 16 }}>{preset.icon}</Text>
                    <View>
                      <Text style={styles.presetName}>{preset.name}</Text>
                      <Text style={styles.mutedTiny}>{preset.desc}</Text>
                    </View>
                  </View>
                  <Text style={styles.loadChipTextAccent}>Load</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.drawerSection}>Select Currency</Text>
              <View style={styles.currencyGrid}>
                {CURRENCIES.map((curr) => {
                  const on = selectedCurrency === curr.id;
                  return (
                    <TouchableOpacity
                      key={curr.id}
                      style={[styles.currencyCell, on && styles.currencyCellOn]}
                      onPress={() => handleCurrencyChange(curr.id)}
                    >
                      <Text style={[styles.currencySym, on && styles.currencyOnText]}>{curr.symbol}</Text>
                      <Text style={[styles.currencyCode, on && styles.currencyOnText]}>{curr.id}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.drawerSection}>Share Message Format</Text>
              <View style={styles.formatToggle}>
                <TouchableOpacity
                  style={[styles.formatBtn, copyFormatStyle === 'friendly' && styles.formatBtnOn]}
                  onPress={async () => {
                    await triggerHaptics();
                    setCopyFormatStyle('friendly');
                  }}
                >
                  <Text
                    style={[
                      styles.formatBtnText,
                      copyFormatStyle === 'friendly' && styles.formatBtnTextOn,
                    ]}
                  >
                    ✨ Emoji Style
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formatBtn, copyFormatStyle === 'clean' && styles.formatBtnOn]}
                  onPress={async () => {
                    await triggerHaptics();
                    setCopyFormatStyle('clean');
                  }}
                >
                  <Text
                    style={[
                      styles.formatBtnText,
                      copyFormatStyle === 'clean' && styles.formatBtnTextOn,
                    ]}
                  >
                    📝 Plain Text
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.includeRow}>
                <Text style={styles.presetName}>Include split line</Text>
                <TouchableOpacity
                  style={[styles.toggleTrack, includePerPersonInCopy && styles.toggleTrackOn]}
                  onPress={async () => {
                    await triggerHaptics();
                    setIncludePerPersonInCopy((prev) => !prev);
                  }}
                >
                  <View
                    style={[styles.toggleThumb, includePerPersonInCopy && styles.toggleThumbOn]}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.messagePreview}>
                <Text style={styles.messagePreviewText}>{calculation.formattedMessage}</Text>
              </View>

              <TouchableOpacity style={styles.resetAllBtn} onPress={handleResetAllData}>
                <Text style={styles.dangerText}>Reset All Stored Data</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isReceiptModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsReceiptModalOpen(false)}
      >
        <View style={styles.receiptModalRoot}>
          <View style={styles.receiptModalCard}>
            <View style={styles.receiptModalHeader}>
              <View>
                <Text style={styles.sectionTitle}>Receipt Card & QR</Text>
                <Text style={styles.mutedTiny}>
                  {activeQrUri
                    ? `High-res image with ${selectedProvider} QR`
                    : 'High-res receipt image'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsReceiptModalOpen(false)}>
                <Text style={styles.clearX}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.receiptModalBody}>
              <View style={styles.card}>
                <Text style={styles.heroLabel}>PER PERSON · {calculation.peopleNum} PEOPLE</Text>
                <Text style={styles.heroAmount}>{calculation.formattedShare}</Text>
                <Text style={styles.heroSub}>
                  of {calculation.formattedTotal} total
                  {eventName.trim() ? ` · ${eventName.trim()}` : ''}
                </Text>
                {activeQrUri ? (
                  <View style={[styles.qrLargeFrame, { marginTop: 16 }]}>
                    <Image
                      source={{ uri: activeQrUri }}
                      style={styles.qrLargeImage}
                      resizeMode="contain"
                    />
                  </View>
                ) : null}
                {activeAccount ? (
                  <Text style={[styles.accountMono, { marginTop: 12, textAlign: 'center' }]}>
                    {selectedProvider}: {activeAccount}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.mutedTiny, { textAlign: 'center', marginTop: 10 }]}>
                Tip: In Viber, Telegram, or WhatsApp, share the QR photo from Save PNG.
              </Text>
            </ScrollView>
            <View style={styles.receiptModalActions}>
              <View style={styles.twoCol}>
                <TouchableOpacity style={styles.accentPill} onPress={handleCopyReceiptCard}>
                  <Text style={styles.accentPillText}>
                    {isCardCopied ? 'Image Copied!' : 'Copy Image'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryPill} onPress={handleDownloadReceipt}>
                  <Text style={styles.secondaryPillText}>Save PNG</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.secondaryPill} onPress={handleShareBillAndQR}>
                <Text style={styles.secondaryPillText}>Share Image via Apps...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </RootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  keyboardContainer: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  proBadge: {
    backgroundColor: 'rgba(45,212,191,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  proBadgeText: { color: '#2DD4BF', fontSize: 9, fontWeight: '800' },
  appSubtitle: { fontSize: 11, color: '#8E8E93', marginTop: 3, fontWeight: '500' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toolsBtn: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  toolsBtnText: { color: '#E5E5EA', fontSize: 11, fontWeight: '700' },
  resetBtn: { padding: 6 },
  resetGlyph: { color: 'rgba(255,255,255,0.4)', fontSize: 16 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 28 },
  tabStack: { gap: 14 },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 8,
    gap: 8,
  },
  eventEmoji: { fontSize: 12 },
  eventInput: { flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: '600', paddingVertical: 4 },
  clearX: { color: '#636366', fontSize: 14, paddingHorizontal: 4 },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 16,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  mutedSmall: { color: '#8E8E93', fontSize: 11, fontWeight: '600' },
  mutedTiny: { color: '#8E8E93', fontSize: 10, marginTop: 2 },
  previewChip: {
    backgroundColor: 'rgba(45,212,191,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  previewChipText: { color: '#2DD4BF', fontSize: 11, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  heroCenter: { alignItems: 'center', paddingVertical: 10 },
  heroLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  heroAmount: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroSub: { fontSize: 12, color: '#8E8E93', marginTop: 8, textAlign: 'center' },
  equalBadge: { marginTop: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  equalBadgeText: { fontSize: 10, fontWeight: '800' },
  accountStrip: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountStripRight: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  accountMono: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    fontWeight: '700',
    maxWidth: 160,
  },
  copyGlyph: { color: '#8E8E93', fontSize: 14 },
  qrStrip: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  qrStripImageWrap: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
  },
  qrStripImage: { width: '100%', height: '100%' },
  qrStripInfo: { flex: 1 },
  qrStripTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  qrStripActions: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  miniPill: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  miniPillSuccess: { backgroundColor: '#059669' },
  miniPillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  miniPillTextSuccess: { color: '#FFFFFF' },
  miniIconBtn: {
    backgroundColor: '#2C2C2E',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billPeopleRow: { flexDirection: 'row', gap: 12 },
  billCol: { flex: 7 },
  peopleCol: { flex: 5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldLabel: { color: '#8E8E93', fontSize: 11, fontWeight: '700', marginBottom: 6 },
  monoDim: {
    color: '#636366',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  billInputWrap: { position: 'relative', justifyContent: 'center' },
  billInput: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  currencyAffix: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    color: '#2DD4BF',
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  currencySuffix: {
    position: 'absolute',
    right: 10,
    color: '#2DD4BF',
    backgroundColor: '#2C2C2E',
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '800',
  },
  chipRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  incChip: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  incChipText: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  peopleStepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: {
    width: 36,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  peopleInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    paddingVertical: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  peopleChip: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 4,
    borderRadius: 999,
    alignItems: 'center',
  },
  peopleChipOn: { backgroundColor: '#FFFFFF' },
  peopleChipText: { color: '#8E8E93', fontSize: 10, fontWeight: '800' },
  peopleChipTextOn: { color: '#000000' },
  payingRow: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  walletDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletGlyph: { color: '#FFFFFF', fontWeight: '800' },
  payingLabel: { color: '#8E8E93', fontSize: 10 },
  payingValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  changeLink: { color: '#2DD4BF', fontSize: 11, fontWeight: '700' },
  primaryPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryPillDisabled: { backgroundColor: '#1C1C1E', opacity: 0.6 },
  primaryPillText: { color: '#000000', fontSize: 14, fontWeight: '800' },
  receiptAction: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptActionSuccess: {
    backgroundColor: 'rgba(6,78,59,0.7)',
  },
  receiptActionTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  receiptActionSub: { color: '#8E8E93', fontSize: 10, marginTop: 2 },
  successText: { color: '#6EE7B7' },
  eyeBtn: { padding: 6 },
  twoCol: { flexDirection: 'row', gap: 8 },
  secondaryPill: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
  },
  secondaryPillText: { color: '#CBD5E1', fontSize: 12, fontWeight: '700' },
  bookmarkBtn: { alignItems: 'center', paddingVertical: 8 },
  bookmarkText: { color: '#8E8E93', fontSize: 11, fontWeight: '700' },
  accentText: { color: '#2DD4BF', fontSize: 11, fontWeight: '800' },
  toolsHint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  pageTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  providerRow: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerRowOn: { backgroundColor: '#FFFFFF' },
  providerName: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  providerNameOn: { color: '#000000' },
  qrReadyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399', marginRight: 6 },
  checkMark: { color: '#000000', fontWeight: '800' },
  accentTiny: { color: '#2DD4BF', fontSize: 10, fontWeight: '600' },
  accountInputWrap: { position: 'relative', justifyContent: 'center' },
  accountInput: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingRight: 64,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  inlineCopy: {
    position: 'absolute',
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  inlineCopyText: { color: '#000000', fontSize: 10, fontWeight: '800' },
  qrLargeWrap: { alignItems: 'center', gap: 8, paddingTop: 8 },
  qrLargeFrame: {
    width: 168,
    height: 168,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
  },
  qrLargeImage: { width: '100%', height: '100%' },
  qrEditRow: { flexDirection: 'row', gap: 16, marginTop: 4 },
  dangerText: { color: '#FF7B72', fontSize: 11, fontWeight: '700' },
  uploadDashed: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginTop: 8,
  },
  uploadIcon: { color: '#2DD4BF', fontSize: 22, marginBottom: 6 },
  sampleQrBtn: { alignItems: 'center', paddingVertical: 8 },
  emptyHistory: {
    alignItems: 'stretch',
    paddingVertical: 36,
    paddingHorizontal: 4,
    gap: 10,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyCopy: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: 260,
    lineHeight: 19,
  },
  emptyCta: {
    marginTop: 10,
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minHeight: 54,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCtaText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  historyMeta: {
    color: '#636366',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  historyName: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', marginTop: 2 },
  historyRight: { alignItems: 'flex-end' },
  historyShare: { color: '#2DD4BF', fontSize: 14, fontWeight: '800' },
  historyActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  loadChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  loadChipText: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700' },
  loadChipTextAccent: {
    color: '#2DD4BF',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(45,212,191,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  toast: {
    position: 'absolute',
    top: ANDROID_TOP_INSET + 56,
    alignSelf: 'center',
    backgroundColor: 'rgba(28,28,30,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    zIndex: 40,
  },
  toastText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#000000',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 18 : 10,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 6, position: 'relative' },
  navActiveLine: {
    position: 'absolute',
    top: -8,
    width: 32,
    height: 2,
    borderRadius: 999,
    backgroundColor: '#2DD4BF',
  },
  navIconWrap: { position: 'relative', width: 28, height: 22, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 11, color: '#8E8E93', fontWeight: '600', marginTop: 4 },
  navLabelActive: { color: '#2DD4BF', fontWeight: '800' },
  navBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2DD4BF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  navBadgeText: { color: '#000000', fontSize: 9, fontWeight: '800' },
  drawerRoot: { flex: 1, flexDirection: 'row' },
  drawerScrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' },
  drawerPanel: {
    width: '85%',
    backgroundColor: '#0f131a',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.06)',
    padding: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
  drawerSection: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 8,
  },
  presetRow: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  presetName: { color: '#E2E8F0', fontSize: 12, fontWeight: '800' },
  currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  currencyCell: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  currencyCellOn: { backgroundColor: '#2DD4BF', borderColor: '#2DD4BF' },
  currencySym: { color: '#CBD5E1', fontWeight: '800' },
  currencyCode: { color: '#8E8E93', fontSize: 10 },
  currencyOnText: { color: '#04140f' },
  formatToggle: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 4,
  },
  formatBtn: { flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
  formatBtnOn: { backgroundColor: '#2DD4BF' },
  formatBtnText: { color: '#8E8E93', fontSize: 11, fontWeight: '800' },
  formatBtnTextOn: { color: '#04140f' },
  includeRow: {
    marginTop: 10,
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  toggleTrack: {
    width: 32,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#334155',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackOn: { backgroundColor: '#2DD4BF', alignItems: 'flex-end' },
  toggleThumb: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF' },
  toggleThumbOn: { alignSelf: 'flex-end' },
  messagePreview: {
    backgroundColor: '#080a0e',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  messagePreviewText: {
    color: '#CBD5E1',
    fontSize: 10,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resetAllBtn: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  receiptModalRoot: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 16,
  },
  receiptModalCard: {
    backgroundColor: '#121212',
    borderRadius: 20,
    maxHeight: '92%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  receiptModalHeader: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#1C1C1E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptModalBody: { padding: 14, alignItems: 'center' },
  receiptModalActions: { padding: 12, gap: 8, backgroundColor: '#1C1C1E' },
  accentPill: {
    flex: 1,
    backgroundColor: '#2DD4BF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  accentPillText: { color: '#04140f', fontSize: 12, fontWeight: '800' },
});
