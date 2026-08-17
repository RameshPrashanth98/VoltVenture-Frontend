import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DSColors, DSTypography } from '../../theme/theme';
import { Bike } from '../../types/bike';

interface BikeCardProps {
  bike: Bike;
  onPress: () => void;
}

export default function BikeCard({ bike, onPress }: BikeCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <View style={styles.topRow}>
        <MaterialCommunityIcons name="lightning-bolt" size={16} color={DSColors.accent} />
        <Text style={styles.bikeName}>{bike.name}</Text>
        <Text style={styles.bikeType}>{bike.type}</Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.stat}>{bike.batteryPct}% battery</Text>
        <Text style={styles.stat}>
          {bike.distanceKm != null ? `${bike.distanceKm.toFixed(2)} km` : '—'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DSColors.surface,
    borderWidth: 1,
    borderColor: DSColors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bikeName: {
    ...DSTypography.headingMd,
    color: DSColors.textPrimary,
    flex: 1,
  },
  bikeType: {
    ...DSTypography.label,
    color: DSColors.textSecondary,
    textTransform: 'capitalize',
  },
  stat: {
    ...DSTypography.label,
    color: DSColors.textSecondary,
  },
});
