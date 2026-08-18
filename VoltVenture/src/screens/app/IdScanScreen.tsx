import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

type Props = StackScreenProps<AccountStackParamList, 'IdScan'>;

type ScanState = 'idle' | 'verifying' | 'success';

const VIEWFINDER_BG = DSColors.textPrimary;
const WHITE = '#FFFFFF';

export default function IdScanScreen({ navigation, route }: Props) {
  const [scanState, setScanState] = useState<ScanState>('idle');

  function startCapture() {
    setScanState('verifying');
    setTimeout(() => setScanState('success'), 1500);
  }

  function handleContinue() {
    route.params.onVerified?.();
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.flex}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ID Verification</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Instruction text */}
        {scanState !== 'success' && (
          <Text style={styles.instruction}>
            Position your ID document within the frame.
          </Text>
        )}

        {/* Viewfinder / Success card */}
        {scanState === 'idle' || scanState === 'verifying' ? (
          <View style={styles.viewfinder}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Verifying overlay */}
            {scanState === 'verifying' && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" color={DSColors.primary} />
                <Text style={styles.verifyingText}>Verifying...</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.successCard}>
            <MaterialCommunityIcons name="check-circle" size={72} color={DSColors.primary} />
            <Text style={styles.successText}>Identity Verified</Text>
          </View>
        )}

        {/* Button area */}
        <View style={styles.buttonArea}>
          {scanState === 'idle' && (
            <PrimaryButton label="Capture" onPress={startCapture} />
          )}
          {scanState === 'success' && (
            <PrimaryButton label="Continue" onPress={handleContinue} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  instruction: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  viewfinder: {
    backgroundColor: VIEWFINDER_BG,
    width: '100%',
    aspectRatio: 1.6,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: WHITE,
    borderWidth: 0,
  },
  topLeft: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  verifyingText: {
    fontSize: 15,
    fontWeight: '400',
    color: WHITE,
  },
  successCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  successText: {
    fontSize: 20,
    fontWeight: '700',
    color: DSColors.textPrimary,
  },
  buttonArea: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});
