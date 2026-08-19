import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RideStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import { paymentService } from '../../services/paymentService';
import type { SavedCard } from '../../types/payment';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = StackScreenProps<RideStackParamList, 'SelectPaymentMethod'>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SelectPaymentMethodScreen({ navigation }: Props) {
  const [cards] = useState<SavedCard[]>(() => paymentService.getSavedCards());

  function handleSelectCard(cardId: string) {
    paymentService.setDefault(cardId);
    navigation.goBack();
  }

  function renderCard({ item }: { item: SavedCard }) {
    return (
      <TouchableOpacity
        style={styles.cardRow}
        onPress={() => handleSelectCard(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardRowLeft}>
          <MaterialCommunityIcons
            name="credit-card"
            size={22}
            color={DSColors.textPrimary}
          />
          <View>
            <Text style={styles.cardName}>
              {item.brand} {'\u2022\u2022\u2022\u2022'} {item.last4}
            </Text>
            <Text style={styles.cardExpiry}>Expires {item.expiry}</Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="check-circle"
          size={20}
          color={item.isDefault ? DSColors.primary : 'transparent'}
        />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: DSColors.surface,
  },
  cardRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '500',
    color: DSColors.textPrimary,
  },
  cardExpiry: {
    fontSize: 13,
    color: DSColors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: DSColors.border,
  },
});
