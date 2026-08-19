import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { AccountStackParamList } from '../types/navigation';
import { ProfileProvider } from '../context/ProfileContext';
import AccountScreen from '../screens/app/AccountScreen';
import RideHistoryScreen from '../screens/app/RideHistoryScreen';
import PaymentMethodsScreen from '../screens/app/PaymentMethodsScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import EditProfileScreen from '../screens/app/EditProfileScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import PreferencesScreen from '../screens/app/PreferencesScreen';
import LoginSecurityScreen from '../screens/app/LoginSecurityScreen';
import IdScanScreen from '../screens/app/IdScanScreen';
import FacialScanScreen from '../screens/app/FacialScanScreen';
import SecurityDepositScreen from '../screens/app/SecurityDepositScreen';
import AddPaymentMethodScreen from '../screens/app/AddPaymentMethodScreen';
import VoltCoinsRewardsScreen from '../screens/app/VoltCoinsRewardsScreen';

const Stack = createStackNavigator<AccountStackParamList>();

export default function AccountNavigator() {
  return (
    <ProfileProvider>
      <Stack.Navigator>
        <Stack.Screen name="AccountMain" component={AccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RideHistory" component={RideHistoryScreen} options={{ title: 'Ride History' }} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment Methods' }} />
        <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginSecurity" component={LoginSecurityScreen} options={{ headerShown: false }} />
        <Stack.Screen name="IdScan" component={IdScanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FacialScan" component={FacialScanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SecurityDeposit" component={SecurityDepositScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VoltCoins" component={VoltCoinsRewardsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </ProfileProvider>
  );
}
