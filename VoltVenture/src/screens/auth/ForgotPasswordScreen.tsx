import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';

import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/validation';
import type { AuthStackParamList } from '../../types/navigation';
import FormField from '../../components/common/FormField';
import PrimaryButton from '../../components/common/PrimaryButton';
import { DSColors } from '../../theme/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = StackScreenProps<AuthStackParamList, 'ForgotPassword'>;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSendReset = async () => {
    const eErr = validateEmail(email);
    if (eErr) { setEmailError(eErr); return; }

    setIsLoading(true);
    try {
      await authService.sendPasswordResetEmail(email);
      setShowSuccess(true);
    } catch (err: any) {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Success state ────────────────────────────────────────────────────────────

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <MaterialCommunityIcons
            name="email-check-outline"
            size={64}
            color={DSColors.accent}
          />
          <Text style={styles.successTitle}>Check your inbox</Text>
          <Text style={styles.successBody}>
            {`We sent a reset link to ${email}. It may take a minute to arrive.`}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.backToLoginButton}
          >
            <Text style={styles.backToLoginText}>Back to Log In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Form state ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.inner}>
            {/* Back button */}
            {navigation.canGoBack() && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Go back"
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={DSColors.textPrimary}
                />
              </TouchableOpacity>
            )}

            {/* Title */}
            <Text style={styles.title}>Reset your password</Text>

            {/* Body text */}
            <Text style={styles.bodyText}>
              Enter your email and we'll send you a link to reset your password.
            </Text>

            {/* Email field */}
            <FormField
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (formError) setFormError(null);
              }}
              onBlur={() => setEmailError(validateEmail(email))}
              error={emailError ?? undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              testID="forgot-email"
            />

            {/* Form-level error */}
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}

            {/* Submit */}
            <PrimaryButton
              label="Send Reset Link"
              onPress={handleSendReset}
              loading={isLoading}
              testID="forgot-submit"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: DSColors.textPrimary,
    marginTop: 56,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: '400',
    color: DSColors.textSecondary,
    marginBottom: 24,
  },
  formError: {
    fontSize: 14,
    color: DSColors.error,
    marginBottom: 12,
  },
  // ── Success state ────────────────────────────────────────────────────────────
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DSColors.textPrimary,
    marginTop: 24,
    textAlign: 'center',
  },
  successBody: {
    fontSize: 16,
    color: DSColors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  backToLoginButton: {
    marginTop: 32,
  },
  backToLoginText: {
    fontSize: 14,
    color: DSColors.accent,
  },
});
