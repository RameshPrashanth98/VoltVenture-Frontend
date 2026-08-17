import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DSColors } from '../../theme/theme';

export default function BikeMarker() {
  return (
    <View style={styles.pinContainer}>
      <View style={styles.circle}>
        <MaterialCommunityIcons name="lightning-bolt" size={18} color={DSColors.textOnPrimary} />
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
    backgroundColor: DSColors.primary,
    borderWidth: 2,
    borderColor: DSColors.textOnPrimary,
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
    borderTopColor: DSColors.primary,
  },
});
