import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

type Props = StackScreenProps<AccountStackParamList, 'FacialScan'>;

type ScanState = 'idle' | 'verifying' | 'success';

const VIEWFINDER_BG = DSColors.textPrimary;
const WHITE = '#FFFFFF';

export default function FacialScanScreen({ navigation, route }: Props) {
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
          <Text style={styles.headerTitle}>Facial Verification</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Instruction text */}
        {scanState !== 'success' && (
          <Text style={styles.instruction}>
            Center your face within the frame and hold still.
          </Text>
        )}

        {/* Viewfinder / Success card */}
        {scanState === 'idle' || scanState === 'verifying' ? (
          <View style={styles.viewfinder}>
            {/* Oval face guide — shown in idle only */}
            {scanState === 'idle' && <View style={styles.oval} />}

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
            <Text style={styles.successText}>Face Verified</Text>
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
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oval: {
    width: 200,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: WHITE,
    borderStyle: 'solid',
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
