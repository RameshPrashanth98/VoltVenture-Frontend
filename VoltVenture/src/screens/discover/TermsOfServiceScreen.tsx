import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<DiscoverStackParamList, 'TermsOfService'>;

export default function TermsOfServiceScreen({ navigation }: Props) {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1 */}
        <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Use of the Service</Text>
        <Text style={styles.paragraph}>
          VoltVenture provides electric bike rental services through this mobile application. By creating an account and using the app, you agree to these Terms of Service. You must be at least 18 years of age to register and use the service.
        </Text>

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>Bookings &amp; Payments</Text>
        <Text style={styles.paragraph}>
          Bookings are confirmed in the app and are subject to bike availability. Rides are charged per minute from the moment the bike unlocks. You authorise VoltVenture to charge your registered payment method at the end of each ride. All prices include applicable VAT.
        </Text>

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>User Responsibilities</Text>
        <Text style={styles.paragraph}>
          You are responsible for riding safely and in accordance with local traffic laws. You must wear a helmet where required by law. Bikes must be parked only in designated VoltVenture zones. You are liable for any damage to the bike caused by misuse or negligence.
        </Text>

        {/* Section 4 */}
        <Text style={styles.sectionTitle}>Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          VoltVenture is not liable for injuries, losses, or damages arising from the use of the service beyond the extent permitted by applicable law. We maintain public liability insurance for all rented bikes. If you experience a safety issue, contact us immediately at support@voltventure.app.
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
