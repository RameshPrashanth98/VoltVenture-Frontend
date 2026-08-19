import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RideStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';
import { paymentService } from '../../services/paymentService';

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = StackScreenProps<RideStackParamList, 'PaymentSummary'>;

// ─── Component ───────────────────────────────────────────────────────────────
export default function PaymentSummaryScreen({ route, navigation }: Props) {
  const { rideSummary } = route.params;
  const insets = useSafeAreaInsets();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCard, setActiveCard] = useState(() => paymentService.getDefault());

  useFocusEffect(
    useCallback(() => {
      setActiveCard(paymentService.getDefault());
    }, [])
  );

  // Derived display values
  const baseFare = 0.50;
  const perMinCharge = parseFloat((rideSummary.costEur - baseFare).toFixed(2));
  const durationMin = Math.floor(rideSummary.durationMin);
  const durationSec = Math.round((rideSummary.durationMin - durationMin) * 60);
  const durationDisplay =
    String(durationMin).padStart(2, '0') + ':' + String(durationSec).padStart(2, '00');

  const handleConfirmPay = useCallback(async () => {
    setIsProcessing(true);
    try {
      const paymentResult = await paymentService.processPayment(rideSummary);
      navigation.navigate('RideReceipt', { paymentResult, rideSummary });
    } finally {
      setIsProcessing(false);
    }
  }, [rideSummary, navigation]);

  return (
    <View
      style={[
        styles.outer,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Trip Summary section ── */}
        <Text style={styles.sectionHeading}>Trip Summary</Text>

        <View style={styles.card}>
          {/* Bike name row */}
          <View style={styles.summaryRow}>
            <Text style={styles.bikeName}>{rideSummary.bikeName}</Text>
            <Text style={styles.durationValue}>{durationDisplay}</Text>
          </View>

          <View style={styles.separator} />

          {/* Base fare row */}
          <View style={styles.summaryRow}>
            <Text style={styles.rowLabel}>Base fare</Text>
            <Text style={styles.rowValue}>€0.50</Text>
          </View>

          {/* Per-minute row */}
          <View style={styles.summaryRow}>
            <Text style={styles.rowLabel}>Per-minute ({durationDisplay})</Text>
            <Text style={styles.rowValue}>€{perMinCharge.toFixed(2)}</Text>
          </View>

          <View style={styles.separator} />

          {/* Total row */}
          <View style={styles.summaryRow}>
            <Text style={[styles.rowLabel, styles.totalLabel]}>Total</Text>
            <Text style={[styles.rowValue, styles.totalValue]}>
              €{rideSummary.costEur.toFixed(2)}
            </Text>
          </View>

          {/* Distance row */}
          <View style={styles.summaryRow}>
            <Text style={styles.rowLabel}>Distance</Text>
            <Text style={styles.rowValue}>{rideSummary.distanceKm.toFixed(1)} km</Text>
          </View>
        </View>

        {/* ── Payment Method section ── */}
        <Text style={[styles.sectionHeading, styles.sectionHeadingMt]}>
          Payment Method
        </Text>

        <View style={[styles.card, styles.paymentCard]}>
          <View style={styles.paymentRow}>
            <View style={styles.paymentLeft}>
              <MaterialCommunityIcons
                name="credit-card"
                size={20}
                color={DSColors.textSecondary}
              />
              <Text style={styles.cardLabel}>
                {activeCard
                  ? `${activeCard.brand} \u2022\u2022\u2022\u2022 ${activeCard.last4}`
                  : 'No card selected'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.push('SelectPaymentMethod')}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={styles.ctaWrapper}>
        {isProcessing ? (
          <ActivityIndicator size="large" color={DSColors.primary} />
        ) : (
          <PrimaryButton label="Confirm & Pay" onPress={handleConfirmPay} />
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: DSColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  sectionHeadingMt: {
    marginTop: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: DSColors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: DSColors.surface,
  },
  paymentCard: {
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  bikeName: {
    fontSize: 15,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  durationValue: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: DSColors.border,
    marginVertical: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textSecondary,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textPrimary,
  },
  totalLabel: {
    fontWeight: '700',
    color: DSColors.textPrimary,
  },
  totalValue: {
    fontWeight: '700',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textPrimary,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '500',
    color: DSColors.primary,
  },
  ctaWrapper: {
    paddingHorizontal: 24,
    minHeight: 52,
    justifyContent: 'center',
  },
});
