import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RideStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = StackScreenProps<RideStackParamList, 'RideReceipt'>;

// ─── Component ───────────────────────────────────────────────────────────────
export default function RideReceiptScreen({ route, navigation }: Props) {
  const { paymentResult, rideSummary } = route.params;
  const insets = useSafeAreaInsets();

  // Derived values
  const baseFare = 0.50;
  const perMinCharge = parseFloat((rideSummary.costEur - baseFare).toFixed(2));
  const durationMin = Math.floor(rideSummary.durationMin);
  const durationSec = Math.round((rideSummary.durationMin - durationMin) * 60);
  const durationDisplay =
    String(durationMin).padStart(2, '0') + ':' + String(durationSec).padStart(2, '0');

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {/* Check-circle icon */}
      <MaterialCommunityIcons
        name="check-circle"
        size={80}
        color={DSColors.primary}
        style={styles.icon}
      />

      {/* Heading */}
      <Text style={styles.heading}>Payment confirmed!</Text>

      {/* Total amount */}
      <Text style={styles.totalAmount}>€{rideSummary.costEur.toFixed(2)}</Text>

      {/* Bike + duration meta */}
      <Text style={styles.bikeMeta}>
        {rideSummary.bikeName} • {durationDisplay}
      </Text>

      {/* Breakdown card */}
      <View style={styles.breakdownCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.rowLabel}>Base fare</Text>
          <Text style={styles.rowValue}>€0.50</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.rowLabel}>Per-minute</Text>
          <Text style={styles.rowValue}>€{perMinCharge.toFixed(2)}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.summaryRow}>
          <Text style={[styles.rowLabel, styles.totalLabel]}>Total</Text>
          <Text style={[styles.rowValue, styles.totalLabel]}>
            €{rideSummary.costEur.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.rowLabel}>Paid via</Text>
          <Text style={styles.rowValueSecondary}>{paymentResult.method}</Text>
        </View>
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Done button — dismisses entire RideStack back to map */}
      <PrimaryButton
        label="Done"
        onPress={() => navigation.getParent()?.goBack()}
      />

      {/* Find a Charging Station — ghost text button */}
      <TouchableOpacity
        style={styles.findChargingButton}
        onPress={() => {
          const parent = navigation.getParent();
          parent?.goBack();
          setTimeout(() => {
            parent?.navigate('ChargeStack', { screen: 'EndRideFindCharging' });
          }, 300);
        }}
      >
        <Text style={styles.findChargingLabel}>Find a Charging Station</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DSColors.background,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    marginTop: 48,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: DSColors.textPrimary,
    textAlign: 'center',
    marginTop: 24,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: DSColors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
  },
  bikeMeta: {
    fontSize: 14,
    fontWeight: '400',
    color: DSColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  breakdownCard: {
    borderWidth: 1,
    borderColor: DSColors.border,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: DSColors.border,
    marginVertical: 8,
  },
  rowLabel: {
    fontSize: 14,
    color: DSColors.textSecondary,
  },
  rowValue: {
    fontSize: 14,
    color: DSColors.textPrimary,
  },
  rowValueSecondary: {
    fontSize: 14,
    color: DSColors.textSecondary,
  },
  totalLabel: {
    fontWeight: '700',
    color: DSColors.textPrimary,
  },
  spacer: {
    flex: 1,
  },
  findChargingButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  findChargingLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textSecondary,
  },
});
