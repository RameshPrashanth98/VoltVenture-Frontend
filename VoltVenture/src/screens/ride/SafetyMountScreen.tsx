import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RideStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

// ─── Types ───────────────────────────────────────────────────────────────────
type ChecklistItem = { id: number; label: string; icon: string };

type Props = StackScreenProps<RideStackParamList, 'SafetyMount'>;

// ─── Data ────────────────────────────────────────────────────────────────────
const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 1, label: 'Helmet secured',      icon: 'helmet' },
  { id: 2, label: 'Brakes tested',       icon: 'car-brake-hold' },
  { id: 3, label: 'Lights working',      icon: 'lightbulb-on' },
  { id: 4, label: 'App tracking active', icon: 'map-marker-check' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function SafetyMountScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allChecked = checked.size === CHECKLIST_ITEMS.length;

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
        <Text style={styles.headerTitle}>Safety Check</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
        <Text style={styles.subtitle}>Complete all checks before starting your ride</Text>

        {CHECKLIST_ITEMS.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.checkRow}
            onPress={() => toggleItem(item.id)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: checked.has(item.id) }}
            accessibilityLabel={item.label}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={24}
              color={checked.has(item.id) ? DSColors.accent : DSColors.textSecondary}
            />
            <Text style={styles.checkLabel}>{item.label}</Text>
            <MaterialCommunityIcons
              name={checked.has(item.id) ? 'check-circle' : 'circle-outline'}
              size={24}
              color={checked.has(item.id) ? DSColors.accent : DSColors.border}
            />
          </TouchableOpacity>
        ))}

        <PrimaryButton
          label="Start Ride"
          disabled={!allChecked}
          onPress={() => navigation.navigate('ActiveRide', { bike })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DSColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DSColors.border,
    height: 56,
  },
  headerTitle: { ...DSTypography.headingMd, color: DSColors.textPrimary },
  subtitle: { ...DSTypography.body, color: DSColors.textSecondary, marginBottom: 24 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: DSColors.border,
  },
  checkLabel: { ...DSTypography.body, color: DSColors.textPrimary, flex: 1 },
});
