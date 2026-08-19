import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import { paymentService } from '../../services/paymentService';
import FormField from '../../components/common/FormField';
import PrimaryButton from '../../components/common/PrimaryButton';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = StackScreenProps<AccountStackParamList, 'AddPaymentMethod'>;

// ─── Helper functions ─────────────────────────────────────────────────────────

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  return groups.join(' ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  return digits;
}

function detectBrand(digits: string): string {
  if (digits.startsWith('4')) return 'Visa';
  if (digits.startsWith('5')) return 'Mastercard';
  return 'Card';
}

// ─── Validation functions ──────────────────────────────────────────────────────

function validateCardNumber(val: string): string | undefined {
  const digits = val.replace(/\s/g, '');
  if (digits.length !== 16) return 'Card number must be 16 digits';
  return undefined;
}

function validateExpiry(val: string): string | undefined {
  if (!/^\d{2}\/\d{2}$/.test(val)) return 'Enter a valid expiry (MM/YY)';
  return undefined;
}

function validateCvv(val: string): string | undefined {
  const digits = val.replace(/\D/g, '');
  if (digits.length < 3 || digits.length > 4) return 'CVV must be 3\u20134 digits';
  return undefined;
}

function validateName(val: string): string | undefined {
  if (val.trim().length === 0) return 'Cardholder name is required';
  return undefined;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddPaymentMethodScreen({ navigation }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [touched, setTouched] = useState({
    cardNumber: false,
    expiry: false,
    cvv: false,
    cardholderName: false,
  });

  const isFormValid =
    validateCardNumber(cardNumber) === undefined &&
    validateExpiry(expiry) === undefined &&
    validateCvv(cvv) === undefined &&
    validateName(cardholderName) === undefined;

  function handleSave() {
    const rawDigits = cardNumber.replace(/\s/g, '');
    paymentService.addCard({
      last4: rawDigits.slice(-4),
      brand: detectBrand(rawDigits),
      expiry,
      cardholderName,
    });
    navigation.goBack();
  }

  function handleSavePress() {
    if (isFormValid) {
      handleSave();
    } else {
      setTouched({ cardNumber: true, expiry: true, cvv: true, cardholderName: true });
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card Details section */}
        <Text style={styles.sectionHeader}>CARD DETAILS</Text>

        <FormField
          label="Card Number"
          value={cardNumber}
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          onBlur={() => setTouched((prev) => ({ ...prev, cardNumber: true }))}
          error={touched.cardNumber ? validateCardNumber(cardNumber) : undefined}
          keyboardType="number-pad"
        />

        <FormField
          label="Expiry"
          value={expiry}
          onChangeText={(text) => setExpiry(formatExpiry(text))}
          onBlur={() => setTouched((prev) => ({ ...prev, expiry: true }))}
          error={touched.expiry ? validateExpiry(expiry) : undefined}
          keyboardType="number-pad"
          placeholder="MM/YY"
        />

        <FormField
          label="CVV"
          value={cvv}
          onChangeText={setCvv}
          onBlur={() => setTouched((prev) => ({ ...prev, cvv: true }))}
          error={touched.cvv ? validateCvv(cvv) : undefined}
          keyboardType="number-pad"
          secureTextEntry
        />

        <FormField
          label="Cardholder Name"
          value={cardholderName}
          onChangeText={setCardholderName}
          onBlur={() => setTouched((prev) => ({ ...prev, cardholderName: true }))}
          error={touched.cardholderName ? validateName(cardholderName) : undefined}
          autoCapitalize="words"
        />

        <View style={styles.buttonContainer}>
          <PrimaryButton
            label="Save Card"
            onPress={handleSavePress}
            disabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: DSColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingTop: 20,
    paddingBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
