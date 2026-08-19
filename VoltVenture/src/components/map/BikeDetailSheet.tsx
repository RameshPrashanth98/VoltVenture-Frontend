import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Chip } from 'react-native-paper';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../common/PrimaryButton';
import { Bike } from '../../types/bike';

interface BikeDetailSheetProps {
  bike: Bike | null;
  onReserve: () => void;
  onGetDirections: () => void;
}

export default function BikeDetailSheet({ bike, onReserve, onGetDirections }: BikeDetailSheetProps) {
  if (!bike) return null;

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.handle} />
      <Text style={styles.bikeName}>{bike.name}</Text>
      <Text style={styles.bikeType}>{bike.type}</Text>
      <View style={styles.chipsRow}>
        <Chip icon="battery">{bike.batteryPct}%</Chip>
        <Chip icon="currency-eur">€{bike.pricePerMin.toFixed(2)}/min</Chip>
        <Chip icon="map-marker">
          {bike.distanceKm != null ? `${bike.distanceKm.toFixed(2)} km` : '—'}
        </Chip>
      </View>
      <PrimaryButton label="Reserve" onPress={onReserve} />
      <TouchableOpacity
        style={styles.getDirectionsButton}
        onPress={onGetDirections}
        activeOpacity={0.7}
      >
        <Text style={styles.getDirectionsLabel}>Get Directions</Text>
      </TouchableOpacity>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: DSColors.border,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  bikeName: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
    marginBottom: 4,
  },
  bikeType: {
    ...DSTypography.body,
    color: DSColors.textSecondary,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  getDirectionsButton: {
    borderWidth: 1,
    borderColor: DSColors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  getDirectionsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
});
