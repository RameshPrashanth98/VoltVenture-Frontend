import React from 'react';
import { View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';

type Props = StackScreenProps<AccountStackParamList, 'PaymentMethods'>;

export default function PaymentMethodsScreen(_: Props) {
  return <View />;
}
