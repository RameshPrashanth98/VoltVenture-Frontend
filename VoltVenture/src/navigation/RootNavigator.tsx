import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { useAuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

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
    </Stack.Navigator>
  );
}
