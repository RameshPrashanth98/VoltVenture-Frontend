import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { ChargeStackParamList } from '../types/navigation';
import EndRideFindChargingScreen from '../screens/charging/EndRideFindChargingScreen';
import RidingToChargingScreen from '../screens/charging/RidingToChargingScreen';

const Stack = createStackNavigator<ChargeStackParamList>();

export default function ChargeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EndRideFindCharging" component={EndRideFindChargingScreen} />
      <Stack.Screen name="RidingToCharging" component={RidingToChargingScreen} />
    </Stack.Navigator>
  );
}
