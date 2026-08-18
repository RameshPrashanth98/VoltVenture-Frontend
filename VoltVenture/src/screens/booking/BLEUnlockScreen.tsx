import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BookingStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';

type Props = StackScreenProps<BookingStackParamList, 'BLEUnlock'>;

export default function BLEUnlockScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const [bleState, setBleState] = useState<'scanning' | 'found' | 'connecting'>('scanning');

  useEffect(() => {
    const t1: ReturnType<typeof setTimeout> = setTimeout(() => setBleState('found'), 1500);
    const t2: ReturnType<typeof setTimeout> = setTimeout(() => setBleState('connecting'), 2500);
    const t3: ReturnType<typeof setTimeout> = setTimeout(
      () => navigation.navigate('UnlockSuccess', { bike }),
      3500,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigation, bike]);

  return (
    <View style={styles.container}>
      {/* Bluetooth icon — always visible */}
      <MaterialCommunityIcons name="bluetooth" size={48} color={DSColors.primary} />

      {/* State-conditional content */}
      {bleState === 'scanning' && (
        <>
          <ActivityIndicator
            size="large"
            color={DSColors.primary}
            style={styles.indicator}
          />
          <Text style={styles.statusText}>Looking for nearby bikes…</Text>
        </>
      )}

      {bleState === 'found' && (
        <>
          <Text style={styles.bikeNameText}>{bike.name}</Text>
          <Text style={styles.foundText}>Bike found</Text>
        </>
      )}

      {bleState === 'connecting' && (
        <>
          <ActivityIndicator
            size="large"
            color={DSColors.primary}
            style={styles.indicator}
          />
          <Text style={styles.statusText}>Unlocking…</Text>
        </>
      )}

      {/* Cancel button — always visible, pushed to bottom */}
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        textColor={DSColors.textSecondary}
        style={styles.cancelButton}
      >
        Cancel
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DSColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  indicator: {
    marginTop: 24,
  },
  statusText: {
    ...DSTypography.body,
    color: DSColors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  bikeNameText: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
    textAlign: 'center',
    marginTop: 24,
  },
  foundText: {
    ...DSTypography.body,
    color: DSColors.accent,
    textAlign: 'center',
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 'auto' as unknown as number,
    marginBottom: 16,
  },
});
