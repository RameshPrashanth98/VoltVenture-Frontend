import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BookingStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';

// ─── Viewfinder constants ─────────────────────────────────────────────────────
const BRACKET_SIZE = 240;       // dp — square viewfinder frame
const BRACKET_THICKNESS = 4;    // dp — border line weight
const BRACKET_LENGTH = 32;      // dp — length of each corner bracket arm
const BRACKET_COLOR = DSColors.primary; // '#C6FF2D' Electric Green

// ─── Types ───────────────────────────────────────────────────────────────────
type Props = StackScreenProps<BookingStackParamList, 'QRScanner'>;

// ─── Component ───────────────────────────────────────────────────────────────
export default function QRScannerScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const hasScanned = useRef(false);
  const insets = useSafeAreaInsets();

  const handleBarcodeScanned = useCallback(
    (_result: BarcodeScanningResult) => {
      if (hasScanned.current) return;
      hasScanned.current = true;
      navigation.navigate('UnlockSuccess', { bike });
    },
    [navigation, bike],
  );

  // Branch 1: permission still resolving (null)
  if (!permission) {
    return <View style={styles.loading} />;
  }

  // Branch 2: permanently denied — show Open Settings link
  if (!permission.granted && !permission.canAskAgain) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionText}>
          Camera access was denied. Enable it in Settings to scan QR codes.
        </Text>
        <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.settingsLink}>
          <Text style={styles.settingsLinkText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Branch 3: requestable — show Allow Camera button
  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionText}>
          Camera access is needed to scan the bike QR code.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.allowButton}>
          <Text style={styles.allowButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Branch 4: camera granted — full scanner UI
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Camera */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Viewfinder overlay — centred absolute container */}
      <View style={styles.viewfinderContainer} pointerEvents="none">
        <View style={styles.viewfinder}>
          {/* Top-left corner */}
          <View style={[styles.corner, styles.cornerTL]} />
          {/* Top-right corner */}
          <View style={[styles.corner, styles.cornerTR]} />
          {/* Bottom-left corner */}
          <View style={[styles.corner, styles.cornerBL]} />
          {/* Bottom-right corner */}
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        {/* Instruction text below the viewfinder */}
        <Text style={styles.instructionText}>Point at the bike's QR code</Text>
      </View>

      {/* Close button — top-left with safe area offset */}
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 16 }]}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="close" size={28} color={DSColors.background} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: DSColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionText: {
    ...DSTypography.body,
    color: DSColors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  settingsLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  settingsLinkText: {
    ...DSTypography.label,
    color: DSColors.accent,
  },
  allowButton: {
    backgroundColor: DSColors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  allowButtonText: {
    ...DSTypography.label,
    color: DSColors.textOnPrimary,
  },
  viewfinderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
  },
  corner: {
    position: 'absolute',
    width: BRACKET_LENGTH,
    height: BRACKET_LENGTH,
    borderColor: BRACKET_COLOR,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
  },
  instructionText: {
    ...DSTypography.body,
    color: DSColors.background,
    textAlign: 'center',
    marginTop: 24,
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
});
