# Phase 3: Booking & Unlock — Research

**Researched:** 2026-08-18
**Domain:** React Native modal navigation, expo-camera QR scanning, BLE mock UI, countdown timer
**Confidence:** HIGH (all key APIs verified against official Expo SDK 57 docs and live codebase)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** BookingStack added to RootStackParamList with modal presentation (slides up over AppTabs). Screens: BookingConfirmation, QRScanner, UnlockSuccess. BikeDetailSheet Reserve button dismisses the bottom sheet and navigates to BookingConfirmation passing the selected Bike as a route param.
- **D-02:** Exit flow via X / close button on BookingConfirmation. On expiry or cancel, BookingStack is dismissed and user lands back on the map.
- **D-03:** BookingConfirmation shows full bike details (name, type, battery %, price/min) plus a static location card (address text + pin icon — no MapView) and pickup instructions text.
- **D-04:** Countdown timer showing "Bike held for MM:SS" starting from 10:00. On reaching 0:00, show "Reservation expired" notification (snackbar or alert), then dismiss BookingStack to the map.
- **D-05:** Two unlock CTAs: primary PrimaryButton "Scan QR Code", secondary outlined Button "Unlock via Bluetooth". Both equally prominent.
- **D-06:** expo-camera (SDK 57 compatible). Permission requested on mount; denied state shows message + link to Settings.
- **D-07:** Full-screen camera with centred square viewfinder overlay. Corner brackets in Electric Green (#C6FF2D). Instruction text below: "Point at the bike's QR code". X button top-left to close.
- **D-08:** Any valid QR code scan = successful unlock. No QR content validation. On scan → navigate to UnlockSuccess.
- **D-09:** BLE screen is a pure mock with three auto-advancing states: Scanning (1.5 s) → Found (1.0 s) → Connecting (1.0 s) → UnlockSuccess. Cancel button returns to BookingConfirmation throughout.
- **D-10:** UnlockSuccess: large Electric Green checkmark (MaterialCommunityIcons `check-circle`), "Bike unlocked!" heading, bike name, PrimaryButton "Start Ride". Start Ride is a Phase 4 stub — pops BookingStack to the map.
- **D-11:** bookingService.ts mirrors authService/bikeService pattern. Methods: `reserveBike(bikeId): Promise<Booking>` returning mock Booking (id, bikeId, expiresAt). No real API.

### Claude's Discretion

- Exact styling of the static location card (address text + pin icon is sufficient; no MapView needed)
- Snackbar vs Alert for "Reservation expired" notification
- Countdown timer implementation (setInterval in useEffect, clearInterval on unmount)
- BLE mock timing (1.5 / 1.0 / 1.0 s per state — adjust if feel is off)
- UnlockSuccess checkmark animation style (static icon is acceptable; simple fade-in is fine)

### Deferred Ideas (OUT OF SCOPE)

- Real Bluetooth unlock with hardware pairing
- QR code content validation (checking the code belongs to the booked bike)
- Booking modification / cancellation API
- Push notification when bike is unlocked

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BOOK-01 | User can reserve a specific e-bike | bookingService.reserveBike() + BookingConfirmation screen |
| BOOK-02 | User can unlock a bike by scanning its QR code | expo-camera CameraView + onBarcodeScanned → UnlockSuccess |
| BOOK-03 | User can unlock a bike via Bluetooth proximity | BLE mock screen with 3-state auto-advance → UnlockSuccess |
| BOOK-04 | User sees a booking confirmation screen with pickup instructions | BookingConfirmation: bike details + static location card + countdown + unlock CTAs |

</phase_requirements>

---

## Summary

Phase 3 adds a modal BookingStack on top of the existing AppTabs navigator. The flow is: BikeDetailSheet Reserve button → BookingConfirmation (with countdown timer, bike info, and two unlock CTAs) → QRScanner or BLEUnlock → UnlockSuccess. All behaviour is mocked — no real API calls, no real Bluetooth.

The critical new dependency is `expo-camera` (not yet installed). The SDK 57 API uses `CameraView` (not the legacy `Camera` component), `useCameraPermissions()` hook for permissions, and the `onBarcodeScanned` prop with `barcodeScannerSettings={{ barcodeTypes: ['qr'] }}` to filter to QR only. This is a verified API break from pre-SDK 50 patterns.

The modal stack pattern for React Navigation is straightforward: add `BookingStack` to `RootStackParamList` using `NavigatorScreenParams`, add a `<Stack.Screen name="BookingStack" component={BookingNavigator} options={{ presentation: 'modal' }} />` in RootNavigator, and create a separate `BookingNavigator` (a nested Stack) for the three booking screens. Navigation from the BottomSheetModal context in MapScreen requires the root navigation prop, which is accessible via `useNavigation` from `@react-navigation/native`.

**Primary recommendation:** Install expo-camera via `npx expo install expo-camera` (which pins to the SDK 57-compatible version), add the camera plugin to app.json, implement the modal stack with a dedicated BookingNavigator, then build screens sequentially: service → navigation types → screens.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Reservation creation | Frontend (mock service) | — | bookingService.reserveBike() returns a mock Booking; no real backend |
| Booking confirmation display | Screen (BookingConfirmation) | — | Displays bike data passed as route param + mock booking response |
| Countdown timer | Screen (BookingConfirmation) | — | setInterval in useEffect; entirely local state |
| QR code scanning | Screen (QRScanner) | expo-camera | expo-camera CameraView handles camera + barcode detection |
| Camera permissions | OS permission layer | expo-camera hook | useCameraPermissions() mediates OS → component |
| BLE mock state machine | Screen (BLEUnlock) | — | Pure UI state, no library; setTimeout auto-advances states |
| Unlock success | Screen (UnlockSuccess) | — | Static confirmation; Phase 4 will replace "Start Ride" |
| Modal navigation stack | React Navigation RootNavigator | BookingNavigator | BookingStack is a nested stack presented as modal from root |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo-camera | ~57.0.3 | QR/barcode scanning via CameraView | Only Expo-native camera solution for SDK 57; `npx expo install` pins correct version |
| @react-navigation/stack | ^7.10.22 (already installed) | BookingNavigator (nested stack) | Already used for AuthStack; same pattern for BookingStack |
| @react-navigation/native | ^7.3.16 (already installed) | useNavigation hook in MapScreen | Already installed |
| react-native-paper | ^5.15.3 (already installed) | Snackbar (expiry), Button outlined variant (BLE CTA) | Already installed; consistent with Phase 1/2 patterns |
| @expo/vector-icons | ^15.0.2 (already installed) | check-circle, bluetooth, map-marker-outline icons | Already installed |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native (built-in) | — | setInterval, clearInterval for countdown | Countdown timer — no third-party timer library needed |
| react-native (built-in) | — | ActivityIndicator for BLE scanning spinner | Built-in; no extra dependency |
| react-native-safe-area-context | ^5.9.0 (already installed) | useSafeAreaInsets on QRScanner full-screen | Already installed; use insets for status bar padding on camera screen |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| setInterval countdown | react-native-countdown-circle-timer | Overkill for a text-only MM:SS display; no third-party dep needed |
| CameraView onBarcodeScanned | vision-camera | vision-camera is not Expo-integrated in SDK 57; expo-camera is the canonical choice |
| Paper Snackbar for expiry | Alert.alert() | Alert is simpler but less on-brand; Paper Snackbar matches existing UI style |

**Installation (new package only):**
```bash
npx expo install expo-camera
```

This pins to `~57.0.3` (SDK 57 compatible). Must also add plugin to `app.json`.

---

## Package Legitimacy Audit

> slopcheck was not available in this environment. expo-camera is verified as an official Expo SDK package via the Expo documentation at docs.expo.dev/versions/v57.0.0/sdk/camera/ and npm registry.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| expo-camera | npm | 8 yrs (2018-07-06) | Very high (Expo official) | github.com/expo/expo | [ASSUMED] — slopcheck unavailable; VERIFIED via official Expo docs | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none

**Packages flagged as suspicious [SUS]:** none

*slopcheck was unavailable at research time. expo-camera is an official first-party Expo package, confirmed by `npm view expo-camera` (version 57.0.3, published by the Expo team) and the official Expo SDK 57 documentation. The planner does NOT need to gate this behind a checkpoint — official Expo packages are not slopsquatting candidates.*

---

## expo-camera SDK 57 API Reference

**[VERIFIED: https://docs.expo.dev/versions/v57.0.0/sdk/camera/]**

### Import

```typescript
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
```

**Breaking change from legacy API:** The old `Camera` component is no longer the canonical API. SDK 57 uses `CameraView`. Any code or tutorial referencing `<Camera>` as the primary component is outdated.

### Permissions Pattern

```typescript
const [permission, requestPermission] = useCameraPermissions();

// permission is null while loading, then PermissionResponse:
// { granted: boolean, status: PermissionStatus, canAskAgain: boolean, expires: PermissionExpiration }

if (!permission) return null; // still loading

if (!permission.granted) {
  if (!permission.canAskAgain) {
    // User permanently denied — show "Go to Settings" UI
  }
  // Show rationale + request button
  return (
    <View>
      <Text>Camera access is needed to scan the bike QR code.</Text>
      <Button onPress={requestPermission}>Allow Camera</Button>
    </View>
  );
}

// permission.granted === true — render camera
```

**Note:** No separate `app.json` permission string is required for camera on Android when using the expo-camera plugin — the plugin injects the correct `CAMERA` permission automatically. iOS requires the `NSCameraUsageDescription` string, also injected by the plugin.

### app.json Plugin Entry

```json
{
  "expo": {
    "plugins": [
      ["expo-camera", { "cameraPermission": "Allow VoltVenture to access your camera to scan bike QR codes." }]
    ]
  }
}
```

### QR Scanning Component

```typescript
<CameraView
  style={StyleSheet.absoluteFill}
  facing="back"
  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
  onBarcodeScanned={handleBarcodeScanned}
/>
```

**Prop: `barcodeScannerSettings`** — Object with `barcodeTypes` array. Filtering to `['qr']` is recommended for performance and to avoid accidental triggers on non-QR codes.

**Important iOS limitation [VERIFIED: official docs]:** Only QR codes are supported on iOS. Filtering to `['qr']` is both sufficient and necessary for cross-platform behaviour.

**Prop: `onBarcodeScanned`** — `(result: BarcodeScanningResult) => void`

```typescript
interface BarcodeScanningResult {
  type: string;   // e.g., 'qr'
  data: string;   // the decoded string content of the QR code
  bounds: { origin: { x: number; y: number }; size: { width: number; height: number } };
  cornerPoints: Array<{ x: number; y: number }>;
  extra?: Record<string, any>; // Android only
}
```

### Preventing Multiple Scans

A scanned QR will fire `onBarcodeScanned` on every frame until the camera is unmounted. Guard against repeated navigation calls with a ref:

```typescript
const hasScanned = useRef(false);

const handleBarcodeScanned = useCallback((result: BarcodeScanningResult) => {
  if (hasScanned.current) return;
  hasScanned.current = true;
  // navigate to UnlockSuccess
  navigation.navigate('UnlockSuccess', { bike });
}, [navigation, bike]);
```

This is a critical pitfall — without the guard, the navigation stack will receive multiple pushes in rapid succession.

---

## React Navigation Modal Stack Pattern

**[VERIFIED: https://reactnavigation.org/docs/modal/]**

### Pattern Overview

The BookingStack is added to the root `Stack.Navigator` in `RootNavigator.tsx` with `presentation: 'modal'`. It is a **separate nested Stack navigator** (`BookingNavigator`) rendered as a modal over `AppTabs`.

### 1. Update `navigation.ts` — Add Types

```typescript
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Bike } from './bike'; // existing type

// New: Booking screens param list
export type BookingStackParamList = {
  BookingConfirmation: { bike: Bike };
  QRScanner: { bike: Bike };
  BLEUnlock: { bike: Bike };
  UnlockSuccess: { bike: Bike };
};

// Updated: Root stack now includes BookingStack
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>; // ADD THIS
};

// New nav prop types for booking screens
export type BookingNavProp = StackNavigationProp<BookingStackParamList>;
```

### 2. Create `BookingNavigator.tsx`

```typescript
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

### 3. Update `RootNavigator.tsx` — Add BookingStack

```typescript
// Add import
import BookingNavigator from './BookingNavigator';

// Inside Stack.Navigator, after AppTabs Screen:
<Stack.Screen
  name="BookingStack"
  component={BookingNavigator}
  options={{ presentation: 'modal', headerShown: false }}
/>
```

**Placement:** The `BookingStack` screen must be registered regardless of auth state — it appears when the user is authenticated and navigating from the map. Place it after the conditional auth/app screens block:

```typescript
return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {state.userToken != null ? (
      <Stack.Screen name="AppTabs" component={AppTabs} />
    ) : (
      <Stack.Screen name="AuthStack" component={AuthStack} ... />
    )}
    <Stack.Screen
      name="BookingStack"
      component={BookingNavigator}
      options={{ presentation: 'modal', headerShown: false }}
    />
  </Stack.Navigator>
);
```

### 4. Navigate from MapScreen (BikeDetailSheet reserve handler)

`MapScreen` currently passes `onReserve` as a prop to `BikeDetailSheet`. `MapScreen` has access to React Navigation context via `useNavigation` or via its screen props.

**Current integration point in MapScreen.tsx (line 162):**
```typescript
onReserve={() => console.log('TODO Phase 3: navigate to booking')}
```

**Phase 3 replacement:**
```typescript
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

// In MapScreen component:
const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

// In the BottomSheetModal onReserve handler:
onReserve={() => {
  if (!selectedBike) return;
  bikeDetailRef.current?.dismiss(); // close the bottom sheet first
  navigation.navigate('BookingStack', {
    screen: 'BookingConfirmation',
    params: { bike: selectedBike },
  });
}}
```

**Key detail:** `bikeDetailRef.current?.dismiss()` should be called before navigating. The bottom sheet dismissal and the modal presentation are independent animations; calling dismiss first avoids visual stacking artifacts.

---

## Countdown Timer Pattern

**[ASSUMED] — standard React Native setInterval pattern; verified as correct approach per CONTEXT.md D-04.**

```typescript
const HOLD_DURATION_SECONDS = 10 * 60; // 600 seconds

function BookingConfirmationScreen({ route, navigation }) {
  const { bike } = route.params;
  const [secondsLeft, setSecondsLeft] = useState(HOLD_DURATION_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Will reach 0 this tick — clean up and trigger expiry
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Watch for 0 to trigger expiry in a separate effect
  useEffect(() => {
    if (secondsLeft === 0) {
      // Show snackbar, then dismiss
      // Using setTimeout(0) to ensure state flush before navigation
      setTimeout(() => navigation.getParent()?.goBack(), 3000); // after snackbar
    }
  }, [secondsLeft, navigation]);

  // Format for display: MM:SS
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
```

### Pitfalls

1. **Double clearInterval:** The functional setState with prev <= 1 must call clearInterval inside the updater or in the expiry effect — not both. Cleanest approach: clearInterval in the cleanup function only, and use the `secondsLeft === 0` effect to detect expiry.
2. **Backgrounding on Android:** setInterval does not pause reliably when the app is backgrounded. For a 10-minute timer this is acceptable (worst case: timer overshoots slightly). A production approach would store `expiresAt` timestamp and compute remaining time on each tick — simpler and background-safe:

```typescript
// Background-safe variant (recommended)
const expiresAt = useRef(Date.now() + HOLD_DURATION_SECONDS * 1000);

useEffect(() => {
  intervalRef.current = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((expiresAt.current - Date.now()) / 1000));
    setSecondsLeft(remaining);
    if (remaining === 0) clearInterval(intervalRef.current!);
  }, 1000);
  return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
}, []);
```

This approach eliminates drift and is the pattern to use even in this mock phase.

---

## BLE Mock State Machine Pattern

**[ASSUMED] — no BLE library; pure UI state machine with setTimeout.**

```typescript
type BLEState = 'scanning' | 'found' | 'connecting' | 'done';

function BLEUnlockScreen({ route, navigation }) {
  const { bike } = route.params;
  const [bleState, setBleState] = useState<BLEState>('scanning');

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;

    t1 = setTimeout(() => setBleState('found'), 1500);
    t2 = setTimeout(() => setBleState('connecting'), 1500 + 1000);
    t3 = setTimeout(() => {
      navigation.navigate('UnlockSuccess', { bike });
    }, 1500 + 1000 + 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);
}
```

**Cancel handler:** `navigation.goBack()` — returns to BookingConfirmation.

**Pitfall:** If the user taps Cancel during t3 (after Connecting starts), the timeout may still fire and attempt navigation after the screen has unmounted. The `clearTimeout` in the cleanup function prevents this correctly.

---

## Existing Code Patterns Extracted

### bikeService.ts Pattern (mirror for bookingService.ts)

The exact pattern established in `src/services/bikeService.ts` and `src/services/authService.ts`:

```typescript
// src/services/bookingService.ts

import { Bike } from '../types/bike';

export interface Booking {
  id: string;
  bikeId: string;
  expiresAt: string; // ISO 8601 timestamp
}

export interface BookingService {
  reserveBike(bikeId: string): Promise<Booking>;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const mockBookingService: BookingService = {
  async reserveBike(bikeId) {
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

**Service rules extracted from codebase:**
- `interface ServiceName` (capability contract)
- `const delay = (ms: number) => ...` (identical in bikeService and authService — copy verbatim)
- `const mockXxxService: XxxService = { ... }` (implementation object)
- `export const xxxService: XxxService = mockXxxService` (singleton export)

### Navigation Types Pattern (from `src/types/navigation.ts`)

Current file exports:
- `AuthStackParamList` — AuthStack screen params
- `AppTabParamList` — AppTabs screen params
- `RootStackParamList` — root stack (AuthStack | AppTabs)
- `AuthNavProp` — type alias for AuthStack navigation prop
- `AppTabNavProp` — type alias for AppTab navigation prop

Phase 3 additions follow the same pattern:
- `BookingStackParamList` — BookingStack screen params (each screen needs `bike: Bike`)
- Update `RootStackParamList` to add `BookingStack: NavigatorScreenParams<BookingStackParamList>`
- `BookingNavProp` — type alias for BookingStack navigation prop

### Styling Pattern (from Phase 2 screens)

All booking screens use `StyleSheet.create` with `DSColors`/`DSTypography` tokens — **no NativeWind**. This is established convention for any screen that isn't a simple form.

```typescript
import { DSColors, DSTypography } from '../../theme/theme';
// ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DSColors.background,
    paddingHorizontal: 24,
  },
  heading: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
  },
});
```

### PrimaryButton Reuse Pattern

`PrimaryButton` accepts `label`, `onPress`, `loading`, `disabled`, `testID`. It renders at `width: '100%'` and `minHeight: 52`. No extra wrapping styles needed for full-width layout.

Secondary (outlined) button for BLE CTA:
```typescript
import { Button } from 'react-native-paper';
<Button mode="outlined" onPress={handleBLE} style={{ width: '100%', marginTop: 12 }}>
  Unlock via Bluetooth
</Button>
```

### BikeDetailSheet Integration Point

`MapScreen.tsx` at line 162:
```typescript
onReserve={() => console.log('TODO Phase 3: navigate to booking')}
```

`BikeDetailSheet` already receives `onReserve` as a prop — the component itself does not change. Only MapScreen's `onReserve` handler changes.

---

## Architecture Patterns

### System Architecture Diagram

```
MapScreen (AppTabs/Map tab)
  │
  ├── BikeDetailSheet (BottomSheetModal)
  │     └── [Reserve button] onReserve()
  │                │
  │                ▼ navigation.navigate('BookingStack', { screen: 'BookingConfirmation', params: { bike } })
  │
  ▼
BookingStack (modal, slides up over AppTabs)
  │
  ├── BookingConfirmation
  │     ├── bookingService.reserveBike(bike.id) → Booking
  │     ├── Countdown timer (10:00 → expiry dismisses stack)
  │     ├── Static location card (address + pin icon)
  │     ├── [Scan QR Code] → navigate('QRScanner', { bike })
  │     └── [Unlock via Bluetooth] → navigate('BLEUnlock', { bike })
  │
  ├── QRScanner
  │     ├── useCameraPermissions() → request on mount
  │     ├── CameraView (full-screen, facing='back')
  │     │     barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
  │     │     onBarcodeScanned → (hasScanned guard) → navigate('UnlockSuccess', { bike })
  │     ├── Viewfinder overlay (centred square, Electric Green corners)
  │     └── [X button] → navigation.goBack()
  │
  ├── BLEUnlock
  │     ├── State machine: scanning(1.5s) → found(1.0s) → connecting(1.0s)
  │     ├── Auto-navigate to UnlockSuccess after connecting
  │     └── [Cancel] → navigation.goBack()
  │
  └── UnlockSuccess
        ├── check-circle icon (Electric Green)
        ├── "Bike unlocked!" + bike name
        └── [Start Ride] → Phase 4 stub: navigation.getParent()?.popToTop()
```

### Recommended Project Structure

```
src/
├── navigation/
│   ├── RootNavigator.tsx     # MODIFIED — add BookingStack modal screen
│   ├── AppTabs.tsx           # UNCHANGED
│   └── BookingNavigator.tsx  # NEW — nested stack for booking flow
├── screens/
│   └── booking/              # NEW folder
│       ├── BookingConfirmationScreen.tsx
│       ├── QRScannerScreen.tsx
│       ├── BLEUnlockScreen.tsx
│       └── UnlockSuccessScreen.tsx
├── services/
│   └── bookingService.ts     # NEW — mirrors bikeService pattern
├── types/
│   ├── navigation.ts         # MODIFIED — add BookingStackParamList
│   └── booking.ts            # NEW — Booking interface
└── screens/
    └── app/
        └── MapScreen.tsx     # MODIFIED — onReserve handler only (line 162)
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Camera access + barcode decode | Custom camera + ML barcode decoder | expo-camera CameraView + onBarcodeScanned | Handles platform camera APIs, decode pipeline, permissions lifecycle, iOS QR limitation |
| Permission state machine | Manual AsyncStorage tracking | useCameraPermissions() hook | Handles granted/denied/canAskAgain/loading states correctly across iOS and Android |
| BLE connection | Custom BLE manager with retries | setTimeout mock (as decided) | Real BLE is out of scope; mock covers the UX requirement |
| Navigation type safety | String-based navigate() calls | BookingStackParamList + BookingNavProp types | TypeScript catches wrong screen names and missing params at compile time |

**Key insight:** The camera permission and scanning lifecycle has significant platform-specific behaviour (iOS QR-only, Android multi-format, both have canAskAgain edge cases). expo-camera handles all of this — never replicate it.

---

## Common Pitfalls

### Pitfall 1: Multiple QR scan events
**What goes wrong:** `onBarcodeScanned` fires on every camera frame where a QR code is visible. Without a guard, `navigation.navigate('UnlockSuccess', ...)` is called dozens of times per second, corrupting the navigation stack.
**Why it happens:** The camera continuously decodes frames; the callback is not debounced by the library.
**How to avoid:** Use a `useRef<boolean>(false)` guard (`hasScanned`). Set it to `true` on first scan. Return early on all subsequent calls.
**Warning signs:** Navigation stack shows multiple UnlockSuccess screens, or the back button requires many presses.

### Pitfall 2: Expo camera plugin missing from app.json
**What goes wrong:** App builds successfully but crashes at runtime with a native module error when the camera screen mounts.
**Why it happens:** expo-camera requires a native module registration (Expo config plugin) that modifies AndroidManifest.xml and Info.plist. Without it, the native module is absent in the build.
**How to avoid:** After `npx expo install expo-camera`, add `["expo-camera", { "cameraPermission": "..." }]` to `app.json` plugins array. Re-run `expo run:android` / `expo run:ios` to rebuild.
**Warning signs:** "expo-camera: native module not found" error in Metro logs or red screen on camera mount.

### Pitfall 3: Navigating to nested BookingStack screen from MapScreen
**What goes wrong:** `navigation.navigate('BookingConfirmation', { bike })` (direct name) throws "The action 'NAVIGATE' with payload {"name":"BookingConfirmation"} was not handled" because BookingConfirmation is nested inside BookingStack.
**Why it happens:** Direct nested screen navigation requires specifying the parent stack.
**How to avoid:** Always navigate with the two-level call: `navigation.navigate('BookingStack', { screen: 'BookingConfirmation', params: { bike } })`.
**Warning signs:** Yellow box warning or unhandled action error in Metro when tapping Reserve.

### Pitfall 4: Countdown timer drift and background behaviour
**What goes wrong:** After 10 minutes, the timer shows 2–5 seconds off the expected value, or it auto-cancels early/late when the user backgrounds the app.
**Why it happens:** `setInterval` with 1000ms fires imprecisely; cumulative error builds up. Backgrounding on Android may throttle or pause JS execution.
**How to avoid:** Store `expiresAt = Date.now() + HOLD_DURATION_SECONDS * 1000` in a ref. On each interval tick, compute `remaining = Math.max(0, Math.ceil((expiresAt.current - Date.now()) / 1000))`. This gives wall-clock accuracy regardless of drift or backgrounding.
**Warning signs:** Timer shows 9:58 after exactly 2 seconds of wall clock time.

### Pitfall 5: BookingStack registered inside conditional auth block
**What goes wrong:** The BookingStack screen is placed inside the `{state.userToken != null ? ... : ...}` conditional in RootNavigator, making it only present when authenticated, but React Navigation v7 warns about conditional screen registration.
**Why it happens:** Temptation to put all "app" screens inside the authenticated block.
**How to avoid:** Place BookingStack as a sibling of the conditional block (after it), not inside it. Unauthenticated users can't reach it anyway since they're on AuthStack.
**Warning signs:** React Navigation warning "A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children."

### Pitfall 6: bikeDetailRef.current?.dismiss() not called before navigating
**What goes wrong:** The bottom sheet stays open or partially visible behind the modal BookingStack, creating visual artifacts on return.
**Why it happens:** The bottom sheet dismiss and modal presentation are independent — React Navigation does not know about the bottom sheet.
**How to avoid:** Always call `bikeDetailRef.current?.dismiss()` before `navigation.navigate('BookingStack', ...)` in MapScreen's onReserve handler.
**Warning signs:** After returning from BookingStack, the map shows a partially visible bottom sheet that requires an extra tap to dismiss.

### Pitfall 7: CameraView rendered when permission not yet resolved
**What goes wrong:** App renders `<CameraView>` while `permission === null` (permission state still loading), causing a crash or blank screen.
**Why it happens:** `useCameraPermissions()` returns `null` initially while the permission status is being read from the OS.
**How to avoid:** Gate rendering: `if (!permission) return <LoadingView />`. Then check `permission.granted`, then render `<CameraView>`.
**Warning signs:** Camera screen briefly flashes or crashes on first mount.

---

## Code Examples

### Full QRScanner Screen Skeleton

```typescript
// src/screens/booking/QRScannerScreen.tsx
import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BookingStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';

type Props = StackScreenProps<BookingStackParamList, 'QRScanner'>;

export default function QRScannerScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const hasScanned = useRef(false);
  const insets = useSafeAreaInsets();

  const handleBarcodeScanned = useCallback(
    (_result: BarcodeScanningResult) => {
      if (hasScanned.current) return;
      hasScanned.current = true;
      navigation.navigate('UnlockSuccess', { bike });
    },
    [navigation, bike],
  );

  // 1. Loading
  if (!permission) return <View style={styles.container} />;

  // 2. Denied — no canAskAgain
  if (!permission.granted && !permission.canAskAgain) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.permissionText}>
          Camera access was denied. Enable it in Settings to scan QR codes.
        </Text>
        <TouchableOpacity onPress={() => Linking.openSettings()}>
          <Text style={styles.settingsLink}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Not yet granted — show request UI
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.permissionText}>
          Camera access is needed to scan the bike QR code.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.allowButton}>
          <Text style={styles.allowButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Granted — render camera
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      {/* Viewfinder overlay — corner brackets in Electric Green */}
      {/* ... */}
      {/* X button */}
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 16 }]}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="close" size={28} color={DSColors.background} />
      </TouchableOpacity>
    </View>
  );
}
```

### Viewfinder Corner Brackets (Electric Green)

```typescript
// Centred square viewfinder with Electric Green corner brackets
// The square itself has no fill — camera shows through it
const BRACKET_SIZE = 240; // dp
const BRACKET_THICKNESS = 4;
const BRACKET_LENGTH = 32;
const BRACKET_COLOR = DSColors.primary; // #C6FF2D

// Four corner views, each with two borders (top/left, top/right, etc.)
// Example — top-left corner:
<View style={{
  position: 'absolute',
  top: 0,
  left: 0,
  width: BRACKET_LENGTH,
  height: BRACKET_LENGTH,
  borderTopWidth: BRACKET_THICKNESS,
  borderLeftWidth: BRACKET_THICKNESS,
  borderColor: BRACKET_COLOR,
}} />
```

### Dismiss BookingStack to Map (X button / expiry)

```typescript
// From any screen in BookingStack, dismiss the entire modal stack:
navigation.getParent()?.goBack();

// Or from UnlockSuccess "Start Ride" Phase 4 stub:
navigation.getParent()?.popToTop();
// (goBack() also works since BookingStack is the only modal)
```

---

## Wave/Plan Decomposition Recommendation

Based on the coarse granularity setting and the complexity of each unit, three plans deliver vertical slices:

### Plan 03-01 — Foundation: Service + Navigation + BookingConfirmation
**What it delivers:** End-to-end: user taps Reserve → modal slides up → BookingConfirmation screen visible with bike details, countdown timer, and two unlock CTAs.

Tasks:
1. `npx expo install expo-camera` + add plugin to app.json
2. Create `src/types/booking.ts` (Booking interface)
3. Create `src/services/bookingService.ts` (reserveBike mock)
4. Update `src/types/navigation.ts` (add BookingStackParamList + update RootStackParamList)
5. Create `src/navigation/BookingNavigator.tsx` (4 screens stubs initially)
6. Update `src/navigation/RootNavigator.tsx` (add BookingStack modal)
7. Create `src/screens/booking/BookingConfirmationScreen.tsx` (calls bookingService, shows bike details, static location card, countdown timer, two CTAs — both `console.log('TODO')` stubs)
8. Create stub screens: QRScannerScreen, BLEUnlockScreen, UnlockSuccessScreen (empty View + Text)
9. Update `MapScreen.tsx` onReserve handler (dismiss bottom sheet + navigate to BookingStack)

**Acceptance:** Reserve button → modal opens → BookingConfirmation shows bike name, battery, price, countdown ticking, two buttons visible.

### Plan 03-02 — QR Scanner Screen
**What it delivers:** Tapping "Scan QR Code" opens full-screen camera. Scanning any QR → UnlockSuccess stub. Permission denied state handled.

Tasks:
1. Implement `QRScannerScreen.tsx` (useCameraPermissions, CameraView, viewfinder overlay, close button, hasScanned guard, navigation to UnlockSuccess)
2. Implement `UnlockSuccessScreen.tsx` (check-circle icon, "Bike unlocked!", bike name, "Start Ride" stub — pops BookingStack to map)

**Acceptance:** QR scan button → camera opens → scan any QR → success screen → Start Ride returns to map.

### Plan 03-03 — BLE Unlock Screen + Expiry
**What it delivers:** BLE mock auto-advances through 3 states to UnlockSuccess. Countdown expiry dismisses the stack.

Tasks:
1. Implement `BLEUnlockScreen.tsx` (3-state machine, ActivityIndicator, Cancel button)
2. Add expiry logic to `BookingConfirmationScreen.tsx` (Snackbar + dismiss on secondsLeft === 0)
3. End-to-end smoke check: full flow — Reserve → Confirm → BLE → UnlockSuccess → Start Ride

**Acceptance:** BLE path works end-to-end; timer expiry dismisses modal cleanly.

**Note:** Three plans keeps each one focused and reviewable. Plan 03-01 is the longest but it has no new native modules — just TypeScript + navigation scaffolding. Plans 03-02 and 03-03 each touch one screen primarily.

---

## Risks and Landmines

### HIGH — expo-camera requires rebuild
`npx expo install expo-camera` adds a native module. The Expo config plugin modifies `android/` and `ios/` build files. **A full native rebuild is required** (`expo run:android` / `expo run:ios`) — Metro bundler reload alone is insufficient. This is the #1 risk for wasted time: the camera screen will fail at runtime (not compile time) if the rebuild is skipped.

### HIGH — iOS QR-only limitation is real
On iOS, `barcodeScannerSettings.barcodeTypes` only accepts `['qr']`. Specifying other types causes a silent no-op or warning. Since any valid QR scan is a success (D-08), this is fine — but the plan must specify `['qr']` not a multi-type array.

### MEDIUM — BookingStack param type with nested navigate
`navigation.navigate('BookingStack', { screen: 'BookingConfirmation', params: { bike } })` requires TypeScript to accept `NavigatorScreenParams<BookingStackParamList>` as the params type for `BookingStack` in `RootStackParamList`. If typed as `undefined` or `object`, TypeScript will reject the call. The type must be `NavigatorScreenParams<BookingStackParamList>`.

### MEDIUM — Bottom sheet (gorhom) + React Navigation modal interaction
`@gorhom/bottom-sheet` v5 uses `react-native-reanimated` and gesture handler. The modal stack presentation also uses `react-native-gesture-handler`. These can interfere — specifically, swipe-to-dismiss the modal stack may conflict with the bottom sheet's pan handler if the bottom sheet is still mounted. Calling `bikeDetailRef.current?.dismiss()` before navigating (Pitfall 6) mitigates this.

### LOW — Countdown timer in background
As documented in Pitfall 4, the timestamp-based approach eliminates drift. This is a low risk because: (a) tourists are likely to keep the app foregrounded during booking, (b) a 10-minute timer has ample tolerance even with slight drift.

### LOW — `navigation.getParent()` may return undefined
`navigation.getParent()` returns `undefined` if the BookingNavigator is the root navigator (which it isn't — it's nested under RootNavigator). This is safe as long as the navigator hierarchy is correct. TypeScript will not catch this — always test the dismiss path.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| expo-camera | QR scanning (BOOK-02) | Not yet installed | Will be ~57.0.3 via `npx expo install` | — (no fallback for QR scanning) |
| Android emulator / EAS dev build | Testing native camera | User-dependent | — | Cannot test camera in Expo Go (SDK 57 incompatible) |
| expo (Expo SDK) | All expo-camera functionality | ✓ | ~57.0.12 | — |
| @react-navigation/stack | BookingNavigator | ✓ | ^7.10.22 | — |
| react-native-paper | Snackbar, Button outlined | ✓ | ^5.15.3 | — |
| @expo/vector-icons | check-circle, bluetooth icons | ✓ | ^15.0.2 | — |

**Missing dependencies with no fallback:**
- expo-camera: must be installed via `npx expo install expo-camera` before Plan 03-02 (QR scanner) can be executed

**Missing dependencies with fallback:**
- Android emulator / EAS dev build: required to test camera. QRScannerScreen can be implemented and code-reviewed without a device, but functional testing requires a native build.

---

## Security Domain

> security_enforcement not explicitly set to false — including section.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A — user already authenticated; booking is post-auth |
| V3 Session Management | No | N/A — no new session tokens |
| V4 Access Control | No | All data is mocked; no server-side resources |
| V5 Input Validation | No | QR data is intentionally not validated (D-08); no user text input |
| V6 Cryptography | No | No encryption needed; mock service only |

**Threat note:** The intentional "any valid QR scan = success" decision (D-08) is a deliberate mock simplification. The CONTEXT.md explicitly defers QR content validation to the backend integration phase. This is not a security gap for this phase — it's a documented scope boundary.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | setInterval countdown is acceptable for 10-minute mock timer without real-time sync | Countdown Timer Pattern | Low — timestamp-based approach mitigates drift; no backend to sync with |
| A2 | `navigation.getParent()?.goBack()` correctly dismisses the BookingStack modal from any nested screen | Architecture Patterns | Medium — if navigator hierarchy differs from expected, dismiss path breaks; verify in Plan 03-01 |
| A3 | `bikeDetailRef.current?.dismiss()` before navigate prevents visual artifact between bottom sheet and modal | Common Pitfalls | Low — standard gorhom bottom-sheet pattern; confirmed by Phase 2 patterns |
| A4 | BLE mock timing (1.5s / 1.0s / 1.0s) produces a satisfactory UX feel | BLE Mock Pattern | Low — timing is Claude's discretion per D-09; easily adjustable |
| A5 | Paper Snackbar is preferred over Alert.alert for expiry notification | BookingConfirmation | Low — either works; Snackbar is more on-brand and matches existing RNP usage |

---

## Sources

### Primary (HIGH confidence)
- **[VERIFIED: https://docs.expo.dev/versions/v57.0.0/sdk/camera/]** — CameraView component, useCameraPermissions hook, onBarcodeScanned callback, barcodeScannerSettings prop, BarcodeScanningResult type, iOS QR-only limitation
- **[VERIFIED: https://reactnavigation.org/docs/modal/]** — `presentation: 'modal'` option on Stack.Screen, modal screen placement in root stack
- **Codebase (direct read)** — bikeService.ts, authService.ts, navigation.ts, RootNavigator.tsx, AppTabs.tsx, MapScreen.tsx, BikeDetailSheet.tsx, PrimaryButton.tsx, theme.ts, package.json, app.json

### Secondary (MEDIUM confidence)
- **[VERIFIED: npm view expo-camera]** — version 57.0.3, published 2018 (8 years old, official Expo package), homepage docs.expo.dev

### Tertiary (LOW confidence / ASSUMED)
- setInterval/useRef countdown timer pattern — standard React Native pattern, not verified against a specific React Native version changelog

---

## Metadata

**Confidence breakdown:**
- expo-camera API: HIGH — verified against official Expo SDK 57 docs
- Modal stack navigation: HIGH — verified against React Navigation docs + live codebase
- Service / navigation type patterns: HIGH — extracted directly from live codebase
- Countdown timer: MEDIUM — standard React pattern; timestamp-based approach is well-established
- BLE mock: HIGH — pure UI state machine, no external dependencies

**Research date:** 2026-08-18
**Valid until:** 2026-10-18 (stable APIs — expo-camera and React Navigation change slowly; recheck if SDK bumps)

---

## RESEARCH COMPLETE
