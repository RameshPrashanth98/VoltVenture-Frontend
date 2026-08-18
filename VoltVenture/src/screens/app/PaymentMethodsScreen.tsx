import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<AccountStackParamList, 'PaymentMethods'>;

export default function PaymentMethodsScreen({ navigation }: Props) {
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Saved Methods section */}
      <Text style={styles.sectionHeader}>Saved Methods</Text>

      {/* Saved card row */}
      <View style={styles.cardRow}>
        <View style={styles.cardRowLeft}>
          <MaterialCommunityIcons
            name="credit-card"
            size={22}
            color={DSColors.textPrimary}
          />
          <View>
            <Text style={styles.cardName}>Visa {'\u2022\u2022\u2022\u2022'} 4242</Text>
            <Text style={styles.cardExpiry}>Expires 12/26</Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="check-circle"
          size={18}
          color={DSColors.primary}
        />
      </View>

      {/* Separator */}
      <View style={styles.divider} />

      {/* Actions section */}
      <Text style={[styles.sectionHeader, styles.sectionHeaderActions]}>Actions</Text>

      {/* Add Payment Method row */}
      <TouchableOpacity
        style={styles.addRow}
        onPress={() => setSnackbarVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.addRowLeft}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={22}
            color={DSColors.textSecondary}
          />
          <Text style={styles.addRowText}>Add Payment Method</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={DSColors.textSecondary}
        />
      </TouchableOpacity>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
      >
        Payment method management coming soon
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: DSColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionHeaderActions: {
    paddingTop: 20,
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
  divider: {
    height: 1,
    backgroundColor: DSColors.border,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: DSColors.surface,
  },
  addRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addRowText: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textSecondary,
  },
});
