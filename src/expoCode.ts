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

const STORAGE_KEY = '@bill_splitter_data_v2';

export default function App() {
  // Input states
  const [eventName, setEventName] = useState('');
  const [totalBill, setTotalBill] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('2');
  const [selectedProvider, setSelectedProvider] = useState('KPay');

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

  // Load saved accounts & QR image URIs from AsyncStorage on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.accounts) setAccounts((prev) => ({ ...prev, ...parsed.accounts }));
          if (parsed.qrCodes) setQrCodes((prev) => ({ ...prev, ...parsed.qrCodes }));
        }
      } catch (error) {
        console.error('Error reading data from AsyncStorage:', error);
      }
    };
    loadPersistedData();
  }, []);

  // Persist updated state to AsyncStorage
  const persistData = async (newAccounts, newQrCodes) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accounts: newAccounts,
          qrCodes: newQrCodes,
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
      persistData(updatedAccounts, qrCodes);
    },
    [accounts, qrCodes, selectedProvider]
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
    const formattedShare = isValid
      ? share % 1 === 0
        ? formatNumber(share)
        : formatNumber(parseFloat(share.toFixed(2)))
      : '0';

    const formattedTotal = hasValidBill
      ? formatNumber(billNum)
      : (totalBill.trim() || '0');

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
  }, [eventName, totalBill, numberOfPeople, selectedProvider, activeAccount]);

  // Primary Action: Share Bill & QR Code
  const handleShareBillAndQR = async () => {
    if (!calculation.isValid) return;

    try {
      setIsSharing(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying text to clipboard:', error);
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
                  {selectedProvider.toUpperCase()} RECEIPT
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
                <Text style={styles.label}>Total Bill Amount</Text>
                <TextInput
                  style={[styles.input, styles.monoInput]}
                  placeholder="0"
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
});
`;
