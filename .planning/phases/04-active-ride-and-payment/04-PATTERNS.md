# Phase 4: Active Ride & Payment — Pattern Map

**Mapped:** 2026-08-18
**Files analyzed:** 16 (10 new, 6 modified)
**Analogs found:** 16 / 16

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/types/ride.ts` | model | transform | `src/types/booking.ts` | exact |
| `src/types/payment.ts` | model | transform | `src/types/booking.ts` | exact |
| `src/services/rideService.ts` | service | CRUD | `src/services/bookingService.ts` | exact |
| `src/services/paymentService.ts` | service | request-response | `src/services/bookingService.ts` | exact |
| `src/navigation/RideNavigator.tsx` | config | request-response | `src/navigation/BookingNavigator.tsx` | exact |
| `src/navigation/AccountNavigator.tsx` | config | request-response | `src/navigation/BookingNavigator.tsx` | exact |
| `src/navigation/AppTabs.tsx` (modify) | config | request-response | `src/navigation/AppTabs.tsx` | self |
| `src/navigation/RootNavigator.tsx` (modify) | config | request-response | `src/navigation/RootNavigator.tsx` | self |
| `src/types/navigation.ts` (modify) | model | transform | `src/types/navigation.ts` | self |
| `src/screens/ride/ActiveRideScreen.tsx` | screen | event-driven | `src/screens/booking/BookingConfirmationScreen.tsx` + `src/screens/app/MapScreen.tsx` | role-match |
| `src/screens/ride/PaymentSummaryScreen.tsx` | screen | request-response | `src/screens/booking/BookingConfirmationScreen.tsx` | role-match |
| `src/screens/ride/RideReceiptScreen.tsx` | screen | request-response | `src/screens/booking/UnlockSuccessScreen.tsx` | exact |
| `src/screens/app/AccountScreen.tsx` (modify) | screen | request-response | `src/screens/app/AccountScreen.tsx` | self |
| `src/screens/app/RideHistoryScreen.tsx` | screen | CRUD | `src/screens/app/AccountScreen.tsx` | role-match |
| `src/screens/app/PaymentMethodsScreen.tsx` | screen | request-response | `src/screens/app/AccountScreen.tsx` | role-match |
| `src/screens/booking/UnlockSuccessScreen.tsx` (modify) | screen | request-response | `src/screens/booking/UnlockSuccessScreen.tsx` | self |

---

## Pattern Assignments

### `src/types/ride.ts` (model, transform)

**Analog:** `src/types/booking.ts` (lines 1-5)

**Core pattern** — bare interface file, no imports:
```typescript
// src/types/booking.ts lines 1-5
export interface Booking {
  id: string;
  bikeId: string;
  expiresAt: string; // ISO 8601 timestamp
}
```

**Apply:** Two interfaces in one file. No imports needed beyond type-only cross-references.
```typescript
// src/types/ride.ts — full file
export interface ActiveRide {
  id: string;
  bikeId: string;
  bikeName: string;
  startTime: string;   // ISO 8601
  batteryPct: number;
  pricePerMin: number;
}

export interface RideSummary {
  id: string;
  bikeId: string;
  bikeName: string;
  startTime: string;
  endTime: string;
  durationMin: number;
  costEur: number;
  distanceKm: number;
}
```

---

### `src/types/payment.ts` (model, transform)

**Analog:** `src/types/booking.ts` (lines 1-5)

**Apply:** Single interface, same bare pattern:
```typescript
// src/types/payment.ts — full file
export interface PaymentResult {
  id: string;
  amount: number;
  method: string;
  timestamp: string;
}
```

---

### `src/services/rideService.ts` (service, CRUD)

**Analog:** `src/services/bookingService.ts` (lines 1-20)

**Imports pattern** (lines 1-1):
```typescript
import { Booking } from '../types/booking';
```

**Core service pattern** (lines 1-20) — interface + delay helper + mock object + exported singleton:
```typescript
// bookingService.ts lines 1-20
import { Booking } from '../types/booking';

export interface BookingService {
  reserveBike(bikeId: string): Promise<Booking>;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const mockBookingService: BookingService = {
  async reserveBike(bikeId: string) {
    await delay(800);
    return {
      id: 'booking-' + Date.now(),
      bikeId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };
  },
};

export const bookingService: BookingService = mockBookingService;
```

**Apply for rideService.ts:**
- Import `ActiveRide`, `RideSummary` from `../types/ride` and `Bike` from `../types/bike`
- Interface: `startRide(bike: Bike): Promise<ActiveRide>`, `endRide(rideId: string, bike: Bike, durationSec: number): Promise<RideSummary>`, `getRideHistory(): RideSummary[]`
- Add `const rideHistory: RideSummary[] = []` module-level array (in-memory, resets on restart)
- `endRide` pushes to `rideHistory` with `rideHistory.unshift(summary)` before returning
- `getRideHistory()` returns `[...rideHistory]` (spread copy)
- Cost formula in `endRide`: `costEur: parseFloat((0.5 + (durationSec / 60) * bike.pricePerMin).toFixed(2))`
- Distance formula: `distanceKm: parseFloat(((durationSec / 60) * 0.25).toFixed(1))`
- Export singleton: `export const rideService: RideService = mockRideService`

---

### `src/services/paymentService.ts` (service, request-response)

**Analog:** `src/services/bookingService.ts` (lines 1-20)

**Apply:** Same pattern, single method, 1500ms delay (not 800ms):
- Import `RideSummary` from `../types/ride` and `PaymentResult` from `../types/payment`
- Interface: `processPayment(summary: RideSummary): Promise<PaymentResult>`
- Returns `{ id: 'pay-' + Date.now(), amount: summary.costEur, method: 'Visa •••• 4242', timestamp: new Date().toISOString() }`
- Export singleton: `export const paymentService: PaymentService = mockPaymentService`

---

### `src/navigation/RideNavigator.tsx` (config, request-response)

**Analog:** `src/navigation/BookingNavigator.tsx` (lines 1-20) — exact mirror

**Full analog** (lines 1-20):
```typescript
// BookingNavigator.tsx lines 1-20
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
```

**Apply for RideNavigator.tsx:**
- Swap `BookingStackParamList` → `RideStackParamList`
- Import `ActiveRideScreen`, `PaymentSummaryScreen`, `RideReceiptScreen` from `../screens/ride/`
- Three screens: `ActiveRide`, `PaymentSummary`, `RideReceipt`
- All use `screenOptions={{ headerShown: false }}` (D-02: no headers in RideStack)

---

### `src/navigation/AccountNavigator.tsx` (config, request-response)

**Analog:** `src/navigation/BookingNavigator.tsx` (lines 1-20)

**Apply:** Same structure with mixed header visibility per D-14 (Claude's discretion):
- Import `AccountStackParamList` from `../types/navigation`
- Import `AccountScreen`, `RideHistoryScreen`, `PaymentMethodsScreen` from `../screens/app/`
- `AccountMain`: `options={{ headerShown: false }}` (AccountScreen manages its own SafeAreaView header)
- `RideHistory`: `options={{ title: 'Ride History' }}` (use default stack header with back button)
- `PaymentMethods`: `options={{ title: 'Payment Methods' }}` (use default stack header with back button)

---

### `src/navigation/AppTabs.tsx` (modify)

**Analog:** Self — `src/navigation/AppTabs.tsx` (lines 1-55)

**Current Account tab** (lines 39-51):
```typescript
// AppTabs.tsx lines 39-51
<Tab.Screen
  name="Account"
  component={AccountScreen}
  options={{
    tabBarLabel: 'Account',
    tabBarIcon: ({ focused, color, size }) => (
      <MaterialCommunityIcons
        name={focused ? 'account' : 'account-outline'}
        color={color}
        size={size}
      />
    ),
  }}
/>
```

**Change:** Replace `component={AccountScreen}` with `component={AccountNavigator}`. Add import:
```typescript
import AccountNavigator from './AccountNavigator';
// Remove: import AccountScreen from '../screens/app/AccountScreen';
```
All other tab configuration (icons, colors, styles) stays unchanged.

---

### `src/navigation/RootNavigator.tsx` (modify)

**Analog:** Self — `src/navigation/RootNavigator.tsx` (lines 1-39)

**Existing BookingStack registration** (lines 32-36):
```typescript
// RootNavigator.tsx lines 32-36
<Stack.Screen
  name="BookingStack"
  component={BookingNavigator}
  options={{ presentation: 'modal', headerShown: false }}
/>
```

**Add after BookingStack** (exact mirror):
```typescript
import RideNavigator from './RideNavigator';

// Inside Stack.Navigator, immediately after BookingStack.Screen:
<Stack.Screen
  name="RideStack"
  component={RideNavigator}
  options={{ presentation: 'modal', headerShown: false }}
/>
```

---

### `src/types/navigation.ts` (modify)

**Analog:** Self — `src/types/navigation.ts` (lines 1-36)

**Current file** (lines 1-36):
```typescript
// navigation.ts lines 1-36
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { Bike } from './bike';

export type AuthStackParamList = { ... };

export type AppTabParamList = {
  Map: undefined;
  Account: undefined;           // ← CHANGE to NavigatorScreenParams<AccountStackParamList>
};

export type BookingStackParamList = { ... };

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>;
  // ← ADD: RideStack: NavigatorScreenParams<RideStackParamList>;
};
```

**Required additions — place before existing type declarations:**
```typescript
// New imports (add to existing import block):
import type { RideSummary } from './ride';
import type { PaymentResult } from './payment';

// New param lists (add before AppTabParamList):
export type RideStackParamList = {
  ActiveRide: { bike: Bike };
  PaymentSummary: { rideSummary: RideSummary };
  RideReceipt: { paymentResult: PaymentResult; rideSummary: RideSummary };
};

export type AccountStackParamList = {
  AccountMain: undefined;
  RideHistory: undefined;
  PaymentMethods: undefined;
};

// Modify AppTabParamList:
export type AppTabParamList = {
  Map: undefined;
  Account: NavigatorScreenParams<AccountStackParamList>;  // was: undefined
};

// Add to RootStackParamList:
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>;
  RideStack: NavigatorScreenParams<RideStackParamList>;  // NEW
};

// New nav prop exports (add at bottom):
export type RideNavProp = StackNavigationProp<RideStackParamList>;
export type AccountNavProp = StackNavigationProp<AccountStackParamList>;
```

**CRITICAL:** Update `navigation.ts` FIRST before any navigator or screen files. TypeScript errors cascade from this file.

---

### `src/screens/ride/ActiveRideScreen.tsx` (screen, event-driven)

**Analogs:**
1. `src/screens/booking/BookingConfirmationScreen.tsx` — setInterval timer pattern (lines 48-88)
2. `src/screens/app/MapScreen.tsx` — MapView + absoluteFill pattern (lines 1-80)

**Imports pattern** (from BookingConfirmationScreen lines 1-18):
```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BookingStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
import { bookingService } from '../../services/bookingService';
```

**Props pattern** (BookingConfirmationScreen line 20):
```typescript
type Props = StackScreenProps<BookingStackParamList, 'BookingConfirmation'>;
export default function BookingConfirmationScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const insets = useSafeAreaInsets();
```

**setInterval count-DOWN pattern** (BookingConfirmationScreen lines 48-58) — adapt to count-UP:
```typescript
// BookingConfirmationScreen.tsx lines 30-31, 48-58
const expiresAt = useRef<number>(Date.now() + 600_000);
const [secondsLeft, setSecondsLeft] = useState<number>(600);

useEffect(() => {
  const interval = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((expiresAt.current - Date.now()) / 1000));
    setSecondsLeft(remaining);
    if (remaining === 0) clearInterval(interval);
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

**Count-UP adaptation for ActiveRide (D-04):**
```typescript
const startTime = useRef<number>(Date.now());
const [elapsedSeconds, setElapsedSeconds] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setElapsedSeconds(Math.floor((Date.now() - startTime.current) / 1000));
  }, 1000);
  return () => clearInterval(interval);
}, []);

const minutes = Math.floor(elapsedSeconds / 60);
const seconds = elapsedSeconds % 60;
const timerDisplay = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
const cost = ((elapsedSeconds / 60) * bike.pricePerMin).toFixed(2);
```

**MM:SS formatting pattern** (BookingConfirmationScreen lines 83-87):
```typescript
const minutes = Math.floor(secondsLeft / 60);
const seconds = secondsLeft % 60;
const countdownDisplay =
  String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
```

**MapView pattern** (MapScreen.tsx lines 1-5, confirmed absoluteFill):
```typescript
import MapView, { Marker } from 'react-native-maps';
// MapView with StyleSheet.absoluteFill (not absoluteFillObject per STATE.md)
```

**Layout structure for ActiveRide:**
```typescript
// Full-screen map + absolute overlays
<View style={StyleSheet.absoluteFill}>
  <MapView
    style={StyleSheet.absoluteFill}
    initialRegion={{ latitude: 52.3676, longitude: 4.9041, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
    scrollEnabled={false}
    zoomEnabled={false}
    rotateEnabled={false}
    pitchEnabled={false}
  >
    <Marker coordinate={{ latitude: 52.3676, longitude: 4.9041 }}>
      <View style={styles.userMarker} />
    </Marker>
  </MapView>

  {/* Top overlay card (D-04) */}
  <View style={[styles.overlayCard, { top: insets.top + 8 }]}>
    {/* timer left, battery right */}
  </View>

  {/* Bottom "End Ride" button (D-05) — NOT PrimaryButton, raw TouchableOpacity */}
  <View style={[styles.endRideContainer, { bottom: insets.bottom + 16 }]}>
    <TouchableOpacity style={styles.endRideButton} onPress={handleEndRide}>
      <Text style={styles.endRideLabel}>End Ride</Text>
    </TouchableOpacity>
  </View>
</View>
```

**StyleSheet for overlay card and End Ride button (D-04, D-05):**
```typescript
overlayCard: {
  position: 'absolute',
  left: 16,
  right: 16,
  backgroundColor: 'rgba(15,15,15,0.85)',
  borderRadius: 16,
  paddingHorizontal: 24,
  paddingVertical: 16,
  zIndex: 10,
},
timerText: { fontSize: 32, fontWeight: '700', color: DSColors.primary },
costText: { fontSize: 17, fontWeight: '400', color: '#FFFFFF' },
endRideContainer: { position: 'absolute', left: 16, right: 16 },
endRideButton: {
  backgroundColor: '#E53935',
  borderRadius: 8,
  paddingVertical: 16,
  alignItems: 'center',
},
endRideLabel: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
userMarker: {
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: '#FFFFFF',
  borderWidth: 3,
  borderColor: DSColors.primary,
},
```

**handleEndRide pattern** (navigate forward in stack, never goBack from ActiveRide):
```typescript
const handleEndRide = useCallback(async () => {
  const rideSummary = await rideService.endRide(activeRide.id, bike, elapsedSeconds);
  navigation.navigate('PaymentSummary', { rideSummary });
}, [activeRide, bike, elapsedSeconds, navigation]);
```

**Loading state pattern** (BookingConfirmationScreen lines 93-100):
```typescript
if (!activeRide) {
  return (
    <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
      <ActivityIndicator size="large" color={DSColors.primary} />
    </View>
  );
}
```

---

### `src/screens/ride/PaymentSummaryScreen.tsx` (screen, request-response)

**Analog:** `src/screens/booking/BookingConfirmationScreen.tsx` — loading state + ActivityIndicator + service call pattern

**Imports pattern** (BookingConfirmationScreen lines 1-18):
```typescript
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';
```

**Props pattern:**
```typescript
type Props = StackScreenProps<RideStackParamList, 'PaymentSummary'>;
export default function PaymentSummaryScreen({ route, navigation }: Props) {
  const { rideSummary } = route.params;
  const insets = useSafeAreaInsets();
  const [isProcessing, setIsProcessing] = useState(false);
```

**ActivityIndicator during processing** (BookingConfirmationScreen lines 93-100):
```typescript
// Show ActivityIndicator in place of button while processing (D-09)
{isProcessing ? (
  <ActivityIndicator size="large" color={DSColors.primary} />
) : (
  <PrimaryButton label="Confirm & Pay" onPress={handleConfirmPay} />
)}
```

**handleConfirmPay pattern** (mirror service call structure from BookingConfirmationScreen lines 34-46):
```typescript
const handleConfirmPay = useCallback(async () => {
  setIsProcessing(true);
  try {
    const paymentResult = await paymentService.processPayment(rideSummary);
    navigation.navigate('RideReceipt', { paymentResult, rideSummary });
  } finally {
    setIsProcessing(false);
  }
}, [rideSummary, navigation]);
```

**Cost breakdown display (D-08):**
```typescript
const baseFare = 0.50;
const perMinCharge = parseFloat((rideSummary.costEur - baseFare).toFixed(2));
// Rows: "Base fare: €0.50" / "Per-minute: €X.XX" / "Total: €X.XX"
```

**Card style** (BookingConfirmationScreen bikeCard style lines 244-262):
```typescript
card: {
  borderWidth: 1,
  borderColor: DSColors.border,
  borderRadius: 12,
  padding: 16,
},
```

**No back button** (D-08): Omit close/back button entirely. No `headerShown` in RideNavigator means no header anyway.

---

### `src/screens/ride/RideReceiptScreen.tsx` (screen, request-response)

**Analog:** `src/screens/booking/UnlockSuccessScreen.tsx` (lines 1-79) — exact structural mirror

**Full analog structure** (UnlockSuccessScreen lines 1-79):
```typescript
// UnlockSuccessScreen.tsx lines 1-16
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BookingStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

type Props = StackScreenProps<BookingStackParamList, 'UnlockSuccess'>;

export default function UnlockSuccessScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <MaterialCommunityIcons name="check-circle" size={96} color={DSColors.primary} style={styles.icon} />
      <Text style={styles.heading}>Bike unlocked!</Text>
      <Text style={styles.bikeName}>{bike.name}</Text>
      <View style={styles.spacer} />
      <PrimaryButton label="Start Ride" onPress={() => navigation.getParent()?.goBack()} />
    </View>
  );
}
```

**Container style** (UnlockSuccessScreen lines 52-78):
```typescript
container: {
  flex: 1,
  backgroundColor: DSColors.background,
  alignItems: 'center',
  paddingHorizontal: 24,
},
icon: { marginTop: 48 },
heading: {
  fontSize: 28,
  fontWeight: '700',
  lineHeight: 34,
  color: DSColors.textPrimary,
  textAlign: 'center',
  marginTop: 24,
},
spacer: { flex: 1 },
```

**Apply for RideReceiptScreen (D-11):**
- Icon: `check-circle`, size 80, color `DSColors.primary`
- Heading: "Payment confirmed!" (28px/700)
- Show cost total prominently below heading (e.g., `€{rideSummary.costEur.toFixed(2)}`)
- Add breakdown rows (base fare / per-minute / total) below heading in a card
- Show bike name and duration in secondary text
- `PrimaryButton` labelled "Done": `onPress={() => navigation.getParent()?.goBack()}`

**Post-render ride history append (D-12):**
```typescript
// In useEffect on mount:
useEffect(() => {
  // rideSummary already added to rideHistory by rideService.endRide() before navigating here
  // No additional call needed if endRide() already pushed to history array
}, []);
```
Note: `rideService.endRide()` pushes to history before returning, so no extra call needed in RideReceiptScreen.

---

### `src/screens/app/AccountScreen.tsx` (modify)

**Analog:** Self — `src/screens/app/AccountScreen.tsx` (lines 1-116)

**Existing logoutRow style** (lines 96-111):
```typescript
// AccountScreen.tsx lines 39-50, 96-111
<TouchableOpacity
  style={styles.logoutRow}
  onPress={() => setShowLogout(true)}
  activeOpacity={0.7}
>
  <Text style={styles.logoutText}>Log Out</Text>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>

// styles.logoutRow:
logoutRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingVertical: 16,
  backgroundColor: DSColors.surface,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: DSColors.border,
},
logoutText: {
  fontSize: 16,
  fontWeight: '400',
  color: DSColors.destructive,
},
```

**Changes required (D-13, D-14):**
1. Add `navigation` prop: change signature from `export default function AccountScreen()` to accept `StackScreenProps<AccountStackParamList, 'AccountMain'>`
2. Add two new rows ABOVE the Log Out row using same `logoutRow` style but with `color: DSColors.textPrimary` (not destructive):
```typescript
// Add new style for non-destructive menu rows:
menuRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingVertical: 16,
  backgroundColor: DSColors.surface,
  borderTopWidth: 1,
  borderColor: DSColors.border,
},
menuRowText: { fontSize: 16, fontWeight: '400', color: DSColors.textPrimary },

// Rows above Log Out:
<TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('RideHistory')} activeOpacity={0.7}>
  <View style={styles.menuRowLeft}>
    <MaterialCommunityIcons name="history" size={20} color={DSColors.textPrimary} />
    <Text style={styles.menuRowText}>Ride History</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>
<TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('PaymentMethods')} activeOpacity={0.7}>
  <View style={styles.menuRowLeft}>
    <MaterialCommunityIcons name="credit-card" size={20} color={DSColors.textPrimary} />
    <Text style={styles.menuRowText}>Payment Methods</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>
```
3. Add `menuRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 }` style.

---

### `src/screens/app/RideHistoryScreen.tsx` (screen, CRUD)

**Analog:** `src/screens/app/AccountScreen.tsx` (lines 1-116) — same app/ folder, same layout conventions

**Imports pattern** (AccountScreen lines 1-8):
```typescript
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
import { rideService } from '../../services/rideService';
import type { RideSummary } from '../../types/ride';
```

**Props pattern:**
```typescript
type Props = StackScreenProps<AccountStackParamList, 'RideHistory'>;
export default function RideHistoryScreen({ navigation }: Props) {
  const rides = rideService.getRideHistory(); // sync in-memory call
```

**FlatList + empty state pattern (D-15):**
```typescript
<FlatList
  data={rides}
  keyExtractor={item => item.id}
  ListEmptyComponent={
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No rides yet — your completed rides will appear here.</Text>
    </View>
  }
  renderItem={({ item }) => (
    <View style={styles.rideRow}>
      {/* date, bikeName, durationMin→MM:SS, costEur */}
    </View>
  )}
/>
```

**SafeAreaView wrapper** (AccountScreen lines 30-31):
```typescript
// AccountScreen.tsx line 31
<SafeAreaView style={styles.safeArea}>
// safeArea: { flex: 1, backgroundColor: DSColors.background }
```

**Note:** Screen has native stack header (title: 'Ride History') from AccountNavigator — no custom header needed. Use `edges={['bottom']}` on SafeAreaView to avoid double top padding.

---

### `src/screens/app/PaymentMethodsScreen.tsx` (screen, request-response)

**Analog:** `src/screens/app/AccountScreen.tsx` (lines 1-116) — same structure, same row pattern

**Imports pattern** (AccountScreen lines 1-8):
```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
```

**Snackbar pattern** (BookingConfirmationScreen lines 176-183):
```typescript
// BookingConfirmationScreen.tsx lines 176-183
<Snackbar
  visible={snackbarVisible}
  onDismiss={() => setSnackbarVisible(false)}
  duration={2500}
>
  Reservation expired — returning to map
</Snackbar>
```

**Apply for PaymentMethodsScreen (D-16):**
- Mock card row (Visa •••• 4242, non-tappable or shows nothing on press)
- "Add Payment Method" row — `onPress` shows Snackbar: "Payment method management coming soon"
- Use same `logoutRow` / `menuRow` visual style from AccountScreen for consistency
- Screen uses native stack header — no custom header needed

---

### `src/screens/booking/UnlockSuccessScreen.tsx` (modify)

**Analog:** Self — lines 43-46

**Current "Start Ride" CTA** (lines 43-46):
```typescript
// UnlockSuccessScreen.tsx lines 43-46
<PrimaryButton
  label="Start Ride"
  onPress={() => navigation.getParent()?.goBack()}
/>
```

**Replace with (D-01, CONTEXT.md line 114):**
```typescript
<PrimaryButton
  label="Start Ride"
  onPress={() =>
    navigation.getParent<any>()?.navigate('RideStack', {
      screen: 'ActiveRide',
      params: { bike },
    })
  }
/>
```

No other changes to UnlockSuccessScreen. The `bike` variable is already in scope from `route.params` (line 15).

---

## Shared Patterns

### StyleSheet.create Convention
**Source:** Every existing screen in the project
**Apply to:** All new screens
```typescript
// No NativeWind on ride/payment/account screens — use StyleSheet.create only
// DSColors and DSTypography spread into style objects
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DSColors.background },
  // ...
});
```

### Safe Area Padding
**Source:** `src/screens/booking/BookingConfirmationScreen.tsx` lines 24, 103-106
**Apply to:** All new full-screen screens (ActiveRide, PaymentSummary, RideReceipt)
```typescript
const insets = useSafeAreaInsets();
// Use insets.top and insets.bottom at layout level — not SafeAreaView
// For screens using absoluteFill (ActiveRide): overlay top = insets.top + 8, bottom button = insets.bottom + 16
// For scrollable screens: paddingTop: insets.top + 8, paddingBottom: insets.bottom
```

### useCallback for Handlers
**Source:** `src/screens/booking/BookingConfirmationScreen.tsx` lines 71-81
**Apply to:** All navigation handlers and async operations in new screens
```typescript
const handleEndRide = useCallback(async () => { ... }, [deps]);
const handleConfirmPay = useCallback(async () => { ... }, [deps]);
```

### ActivityIndicator Loading State
**Source:** `src/screens/booking/BookingConfirmationScreen.tsx` lines 93-100
**Apply to:** ActiveRideScreen (waiting for startRide), PaymentSummaryScreen (during processPayment)
```typescript
if (!data) {
  return (
    <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
      <ActivityIndicator size="large" color={DSColors.primary} />
    </View>
  );
}
```

### DSColors / DSTypography Import
**Source:** All existing screens
**Apply to:** All new files
```typescript
import { DSColors, DSTypography } from '../../theme/theme';
// For screens: ../../theme/theme
// For navigators: ../theme/theme
// For services: n/a (no UI)
```

### getParent() Navigation Pattern
**Source:** `src/screens/booking/BookingConfirmationScreen.tsx` line 72; `src/screens/booking/UnlockSuccessScreen.tsx` line 45
**Apply to:** RideReceiptScreen "Done" button; UnlockSuccessScreen "Start Ride" (modified)
```typescript
// From screen inside a modal stack, dismiss entire stack back to AppTabs:
navigation.getParent()?.goBack()

// From UnlockSuccessScreen (inside BookingStack), navigate to sibling RideStack in RootNavigator:
navigation.getParent<any>()?.navigate('RideStack', { screen: 'ActiveRide', params: { bike } })
```

---

## No Analog Found

All files have close analogs in the codebase. No entries.

---

## Metadata

**Analog search scope:** `VoltVenture/src/` — all subdirectories
**Files scanned:** 36 TypeScript/TSX source files
**Pattern extraction date:** 2026-08-18
