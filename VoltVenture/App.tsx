import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { AuthProvider, useAuthContext } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { paperTheme } from './src/theme/theme';

// Must be called at module scope — before any rendering.
SplashScreen.preventAutoHideAsync();

function AppInner() {
  const { state } = useAuthContext();

  // TODO (D-12): Load DS fonts before shipping.
  // DS fonts: Manjari (display, weights 100/400/700) + Inter (body, weights 400/500/600/700)
  // Option A — @expo-google-fonts packages:
  //   npm install @expo-google-fonts/manjari @expo-google-fonts/inter
  //   import { useFonts, Manjari_700Bold } from '@expo-google-fonts/manjari';
  //   import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
  // Option B — Local TTF assets in assets/fonts/:
  //   useFonts({ 'Manjari-Bold': require('./assets/fonts/Manjari-Bold.ttf'), ... })
  //
  // Walking skeleton: empty map resolves immediately so app continues without
  // custom fonts until D-12 is resolved.
  const [fontsLoaded, fontError] = useFonts({});

  useEffect(() => {
    if ((fontsLoaded || fontError) && !state.isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, state.isLoading]);

  if (!fontsLoaded && !fontError) return null;

  return <RootNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AuthProvider>
              <AppInner />
            </AuthProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
