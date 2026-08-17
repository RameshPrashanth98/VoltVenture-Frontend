# Phase 2: Bike Discovery - Context

**Gathered:** 2026-08-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the MapScreen placeholder with a fully interactive bike discovery experience: a live map showing pinned available e-bikes, a bottom sheet with bike details on pin tap, a filter modal, and a list view fallback sorted by distance. All bike data is mocked — no real API. This phase builds on the AppTabs navigation and DS tokens established in Phase 1.

</domain>

<decisions>
## Implementation Decisions

### Map Library
- **D-01:** Map library: `react-native-maps` (battle-tested, Expo config plugin, large community)
- **D-02:** Map tiles: default react-native-maps behavior — Apple Maps on iOS, Google Maps on Android. No Google Maps API key required on iOS.

### Bike Pin Style
- **D-03:** Bike pins use a custom branded marker: small circular marker in Electric Green (#C6FF2D) with a bolt/bike icon inside, plus a pin tail. Implemented as a react-native View passed to `<Marker>`.
- **D-04:** No clustering — individual pins always visible. Simpler implementation and appropriate for the mock data set size (10–30 bikes).

### Detail Bottom Sheet
- **D-05:** Tapping a bike pin opens a bottom sheet (slide-up panel). The map remains fully visible above the sheet — tourist can see where the bike is while reading its details.
- **D-06:** Bottom sheet content (minimal): drag handle, Bike ID/name, bike type, then three stat chips — battery %, price/min, distance from user — followed by a primary "Reserve" button. No photo needed in Phase 2.
- **D-07:** Tapping a bike row in list view opens the same bottom sheet as the map pin — reuse the same component.

### Filter Modal
- **D-08:** A filter icon button sits at the top-right of the map view. Tapping it opens a bottom sheet/modal with all filter controls. The map stays clean until filters are needed.
- **D-09:** Filter controls use segmented chip selectors (not sliders):
  - Battery level: Low / Med / High
  - Price range: Low / Med / High
  - Bike type: Standard / Speed / Cargo
  - "Apply filters" primary button closes the modal and updates the map pins.

### List View
- **D-10:** A FAB ("List view") is overlaid on the map. Tapping it switches to the list view. The list view has a "Map" button in the header to switch back.
- **D-11:** List view shows bikes sorted by distance (nearest first). Each bike is a compact two-row card: top row — bolt icon, Bike ID, bike type; bottom row — battery %, distance. Tapping opens the same bottom sheet.

### Claude's Discretion
- Bottom sheet library choice (react-native-bottom-sheet, @gorhom/bottom-sheet, or a simple Modal + Animated.Value approach — whichever is most compatible with Expo SDK 57)
- Exact FAB position and styling (bottom-right quadrant, DS-themed)
- Empty state UI when no bikes match active filters
- Location permission request UX (prompt text and timing)
- Mock data structure and quantity (10–20 bikes spread around a sample location)
- Map initial region / camera position (center on user location mock, reasonable zoom)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `https://volt-venture-design-system.vercel.app/` — VoltVenture design system site. Extract color tokens, typography scale, spacing, and component variants. All UI must conform to this system. Key token: Electric Green #C6FF2D for bike pins and primary actions.

### Project Planning
- `.planning/PROJECT.md` — Project context, constraints, core value, and tech stack decisions
- `.planning/REQUIREMENTS.md` — v1 requirements with REQ-IDs (DISC-01 through DISC-04 are in scope for this phase)
- `.planning/ROADMAP.md` — Phase goals and success criteria

### Phase 1 Context (prior decisions)
- `.planning/phases/01-foundation-and-authentication/01-CONTEXT.md` — Navigation architecture (AppTabs, MapScreen placeholder), DS token integration, component patterns established in Phase 1

### Libraries (Phase 2)
- react-native-maps (Expo config plugin) — MapView, Marker, custom marker views
- Expo SDK 57 docs: https://docs.expo.dev/versions/v57.0.0/ — check for react-native-maps Expo compatibility notes
- React Native Paper: https://callstack.github.io/react-native-paper/ — Surface, Chip, FAB, Modal components for filter UI and list cards

### Existing Codebase
- `VoltVenture/src/screens/app/MapScreen.tsx` — current placeholder to be replaced
- `VoltVenture/src/navigation/AppTabs.tsx` — Map tab wiring (MapScreen is already the Map tab)
- `VoltVenture/src/theme/theme.ts` — DSColors, DSTypography tokens
- `VoltVenture/src/components/common/PrimaryButton.tsx` — reuse for Reserve button in bottom sheet

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PrimaryButton` (`src/components/common/PrimaryButton.tsx`): DS-themed primary button — use as the "Reserve" CTA in the bike detail bottom sheet
- `DSColors`, `DSTypography` from `src/theme/theme.ts`: already imported across all screens — use same pattern in Phase 2 screens
- `AppTabs.tsx`: Map tab already wired to `MapScreen` — no navigation change needed, just replace the MapScreen content

### Established Patterns
- StyleSheet.create with DSColors/DSTypography inline (no NativeWind on complex map screens — use StyleSheet)
- SafeAreaView wrapping for all app screens
- `MaterialCommunityIcons` for icon usage (already a dependency via @expo/vector-icons)

### Integration Points
- `MapScreen.tsx` is the direct replacement target — Phase 2 rewrites this file
- AppTabs Map tab: no changes to AppTabs.tsx needed
- Navigation: "Reserve" button in the bottom sheet will need to navigate to Phase 3 booking flow — stub the onPress with a console.log or TODO comment for now
- Mock bike data: create a `src/services/bikeService.ts` (matching the authService.ts pattern) that returns a hardcoded array of bikes

</code_context>

<specifics>
## Specific Ideas

- Bike markers: Electric Green (#C6FF2D) circle with a bolt icon — use MaterialCommunityIcons `lightning-bolt` or similar inside the custom marker View
- Bottom sheet drag handle: small rounded rectangle at the top of the sheet (standard iOS/Android pattern)
- Filter button position: top-right corner of the map, styled as a small RNP IconButton
- The "Reserve" button in the bottom sheet is a stub for Phase 3 — it should show a TODO/placeholder state, not navigate anywhere yet
- Mock bikes should be spread around a realistic tourist city location (e.g., Amsterdam city centre) to make the map feel real

</specifics>

<deferred>
## Deferred Ideas

- Bike pin clustering — potential Phase 2 iteration or v2 enhancement if bike count grows
- Real-time bike availability updates (WebSocket/polling) — backend integration phase
- Route/navigation to a selected bike — Phase 3 or later
- Saved/favourite bikes — v2
- "Bike photos" in the detail sheet — deferred (not in Phase 2 scope)

</deferred>

---

*Phase: 2-Bike Discovery*
*Context gathered: 2026-08-17*
