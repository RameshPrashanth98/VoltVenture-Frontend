import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { useAuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import BookingNavigator from './BookingNavigator';
import RideNavigator from './RideNavigator';
import NavNavigator from './NavNavigator';
import ChargeNavigator from './ChargeNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { state } = useAuthContext();

  // Keep OS splash visible while bootstrapping auth state from SecureStore
  if (state.isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state.userToken != null ? (
        <Stack.Screen name="AppTabs" component={AppTabs} />
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          initialParams={
            state.hasRegistered
              ? { screen: 'Login' }
              : { screen: 'Onboarding' }
          }
        />
      )}
      <Stack.Screen
        name="BookingStack"
        component={BookingNavigator}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="RideStack"
        component={RideNavigator}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="NavStack"
        component={NavNavigator}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="ChargeStack"
        component={ChargeNavigator}
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
