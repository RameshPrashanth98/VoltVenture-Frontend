import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import { rideService } from '../../services/rideService';
import type { RideSummary } from '../../types/ride';

type Props = StackScreenProps<AccountStackParamList, 'RideHistory'>;

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatDuration(durationMin: number): string {
  const totalSec = Math.round(durationMin * 60);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

export default function RideHistoryScreen({ navigation }: Props) {
  const rides = rideService.getRideHistory();

  const totalRides = rides.length;
  const totalKm = rides.reduce((acc, r) => acc + r.distanceKm, 0);
  const totalEur = rides.reduce((acc, r) => acc + r.costEur, 0);
  const co2Kg = totalKm * 0.21;

  const StatsHeader = (
    <View>
      <View style={styles.statsGrid}>
        <View style={styles.statsTile}>
          <View style={styles.statsTileCard}>
            <MaterialCommunityIcons name="bike" size={22} color={DSColors.primary} />
            <Text style={styles.statValue}>{totalRides.toString()}</Text>
            <Text style={styles.statLabel}>Total Rides</Text>
          </View>
        </View>
        <View style={styles.statsTile}>
          <View style={styles.statsTileCard}>
            <MaterialCommunityIcons name="map-marker-distance" size={22} color={DSColors.primary} />
            <Text style={styles.statValue}>{totalKm.toFixed(1)} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
        </View>
        <View style={styles.statsTile}>
          <View style={styles.statsTileCard}>
            <MaterialCommunityIcons name="cash" size={22} color={DSColors.primary} />
            <Text style={styles.statValue}>€{totalEur.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Spend</Text>
          </View>
        </View>
        <View style={styles.statsTile}>
          <View style={styles.statsTileCard}>
            <MaterialCommunityIcons name="leaf" size={22} color={DSColors.primary} />
            <Text style={styles.statValue}>{co2Kg.toFixed(1)} kg</Text>
            <Text style={styles.statLabel}>CO2 Saved</Text>
          </View>
        </View>
      </View>
      <Text style={styles.rideHistoryLabel}>RIDE HISTORY</Text>
    </View>
  );

  const renderItem = ({ item }: { item: RideSummary }) => (
    <View style={styles.rideRow}>
      <View>
        <Text style={styles.rideBikeName}>{item.bikeName}</Text>
        <Text style={styles.rideMeta}>
          {formatDate(item.startTime)} · {formatDuration(item.durationMin)}
        </Text>
      </View>
      <Text style={styles.rideCost}>€{item.costEur.toFixed(2)}</Text>
    </View>
  );

  const ListEmptyComponent = (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="history" size={48} color={DSColors.textSecondary} />
      <Text style={styles.emptyText}>
        No rides yet — your completed rides will appear here.
      </Text>
    </View>
  );

  const ItemSeparatorComponent = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <FlatList
        data={rides}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={StatsHeader}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 15,
    color: DSColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginTop: 16,
  },
  rideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  rideBikeName: {
    fontSize: 15,
    fontWeight: '500',
    color: DSColors.textPrimary,
  },
  rideMeta: {
    fontSize: 13,
    color: DSColors.textSecondary,
    marginTop: 2,
  },
  rideCost: {
    fontSize: 15,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: DSColors.border,
    marginHorizontal: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: DSColors.background,
  },
  statsTile: {
    width: '50%',
    padding: 8,
  },
  statsTileCard: {
    backgroundColor: DSColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DSColors.border,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: DSColors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: DSColors.textSecondary,
    marginTop: 4,
  },
  rideHistoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DSColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
});
