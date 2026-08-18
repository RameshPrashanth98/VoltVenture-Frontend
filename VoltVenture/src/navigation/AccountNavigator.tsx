import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { AccountStackParamList } from '../types/navigation';
import AccountScreen from '../screens/app/AccountScreen';
import RideHistoryScreen from '../screens/app/RideHistoryScreen';
import PaymentMethodsScreen from '../screens/app/PaymentMethodsScreen';

const Stack = createStackNavigator<AccountStackParamList>();

export default function AccountNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AccountMain" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RideHistory" component={RideHistoryScreen} options={{ title: 'Ride History' }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment Methods' }} />
    </Stack.Navigator>
  );
}
