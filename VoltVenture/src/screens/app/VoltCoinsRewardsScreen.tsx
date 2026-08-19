import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import { rideService } from '../../services/rideService';

type Props = StackScreenProps<AccountStackParamList, 'VoltCoins'>;

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const REWARDS = [
  { id: 'r1', name: '€1 off next ride', coins: 100 },
  { id: 'r2', name: 'Free 10-min ride', coins: 500 },
  { id: 'r3', name: 'Partner café voucher', coins: 250 },
  { id: 'r4', name: 'Priority bike hold', coins: 75 },
];

export default function VoltCoinsRewardsScreen({ navigation }: Props) {
  const rides = rideService.getRideHistory();
  const voltCoins = rides.reduce((acc, r) => acc + Math.floor((r.costEur ?? 0) * 10), 0);
  const [snackVisible, setSnackVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Custom header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VoltCoins Rewards</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance card */}
        <View style={styles.balanceCard}>
          <MaterialCommunityIcons name="hand-coin" size={48} color={DSColors.primary} />
          <Text style={styles.balanceAmount}>{voltCoins.toString()}</Text>
          <Text style={styles.balanceLabel}>VoltCoins</Text>
        </View>

        {/* Earn History section */}
        <Text style={styles.sectionHeader}>EARN HISTORY</Text>

        {rides.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="history" size={32} color={DSColors.textSecondary} />
            <Text style={styles.emptyText}>
              No rides yet — earn VoltCoins on your next ride.
            </Text>
          </View>
        ) : (
          rides.map((ride, index) => (
            <View key={ride.id}>
              <View style={styles.earnRow}>
                <View>
                  <Text style={styles.earnBikeName}>{ride.bikeName}</Text>
                  <Text style={styles.earnDate}>{formatDate(ride.startTime)}</Text>
                </View>
                <Text style={styles.earnCoins}>
                  +{Math.floor((ride.costEur ?? 0) * 10)} VoltCoins
                </Text>
              </View>
              {index < rides.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}

        {/* Available Rewards section */}
        <Text style={styles.sectionHeader}>AVAILABLE REWARDS</Text>

        {REWARDS.map(reward => (
          <View key={reward.id} style={styles.rewardCard}>
            <Text style={styles.rewardName}>{reward.name}</Text>
            <Text style={styles.rewardCoins}>{reward.coins} VoltCoins</Text>
            <TouchableOpacity
              style={styles.redeemButton}
              onPress={() => setSnackVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={`Redeem ${reward.name}`}
            >
              <Text style={styles.redeemText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>

      <Portal>
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={3000}
        >
          Rewards redemption coming soon
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
  balanceCard: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: DSColors.surface,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: DSColors.textPrimary,
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: DSColors.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: DSColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: DSColors.textSecondary,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  earnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  earnBikeName: {
    fontSize: 15,
    fontWeight: '500',
    color: DSColors.textPrimary,
  },
  earnDate: {
    fontSize: 13,
    color: DSColors.textSecondary,
    marginTop: 2,
  },
  earnCoins: {
    fontSize: 14,
    fontWeight: '600',
    color: DSColors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: DSColors.border,
    marginHorizontal: 24,
  },
  rewardCard: {
    backgroundColor: DSColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DSColors.border,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  rewardName: {
    fontSize: 15,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  rewardCoins: {
    fontSize: 13,
    color: DSColors.textSecondary,
    marginTop: 4,
  },
  redeemButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: DSColors.surface,
    borderWidth: 1,
    borderColor: DSColors.border,
    borderRadius: 8,
  },
  redeemText: {
    fontSize: 13,
    fontWeight: '500',
    color: DSColors.textPrimary,
  },
});
