import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<DiscoverStackParamList, 'PrivacyPolicy'>;

export default function PrivacyPolicyScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Custom header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1 */}
        <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Data We Collect</Text>
        <Text style={styles.paragraph}>
          VoltVenture collects information you provide when creating an account (name, email address), payment details processed securely through our payment provider, and location data while the app is in use to display nearby bikes and calculate ride distances.
        </Text>
        <Text style={styles.paragraph}>
          We also collect device information (device model, OS version) and usage data (screens viewed, session duration) to improve app performance and identify issues.
        </Text>

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>How We Use Your Data</Text>
        <Text style={styles.paragraph}>
          Your data is used to provide and improve the VoltVenture service, process payments, display nearby bikes on the map, calculate ride costs and distances, and send optional promotional communications (if you have opted in via Notification Preferences).
        </Text>
        <Text style={styles.paragraph}>
          We do not sell your personal data to third parties. Anonymised aggregate data may be shared with municipal partners to improve cycling infrastructure planning.
        </Text>

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>Your Rights (GDPR)</Text>
        <Text style={styles.paragraph}>
          Under the General Data Protection Regulation (GDPR), you have the right to access, correct, or delete your personal data at any time. You may also restrict or object to certain processing activities and request data portability.
        </Text>
        <Text style={styles.paragraph}>
          To exercise these rights, contact our Data Protection Officer at privacy@voltventure.app. We will respond within 30 days.
        </Text>

        {/* Section 4 */}
        <Text style={styles.sectionTitle}>Data Retention</Text>
        <Text style={styles.paragraph}>
          Account data is retained for as long as your account is active. Ride history is retained for 24 months for billing and dispute purposes. If you delete your account, personal data is removed within 30 days, except where retention is required by law (e.g., financial records retained for 7 years per EU accounting regulations).
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: DSColors.border,
    backgroundColor: DSColors.background,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 64,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: DSColors.textPrimary,
    marginBottom: 8,
    marginTop: 24,
  },
  paragraph: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
});
