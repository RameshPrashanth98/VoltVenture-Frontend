---
phase: 09-discovery-and-content
plan: 02
status: complete
completed_at: "2026-08-19T16:30:00Z"
---

# Plan 09-02 Summary — Discover Tab Screens

## Deliverables

### DiscoverScreen.tsx (created)
- `SafeAreaView edges=['bottom']` + `ScrollView`
- Screen title "Discover" using DSTypography.heading (20px weight 600)
- EXPLORE section: 2 rows — "Curated Routes" (map-route icon) + "VIP Hubs" (lightning-bolt-circle icon)
- INFO section: 3 rows — "Support & Help", "Privacy Policy", "Terms of Service"
- Last row in each section has `borderBottomWidth: 1`
- Section headers: 13px weight 600 uppercase letterSpacing 0.8 DSColors.textSecondary
- All rows: `accessibilityRole="button"`, icon size 20, text 15px weight 400

### CuratedRoutesScreen.tsx (created)
- Custom header matching VoltCoinsRewardsScreen pattern, title "Curated Routes"
- MOCK_ROUTES: 5 items (Canal Ring Classic, Vondelpark Loop, Harbor Views Ride, Amstel Riverside Run, Noord Cross)
- FlatList with `ItemSeparatorComponent` height 12 (transparent)
- Route cards: name (20px w600), difficulty badge, distance row, Chip tags
- Difficulty badge colors: Easy rgba(125,146,32,0.12)/DSColors.accent, Moderate rgba(255,152,0,0.12)/#E65100, Challenging rgba(176,0,32,0.12)/DSColors.destructive
- Snackbar in Portal: "Route details coming soon", duration 2500

### VipHubsScreen.tsx (created)
- MapView fixed height `MAP_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45)`
- FlatList `style={{ flex: 1 }}` filling remaining space
- `getItemLayout` with `ITEM_HEIGHT = 108`
- MOCK_HUBS: 5 items (h3 Leidseplein = Full, all others Available)
- Hub markers: DSColors.primary bg, DSColors.textOnPrimary border + icon, star-circle, tracksViewChanges=false
- Inline expand/collapse: expandedHubId state
- Expanded content: description, 3 amenity rows (check-circle DSColors.accent), hours, PrimaryButton "Get Directions"
- Cross-stack navigation via `useNavigation<StackNavigationProp<RootStackParamList>>()` → NavStack/NavigateToPoi
- VIP badge: DSColors.primary bg, DSColors.textOnPrimary text
- Status badge Available: rgba(125,146,32,0.12)/DSColors.accent; Full: rgba(176,0,32,0.12)/DSColors.destructive

### DiscoverNavigator.tsx (updated)
- Replaced DiscoverMain, CuratedRoutes, VipHubs stubs with real imported components
- Support, PrivacyPolicy, TermsOfService remain as stubs (to be replaced in Plan 09-03)

## Verification
- ✅ DiscoverScreen: EXPLORE (2 rows) and INFO (3 rows) sections with correct icons
- ✅ CuratedRoutesScreen: MOCK_ROUTES 5 items, Snackbar "Route details coming soon", Portal wrapped
- ✅ VipHubsScreen: MOCK_HUBS 5 items, expandedHubId, flatListRef, mapRef, getItemLayout, NavigateToPoi
- ✅ DiscoverNavigator: DiscoverScreen + CuratedRoutesScreen + VipHubsScreen as real imports
