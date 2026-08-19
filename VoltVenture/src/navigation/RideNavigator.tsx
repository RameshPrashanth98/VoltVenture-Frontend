import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { RideStackParamList } from '../types/navigation';
import SafetyMountScreen from '../screens/ride/SafetyMountScreen';
import ActiveRideScreen from '../screens/ride/ActiveRideScreen';
import PaymentSummaryScreen from '../screens/ride/PaymentSummaryScreen';
import RideReceiptScreen from '../screens/ride/RideReceiptScreen';
import SelectPaymentMethodScreen from '../screens/ride/SelectPaymentMethodScreen';

const Stack = createStackNavigator<RideStackParamList>();

export default function RideNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SafetyMount" component={SafetyMountScreen} />
      <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
      <Stack.Screen name="PaymentSummary" component={PaymentSummaryScreen} />
      <Stack.Screen name="SelectPaymentMethod" component={SelectPaymentMethodScreen} />
      <Stack.Screen name="RideReceipt" component={RideReceiptScreen} />
    </Stack.Navigator>
  );
}
