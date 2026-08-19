# Phase 7: Navigation & Ride Extras - Context

**Gathered:** 2026-08-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 7 delivers: (1) the user can tap "Get Directions" on a bike in BikeDetailSheet to open a walking navigation map (NavigateToBike) and view mock turn-by-turn directions (WalkingDirections); (2) a safety checklist screen (SafetyMount) appears before the active ride starts; (3) after a ride, the user can find nearby charging stations on a map (EndRideFindCharging) and navigate to one (RidingToCharging). All screens are frontend-only with mocked data and no real routing APIs.

New screens: NavigateToBike, WalkingDirections, SafetyMount, EndRideFindCharging, RidingToCharging.
Navigation types updated: RideStackParamList (SafetyMount added), RootStackParamList (NavStack + ChargeStack added), BikeDetailSheet updated (new CTA), RideReceipt updated (secondary CTA).

</domain>

<decisions>
## Implementation Decisions

### NavigateToBike Entry Point & Navigation Model

- **D-01:** BikeDetailSheet gets a secondary "Get Directions" button placed below the existing "Book Bike" primary CTA. "Book Bike" remains dominant. "Get Directions" is a softer secondary action — user can navigate to the bike without committing to book.
- **D-02:** Tapping "Get Directions" opens a new **NavStack** modal (same `presentation: 'modal'` pattern as BookingStack/RideStack) from RootNavigator. NavStackParamList screens: `NavigateToBike: { bike: Bike }` → `WalkingDirections: { bike: Bike }`.
- **D-03:** NavigateToBike screen layout: MapView fills the full screen. A floating ETA card (semi-transparent dark background, same style as ActiveRide's overlay) is pinned at the top — shows bike name, "X min walk — Y m", and a "View Turn-by-Turn" button. Map is non-interactive during navigation (no booking flow triggered).
- **D-04:** WalkingDirections shows a FlatList of 3–5 mock hardcoded turn-by-turn steps (e.g., "Head north on Damrak", "Turn left onto Nieuwendijk", "Arrive at your bike — left side of the street"). Each step has a direction icon (MaterialCommunityIcons: `arrow-up`, `arrow-left-bottom`, `flag-checkered` for arrival) and distance label.

### SafetyMount Insertion

- **D-05:** SafetyMount is inserted as the **first screen in RideStack** (before ActiveRide). Updated RideStack order: `SafetyMount: { bike: Bike }` → `ActiveRide: { bike: Bike }` → `PaymentSummary` → `RideReceipt`. UnlockSuccessScreen's "Start Ride" CTA navigates to `RideStack/SafetyMount` instead of `RideStack/ActiveRide`.
- **D-06:** SafetyMount shows 4–5 interactive checklist items the user taps to check: "Helmet secured", "Brakes tested", "Lights working", "App tracking active", "Ready to ride". The "Start Ride" PrimaryButton is disabled until all items are checked. Tapping "Start Ride" navigates to ActiveRide.

### Charging Screens Entry Point

- **D-07:** RideReceipt gets a secondary "Find a Charging Station" CTA below the primary "Done" button. Tapping "Find a Charging Station" dismisses RideStack (via `navigation.getParent()?.goBack()`) and then opens a new **ChargeStack** modal. ChargeStack screens: `EndRideFindCharging: undefined` → `RidingToCharging: { chargerName: string; location: { latitude: number; longitude: number } }`.
- **D-08:** EndRideFindCharging shows a MapView centered on the user's last known location (same mock Amsterdam coords as Phase 2 fallback). 3–5 mock charging station pins with a bolt/lightning icon (distinct from bike pins). Tapping a charger pin shows a small info card: station name + distance + "Navigate Here" CTA that pushes to RidingToCharging.
- **D-09:** RidingToCharging reuses the exact same screen pattern as NavigateToBike: MapView fullscreen + floating ETA card at top (charger name, "X min walk — Y m") + mock polyline route. No new unique components needed.

### Route Visualization (Mock)

- **D-10:** Route polyline: 3–4 hardcoded intermediate lat/lng waypoints between the user's location and the destination, creating a slightly curved path. Passed as a coordinate array to react-native-maps `<Polyline>`. Looks like a realistic walking route.
- **D-11:** ETA formula: `Math.round(haversineKm(userLat, userLon, destLat, destLon) / 5 * 60)` minutes (5 km/h walking speed). Distance display: `(haversineKm * 1000).toFixed(0)` meters. Reuses the `haversineKm` function already defined in `MapScreen.tsx`. Display format: "8 min walk — 620 m".
- **D-12:** Polyline style: `strokeColor: '#C6FF2D'` (Electric Green, DSColors.primary), `strokeWidth: 4`. Consistent with the app's primary accent color.

### Claude's Discretion

- Exact mock waypoint coordinates for each route (depends on mock bike/charger positions — choose coordinates near Amsterdam that create a plausible street-following path)
- MaterialCommunityIcons icon name for charger pins (e.g., `ev-station`, `lightning-bolt`, `flash`)
- Whether NavStack and ChargeStack are two separate modal stacks in RootNavigator or share a single "ExtraStack" — keep navigation.ts clean either way
- Direction icons for WalkingDirections step types (turn left, turn right, straight, arrive)
- Exact mock charger station names and coordinates (3–5 stations within 1–2 km of Amsterdam mock user location)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Navigation Types & Routing
- `VoltVenture/src/types/navigation.ts` — RideStackParamList (add SafetyMount), RootStackParamList (add NavStack + ChargeStack), add NavStackParamList + ChargeStackParamList
- `VoltVenture/src/navigation/RootNavigator.tsx` — add NavStack and ChargeStack with `presentation: 'modal'` (mirror BookingStack/RideStack pattern)
- `VoltVenture/src/navigation/RideNavigator.tsx` — add SafetyMount as first screen before ActiveRide

### Integration Points (screens that change)
- `VoltVenture/src/components/map/BikeDetailSheet.tsx` — add secondary "Get Directions" button below "Book Bike"
- `VoltVenture/src/screens/booking/UnlockSuccessScreen.tsx` — update "Start Ride" navigation target from `RideStack/ActiveRide` to `RideStack/SafetyMount`
- `VoltVenture/src/screens/ride/RideReceiptScreen.tsx` — add secondary "Find a Charging Station" CTA below "Done"

### Map & Location Patterns
- `VoltVenture/src/screens/app/MapScreen.tsx` — haversineKm function (reuse for ETA), MapView + Marker pattern, mock location fallback (Amsterdam 52.3676, 4.9041)
- `VoltVenture/src/screens/ride/ActiveRideScreen.tsx` — floating overlay card pattern (semi-transparent dark, pinned top), full-screen MapView with StyleSheet.create

### Design System & Styling
- `VoltVenture/src/theme/theme.ts` — DSColors (primary #C6FF2D, textOnPrimary #0F0F0F, background, surface, border, textSecondary), DSTypography
- Design system reference: https://volt-venture-design-system.vercel.app/ — tokens and component patterns

### Prior Phase Context (patterns to follow)
- `.planning/phases/04-active-ride-and-payment/04-CONTEXT.md` — full-screen map pattern, floating overlay card, modal stack pattern, StyleSheet.create convention
- `.planning/phases/06-security-and-verification/06-CONTEXT.md` — custom header pattern (back + centered title + width:40 spacer), PrimaryButton disabled state pattern

### Project Decisions
- `.planning/PROJECT.md` — key decisions table (StyleSheet.create convention, mock approach, textOnPrimary = #0F0F0F)
- `.planning/ROADMAP.md` — Phase 7 goal and success criteria (NAV-01, NAV-02, RIDE-05, RIDE-06, RIDE-07)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `haversineKm` function in `MapScreen.tsx` — reuse directly for ETA calculation in NavigateToBike and RidingToCharging
- `react-native-maps` `MapView` + `Marker` — already installed and used; add `Polyline` from same package for route rendering
- `PrimaryButton` (`src/components/common/PrimaryButton.tsx`) — "Start Ride" on SafetyMount (with disabled prop), "Navigate Here" on charger info card
- `MaterialCommunityIcons` — already imported in map components and account screens
- ActiveRide floating overlay card pattern (`rgba(15,15,15,0.85)` semi-transparent, pinned top) — reuse for NavigateToBike and RidingToCharging ETA card
- `expo-location` — already installed; use mock fallback (Amsterdam coords) same as MapScreen

### Established Patterns
- `StyleSheet.create` + `DSColors` — all map/navigation/complex screens (NOT NativeWind)
- Modal stack pattern (`presentation: 'modal'`, `headerShown: false`) for all new stacks
- Custom header (back button left + centered title + `width: 40` spacer right) — from SettingsScreen/ProfileScreen; reuse for SafetyMount, WalkingDirections
- `SafeAreaView` wrapping every screen root
- `StackScreenProps<ParamList, 'ScreenName'>` for screen prop types
- `headerShown: false` on all screens that use custom headers

### Integration Points
- `BikeDetailSheet.tsx` — add secondary button; passes `bike` object (already available in the sheet) to NavStack navigation call
- `UnlockSuccessScreen.tsx` — change `navigate('RideStack', { screen: 'ActiveRide', params: { bike } })` → `navigate('RideStack', { screen: 'SafetyMount', params: { bike } })`
- `RideReceiptScreen.tsx` — add secondary CTA that dismisses RideStack then opens ChargeStack modal
- `RideNavigator.tsx` — add SafetyMount as the first `Stack.Screen` before ActiveRide

</code_context>

<specifics>
## Specific Ideas

- WalkingDirections mock steps (Amsterdam-flavored): "Head north on Damrak", "Turn left onto Nieuwendijk", "Continue straight for 200 m", "Turn right onto Warmoesstraat", "Arrive at your bike — right side of the street"
- Mock charger station names: "VoltHub Central", "Dam Square Charger", "Waterlooplein Station", "Leidseplein EV Point", "Vondelpark Charge Bay"
- ETA display format: "8 min walk — 620 m" (on ETA card) / "~ 8 min" (condensed fallback)
- NavStack and ChargeStack: if using two separate modal stacks, name them `NavStack` and `ChargeStack` in RootStackParamList for clarity

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 7-Navigation & Ride Extras*
*Context gathered: 2026-08-19*
