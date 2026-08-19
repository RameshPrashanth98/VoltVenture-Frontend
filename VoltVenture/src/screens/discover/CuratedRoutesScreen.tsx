import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip, Portal, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<DiscoverStackParamList, 'CuratedRoutes'>;

type Route = {
  id: string;
  name: string;
  distanceKm: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  tags: string[];
};

const MOCK_ROUTES: Route[] = [
  { id: 'r1', name: 'Canal Ring Classic', distanceKm: 12, difficulty: 'Easy', tags: ['Waterfront', 'Historic'] },
  { id: 'r2', name: 'Vondelpark Loop', distanceKm: 8, difficulty: 'Easy', tags: ['Parks', 'Family-friendly'] },
  { id: 'r3', name: 'Harbor Views Ride', distanceKm: 18, difficulty: 'Moderate', tags: ['Waterfront', 'Scenic'] },
  { id: 'r4', name: 'Amstel Riverside Run', distanceKm: 22, difficulty: 'Moderate', tags: ['Riverside', 'Local'] },
  { id: 'r5', name: 'Noord Cross', distanceKm: 28, difficulty: 'Challenging', tags: ['Cross-river', 'Advanced'] },
];

function getDifficultyStyle(difficulty: Route['difficulty']) {
  switch (difficulty) {
    case 'Easy':
      return { bg: 'rgba(125,146,32,0.12)', color: DSColors.accent };
    case 'Moderate':
      return { bg: 'rgba(255,152,0,0.12)', color: '#E65100' };
    case 'Challenging':
      return { bg: 'rgba(176,0,32,0.12)', color: DSColors.destructive };
  }
}

export default function CuratedRoutesScreen({ navigation }: Props) {
  const [snackVisible, setSnackVisible] = useState(false);

  const renderItem = ({ item }: { item: Route }) => {
    const diffStyle = getDifficultyStyle(item.difficulty);
    return (
      <TouchableOpacity
        onPress={() => setSnackVisible(true)}
        activeOpacity={0.8}
        style={styles.card}
      >
        <View style={styles.cardRow1}>
          <Text style={styles.routeName}>{item.name}</Text>
          <Text
            style={[styles.badge, { backgroundColor: diffStyle.bg, color: diffStyle.color }]}
            accessibilityLabel={`${item.difficulty} difficulty`}
          >
            {item.difficulty}
          </Text>
        </View>
        <View style={styles.distanceRow}>
          <MaterialCommunityIcons name="map-marker-distance" size={14} color={DSColors.textSecondary} />
          <Text style={styles.distanceText}>{item.distanceKm} km</Text>
        </View>
        <View style={styles.tagsRow}>
          {item.tags.map(tag => (
            <Chip
              key={tag}
              compact
              textStyle={{ color: DSColors.textSecondary }}
              style={styles.chip}
            >
              {tag}
            </Chip>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Curated Routes</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={MOCK_ROUTES}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      <Portal>
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={2500}
        >
          Route details coming soon
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: DSColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DSColors.border,
    padding: 16,
    elevation: 1,
  },
  cardRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 20,
    fontWeight: '600',
    color: DSColors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 13,
    fontWeight: '600',
    overflow: 'hidden',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 15,
    color: DSColors.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: DSColors.surface,
    borderColor: DSColors.border,
    borderWidth: 1,
  },
});
