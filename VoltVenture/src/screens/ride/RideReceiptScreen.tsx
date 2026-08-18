import React from 'react';
import { View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RideStackParamList } from '../../types/navigation';

type Props = StackScreenProps<RideStackParamList, 'RideReceipt'>;

export default function RideReceiptScreen(_: Props) {
  return <View />;
}
