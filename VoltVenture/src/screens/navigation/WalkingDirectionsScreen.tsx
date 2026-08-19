import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { NavStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';

type Step = { id: string; icon: string; text: string; distance: string; isArrival?: boolean };

const MOCK_STEPS: Step[] = [
  { id: '1', icon: 'arrow-up', text: 'Head north on Damrak', distance: '150 m' },
  { id: '2', icon: 'arrow-left', text: 'Turn left onto Nieuwendijk', distance: '200 m' },
  { id: '3', icon: 'arrow-up', text: 'Continue straight for 200 m', distance: '200 m' },
  { id: '4', icon: 'arrow-right', text: 'Turn right onto Warmoesstraat', distance: '120 m' },
  { id: '5', icon: 'flag-checkered', text: 'Arrive at your bike — right side of the street', distance: '', isArrival: true },
];

type Props = StackScreenProps<NavStackParamList, 'WalkingDirections'>;

export default function WalkingDirectionsScreen({ navigation }: Props) {
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
        <Text style={styles.headerTitle}>Walking Directions</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={MOCK_STEPS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <View style={styles.stepRow}>
            <View style={styles.iconColumn}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={item.isArrival ? DSColors.primary : DSColors.textPrimary}
              />
            </View>
            <Text style={styles.stepText}>{item.text}</Text>
            {item.distance ? (
              <Text style={styles.stepDistance}>{item.distance}</Text>
            ) : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

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
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: DSColors.border,
  },
  iconColumn: { width: 32 },
  stepText: { ...DSTypography.body, color: DSColors.textPrimary, flex: 1 },
  stepDistance: { ...DSTypography.label, color: DSColors.textSecondary, minWidth: 48, textAlign: 'right' },
});
