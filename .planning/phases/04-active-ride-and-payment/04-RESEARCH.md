# Phase 4: Active Ride & Payment — Research

**Researched:** 2026-08-18
**Domain:** React Navigation nested stacks, setInterval timer, MapView overlay, mock services
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** New `RideStack` added to `RootStackParamList` alongside `BookingStack`, modal presentation. Screens: `ActiveRide`, `PaymentSummary`, `RideReceipt`. `UnlockSuccessScreen` "Start Ride" calls `navigation.getParent()?.navigate('RideStack', { screen: 'ActiveRide', params: { bike } })`.
- **D-02:** All RideStack screens full-screen, no header, no back button. Exit only via "Done" on RideReceipt.
- **D-03:** Full-screen map (`react-native-maps`) on ActiveRide with user location as distinct marker. Map non-interactive during ride.
- **D-04:** Floating top overlay card — `rgba(15,15,15,0.85)`, timer in Electric Green counting UP in MM:SS (32px/700), running cost in white below, battery % with icon on right. Updated every second via `setInterval`.
- **D-05:** "End Ride" button — `backgroundColor: '#E53935'`, white label, pinned to bottom above safe area. Navigates to `PaymentSummary` within RideStack.
- **D-06:** `rideService.ts` — mirror bookingService pattern. `startRide(bike): Promise<ActiveRide>`, `endRide(rideId, bike, durationSec): Promise<RideSummary>`. Types in `ride.ts`.
- **D-07:** Battery is static (mock) during ride — use `bike.batteryPct` from route params. No decrement.
- **D-08:** `PaymentSummary` — trip summary card (duration MM:SS, mock distance, cost breakdown: base fare €0.50 + per-minute), saved payment row (Visa •••• 4242), "Confirm & Pay" button. No back button.
- **D-09:** "Confirm & Pay" calls `paymentService.processPayment()` (await delay 1500ms), shows `ActivityIndicator` during processing, then navigates to `RideReceipt`.
- **D-10:** `paymentService.ts` — mirror pattern. `processPayment(summary): Promise<PaymentResult>`. Type: `PaymentResult { id, amount, method, timestamp }`.
- **D-11:** `RideReceipt` — Electric Green `check-circle` (size 80), "Payment confirmed!" (28px/700), cost total, breakdown rows, bike name, duration, PrimaryButton "Done" calls `navigation.getParent()?.goBack()`.
- **D-12:** After RideReceipt renders, add completed ride to in-memory array in `rideService`.
- **D-13:** `AccountScreen` gains "Ride History" and "Payment Methods" rows above Log Out. Same row pattern (TouchableOpacity + chevron-right).
- **D-14:** Account tab gets wrapping `AccountNavigator` stack. Screens: `AccountMain`, `RideHistory`, `PaymentMethods`. `AppTabs` switches from `AccountScreen` to `AccountNavigator`.
- **D-15:** `RideHistoryScreen` — FlatList from `rideService.getRideHistory()`. Each row: date, bike name, duration, cost. Empty state text.
- **D-16:** `PaymentMethodsScreen` — one mock Visa •••• 4242 row, "Add Payment Method" stub row (Snackbar "coming soon").

### Claude's Discretion

- Exact live cost formula: `(elapsedSeconds / 60) * bike.pricePerMin` rounded to 2 decimal places
- Mock distance in RideSummary (e.g., 1.2 km static or derived from elapsed time)
- Map region during active ride: center on mock user location (same Amsterdam coords as Phase 2)
- User location marker style on ActiveRide map (distinct from bike pins — blue or white filled circle with DS border)
- Exact spacing/card styling of PaymentSummary and RideReceipt screens
- AccountStack navigator header style (headerShown: false for AccountMain, shown with back button for sub-screens)

### Deferred Ideas (OUT OF SCOPE)

- Real GPS location tracking during ride
- Real payment processing (Stripe/Adyen)
- Real bike battery telemetry
- Ride rating/review after receipt
- Push notifications
- Multi-currency support
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RIDE-01 | User sees live ride timer and running cost | setInterval count-up pattern verified from BookingConfirmationScreen; cost = (elapsed/60) * pricePerMin |
| RIDE-02 | User sees current battery % of rented bike | Static mock from route params (bike.batteryPct) — D-07 locked |
| RIDE-03 | User sees their location on map during ride | MapView already installed (1.27.2); showsUserLocation + custom Marker pattern from MapScreen |
| RIDE-04 | User can end ride with one tap and proceed to payment | "End Ride" red button → navigation.navigate('PaymentSummary') within RideStack |
| PAY-01 | User charged via saved payment method when ride ends | paymentService.processPayment() mock with 1.5s delay — Visa 4242 row |
| PAY-02 | User can add/manage payment methods | PaymentMethodsScreen stub in AccountStack — view only, add = Snackbar "coming soon" |
| PAY-03 | User receives ride receipt with cost breakdown | RideReceipt screen with check-circle, total, breakdown rows |
| PAY-04 | User can view ride history | RideHistoryScreen FlatList from rideService.getRideHistory() |
</phase_requirements>

---

## Summary

Phase 4 completes the tourist's full ride lifecycle by adding three new navigation structures and six new screens to the existing React Native app. All data is mocked — no real APIs. The codebase already has every dependency installed and every pattern needed; this phase is primarily wiring and mirroring established patterns.

The two most architecturally significant changes are: (1) adding a second modal stack (`RideStack`) alongside `BookingStack` in `RootNavigator`, and (2) converting the flat `Account` tab into a wrapped stack navigator (`AccountNavigator`). Both changes require careful TypeScript type updates to `navigation.ts` before any screen work begins.

The most common pitfall in this phase is `getParent()` chain depth. From within `UnlockSuccessScreen` (which is inside `BookingStack` inside `RootNavigator`), calling `getParent()` reaches `BookingNavigator`, not `RootNavigator`. To navigate to `RideStack` the call must be `navigation.getParent<any>()?.navigate('RideStack', ...)`. A second pitfall is `AppTabParamList` — when Account switches from a flat `Screen` to `AccountNavigator`, the type must change from `Account: undefined` to `Account: NavigatorScreenParams<AccountStackParamList>`.

**Primary recommendation:** Execute this phase in two waves. Wave 1: navigation types + RideStack + all three ride screens + service mocks. Wave 2: AccountNavigator + RideHistory + PaymentMethods screens.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Active ride timer + cost | Client (React state) | — | setInterval in component state; no network needed |
| Map display during ride | Client (MapView) | — | react-native-maps already installed; same layer as MapScreen |
| Overlay floating card | Client (View/StyleSheet) | — | AbsoluteFill + zIndex layering; no library needed |
| End Ride → Payment flow | React Navigation (RideStack) | — | Sequential screens in modal stack, forward-only |
| Mock ride service | Client (singleton) | — | In-memory array, mirrors bookingService pattern |
| Mock payment service | Client (singleton) | — | 1.5s delay mock, mirrors bookingService pattern |
| Ride history persistence | Client (in-memory) | — | Resets on restart; rideService array |
| Account sub-navigation | AccountNavigator (Stack) | AppTabs (Tab) | Tab wraps stack; push to RideHistory / PaymentMethods |

---

## Standard Stack

### Core (all already installed — no new packages needed)

| Library | Installed Version | Purpose | Source |
|---------|------------------|---------|--------|
| react-native-maps | 1.27.2 | MapView for ActiveRide full-screen map | [VERIFIED: package.json] |
| @react-navigation/stack | ^7.10.22 | RideNavigator + AccountNavigator | [VERIFIED: package.json] |
| @react-navigation/native | ^7.3.16 | NavigatorScreenParams type, navigation hooks | [VERIFIED: package.json] |
| react-native-safe-area-context | ^5.9.0 | useSafeAreaInsets for full-screen screens | [VERIFIED: package.json] |
| @expo/vector-icons | ^15.0.2 | MaterialCommunityIcons (check-circle, battery, credit-card, history) | [VERIFIED: package.json] |
| react-native-paper | ^5.15.3 | ActivityIndicator, Snackbar, Button | [VERIFIED: package.json] |

**No new packages required for Phase 4.** All dependencies are already installed.

### Installation

```bash
# No installs needed — all packages already in package.json
```

---

## Package Legitimacy Audit

No new packages are installed in this phase. All libraries used are already present in `package.json` and were verified in prior phases.

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
UnlockSuccessScreen (BookingStack)
  └─ "Start Ride" → navigation.getParent<any>()?.navigate('RideStack', ...)
                          │
                          ▼
                   RootNavigator (Stack)
                    ├─ AppTabs (conditional auth block)
                    │    └─ Account tab → AccountNavigator
                    │         ├─ AccountMain (current AccountScreen)
                    │         ├─ RideHistory ← rideService.getRideHistory()
                    │         └─ PaymentMethods (mock Visa + stub add)
                    ├─ BookingStack (modal) [existing]
                    └─ RideStack (modal) [NEW]
                         ├─ ActiveRide ← bike route param
                         │    ├─ MapView (full-screen, non-interactive)
                         │    ├─ Overlay card (timer, cost, battery)
                         │    └─ "End Ride" button → PaymentSummary
                         ├─ PaymentSummary ← RideSummary route param
                         │    ├─ Trip summary card
                         │    ├─ Payment method row (mock Visa 4242)
                         │    └─ "Confirm & Pay" → paymentService → RideReceipt
                         └─ RideReceipt ← PaymentResult route param
                              ├─ check-circle + "Payment confirmed!"
                              ├─ Cost breakdown
                              └─ "Done" → navigation.getParent()?.goBack()
                                          (dismisses entire RideStack)
```

### Recommended Project Structure

```
src/
├─ types/
│   ├─ navigation.ts        MODIFY — add RideStackParamList, AccountStackParamList,
│   │                                update RootStackParamList and AppTabParamList
│   ├─ ride.ts              CREATE — ActiveRide, RideSummary interfaces
│   └─ payment.ts           CREATE — PaymentResult interface
├─ services/
│   ├─ rideService.ts       CREATE — startRide, endRide, getRideHistory
│   └─ paymentService.ts    CREATE — processPayment
├─ navigation/
│   ├─ RootNavigator.tsx    MODIFY — add RideStack.Screen (modal)
│   ├─ AppTabs.tsx          MODIFY — Account tab → AccountNavigator
│   ├─ RideNavigator.tsx    CREATE — ActiveRide, PaymentSummary, RideReceipt
│   └─ AccountNavigator.tsx CREATE — AccountMain, RideHistory, PaymentMethods
└─ screens/
    ├─ ride/                CREATE directory
    │   ├─ ActiveRideScreen.tsx
    │   ├─ PaymentSummaryScreen.tsx
    │   └─ RideReceiptScreen.tsx
    └─ app/
        ├─ AccountScreen.tsx   MODIFY — rename role to AccountMain within AccountStack
        ├─ RideHistoryScreen.tsx    CREATE
        └─ PaymentMethodsScreen.tsx CREATE
```

---

## Pattern 1: Count-Up Timer with Live Cost (mirror of BookingConfirmationScreen countdown)

**What:** `setInterval` at 1000ms increments an `elapsedSeconds` state counter. Cost is computed inline as `(elapsedSeconds / 60) * bike.pricePerMin`. Cleanup via `clearInterval` in `useEffect` return.

**Key difference from Phase 3:** Phase 3 used an absolute `expiresAt` ref and computed remaining. Phase 4 counts UP using a `startTime` ref to compute elapsed.

**When to use:** Any screen needing a live-updating numeric display tied to real wall time.

```typescript
// Source: [VERIFIED: BookingConfirmationScreen.tsx — adapted count-up]
const startTime = useRef<number>(Date.now());
const [elapsedSeconds, setElapsedSeconds] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setElapsedSeconds(Math.floor((Date.now() - startTime.current) / 1000));
  }, 1000);
  return () => clearInterval(interval);
}, []);

// Display
const minutes = Math.floor(elapsedSeconds / 60);
const seconds = elapsedSeconds % 60;
const timerDisplay = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

// Cost
const cost = ((elapsedSeconds / 60) * bike.pricePerMin).toFixed(2);
```

**Alternative (from CONTEXT.md discretion):** use `useRef<number>(Date.now())` for start time so it never re-renders. `elapsedSeconds` state is only for display updates. The ref is immune to re-render drift. [ASSUMED: minor drift difference negligible at 1s interval]

---

## Pattern 2: Full-Screen MapView with AbsoluteFill Overlay Card

**What:** `MapView` fills the screen via `StyleSheet.absoluteFill`. An overlay `View` with `position: 'absolute'` and specific `top`/`left`/`right`/`zIndex` values floats on top. The bottom button uses `position: 'absolute'` + `bottom` with `insets.bottom` for safe area.

**Already established in MapScreen.tsx** — `StyleSheet.absoluteFill` on the root View and MapView confirmed working. [VERIFIED: MapScreen.tsx lines 116-117]

```typescript
// Source: [VERIFIED: MapScreen.tsx pattern + CONTEXT.md D-04]
<View style={StyleSheet.absoluteFill}>
  <MapView
    style={StyleSheet.absoluteFill}
    initialRegion={{ latitude: 52.3676, longitude: 4.9041, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
    scrollEnabled={false}        // non-interactive during ride (D-03)
    zoomEnabled={false}
    rotateEnabled={false}
    pitchEnabled={false}
  >
    {/* User location marker */}
    <Marker coordinate={mockUserLocation}>
      <View style={styles.userMarker} />
    </Marker>
  </MapView>

  {/* Floating top overlay card */}
  <View style={[styles.overlayCard, { top: insets.top + 8 }]}>
    <Text style={styles.timerText}>{timerDisplay}</Text>
    <Text style={styles.costText}>€{cost}</Text>
    {/* battery on right — use flexDirection: 'row', justifyContent: 'space-between' */}
  </View>

  {/* Bottom "End Ride" button */}
  <View style={[styles.endRideContainer, { bottom: insets.bottom + 16 }]}>
    <TouchableOpacity style={styles.endRideButton} onPress={handleEndRide}>
      <Text style={styles.endRideLabel}>End Ride</Text>
    </TouchableOpacity>
  </View>
</View>

// styles
overlayCard: {
  position: 'absolute',
  left: 16, right: 16,
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
```

**Note:** Do NOT use PrimaryButton for "End Ride" — it is themed green. Use a raw `TouchableOpacity` with explicit `backgroundColor: '#E53935'` per D-05. [VERIFIED: CONTEXT.md D-05]

---

## Pattern 3: RideStack Registration in RootNavigator (mirror BookingStack)

**What:** Add a `Stack.Screen` for `RideStack` as a sibling to `BookingStack` in `RootNavigator`. Order matters — both must be after the conditional auth/app block.

```typescript
// Source: [VERIFIED: RootNavigator.tsx — exact mirror of BookingStack]
import RideNavigator from './RideNavigator';

// Inside Stack.Navigator, after the conditional block:
<Stack.Screen
  name="RideStack"
  component={RideNavigator}
  options={{ presentation: 'modal', headerShown: false }}
/>
```

**TypeScript:** `RootStackParamList` must add `RideStack: NavigatorScreenParams<RideStackParamList>`.

---

## Pattern 4: AccountNavigator — Converting Flat Tab to Nested Stack

**What:** Create a `createStackNavigator<AccountStackParamList>()` navigator. Register it as `component` of the Account tab in `AppTabs`. Update `AppTabParamList.Account` from `undefined` to `NavigatorScreenParams<AccountStackParamList>`.

**Critical TypeScript change:**

```typescript
// Source: [VERIFIED: navigation.ts current state — Account: undefined]
// BEFORE (Phase 1-3):
export type AppTabParamList = {
  Map: undefined;
  Account: undefined;
};

// AFTER (Phase 4):
export type AppTabParamList = {
  Map: undefined;
  Account: NavigatorScreenParams<AccountStackParamList>;
};

export type AccountStackParamList = {
  AccountMain: undefined;
  RideHistory: undefined;
  PaymentMethods: undefined;
};

export type RideStackParamList = {
  ActiveRide: { bike: Bike };
  PaymentSummary: { rideSummary: RideSummary };
  RideReceipt: { paymentResult: PaymentResult; rideSummary: RideSummary };
};

// Update RootStackParamList:
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>;
  RideStack: NavigatorScreenParams<RideStackParamList>;  // NEW
};
```

**AccountNavigator.tsx:**

```typescript
// Source: [VERIFIED: BookingNavigator.tsx — mirror pattern]
import { createStackNavigator } from '@react-navigation/stack';
import type { AccountStackParamList } from '../types/navigation';
import AccountScreen from '../screens/app/AccountScreen';      // becomes AccountMain
import RideHistoryScreen from '../screens/app/RideHistoryScreen';
import PaymentMethodsScreen from '../screens/app/PaymentMethodsScreen';

const Stack = createStackNavigator<AccountStackParamList>();

export default function AccountNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AccountMain" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RideHistory" component={RideHistoryScreen} options={{ title: 'Ride History' }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment Methods' }} />
    </Stack.Navigator>
  );
}
```

**AppTabs.tsx change:**

```typescript
// Source: [VERIFIED: AppTabs.tsx lines 39-51 — replace AccountScreen with AccountNavigator]
import AccountNavigator from './AccountNavigator';
// ...
<Tab.Screen name="Account" component={AccountNavigator} ... />
```

---

## Pattern 5: Navigation from UnlockSuccessScreen to RideStack

**What:** `UnlockSuccessScreen` is inside `BookingStack`. `getParent()` from there reaches `BookingNavigator` (the stack navigator), NOT `RootNavigator`. The call must escape the BookingStack and navigate on the RootNavigator.

**Verified current stub code:**

```typescript
// Source: [VERIFIED: UnlockSuccessScreen.tsx line 45]
// CURRENT (Phase 3 stub):
onPress={() => navigation.getParent()?.goBack()}

// PHASE 4 REPLACEMENT:
onPress={() => navigation.getParent<any>()?.navigate('RideStack', {
  screen: 'ActiveRide',
  params: { bike },
})}
```

**Why `getParent<any>()`:** React Navigation's typed `getParent()` requires a type parameter specifying the parent's param list. Using `<any>` is the established project pattern (same pattern as MapScreen uses `useNavigation<StackNavigationProp<RootStackParamList>>()`). The parent IS RootNavigator because BookingStack is a direct child of RootNavigator's Stack.

**Does this also dismiss BookingStack?** Yes — navigating to a different sibling screen in `RootNavigator` causes React Navigation to push/replace the active modal. The BookingStack modal is dismissed automatically when RideStack becomes the active modal screen. [ASSUMED: standard React Navigation behavior for sibling modal stacks — needs verification during execution if double-modal appears]

---

## Pattern 6: Service Pattern — rideService and paymentService

**Exact mirror of bookingService.ts.** [VERIFIED: bookingService.ts lines 1-20]

```typescript
// src/types/ride.ts
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

```typescript
// src/services/rideService.ts
import type { ActiveRide, RideSummary } from '../types/ride';
import type { Bike } from '../types/bike';

export interface RideService {
  startRide(bike: Bike): Promise<ActiveRide>;
  endRide(rideId: string, bike: Bike, durationSec: number): Promise<RideSummary>;
  getRideHistory(): RideSummary[];
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const rideHistory: RideSummary[] = [];  // in-memory, resets on restart

const mockRideService: RideService = {
  async startRide(bike: Bike) {
    await delay(500);
    return {
      id: 'ride-' + Date.now(),
      bikeId: bike.id,
      bikeName: bike.name,
      startTime: new Date().toISOString(),
      batteryPct: bike.batteryPct,
      pricePerMin: bike.pricePerMin,
    };
  },
  async endRide(rideId: string, bike: Bike, durationSec: number) {
    await delay(500);
    const durationMin = durationSec / 60;
    const summary: RideSummary = {
      id: rideId,
      bikeId: bike.id,
      bikeName: bike.name,
      startTime: new Date(Date.now() - durationSec * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationMin,
      costEur: parseFloat((0.5 + durationMin * bike.pricePerMin).toFixed(2)),
      distanceKm: parseFloat((durationMin * 0.25).toFixed(1)), // ~15 km/h mock
    };
    rideHistory.unshift(summary);
    return summary;
  },
  getRideHistory() {
    return [...rideHistory];
  },
};

export const rideService: RideService = mockRideService;
```

```typescript
// src/types/payment.ts
export interface PaymentResult {
  id: string;
  amount: number;
  method: string;
  timestamp: string;
}
```

```typescript
// src/services/paymentService.ts
import type { RideSummary } from '../types/ride';
import type { PaymentResult } from '../types/payment';

export interface PaymentService {
  processPayment(summary: RideSummary): Promise<PaymentResult>;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const mockPaymentService: PaymentService = {
  async processPayment(summary: RideSummary) {
    await delay(1500);
    return {
      id: 'pay-' + Date.now(),
      amount: summary.costEur,
      method: 'Visa •••• 4242',
      timestamp: new Date().toISOString(),
    };
  },
};

export const paymentService: PaymentService = mockPaymentService;
```

---

## Pattern 7: AccountScreen Row Pattern (adding Ride History / Payment Methods)

**Verified from AccountScreen.tsx** — the existing Log Out row is the template:

```typescript
// Source: [VERIFIED: AccountScreen.tsx lines 39-50]
// New rows to add ABOVE the Log Out row, using the SAME style:
<TouchableOpacity
  style={styles.menuRow}         // same as logoutRow but textColor = textPrimary
  onPress={() => navigation.navigate('RideHistory')}
  activeOpacity={0.7}
>
  <View style={styles.menuRowLeft}>
    <MaterialCommunityIcons name="history" size={20} color={DSColors.textPrimary} />
    <Text style={styles.menuRowText}>Ride History</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>
```

**Navigation from AccountMain sub-screens:** `AccountScreen` (now `AccountMain`) uses `navigation` prop typed as `StackScreenProps<AccountStackParamList, 'AccountMain'>` — call `navigation.navigate('RideHistory')` directly (same stack, no getParent needed).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Timer drift correction | Decrement counter by 1 each tick | Compute from `Date.now() - startTime.current` | JS timers can fire late; absolute reference is drift-free [VERIFIED: BookingConfirmationScreen pattern] |
| Safe area bottom padding | Hardcode pixel values | `useSafeAreaInsets().bottom` | Varies across devices and notch shapes [VERIFIED: established pattern across all screens] |
| Absolute fill layout | Custom width/height = '100%' | `StyleSheet.absoluteFill` | Project-established pattern — absoluteFill (not absoluteFillObject) confirmed in Phase 3 [VERIFIED: STATE.md] |
| Navigation type narrowing | Cast navigation prop inline | `StackScreenProps<ParamList, 'ScreenName'>` | Ensures route.params is correctly typed at compile time [VERIFIED: all existing screens] |
| Mock delay | `new Promise(r => setTimeout(r, ms))` per file | Shared `const delay = (ms) => ...` at top of service file | DRY — exact pattern from bookingService.ts [VERIFIED] |

---

## Common Pitfalls

### Pitfall 1: `AppTabParamList.Account` type mismatch after AccountNavigator

**What goes wrong:** After switching `AppTabs` Account from `component={AccountScreen}` to `component={AccountNavigator}`, TypeScript errors appear: `Type 'undefined' is not assignable to type 'NavigatorScreenParams<AccountStackParamList>'`.

**Why it happens:** `AppTabParamList.Account` is currently `undefined`. Bottom-tab screen params must match the nested navigator's param list when a navigator is used as the component.

**How to avoid:** Update `navigation.ts` FIRST before touching `AppTabs.tsx`. Change `Account: undefined` to `Account: NavigatorScreenParams<AccountStackParamList>`. Run `npx tsc --noEmit` after the types file is saved to confirm zero errors before proceeding. [VERIFIED: navigation.ts lines 15-18]

**Warning signs:** TypeScript error on the `<Tab.Screen name="Account" ...>` line.

---

### Pitfall 2: getParent() depth from UnlockSuccessScreen

**What goes wrong:** `navigation.getParent()?.navigate('RideStack', ...)` is called but RideStack doesn't open. Or calling `goBack()` dismisses the wrong stack.

**Why it happens:** `UnlockSuccessScreen` is a screen inside `BookingNavigator` (a child stack). `navigation.getParent()` returns `BookingNavigator`'s navigator object. That object can only navigate within `BookingStackParamList`, not `RootStackParamList`. The first `getParent()` call from a BookingStack screen reaches the BookingStack's own navigator.

**How to avoid:** The code CONTEXT.md specifies is already correct: `navigation.getParent<any>()?.navigate('RideStack', ...)`. The `<any>` type cast bypasses the TypeScript constraint. Do not use `navigation.getParent()?.getParent()` (double hop) — BookingStack IS a direct child of RootNavigator, so one `getParent()` is enough. [VERIFIED: RootNavigator.tsx structure — BookingStack is direct child of RootNavigator Stack]

**Warning signs:** TypeScript error "Property 'navigate' does not exist on type X" — add `<any>` generic. Runtime: RideStack modal doesn't appear — check that RideStack is registered in RootNavigator before testing.

---

### Pitfall 3: "End Ride" navigates backward instead of forward

**What goes wrong:** Calling `navigation.goBack()` from ActiveRide instead of `navigation.navigate('PaymentSummary', ...)` would pop the screen. Since ActiveRide is the first screen in RideStack, `goBack()` would dismiss the entire RideStack.

**Why it happens:** D-02 says "no back button", but if navigation isn't wired carefully the "End Ride" tap could accidentally navigate backward.

**How to avoid:** Always use `navigation.navigate('PaymentSummary', { rideSummary })` — never `goBack()` from ActiveRide. Confirm in RideNavigator that `PaymentSummary` and `RideReceipt` are registered in the correct order. [VERIFIED: CONTEXT.md D-05, D-08]

---

### Pitfall 4: RideReceipt "Done" button — what does getParent() reach?

**What goes wrong:** `navigation.getParent()?.goBack()` from RideReceipt (inside RideStack inside RootNavigator) — does one `getParent()` dismiss the whole RideStack?

**Why it works:** RideReceipt is a screen in `RideNavigator`. `getParent()` from RideReceipt reaches `RideNavigator`'s parent, which is `RootNavigator`. Calling `goBack()` on the RootNavigator dismisses the modal (RideStack) and returns to AppTabs. This is IDENTICAL to how `BookingConfirmationScreen.handleClose` works today (`navigation.getParent()?.goBack()` — dismisses BookingStack back to AppTabs). [VERIFIED: BookingConfirmationScreen.tsx line 72]

**Warning signs:** If "Done" only pops one screen within RideStack rather than dismissing the whole modal — this means getParent() is targeting the wrong level. Check that RideNavigator IS a direct child of RootNavigator (same as BookingNavigator).

---

### Pitfall 5: Double-modal stacking when navigating BookingStack → RideStack

**What goes wrong:** Both BookingStack AND RideStack appear stacked as separate modals, and the user sees two layers of modal presentations.

**Why it happens:** React Navigation's modal presentation does not auto-dismiss a previous sibling modal when a new one is navigated to. The navigation call in UnlockSuccessScreen only navigates TO RideStack; it doesn't explicitly dismiss BookingStack.

**How to avoid:** Test this on device after wiring. If double-modal occurs, the fix is to call `navigation.getParent()?.goBack()` first (dismissing BookingStack) and then navigate to RideStack in the callback or via a brief `setTimeout(0)`. [ASSUMED: behavior may vary based on React Navigation version 7.x — verify at runtime]

**Warning signs:** During testing, if pressing "Start Ride" shows an animated slide-up on top of another slide-up, or if pressing "Done" on RideReceipt leaves BookingStack visible behind it.

---

### Pitfall 6: AccountScreen navigation prop type after wrapping in AccountStack

**What goes wrong:** `AccountScreen` (now `AccountMain`) is typed for bottom-tab navigation but needs stack navigation prop to call `navigation.navigate('RideHistory')`.

**Why it happens:** Currently `AccountScreen` is a direct tab screen (typed as `BottomTabNavigationProp<AppTabParamList>`). After wrapping in `AccountNavigator`, it becomes a stack screen with prop type `StackScreenProps<AccountStackParamList, 'AccountMain'>`.

**How to avoid:** Remove the implicit `useNavigation` hook if present (AccountScreen currently does NOT use `navigation` — confirmed it only uses `useAuthContext`). Add `navigation` prop via `StackScreenProps<AccountStackParamList, 'AccountMain'>` when adding the new rows. [VERIFIED: AccountScreen.tsx — no navigation prop today, uses only useAuthContext]

---

### Pitfall 7: setInterval memory leak if screen unmounts mid-ride

**What goes wrong:** Interval keeps firing after component unmounts (e.g., if app is backgrounded and navigation pops the screen unexpectedly).

**Why it happens:** setInterval without cleanup in useEffect return.

**How to avoid:** The cleanup pattern is already established and verified — return `() => clearInterval(interval)` from the `useEffect`. [VERIFIED: BookingConfirmationScreen.tsx lines 50-58]

---

## Runtime State Inventory

> This phase is NOT a rename/refactor — no runtime state inventory needed.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| react-native-maps | ActiveRide MapView | yes | 1.27.2 | — |
| @react-navigation/stack | RideNavigator, AccountNavigator | yes | ^7.10.22 | — |
| expo-location | Mock coords (Amsterdam fallback already coded) | yes | ~57.0.11 | Amsterdam mock coords in MapScreen already |
| react-native-safe-area-context | useSafeAreaInsets | yes | ^5.9.0 | — |
| MaterialCommunityIcons | check-circle, battery, history, credit-card icons | yes | @expo/vector-icons ^15.0.2 | — |

All dependencies are available. No new installs required.

---

## Code Examples

### Full navigation.ts additions (complete diff)

```typescript
// Source: [VERIFIED: navigation.ts — current state + required additions]
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { Bike } from './bike';
import type { RideSummary } from './ride';       // NEW
import type { PaymentResult } from './payment';  // NEW

// NEW types
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

// MODIFIED types
export type AppTabParamList = {
  Map: undefined;
  Account: NavigatorScreenParams<AccountStackParamList>;  // was: undefined
};

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>;
  RideStack: NavigatorScreenParams<RideStackParamList>;  // NEW
};

// NEW nav props
export type RideNavProp = StackNavigationProp<RideStackParamList>;
export type AccountNavProp = StackNavigationProp<AccountStackParamList>;
```

### RideHistoryScreen FlatList + empty state

```typescript
// Source: [VERIFIED: CONTEXT.md D-15 + established FlatList patterns]
import { FlatList } from 'react-native';
import { rideService } from '../../services/rideService';
import type { RideSummary } from '../../types/ride';

const rides = rideService.getRideHistory();  // sync — in-memory array

// Each row renders: date, bike name, duration MM:SS, cost €X.XX
// Empty state: <View><Text>No rides yet — your completed rides will appear here.</Text></View>
```

### PaymentSummary cost breakdown

```typescript
// Source: [VERIFIED: CONTEXT.md D-08]
// Base fare: €0.50
// Per-minute: durationMin * pricePerMin
// Total: costEur (already computed in rideService.endRide)
const baseFare = 0.50;
const perMinCharge = rideSummary.costEur - baseFare;
// Display as: "Base fare: €0.50" / "Per-minute: €X.XX" / "Total: €X.XX"
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-----------------|--------------|--------|
| Flat tab screens only | Tab screen wraps a stack navigator | Phase 4 (Account tab) | `AppTabParamList.Account` must use `NavigatorScreenParams<>` not `undefined` |
| Single modal stack (BookingStack) | Two sibling modal stacks (BookingStack + RideStack) | Phase 4 | Both registered as siblings in RootNavigator after conditional block |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `navigation.getParent<any>()?.navigate('RideStack', ...)` from UnlockSuccessScreen targets RootNavigator (not BookingNavigator) | Pattern 5 / Pitfall 2 | If wrong: navigation call silently fails; fix by adding .getParent() call chain |
| A2 | Navigating from BookingStack to RideStack auto-dismisses BookingStack (single modal visible at a time) | Pitfall 5 | If wrong: double-modal stacking appears; fix: explicit dismiss before navigate |
| A3 | Mock distance formula `durationMin * 0.25 km/min` (approx 15 km/h) is acceptable for a mock | Pattern 6 / rideService | If wrong: planner can choose a static 1.2 km value instead |

---

## Open Questions (RESOLVED)

1. **BookingStack dismiss race condition when navigating to RideStack**
   - What we know: Both stacks are siblings in RootNavigator with modal presentation
   - What's unclear: Whether React Navigation 7.x automatically dismisses the previous modal or stacks them
   - RESOLVED: Implement with current CONTEXT.md D-01 approach (`getParent<any>()?.navigate('RideStack', ...)`). Pitfall 5 mitigation (explicit dismiss before navigate if double-modal is observed) is documented in plans and can be applied at runtime if needed. No blocker — verify during testing.

2. **AccountScreen navigation prop type**
   - What we know: AccountScreen currently has no `navigation` prop (uses only useAuthContext)
   - What's unclear: Whether to add `StackScreenProps<AccountStackParamList, 'AccountMain'>` to existing component signature or use `useNavigation` hook
   - RESOLVED: Add `navigation` prop via `StackScreenProps<AccountStackParamList, 'AccountMain'>` — consistent with all other screens in the project. Plan 04-03 Task 1 implements this explicitly.

---

## Validation Architecture

> `nyquist_validation: false` in config.json — section skipped per workflow config.

---

## Security Domain

> This phase adds no authentication, API calls, sensitive data storage, or network communication. All services are in-memory mocks. No ASVS controls apply.

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: VoltVenture/src/navigation/RootNavigator.tsx] — BookingStack registration pattern confirmed
- [VERIFIED: VoltVenture/src/navigation/AppTabs.tsx] — Account tab current structure confirmed
- [VERIFIED: VoltVenture/src/navigation/BookingNavigator.tsx] — navigator mirror pattern confirmed
- [VERIFIED: VoltVenture/src/types/navigation.ts] — current type definitions confirmed
- [VERIFIED: VoltVenture/src/screens/booking/BookingConfirmationScreen.tsx] — setInterval pattern, getParent().goBack() pattern
- [VERIFIED: VoltVenture/src/screens/booking/UnlockSuccessScreen.tsx] — "Start Ride" stub line 45 confirmed
- [VERIFIED: VoltVenture/src/screens/app/AccountScreen.tsx] — row pattern, no navigation prop today
- [VERIFIED: VoltVenture/src/screens/app/MapScreen.tsx] — StyleSheet.absoluteFill + MapView pattern
- [VERIFIED: VoltVenture/src/services/bookingService.ts] — service singleton pattern
- [VERIFIED: VoltVenture/src/types/booking.ts] — type file structure
- [VERIFIED: VoltVenture/src/types/bike.ts] — Bike interface (pricePerMin, batteryPct fields)
- [VERIFIED: VoltVenture/src/theme/theme.ts] — DSColors, DSTypography tokens
- [VERIFIED: VoltVenture/src/components/common/PrimaryButton.tsx] — PrimaryButton API
- [VERIFIED: VoltVenture/package.json] — all dependencies versions confirmed
- [VERIFIED: .planning/phases/04-active-ride-and-payment/04-CONTEXT.md] — all locked decisions

### Secondary (MEDIUM confidence)
- [CITED: .planning/STATE.md] — StyleSheet.absoluteFill vs absoluteFillObject decision note
- [CITED: .planning/phases/03-booking-and-unlock/03-01-SUMMARY.md] — BookingStack established patterns

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified in package.json; no new installs
- Navigation patterns: HIGH — all mirror verified existing code in codebase
- Timer pattern: HIGH — exact code verified in BookingConfirmationScreen
- getParent() chain depth: HIGH — verified from RootNavigator + BookingNavigator structure
- AccountNavigator type change: HIGH — current navigation.ts read and diff is explicit
- Pitfalls: HIGH for code-derived pitfalls; MEDIUM for runtime behavior (double-modal)

**Research date:** 2026-08-18
**Valid until:** 2026-09-18 (stable React Navigation 7.x — no fast-moving changes expected)
