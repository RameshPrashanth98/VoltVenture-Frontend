import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BookingStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

// ─── Types ───────────────────────────────────────────────────────────────────
type Props = StackScreenProps<BookingStackParamList, 'UnlockSuccess'>;

// ─── Component ───────────────────────────────────────────────────────────────
export default function UnlockSuccessScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {/* Check-circle icon */}
      <MaterialCommunityIcons
        name="check-circle"
        size={96}
        color={DSColors.primary}
        style={styles.icon}
      />

      {/* Heading */}
      <Text style={styles.heading}>Bike unlocked!</Text>

      {/* Bike name */}
      <Text style={styles.bikeName}>{bike.name}</Text>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Start Ride CTA — navigates to RideStack/ActiveRide modal */}
      <PrimaryButton
        label="Start Ride"
        onPress={() => navigation.getParent<any>()?.navigate('RideStack', { screen: 'SafetyMount', params: { bike } })}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DSColors.background,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    marginTop: 48,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: DSColors.textPrimary,
    textAlign: 'center',
    marginTop: 24,
  },
  bikeName: {
    ...DSTypography.headingMd,
    color: DSColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  spacer: {
    flex: 1,
  },
});
