export const EXPO_INSTALL_COMMAND = `npx expo install expo-clipboard expo-haptics @react-native-async-storage/async-storage expo-image-picker expo-sharing`;

export const EXPO_APP_JS = `import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

// Payment providers and brand colors
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

const STORAGE_KEY = '@bill_splitter_data_v2';
const HISTORY_STORAGE_KEY = '@bill_splitter_history_v1';

export default function App() {
  // Input states
  const [eventName, setEventName] = useState('');
  const [totalBill, setTotalBill] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('2');
  const [selectedProvider, setSelectedProvider] = useState('KPay');
  const [selectedCurrency, setSelectedCurrency] = useState('MMK');

  // Stored accounts and QR URIs per provider
  const [accounts, setAccounts] = useState({
    'KPay': '',
    'AYA Pay': '',
    'WavePay': '',
    'Bank Transfer': '',
  });

  const [qrCodes, setQrCodes] = useState({
    'KPay': null,
    'AYA Pay': null,
    'WavePay': null,
    'Bank Transfer': null,
  });

  // Action feedback states
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // History state (last 5 successful calculations)
  const [history, setHistory] = useState([]);

  // Load saved accounts & QR image URIs from AsyncStorage on mount
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

  // Persist updated state to AsyncStorage
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

  // Account number change handler
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

  // QR Code Image Picker Handler
  const handlePickQrImage = async () => {
    try {
      await Haptics.selectionAsync();

      // Request media library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photos to upload a payment QR code.'
        );
        return;
      }

      // Launch Image Library Picker
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
      }
    } catch (error) {
      console.error('Failed to pick QR image:', error);
      Alert.alert('Error', 'Could not select the QR image. Please try again.');
    }
  };

  // Remove QR code handler
  const handleRemoveQrImage = async () => {
    await Haptics.selectionAsync();
    const updatedQrCodes = {
      ...qrCodes,
      [selectedProvider]: null,
    };
    setQrCodes(updatedQrCodes);
    persistData(accounts, updatedQrCodes);
  };

  // Helper for thousands formatting
  const formatNumber = (val) => {
    if (isNaN(val) || val === null || val === undefined) return '0';
    const parts = val.toString().split('.');
    parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
    return parts.join('.');
  };

  // Active provider configuration
  const currentProviderConfig = useMemo(() => {
    return (
      PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider) ||
      PAYMENT_PROVIDERS[0]
    );
  }, [selectedProvider]);

  // Active currency configuration
  const currentCurrencyConfig = useMemo(() => {
    return (
      CURRENCIES.find((c) => c.id === selectedCurrency) ||
      CURRENCIES[0]
    );
  }, [selectedCurrency]);

  const activeAccount = accounts[selectedProvider] || '';
  const activeQrUri = qrCodes[selectedProvider] || null;

  // Calculation Logic & Conditional Formatted Text
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

    const formattedShare =
      currentCurrencyConfig.placement === 'prefix'
        ? \`\${currentCurrencyConfig.symbol}\${formattedShareNum}\`
        : \`\${formattedShareNum} \${currentCurrencyConfig.symbol}\`;

    const formattedTotal =
      currentCurrencyConfig.placement === 'prefix'
        ? \`\${currentCurrencyConfig.symbol}\${formattedTotalNum}\`
        : \`\${formattedTotalNum} \${currentCurrencyConfig.symbol}\`;

    // Build the formatted string dynamically:
    // - Omit Event Name if empty
    // - Omit Send via line if Account Number is empty
    const lines = [];

    if (eventName.trim().length > 0) {
      lines.push(\`🍽️ \${eventName.trim()}\`);
    }
    lines.push(\`💰 Total: \${formattedTotal}\`);
    lines.push(\`💸 Your Share: \${formattedShare}\`);

    if (activeAccount.trim().length > 0) {
      lines.push(\`📱 Send via \${selectedProvider}: \${activeAccount.trim()}\`);
    }

    const formattedMessage = lines.join('\\n');

    return {
      isValid,
      billNum: isNaN(billNum) ? 0 : billNum,
      peopleNum: isNaN(peopleNum) ? 0 : peopleNum,
      formattedTotal,
      formattedShare,
      formattedMessage,
    };
  }, [eventName, totalBill, numberOfPeople, selectedProvider, activeAccount, selectedCurrency, currentCurrencyConfig]);

  // Primary Action: Share Bill & QR Code
  const handleShareBillAndQR = async () => {
    if (!calculation.isValid) return;

    try {
      setIsSharing(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      saveCalculationToHistory(calculation);

      // If a QR image is available and sharing is supported on this device
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (activeQrUri && isSharingAvailable) {
        // Copy formatted message to clipboard first for convenience
        await Clipboard.setStringAsync(calculation.formattedMessage);

        // Share the QR Code Image with dialog title
        await Sharing.shareAsync(activeQrUri, {
          dialogTitle: \`Bill Split: \${calculation.formattedShare} per person\`,
          mimeType: 'image/jpeg',
          UTI: 'public.jpeg',
        });
      } else {
        // Native Text Message Share Fallback
        await Share.share({
          message: calculation.formattedMessage,
          title: 'Bill Splitter Summary',
        });
      }
    } catch (error) {
      console.error('Error sharing bill:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Secondary Action: Copy Text Only
  const handleCopyTextOnly = async () => {
    if (!calculation.isValid) return;

    try {
      await Clipboard.setStringAsync(calculation.formattedMessage);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      saveCalculationToHistory(calculation);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying text to clipboard:', error);
    }
  };

  // Save successful calculation to History (stores last 5 calculations in AsyncStorage)
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
          // Check if top entry has identical calculation inputs
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
          AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory)).catch(
            (err) => console.error('Error saving history to AsyncStorage:', err)
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
    selectedProvider,
    saveCalculationToHistory,
  ]);

  // Retrieve & restore previous split calculation from history
  const handleRetrieveHistory = async (item) => {
    try {
      await Haptics.selectionAsync();
      setEventName(item.eventName === 'Bill Split' ? '' : item.eventName);
      setTotalBill(item.totalBill);
      setNumberOfPeople(item.numberOfPeople);
      if (item.currency) setSelectedCurrency(item.currency);
      if (item.provider) setSelectedProvider(item.provider);
      Alert.alert(
        'Split Retrieved',
        \`Restored \${item.eventName}: \${item.formattedShare} per person.\`
      );
    } catch (error) {
      console.error('Error retrieving history item:', error);
    }
  };

  // Clear history
  const handleClearHistory = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setHistory([]);
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appTitle}>Bill Splitter</Text>
            <Text style={styles.appSubtitle}>
              Calculate shares, attach QR code, & share in one tap
            </Text>
          </View>

          {/* 2. THE "PREMIUM RECEIPT" LIVE PREVIEW */}
          <View style={styles.receiptContainer}>
            {/* Top Receipt Bar */}
            <View style={styles.receiptTopBar}>
              <View style={styles.receiptBadge}>
                <View
                  style={[
                    styles.receiptBadgeDot,
                    { backgroundColor: currentProviderConfig.color },
                  ]}
                />
                <Text style={styles.receiptBadgeText}>
                  {selectedProvider.toUpperCase()} RECEIPT • {selectedCurrency}
                </Text>
              </View>
              <Text style={styles.receiptLiveTag}>LIVE PREVIEW</Text>
            </View>

            {/* Receipt Body: Formatted Text */}
            <View style={styles.receiptBody}>
              {eventName.trim().length > 0 && (
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptIcon}>🍽️</Text>
                  <Text style={styles.receiptEventText} numberOfLines={1}>
                    {eventName.trim()}
                  </Text>
                </View>
              )}

              <View style={styles.receiptRow}>
                <Text style={styles.receiptIcon}>💰</Text>
                <Text style={styles.receiptLabel}>Total:</Text>
                <Text style={styles.receiptValueMono}>
                  {calculation.formattedTotal}
                </Text>
              </View>

              <View style={[styles.receiptRow, styles.receiptHighlightRow]}>
                <Text style={styles.receiptIcon}>💸</Text>
                <Text style={styles.receiptLabelHighlight}>Your Share:</Text>
                <Text
                  style={[
                    styles.receiptValueMonoHighlight,
                    { color: currentProviderConfig.color },
                  ]}
                >
                  {calculation.formattedShare}
                </Text>
              </View>

              {activeAccount.trim().length > 0 && (
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptIcon}>📱</Text>
                  <Text style={styles.receiptLabel}>Send via {selectedProvider}:</Text>
                  <Text style={styles.receiptAccountText} numberOfLines={1}>
                    {activeAccount.trim()}
                  </Text>
                </View>
              )}
            </View>

            {/* Dashed Horizontal Divider */}
            <View style={styles.dashedDivider} />

            {/* Receipt Bottom: QR Code Section */}
            <View style={styles.receiptFooter}>
              {activeQrUri ? (
                <View style={styles.qrPreviewWrapper}>
                  <View
                    style={[
                      styles.qrImageContainer,
                      {
                        borderColor: currentProviderConfig.color,
                        shadowColor: currentProviderConfig.color,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: activeQrUri }}
                      style={styles.qrImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.qrCaption}>
                    QR Attached for {selectedProvider}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handlePickQrImage}
                  style={styles.qrPlaceholder}
                  activeOpacity={0.7}
                >
                  <Text style={styles.qrPlaceholderIcon}>📷</Text>
                  <Text style={styles.qrPlaceholderText}>
                    No QR code attached for {selectedProvider}
                  </Text>
                  <Text
                    style={[
                      styles.qrPlaceholderAction,
                      { color: currentProviderConfig.color },
                    ]}
                  >
                    + Tap to attach payment QR
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 3. INPUT CONTROLS */}
          <View style={styles.formSection}>
            {/* Currency Selector */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Currency</Text>
                <Text style={styles.activeCurrencyTag}>
                  Active: {currentCurrencyConfig.id} ({currentCurrencyConfig.symbol})
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {CURRENCIES.map((curr) => {
                  const isSelected = selectedCurrency === curr.id;
                  return (
                    <TouchableOpacity
                      key={curr.id}
                      activeOpacity={0.7}
                      style={[
                        styles.chip,
                        isSelected && styles.currencyChipActive,
                      ]}
                      onPress={async () => {
                        await Haptics.selectionAsync();
                        setSelectedCurrency(curr.id);
                        persistData(accounts, qrCodes, curr.id);
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {curr.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Event / Location Name (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Event / Location Name <Text style={styles.optionalTag}>(Optional)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Hotpot Dinner, Grab Ride"
                placeholderTextColor="#64748B"
                value={eventName}
                onChangeText={setEventName}
                returnKeyType="next"
              />
            </View>

            {/* Numeric Row: Total Bill & Number of People */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flexTwo]}>
                <Text style={styles.label}>
                  Total Bill Amount ({currentCurrencyConfig.symbol})
                </Text>
                <TextInput
                  style={[styles.input, styles.monoInput]}
                  placeholder={currentCurrencyConfig.sample}
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={totalBill}
                  onChangeText={setTotalBill}
                  returnKeyType="next"
                />
              </View>

              <View style={[styles.inputGroup, styles.flexOne]}>
                <Text style={styles.label}>No. of People</Text>
                <TextInput
                  style={[styles.input, styles.monoInput, styles.centerText]}
                  placeholder="2"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  value={numberOfPeople}
                  onChangeText={setNumberOfPeople}
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Payment Method Selector (Horizontal scrolling chips) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Payment Provider</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {PAYMENT_PROVIDERS.map((provider) => {
                  const isSelected = selectedProvider === provider.id;
                  const hasQR = !!qrCodes[provider.id];
                  return (
                    <TouchableOpacity
                      key={provider.id}
                      activeOpacity={0.7}
                      style={[
                        styles.chip,
                        isSelected && {
                          backgroundColor: provider.color,
                          borderColor: provider.color,
                          shadowColor: provider.color,
                          shadowOpacity: 0.35,
                          shadowRadius: 6,
                          elevation: 3,
                        },
                      ]}
                      onPress={async () => {
                        await Haptics.selectionAsync();
                        setSelectedProvider(provider.id);
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {provider.label} {hasQR ? '✓' : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Account Number Input Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {selectedProvider} Account / Phone Number
              </Text>
              <TextInput
                style={styles.input}
                placeholder={\`Enter your \${selectedProvider} details\`}
                placeholderTextColor="#64748B"
                value={activeAccount}
                onChangeText={handleAccountChange}
                keyboardType={selectedProvider === 'Bank Transfer' ? 'default' : 'phone-pad'}
                returnKeyType="done"
              />
            </View>

            {/* Upload / Manage QR Code Button */}
            <View style={styles.qrButtonRow}>
              <TouchableOpacity
                style={[
                  styles.uploadQrButton,
                  { borderColor: currentProviderConfig.color + '55' },
                ]}
                onPress={handlePickQrImage}
                activeOpacity={0.7}
              >
                <Text style={styles.uploadQrIcon}>📷</Text>
                <Text style={styles.uploadQrButtonText}>
                  {activeQrUri
                    ? \`Replace \${selectedProvider} QR Code\`
                    : \`Upload \${selectedProvider} QR Code\`}
                </Text>
              </TouchableOpacity>

              {activeQrUri && (
                <TouchableOpacity
                  style={styles.removeQrButton}
                  onPress={handleRemoveQrImage}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeQrButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 5. ACTION BUTTONS & HAPTICS */}
          <View style={styles.actionSection}>
            {/* Primary: Share Bill & QR */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: currentProviderConfig.color },
                !calculation.isValid && styles.buttonDisabled,
              ]}
              onPress={handleShareBillAndQR}
              disabled={!calculation.isValid || isSharing}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {isSharing
                  ? 'Sharing...'
                  : activeQrUri
                  ? '📤 Share Bill & QR Code'
                  : '📤 Share Bill Summary'}
              </Text>
            </TouchableOpacity>

            {/* Secondary: Copy Text Only */}
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                !calculation.isValid && styles.buttonDisabled,
                isCopied && styles.secondaryButtonSuccess,
              ]}
              onPress={handleCopyTextOnly}
              disabled={!calculation.isValid}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  isCopied && styles.secondaryButtonTextSuccess,
                ]}
              >
                {isCopied ? '✓ Copied to Clipboard!' : '📋 Copy Text Only'}
              </Text>
            </TouchableOpacity>

            {/* Save to History Button / Feedback */}
            <TouchableOpacity
              style={[
                styles.saveHistoryButton,
                !calculation.isValid && styles.buttonDisabled,
                isSavedFeedback && styles.saveHistoryButtonSuccess,
              ]}
              onPress={() => saveCalculationToHistory(calculation)}
              disabled={!calculation.isValid}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.saveHistoryButtonText,
                  isSavedFeedback && styles.saveHistoryButtonTextSuccess,
                ]}
              >
                {isSavedFeedback ? '✓ Saved to History!' : '💾 Save to History'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 6. HISTORY SECTION (Last 5 Calculations in AsyncStorage) */}
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <View style={styles.historyTitleRow}>
                <Text style={styles.historyIcon}>🕒</Text>
                <Text style={styles.historyTitle}>Recent Splits</Text>
                <View style={styles.historyCountBadge}>
                  <Text style={styles.historyCountText}>{history.length}/5</Text>
                </View>
              </View>
              {history.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearHistory}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.clearHistoryText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {history.length === 0 ? (
              <View style={styles.historyEmptyCard}>
                <Text style={styles.historyEmptyText}>
                  No recent splits yet. Your last 5 calculations will be saved to AsyncStorage automatically.
                </Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {history.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyCard}
                    activeOpacity={0.75}
                    onPress={() => handleRetrieveHistory(item)}
                  >
                    <View style={styles.historyCardTop}>
                      <View style={styles.historyNameRow}>
                        <Text style={styles.historyEventName} numberOfLines={1}>
                          {item.eventName}
                        </Text>
                        <Text style={styles.historyTime}>{item.dateStr}</Text>
                      </View>
                      <View style={styles.historyActionBadge}>
                        <Text style={styles.historyActionBadgeText}>Load ↗</Text>
                      </View>
                    </View>

                    <View style={styles.historyCardBottom}>
                      <View>
                        <Text style={styles.historyShareLabel}>Per Person</Text>
                        <Text style={styles.historyShareAmount}>{item.formattedShare}</Text>
                      </View>
                      <View style={styles.historyMeta}>
                        <Text style={styles.historyMetaText}>
                          Total: {item.formattedTotal}
                        </Text>
                        <Text style={styles.historyMetaSub}>
                          👥 {item.numberOfPeople} people • {item.provider}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Deep Charcoal Dark Mode Stylesheet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 18,
  },
  // 2. THE "PREMIUM RECEIPT" LIVE PREVIEW
  receiptContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2D2D2D',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  receiptTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  receiptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  receiptBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  receiptBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 0.8,
  },
  receiptLiveTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  receiptBody: {
    gap: 8,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptHighlightRow: {
    backgroundColor: '#262626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginVertical: 2,
  },
  receiptIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  receiptEventText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  receiptLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 6,
  },
  receiptLabelHighlight: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 6,
  },
  receiptValueMono: {
    color: '#E2E8F0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
  receiptValueMonoHighlight: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 15,
    fontWeight: '800',
  },
  receiptAccountText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  // Dashed Bottom Border / Divider
  dashedDivider: {
    borderBottomWidth: 1.5,
    borderColor: '#333333',
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  receiptFooter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPreviewWrapper: {
    alignItems: 'center',
  },
  qrImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 2.5,
    overflow: 'hidden',
    backgroundColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  qrCaption: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    fontWeight: '500',
  },
  qrPlaceholder: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  qrPlaceholderIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  qrPlaceholderText: {
    fontSize: 12,
    color: '#64748B',
  },
  qrPlaceholderAction: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  // 3. INPUT CONTROLS
  formSection: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flexOne: {
    flex: 1,
  },
  flexTwo: {
    flex: 1.8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activeCurrencyTag: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  optionalTag: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
  },
  monoInput: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
  },
  centerText: {
    textAlign: 'center',
  },
  // Chips
  chipRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  currencyChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  chipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // QR Upload Button Row
  qrButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  uploadQrButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  uploadQrIcon: {
    fontSize: 16,
  },
  uploadQrButtonText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  removeQrButton: {
    backgroundColor: '#2A1F1F',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  removeQrButtonText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '600',
  },
  // 5. ACTION BUTTONS
  actionSection: {
    gap: 10,
    marginTop: 6,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#181818',
    borderColor: '#222222',
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  secondaryButtonSuccess: {
    backgroundColor: '#064E3B',
    borderColor: '#059669',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonTextSuccess: {
    color: '#34D399',
    fontWeight: '700',
  },
  saveHistoryButton: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveHistoryButtonSuccess: {
    backgroundColor: '#1E293B',
    borderColor: '#3B82F6',
  },
  saveHistoryButtonText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  saveHistoryButtonTextSuccess: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  // 6. HISTORY SECTION STYLES
  historySection: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#181818',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyIcon: {
    fontSize: 15,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
    letterSpacing: 0.2,
  },
  historyCountBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  historyCountText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  clearHistoryText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  historyEmptyCard: {
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyEmptyText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  historyList: {
    gap: 10,
  },
  historyCard: {
    backgroundColor: '#202020',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  historyCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  historyEventName: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: '70%',
  },
  historyTime: {
    color: '#64748B',
    fontSize: 11,
  },
  historyActionBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyActionBadgeText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '600',
  },
  historyCardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  historyShareLabel: {
    color: '#94A3B8',
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  historyShareAmount: {
    color: '#10B981',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  historyMeta: {
    alignItems: 'flex-end',
  },
  historyMetaText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  historyMetaSub: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
});
`;
