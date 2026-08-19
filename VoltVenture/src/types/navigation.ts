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
  SafetyMount: { bike: Bike };
  ActiveRide: { bike: Bike };
  PaymentSummary: { rideSummary: RideSummary };
  SelectPaymentMethod: undefined;
  RideReceipt: { paymentResult: PaymentResult; rideSummary: RideSummary };
};

export type AccountStackParamList = {
  AccountMain: undefined;
  RideHistory: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  VoltCoins: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Preferences: undefined;
  LoginSecurity: undefined;
  IdScan: { onVerified: () => void };
  FacialScan: { onVerified: () => void };
  SecurityDeposit: undefined;
};

export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  CuratedRoutes: undefined;
  VipHubs: undefined;
  Support: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

export type AppTabParamList = {
  Map: undefined;
  Discover: NavigatorScreenParams<DiscoverStackParamList>;
  Account: NavigatorScreenParams<AccountStackParamList>;
};

export type BookingStackParamList = {
  BookingConfirmation: { bike: Bike };
  QRScanner: { bike: Bike };
  BLEUnlock: { bike: Bike };
  UnlockSuccess: { bike: Bike };
};

export type NavStackParamList = {
  NavigateToBike: { bike: Bike };
  WalkingDirections: { bike: Bike };
  NavigateToPoi: { name: string; location: { latitude: number; longitude: number } };
};

export type ChargeStackParamList = {
  EndRideFindCharging: undefined;
  RidingToCharging: { chargerName: string; location: { latitude: number; longitude: number } };
};

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>;
  RideStack: NavigatorScreenParams<RideStackParamList>;
  NavStack: NavigatorScreenParams<NavStackParamList>;
  ChargeStack: NavigatorScreenParams<ChargeStackParamList>;
};

export type AuthNavProp = StackNavigationProp<AuthStackParamList>;
export type AppTabNavProp = BottomTabNavigationProp<AppTabParamList>;
export type BookingNavProp = StackNavigationProp<BookingStackParamList>;
export type RideNavProp = StackNavigationProp<RideStackParamList>;
export type AccountNavProp = StackNavigationProp<AccountStackParamList>;
