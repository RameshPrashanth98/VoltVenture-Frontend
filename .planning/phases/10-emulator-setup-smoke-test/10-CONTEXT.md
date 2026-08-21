# Phase 10: Emulator Setup & Smoke Test - Context

**Gathered:** 2026-08-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Get the app building and launching on Android emulator (API 33+) with all 3 tabs reachable and no startup crashes. This is a pure infrastructure/QA setup phase — no new UI or features. The map library is also migrated from react-native-maps (Google Maps) to @maplibre/maplibre-react-native (OSM) as part of making the app runnable without a paid API key.

</domain>

<decisions>
## Implementation Decisions

### Map Library Migration
- **D-01:** Replace `react-native-maps` with `@maplibre/maplibre-react-native` using OpenStreetMap tiles. This removes the Google Maps API key requirement for UAT.
- **D-02:** All `MapView`, `Marker`, `Polyline`, and related react-native-maps components must be replaced with their MapLibre equivalents across all screens (bike discovery, active ride, navigate-to-bike, charging station finder, etc.).
- **D-03:** Google Maps is the future target (post-UAT, when backend integration adds the real API key). MapLibre is the UAT baseline only.

### Native Plugin Compatibility
- **D-04:** Leave `@react-native-google-signin/google-signin` and `expo-apple-authentication` in place. Google Sign-In is already mocked (`getMockGoogleToken`) — the plugin does not need a valid client ID to run. `expo-apple-authentication` is iOS-only and silently no-ops on Android.
- **D-05:** Only intervene if these plugins cause an actual build failure or startup crash. Do not remove them pre-emptively.

### UAT Results Tracking
- **D-06:** Each UAT phase (10–13) writes its own `VERIFICATION.md` with a checklist of REQ-IDs tested, pass/fail status for each, and notes on failures. This is the canonical record for each phase's UAT pass.

### Fix Scope
- **D-07:** Fix anything that blocks SETUP-01 or SETUP-02 (app won't launch, tab won't load, build fails) inline in Phase 10.
- **D-08:** Log cosmetic issues, layout glitches, and non-blocking failures in VERIFICATION.md as failures. These are addressed in FIX-01 (Phase 13).
- **D-09:** Phases 11–12 start only after Phase 10's SETUP-01/02 pass green.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` — SETUP-01, SETUP-02 requirements with acceptance criteria
- `.planning/ROADMAP.md` §Phase 10 — Success criteria for this phase (5 items)
- `.planning/PROJECT.md` — Tech stack, key decisions (DSColors, textOnPrimary, NativeWind caveats)

### App Configuration
- `VoltVenture/app.json` — Android config, plugin list (react-native-maps, expo-location, expo-camera, google-signin, apple-auth)
- `VoltVenture/package.json` — Current dependencies including `react-native-maps` (to be replaced)

### Navigation Structure
- `VoltVenture/src/navigation/RootNavigator.tsx` — Root navigator; entry point for app startup
- `VoltVenture/src/navigation/AppTabs.tsx` — 3-tab navigator (Map, Discover, Account) — SETUP-02 scope

### Map Screens (require MapLibre migration)
- `VoltVenture/src/screens/` — All screens using MapView: BikeMap, ActiveRide, NavigateToBike, ChargeStation screens
- `VoltVenture/src/navigation/NavNavigator.tsx` — Navigate-to-bike stack (uses map)
- `VoltVenture/src/navigation/ChargeNavigator.tsx` — Charging station stack (uses map)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AppTabs.tsx` — 3-tab bottom navigator (MapTab, DiscoverTab, AccountTab); SETUP-02 verifies all 3 tabs load
- `RootNavigator.tsx` — Wraps AuthStack + AppTabs + modal stacks; startup entry point for SETUP-01
- `src/services/` — All mock services; no changes needed for this phase

### Established Patterns
- `StyleSheet.create` used for map and complex screens (not NativeWind) — MapLibre screens must follow the same pattern
- Modal stack pattern (BookingNavigator, RideNavigator, NavNavigator, ChargeNavigator) overlays AppTabs — must remain intact post-migration
- `getMockGoogleToken` already wraps Google Sign-In — no plugin behavior change needed

### Integration Points
- `react-native-maps` is imported in multiple screens; all must be updated to `@maplibre/maplibre-react-native`
- `app.json` `plugins` array: remove `react-native-maps` plugin entry, add MapLibre config
- `tailwind.config.js` DSColors inlining — unchanged, not affected by this phase

</code_context>

<specifics>
## Specific Ideas

- MapLibre with OSM tiles is the map solution for all UAT phases (10–13)
- Google Maps integration is a named future milestone item (post-backend integration)
- VERIFICATION.md is the standard output artifact for every UAT phase

</specifics>

<deferred>
## Deferred Ideas

- Google Maps API key integration — deferred to v3.0 backend integration milestone
- EAS dev build / Expo Go compatibility — emulator-only for v1.2 UAT; EAS is a v3.0 concern
- iOS emulator UAT — Android-only for v1.2; iOS pass deferred

</deferred>

---

*Phase: 10-emulator-setup-smoke-test*
*Context gathered: 2026-08-21*
