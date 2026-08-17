import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../common/PrimaryButton';
import { FilterState } from '../../types/bike';

interface FilterSheetProps {
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
}

export default function FilterSheet({ initialFilters, onApply }: FilterSheetProps) {
  const [draft, setDraft] = useState<FilterState>(initialFilters);

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.handle} />
      <Text style={styles.title}>Filters</Text>

      <View style={styles.chipGroup}>
        <Text style={styles.filterLabel}>Battery Level</Text>
        <View style={styles.chipRow}>
          {(['low', 'med', 'high'] as const).map(level => (
            <Chip
              key={level}
              selected={draft.battery === level}
              onPress={() => setDraft(d => ({ ...d, battery: d.battery === level ? undefined : level }))}
              style={draft.battery === level ? styles.chipSelected : undefined}
              selectedColor={draft.battery === level ? DSColors.textOnPrimary : undefined}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.chipGroup}>
        <Text style={styles.filterLabel}>Price Range</Text>
        <View style={styles.chipRow}>
          {(['low', 'med', 'high'] as const).map(level => (
            <Chip
              key={level}
              selected={draft.price === level}
              onPress={() => setDraft(d => ({ ...d, price: d.price === level ? undefined : level }))}
              style={draft.price === level ? styles.chipSelected : undefined}
              selectedColor={draft.price === level ? DSColors.textOnPrimary : undefined}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.chipGroup}>
        <Text style={styles.filterLabel}>Bike Type</Text>
        <View style={styles.chipRow}>
          {(['standard', 'speed', 'cargo'] as const).map(t => (
            <Chip
              key={t}
              selected={draft.type === t}
              onPress={() => setDraft(d => ({ ...d, type: d.type === t ? undefined : t }))}
              style={draft.type === t ? styles.chipSelected : undefined}
              selectedColor={draft.type === t ? DSColors.textOnPrimary : undefined}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      <PrimaryButton label="Apply filters" onPress={() => onApply(draft)} />
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: DSColors.border,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
    marginBottom: 20,
  },
  filterLabel: {
    ...DSTypography.label,
    color: DSColors.textSecondary,
    marginBottom: 8,
  },
  chipGroup: {
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipSelected: {
    backgroundColor: DSColors.primary,
  },
});
