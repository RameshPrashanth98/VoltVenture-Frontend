import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DSColors } from '../../theme/theme';

// Placeholder — replaced in Plan 01-02
// This React Navigation screen shows after the OS splash (expo-splash-screen) hides.
export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VoltVenture</Text>
      <Text style={styles.tagline}>Explore the city on two wheels.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DSColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: DSColors.textOnPrimary,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: DSColors.textOnPrimary,
    marginTop: 8,
  },
});
