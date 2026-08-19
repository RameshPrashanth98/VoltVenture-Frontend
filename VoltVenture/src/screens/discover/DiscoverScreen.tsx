import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';

type Props = StackScreenProps<DiscoverStackParamList, 'DiscoverMain'>;

export default function DiscoverScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView>
        <Text style={styles.screenTitle}>Discover</Text>

        {/* EXPLORE section */}
        <Text style={styles.sectionHeader}>EXPLORE</Text>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('CuratedRoutes')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Curated Routes"
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons name="map-route" size={20} color={DSColors.textPrimary} />
            <Text style={styles.menuRowText}>Curated Routes</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, styles.lastRowInSection]}
          onPress={() => navigation.navigate('VipHubs')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="VIP Hubs"
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons name="lightning-bolt-circle" size={20} color={DSColors.textPrimary} />
            <Text style={styles.menuRowText}>VIP Hubs</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
        </TouchableOpacity>

        {/* INFO section */}
        <Text style={styles.sectionHeader}>INFO</Text>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('Support')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Support & Help"
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons name="help-circle-outline" size={20} color={DSColors.textPrimary} />
            <Text style={styles.menuRowText}>Support & Help</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('PrivacyPolicy')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Privacy Policy"
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={DSColors.textPrimary} />
            <Text style={styles.menuRowText}>Privacy Policy</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, styles.lastRowInSection]}
          onPress={() => navigation.navigate('TermsOfService')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Terms of Service"
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons name="file-check-outline" size={20} color={DSColors.textPrimary} />
            <Text style={styles.menuRowText}>Terms of Service</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  screenTitle: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: DSColors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
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
  lastRowInSection: {
    borderBottomWidth: 1,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuRowText: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textPrimary,
  },
});
