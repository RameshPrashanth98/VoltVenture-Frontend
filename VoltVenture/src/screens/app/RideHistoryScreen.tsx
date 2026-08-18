import React from 'react';
import { View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';

type Props = StackScreenProps<AccountStackParamList, 'RideHistory'>;

export default function RideHistoryScreen(_: Props) {
  return <View />;
}
