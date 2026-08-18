import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { BookingStackParamList } from '../types/navigation';
import BookingConfirmationScreen from '../screens/booking/BookingConfirmationScreen';
import QRScannerScreen from '../screens/booking/QRScannerScreen';
import BLEUnlockScreen from '../screens/booking/BLEUnlockScreen';
import UnlockSuccessScreen from '../screens/booking/UnlockSuccessScreen';

const Stack = createStackNavigator<BookingStackParamList>();

export default function BookingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="BLEUnlock" component={BLEUnlockScreen} />
      <Stack.Screen name="UnlockSuccess" component={UnlockSuccessScreen} />
    </Stack.Navigator>
  );
}
