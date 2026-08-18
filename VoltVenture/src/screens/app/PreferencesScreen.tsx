import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<AccountStackParamList, 'Preferences'>;

export default function PreferencesScreen({ navigation }: Props) {
  const [rideAlerts, setRideAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [r, p, s] = await Promise.all([
          AsyncStorage.getItem('prefs.notifications.ride'),
          AsyncStorage.getItem('prefs.notifications.promo'),
          AsyncStorage.getItem('prefs.notifications.system'),
        ]);
        setRideAlerts(r !== 'false');
        setPromoAlerts(p !== 'false');
        setSystemAlerts(s !== 'false');
      } catch {
        // silently use default true
      }
    })();
  }, []);

  async function handleRideAlertsToggle(value: boolean) {
    setRideAlerts(value);
    try { await AsyncStorage.setItem('prefs.notifications.ride', String(value)); } catch {}
  }

  async function handlePromoAlertsToggle(value: boolean) {
    setPromoAlerts(value);
    try { await AsyncStorage.setItem('prefs.notifications.promo', String(value)); } catch {}
  }

  async function handleSystemAlertsToggle(value: boolean) {
    setSystemAlerts(value);
    try { await AsyncStorage.setItem('prefs.notifications.system', String(value)); } catch {}
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Section label */}
      <Text style={styles.sectionHeader}>NOTIFICATION CATEGORIES</Text>

      {/* Ride Alerts toggle row */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleRowLeft}>
          <MaterialCommunityIcons name="bike" size={20} color={DSColors.textPrimary} />
          <View style={styles.toggleLabelGroup}>
            <Text style={styles.toggleLabel}>Ride Alerts</Text>
            <Text style={styles.toggleDescription}>
              Unlock confirmations and ride end summaries
            </Text>
          </View>
        </View>
        <Switch
          value={rideAlerts}
          onValueChange={handleRideAlertsToggle}
          trackColor={{ true: DSColors.primary }}
          accessibilityLabel="Ride Alerts notifications toggle"
        />
      </View>

      {/* Promotions toggle row */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleRowLeft}>
          <MaterialCommunityIcons name="tag-outline" size={20} color={DSColors.textPrimary} />
          <View style={styles.toggleLabelGroup}>
            <Text style={styles.toggleLabel}>Promotions</Text>
            <Text style={styles.toggleDescription}>
              Discounts and VoltCoins earn events
            </Text>
          </View>
        </View>
        <Switch
          value={promoAlerts}
          onValueChange={handlePromoAlertsToggle}
          trackColor={{ true: DSColors.primary }}
          accessibilityLabel="Promotions notifications toggle"
        />
      </View>

      {/* System toggle row */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleRowLeft}>
          <MaterialCommunityIcons name="shield-check-outline" size={20} color={DSColors.textPrimary} />
          <View style={styles.toggleLabelGroup}>
            <Text style={styles.toggleLabel}>System</Text>
            <Text style={styles.toggleDescription}>
              App updates and account security alerts
            </Text>
          </View>
        </View>
        <Switch
          value={systemAlerts}
          onValueChange={handleSystemAlertsToggle}
          trackColor={{ true: DSColors.primary }}
          accessibilityLabel="System notifications toggle"
        />
      </View>
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
});
