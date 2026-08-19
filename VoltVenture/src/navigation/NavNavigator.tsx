import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { NavStackParamList } from '../types/navigation';
import NavigateToBikeScreen from '../screens/navigation/NavigateToBikeScreen';
import WalkingDirectionsScreen from '../screens/navigation/WalkingDirectionsScreen';
import NavigateToPoiScreen from '../screens/navigation/NavigateToPoiScreen';

const Stack = createStackNavigator<NavStackParamList>();

export default function NavNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NavigateToBike" component={NavigateToBikeScreen} />
      <Stack.Screen name="WalkingDirections" component={WalkingDirectionsScreen} />
      <Stack.Screen name="NavigateToPoi" component={NavigateToPoiScreen} />
    </Stack.Navigator>
  );
}
