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
import { useAuthContext } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import type { AuthStackParamList } from '../../types/navigation';
import FormField from '../../components/common/FormField';
import PrimaryButton from '../../components/common/PrimaryButton';
import { DSColors } from '../../theme/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = StackScreenProps<AuthStackParamList, 'SignUp'>;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SignUpScreen({ navigation }: Props) {
  const authContext = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Clear form-level error whenever user types in either field
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (formError) setFormError(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (formError) setFormError(null);
  };

  const handleSignUp = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password, 'signup');
    if (eErr) setEmailError(eErr);
    if (pErr) setPasswordError(pErr);
    if (eErr || pErr) return;

    setIsLoading(true);
    try {
      const { token } = await authService.signUp(email, password);
      await authContext.signUp(token);
      // Do NOT call navigation.navigate() — AuthContext dispatches SIGN_IN
      // which causes RootNavigator to automatically switch to AppTabs
    } catch (err: any) {
      if (err?.code === 'EMAIL_ALREADY_IN_USE') {
        setEmailError('An account with this email already exists. Log in instead?');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text style={styles.title}>Create your account</Text>

            {/* Email field */}
            <FormField
              label="Email"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => setEmailError(validateEmail(email))}
              error={emailError ?? undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
              editable={!isLoading}
              testID="signup-email"
            />

            {/* Password field */}
            <FormField
              label="Password"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => setPasswordError(validatePassword(password, 'signup'))}
              error={passwordError ?? undefined}
              secureTextEntry
              placeholder="At least 8 characters"
              editable={!isLoading}
              testID="signup-password"
            />

            {/* Form-level error */}
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}

            {/* Submit */}
            <PrimaryButton
              label="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
              testID="signup-submit"
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social auth stubs */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => console.log('Social auth coming in Plan 01-05')}
                accessibilityLabel="Continue with Google"
              >
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.socialButton, styles.socialButtonGap]}
                  onPress={() => console.log('Social auth coming in Plan 01-05')}
                  accessibilityLabel="Continue with Apple"
                >
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Log in link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 24,
  },
  formError: {
    fontSize: 14,
    color: DSColors.error,
    marginBottom: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DSColors.border,
  },
  dividerText: {
    fontSize: 14,
    color: DSColors.textSecondary,
  },
  socialContainer: {
    width: '100%',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: DSColors.border,
    backgroundColor: DSColors.surface,
    height: 48,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonGap: {
    marginTop: 12,
  },
  socialButtonText: {
    fontSize: 14,
    color: DSColors.textPrimary,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  loginPrompt: {
    fontSize: 14,
    color: DSColors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: DSColors.accent,
  },
});
