import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DSColors } from '../../theme/theme';

export default function CafeMarker() {
  return (
    <View style={styles.pinContainer}>
      <View style={styles.circle}>
        <MaterialCommunityIcons name="coffee" size={18} color={DSColors.textPrimary} />
      </View>
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DSColors.background,
    borderWidth: 2,
    borderColor: DSColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: DSColors.background,
  },
});
