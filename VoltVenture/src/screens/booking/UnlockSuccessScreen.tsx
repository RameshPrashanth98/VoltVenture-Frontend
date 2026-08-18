import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BookingStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';

type Props = StackScreenProps<BookingStackParamList, 'UnlockSuccess'>;

export default function UnlockSuccessScreen(_props: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Unlock Success — coming in Plan 03-02/03-03</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DSColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...DSTypography.body,
    color: DSColors.textPrimary,
  },
});
