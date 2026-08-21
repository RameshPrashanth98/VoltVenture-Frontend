# Phase 10: Emulator Setup & Smoke Test — Plan

**Phase:** 10-emulator-setup-smoke-test
**Milestone:** v1.2 Android UAT
**Requirements:** SETUP-01, SETUP-02
**Status:** Ready to execute
**Planned:** 2026-08-21

---

## Objective

Get the VoltVenture app building and launching on an Android emulator (API 33+) with all 3 bottom tabs (Map, Discover, Account) accessible and no startup crashes. The primary blocker is `react-native-maps` requiring a Google Maps API key — this is resolved by migrating all map screens to `@maplibre/maplibre-react-native` using OpenStreetMap tiles.

---

## Success Criteria

1. Android Studio emulator (API 33+) running and reachable via `adb devices`
2. App builds and launches via `npx expo run:android` without crash
3. All 3 bottom tabs load (Map, Discover, Account) and switching works without errors
4. No red-screen errors or TypeScript runtime exceptions on startup
5. Metro bundler resolves all modules (no missing dependency errors)
6. VERIFICATION.md written with SETUP-01 and SETUP-02 marked pass or fail with notes

---

## Plans

### Plan 10.1 — MapLibre Dependency Swap & App Configuration

**Scope:** Package replacement + native configuration. No screen code changes.

**Tasks:**

1. **Read Expo SDK 57 docs** at https://docs.expo.dev/versions/v57.0.0/ for any relevant native module guidance before making changes.

2. **Remove react-native-maps:**
   ```
   npx expo install --fix
   ```
   Manually remove `react-native-maps` from `package.json` dependencies. Do NOT run npm/yarn uninstall — edit package.json directly, then run `npm install` to sync node_modules.

3. **Install MapLibre:**
   ```
   npm install @maplibre/maplibre-react-native
   ```
   Pin to the latest stable version compatible with React Native 0.86.x (Expo SDK 57). If a peer dependency conflict surfaces, resolve via `--legacy-peer-deps` only as last resort; prefer finding the compatible version first.

4. **Update `VoltVenture/app.json`:**
   - Remove the `react-native-maps` plugin entry:
     ```json
     ["react-native-maps", { "androidGoogleMapsApiKey": "YOUR_ANDROID_MAPS_KEY_HERE" }]
     ```
   - Add MapLibre plugin entry if the installed version requires one (check library README). If no plugin is needed, skip this step.
   - Keep all other plugins unchanged (`expo-secure-store`, `expo-font`, `expo-splash-screen`, `@react-native-google-signin/google-signin`, `expo-apple-authentication`, `expo-location`, `expo-camera`).

5. **Initialize MapLibre access token** — call `MapLibreGL.setAccessToken(null)` once at app startup (OSM requires no token). Add this call to `VoltVenture/index.ts` (or the top-level entry point) before the app component renders:
   ```ts
   import MapLibreGL from '@maplibre/maplibre-react-native';
   MapLibreGL.setAccessToken(null);
   ```

6. **Run prebuild for Android:**
   ```
   cd VoltVenture && npx expo prebuild --platform android --clean
   ```
   This regenerates the native Android project. Resolve any prebuild errors before proceeding.

**Output:** Updated `package.json`, `app.json`, `index.ts`. Native Android project regenerated.

---

### Plan 10.2 — MapLibre Screen Migration (7 screens)

**Scope:** Replace all `react-native-maps` imports and JSX with MapLibre equivalents across 7 screens. No business logic changes.

**Migration reference:**

| react-native-maps | MapLibre equivalent |
|-------------------|---------------------|
| `import MapView, { Marker } from 'react-native-maps'` | `import MapLibreGL from '@maplibre/maplibre-react-native'` |
| `import MapView, { Marker, Polyline } from 'react-native-maps'` | `import MapLibreGL from '@maplibre/maplibre-react-native'` |
| `<MapView style={...} initialRegion={{ latitude, longitude, latitudeDelta, longitudeDelta }}>` | `<MapLibreGL.MapView style={...} styleURL="https://demotiles.maplibre.org/style.json">` + `<MapLibreGL.Camera centerCoordinate={[longitude, latitude]} zoomLevel={13} />` |
| `showsUserLocation={true}` on MapView | `<MapLibreGL.UserLocation />` inside MapView |
| `<Marker coordinate={{ latitude, longitude }} onPress={...} tracksViewChanges={false}>` | `<MapLibreGL.PointAnnotation id="unique-id" coordinate={[longitude, latitude]} onSelected={...}>` |
| Children of Marker (custom views) | Same children inside PointAnnotation |
| `<Polyline coordinates={[{ latitude, longitude }, ...]} strokeColor="..." strokeWidth={3} />` | `<MapLibreGL.ShapeSource id="route" shape={routeGeoJSON}><MapLibreGL.LineLayer id="routeLine" style={{ lineColor: '...', lineWidth: 3 }} /></MapLibreGL.ShapeSource>` |

**IMPORTANT:** MapLibre uses **GeoJSON coordinate order: `[longitude, latitude]`** — the reverse of react-native-maps `{ latitude, longitude }`. Double-check every coordinate.

**Zoom level equivalents:** `latitudeDelta: 0.05` ≈ zoom level 13; `latitudeDelta: 0.02` ≈ zoom level 14.

**Polyline GeoJSON helper** (inline in screens that use it):
```ts
function buildLineGeoJSON(coords: Array<{ latitude: number; longitude: number }>) {
  return {
    type: 'Feature' as const,
    geometry: {
      type: 'LineString' as const,
      coordinates: coords.map(c => [c.longitude, c.latitude]),
    },
    properties: {},
  };
}
```

**Screens to migrate (in order of complexity — simplest first):**

1. **`src/screens/ride/ActiveRideScreen.tsx`** — `MapView, Marker` only; bike position marker + user location
2. **`src/screens/charging/EndRideFindChargingScreen.tsx`** — `MapView, Marker` only; charging station markers
3. **`src/screens/discover/VipHubsScreen.tsx`** — `MapView, Marker` only; VIP hub markers
4. **`src/screens/app/MapScreen.tsx`** — `MapView, Marker` with `BikeMarker` and `CafeMarker` custom children; most complex of the Marker-only screens
5. **`src/screens/navigation/NavigateToBikeScreen.tsx`** — `MapView, Marker, Polyline`; route line + markers
6. **`src/screens/charging/RidingToChargingScreen.tsx`** — `MapView, Marker, Polyline`; route line + markers
7. **`src/screens/navigation/NavigateToPoiScreen.tsx`** — `MapView, Marker, Polyline`; route line + markers

**PointAnnotation ID uniqueness:** Each `PointAnnotation` must have a globally unique `id` string within the map. Use a pattern like `bike-${bike.id}`, `cafe-${cafe.id}`, `user-location`, `destination`, `route-start`, `route-end`.

**Output:** All 7 screens compile without TypeScript errors referencing react-native-maps.

---

### Plan 10.3 — Build, Smoke Test & VERIFICATION.md

**Scope:** Run the app on emulator, verify SETUP-01 and SETUP-02, fix any blocking errors, write VERIFICATION.md.

**Tasks:**

1. **Verify emulator is running:**
   ```
   adb devices
   ```
   Expected: one device listed (emulator-5554 or similar). If not running, start via Android Studio → Device Manager.

2. **Build and launch on emulator:**
   ```
   cd VoltVenture && npx expo run:android
   ```
   This builds the native APK and installs on the running emulator. First build takes longer.

3. **Fix blocking build errors inline.** Common blockers to watch for:
   - MapLibre native module not found → ensure prebuild was run and Android project is up to date
   - `@react-native-google-signin/google-signin` build failure → if it occurs, remove the plugin from app.json and re-prebuild (per D-05: only intervene on actual crash)
   - Missing peer dependencies → install missing packages
   - Gradle version conflicts → check `android/build.gradle` for MapLibre compatibility requirements
   - TypeScript compile errors in migrated screens → fix before running

4. **Smoke test checklist (SETUP-01 — app launch):**
   - [ ] App launches without red screen
   - [ ] Splash screen shows and dismisses
   - [ ] Auth landing screen renders
   - [ ] No Metro bundler "Unable to resolve module" errors
   - [ ] No TypeScript runtime exceptions in LogCat

5. **Smoke test checklist (SETUP-02 — tab navigation):**
   - Log in with mock credentials to reach AppTabs
   - [ ] Map tab loads (MapLibre map renders, no crash)
   - [ ] Discover tab loads without crash
   - [ ] Account tab loads without crash
   - [ ] Switching between all 3 tabs works without errors

6. **Log any non-blocking issues** (cosmetic glitches, layout issues that don't block tab switching) as failures in VERIFICATION.md for FIX-01 in Phase 13.

7. **Write `VERIFICATION.md`** in `.planning/phases/10-emulator-setup-smoke-test/`:

```markdown
# Phase 10 — VERIFICATION.md

**Date:** [date]
**Device:** Android Emulator API [version]
**Build:** expo run:android

## SETUP-01: App launches without crashes

| Check | Status | Notes |
|-------|--------|-------|
| App launches | PASS/FAIL | |
| Splash screen dismisses | PASS/FAIL | |
| Auth landing renders | PASS/FAIL | |
| No Metro module errors | PASS/FAIL | |
| No runtime exceptions | PASS/FAIL | |

**SETUP-01 overall:** PASS / FAIL

## SETUP-02: All tabs accessible

| Tab | Status | Notes |
|-----|--------|-------|
| Map tab | PASS/FAIL | |
| Discover tab | PASS/FAIL | |
| Account tab | PASS/FAIL | |
| Tab switching | PASS/FAIL | |

**SETUP-02 overall:** PASS / FAIL

## Non-blocking issues (for FIX-01)

| Screen | Issue | Severity |
|--------|-------|----------|
| | | |

## Phase 10 Result

PASS / FAIL

**Ready for Phase 11:** Yes / No
```

**Output:** App running on emulator. VERIFICATION.md written with results. Phase 10 complete if SETUP-01 and SETUP-02 both PASS.

---

## Execution Order

```
Plan 10.1 (dependency + config)
    → Plan 10.2 (screen migration) [can start in parallel with 10.1 after package.json edit]
        → Plan 10.3 (build + smoke test)
```

Plans 10.1 and 10.2 are mostly independent (10.2 only needs the import path from 10.1). Execute 10.1 and 10.2 in parallel, then 10.3.

---

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| MapLibre version incompatible with RN 0.86.x | Medium | Check package README for RN compatibility matrix before install; try latest stable then fallback to previous minor |
| `expo prebuild --clean` wipes android/ customizations | Low | No android/ customizations made yet; clean is safe |
| `@react-native-google-signin/google-signin` build failure on Android | Low | Per D-05, remove plugin from app.json only if actual build failure occurs |
| MapLibre `demotiles` style URL rate-limited or slow | Low | Acceptable for UAT; switch to OpenFreeMap style URL if needed |
| PointAnnotation render issue with custom children | Medium | MapLibre PointAnnotation requires a single View child — wrap BikeMarker/CafeMarker in View if needed |
| Coordinate order mistakes ([lon, lat] vs {lat, lon}) | Medium | Run a checklist over all 7 screens after migration; verify markers appear in Amsterdam area |

---

## Key References

- `.planning/phases/10-emulator-setup-smoke-test/10-CONTEXT.md` — decisions D-01 through D-09
- `.planning/REQUIREMENTS.md` — SETUP-01, SETUP-02 acceptance criteria
- `VoltVenture/src/screens/app/MapScreen.tsx` — most complex map screen (reference for migration pattern)
- Expo SDK 57 docs: https://docs.expo.dev/versions/v57.0.0/
- MapLibre React Native: https://github.com/maplibre/maplibre-react-native
- OSM demo tiles style: https://demotiles.maplibre.org/style.json
