import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { NavStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';

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

const USER_LAT = 52.3676;
const USER_LON = 4.9041;

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

type Props = StackScreenProps<NavStackParamList, 'NavigateToBike'>;

export default function NavigateToBikeScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  const distanceKm = haversineKm(USER_LAT, USER_LON, bike.latitude, bike.longitude);
  const etaMin = Math.round((distanceKm / 5) * 60);
  const distanceM = Math.round(distanceKm * 1000);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DSColors.primary} />
      </View>
    );
  }

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
            (USER_LON + bike.longitude) / 2,
            (USER_LAT + bike.latitude) / 2,
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
        {/* Bike destination pin */}
        <MapLibreGL.PointAnnotation
          id="route-end"
          coordinate={[bike.longitude, bike.latitude]}
        >
          <View>
            <MaterialCommunityIcons name="bicycle" size={24} color={DSColors.primary} />
          </View>
        </MapLibreGL.PointAnnotation>
        {/* Route line */}
        <MapLibreGL.ShapeSource
          id="route"
          shape={buildLineGeoJSON([
            { latitude: USER_LAT, longitude: USER_LON },
            { latitude: 52.3690, longitude: 4.9020 },
            { latitude: 52.3710, longitude: 4.9005 },
            { latitude: bike.latitude, longitude: bike.longitude },
          ])}
        >
          <MapLibreGL.LineLayer
            id="routeLine"
            style={{ lineColor: DSColors.primary, lineWidth: 4 }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>

      {/* Top ETA card */}
      <View style={[styles.overlayCard, { top: insets.top + 8 }]}>
        <Text style={styles.bikeName}>{bike.name}</Text>
        <Text style={styles.etaLabel}>
          {etaMin} min walk — {distanceM} m
        </Text>
        <TouchableOpacity
          style={styles.turnByTurnButton}
          onPress={() => navigation.push('WalkingDirections', { bike })}
        >
          <Text style={styles.turnByTurnLabel}>View Turn-by-Turn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DSColors.background,
  },
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
  bikeName: {
    ...DSTypography.headingMd,
    color: '#FFFFFF',
  },
  etaLabel: {
    ...DSTypography.label,
    color: '#FFFFFF',
    marginTop: 4,
  },
  turnByTurnButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  turnByTurnLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FFFFFF',
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
