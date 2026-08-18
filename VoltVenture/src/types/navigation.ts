import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { Bike } from './bike';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  AuthLanding: undefined;
  SignUp: undefined;
  Login: undefined;
  ForgotPassword: undefined;
};

export type AppTabParamList = {
  Map: undefined;
  Account: undefined;
};

export type BookingStackParamList = {
  BookingConfirmation: { bike: Bike };
  QRScanner: { bike: Bike };
  BLEUnlock: { bike: Bike };
  UnlockSuccess: { bike: Bike };
};

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>;
};

export type AuthNavProp = StackNavigationProp<AuthStackParamList>;
export type AppTabNavProp = BottomTabNavigationProp<AppTabParamList>;
export type BookingNavProp = StackNavigationProp<BookingStackParamList>;
