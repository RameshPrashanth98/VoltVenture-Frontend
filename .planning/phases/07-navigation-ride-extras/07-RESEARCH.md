# Phase 7: Navigation & Ride Extras — Research

**Researched:** 2026-08-19
**Domain:** React Native navigation, react-native-maps Polyline, modal stack composition
**Confidence:** HIGH — all findings verified against installed codebase files

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**D-01:** BikeDetailSheet gets a secondary "Get Directions" button placed below the existing "Book Bike" primary CTA. "Book Bike" remains dominant.
**D-02:** Tapping "Get Directions" opens a new NavStack modal (`presentation: 'modal'`, `headerShown: false`) from RootNavigator. NavStackParamList screens: `NavigateToBike: { bike: Bike }` → `WalkingDirections: { bike: Bike }`.
**D-03:** NavigateToBike screen layout: MapView fills full screen. Floating ETA card (semi-transparent dark background) pinned at top. Map is non-interactive.
**D-04:** WalkingDirections shows a FlatList of 3–5 mock hardcoded turn-by-turn steps with direction icons and distance label.
**D-05:** SafetyMount is inserted as the first screen in RideStack (before ActiveRide). Updated RideStack order: `SafetyMount: { bike: Bike }` → `ActiveRide: { bike: Bike }` → `PaymentSummary` → `RideReceipt`. UnlockSuccessScreen "Start Ride" CTA navigates to `RideStack/SafetyMount` instead of `RideStack/ActiveRide`.
**D-06:** SafetyMount shows 4 interactive checklist items. "Start Ride" PrimaryButton is disabled until all 4 are checked. Tapping "Start Ride" navigates to ActiveRide.
**D-07:** RideReceipt gets a secondary "Find a Charging Station" CTA. Tapping dismisses RideStack (`navigation.getParent()?.goBack()`) then opens ChargeStack modal.
**D-08:** EndRideFindCharging shows MapView centered on mock Amsterdam coords. 3–5 mock charger pins. Tapping a pin shows info card with "Navigate Here" CTA.
**D-09:** RidingToCharging reuses the exact same screen pattern as NavigateToBike.
**D-10:** Route polyline: 3–4 hardcoded intermediate waypoints. Rendered with react-native-maps `<Polyline>`.
**D-11:** ETA formula: `Math.round(haversineKm(userLat, userLon, destLat, destLon) / 5 * 60)` minutes. Distance: `(haversineKm * 1000).toFixed(0)` meters.
**D-12:** Polyline style: `strokeColor: '#C6FF2D'`, `strokeWidth: 4`.

### Claude's Discretion

- Exact mock waypoint coordinates for each route (Amsterdam street-plausible intermediate coords)
- MaterialCommunityIcons icon name for charger pins (`ev-station` per UI-SPEC)
- Whether NavStack and ChargeStack are two separate modal stacks or share one — CONTEXT says separate, named `NavStack` and `ChargeStack`
- Direction icons for WalkingDirections step types
- Exact mock charger station names and coordinates (provided in UI-SPEC)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | User can navigate to a selected bike on foot (map + route + ETA) | NavigateToBike screen: full-screen MapView, Polyline, ETA card. haversineKm reused. |
| NAV-02 | User can view turn-by-turn walking directions to the bike | WalkingDirections screen: FlatList of mock steps with MCI direction icons. |
| RIDE-05 | Safety checklist screen before mounting | SafetyMount screen: 4-item checklist, PrimaryButton disabled until all checked, inserted as first RideStack screen. |
| RIDE-06 | After ride, user can find nearby charging stations on a map | EndRideFindCharging screen: MapView + charger Marker components + info card on tap. |
| RIDE-07 | User can navigate to a charging station with a live map route | RidingToCharging screen: same pattern as NavigateToBike — MapView + Polyline + ETA card. |
</phase_requirements>

---

## Summary

Phase 7 adds 5 new screens (NavigateToBike, WalkingDirections, SafetyMount, EndRideFindCharging, RidingToCharging), 2 new modal stacks (NavStack, ChargeStack) in RootNavigator, and minimal edits to 3 existing files (BikeDetailSheet, UnlockSuccessScreen, RideReceiptScreen).

All required libraries are already installed: `react-native-maps` 1.27.2 (provides `Polyline` as named export), `@react-navigation/stack` ^7, `expo-location` ~57, `@expo/vector-icons` ^15. No new packages are needed.

The phase is dominated by screen composition using patterns already established in the codebase: full-screen MapView with `StyleSheet.absoluteFill` (ActiveRideScreen pattern), floating overlay card at `top: insets.top + 8` (ActiveRideScreen), custom header row with back button + centered title + `width: 40` spacer (Phase 6 screens), and `createStackNavigator` modal stacks (BookingNavigator / RideNavigator pattern).

**Primary recommendation:** Copy-paste from ActiveRideScreen for map screens. Copy-paste from BookingNavigator for the two new navigators. All decisions are locked — zero ambiguity remains.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Walking route display (Polyline) | Frontend Client (RN) | — | All map rendering is client-side; mock coords are hardcoded |
| ETA calculation | Frontend Client (RN) | — | haversineKm is a pure function; computed at render time |
| Safety checklist state | Frontend Client (RN) | — | UI-local `useState` array, no persistence needed |
| Modal navigation stack | Navigation Layer (RN) | — | NavStack + ChargeStack are RootNavigator children |
| Charger info card state | Frontend Client (RN) | — | `selectedCharger` state in EndRideFindCharging, no service call |
| Mock charger data | Hardcoded constants | — | Frontend-only phase; no service layer needed |

---

## Standard Stack

### Core (all already installed — NO new installs)

| Library | Installed Version | Purpose | Verification |
|---------|-------------------|---------|--------------|
| `react-native-maps` | 1.27.2 | MapView, Marker, Polyline | [VERIFIED: node_modules/react-native-maps/src/index.ts line 15 — `export {default as Polyline, MapPolyline} from './MapPolyline'`] |
| `@react-navigation/stack` | ^7.10.22 | createStackNavigator for NavStack + ChargeStack | [VERIFIED: package.json] |
| `@react-navigation/native` | ^7.3.16 | useNavigation, NavigatorScreenParams | [VERIFIED: package.json] |
| `@expo/vector-icons` | ^15.0.2 | MaterialCommunityIcons (direction icons, charger pin, checklist icons) | [VERIFIED: package.json] |
| `expo-location` | ~57.0.11 | Location.requestForegroundPermissionsAsync (mock fallback used) | [VERIFIED: package.json] |
| `react-native-safe-area-context` | ^5.9.0 | useSafeAreaInsets for ETA card top offset and button bottom offset | [VERIFIED: package.json] |
| `react-native-paper` | ^5.15.3 | PrimaryButton (wraps Paper Button) — SafetyMount "Start Ride", charger "Navigate Here" | [VERIFIED: package.json] |

### No New Packages Required

This phase installs zero new packages. All dependencies were established in Phases 1-4.

---

## Package Legitimacy Audit

No new packages are introduced in this phase. All libraries used are already installed and in active use across existing screens.

**Packages removed due to slopcheck:** none
**Packages flagged as suspicious:** none

---

## Architecture Patterns

### System Architecture Diagram

```
BikeDetailSheet
  └─[Get Directions tap]──► RootNavigator: NavStack (presentation:modal)
                               ├── NavigateToBike { bike }
                               │     └─[View Turn-by-Turn]──► WalkingDirections { bike }
                               └── [swipe down] dismisses NavStack

UnlockSuccessScreen
  └─[Start Ride tap]──────► RootNavigator: RideStack (presentation:modal)
                               ├── SafetyMount { bike }  ← NEW first screen
                               │     └─[all checked → Start Ride]──► ActiveRide { bike }
                               ├── ActiveRide { bike }
                               ├── PaymentSummary { rideSummary }
                               └── RideReceipt { paymentResult, rideSummary }
                                     └─[Find a Charging Station tap]
                                           └─ getParent()?.goBack() + setTimeout(300ms)
                                                 └──► ChargeStack (presentation:modal)
                                                        ├── EndRideFindCharging
                                                        │     └─[Navigate Here]──► RidingToCharging { chargerName, location }
                                                        └── [close button] getParent()?.goBack()
```

### Recommended Project Structure

```
src/
├── navigation/
│   ├── RootNavigator.tsx      ← add NavStack + ChargeStack registrations
│   ├── RideNavigator.tsx      ← add SafetyMount as first screen
│   ├── NavNavigator.tsx       ← NEW: NavigateToBike + WalkingDirections
│   ├── ChargeNavigator.tsx    ← NEW: EndRideFindCharging + RidingToCharging
│   └── [existing navigators unchanged]
├── screens/
│   ├── navigation/            ← NEW folder
│   │   ├── NavigateToBikeScreen.tsx
│   │   └── WalkingDirectionsScreen.tsx
│   ├── charging/              ← NEW folder (or: keep under ride/)
│   │   ├── EndRideFindChargingScreen.tsx
│   │   └── RidingToChargingScreen.tsx
│   ├── ride/
│   │   ├── SafetyMountScreen.tsx   ← NEW (lives here — it is a ride-flow screen)
│   │   ├── ActiveRideScreen.tsx    ← unchanged
│   │   ├── PaymentSummaryScreen.tsx
│   │   └── RideReceiptScreen.tsx   ← minor edit
│   └── [other existing folders unchanged]
├── types/
│   └── navigation.ts          ← add NavStackParamList, ChargeStackParamList, SafetyMount to RideStack
└── components/
    └── map/
        └── BikeDetailSheet.tsx ← minor edit: add secondary button
```

**Folder convention note:** Existing screens are organised by flow domain (`ride/`, `booking/`, `auth/`, `app/`). New navigation screens should live in `screens/navigation/`. Charging screens could live under `screens/ride/` (ride-flow continuation) or a dedicated `screens/charging/` folder. Either is acceptable — pick one and be consistent across the two plans that create these screens.

### Pattern 1: Full-Screen Map with Floating Overlay Card

**What:** `StyleSheet.absoluteFill` on both root View and MapView, with absolutely-positioned overlay card at `top: insets.top + 8`.
**When to use:** NavigateToBike, RidingToCharging (and EndRideFindCharging for the close button).

**Exact pattern from ActiveRideScreen.tsx (lines 79-131):**
```typescript
// Source: VoltVenture/src/screens/ride/ActiveRideScreen.tsx
return (
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

    {/* Top overlay card */}
    <View style={[styles.overlayCard, { top: insets.top + 8 }]}>
      {/* content */}
    </View>

    {/* Bottom action */}
    <View style={[styles.endRideContainer, { bottom: insets.bottom + 16 }]}>
      {/* CTA */}
    </View>
  </View>
);

// overlayCard style from ActiveRideScreen:
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
userMarker: {
  width: 16, height: 16, borderRadius: 8,
  backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: DSColors.primary,
},
```

### Pattern 2: Polyline from react-native-maps

**What:** Named export `Polyline` from `react-native-maps`, rendered as a child of `<MapView>`.
**When to use:** NavigateToBike and RidingToCharging for the mock walking route.

```typescript
// Source: node_modules/react-native-maps/src/index.ts — confirmed export
import MapView, { Marker, Polyline } from 'react-native-maps';

// Usage inside <MapView>:
<Polyline
  coordinates={[
    { latitude: 52.3676, longitude: 4.9041 },  // user
    { latitude: 52.3690, longitude: 4.9020 },  // waypoint 1
    { latitude: 52.3710, longitude: 4.9005 },  // waypoint 2
    { latitude: bike.latitude, longitude: bike.longitude }, // destination
  ]}
  strokeColor="#C6FF2D"
  strokeWidth={4}
/>
```

### Pattern 3: Modal Stack Navigator

**What:** `createStackNavigator` with `presentation: 'modal'`, `headerShown: false`. Mirrors BookingNavigator/RideNavigator exactly.
**When to use:** NavNavigator, ChargeNavigator.

```typescript
// Source: VoltVenture/src/navigation/BookingNavigator.tsx — exact pattern to copy
const Stack = createStackNavigator<NavStackParamList>();

export default function NavNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NavigateToBike" component={NavigateToBikeScreen} />
      <Stack.Screen name="WalkingDirections" component={WalkingDirectionsScreen} />
    </Stack.Navigator>
  );
}
```

Registration in RootNavigator (mirrors lines 33-43 of RootNavigator.tsx):
```typescript
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
```

### Pattern 4: Custom Header Row

**What:** Manual header `View` with back arrow, centered title, `width: 40` spacer. Used on light-surface screens with SafeAreaView root.
**When to use:** WalkingDirections, SafetyMount.

```typescript
// Source: established in Phase 6 (LoginSecurityScreen, SettingsScreen)
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
    <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Walking Directions</Text>
  <View style={{ width: 40 }} />
</View>

// header style:
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: DSColors.border,
  height: 56,
},
headerTitle: {
  ...DSTypography.headingMd,
  color: DSColors.textPrimary,
},
```

### Pattern 5: RideStack First Screen Change

**What:** SafetyMount replaces ActiveRide as the first screen in RideStackParamList and RideNavigator.
**When to use:** SafetyMount plan (07-02).

The type change (navigation.ts):
```typescript
// Before:
export type RideStackParamList = {
  ActiveRide: { bike: Bike };
  PaymentSummary: { rideSummary: RideSummary };
  RideReceipt: { paymentResult: PaymentResult; rideSummary: RideSummary };
};

// After — SafetyMount added as first entry:
export type RideStackParamList = {
  SafetyMount: { bike: Bike };    // ← NEW, first
  ActiveRide: { bike: Bike };
  PaymentSummary: { rideSummary: RideSummary };
  RideReceipt: { paymentResult: PaymentResult; rideSummary: RideSummary };
};
```

The navigator change (RideNavigator.tsx) — add SafetyMount as first `Stack.Screen`:
```typescript
import SafetyMountScreen from '../screens/ride/SafetyMountScreen'; // ← NEW import

<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="SafetyMount" component={SafetyMountScreen} /> {/* ← NEW */}
  <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
  <Stack.Screen name="PaymentSummary" component={PaymentSummaryScreen} />
  <Stack.Screen name="RideReceipt" component={RideReceiptScreen} />
</Stack.Navigator>
```

### Anti-Patterns to Avoid

- **NativeWind on map screens:** Do NOT use NativeWind className props on NavigateToBike, EndRideFindCharging, or RidingToCharging. Use `StyleSheet.create` + DSColors. (Established project rule — NativeWind causes layout issues on full-screen map screens.)
- **Polyline outside MapView:** `<Polyline>` must be a direct child of `<MapView>`, not placed in the overlay View layer.
- **navigation.navigate vs navigation.push:** On map screens within NavStack, use `navigation.push('WalkingDirections', { bike })` to always push a new instance, not `navigate` which would reuse an existing one.
- **Forgetting getParent() for cross-stack navigation:** From within BookingStack screens, `navigation.getParent()?.navigate('RideStack', ...)` is required (as already done in UnlockSuccessScreen line 45). Same pattern for ChargeStack from within RideStack.
- **Missing setTimeout on sequential dismiss+navigate:** RideReceiptScreen's "Find a Charging Station" must use `setTimeout(() => navigation.navigate('ChargeStack', ...), 300)` after `navigation.getParent()?.goBack()` to avoid navigating into a stack that is still mid-dismiss-animation.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Route polyline | Custom SVG overlay or Canvas drawing | `<Polyline>` from `react-native-maps` | Already installed; handles coordinate-to-pixel projection automatically |
| Distance calculation | Custom great-circle formula | `haversineKm()` in MapScreen.tsx | Already exists — inline the function body (it is NOT exported; see critical finding below) |
| Safe-area padding | Manual platform checks (StatusBar.currentHeight etc.) | `useSafeAreaInsets()` from `react-native-safe-area-context` | Already used in ActiveRideScreen, UnlockSuccessScreen, RideReceiptScreen |
| Direction list | Custom scroll container | `FlatList` with hardcoded data array | Simplest correct approach for a static mock list |

---

## Critical Findings (Exact Current State)

### 1. haversineKm is NOT exported from MapScreen.tsx

**Finding:** `haversineKm` is defined on **line 18** of `MapScreen.tsx` as a **module-private function** — it has no `export` keyword.

```typescript
// MapScreen.tsx line 18 — NOT exported:
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
```

**Impact:** New screens (NavigateToBike, RidingToCharging, EndRideFindCharging) CANNOT import `haversineKm` from MapScreen. Two options:
- **Option A (recommended):** Inline the function body directly in each new screen file — it is 10 lines and self-contained.
- **Option B:** Extract to a shared utility `src/utils/haversineKm.ts` and update MapScreen to import from there.

The CONTEXT.md says "reuse the haversineKm function already defined in MapScreen.tsx" — this means the intent is to reuse the logic, not necessarily the import. Option A (inline) is lowest-risk and consistent with the "no refactoring outside phase scope" convention.

### 2. navigation.ts — Exact current state

File: `VoltVenture/src/types/navigation.ts`

Current `RootStackParamList` (lines 49-54):
```typescript
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>;
  RideStack: NavigatorScreenParams<RideStackParamList>;
};
```

Must add:
```typescript
NavStack: NavigatorScreenParams<NavStackParamList>;
ChargeStack: NavigatorScreenParams<ChargeStackParamList>;
```

New param lists to add:
```typescript
export type NavStackParamList = {
  NavigateToBike: { bike: Bike };
  WalkingDirections: { bike: Bike };
};

export type ChargeStackParamList = {
  EndRideFindCharging: undefined;
  RidingToCharging: { chargerName: string; location: { latitude: number; longitude: number } };
};
```

No new type imports needed — `Bike` is already imported on line 4.

### 3. RootNavigator.tsx — Exact current state

File: `VoltVenture/src/navigation/RootNavigator.tsx`

Current Stack.Screen registrations (lines 20-43): AuthStack (conditional), AppTabs (conditional), BookingStack (modal), RideStack (modal).

Must add after RideStack:
```typescript
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
```

New imports needed: `NavNavigator` and `ChargeNavigator`.

### 4. RideNavigator.tsx — Exact current state

Current screens (lines 13-17): `ActiveRide`, `PaymentSummary`, `RideReceipt`.

Must add `SafetyMount` as the first `Stack.Screen` and import `SafetyMountScreen`.

### 5. BikeDetailSheet.tsx — Exact current state

Current interface (lines 9-12):
```typescript
interface BikeDetailSheetProps {
  bike: Bike | null;
  onReserve: () => void;
}
```

Current JSX structure: handle → bikeName → bikeType → chipsRow → `<PrimaryButton label="Reserve" onPress={onReserve} />`.

**What to add:** A secondary `TouchableOpacity` below `PrimaryButton`. The `bike` object is already available in the component. Navigation call requires a `navigation` prop or `useNavigation()`. Since BikeDetailSheet is not a screen, use `useNavigation<StackNavigationProp<RootStackParamList>>()` — same hook MapScreen uses (already imported in the codebase via `import { useNavigation } from '@react-navigation/native'`).

The "Get Directions" action also needs to dismiss the bottom sheet before navigating. The `BottomSheetModal.dismiss()` is called in MapScreen via `bikeDetailRef.current?.dismiss()` in the `onReserve` callback. BikeDetailSheet doesn't own the ref — MapScreen does. Two patterns:
- **Option A:** Add an `onGetDirections` callback prop to `BikeDetailSheetProps` (mirroring `onReserve`) and call both dismiss + navigate from MapScreen — clean separation.
- **Option B:** Call `useNavigation()` inside BikeDetailSheet and handle both dismiss and navigate there — requires passing a dismiss callback or using `@gorhom/bottom-sheet`'s `useBottomSheetModal()` hook.

The UI-SPEC says: "On press: dismiss bottom sheet → `navigation.navigate('NavStack', { screen: 'NavigateToBike', params: { bike } })`". Option A (callback prop, same as onReserve) is cleanest and consistent with existing code.

### 6. UnlockSuccessScreen.tsx — Exact line to change

Line 45:
```typescript
// Before:
onPress={() => navigation.getParent<any>()?.navigate('RideStack', { screen: 'ActiveRide', params: { bike } })}

// After:
onPress={() => navigation.getParent<any>()?.navigate('RideStack', { screen: 'SafetyMount', params: { bike } })}
```

No other changes to this file.

### 7. RideReceiptScreen.tsx — Exact current state

Current "Done" button (lines 79-82):
```typescript
<PrimaryButton
  label="Done"
  onPress={() => navigation.getParent()?.goBack()}
/>
```

The "Done" button already uses `navigation.getParent()?.goBack()` to dismiss RideStack. Add below it:
```typescript
<TouchableOpacity
  onPress={() => {
    navigation.getParent()?.goBack();
    setTimeout(() => {
      // navigation here is scoped to RideStack — need RootNavigator reference
      // Use navigation.getParent()?.navigate() after goBack settles
    }, 300);
  }}
>
```

**Important navigation scoping issue:** After `navigation.getParent()?.goBack()` dismisses RideStack, the `navigation` object from `StackScreenProps<RideStackParamList, 'RideReceipt'>` is no longer valid (the stack is gone). The `ChargeStack` navigate call must be made on the parent navigator. Pattern:

```typescript
const parent = navigation.getParent();
parent?.goBack(); // dismiss RideStack
setTimeout(() => {
  parent?.navigate('ChargeStack', { screen: 'EndRideFindCharging' });
}, 300);
```

This is safe because `parent` is captured before goBack() and refers to the RootNavigator which persists.

### 8. Folder for new screens

Confirmed existing `src/screens/` subfolders: `app/`, `auth/`, `booking/`, `ride/`.

- `SafetyMountScreen.tsx` → `src/screens/ride/` (it is a ride-flow screen, flows into ActiveRide)
- `NavigateToBikeScreen.tsx`, `WalkingDirectionsScreen.tsx` → `src/screens/navigation/` (new folder, distinct flow)
- `EndRideFindChargingScreen.tsx`, `RidingToChargingScreen.tsx` → `src/screens/charging/` (new folder — post-ride flow, distinct from active ride)

### 9. Polyline — confirmed importable

`Polyline` is exported from `react-native-maps` v1.27.2 as a named export (confirmed from `node_modules/react-native-maps/src/index.ts` line 15). Import pattern:

```typescript
import MapView, { Marker, Polyline } from 'react-native-maps';
```

---

## Common Pitfalls

### Pitfall 1: haversineKm Not Exported

**What goes wrong:** Developer writes `import { haversineKm } from '../../screens/app/MapScreen'` — TypeScript error, no export.
**Why it happens:** The function is file-private in MapScreen.tsx (no `export` keyword).
**How to avoid:** Inline the function body in each new screen file, OR create `src/utils/geo.ts` and export from there (requires also updating MapScreen — adds scope).
**Warning signs:** TS error "Module has no exported member 'haversineKm'".

### Pitfall 2: Polyline as Sibling of MapView (not child)

**What goes wrong:** Placing `<Polyline>` outside `<MapView>` in the absolute-positioned overlay layer — Polyline will not render or will appear in wrong position.
**Why it happens:** The absoluteFill layout makes both MapView and overlay Views look like siblings at the same level.
**How to avoid:** Always place `<Marker>` and `<Polyline>` as direct JSX children inside `<MapView>`.

### Pitfall 3: ChargeStack navigate called while RideStack is mid-dismiss

**What goes wrong:** Calling `navigation.navigate('ChargeStack', ...)` immediately after `goBack()` → React Navigation throws "Couldn't find a navigator with the name 'ChargeStack'" or the animation glitches.
**Why it happens:** `goBack()` starts an async dismiss animation; the parent navigator may not be ready to receive a new navigate call for ~200-300ms.
**How to avoid:** Use `setTimeout(() => parent?.navigate('ChargeStack', ...), 300)` as specified in UI-SPEC.

### Pitfall 4: Missing `tracksViewChanges: false` on Custom Markers

**What goes wrong:** Custom marker Views (charger pins with icons) cause performance degradation on Android as they re-render continuously.
**Why it happens:** Default `tracksViewChanges: true` forces native layer to watch the marker View for changes.
**How to avoid:** Add `tracksViewChanges={false}` to every `<Marker>` with a custom `View` child. Already used in MapScreen.tsx (line 133).

### Pitfall 5: SafetyMount Back Navigation Pops Entire RideStack

**What goes wrong:** User presses back on SafetyMount and the entire RideStack modal dismisses (instead of going back to UnlockSuccess within BookingStack).
**Why it happens:** SafetyMount is the FIRST screen in RideStack. `navigation.goBack()` from the first screen of a modal stack dismisses the entire modal.
**How to avoid:** This is actually the CORRECT behavior per D-05. The header back arrow on SafetyMount should call `navigation.goBack()` which correctly pops RideStack and returns to BookingStack/UnlockSuccess. No special handling needed — this is the intended UX (user can cancel the ride start by going back).

### Pitfall 6: TypeScript Error on `navigation.navigate('NavStack', ...)` from BikeDetailSheet

**What goes wrong:** `useNavigation()` in BikeDetailSheet returns `NavigationProp<RootStackParamList>` but TypeScript complains if NavStack is not yet in `RootStackParamList`.
**Why it happens:** navigation.ts must be updated BEFORE the BikeDetailSheet change is authored.
**How to avoid:** The navigation types update (07-01's first task) must happen before any screen or component is written.

---

## Code Examples

### haversineKm — copy this function body

```typescript
// Source: VoltVenture/src/screens/app/MapScreen.tsx lines 18-29 — inline copy
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

### ETA calculation (D-11)

```typescript
const distanceKm = haversineKm(userLat, userLon, destLat, destLon);
const etaMin = Math.round(distanceKm / 5 * 60);    // 5 km/h walking
const distanceM = Math.round(distanceKm * 1000);   // meters
// Display: `${etaMin} min walk — ${distanceM} m`
```

### SafetyMount checklist state pattern

```typescript
const CHECKLIST_ITEMS = [
  { id: 1, label: 'Helmet secured', icon: 'helmet' },
  { id: 2, label: 'Brakes tested', icon: 'car-brake-hold' },
  { id: 3, label: 'Lights working', icon: 'lightbulb-on' },
  { id: 4, label: 'App tracking active', icon: 'map-marker-check' },
] as const;

const [checked, setChecked] = useState<Set<number>>(new Set());

const toggleItem = (id: number) => {
  setChecked(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};

const allChecked = checked.size === CHECKLIST_ITEMS.length;
// PrimaryButton: disabled={!allChecked}
// On press: navigation.navigate('ActiveRide', { bike })
```

### Charger info card state pattern (EndRideFindCharging)

```typescript
const [selectedCharger, setSelectedCharger] = useState<ChargerStation | null>(null);

// On Marker press:
onPress={() => setSelectedCharger(charger)}

// On empty map area press (MapView onPress):
// Note: react-native-maps MapView onPress fires when non-marker area is tapped
<MapView onPress={() => setSelectedCharger(null)}>

// Info card (conditional render):
{selectedCharger && (
  <View style={[styles.infoCard, { bottom: insets.bottom + 16 }]}>
    <Text>{selectedCharger.name}</Text>
    <Text>{Math.round(haversineKm(...) * 1000)} m away</Text>
    <PrimaryButton
      label="Navigate Here"
      onPress={() => navigation.push('RidingToCharging', {
        chargerName: selectedCharger.name,
        location: { latitude: selectedCharger.latitude, longitude: selectedCharger.longitude },
      })}
    />
  </View>
)}
```

### Mock charger data (from UI-SPEC)

```typescript
type ChargerStation = {
  name: string;
  latitude: number;
  longitude: number;
};

const MOCK_CHARGERS: ChargerStation[] = [
  { name: 'VoltHub Central',       latitude: 52.3731, longitude: 4.8936 },
  { name: 'Dam Square Charger',    latitude: 52.3728, longitude: 4.8936 },
  { name: 'Waterlooplein Station', latitude: 52.3678, longitude: 4.9006 },
  { name: 'Leidseplein EV Point',  latitude: 52.3638, longitude: 4.8831 },
  { name: 'Vondelpark Charge Bay', latitude: 52.3580, longitude: 4.8688 },
];
```

---

## Project Constraints (from CLAUDE.md)

All CLAUDE.md directives that apply to this phase:

| Directive | Impact on Phase 7 |
|-----------|-------------------|
| All UI components must use Volt Venture Design System tokens (colors, typography, spacing) | Use DSColors.primary, DSTypography, DSColors.accent, etc. — confirmed token set is in theme.ts |
| Use React Native Paper components as the base; extend with NativeWind utility classes | PrimaryButton (wraps Paper Button) for "Start Ride" and "Navigate Here". StyleSheet.create for map screens (not NativeWind) |
| Frontend only — backend calls are mocked/stubbed | All location, charger data, waypoints are hardcoded. No service calls for new screens. |
| Each phase scope is revealed by the user; do not add features beyond what is asked | 5 new screens only. No real routing API, no BLE, no real location tracking. |
| StyleSheet.create with DSColors for complex screens (NativeWind causes layout issues on maps) | NavigateToBike, EndRideFindCharging, RidingToCharging — StyleSheet.create only. SafetyMount and WalkingDirections may use either. |
| textOnPrimary = #0F0F0F (black) — Electric Green is LIGHT | "Start Ride" PrimaryButton label is black via PaperProvider theme. Never use #C6FF2D as text color. |
| Expo SDK 57 | No Expo Go — use Android emulator or EAS dev build for testing |

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|-----------------|-------|
| react-native-maps v0.x: Polyline via `MapView.Polyline` static method | v1.27.2: Named export `Polyline` from `react-native-maps` | [VERIFIED: index.ts line 15] |
| @react-navigation/stack v5/v6: `navigate` with nested params object | v7.x: Same API, but `NavigatorScreenParams` typing required for nested navigators | [VERIFIED: package.json — ^7.10.22] |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Inline-copying haversineKm is preferred over extracting to a shared util (Option A over Option B) | Critical Findings #1 | If plan author chooses Option B (extract to utils/geo.ts), they must also update MapScreen.tsx import — adds scope to 07-01 plan |
| A2 | New navigation screens folder should be `src/screens/navigation/` and charging screens in `src/screens/charging/` | Architecture Patterns | Could use alternative folder names (e.g., `nav/`, `ride/charging/`) — functionally equivalent |
| A3 | BikeDetailSheet "Get Directions" uses `onGetDirections` callback prop (Option A) rather than internal useNavigation (Option B) | Critical Findings #5 | Option B also works; Option A is cleaner given existing onReserve pattern |

---

## Open Questions

1. **haversineKm extraction scope**
   - What we know: Function is private to MapScreen.tsx; new screens need it
   - What's unclear: Whether to inline vs. extract to a utility — inline stays in phase scope, extract is a minor refactor that also touches MapScreen
   - Recommendation: Inline the function in each new screen file. 10 lines, self-contained, zero external dependencies. Document in code comment that it mirrors MapScreen.tsx.

2. **MapView onPress for clearing charger info card**
   - What we know: react-native-maps MapView supports `onPress` prop
   - What's unclear: Whether `onPress` fires when tapping a Marker (Markers typically swallow tap events in react-native-maps)
   - Recommendation: Use `setSelectedCharger(null)` on MapView `onPress`. If a Marker tap propagates to MapView, the info card will close immediately — but in practice, Marker `onPress` handlers prevent propagation in react-native-maps. This is acceptable UX (tap a different charger to change selection; tap empty map area to dismiss).

---

## Environment Availability

No new external dependencies. All tools confirmed via package.json and installed node_modules.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| react-native-maps | NavigateToBike, EndRideFindCharging, RidingToCharging | ✓ | 1.27.2 | — |
| Polyline (named export) | NavigateToBike, RidingToCharging | ✓ | react-native-maps 1.27.2 | — |
| expo-location | NavigateToBike, EndRideFindCharging | ✓ | ~57.0.11 | Mock Amsterdam coords (already used in MapScreen) |
| @expo/vector-icons MaterialCommunityIcons | All 5 new screens | ✓ | ^15.0.2 | — |
| useSafeAreaInsets | NavigateToBike, SafetyMount, EndRideFindCharging, RidingToCharging | ✓ | react-native-safe-area-context ^5.9.0 | — |

**Missing dependencies with no fallback:** None.

---

## Validation Architecture

> `workflow.nyquist_validation` not explicitly set to false in config.json — section included.

This is a frontend-only phase with all mock data. Testing is via visual inspection on Android emulator (Expo SDK 57 — not supported by Expo Go).

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated? |
|--------|----------|-----------|------------|
| NAV-01 | Get Directions opens map with route + ETA | Visual / manual | No — map rendering requires emulator |
| NAV-02 | Walking directions list shows 5 steps with icons | Visual / manual | No — FlatList mock data visual check |
| RIDE-05 | Safety checklist all-checked enables Start Ride button | Manual interaction | No — toggle state visual check |
| RIDE-06 | Charger pins appear on map; tapping shows info card | Visual / manual | No — map + state visual check |
| RIDE-07 | Navigate Here opens RidingToCharging with route | Visual / manual | No — navigation flow manual check |

**TypeScript compilation is the primary automated quality gate for this phase.** Run `npx tsc --noEmit` after each plan to verify types. All 5 screens produce zero TypeScript errors.

### Wave 0 Gaps

No test framework changes needed. TypeScript is the validation mechanism.

- [ ] Run `npx tsc --noEmit` after 07-01 (types + navigation + NavigateToBike + WalkingDirections)
- [ ] Run `npx tsc --noEmit` after 07-02 (SafetyMount + RideNavigator + UnlockSuccess update)
- [ ] Run `npx tsc --noEmit` after 07-03 (EndRideFindCharging + RidingToCharging + ChargeNavigator + RideReceipt update)

---

## Security Domain

> `security_enforcement` not set to false in config — section included.

This phase has no authentication, no credentials, no user data storage, and no network calls. All data is mock/hardcoded.

### Applicable ASVS Categories

| ASVS Category | Applies | Notes |
|---------------|---------|-------|
| V2 Authentication | No | No auth flows in this phase |
| V3 Session Management | No | No session handling |
| V4 Access Control | No | All screens are accessible to authenticated users only (enforced by RootNavigator auth gate established in Phase 1) |
| V5 Input Validation | No | No user input in new screens (checklist taps, map taps only) |
| V6 Cryptography | No | No data encryption needed |

No security concerns specific to Phase 7.

---

## Sources

### Primary (HIGH confidence — verified from codebase files)

- `VoltVenture/src/types/navigation.ts` — exact current RootStackParamList, RideStackParamList
- `VoltVenture/src/navigation/RootNavigator.tsx` — exact modal stack pattern
- `VoltVenture/src/navigation/RideNavigator.tsx` — exact current screens
- `VoltVenture/src/navigation/BookingNavigator.tsx` — navigator pattern to copy
- `VoltVenture/src/screens/ride/ActiveRideScreen.tsx` — floating overlay card pattern, userMarker style, absoluteFill pattern
- `VoltVenture/src/screens/app/MapScreen.tsx` — haversineKm function body, MapView+Marker pattern, mock Amsterdam coords
- `VoltVenture/src/components/map/BikeDetailSheet.tsx` — current props interface, JSX structure, onReserve pattern
- `VoltVenture/src/screens/booking/UnlockSuccessScreen.tsx` — exact line 45 to change
- `VoltVenture/src/screens/ride/RideReceiptScreen.tsx` — getParent().goBack() pattern
- `VoltVenture/src/components/common/PrimaryButton.tsx` — disabled prop confirmed
- `VoltVenture/src/theme/theme.ts` — all DSColors and DSTypography tokens
- `node_modules/react-native-maps/src/index.ts` line 15 — Polyline named export confirmed
- `VoltVenture/package.json` — all package versions confirmed

### Secondary (HIGH confidence — project planning artifacts)

- `.planning/phases/07-navigation-ride-extras/07-CONTEXT.md` — all locked decisions
- `.planning/phases/07-navigation-ride-extras/07-UI-SPEC.md` — complete screen specs, mock data, copywriting contract

---

## Metadata

**Confidence breakdown:**
- Navigation types changes: HIGH — current state read directly from navigation.ts
- haversineKm availability: HIGH — confirmed private function in MapScreen.tsx
- Polyline export: HIGH — confirmed from react-native-maps source index.ts
- Screen patterns: HIGH — directly copied from ActiveRideScreen, BookingNavigator
- Mock data (charger coords, waypoints): HIGH — specified verbatim in UI-SPEC
- Integration edits (BikeDetailSheet, UnlockSuccess, RideReceipt): HIGH — exact current lines identified

**Research date:** 2026-08-19
**Valid until:** 2026-09-19 (stable stack — no moving parts)

---

## RESEARCH COMPLETE

**Phase:** 7 — Navigation & Ride Extras
**Confidence:** HIGH

### Key Findings

1. **Zero new packages needed.** All required libraries (`react-native-maps`, `@react-navigation/stack`, `expo-location`, `@expo/vector-icons`, `react-native-safe-area-context`) are already installed and confirmed in package.json.

2. **`haversineKm` is NOT exported from MapScreen.tsx** — it is a file-private function. New screens must inline the function body (10 lines) rather than import it.

3. **`Polyline` is a confirmed named export** from `react-native-maps` v1.27.2 — `import MapView, { Marker, Polyline } from 'react-native-maps'` works as-is.

4. **Exact integration points identified:** Line 45 of UnlockSuccessScreen (change `ActiveRide` to `SafetyMount`). `navigation.getParent()?.goBack()` pattern in RideReceiptScreen — capture `parent` before calling `goBack()`, then `setTimeout(300ms)` before calling `parent.navigate('ChargeStack', ...)`.

5. **BikeDetailSheet needs an `onGetDirections` callback prop** (same pattern as `onReserve`) — the sheet doesn't own its dismiss ref, so navigation from within the sheet requires MapScreen to pass a dismiss+navigate callback.

### File Created

`.planning/phases/07-navigation-ride-extras/07-RESEARCH.md`

### Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | All packages verified from package.json and node_modules |
| Architecture | HIGH | Exact current file state read and documented |
| Pitfalls | HIGH | Derived from reading actual code — haversineKm private, charger dismiss timing, Polyline placement |
| Mock data | HIGH | Specified verbatim in UI-SPEC and CONTEXT.md |

### Open Questions

- haversineKm: inline vs. extract to utils (recommendation: inline — zero added scope)
- BikeDetailSheet "Get Directions": callback prop vs. internal useNavigation (recommendation: callback prop — consistent with onReserve)

### Ready for Planning

Research complete. Planner can now create 07-01-PLAN.md, 07-02-PLAN.md, 07-03-PLAN.md.
