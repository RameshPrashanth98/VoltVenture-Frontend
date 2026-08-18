import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { Bike } from './bike';
import type { RideSummary } from './ride';
import type { PaymentResult } from './payment';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  AuthLanding: undefined;
  SignUp: undefined;
  Login: undefined;
  ForgotPassword: undefined;
};

export type RideStackParamList = {
  ActiveRide: { bike: Bike };
  PaymentSummary: { rideSummary: RideSummary };
  RideReceipt: { paymentResult: PaymentResult; rideSummary: RideSummary };
};

export type AccountStackParamList = {
  AccountMain: undefined;
  RideHistory: undefined;
  PaymentMethods: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Preferences: undefined;
};

export type AppTabParamList = {
  Map: undefined;
  Account: NavigatorScreenParams<AccountStackParamList>;
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
  RideStack: NavigatorScreenParams<RideStackParamList>;
};

export type AuthNavProp = StackNavigationProp<AuthStackParamList>;
export type AppTabNavProp = BottomTabNavigationProp<AppTabParamList>;
export type BookingNavProp = StackNavigationProp<BookingStackParamList>;
export type RideNavProp = StackNavigationProp<RideStackParamList>;
export type AccountNavProp = StackNavigationProp<AccountStackParamList>;
