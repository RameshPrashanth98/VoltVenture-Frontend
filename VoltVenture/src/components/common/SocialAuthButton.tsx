import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DSColors } from '../../theme/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialAuthButtonProps {
  label: string;
  iconName: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SocialAuthButton({
  label,
  iconName,
  onPress,
  disabled = false,
  testID,
}: SocialAuthButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
      testID={testID}
      accessibilityRole="button"
    >
      <View style={styles.inner}>
        <MaterialCommunityIcons
          name={iconName as any}
          size={20}
          color={DSColors.textPrimary}
          style={styles.icon}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Mock helper ──────────────────────────────────────────────────────────────

// TODO: Replace with real GoogleSignin.configure() + GoogleSignin.signIn() in integration phase.
// GoogleSignin requires a dev build (not Expo Go) and real OAuth credentials — see RESEARCH.md Pitfall 1.
export async function getMockGoogleToken(): Promise<string> {
  return new Promise((resolve) =>
    setTimeout(() => resolve('mock-google-token-' + Date.now()), 1000)
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: DSColors.surface,
    borderWidth: 1,
    borderColor: DSColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: DSColors.textPrimary,
  },
});
