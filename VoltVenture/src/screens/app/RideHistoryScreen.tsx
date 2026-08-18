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
});
