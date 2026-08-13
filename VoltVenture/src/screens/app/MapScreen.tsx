import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DSColors, DSTypography } from '../../theme/theme';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Bikes Coming Soon</Text>
        <Text style={styles.body}>
          The map will show available e-bikes near you. Coming in the next update.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  heading: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    ...DSTypography.body,
    color: DSColors.textSecondary,
    textAlign: 'center',
  },
});
