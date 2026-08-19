import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
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

type Props = StackScreenProps<NavStackParamList, 'NavigateToPoi'>;

export default function NavigateToPoiScreen({ route, navigation }: Props) {
  const { name, location } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  const distanceKm = haversineKm(USER_LAT, USER_LON, location.latitude, location.longitude);
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
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: (USER_LAT + location.latitude) / 2,
          longitude: (USER_LON + location.longitude) / 2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        scrollEnabled={false}
        zoomEnabled={true}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {/* User position dot */}
        <Marker coordinate={{ latitude: USER_LAT, longitude: USER_LON }}>
          <View style={styles.userMarker} />
        </Marker>
        {/* POI destination pin */}
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
          <MaterialCommunityIcons name="map-marker" size={24} color={DSColors.primary} />
        </Marker>
        {/* Route polyline — must be INSIDE MapView, not in overlay */}
        <Polyline
          coordinates={[
            { latitude: USER_LAT, longitude: USER_LON },
            { latitude: 52.3690, longitude: 4.9020 },
            { latitude: 52.3710, longitude: 4.9005 },
            { latitude: location.latitude, longitude: location.longitude },
          ]}
          strokeColor={DSColors.primary}
          strokeWidth={4}
        />
      </MapView>

      {/* Top ETA card */}
      <View style={[styles.overlayCard, { top: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.poiName}>{name}</Text>
        <Text style={styles.etaLabel}>
          {etaMin} min walk — {distanceM} m
        </Text>
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
  backButton: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  poiName: {
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
