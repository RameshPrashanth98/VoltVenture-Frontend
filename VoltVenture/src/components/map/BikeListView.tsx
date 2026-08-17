import React from 'react';
import { FlatList, View, Text, StyleSheet, ListRenderItem } from 'react-native';
import { DSColors, DSTypography } from '../../theme/theme';
import BikeCard from './BikeCard';
import { Bike } from '../../types/bike';

interface BikeListViewProps {
  bikes: Bike[];
  onSelectBike: (bike: Bike) => void;
}

export default function BikeListView({ bikes, onSelectBike }: BikeListViewProps) {
  if (bikes.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No bikes match your filters.</Text>
      </View>
    );
  }

  const renderItem: ListRenderItem<Bike> = ({ item }) => (
    <BikeCard bike={item} onPress={() => onSelectBike(item)} />
  );

  return (
    <FlatList
      data={bikes}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  emptyText: {
    ...DSTypography.body,
    color: DSColors.textSecondary,
    textAlign: 'center',
  },
});
