import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BookingStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types/booking';
import PrimaryButton from '../../components/common/PrimaryButton';

type Props = StackScreenProps<BookingStackParamList, 'BookingConfirmation'>;

export default function BookingConfirmationScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const insets = useSafeAreaInsets();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(600);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Store the absolute expiry epoch in a ref so the interval always reads fresh value
  const expiresAt = useRef<number>(Date.now() + 600_000);

  // Reserve bike on mount
  useEffect(() => {
    let cancelled = false;
    bookingService.reserveBike(bike.id).then(result => {
      if (!cancelled) {
        setBooking(result);
        // Sync the expiry to the server-returned value
        expiresAt.current = new Date(result.expiresAt).getTime();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [bike.id]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expiresAt.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // When timer hits zero, show snackbar then navigate back
  useEffect(() => {
    if (secondsLeft === 0) {
      setSnackbarVisible(true);
      const timeout = setTimeout(() => {
        navigation.getParent()?.goBack();
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [secondsLeft, navigation]);

  const handleClose = useCallback(() => {
    navigation.getParent()?.goBack();
  }, [navigation]);

  const handleScanQR = useCallback(() => {
    navigation.navigate('QRScanner', { bike });
  }, [navigation, bike]);

  const handleBLEUnlock = useCallback(() => {
    navigation.navigate('BLEUnlock', { bike });
  }, [navigation, bike]);

  // Format seconds into MM:SS
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const countdownDisplay =
    String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

  // Capitalize bike type
  const bikeTypeDisplay =
    bike.type.charAt(0).toUpperCase() + bike.type.slice(1);

  if (!booking) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={DSColors.primary} />
        <Text style={styles.loadingText}>Reserving your bike...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={24} color={DSColors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Confirmation</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Countdown row */}
        <View style={styles.countdownRow}>
          <Text style={styles.countdownLabel}>Bike held for</Text>
          <Text style={styles.countdownTimer}>{countdownDisplay}</Text>
        </View>

        {/* Bike details card */}
        <View style={styles.bikeCard}>
          <Text style={styles.bikeName}>{bike.name}</Text>
          <Text style={styles.bikeType}>{bikeTypeDisplay}</Text>

          <View style={styles.statsRow}>
            {/* Battery */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="battery" size={18} color={DSColors.textSecondary} />
              <Text style={styles.statText}>{bike.batteryPct}%</Text>
            </View>
            {/* Price */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="currency-eur" size={18} color={DSColors.textSecondary} />
              <Text style={styles.statText}>€{bike.pricePerMin.toFixed(2)}/min</Text>
            </View>
            {/* Distance */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={DSColors.textSecondary} />
              <Text style={styles.statText}>
                {bike.distanceKm != null ? bike.distanceKm.toFixed(2) + ' km' : '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Static location card */}
        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker" size={24} color={DSColors.primary} />
            <Text style={styles.locationAddress}>Leidseplein 1, Amsterdam</Text>
          </View>
          <Text style={styles.locationInstructions}>
            Head to the marked location. The bike has a green QR code label on the frame.
          </Text>
        </View>

        {/* Unlock CTAs */}
        <View style={styles.ctaContainer}>
          <PrimaryButton label="Scan QR Code" onPress={handleScanQR} />
          <Button
            mode="outlined"
            onPress={handleBLEUnlock}
            style={styles.bleButton}
            textColor={DSColors.textPrimary}
          >
            Unlock via Bluetooth
          </Button>
        </View>
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
      >
        Reservation expired — returning to map
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: DSColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    ...DSTypography.body,
    color: DSColors.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    ...DSTypography.headingMd,
    color: DSColors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  // Countdown
  countdownRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  countdownLabel: {
    ...DSTypography.label,
    color: DSColors.textSecondary,
    marginBottom: 4,
  },
  countdownTimer: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
  },
  // Bike card
  bikeCard: {
    borderWidth: 1,
    borderColor: DSColors.border,
    borderRadius: 12,
    padding: 16,
  },
  bikeName: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
    marginBottom: 4,
  },
  bikeType: {
    ...DSTypography.body,
    color: DSColors.textSecondary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    ...DSTypography.body,
    color: DSColors.textSecondary,
  },
  // Location card
  locationCard: {
    backgroundColor: DSColors.surface,
    borderRadius: 12,
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationAddress: {
    ...DSTypography.body,
    color: DSColors.textPrimary,
    flex: 1,
  },
  locationInstructions: {
    ...DSTypography.body,
    color: DSColors.textSecondary,
  },
  // CTAs
  ctaContainer: {
    gap: 12,
    marginTop: 8,
  },
  bleButton: {
    width: '100%',
    marginTop: 0,
  },
});
