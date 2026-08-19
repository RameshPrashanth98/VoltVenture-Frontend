import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../types/navigation';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import CuratedRoutesScreen from '../screens/discover/CuratedRoutesScreen';
import VipHubsScreen from '../screens/discover/VipHubsScreen';
import SupportScreen from '../screens/discover/SupportScreen';
import PrivacyPolicyScreen from '../screens/discover/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/discover/TermsOfServiceScreen';

const Stack = createStackNavigator<DiscoverStackParamList>();

export default function DiscoverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverMain" component={DiscoverScreen} />
      <Stack.Screen name="CuratedRoutes" component={CuratedRoutesScreen} />
      <Stack.Screen name="VipHubs" component={VipHubsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
    </Stack.Navigator>
  );
}
