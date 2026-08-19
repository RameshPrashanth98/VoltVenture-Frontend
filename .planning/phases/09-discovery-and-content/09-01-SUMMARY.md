---
phase: 09-discovery-and-content
plan: 01
status: complete
completed_at: "2026-08-19T16:00:00Z"
---

# Plan 09-01 Summary — Navigation Foundation + Café Map Integration

## Deliverables

### navigation.ts
- Added `DiscoverStackParamList` (6 routes: DiscoverMain, CuratedRoutes, VipHubs, Support, PrivacyPolicy, TermsOfService)
- Added `Discover: NavigatorScreenParams<DiscoverStackParamList>` to `AppTabParamList` (between Map and Account)
- Added `NavigateToPoi: { name: string; location: { latitude: number; longitude: number } }` to `NavStackParamList`

### DiscoverNavigator.tsx (created)
- Stack navigator with 6 screens, all `headerShown: false`
- Placeholder stubs for all screens pending Wave 2 replacement

### AppTabs.tsx (updated)
- Imported DiscoverNavigator
- Added Tab.Screen "Discover" between Map and Account with compass/compass-outline icon

### NavNavigator.tsx (updated)
- Registered `Stack.Screen name="NavigateToPoi"` with NavigateToPoiScreen

### NavigateToPoiScreen.tsx (stub created)
- One-line stub at `src/screens/navigation/NavigateToPoiScreen.tsx` to avoid import error

### CafeMarker.tsx (created)
- White circle (DSColors.background) with DSColors.border border
- coffee icon with DSColors.textPrimary color
- White tail (DSColors.background)

### CafeDetailSheet.tsx (created)
- Null guard: `if (!cafe) return null`
- Inline haversineKm function with "not exported" comment
- Photo placeholder height 160, coffee icon
- Drag handle, café name, hours row, distance row, PrimaryButton "Get Directions"
- Props: `{ cafe: Cafe | null; userLocation: ...; onGetDirections: () => void }`

### MapScreen.tsx (updated)
- MOCK_CAFES array with 5 entries (Café de Jaren → Black Gold Coffee)
- `selectedCafe` state, `cafeDetailRef`, `cafeSnapPoints = ['55%']`
- `handleCafeMarkerPress` callback
- Café Marker render loop inside MapView (tracksViewChanges=false)
- CafeDetailSheet BottomSheetModal after BikeDetailSheet
- `onGetDirections` navigates to NavStack/NavigateToPoi with name + location params
- Reuses existing `renderBackdrop` (no duplicate useCallback)

## Verification
- ✅ navigation.ts: DiscoverStackParamList, NavigateToPoi, Discover tab all present
- ✅ AppTabs.tsx: Discover tab with compass icon between Map and Account
- ✅ DiscoverNavigator.tsx: 6 Stack.Screen entries, headerShown false
- ✅ NavNavigator.tsx: NavigateToPoi registered
- ✅ CafeMarker.tsx: DSColors.background circle, coffee icon
- ✅ CafeDetailSheet.tsx: null guard, haversineKm, BottomSheetView, photo placeholder h=160
- ✅ MapScreen.tsx: MOCK_CAFES (5 items, Café de Jaren present), cafeDetailRef, NavigateToPoi navigate
