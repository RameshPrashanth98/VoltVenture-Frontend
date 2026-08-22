import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ChargeStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';

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

// ─── GeoJSON helper ───────────────────────────────────────────────────────────
function buildLineGeoJSON(coords: Array<{ latitude: number; longitude: number }>) {
  return {
    type: 'Feature' as const,
    geometry: {
      type: 'LineString' as const,
      coordinates: coords.map(c => [c.longitude, c.latitude]),
    },
    properties: {},
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────
type Props = StackScreenProps<ChargeStackParamList, 'RidingToCharging'>;

// ─── Component ───────────────────────────────────────────────────────────────
export default function RidingToChargingScreen({ route }: Props) {
  const { chargerName, location } = route.params;
  const insets = useSafeAreaInsets();

  const USER_LAT = 52.3676;
  const USER_LON = 4.9041;
  const distanceKm = haversineKm(USER_LAT, USER_LON, location.latitude, location.longitude);
  const etaMin = Math.round((distanceKm / 5) * 60);
  const distanceM = Math.round(distanceKm * 1000);

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapLibreGL.MapView
        style={StyleSheet.absoluteFill}
        styleURL="https://demotiles.maplibre.org/style.json"
        scrollEnabled={false}
        zoomEnabled={true}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <MapLibreGL.Camera
          centerCoordinate={[
            (USER_LON + location.longitude) / 2,
            (USER_LAT + location.latitude) / 2,
          ]}
          zoomLevel={13}
        />
        {/* User position dot */}
        <MapLibreGL.PointAnnotation
          id="route-start"
          coordinate={[USER_LON, USER_LAT]}
        >
          <View style={styles.userMarker} />
        </MapLibreGL.PointAnnotation>

        {/* Charger destination marker */}
        <MapLibreGL.PointAnnotation
          id="destination"
          coordinate={[location.longitude, location.latitude]}
        >
          <View>
            <MaterialCommunityIcons name="ev-station" size={28} color={DSColors.primary} />
          </View>
        </MapLibreGL.PointAnnotation>

        {/* Route line */}
        <MapLibreGL.ShapeSource
          id="route"
          shape={buildLineGeoJSON([
            { latitude: USER_LAT, longitude: USER_LON },
            { latitude: 52.3690, longitude: 4.8970 },
            { latitude: 52.3700, longitude: 4.8950 },
            { latitude: location.latitude, longitude: location.longitude },
          ])}
        >
          <MapLibreGL.LineLayer
            id="routeLine"
            style={{ lineColor: DSColors.primary, lineWidth: 4 }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>

      {/* ETA overlay card */}
      <View style={[styles.overlayCard, { top: insets.top + 8 }]}>
        <Text style={styles.chargerName}>{chargerName}</Text>
        <Text style={styles.etaLabel}>{etaMin} min walk — {distanceM} m</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlayCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15,15,15,0.85)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 10,
  },
  chargerName: {
    ...DSTypography.headingMd,
    color: '#FFFFFF',
  },
  etaLabel: {
    ...DSTypography.label,
    color: '#FFFFFF',
    marginTop: 4,
  },
  userMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: DSColors.primary,
  },
});
