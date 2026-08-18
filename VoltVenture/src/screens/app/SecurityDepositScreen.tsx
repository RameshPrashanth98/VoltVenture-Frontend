import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snackbar, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

type Props = StackScreenProps<AccountStackParamList, 'SecurityDeposit'>;

export default function SecurityDepositScreen({ navigation }: Props) {
  const [refundRequested, setRefundRequested] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);

  function handleRefundRequest() {
    setRefundRequested(true);
    setSnackVisible(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Deposit</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.flex}>
        {/* Status card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>SECURITY DEPOSIT</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Active Hold</Text>
          </View>
          <Text style={styles.amount}>$150.00</Text>
          <Text style={styles.estimate}>
            Estimated refund: 7 days after your last active ride.
          </Text>
        </View>

        {/* Explanation section */}
        <View style={styles.explanationSection}>
          <Text style={styles.explanationLabel}>What is this?</Text>
          <Text style={styles.explanationBody}>
            Your deposit is held to cover any outstanding charges or damage. It's automatically
            refunded after your account is in good standing for 7 days following your last ride.
          </Text>
        </View>
      </ScrollView>

      {/* Button area */}
      <View style={styles.buttonArea}>
        <PrimaryButton
          label="Request Refund"
          onPress={handleRefundRequest}
          disabled={refundRequested}
        />
      </View>

      <Portal>
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={3000}
        >
          Refund request submitted. Processing may take 5–7 business days.
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  flex: {
    flex: 1,
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
  card: {
    margin: 24,
    padding: 20,
    backgroundColor: DSColors.surface,
    borderWidth: 1,
    borderColor: DSColors.border,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DSColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: DSColors.surface,
    borderWidth: 1,
    borderColor: DSColors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: DSColors.textSecondary,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: DSColors.textPrimary,
  },
  estimate: {
    fontSize: 13,
    fontWeight: '400',
    color: DSColors.textSecondary,
    textAlign: 'center',
  },
  explanationSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 8,
  },
  explanationLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  explanationBody: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textSecondary,
    lineHeight: 22,
  },
  buttonArea: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
});
