# Phase 9: Discovery & Content — Research

**Researched:** 2026-08-19
**Domain:** React Native navigation (tab + stack), @gorhom/bottom-sheet, react-native-maps, React Native Paper (List.Accordion, Snackbar, Chip), FlatList with scrollToIndex, StyleSheet.create + DSColors
**Confidence:** HIGH — all findings sourced from direct codebase inspection of prior phases

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** 3rd tab added to AppTabs: Map | Discover | Account. Icon `compass` (active) / `compass-outline` (inactive). Label "Discover". Register `DiscoverStack` in `AppTabParamList`.
- **D-02:** DiscoverScreen uses section rows — "Explore" (Curated Routes, VIP Hubs) + "Info" (Support & Help, Privacy Policy, Terms of Service). Menu-row style identical to AccountScreen.
- **D-03:** Cafés are NOT accessible from Discover tab. Café pins are the only entry point — spatial only on MapScreen.
- **D-04:** MapScreen gets café/POI markers. CafeMarker: circular, `coffee` icon, white/bordered (visually distinct from Electric Green bike pins).
- **D-05:** Tapping a café pin opens `CafeDetailSheet` — same mounting pattern as BikeDetailSheet. Content: photo placeholder, café name, hours, distance, "Get Directions" PrimaryButton.
- **D-06:** "Get Directions" in CafeDetailSheet dismisses sheet + navigates to `NavStack/NavigateToPoi: { name: string; location: { latitude: number; longitude: number } }`. NavigateToBike and WalkingDirections are untouched.
- **D-07:** VipHubsScreen — MapView top ~45% (fixed height), FlatList lower ~55%. Tapping pin scrolls FlatList + expands card; tapping list card focuses map.
- **D-08:** Hub cards use inline expand — collapsed shows name, distance, "VIP" badge, status. Expanded adds description, amenities, hours, "Get Directions" CTA.
- **D-09:** 3–5 mock VIP hubs with Amsterdam coordinates.
- **D-10:** CuratedRoutesScreen — FlatList of route cards, no map, tapping card shows Snackbar "Route details coming soon".
- **D-11:** 4–5 mock curated routes with Amsterdam-flavored names.
- **D-12:** SupportScreen — List.Accordion inside ScrollView, 6–8 FAQ items in 2–3 sections.
- **D-13:** "Contact Support" CTA at bottom shows Snackbar "Support chat coming soon".
- **D-14:** PrivacyPolicyScreen + TermsOfServiceScreen — ScrollView, 3–4 section headers + paragraphs, hardcoded content.
- **D-15:** Both legal screens accessible from "Info" section of DiscoverScreen.

### Claude's Discretion

- Exact café mock data (names, hours, coordinates)
- CuratedRoutesScreen card visual treatment
- VIP hub mock names and coordinates
- FAQ question/answer content
- Privacy Policy and Terms of Service body text
- VIP hub pin icon and color
- Whether NavigateToPoiScreen reuses same component body as NavigateToBike or is a separate file
- Whether VipHubsScreen map uses StyleSheet.create fixed height or flex fraction

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DISC-05 | Discover tab with section-row home screen | Navigation type changes + AccountNavigator pattern documented |
| DISC-06 | CuratedRoutes screen with route cards + FlatList | RideHistoryScreen FlatList pattern confirmed |
| DISC-07 | VipHubs screen with map top + FlatList + inline expand | EndRideFindChargingScreen map pattern + FlatList scrollToIndex documented |
| CONT-01 | CafeDetailSheet bottom sheet on MapScreen | BikeDetailSheet exact pattern extracted; MapScreen integration points listed |
| CONT-02 | NavigateToPoiScreen mirroring NavigateToBike | NavigateToBikeScreen structure fully documented |
| CONT-03 | SupportScreen FAQ + PrivacyPolicy + TermsOfService | Snackbar pattern from VoltCoinsRewardsScreen confirmed; List.Accordion not yet used (first occurrence) |
</phase_requirements>

---

## Summary

Phase 9 adds the Discover tab (3rd tab), a complete discovery experience (Curated Routes, VIP Hubs), café map integration with a bottom sheet, a new generic NavigateToPoi navigation screen, and three Info screens (Support FAQ, Privacy Policy, Terms of Service). Every deliverable is frontend-only with hardcoded mock data — no async calls, no new packages.

The codebase has already established every pattern needed for this phase. The most critical patterns are: the `BottomSheetModal` mounting pattern from `BikeDetailSheet.tsx` (replicate verbatim for `CafeDetailSheet`), the `AccountNavigator` stack navigator pattern (replicate for `DiscoverNavigator`), the `AccountScreen` menu-row style (replicate in `DiscoverScreen`), the `NavigateToBikeScreen` full-screen map structure (mirror for `NavigateToPoiScreen`), the `Snackbar` pattern from `VoltCoinsRewardsScreen` (replicate for route-tap and contact-support stubs), and the `FlatList` pattern from `RideHistoryScreen`.

**Primary recommendation:** Implement in 3 waves: (1) navigation skeleton (types + navigators + AppTabs), (2) map integration (CafeMarker + CafeDetailSheet + MapScreen wiring + NavigateToPoi), (3) Discover screens (DiscoverScreen + CuratedRoutes + VipHubs + Support + PrivacyPolicy + TermsOfService).

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Discover tab navigation | Frontend (AppTabs) | — | Tab navigator lives in AppTabs.tsx; DiscoverNavigator is a stack inside the tab |
| DiscoverScreen menu rows | Frontend (screen) | — | Pure UI, no data fetching — same pattern as AccountScreen |
| CuratedRoutes card list | Frontend (screen) | — | Hardcoded mock array, FlatList render |
| VipHubs map + list | Frontend (screen) | — | MapView (top 45%) + FlatList (bottom 55%) split layout, all mocked |
| Café pins on MapScreen | Frontend (MapScreen) | — | New Marker layer alongside existing bike markers |
| CafeDetailSheet | Frontend (MapScreen) | — | BottomSheetModal ref wired in MapScreen, component receives café data as prop |
| NavigateToPoi | Frontend (NavStack screen) | — | NavStack screen, receives params, renders map + polyline |
| SupportScreen FAQ | Frontend (screen) | — | List.Accordion + List.Section, static content |
| Legal screens | Frontend (screen) | — | ScrollView + hardcoded text, no data layer |

---

## Standard Stack

### Core (already installed — no new packages)

| Library | Installed Version | Purpose | Confirmed |
|---------|------------------|---------|-----------|
| `@react-navigation/bottom-tabs` | existing | Tab navigator for AppTabs 3rd tab | [VERIFIED: AppTabs.tsx line 2] |
| `@react-navigation/stack` | existing | Stack navigator for DiscoverNavigator + NavNavigator | [VERIFIED: NavNavigator.tsx line 2] |
| `@gorhom/bottom-sheet` | existing | CafeDetailSheet BottomSheetModal | [VERIFIED: MapScreen.tsx line 4] |
| `react-native-maps` | existing | MapView + Marker + Polyline | [VERIFIED: MapScreen.tsx line 5] |
| `react-native-paper` | existing | List.Accordion, List.Section, Snackbar, Chip, Portal | [VERIFIED: VoltCoinsRewardsScreen.tsx line 4] |
| `@expo/vector-icons` MaterialCommunityIcons | existing | All icons across all screens | [VERIFIED: BikeMarker.tsx line 3] |

**No new packages needed for Phase 9.** All capabilities are covered by the existing installed stack.

### Package Legitimacy Audit

No new packages are installed in Phase 9. This section is not applicable — all libraries were vetted in prior phases.

---

## Architecture Patterns

### Recommended Project Structure (new files)

```
src/
├── navigation/
│   └── DiscoverNavigator.tsx        # New stack navigator (mirrors AccountNavigator)
├── screens/
│   ├── discover/                    # New directory
│   │   ├── DiscoverScreen.tsx
│   │   ├── CuratedRoutesScreen.tsx
│   │   ├── VipHubsScreen.tsx
│   │   ├── SupportScreen.tsx
│   │   ├── PrivacyPolicyScreen.tsx
│   │   └── TermsOfServiceScreen.tsx
│   └── navigation/
│       └── NavigateToPoiScreen.tsx  # Mirrors NavigateToBikeScreen
└── components/
    └── map/
        ├── CafeMarker.tsx           # Mirrors BikeMarker (white circle + coffee icon)
        └── CafeDetailSheet.tsx      # Mirrors BikeDetailSheet (BottomSheetModal)
```

Files to modify:
- `src/types/navigation.ts` — add `DiscoverStackParamList`, add `NavigateToPoi` to `NavStackParamList`, add `Discover` to `AppTabParamList`
- `src/navigation/AppTabs.tsx` — add 3rd Discover tab
- `src/navigation/NavNavigator.tsx` — add `NavigateToPoiScreen`
- `src/screens/app/MapScreen.tsx` — add café data, CafeMarker renders, CafeDetailSheet ref

---

### Pattern 1: AppTabs — Adding the 3rd Discover Tab

**What:** Insert a `<Tab.Screen>` between Map and Account in AppTabs.tsx. Import DiscoverNavigator.
**When to use:** This is the only tab insertion in Phase 9.

The existing AppTabs structure has exactly 2 screens. The new order must be: Map (index 0), Discover (index 1), Account (index 2).

```typescript
// Source: VoltVenture/src/navigation/AppTabs.tsx (existing pattern)
// EXISTING — Map tab (keep exactly as-is):
<Tab.Screen
  name="Map"
  component={MapScreen}
  options={{
    tabBarLabel: 'Map',
    tabBarIcon: ({ focused, color, size }) => (
      <MaterialCommunityIcons
        name={focused ? 'map' : 'map-outline'}
        color={color}
        size={size}
      />
    ),
  }}
/>

// NEW — Discover tab (insert between Map and Account):
<Tab.Screen
  name="Discover"
  component={DiscoverNavigator}
  options={{
    tabBarLabel: 'Discover',
    tabBarIcon: ({ focused, color, size }) => (
      <MaterialCommunityIcons
        name={focused ? 'compass' : 'compass-outline'}
        color={color}
        size={size}
      />
    ),
  }}
/>

// EXISTING — Account tab (keep exactly as-is, just re-orders to 3rd position):
<Tab.Screen
  name="Account"
  component={AccountNavigator}
  options={{ ... }}
/>
```

**Critical:** The `AppTabParamList` type must be updated before the navigator can type-check.

---

### Pattern 2: Navigation Type Updates

**What:** Three changes to `navigation.ts` required.

```typescript
// Source: VoltVenture/src/types/navigation.ts (extends existing)

// 1. Add DiscoverStackParamList (new)
export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  CuratedRoutes: undefined;
  VipHubs: undefined;
  Support: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

// 2. Add NavigateToPoi to NavStackParamList (existing type, add one entry)
export type NavStackParamList = {
  NavigateToBike: { bike: Bike };
  WalkingDirections: { bike: Bike };
  NavigateToPoi: { name: string; location: { latitude: number; longitude: number } }; // NEW
};

// 3. Add Discover to AppTabParamList (existing type, add one entry)
export type AppTabParamList = {
  Map: undefined;
  Discover: NavigatorScreenParams<DiscoverStackParamList>; // NEW
  Account: NavigatorScreenParams<AccountStackParamList>;
};
```

`NavigatorScreenParams` is already imported in `navigation.ts` (line 1).

---

### Pattern 3: DiscoverNavigator (Stack Navigator)

**What:** Stack navigator for the Discover tab. Mirrors AccountNavigator exactly.
**When to use:** Required to wrap the DiscoverScreen and child screens.

```typescript
// Source: VoltVenture/src/navigation/AccountNavigator.tsx (pattern to replicate)
import { createStackNavigator } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../types/navigation';

const Stack = createStackNavigator<DiscoverStackParamList>();

export default function DiscoverNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DiscoverMain" component={DiscoverScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CuratedRoutes" component={CuratedRoutesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VipHubs" component={VipHubsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
```

All screens use `headerShown: false` because each screen implements a custom header.

---

### Pattern 4: BottomSheetModal Mounting (CafeDetailSheet)

**What:** CafeDetailSheet replicates the BikeDetailSheet/FilterSheet mounting pattern from MapScreen.tsx exactly.
**When to use:** Any bottom sheet in MapScreen.

Key elements extracted from `MapScreen.tsx`:
- `useRef<BottomSheetModal>(null)` — ref type is `BottomSheetModal` (from `@gorhom/bottom-sheet`)
- `useMemo(() => ['45%'], [])` — snap points memoized (CafeDetailSheet uses `['55%']` per UI-SPEC)
- `useCallback` wrapping the `renderBackdrop` function
- `BottomSheetBackdrop` with `disappearsOnIndex={-1}` and `appearsOnIndex={0}`
- `ref.current?.present()` to open, `ref.current?.dismiss()` to close
- `BottomSheetView` (not ScrollView) as the root inside the modal
- `BottomSheetModal` placed outside MapView but inside the root `<View style={StyleSheet.absoluteFill}>`

```typescript
// Source: VoltVenture/src/screens/app/MapScreen.tsx (lines 39, 42, 100-103, 158-177)
const cafeDetailRef = useRef<BottomSheetModal>(null);
const cafeSnapPoints = useMemo(() => ['55%'], []); // CafeDetailSheet is taller than BikeDetailSheet

const renderBackdrop = useCallback(
  (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
  [],
);

// In JSX (parallel to existing BikeDetailSheet BottomSheetModal):
<BottomSheetModal
  ref={cafeDetailRef}
  snapPoints={cafeSnapPoints}
  enablePanDownToClose
  backdropComponent={renderBackdrop}
>
  <CafeDetailSheet
    cafe={selectedCafe}
    userLocation={userLocation}
    onGetDirections={() => {
      if (!selectedCafe) return;
      cafeDetailRef.current?.dismiss();
      navigation.navigate('NavStack', {
        screen: 'NavigateToPoi',
        params: { name: selectedCafe.name, location: { latitude: selectedCafe.latitude, longitude: selectedCafe.longitude } }
      });
    }}
  />
</BottomSheetModal>
```

**State needed in MapScreen:** `useState<Cafe | null>(null)` for `selectedCafe`, parallel to `selectedBike`.

---

### Pattern 5: CafeMarker Component

**What:** Circular pin with coffee icon, white background, bordered. Mirrors BikeMarker shape.

```typescript
// Source: VoltVenture/src/components/map/BikeMarker.tsx (replicate shape, change colors/icon)
// BikeMarker uses: backgroundColor DSColors.primary, icon 'lightning-bolt', borderColor DSColors.textOnPrimary
// CafeMarker uses: backgroundColor DSColors.background, icon 'coffee', borderColor DSColors.border
const styles = StyleSheet.create({
  pinContainer: { alignItems: 'center' },
  circle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: DSColors.background,   // WHITE (distinct from green bike pins)
    borderWidth: 2,
    borderColor: DSColors.border,           // #EBEBEB border
    alignItems: 'center', justifyContent: 'center',
  },
  tail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: DSColors.background,    // white tail
  },
});
```

Icon: `<MaterialCommunityIcons name="coffee" size={18} color={DSColors.textPrimary} />`

---

### Pattern 6: MapScreen — Adding Café Marker Layer

**What:** Café markers render alongside bike markers. MapScreen needs a café data array and a parallel marker render in the MapView.

```typescript
// Source: VoltVenture/src/screens/app/MapScreen.tsx (lines 128-137 pattern to parallel)

// Type definition (local or in types/cafe.ts):
type Cafe = { id: string; name: string; hours: string; latitude: number; longitude: number };

// Mock data (local const in MapScreen.tsx or a cafeService.ts):
const MOCK_CAFES: Cafe[] = [
  { id: 'c1', name: 'Café de Jaren', hours: 'Mon–Sun 9:00–23:00', latitude: 52.3684, longitude: 4.8960 },
  { id: 'c2', name: 'Screaming Beans', hours: 'Mon–Fri 8:00–17:00, Sat–Sun 9:00–17:00', latitude: 52.3637, longitude: 4.8833 },
  { id: 'c3', name: 'Lot Sixty One Coffee', hours: 'Mon–Fri 8:00–17:00, Sat 9:00–17:00', latitude: 52.3612, longitude: 4.8745 },
  { id: 'c4', name: 'Headfirst Coffee', hours: 'Mon–Sun 8:00–18:00', latitude: 52.3703, longitude: 4.9014 },
  { id: 'c5', name: 'Black Gold Coffee', hours: 'Mon–Sun 8:30–18:00', latitude: 52.3671, longitude: 4.9044 },
];

// In MapView JSX (after bike markers):
{MOCK_CAFES.map(cafe => (
  <Marker
    key={cafe.id}
    coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }}
    onPress={() => handleCafeMarkerPress(cafe)}
    tracksViewChanges={false}
  >
    <CafeMarker />
  </Marker>
))}
```

`handleCafeMarkerPress` sets `selectedCafe` and calls `cafeDetailRef.current?.present()`.

---

### Pattern 7: NavigateToPoiScreen

**What:** Mirrors `NavigateToBikeScreen` exactly. Differences are param type and absence of "View Turn-by-Turn" button.

Key facts from `NavigateToBikeScreen.tsx`:
- Type: `StackScreenProps<NavStackParamList, 'NavigateToBike'>` → change to `'NavigateToPoi'`
- Params destructure: `const { bike } = route.params` → `const { name, location } = route.params`
- Destination coordinates: `bike.latitude / bike.longitude` → `location.latitude / location.longitude`
- ETA card name display: `{bike.name}` → `{name}`
- `haversineKm` is an inline copy (not exported from MapScreen) — copy again into NavigateToPoiScreen
- `USER_LAT = 52.3676`, `USER_LON = 4.9041` constants remain the same
- The mock polyline waypoints must use `location.latitude / location.longitude` as the endpoint
- "View Turn-by-Turn" button: **omit entirely** — NavigateToPoi does not navigate to WalkingDirections
- Back navigation: the UI-SPEC calls for a back button inside the ETA card (arrow-left icon in the overlay card). NavigateToBikeScreen does NOT have this — NavigateToPoiScreen adds it. Use `navigation.goBack()`.
- `useSafeAreaInsets()` is used for `top: insets.top + 8` on the overlay card

```typescript
// Source: VoltVenture/src/screens/navigation/NavigateToBikeScreen.tsx (adapt)
type Props = StackScreenProps<NavStackParamList, 'NavigateToPoi'>;

export default function NavigateToPoiScreen({ route, navigation }: Props) {
  const { name, location } = route.params;
  const distanceKm = haversineKm(USER_LAT, USER_LON, location.latitude, location.longitude);
  const etaMin = Math.round((distanceKm / 5) * 60);
  const distanceM = Math.round(distanceKm * 1000);
  // ...same MapView/Polyline/overlay card structure
  // ETA card: shows `name`, ETA, distance — NO "View Turn-by-Turn" button
  // Add back button inside overlay card (arrow-left → navigation.goBack())
}
```

---

### Pattern 8: AccountScreen Menu-Row (DiscoverScreen)

**What:** DiscoverScreen replicates AccountScreen menu-row exactly. Key style values:

```typescript
// Source: VoltVenture/src/screens/app/AccountScreen.tsx (styles.menuRow, styles.menuRowLeft, styles.menuRowText)
menuRow: {
  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  paddingHorizontal: 24, paddingVertical: 16,
  backgroundColor: DSColors.surface,
  borderTopWidth: 1, borderColor: DSColors.border,
  // Last row in section: also borderBottomWidth: 1
},
menuRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
menuRowText: { fontSize: 16, fontWeight: '400', color: DSColors.textPrimary },
```

Section header style (from VoltCoinsRewardsScreen + PaymentMethodsScreen — same pattern):
```typescript
sectionHeader: {
  fontSize: 12, fontWeight: '600', color: DSColors.textSecondary,
  textTransform: 'uppercase', letterSpacing: 0.8,
  paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8,
}
```

**DiscoverScreen icons (from UI-SPEC):**
- "Curated Routes": `map-route`
- "VIP Hubs": `lightning-bolt-circle`
- "Support & Help": `help-circle-outline`
- "Privacy Policy": `file-document-outline`
- "Terms of Service": `file-check-outline`

---

### Pattern 9: Snackbar (Contact Support + Route Details stubs)

**What:** Snackbar pattern from VoltCoinsRewardsScreen. First occurrence of this pattern in a Discover screen.

```typescript
// Source: VoltVenture/src/screens/app/VoltCoinsRewardsScreen.tsx (lines 30, 104-112)
import { Portal, Snackbar } from 'react-native-paper';

const [snackVisible, setSnackVisible] = useState(false);
const [snackMessage, setSnackMessage] = useState('');

// To trigger:
setSnackMessage('Route details coming soon');
setSnackVisible(true);

// JSX (always outside ScrollView/FlatList, inside SafeAreaView):
<Portal>
  <Snackbar
    visible={snackVisible}
    onDismiss={() => setSnackVisible(false)}
    duration={2500}
  >
    {snackMessage}
  </Snackbar>
</Portal>
```

Note: `Portal` is required. Without it, Snackbar renders behind other elements on some Android versions. All existing usages wrap Snackbar in `<Portal>`.

---

### Pattern 10: FlatList (CuratedRoutesScreen)

**What:** Standard FlatList with static mock data. Pattern from RideHistoryScreen.

Key pattern facts from `RideHistoryScreen.tsx`:
- `keyExtractor`: `item => item.id`
- `renderItem`: returns a card View
- `ItemSeparatorComponent`: `() => <View style={styles.separator} />` — height based on design (12px transparent for CuratedRoutes)
- `ListEmptyComponent`: not needed for CuratedRoutes (always has mock data)
- `ListHeaderComponent`: optional — use for section title if needed
- `contentContainerStyle`: padding on the FlatList, not on the container View

---

### Pattern 11: VipHubsScreen — Map + FlatList Split + scrollToIndex

**What:** Fixed-height MapView (top) + FlatList (flex: 1, bottom). Map pin tap scrolls FlatList. List card tap focuses map.

**Layout approach (fixed height, per Claude's Discretion):**
```typescript
// Source: UI-SPEC §4 + Claude's Discretion (StyleSheet.create fixed height)
import { Dimensions } from 'react-native';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);

// StyleSheet:
mapView: { height: MAP_HEIGHT },
listContainer: { flex: 1 },
```

**MapView for VipHubs:**
- Non-interactive: `scrollEnabled={false}`, `zoomEnabled={false}`, `pitchEnabled={false}`, `rotateEnabled={false}`
- Needs a `ref` for `animateToRegion` when list card is tapped: `mapRef = useRef<MapView>(null)`
- `mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500)`

**FlatList with scrollToIndex:**
- `flatListRef = useRef<FlatList>(null)`
- `flatListRef.current?.scrollToIndex({ index: hubIndex, animated: true })`
- `scrollToIndex` requires either `getItemLayout` (for fixed-height items) OR it will throw a warning if item heights are variable. For inline-expanding cards, item heights are variable — use `getItemLayout` only if cards are collapsed (fixed height), OR use `scrollToOffset` with a pre-calculated offset.

**PITFALL:** `scrollToIndex` on a FlatList with variable-height items (inline expand) will log a warning: "scrollToIndex should be used in conjunction with getItemLayout". Safe approach: implement `getItemLayout` using the COLLAPSED card height (even though expanded cards are taller), which scrolls close enough for the user experience. Since cards expand in-place, the pre-expansion scroll position is sufficient.

```typescript
// Collapsed card height estimate: padding 16×2 + name row ~22 + distance row ~22 + margins = ~92px total
const ITEM_HEIGHT = 92 + 16; // paddingVertical 8 top + 8 bottom = 16 per item

getItemLayout={(data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})}
```

**Inline expand state:** Use `useState<string | null>(null)` for `expandedHubId`. Card renders additional content when `expandedHubId === hub.id`.

**VIP hub marker (from UI-SPEC §4):**
- Same shape as BikeMarker (36px circle + tail)
- backgroundColor: `DSColors.primary` (#C6FF2D) — same color as bike pins but different icon
- Icon: `star-circle`, size 18, color `DSColors.textOnPrimary`
- IMPORTANT: `star-circle` is also used in AccountScreen (VoltCoins row). This is a visual identity overlap — both VIP hub pins and the VoltCoins menu row use the same icon. The UI-SPEC has approved this; it is acceptable because hub pins appear on a map in VipHubsScreen context, not alongside the AccountScreen. No code change needed.

---

### Pattern 12: List.Accordion (SupportScreen)

**What:** React Native Paper `List.Section` + `List.Accordion` for FAQ. This is the first use of `List.Accordion` in the codebase — no prior reference file, but it is part of react-native-paper which is already installed.

`List.Accordion` state management: React Native Paper's `List.Accordion` supports both controlled and uncontrolled expanded state.

**Uncontrolled (simplest):** Each accordion manages its own expanded state internally. No `expanded` prop needed.

**Controlled (for single-open-at-a-time behavior):** Manage `expandedId` in `useState`, pass `expanded={expandedId === item.id}` and `onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}`.

Per D-12, the spec says "static accordion only" with no constraint on multi-open. Use uncontrolled for simplicity.

```typescript
// Pattern (from react-native-paper documentation — List.Accordion is in v5.x, installed in this project)
import { List, Divider } from 'react-native-paper';

<List.Section>
  <List.Subheader style={styles.sectionHeader}>Rides & Billing</List.Subheader>
  <List.Accordion title="How do I start a ride?" titleStyle={styles.accordionTitle}>
    <List.Item
      description="Tap any green bike pin on the map, book the bike, and scan the QR code on the bike's handlebars. The ride starts automatically."
      descriptionStyle={styles.accordionBody}
      descriptionNumberOfLines={0}
    />
  </List.Accordion>
  <Divider style={{ backgroundColor: DSColors.border }} />
  {/* more accordions */}
</List.Section>
```

**Style considerations:**
- `List.Subheader` renders the section title — style it with the overline treatment (12px, uppercase, letterSpacing 0.8, DSColors.textSecondary)
- `List.Accordion title` is the FAQ question — 15px, weight 600, DSColors.textPrimary
- `List.Item description` inside accordion is the answer — 15px, weight 400, DSColors.textSecondary, lineHeight 22
- `descriptionNumberOfLines={0}` — required to show full answer text (default truncates at 2 lines)

---

### Pattern 13: Custom Header (shared across CuratedRoutes, VipHubs, Support, PrivacyPolicy, TermsOfService)

**What:** All non-home Discover screens use a custom header with back button + centered title + spacer. Pattern from VoltCoinsRewardsScreen (Phase 8).

```typescript
// Source: VoltVenture/src/screens/app/VoltCoinsRewardsScreen.tsx (lines 35-45)
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
    <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>VIP Hubs</Text>
  <View style={{ width: 40 }} />
</View>

// Header style:
header: {
  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12,
  borderBottomWidth: 1, borderColor: DSColors.border,  // UI-SPEC adds border
  backgroundColor: DSColors.background,
},
headerTitle: { fontSize: 17, fontWeight: '600', color: DSColors.textPrimary },
```

---

### Anti-Patterns to Avoid

- **NativeWind classes on any Phase 9 screen:** All prior phases use `StyleSheet.create` + `DSColors`. NativeWind causes layout issues on map screens and is not used.
- **Inline hex literals:** All color values must come from `DSColors` tokens. The only exceptions are the badge background colors declared as `rgba(...)` per the UI-SPEC (difficulty badges, status badges).
- **Missing `Portal` around Snackbar:** Snackbar without Portal renders behind other elements. All 4 existing Snackbar usages wrap in `<Portal>`.
- **`DSColors.primary` as text color:** Electric Green (#C6FF2D) has 1.36:1 contrast — never use as text color on white/light surfaces.
- **`scrollToIndex` without `getItemLayout`:** On FlatList with fixed-height items, use `getItemLayout` to avoid RN warning and potential silent failures.
- **Omitting `tracksViewChanges={false}` on Marker:** All existing markers set this to prevent re-renders on every frame. CafeMarker and VIP hub markers must also set it.
- **Missing `descriptionNumberOfLines={0}` on List.Accordion:** Without this, the FAQ answer is truncated at 2 lines.
- **`headerShown` omitted on DiscoverNavigator screens:** All screens with custom headers must set `headerShown: false` in the navigator.
- **VipHubs MapView as `StyleSheet.absoluteFill`:** Unlike MapScreen and EndRideFindCharging, VipHubs MapView must be a fixed height (not `absoluteFill`) because it shares vertical space with FlatList. Using `absoluteFill` would cover the FlatList.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bottom sheet with backdrop | Custom Modal with animated View | `@gorhom/bottom-sheet` BottomSheetModal | Already installed; handles keyboard, gestures, backdrop — BikeDetailSheet is the template |
| Map rendering | Canvas/SVG map | `react-native-maps` MapView + Marker | Already installed; handles tile caching, gestures, coordinates |
| FAQ accordion | Custom TouchableOpacity expand/collapse | `react-native-paper` List.Accordion | Built-in expand state, animated, accessible — already installed |
| Snackbar toast | Custom animated View | `react-native-paper` Snackbar + Portal | Already installed; handles dismiss timer, z-index via Portal |
| Tab navigator | Custom tab bar | `@react-navigation/bottom-tabs` | Already installed; handles tab state, transitions |
| Stack navigator | Custom navigation stack | `@react-navigation/stack` | Already installed; handles screen stack, transitions, params |
| Icon rendering | SVG paths | `MaterialCommunityIcons` | Already installed; `coffee`, `compass`, `compass-outline`, `star-circle`, `lightning-bolt-circle` all available |
| Haversine distance | Lookup table or GPS library | Inline `haversineKm` function | Already in codebase (NavigateToBikeScreen, MapScreen, EndRideFindCharging) — copy the function |

**Key insight:** Every capability in Phase 9 has a direct precedent in an existing codebase file. The research task for implementors is "find the source file, copy the pattern" — not "find a new solution."

---

## Common Pitfalls

### Pitfall 1: AppTabParamList Type Mismatch After Adding Discover Tab

**What goes wrong:** `AppTabs.tsx` references `AppTabParamList` which only has `Map` and `Account`. Adding a `<Tab.Screen name="Discover">` without updating the type causes a TypeScript error: `Type '"Discover"' is not assignable to...`
**Why it happens:** TypeScript strict navigation typing — the navigator generic must exactly match the type.
**How to avoid:** Update `navigation.ts` first (add `Discover: NavigatorScreenParams<DiscoverStackParamList>`) before touching `AppTabs.tsx`.
**Warning signs:** TypeScript error on `Tab.Navigator` or `Tab.Screen` after adding the new tab.

---

### Pitfall 2: BottomSheetModal renderBackdrop Closure

**What goes wrong:** Two `BottomSheetModal` instances (BikeDetailSheet and CafeDetailSheet) share the same `renderBackdrop` callback. If each modal renders a different backdrop style, they must have separate callbacks. In this phase they share identical backdrop config — one shared `renderBackdrop` is fine.
**Why it happens:** `useCallback` memoizes the function; if passed to two different `BottomSheetModal` components it works correctly (same function reference, different DOM instances).
**How to avoid:** One `renderBackdrop` callback for all sheets in MapScreen is correct.

---

### Pitfall 3: VipHubs Map Height Covers FlatList

**What goes wrong:** Using `StyleSheet.absoluteFill` or `flex: 1` on MapView inside VipHubsScreen causes the map to fill the entire screen, hiding the FlatList beneath it.
**Why it happens:** `StyleSheet.absoluteFill` sets position:absolute with top/left/bottom/right all 0 — fills parent.
**How to avoid:** Use `style={{ height: MAP_HEIGHT }}` (fixed pixel height from `Dimensions.get('window').height × 0.45`). The outer View is `flex: 1` with `flexDirection: 'column'`; MapView takes fixed height, FlatList gets `flex: 1` for the rest.

---

### Pitfall 4: NavigateToPoi Not Added to NavNavigator

**What goes wrong:** Adding `NavigateToPoi` to `NavStackParamList` but forgetting to add `<Stack.Screen name="NavigateToPoi" component={NavigateToPoiScreen} />` to `NavNavigator.tsx` causes a runtime crash when navigation.navigate('NavStack', { screen: 'NavigateToPoi', ... }) is called.
**Why it happens:** Type and runtime are separate — TypeScript only validates the type, not the runtime screen registration.
**How to avoid:** NavNavigator.tsx must be updated alongside navigation.ts. Both changes are in the same wave.

---

### Pitfall 5: CafeDetailSheet selectedCafe null Guard

**What goes wrong:** `CafeDetailSheet` renders with `cafe={selectedCafe}` where `selectedCafe` is initially `null`. If the component doesn't guard against null, it crashes with "Cannot read property 'name' of null".
**Why it happens:** The sheet is always mounted (BottomSheetModal pattern) but hidden; `selectedCafe` is null until a pin is tapped.
**How to avoid:** Apply the same guard used in `BikeDetailSheet` — `if (!bike) return null;` at the top of the component. CafeDetailSheet: `if (!cafe) return null;`

---

### Pitfall 6: scrollToIndex with Variable-Height FlatList

**What goes wrong:** `FlatList.scrollToIndex` throws a warning "scrollToIndex should be used in conjunction with getItemLayout" when item heights vary. If ignored, the scroll may position incorrectly or fail silently.
**Why it happens:** React Native uses `getItemLayout` to pre-calculate scroll positions without measuring each item. Variable-height items (inline expand/collapse) make pre-calculation inexact.
**How to avoid:** Implement `getItemLayout` using the collapsed card height as the constant. The error in scroll position for expanded cards is acceptable UX (scrolls to approximately the right position). Alternative: track expanded state externally and use `scrollToOffset` with a measured offset.

---

### Pitfall 7: List.Accordion descriptionNumberOfLines Default

**What goes wrong:** FAQ answers appear truncated to 2 lines in the expanded accordion.
**Why it happens:** `List.Item description` defaults to `numberOfLines={2}` in React Native Paper.
**How to avoid:** Always set `descriptionNumberOfLines={0}` on `List.Item` inside `List.Accordion` for full text display.

---

### Pitfall 8: star-circle Icon Conflict (Visual Identity)

**What goes wrong:** The `star-circle` icon is used in AccountScreen for the VoltCoins Rewards menu row (line 121). The UI-SPEC also assigns `star-circle` to VIP hub map pins (UI-SPEC §4). Users who are on the VipHubs screen and switch to Account will see the same icon in different contexts.
**Why it happens:** The icon set was not audited across phases during UI-SPEC authoring.
**How to avoid:** The UI-SPEC is the approved contract — proceed with `star-circle` for VIP hub pins as specified. The contexts (map pin vs. menu row) are sufficiently distinct. No code deviation from UI-SPEC.

---

## Code Examples

### CafeDetailSheet BottomSheetView structure

```typescript
// Source: VoltVenture/src/components/map/BikeDetailSheet.tsx (pattern, adapted for café)
import { BottomSheetView } from '@gorhom/bottom-sheet';

export default function CafeDetailSheet({ cafe, userLocation, onGetDirections }) {
  if (!cafe) return null;

  const distanceKm = userLocation
    ? haversineKm(userLocation.latitude, userLocation.longitude, cafe.latitude, cafe.longitude)
    : null;

  return (
    <BottomSheetView style={styles.container}>
      {/* Drag handle */}
      <View style={styles.handle} />
      {/* Photo placeholder */}
      <View style={styles.photoPlaceholder}>
        <MaterialCommunityIcons name="coffee" size={48} color={DSColors.textSecondary} />
      </View>
      {/* Café name */}
      <Text style={styles.cafeName}>{cafe.name}</Text>
      {/* Hours */}
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="clock-outline" size={14} color={DSColors.textSecondary} />
        <Text style={styles.infoText}>{cafe.hours}</Text>
      </View>
      {/* Distance */}
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="map-marker" size={14} color={DSColors.textSecondary} />
        <Text style={styles.infoText}>
          {distanceKm != null ? `${distanceKm.toFixed(1)} km away` : '—'}
        </Text>
      </View>
      {/* CTA */}
      <PrimaryButton label="Get Directions" onPress={onGetDirections} />
    </BottomSheetView>
  );
}
```

---

### VipHubs Hub Card — Inline Expand

```typescript
// Pattern: useState for expandedHubId, conditional render inside FlatList renderItem
const [expandedHubId, setExpandedHubId] = useState<string | null>(null);

function renderHub({ item, index }: { item: VipHub; index: number }) {
  const isExpanded = expandedHubId === item.id;
  return (
    <TouchableOpacity
      style={styles.hubCard}
      onPress={() => {
        setExpandedHubId(isExpanded ? null : item.id);
        mapRef.current?.animateToRegion({ latitude: item.latitude, longitude: item.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500);
        if (!isExpanded) {
          flatListRef.current?.scrollToIndex({ index, animated: true });
        }
      }}
      activeOpacity={0.8}
    >
      {/* Collapsed content always shown */}
      <View style={styles.hubCardRow}>
        <Text style={styles.hubName}>{item.name}</Text>
        <View style={styles.vipBadge}><Text style={styles.vipBadgeText}>VIP</Text></View>
      </View>
      {/* Distance + status row */}
      {/* ... */}
      {/* Expanded content — conditional */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* description, amenities, hours, Get Directions */}
          <PrimaryButton label="Get Directions" onPress={() => { /* navigate to NavigateToPoi */ }} />
        </View>
      )}
    </TouchableOpacity>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|-----------------|--------|
| `NavigatorScreenParams` imported per-navigator | Single import from `@react-navigation/native` at top of navigation.ts | Already used — no change needed |
| FlatList `getItemLayout` only for performance | Required for `scrollToIndex` with known heights | Must implement for VipHubs |
| List.Accordion fully uncontrolled | Both controlled and uncontrolled variants exist in RNP | Use uncontrolled (no `expanded` prop) for simplicity per D-12 |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `List.Accordion` and `Divider` are available in the installed version of react-native-paper | Pattern 12 | If RNP version is too old, these APIs differ — verify against installed package.json version |
| A2 | `MapView.animateToRegion` is available in the installed react-native-maps version | Pattern 11 | If not available, map focus-on-pin-tap cannot be implemented as described |
| A3 | `lightning-bolt-circle` icon exists in MaterialCommunityIcons (used for VIP Hubs menu row in DiscoverScreen) | Pattern 8 | If icon doesn't exist, implementor must choose an available alternative |

[ASSUMED] items above are low-risk given the established stack, but should be spot-checked before coding.

---

## Open Questions

1. **NavigateToPoiScreen — separate file vs. shared component?**
   - What we know: UI-SPEC says "identical structure to NavigateToBikeScreen with differences in params"
   - What's unclear: Claude's Discretion allows either a separate file or refactored shared component
   - Recommendation: Separate file (`NavigateToPoiScreen.tsx`) — avoids touching NavigateToBikeScreen and reduces regression risk. The two screens are already near-identical and do not need abstraction.

2. **VipHubs MapView reference — needs `useRef<MapView>(null)`**
   - What we know: `animateToRegion` is called on the VipHubs MapView when a list card is tapped
   - What's unclear: `MapView` component has a forwarded ref in react-native-maps but the generic type must match
   - Recommendation: `const mapRef = useRef<MapView>(null)` where `MapView` is imported from `react-native-maps`

3. **haversineKm export**
   - What we know: `haversineKm` is defined inline in MapScreen.tsx, NavigateToBikeScreen.tsx, and EndRideFindChargingScreen.tsx — it is NOT exported. The comment in NavigateToBikeScreen explicitly says "Inline copy from MapScreen.tsx — haversineKm is not exported."
   - What's unclear: Should Phase 9 extract haversineKm to a shared utility, or continue the inline copy pattern?
   - Recommendation: Continue the inline copy pattern — CafeDetailSheet needs it for distance display, NavigateToPoiScreen needs it for ETA. Consistent with all prior phases. Creating a shared utility is an out-of-scope refactor.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 9 adds no new external tools or CLI dependencies. All required libraries are already installed from prior phases. No new npm installs required.

---

## Validation Architecture

Step 4: SKIPPED — `workflow.nyquist_validation` is explicitly set to `false` in `.planning/config.json`.

---

## Security Domain

Phase 9 screens are all read-only UI with hardcoded mock data. No auth, no input validation, no network calls, no data persistence. ASVS categories V2, V3, V4, V5, V6 are not applicable. No security domain concerns for this phase.

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)

- `VoltVenture/src/navigation/AppTabs.tsx` — Tab.Screen structure, icon prop format, tabBarStyle
- `VoltVenture/src/types/navigation.ts` — AppTabParamList, NavStackParamList, NavigatorScreenParams import location
- `VoltVenture/src/navigation/NavNavigator.tsx` — Stack.Screen registration pattern for NavStack
- `VoltVenture/src/navigation/AccountNavigator.tsx` — Stack navigator pattern to replicate for DiscoverNavigator
- `VoltVenture/src/screens/app/MapScreen.tsx` — BottomSheetModal ref pattern, Marker render pattern, haversineKm, MOCK_CAFES integration point
- `VoltVenture/src/components/map/BikeDetailSheet.tsx` — BottomSheetView structure, handle style, null guard
- `VoltVenture/src/components/map/BikeMarker.tsx` — Circular marker shape with tail, icon + color pattern
- `VoltVenture/src/screens/app/AccountScreen.tsx` — menuRow, menuRowLeft, menuRowText styles; icon+label+chevron pattern
- `VoltVenture/src/screens/navigation/NavigateToBikeScreen.tsx` — Full-screen map, ETA card, haversineKm inline copy, insets usage
- `VoltVenture/src/screens/app/RideHistoryScreen.tsx` — FlatList with ListHeaderComponent, ItemSeparatorComponent, keyExtractor
- `VoltVenture/src/screens/app/VoltCoinsRewardsScreen.tsx` — Snackbar + Portal pattern, sectionHeader overline style
- `VoltVenture/src/screens/app/PaymentMethodsScreen.tsx` — sectionHeader style (alternate source)
- `VoltVenture/src/screens/charging/EndRideFindChargingScreen.tsx` — MapView + Marker + infoCard pattern
- `VoltVenture/src/theme/theme.ts` — DSColors, DSTypography tokens
- `VoltVenture/src/components/common/PrimaryButton.tsx` — PrimaryButton props interface
- `.planning/phases/09-discovery-and-content/09-CONTEXT.md` — All locked decisions D-01 through D-15
- `.planning/phases/09-discovery-and-content/09-UI-SPEC.md` — Screen-by-screen interaction contract, component inventory, color/typography spec

### Secondary (MEDIUM confidence)

- `.planning/config.json` — nyquist_validation: false confirmed (skip test section)
- `.planning/STATE.md` — Phase 9 confirmed as next phase, context gathered

---

## Metadata

**Confidence breakdown:**
- Navigation type system: HIGH — direct codebase inspection, exact types extracted
- BottomSheetModal pattern: HIGH — BikeDetailSheet and FilterSheet both in codebase
- FlatList patterns: HIGH — RideHistoryScreen is the canonical reference
- List.Accordion: MEDIUM — react-native-paper is installed but List.Accordion has no prior usage in codebase; API documented [ASSUMED from RNP docs]
- Snackbar pattern: HIGH — VoltCoinsRewardsScreen is the exact template
- VipHubs scrollToIndex: HIGH — pitfall documented from RN docs knowledge; getItemLayout approach is the standard solution
- MapView.animateToRegion: MEDIUM — available in react-native-maps but version not confirmed [ASSUMED]

**Research date:** 2026-08-19
**Valid until:** 2026-09-19 (stable stack, all libraries previously vetted)
