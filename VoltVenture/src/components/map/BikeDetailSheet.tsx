import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../common/PrimaryButton';
import { Bike } from '../../types/bike';

interface BikeDetailSheetProps {
  bike: Bike | null;
  onReserve: () => void;
}

export default function BikeDetailSheet({ bike, onReserve }: BikeDetailSheetProps) {
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
});
