import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Divider, Portal, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

type Props = StackScreenProps<DiscoverStackParamList, 'Support'>;

export default function SupportScreen({ navigation }: Props) {
  const [snackVisible, setSnackVisible] = useState(false);

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
        <Text style={styles.headerTitle}>Support & Help</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Section 1: Rides & Billing */}
        <List.Subheader style={styles.subheader}>Rides &amp; Billing</List.Subheader>
        <List.Accordion
          title="How do I start a ride?"
          titleStyle={styles.accordionTitle}
        >
          <List.Item
            description="Tap any green bike pin on the map, book the bike, and scan the QR code on the bike's handlebars. The ride starts automatically."
            descriptionStyle={styles.accordionBody}
            descriptionNumberOfLines={0}
          />
        </List.Accordion>
        <Divider style={{ backgroundColor: DSColors.border }} />
        <List.Accordion
          title="How am I charged?"
          titleStyle={styles.accordionTitle}
        >
          <List.Item
            description="You're charged per minute from the moment the bike unlocks. The session cost is shown in real-time on the Active Ride screen."
            descriptionStyle={styles.accordionBody}
            descriptionNumberOfLines={0}
          />
        </List.Accordion>
        <Divider style={{ backgroundColor: DSColors.border }} />
        <List.Accordion
          title="How do I end a ride?"
          titleStyle={styles.accordionTitle}
        >
          <List.Item
            description="Tap 'End Ride' on the Active Ride screen. Park the bike in a designated VoltVenture zone and confirm. Payment is processed automatically."
            descriptionStyle={styles.accordionBody}
            descriptionNumberOfLines={0}
          />
        </List.Accordion>
        <Divider style={{ backgroundColor: DSColors.border }} />

        {/* Section 2: Account */}
        <List.Subheader style={styles.subheader}>Account</List.Subheader>
        <List.Accordion
          title="How do I reset my password?"
          titleStyle={styles.accordionTitle}
        >
          <List.Item
            description="On the Login screen, tap 'Forgot password?' and enter your email. You'll receive a reset link within a few minutes."
            descriptionStyle={styles.accordionBody}
            descriptionNumberOfLines={0}
          />
        </List.Accordion>
        <Divider style={{ backgroundColor: DSColors.border }} />
        <List.Accordion
          title="How do I add a payment method?"
          titleStyle={styles.accordionTitle}
        >
          <List.Item
            description="Go to Account → Payment Methods → Add Payment Method. Enter your card details and tap Save."
            descriptionStyle={styles.accordionBody}
            descriptionNumberOfLines={0}
          />
        </List.Accordion>
        <Divider style={{ backgroundColor: DSColors.border }} />
        <List.Accordion
          title="How do I view my ride history?"
          titleStyle={styles.accordionTitle}
        >
          <List.Item
            description="Go to Account → Ride History. All past rides with cost, duration, and distance are listed there."
            descriptionStyle={styles.accordionBody}
            descriptionNumberOfLines={0}
          />
        </List.Accordion>
        <Divider style={{ backgroundColor: DSColors.border }} />

        {/* Section 3: Bikes & Safety */}
        <List.Subheader style={styles.subheader}>Bikes &amp; Safety</List.Subheader>
        <List.Accordion
          title="What if the bike doesn't unlock?"
          titleStyle={styles.accordionTitle}
        >
          <List.Item
            description="Check your Bluetooth and internet connection, then try again. If the issue persists, tap 'Cancel Booking' and contact support."
            descriptionStyle={styles.accordionBody}
            descriptionNumberOfLines={0}
          />
        </List.Accordion>
        <Divider style={{ backgroundColor: DSColors.border }} />
        <List.Accordion
          title="What should I do in an emergency?"
          titleStyle={styles.accordionTitle}
        >
          <List.Item
            description="Call local emergency services immediately. You can also contact VoltVenture support via the Contact Support button below."
            descriptionStyle={styles.accordionBody}
            descriptionNumberOfLines={0}
          />
        </List.Accordion>
        <Divider style={{ backgroundColor: DSColors.border }} />

        {/* Contact Support button */}
        <View style={styles.contactButton}>
          <PrimaryButton label="Contact Support" onPress={() => setSnackVisible(true)} />
        </View>
      </ScrollView>

      <Portal>
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={2500}
        >
          Support chat coming soon
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
  subheader: {
    fontSize: 13,
    fontWeight: '600',
    color: DSColors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  accordionBody: {
    fontSize: 15,
    color: DSColors.textSecondary,
    lineHeight: 22,
  },
  contactButton: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
  },
});
