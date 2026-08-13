import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<AuthStackParamList, 'AuthLanding'>;

export default function AuthLandingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Brand section — top area, centered */}
      <View style={styles.brandSection}>
        <Text style={styles.brandName}>VoltVenture</Text>
        <Text style={styles.brandTagline}>Ready to ride?</Text>
      </View>

      {/* CTA section — anchored bottom */}
      <View style={styles.ctaSection}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.createButton}
          contentStyle={styles.createButtonContent}
        >
          Create Account
        </Button>

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
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
  brandSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: DSColors.primary,
  },
  brandTagline: {
    fontSize: 24,
    fontWeight: '700',
    color: DSColors.textPrimary,
    marginTop: 8,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  createButton: {
    width: '100%',
  },
  createButtonContent: {
    height: 52,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginPrompt: {
    fontSize: 14,
    fontWeight: '400',
    color: DSColors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '400',
    color: DSColors.accent,
  },
});
