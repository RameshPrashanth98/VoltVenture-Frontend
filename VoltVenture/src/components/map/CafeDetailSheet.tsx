import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../common/PrimaryButton';

export type Cafe = {
  id: string;
  name: string;
  hours: string;
  latitude: number;
  longitude: number;
};

interface CafeDetailSheetProps {
  cafe: Cafe | null;
  userLocation: { latitude: number; longitude: number } | null;
  onGetDirections: () => void;
}

// Inline copy from MapScreen.tsx — haversineKm is not exported
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function CafeDetailSheet({ cafe, userLocation, onGetDirections }: CafeDetailSheetProps) {
  if (!cafe) return null;

  const distanceKm = userLocation
    ? haversineKm(userLocation.latitude, userLocation.longitude, cafe.latitude, cafe.longitude)
    : null;

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.handle} />
      <View style={styles.photoPlaceholder}>
        <MaterialCommunityIcons name="coffee" size={48} color={DSColors.textSecondary} />
      </View>
      <Text style={styles.cafeName}>{cafe.name}</Text>
      <View style={styles.row}>
        <MaterialCommunityIcons name="clock-outline" size={14} color={DSColors.textSecondary} />
        <Text style={styles.rowText}>{cafe.hours}</Text>
      </View>
      <View style={styles.row}>
        <MaterialCommunityIcons name="map-marker" size={14} color={DSColors.textSecondary} />
        <Text style={styles.rowText}>
          {distanceKm != null ? `${distanceKm.toFixed(1)} km away` : '—'}
        </Text>
      </View>
      <PrimaryButton label="Get Directions" onPress={onGetDirections} />
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
  photoPlaceholder: {
    height: 160,
    backgroundColor: DSColors.surface,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cafeName: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
    alignItems: 'center',
  },
  rowText: {
    fontSize: 15,
    color: DSColors.textSecondary,
  },
});
