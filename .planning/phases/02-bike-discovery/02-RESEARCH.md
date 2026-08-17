# Phase 2: Bike Discovery — Research

**Researched:** 2026-08-17
**Domain:** React Native maps, location, bottom sheet — Expo SDK 57
**Confidence:** HIGH (all core libraries verified via official Expo docs and npm registry)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Map library: `react-native-maps` (Expo config plugin)
- **D-02:** Map tiles: Apple Maps on iOS (no API key), Google Maps on Android (API key required)
- **D-03:** Bike pins: custom branded marker — Electric Green (#C6FF2D) circle with bolt icon, implemented as a React Native View child of `<Marker>`
- **D-04:** No clustering — individual pins always visible
- **D-05:** Tapping a bike pin opens a bottom sheet; map stays visible above the sheet
- **D-06:** Bottom sheet content: drag handle, Bike ID, bike type, three stat chips (battery %, price/min, distance), "Reserve" CTA (Phase 3 stub)
- **D-07:** Tapping a list row opens the same bottom sheet component as the map pin
- **D-08:** Filter icon button (top-right of map) opens a filter bottom sheet/modal
- **D-09:** Filter controls: chip selectors for Battery (Low/Med/High), Price (Low/Med/High), Bike Type (Standard/Speed/Cargo), plus "Apply filters" button
- **D-10:** FAB ("List view") overlaid on map; list view has "Map" header button to switch back
- **D-11:** List view sorted by distance; compact two-row cards; tapping opens same bottom sheet

### Claude's Discretion
- Bottom sheet library choice (compatibility with Expo SDK 57 is the deciding criterion)
- Exact FAB position and styling (bottom-right quadrant, DS-themed)
- Empty state UI when no bikes match active filters
- Location permission request UX (prompt text and timing)
- Mock data structure and quantity (10–20 bikes around a sample tourist location)
- Map initial region / camera position

### Deferred Ideas (OUT OF SCOPE)
- Bike pin clustering
- Real-time availability updates (WebSocket/polling)
- Route/navigation to selected bike
- Saved/favourite bikes
- Bike photos in the detail sheet
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DISC-01 | User can see available e-bikes near them on a map | react-native-maps MapView + Marker + mock bike coordinates |
| DISC-02 | User can tap a bike to view its detail (battery %, price/min, distance) | @gorhom/bottom-sheet with BikeDetailSheet component |
| DISC-03 | User can filter bikes by battery level, price range, or bike type | Filter bottom sheet with chip selectors; filter logic in MapScreen state |
| DISC-04 | User can switch to a list view showing nearby available bikes | FAB toggles view state; BikeListView sorted by Haversine distance |
</phase_requirements>

---

## Summary

Phase 2 replaces the MapScreen placeholder with a fully interactive bike discovery experience. The core stack is `react-native-maps` (locked) for the map, `@gorhom/bottom-sheet` v5 (recommended — see below) for both the bike detail and filter sheets, and `expo-location` for user location. All three are Expo SDK 57 compatible. All bike data is mocked through a `bikeService.ts` that mirrors the established `authService.ts` pattern.

The most important compatibility fact: the project already has `react-native-reanimated@4.5.3` and `react-native-gesture-handler@3.1.0`. `@gorhom/bottom-sheet` v5.2.14 explicitly supports `>=3.16.0 || >=4.0.0-` for Reanimated (peer dep verified on npm) and `>=2.16.1` for Gesture Handler. Both installed versions satisfy these constraints. `GestureHandlerRootView` is already at the app root in `App.tsx`. This means `@gorhom/bottom-sheet` drops in with zero wrapper changes.

Android requires a real Google Maps API key — even in a dev build. Without one, MapView renders as a grey screen with a Google logo but does not crash. iOS (Apple Maps) works with zero API key configuration.

**Primary recommendation:** Install `react-native-maps`, `expo-location`, and `@gorhom/bottom-sheet`. Configure the Android API key in app.json via the react-native-maps config plugin. Use @gorhom/bottom-sheet's `BottomSheetModal` pattern (ref-driven, imperative open/close) for both the bike detail sheet and the filter sheet.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Map display + bike pins | MapScreen (client) | — | react-native-maps renders natively via bridge; all map state lives in the screen component |
| User location | MapScreen (client) | expo-location (OS) | Location is read once on mount and used to center the map and compute distances |
| Bike data | bikeService.ts (service layer) | MapScreen state | Service returns mock array; screen holds filtered view state |
| Bottom sheet (bike detail + filter) | MapScreen (client) | @gorhom/bottom-sheet | Sheet is imperative (ref.current.present()); triggered from screen event handlers |
| Filter state | MapScreen (client) | — | Simple useState; filters are applied in-memory against the mock bike array |
| List view toggle | MapScreen (client) | — | Boolean `isListView` state; FAB toggles it; no navigation change needed |
| Distance computation | MapScreen (client) | — | Haversine formula over mock bike coords + user location |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-maps | 1.29.0 | MapView, Marker, custom markers | Locked decision D-01; battle-tested; Expo config plugin; peer deps satisfied (RN >= 0.76) |
| expo-location | 57.0.11 | User location permissions + GPS | Official Expo SDK 57 library; zero config drift; in-SDK versioning |
| @gorhom/bottom-sheet | 5.2.14 | Bike detail sheet + filter sheet | Best-in-class RN bottom sheet; peer deps explicitly support Reanimated 4; GestureHandlerRootView already in App.tsx |

### Supporting (already installed — no new install needed)

| Library | Version | Purpose |
|---------|---------|---------|
| react-native-reanimated | 4.5.3 | Peer dep for @gorhom/bottom-sheet (satisfied) |
| react-native-gesture-handler | 3.1.0 | Peer dep for @gorhom/bottom-sheet (satisfied: >=2.16.1) |
| react-native-paper | 5.15.3 | Chip (filter selectors), FAB, IconButton (filter button), Surface (list cards) |
| @expo/vector-icons / MaterialCommunityIcons | 15.0.2 | `lightning-bolt` icon inside custom bike marker; icons in list cards |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @gorhom/bottom-sheet | Modal + Animated.Value (hand-rolled) | Modal approach avoids a new dependency but requires significant boilerplate for gesture-driven drag, snap points, backdrop dismiss, and keyboard avoidance. @gorhom handles all of these edge cases. Given Reanimated 4 is already installed and GestureHandlerRootView is already at root, @gorhom/bottom-sheet is the lower-risk choice. |
| @gorhom/bottom-sheet | react-native-bottom-sheet (different pkg) | Confusingly-named third package; smaller community; no additional benefit here. |
| expo-location getCurrentPositionAsync | watchPositionAsync | watchPositionAsync is for continuous tracking (Phase 4 — active ride). Phase 2 only needs a one-time location fix to center the map. |

**Installation (new packages only):**
```bash
npx expo install react-native-maps expo-location @gorhom/bottom-sheet
```

**Version verification (run before installing):**
```bash
npm view react-native-maps version      # confirmed 1.29.0 — 2026-06-28
npm view expo-location version          # confirmed 57.0.11
npm view @gorhom/bottom-sheet version  # confirmed 5.2.14
```

---

## Package Legitimacy Audit

| Package | Registry | Age | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-------------|-----------|-------------|
| react-native-maps | npm | ~10 yrs (since 2016-01-16) | github.com/react-native-maps/react-native-maps | N/A (slopcheck unavailable) | Approved — official Expo SDK listed, decade-old repo |
| expo-location | npm | ~8 yrs (since 2018-08-31) | github.com/expo/expo | N/A (slopcheck unavailable) | Approved — first-party Expo SDK package |
| @gorhom/bottom-sheet | npm | ~6 yrs (since 2020-07-31) | github.com/gorhom/react-native-bottom-sheet | N/A (slopcheck unavailable) | Approved — widely cited, well-maintained, Expo official docs reference it |

**Packages removed due to slopcheck [SLOP] verdict:** none

**Packages flagged as suspicious [SUS]:** none

*slopcheck was unavailable at research time. All three packages above are tagged `[ASSUMED]` for legitimacy, though all three have strong provenance signals (official Expo docs, decade-old repos, millions of weekly downloads). The planner should treat these as approved but may add a `checkpoint:human-verify` if strict policy requires it.*

---

## Architecture Patterns

### System Architecture Diagram

```
User opens Map tab
        |
        v
  MapScreen.tsx  ──── bikeService.ts ──── mockBikes[] (10-20 bikes, Amsterdam coords)
        |
        |── expo-location ──► requestForegroundPermissionsAsync
        |                        |
        |                  granted?  ──NO──► show denied banner; use fallback coords
        |                        |YES
        |                  getCurrentPositionAsync ──► userLocation {lat, lng}
        |
        |── computes distance (Haversine) for each bike
        |── applies activeFilters (battery/price/type) ──► filteredBikes[]
        |
        |── isListView === false?
        |      YES ──► MapView + Marker[] (custom marker Views)
        |               |
        |               Marker.onPress ──► setSelectedBike(bike) ──► bikeDetailRef.present()
        |
        |── isListView === true?
               YES ──► BikeListView (FlatList of BikeCard rows, sorted by distance)
                        |
                        BikeCard.onPress ──► setSelectedBike(bike) ──► bikeDetailRef.present()

  Filter FAB (top-right IconButton) ──► filterSheetRef.present()
  FAB ("List view") ──► setIsListView(true)
  Map header button ──► setIsListView(false)

  BikeDetailSheet (BottomSheetModal, ref=bikeDetailRef)
        |── selectedBike data display
        └── "Reserve" button ──► console.log('TODO Phase 3')

  FilterSheet (BottomSheetModal, ref=filterSheetRef)
        |── Chip groups: Battery / Price / BikeType
        └── "Apply filters" ──► setActiveFilters(draft) ──► filterSheetRef.dismiss()
```

### Recommended Project Structure

```
src/
├── screens/app/
│   └── MapScreen.tsx          # Rewrite — full map + list view + state management
├── components/map/
│   ├── BikeMarker.tsx         # Custom green circle + bolt icon, passed as Marker child
│   ├── BikeDetailSheet.tsx    # BottomSheetModal — bike detail panel (DISC-02)
│   ├── FilterSheet.tsx        # BottomSheetModal — filter controls (DISC-03)
│   └── BikeListView.tsx       # FlatList of BikeCard rows (DISC-04)
├── components/map/BikeCard.tsx # Single list row card
├── services/
│   └── bikeService.ts         # Mock bike data (mirrors authService.ts pattern)
└── types/
    └── bike.ts                # Bike interface + FilterState interface
```

### Pattern 1: react-native-maps with Custom Marker

```tsx
// Source: [CITED: docs.expo.dev/versions/v57.0.0/sdk/map-view/]
// [ASSUMED] exact prop names from training knowledge — verify against RN Maps README
import MapView, { Marker } from 'react-native-maps';

<MapView
  style={StyleSheet.absoluteFillObject}
  initialRegion={{
    latitude: 52.3676,      // Amsterdam centre
    longitude: 4.9041,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
  showsUserLocation={true}
  showsMyLocationButton={false}
>
  {filteredBikes.map(bike => (
    <Marker
      key={bike.id}
      coordinate={{ latitude: bike.latitude, longitude: bike.longitude }}
      onPress={() => handleMarkerPress(bike)}
      tracksViewChanges={false}   // CRITICAL: prevents re-render flicker on Android
    >
      <BikeMarker />
    </Marker>
  ))}
</MapView>
```

**`tracksViewChanges={false}` is mandatory once the custom marker is rendered.** Without it, React Native re-renders the marker View on every map region change, causing visible flicker on Android. Set it to `true` only while loading an async image (not applicable here). [CITED: react-native-maps GitHub README]

### Pattern 2: Custom Marker View (BikeMarker component)

```tsx
// Source: [ASSUMED] — standard React Native View composition
// No third-party library needed; just a styled View + MaterialCommunityIcons
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DSColors } from '../../theme/theme';

export default function BikeMarker() {
  return (
    <View style={styles.pinContainer}>
      <View style={styles.circle}>
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={18}
          color={DSColors.textOnPrimary}  // #0F0F0F — black on green
        />
      </View>
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  pinContainer: { alignItems: 'center' },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DSColors.primary,  // #C6FF2D — Electric Green
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: DSColors.textOnPrimary,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: DSColors.primary,
  },
});
```

### Pattern 3: @gorhom/bottom-sheet BottomSheetModal

```tsx
// Source: [CITED: gorhom.dev/react-native-bottom-sheet]
// GestureHandlerRootView already wraps the entire app in App.tsx — no change needed
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRef, useCallback, useMemo } from 'react';

// In MapScreen:
const bikeDetailRef = useRef<BottomSheetModal>(null);
const snapPoints = useMemo(() => ['45%'], []);   // wrap in useMemo — prevents reconciliation flicker

const handleMarkerPress = useCallback((bike: Bike) => {
  setSelectedBike(bike);
  bikeDetailRef.current?.present();
}, []);

// In JSX (outside MapView, as a sibling):
<BottomSheetModal
  ref={bikeDetailRef}
  snapPoints={snapPoints}
  enablePanDownToClose
  backdropComponent={renderBackdrop}
>
  <BottomSheetView>
    <BikeDetailSheet bike={selectedBike} onReserve={() => console.log('TODO Phase 3')} />
  </BottomSheetView>
</BottomSheetModal>
```

**BottomSheetModalProvider is NOT needed** when using the sheet imperatively via `ref.current.present()`. It is only required for the portal-based `useBottomSheetModal` hook pattern. [ASSUMED — verify against @gorhom docs if portal behaviour is wanted]

### Pattern 4: expo-location permission + position

```tsx
// Source: [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/location/]
import * as Location from 'expo-location';

useEffect(() => {
  (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // Graceful fallback: centre map on Amsterdam; list sorted by mock distance
      setUserLocation({ latitude: 52.3676, longitude: 4.9041 });
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  })();
}, []);
```

### Pattern 5: bikeService.ts mock (mirrors authService.ts)

```tsx
// Source: [ASSUMED] — mirrors established authService.ts pattern in codebase
export interface Bike {
  id: string;
  name: string;
  type: 'standard' | 'speed' | 'cargo';
  batteryPct: number;    // 0-100
  pricePerMin: number;   // e.g. 0.25 (EUR)
  latitude: number;
  longitude: number;
}

export interface BikeService {
  getNearbyBikes(): Promise<Bike[]>;
}

const mockBikes: Bike[] = [/* 15 bikes spread around Amsterdam centre */];

export const mockBikeService: BikeService = {
  async getNearbyBikes() {
    await new Promise(r => setTimeout(r, 500)); // simulate network
    return mockBikes;
  },
};

export const bikeService: BikeService = mockBikeService;
```

### Anti-Patterns to Avoid

- **Wrapping MapView in SafeAreaView:** Use `style={StyleSheet.absoluteFillObject}` on MapView and overlay UI controls (FAB, filter button) with absolute positioning. SafeAreaView around MapView clips the map tiles at notch/home indicator boundaries.
- **Setting `tracksViewChanges={true}` on Marker after initial render:** Causes Android re-render on every map pan. Set to `false` once marker content is static.
- **Inline snapPoints array in JSX:** `snapPoints={['45%']}` inline causes reconciliation on every render, which makes the sheet flicker. Always `useMemo`.
- **Calling `getCurrentPositionAsync` without first checking permission status:** Will throw on Android if called without granted permission. Always await `requestForegroundPermissionsAsync` first.
- **Using `NativeWind` classes on MapScreen:** The CONTEXT.md and existing codebase both note: "StyleSheet.create with DSColors/DSTypography inline (no NativeWind on complex map screens)." Use `StyleSheet.create` for MapScreen and all map components.
- **Placing BottomSheetModal inside MapView JSX:** Bottom sheet must be a sibling of MapView at the screen level, not a child inside it.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Slide-up bottom panel | Custom Animated.View with PanResponder | @gorhom/bottom-sheet BottomSheetModal | Snap points, gesture velocity, backdrop, keyboard avoidance, accessibility — all handled |
| User GPS location | navigator.geolocation (web API) | expo-location | Web geolocation API is unreliable on React Native; expo-location wraps native location APIs with proper permission flow |
| Distance computation | Third-party geo library | Inline Haversine function | With 10-20 mock bikes, a simple ~10-line Haversine is sufficient; no library needed |
| Map rendering | WebView + Leaflet | react-native-maps | Native map tiles via bridge; gestures, performance, and OS-level features (traffic, compass) that a WebView cannot match |

**Key insight:** The bottom sheet is the highest-risk hand-roll target. Gesture velocity math, rubber-banding, snap logic, and Android back-button dismiss handling have numerous edge cases. @gorhom/bottom-sheet solves all of them.

---

## Common Pitfalls

### Pitfall 1: Android Google Maps API key missing — grey screen
**What goes wrong:** MapView renders as a solid grey rectangle with the Google logo watermark. No error thrown; app does not crash.
**Why it happens:** Android's Google Maps SDK silently fails without a valid `com.google.android.geo.API_KEY` in `AndroidManifest.xml`. The Expo config plugin injects this via `app.json`, but only during `npx expo prebuild` or `expo run:android`. If you test in Expo Go (which does not support react-native-maps anyway), this is irrelevant — but the dev build must have the key.
**How to avoid:** Add `androidGoogleMapsApiKey` to the `react-native-maps` plugin entry in `app.json` before building. Obtain a key from Google Cloud Console with Maps SDK for Android enabled. For local dev, an unrestricted key is fine; restrict by SHA-1 fingerprint before release.
**Warning signs:** Map renders but shows no tiles; only the Google logo in bottom-left corner.

### Pitfall 2: expo-location hangs on Android without permission handling
**What goes wrong:** `getCurrentPositionAsync()` hangs indefinitely if called after permission is denied — it never resolves or rejects.
**Why it happens:** Known Android bug in expo-location where the Promise neither resolves nor rejects if location permission is `denied` but `canAskAgain` is false. [CITED: github.com/expo/expo/issues/33981]
**How to avoid:** Always gate `getCurrentPositionAsync` behind a `status === 'granted'` check. Provide a fallback location (Amsterdam centre) when permission is denied.
**Warning signs:** App freezes on the map screen, no location obtained.

### Pitfall 3: Custom Marker re-render flicker on Android
**What goes wrong:** Every time the user pans or zooms the map, all custom markers visually flicker (blink once).
**Why it happens:** `tracksViewChanges` defaults to `true`, causing React Native to re-measure and re-render the native marker View on every map update.
**How to avoid:** Set `tracksViewChanges={false}` on every `<Marker>` that contains a static custom View child.
**Warning signs:** Smooth on iOS but visible flicker on Android during any map interaction.

### Pitfall 4: snapPoints inline array causes sheet flicker
**What goes wrong:** Bottom sheet animates to snap point then immediately jumps slightly (flickering).
**Why it happens:** An inline array `snapPoints={['45%']}` is a new object reference every render, triggering sheet layout recalculation.
**How to avoid:** Wrap in `useMemo`: `const snapPoints = useMemo(() => ['45%'], [])`.
**Warning signs:** Sheet opens but visually "adjusts" after opening.

### Pitfall 5: react-native-maps not compatible with Expo Go
**What goes wrong:** `npx expo start` with Expo Go client on the device does not load react-native-maps — the map tab crashes or shows an error.
**Why it happens:** react-native-maps requires native code (not supported by Expo Go's sandbox).
**How to avoid:** Always use a dev build (`expo run:android` or EAS dev build). Project already requires a dev build for Phase 1 (Google Sign-In), so this is consistent.
**Warning signs:** Module not found error or blank crash when navigating to the Map tab in Expo Go.

### Pitfall 6: Filter chip state not reset when switching views
**What goes wrong:** Filters applied in filter sheet persist visually but don't update the list view (or vice versa) because filtered state is stored in two places.
**How to avoid:** Maintain a single `activeFilters` state object in MapScreen. Both the map view and the list view read from the same filtered `filteredBikes` array derived from `activeFilters`.

---

## Code Examples

### app.json plugin config for react-native-maps + expo-location

```json
{
  "expo": {
    "plugins": [
      "expo-secure-store",
      "expo-font",
      "expo-splash-screen",
      ["@react-native-google-signin/google-signin", {
        "iosUrlScheme": "com.googleusercontent.apps.TODO_REPLACE_WITH_REAL_CLIENT_ID"
      }],
      "expo-apple-authentication",
      [
        "react-native-maps",
        {
          "androidGoogleMapsApiKey": "YOUR_ANDROID_MAPS_KEY_HERE"
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Allow VoltVenture to show nearby e-bikes on the map."
        }
      ]
    ]
  }
}
```

Note: iOS does NOT need an `iosGoogleMapsApiKey` entry — Apple Maps is the default on iOS and requires no key. [CITED: react-native-maps docs — "Apple Maps works out-of-the-box"]

### Haversine distance helper (no library needed)

```ts
// Source: [ASSUMED] — standard Haversine formula
export function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

### Filter application pattern

```ts
// Source: [ASSUMED] — standard React filter pattern
const filteredBikes = useMemo(() => {
  return bikes
    .filter(b => {
      if (filters.battery === 'low' && b.batteryPct > 40) return false;
      if (filters.battery === 'med' && (b.batteryPct <= 40 || b.batteryPct > 75)) return false;
      if (filters.battery === 'high' && b.batteryPct <= 75) return false;
      if (filters.type && b.type !== filters.type) return false;
      // price filter omitted for brevity — same pattern
      return true;
    })
    .map(b => ({
      ...b,
      distanceKm: userLocation
        ? haversineKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
        : 0,
    }));
}, [bikes, filters, userLocation]);
```

---

## Project Constraints (from CLAUDE.md)

These directives apply to all Phase 2 implementation:

- **Tech Stack locked:** React Native + React Native Paper + NativeWind — no substitutions
- **Design System mandatory:** All UI must use Volt Venture DS tokens (DSColors, DSTypography from `src/theme/theme.ts`)
- **StyleSheet.create on map screens:** No NativeWind utility classes on MapScreen or map components (established in Phase 1 context)
- **SafeAreaView wrapping:** All app screens use SafeAreaView — but for MapScreen, the map itself must use `StyleSheet.absoluteFillObject` with overlaid controls, not SafeAreaView wrapping the map
- **MaterialCommunityIcons:** Already a dependency via @expo/vector-icons — use for all icons
- **Frontend only:** All bike data mocked/stubbed; no real API calls
- **Scope boundary:** Do not add features beyond DISC-01 through DISC-04

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| react-native-reanimated v3 babel plugin in babel.config.js | Reanimated v4 — babel plugin auto-configured by babel-preset-expo; `react-native-worklets` provides plugin | No manual babel config needed in this project |
| BottomSheet (persistent, always mounted) | BottomSheetModal (portal-driven, imperative present/dismiss) | BottomSheetModal is better for this use case — opens on demand from marker press, not always visible |
| MapView inside SafeAreaView | MapView with absoluteFillObject + absolute-positioned overlay controls | Full-bleed map is the standard UX for bike/ride-share apps |

**Deprecated / outdated:**
- `watchPositionAsync` for one-time location: Use `getCurrentPositionAsync` instead for a single fix
- `PROVIDER_GOOGLE` on iOS: Not needed when using Apple Maps default; only set `provider={PROVIDER_GOOGLE}` on Android if you want Google tiles on iOS too

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Android emulator / dev build | react-native-maps (Expo Go incompatible) | Confirmed needed (Phase 1 already requires this) | Android Studio required | EAS dev build as alternative |
| Google Maps API key (Android) | react-native-maps Android | Must obtain | — | Use emulator without key for grey-map testing; full tiles need valid key |
| expo-location | User GPS | New install | 57.0.11 | Fallback to hardcoded Amsterdam coords if denied |

**Missing dependencies with no fallback:**
- Google Maps Android API key — must be obtained from Google Cloud Console before building. The key is required for map tiles to render on Android; the app will show a grey screen without it.

**Missing dependencies with fallback:**
- expo-location GPS — if permission denied, fallback to Amsterdam city centre coords (all mock bikes will still be visible; distance sorting will be relative to fallback coords).

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `BottomSheetModalProvider` is NOT needed for imperative `ref.present()` pattern | Architecture Patterns | If wrong: sheet does not open; fix is to add `<BottomSheetModalProvider>` wrapping in App.tsx |
| A2 | `tracksViewChanges={false}` prevents Android marker flicker | Common Pitfalls | If wrong: flicker may have another cause; solution is still standard practice |
| A3 | Reanimated v4 babel plugin is auto-configured by babel-preset-expo in Expo SDK 57 | Architecture Patterns | If wrong: add `'react-native-worklets/plugin'` (not `'react-native-reanimated/plugin'`) to babel.config.js |
| A4 | @gorhom/bottom-sheet BottomSheetModal works correctly with Reanimated 4.5.3 | Standard Stack | Risk: Reanimated 4 breaking changes. Mitigation: peer dep spec `>=4.0.0-` was added in v5.x — treat as supported |
| A5 | iOS Apple Maps default requires no API key in app.json | app.json config example | If wrong: add `iosGoogleMapsApiKey` (but decision D-02 says Apple Maps on iOS, so this is not Google Maps) |

---

## Open Questions

1. **Google Maps API key for Android dev build**
   - What we know: A key is required; without it the map is grey
   - What's unclear: The user has not confirmed whether they have obtained a Google Cloud project + Maps SDK key
   - Recommendation: Plan should include a Wave 0 task: "Obtain Google Maps Android API key — gate on this before running dev build with maps"

2. **`BottomSheetModalProvider` requirement**
   - What we know: The @gorhom docs show it as part of app root setup; the tutorial confirms it is needed for the `useBottomSheetModal` hook pattern
   - What's unclear: Whether it's required for the ref-based `ref.current.present()` pattern (which this phase uses)
   - Recommendation: Add `BottomSheetModalProvider` wrapping in App.tsx as a Wave 0 task — it is harmless and avoids debugging if it turns out to be required

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/map-view/] — react-native-maps installation, Android API key config plugin, iOS Apple Maps default
- [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/location/] — expo-location install, permission APIs, config plugin options, LocationObject shape
- [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/reanimated/] — Reanimated v4 babel plugin auto-configured in babel-preset-expo
- [VERIFIED: npm registry] — @gorhom/bottom-sheet@5.2.14 peer deps: `react-native-reanimated: >=3.16.0 || >=4.0.0-`, `react-native-gesture-handler: >=2.16.1`
- [VERIFIED: npm registry] — react-native-maps@1.29.0, expo-location@57.0.11, @gorhom/bottom-sheet@5.2.14 — all confirmed current

### Secondary (MEDIUM confidence)
- [CITED: github.com/react-native-maps/react-native-maps] — `tracksViewChanges={false}` for static custom markers, custom Marker children pattern, initialRegion shape
- [CITED: reactnativerelay.com/article/react-native-bottom-sheet-tutorial-gorhom-reanimated-expo-2026] — @gorhom/bottom-sheet setup with Expo, known issues table, GestureHandlerRootView requirement
- [CITED: github.com/expo/expo/issues/33981] — expo-location getCurrentPositionAsync hang on Android when permission denied

### Tertiary (LOW confidence — training knowledge)
- Haversine formula implementation (standard math, widely reproduced)
- bikeService.ts mock pattern (derived from existing authService.ts in codebase)
- Filter logic implementation (standard React useMemo/filter pattern)

---

## Metadata

**Confidence breakdown:**
- react-native-maps setup: HIGH — verified via official Expo SDK 57 docs
- expo-location setup: HIGH — verified via official Expo SDK 57 docs
- @gorhom/bottom-sheet compatibility: HIGH — peer deps verified on npm registry; Reanimated 4 explicitly in spec
- Custom marker pattern: MEDIUM — confirmed from react-native-maps README; exact prop names not re-verified against v1.29 API
- Filter/list logic: MEDIUM — standard React patterns; implementation details are Claude's discretion
- Mock data structure: LOW — all assumed, no external verification needed (it's mock data)

**Research date:** 2026-08-17
**Valid until:** 2026-09-17 (react-native-maps and @gorhom/bottom-sheet are stable; expo-location tracks Expo SDK versioning)
