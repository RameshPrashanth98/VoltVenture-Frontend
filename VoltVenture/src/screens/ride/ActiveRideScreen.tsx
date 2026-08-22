import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RideStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import { rideService } from '../../services/rideService';
import type { ActiveRide } from '../../types/ride';

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = StackScreenProps<RideStackParamList, 'ActiveRide'>;

// ─── Component ───────────────────────────────────────────────────────────────
export default function ActiveRideScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const insets = useSafeAreaInsets();

  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Start ride on mount
  useEffect(() => {
    let cancelled = false;
    rideService.startRide(bike).then(ride => {
      if (!cancelled) {
        startTimeRef.current = Date.now();
        setActiveRide(ride);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [bike]);

  // Count-up timer — runs regardless of loading state; display conditional on activeRide
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Derived display values
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timerDisplay =
    String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  const cost = ((elapsedSeconds / 60) * bike.pricePerMin).toFixed(2);

  // End ride handler
  const handleEndRide = useCallback(async () => {
    if (!activeRide) return;
    const rideSummary = await rideService.endRide(
      activeRide.id,
      bike,
      elapsedSeconds,
    );
    navigation.navigate('PaymentSummary', { rideSummary });
  }, [activeRide, bike, elapsedSeconds, navigation]);

  // Loading state — waiting for startRide to resolve
  if (!activeRide) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={DSColors.primary} />
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Full-screen map */}
      <MapLibreGL.MapView
        style={StyleSheet.absoluteFill}
        styleURL="https://demotiles.maplibre.org/style.json"
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <MapLibreGL.Camera
          centerCoordinate={[4.9041, 52.3676]}
          zoomLevel={13}
        />
        <MapLibreGL.PointAnnotation
          id="user-location"
          coordinate={[4.9041, 52.3676]}
        >
          <View style={styles.userMarker} />
        </MapLibreGL.PointAnnotation>
      </MapLibreGL.MapView>

      {/* Top overlay card */}
      <View style={[styles.overlayCard, { top: insets.top + 8 }]}>
        <View style={styles.cardRow}>
          {/* Left: timer + cost */}
          <View>
            <Text style={styles.timerText}>{timerDisplay}</Text>
            <Text style={styles.costText}>€{cost}</Text>
          </View>
          {/* Right: battery */}
          <View style={styles.batteryRow}>
            <MaterialCommunityIcons
              name="battery"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.batteryText}>{bike.batteryPct}%</Text>
          </View>
        </View>
      </View>

      {/* End Ride button — raw TouchableOpacity (NOT PrimaryButton) per D-05 */}
      <View style={[styles.endRideContainer, { bottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.endRideButton}
          onPress={handleEndRide}
          activeOpacity={0.8}
        >
          <Text style={styles.endRideLabel}>End Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    color: DSColors.primary,
  },
  costText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#FFFFFF',
    marginTop: 2,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batteryText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  endRideContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  endRideButton: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  endRideLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
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
