import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ChargeStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

// ─── Types ────────────────────────────────────────────────────────────────────
type ChargerStation = { name: string; latitude: number; longitude: number };

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CHARGERS: ChargerStation[] = [
  { name: 'VoltHub Central',       latitude: 52.3731, longitude: 4.8936 },
  { name: 'Dam Square Charger',    latitude: 52.3728, longitude: 4.8936 },
  { name: 'Waterlooplein Station', latitude: 52.3678, longitude: 4.9006 },
  { name: 'Leidseplein EV Point',  latitude: 52.3638, longitude: 4.8831 },
  { name: 'Vondelpark Charge Bay', latitude: 52.3580, longitude: 4.8688 },
];

const USER_LAT = 52.3676;
const USER_LON = 4.9041;

// ─── Haversine ────────────────────────────────────────────────────────────────
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

// ─── Props ────────────────────────────────────────────────────────────────────
type Props = StackScreenProps<ChargeStackParamList, 'EndRideFindCharging'>;

// ─── Component ───────────────────────────────────────────────────────────────
export default function EndRideFindChargingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedCharger, setSelectedCharger] = useState<ChargerStation | null>(null);

  const distanceM = selectedCharger
    ? Math.round(haversineKm(USER_LAT, USER_LON, selectedCharger.latitude, selectedCharger.longitude) * 1000)
    : 0;

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        style={StyleSheet.absoluteFill}
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={() => setSelectedCharger(null)}
        initialRegion={{
          latitude: USER_LAT,
          longitude: USER_LON,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {MOCK_CHARGERS.map(charger => (
          <Marker
            key={charger.name}
            coordinate={{ latitude: charger.latitude, longitude: charger.longitude }}
            onPress={() => setSelectedCharger(charger)}
            tracksViewChanges={false}
          >
            <View style={styles.chargerPin}>
              <MaterialCommunityIcons name="ev-station" size={28} color={DSColors.primary} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Close button — top left */}
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 8 }]}
        onPress={() => navigation.getParent()?.goBack()}
        accessibilityLabel="Close"
      >
        <MaterialCommunityIcons name="close" size={24} color={DSColors.textPrimary} />
      </TouchableOpacity>

      {/* Charger info card — conditional */}
      {selectedCharger !== null && (
        <View style={[styles.infoCard, { bottom: insets.bottom + 16 }]}>
          <Text style={styles.chargerName}>{selectedCharger.name}</Text>
          <Text style={styles.chargerDistance}>{distanceM} m away</Text>
          <PrimaryButton
            label="Navigate Here"
            onPress={() =>
              navigation.push('RidingToCharging', {
                chargerName: selectedCharger.name,
                location: {
                  latitude: selectedCharger.latitude,
                  longitude: selectedCharger.longitude,
                },
              })
            }
          />
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  chargerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DSColors.background,
    borderWidth: 2,
    borderColor: DSColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  infoCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: DSColors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: DSColors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  chargerName: {
    ...DSTypography.headingMd,
    color: DSColors.textPrimary,
    marginBottom: 4,
  },
  chargerDistance: {
    ...DSTypography.label,
    color: DSColors.textSecondary,
    marginBottom: 12,
  },
});
