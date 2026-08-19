# Phase 9: Discovery & Content - Context

**Gathered:** 2026-08-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 9 delivers: (1) a new **Discover tab** (3rd tab, compass icon) in AppTabs with a section-rows home screen — "Explore" (Curated Routes, VIP Hubs) and "Info" (Support, Privacy Policy, Terms of Service); (2) **CuratedRoutes screen** (route cards with distance, difficulty, and highlights); (3) **VipHubs screen** (map top ~45% + scrollable FlatList of inline-expanding hub cards); (4) **CafeDetailSheet** (bottom sheet on MapScreen — triggered by new café pins, shows name, hours, distance, photo header, "Get Directions" CTA); (5) **SupportScreen** (React Native Paper List.Accordion FAQ + "Contact Support" Snackbar stub); (6) **PrivacyPolicyScreen** and **TermsOfServiceScreen** (hardcoded ScrollView with section headers + paragraph text).

New navigation route `NavigateToPoi` added to `NavStackParamList`. No new navigator stacks — Discover tab gets its own `DiscoverStack` registered in `AppTabParamList`. Café detail is a bottom sheet, not a full screen (no new screen route). All screens are frontend-only with mocked/hardcoded data.

</domain>

<decisions>
## Implementation Decisions

### Discover Tab — Navigation Architecture

- **D-01:** Add a 3rd tab to `AppTabs`: Map | Discover | Account. Icon: `compass` (active) / `compass-outline` (inactive). Label: "Discover". Register a new `DiscoverStack` in `AppTabParamList`.
- **D-02:** Discover home screen (`DiscoverScreen`) uses section rows — two sections:
  - "Explore" section: "Curated Routes" row → `CuratedRoutes`, "VIP Hubs" row → `VipHubs`
  - "Info" section: "Support & Help" row → `Support`, "Privacy Policy" row → `PrivacyPolicy`, "Terms of Service" row → `TermsOfService`
  - Menu-row style: identical to `AccountScreen` (icon + label + chevron-right, `DSColors.surface` background, border top/bottom).
- **D-03:** Cafés are NOT accessible from the Discover tab. Café pins are the only entry point — surfaced spatially on MapScreen. Discover home has no café row.

### Café Entry Point — Map & Sheet

- **D-04:** MapScreen gets a new marker type: café/POI markers. Each rendered with a café-marker component (same circular shape as BikeMarker, `coffee` icon from MaterialCommunityIcons, white/bordered background — visually distinct from Electric Green bike pins).
- **D-05:** Tapping a café pin opens a `CafeDetailSheet` as a `@gorhom/bottom-sheet` — same mounting pattern as `BikeDetailSheet`. Content: photo placeholder (static image or colored block), café name, opening hours, distance from user (haversineKm), "Get Directions" primary CTA.
- **D-06:** "Get Directions" in CafeDetailSheet dismisses the sheet and navigates to `NavStack/NavigateToPoi: { name: string; location: { latitude: number; longitude: number } }`. This is a new screen added to `NavStackParamList` and `NavNavigator` — mirrors NavigateToBike but accepts a generic named destination. `NavigateToBike` and `WalkingDirections` (Phase 7) are untouched.

### VIP Hubs Screen — Layout & Content

- **D-07:** `VipHubsScreen` layout: `MapView` in the top ~45% of the screen (non-interactive, shows hub pins), `FlatList` of hub cards in the lower ~55%. Tapping a map pin scrolls the FlatList to that hub's card and expands it; tapping a list card focuses the map on that pin.
- **D-08:** Hub cards use **inline expand**: collapsed shows hub name, distance, "VIP" badge, status (Available / Full). Expanded reveals: description paragraph, amenities list (fast charge, covered parking, 24h access), operating hours, "Get Directions" CTA (opens `NavigateToPoi`).
- **D-09:** VIP hubs are **premium e-bike stations** (fast-charging + premium covered parking). 3–5 mock hubs with Amsterdam-area coordinates. Hub pins use a distinct icon (e.g., `lightning-bolt` or `star-circle`) and distinct color from bike pins and café pins.

### Curated Routes Screen — Layout

- **D-10:** `CuratedRoutesScreen` shows a `FlatList` of route cards. Each card shows: route name, distance (km), difficulty badge (Easy / Moderate / Challenging), and 1–2 highlight tags (e.g., "Waterfront", "Historic"). No map on this screen — list only. Tapping a route card is a no-op (or shows a Snackbar "Route details coming soon") — no new detail screen.
- **D-11:** 4–5 mock curated routes with Amsterdam-flavored names (e.g., "Canal Ring Classic", "Vondelpark Loop", "Harbor Views Ride").

### Support Screen — FAQ & Contact

- **D-12:** `SupportScreen` uses `React Native Paper` `List.Accordion` inside a `ScrollView`. 6–8 hardcoded FAQ items grouped in 2–3 sections (e.g., "Rides & Billing", "Account", "Bikes & Safety"). No search bar — static accordion only.
- **D-13:** At the bottom of `SupportScreen`: a "Contact Support" primary CTA (or menu row) that shows a `Snackbar` "Support chat coming soon". No external link, no email deep-link.

### Privacy Policy & Terms of Service

- **D-14:** `PrivacyPolicyScreen` and `TermsOfServiceScreen` are identical in structure: a `ScrollView` with 3–4 section headers (e.g., "Data We Collect", "How We Use Data", "Your Rights") and paragraph text under each. Content is hardcoded — no WebView, no external URLs.
- **D-15:** Both screens are accessible from the "Info" section of the Discover home screen.

### Claude's Discretion

- Exact café mock data (names, hours, coordinates) — choose Amsterdam-area cafés near the mock bike locations
- CuratedRoutesScreen card visual treatment (card elevation, color accent for difficulty badge)
- VIP hub mock names and coordinates (3–5 stations near Amsterdam mock user location)
- FAQ question/answer content (choose realistic e-bike rental FAQs)
- Privacy Policy and Terms of Service body text (realistic GDPR-style placeholder content)
- VIP hub pin icon and color (distinct from bike pins `#C6FF2D` and café pins `white/bordered`)
- Whether `NavigateToPoi` screen reuses the same component body as `NavigateToBike` or is a genuinely separate file
- Whether map in VipHubsScreen uses `StyleSheet.create` fixed height or `flex` fraction

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Navigation Architecture (must update)

- `VoltVenture/src/navigation/AppTabs.tsx` — add 3rd Discover tab; register `DiscoverStack`
- `VoltVenture/src/types/navigation.ts` — add `DiscoverStackParamList` (DiscoverMain, CuratedRoutes, VipHubs, Support, PrivacyPolicy, TermsOfService); add `NavigateToPoi` to `NavStackParamList`; add `Discover: NavigatorScreenParams<DiscoverStackParamList>` to `AppTabParamList`
- `VoltVenture/src/navigation/NavNavigator.tsx` — add `NavigateToPoi` screen (Phase 7 file — minimal touch)
- `VoltVenture/src/navigation/RootNavigator.tsx` — no change needed (DiscoverStack lives inside AppTabs, not as a modal)

### MapScreen Integration (must update)

- `VoltVenture/src/screens/app/MapScreen.tsx` — add café/POI mock data array, render café markers alongside bike markers, wire café marker tap to open `CafeDetailSheet`
- `VoltVenture/src/components/map/BikeDetailSheet.tsx` — read for bottom sheet mounting pattern (`useRef<BottomSheetModal>`, `snapPoints`, `BottomSheetBackdrop`, `present()`/`dismiss()`) to replicate in CafeDetailSheet
- `VoltVenture/src/components/map/BikeMarker.tsx` — read for circular marker shape to replicate as CaféMarker

### Phase 7 Navigation (NavigateToPoi addition)

- `VoltVenture/src/screens/navigation/NavigateToBikeScreen.tsx` — read for screen structure to replicate in NavigateToPoi
- `.planning/phases/07-navigation-ride-extras/07-CONTEXT.md` — D-10, D-11, D-12 (polyline style, ETA formula, haversineKm reuse)

### Design System & Styling

- `VoltVenture/src/theme/theme.ts` — DSColors, DSTypography
- Design system reference: https://volt-venture-design-system.vercel.app/ — component tokens
- `VoltVenture/src/screens/app/AccountScreen.tsx` — menu-row pattern to replicate in DiscoverScreen
- `VoltVenture/src/screens/app/RideHistoryScreen.tsx` — FlatList with ListEmptyComponent + ItemSeparatorComponent pattern

### Prior Phase Context

- `.planning/phases/08-payments-and-rewards/08-CONTEXT.md` — AccountScreen menu-row pattern, Snackbar feedback pattern, FlatList patterns
- `.planning/phases/07-navigation-ride-extras/07-CONTEXT.md` — NavStack, NavigateToBike, polyline, ETA card patterns
- `.planning/phases/06-security-and-verification/06-CONTEXT.md` — custom header pattern, PrimaryButton disabled state, List.Accordion usage check
- `.planning/PROJECT.md` — key decisions (StyleSheet.create, mock approach, textOnPrimary = #0F0F0F)

### Project & Planning

- `.planning/ROADMAP.md` — Phase 9 goal, plans (09-01, 09-02, 09-03), success criteria (DISC-05, DISC-06, DISC-07, CONT-01, CONT-02, CONT-03)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `@gorhom/bottom-sheet` `BottomSheetModal` — already installed and used in `BikeDetailSheet` and `FilterSheet`; replicate mounting pattern for `CafeDetailSheet`
- `haversineKm` function in `MapScreen.tsx` — reuse for café distance and NavigateToPoi ETA calculation
- `MapView` + `Marker` from `react-native-maps` — already installed; add café marker layer alongside bike markers
- `MaterialCommunityIcons` — `coffee` for café pins, `lightning-bolt` or `star-circle` for VIP hub pins
- `List.Accordion` and `List.Section` from `react-native-paper` — already installed; use for SupportScreen FAQ
- `Snackbar` from `react-native-paper` — already used in Phase 8 screens; use for "Contact Support coming soon" and "Route details coming soon"
- `PrimaryButton` (`src/components/common/PrimaryButton.tsx`) — "Get Directions" CTA in CafeDetailSheet and expanded VIP hub card
- `FlatList` with `ListEmptyComponent` + `ItemSeparatorComponent` — pattern from `RideHistoryScreen`
- `AccountScreen.tsx` menu-row style (icon + label + chevron-right, `DSColors.surface` bg, border) — replicate in DiscoverScreen

### Established Patterns

- `StyleSheet.create` + `DSColors` — all screens in this phase (no NativeWind)
- `SafeAreaView` wrapping every screen root
- `StackScreenProps<ParamList, 'ScreenName'>` for screen prop types
- Custom header: back button left + centered title + `width: 40` spacer right — for CuratedRoutes, VipHubs, Support, PrivacyPolicy, TermsOfService
- `headerShown: false` on screens using custom headers
- Mock data as local const arrays in service files or inline in screen files — consistent with all prior phases

### Integration Points

- `AppTabs.tsx` — add 3rd tab (Discover) with compass icon + DiscoverNavigator
- `MapScreen.tsx` — new café markers layer + CafeDetailSheet ref wiring (adds ~30-50 lines alongside existing bike marker logic)
- `NavNavigator.tsx` — add `NavigateToPoi` as a new `Stack.Screen` (minimal touch to Phase 7 file)
- `navigation.ts` — add `DiscoverStackParamList`, `NavigateToPoi` to `NavStackParamList`, update `AppTabParamList`

</code_context>

<specifics>
## Specific Ideas

- Discover tab order: Map (map-marker icon) | Discover (compass icon) | Account (account-circle icon) — Discover in the middle
- Discover home section headers: "Explore" and "Info" — same uppercase 12px `textSecondary` letterSpacing style as PaymentMethodsScreen section headers
- Café mock data (4–5 cafés near Amsterdam): "Café de Jaren", "Screaming Beans", "Lot Sixty One Coffee", "Headfirst Coffee", "Black Gold Coffee" — with mock hours and coordinates near Amsterdam canal area
- CuratedRoutes mock data: "Canal Ring Classic" (12 km, Easy), "Vondelpark Loop" (8 km, Easy), "Harbor Views Ride" (18 km, Moderate), "Amstel Riverside Run" (22 km, Moderate), "Noord Cross" (28 km, Challenging)
- VIP hub mock data: "VoltHub Central Station" (Available), "Dam Square VoltHub" (Available), "Leidseplein VoltHub" (Full), "Waterlooplein VoltHub" (Available), "Vondelpark VoltHub" (Available)
- FAQ sections: "Rides & Billing" (How do I start a ride? How am I charged? How do I end a ride?), "Account" (How do I reset my password? How do I add a payment method?), "Bikes & Safety" (What if the bike doesn't unlock? What should I do in an emergency?)
- NavigateToPoi screen: identical to NavigateToBike except params are `{ name: string; location: { latitude: number; longitude: number } }` instead of `{ bike: Bike }` — display `name` where NavigateToBike displayed `bike.name`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 9-Discovery & Content*
*Context gathered: 2026-08-19*
