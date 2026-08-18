import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch, Snackbar, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<AccountStackParamList, 'LoginSecurity'>;

const AMBER = '#F59E0B';

export default function LoginSecurityScreen({ navigation }: Props) {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  function handleTwoFAToggle(value: boolean) {
    setTwoFAEnabled(value);
    setSnackMessage(
      value ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled',
    );
    setSnackVisible(true);
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
          <Text style={styles.headerTitle}>Security</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Section 1 — Account Security */}
          <Text style={styles.sectionHeader}>ACCOUNT SECURITY</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleRowLeft}>
              <MaterialCommunityIcons name="shield-account" size={20} color={DSColors.textPrimary} />
              <View style={styles.toggleLabelGroup}>
                <Text style={styles.toggleLabel}>Two-Factor Authentication</Text>
                <Text style={styles.toggleDescription}>Require a code when signing in</Text>
              </View>
            </View>
            <Switch
              value={twoFAEnabled}
              onValueChange={handleTwoFAToggle}
              trackColor={{ true: DSColors.primary, false: DSColors.border }}
              thumbColor={DSColors.background}
              accessibilityLabel={`Two-Factor Authentication, currently ${twoFAEnabled ? 'on' : 'off'}`}
            />
          </View>

          {/* Section 2 — Active Sessions */}
          <Text style={styles.sectionHeader}>ACTIVE SESSIONS</Text>

          <View style={styles.sessionRow}>
            <MaterialCommunityIcons name="cellphone" size={24} color={DSColors.textSecondary} />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionDevice}>iPhone 14 Pro</Text>
              <Text style={styles.sessionMeta}>
                Bangkok, Thailand ·{' '}
                <Text style={{ color: DSColors.accent }}>Active now</Text>
              </Text>
            </View>
          </View>

          <View style={styles.sessionRow}>
            <MaterialCommunityIcons name="monitor" size={24} color={DSColors.textSecondary} />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionDevice}>Chrome on Windows</Text>
              <Text style={styles.sessionMeta}>
                Chiang Mai, Thailand · <Text style={{ color: DSColors.textSecondary }}>2 days ago</Text>
              </Text>
            </View>
          </View>

          <View style={styles.sessionRow}>
            <MaterialCommunityIcons name="tablet" size={24} color={DSColors.textSecondary} />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionDevice}>iPad Air</Text>
              <Text style={styles.sessionMeta}>
                Phuket, Thailand · <Text style={{ color: DSColors.textSecondary }}>5 days ago</Text>
              </Text>
            </View>
          </View>

          {/* Section 3 — Identity Verification */}
          <Text style={styles.sectionHeader}>IDENTITY VERIFICATION</Text>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('IdScan', { onVerified: () => setIdVerified(true) })}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Verify Identity, status ${idVerified ? 'Verified' : 'Pending'}`}
          >
            <View style={styles.menuRowLeft}>
              <MaterialCommunityIcons name="fingerprint" size={20} color={DSColors.textPrimary} />
              <Text style={styles.menuRowText}>Verify Identity (ID Scan)</Text>
            </View>
            <View style={styles.rowRight}>
              <View style={[styles.badge, { backgroundColor: idVerified ? DSColors.primary : AMBER }]}>
                <Text style={[styles.badgeText, { color: idVerified ? DSColors.textOnPrimary : '#FFFFFF' }]}>
                  {idVerified ? 'Verified' : 'Pending'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('FacialScan', { onVerified: () => setFaceVerified(true) })}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Facial Verification, status ${faceVerified ? 'Verified' : 'Pending'}`}
          >
            <View style={styles.menuRowLeft}>
              <MaterialCommunityIcons name="face-recognition" size={20} color={DSColors.textPrimary} />
              <Text style={styles.menuRowText}>Facial Verification</Text>
            </View>
            <View style={styles.rowRight}>
              <View style={[styles.badge, { backgroundColor: faceVerified ? DSColors.primary : AMBER }]}>
                <Text style={[styles.badgeText, { color: faceVerified ? DSColors.textOnPrimary : '#FFFFFF' }]}>
                  {faceVerified ? 'Verified' : 'Pending'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Section 4 — Security */}
          <Text style={styles.sectionHeader}>SECURITY</Text>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('SecurityDeposit')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Security Deposit"
          >
            <View style={styles.menuRowLeft}>
              <MaterialCommunityIcons name="bank" size={20} color={DSColors.textPrimary} />
              <Text style={styles.menuRowText}>Security Deposit</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Portal>
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={3000}
        >
          {snackMessage}
        </Snackbar>
      </Portal>
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
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: DSColors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: DSColors.surface,
    borderTopWidth: 1,
    borderColor: DSColors.border,
  },
  toggleRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  toggleLabelGroup: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: DSColors.textPrimary,
  },
  toggleDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: DSColors.textSecondary,
    marginTop: 2,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: DSColors.surface,
    borderTopWidth: 1,
    borderColor: DSColors.border,
    gap: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: 15,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  sessionMeta: {
    fontSize: 13,
    fontWeight: '400',
    color: DSColors.textSecondary,
    marginTop: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: DSColors.surface,
    borderTopWidth: 1,
    borderColor: DSColors.border,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuRowText: {
    fontSize: 16,
    fontWeight: '400',
    color: DSColors.textPrimary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
