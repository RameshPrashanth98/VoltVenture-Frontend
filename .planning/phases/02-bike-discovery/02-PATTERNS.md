# Phase 2: Bike Discovery - Pattern Map

**Mapped:** 2026-08-17
**Files analyzed:** 9 new/modified files
**Analogs found:** 8 / 9

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/screens/app/MapScreen.tsx` | screen (rewrite) | event-driven + request-response | `src/screens/app/AccountScreen.tsx` | role-match |
| `src/services/bikeService.ts` | service | request-response (mock) | `src/services/authService.ts` | exact |
| `src/types/bike.ts` | type definition | — | `src/types/navigation.ts` | role-match |
| `src/components/map/BikeMarker.tsx` | component | — | `src/components/common/SocialAuthButton.tsx` | role-match (View + icon pattern) |
| `src/components/map/BikeDetailSheet.tsx` | component | event-driven | `src/screens/app/AccountScreen.tsx` (Portal/Dialog pattern) | partial-match |
| `src/components/map/FilterSheet.tsx` | component | event-driven | `src/screens/app/AccountScreen.tsx` (Portal/Dialog pattern) | partial-match |
| `src/components/map/BikeListView.tsx` | component | request-response | `src/screens/app/AccountScreen.tsx` + `src/components/common/SocialAuthButton.tsx` | role-match |
| `src/components/map/BikeCard.tsx` | component | — | `src/components/common/SocialAuthButton.tsx` | role-match |
| `app.json` (plugin additions) | config | — | existing `app.json` (expo plugin config) | exact |

---

## Pattern Assignments

### `src/screens/app/MapScreen.tsx` (screen, event-driven + state management)

**Analog:** `src/screens/app/AccountScreen.tsx` + `src/screens/auth/LoginScreen.tsx`

**This file is a full rewrite of the existing placeholder.**

**Imports pattern** — from `AccountScreen.tsx` lines 1–7 and `LoginScreen.tsx` lines 1–23:
```typescript
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { DSColors } from '../../theme/theme';
import { bikeService } from '../../services/bikeService';
import type { Bike, FilterState } from '../../types/bike';
import BikeMarker from '../../components/map/BikeMarker';
import BikeDetailSheet from '../../components/map/BikeDetailSheet';
import FilterSheet from '../../components/map/FilterSheet';
import BikeListView from '../../components/map/BikeListView';
```

**State pattern** — mirrors `LoginScreen.tsx` lines 34–39 (multiple useState + async init):
```typescript
const [bikes, setBikes] = useState<Bike[]>([]);
const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
const [isListView, setIsListView] = useState(false);
const [activeFilters, setActiveFilters] = useState<FilterState>({});
const bikeDetailRef = useRef<BottomSheetModal>(null);
const filterSheetRef = useRef<BottomSheetModal>(null);
const snapPoints = useMemo(() => ['45%'], []);   // CRITICAL: useMemo prevents sheet flicker
```

**Async init pattern (useEffect)** — mirrors `LoginScreen.tsx` async handler structure:
```typescript
useEffect(() => {
  (async () => {
    // 1. Location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setUserLocation({ latitude: 52.3676, longitude: 4.9041 }); // fallback: Amsterdam
    } else {
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    }
    // 2. Bike data
    const data = await bikeService.getNearbyBikes();
    setBikes(data);
  })();
}, []);
```

**Marker press handler** — useCallback pattern (no existing analog; use React standard):
```typescript
const handleMarkerPress = useCallback((bike: Bike) => {
  setSelectedBike(bike);
  bikeDetailRef.current?.present();
}, []);
```

**Map layout pattern** — absoluteFillObject (anti-SafeAreaView rule from CONTEXT.md):
```typescript
// MapView fills screen; overlay controls positioned absolutely — do NOT wrap in SafeAreaView
<View style={StyleSheet.absoluteFillObject}>
  <MapView
    style={StyleSheet.absoluteFillObject}
    initialRegion={{ latitude: 52.3676, longitude: 4.9041, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
    showsUserLocation={true}
    showsMyLocationButton={false}
  >
    {filteredBikes.map(bike => (
      <Marker
        key={bike.id}
        coordinate={{ latitude: bike.latitude, longitude: bike.longitude }}
        onPress={() => handleMarkerPress(bike)}
        tracksViewChanges={false}   // CRITICAL: prevents Android flicker on pan/zoom
      >
        <BikeMarker />
      </Marker>
    ))}
  </MapView>
  {/* Overlay controls positioned absolutely */}
</View>
```

**StyleSheet pattern** — from `AccountScreen.tsx` lines 78–116 (StyleSheet.create with DSColors, NO NativeWind):
```typescript
// All MapScreen styles MUST use StyleSheet.create with DSColors tokens.
// Do NOT use NativeWind className on this screen (established in Phase 1).
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DSColors.background },
  filterButton: {
    position: 'absolute',
    top: 52,        // below safe area notch
    right: 12,
    zIndex: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 88,     // above tab bar (60px) + margin
    right: 16,
    zIndex: 10,
    backgroundColor: DSColors.primary,
  },
});
```

---

### `src/services/bikeService.ts` (service, request-response mock)

**Analog:** `src/services/authService.ts` (lines 1–33) — EXACT match

**Copy this pattern precisely:**
```typescript
// From authService.ts — mirror exactly:
// 1. Interface defining the service contract
// 2. const delay helper for simulated network latency
// 3. mockXxxService object implementing the interface
// 4. export const xxxService: XxxService = mockXxxService  (swap point for real API)

export interface BikeService {
  getNearbyBikes(): Promise<Bike[]>;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const mockBikeService: BikeService = {
  async getNearbyBikes() {
    await delay(500);
    return mockBikes;
  },
};

export const bikeService: BikeService = mockBikeService;
```

**Error pattern** — from `authService.ts` lines 12–14 (throw plain object with code):
```typescript
// If future error cases needed, follow authService.ts pattern:
throw { code: 'BIKES_UNAVAILABLE' };
// Caller catches with: if (err?.code === 'BIKES_UNAVAILABLE')
```

---

### `src/types/bike.ts` (type definition)

**Analog:** `src/types/navigation.ts` (lines 1–26) — role-match (plain TypeScript type/interface file)

**Structure pattern** — from `navigation.ts` (no imports, pure type exports):
```typescript
// navigation.ts pattern: no imports needed, only export type/interface declarations
export type AuthStackParamList = { ... };
export type AppTabParamList = { ... };
```

**Apply to bike.ts:**
```typescript
// No imports — pure type file, mirrors navigation.ts pattern
export interface Bike {
  id: string;
  name: string;
  type: 'standard' | 'speed' | 'cargo';
  batteryPct: number;    // 0–100
  pricePerMin: number;   // EUR, e.g. 0.25
  latitude: number;
  longitude: number;
  distanceKm?: number;   // computed client-side via Haversine; optional (not in raw mock data)
}

export interface FilterState {
  battery?: 'low' | 'med' | 'high';
  price?: 'low' | 'med' | 'high';
  type?: 'standard' | 'speed' | 'cargo';
}
```

---

### `src/components/map/BikeMarker.tsx` (component, pure render)

**Analog:** `src/components/common/SocialAuthButton.tsx` (lines 1–85) — role-match (View + MaterialCommunityIcons composition, StyleSheet.create, DSColors)

**Imports pattern** — from `SocialAuthButton.tsx` lines 1–4:
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DSColors } from '../../theme/theme';
```

**Component pattern** — from `SocialAuthButton.tsx` lines 18–44 (functional component, no props needed for static marker):
```typescript
// SocialAuthButton uses interface Props + default export function pattern
// BikeMarker is simpler — no props, pure branded shape
export default function BikeMarker() {
  return (
    <View style={styles.pinContainer}>
      <View style={styles.circle}>
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={18}
          color={DSColors.textOnPrimary}  // #0F0F0F — black on Electric Green
        />
      </View>
      <View style={styles.tail} />
    </View>
  );
}
```

**StyleSheet pattern** — from `SocialAuthButton.tsx` lines 58–85 (StyleSheet.create with DSColors, no NativeWind):
```typescript
const styles = StyleSheet.create({
  pinContainer: { alignItems: 'center' },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DSColors.primary,      // #C6FF2D — Electric Green
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: DSColors.textOnPrimary,    // #0F0F0F — black border for contrast
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

---

### `src/components/map/BikeDetailSheet.tsx` (component, event-driven)

**Analog:** `src/screens/app/AccountScreen.tsx` lines 1–116 — partial-match (closest to an overlay/modal content pattern in codebase; RNP Surface + DSColors + PrimaryButton usage)

**Imports pattern** — from `AccountScreen.tsx` lines 1–7 + `PrimaryButton.tsx` lines 1–2:
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../common/PrimaryButton';   // reuse established button
import type { Bike } from '../../types/bike';
```

**Props pattern** — from `SocialAuthButton.tsx` lines 6–14 (interface Props, typed):
```typescript
interface BikeDetailSheetProps {
  bike: Bike | null;
  onReserve: () => void;
}
```

**Component structure** — from `AccountScreen.tsx` lines 30–76 (section-based View layout):
```typescript
export default function BikeDetailSheet({ bike, onReserve }: BikeDetailSheetProps) {
  if (!bike) return null;
  return (
    <BottomSheetView style={styles.container}>
      {/* Drag handle */}
      <View style={styles.handle} />
      {/* Bike identity */}
      <Text style={styles.bikeName}>{bike.name}</Text>
      <Text style={styles.bikeType}>{bike.type}</Text>
      {/* Stat chips row */}
      <View style={styles.chipsRow}>
        <Chip icon="battery">{bike.batteryPct}%</Chip>
        <Chip icon="currency-eur">€{bike.pricePerMin}/min</Chip>
        <Chip icon="map-marker">{bike.distanceKm?.toFixed(2)} km</Chip>
      </View>
      {/* Reserve CTA — reuse PrimaryButton exactly as in auth screens */}
      <PrimaryButton
        label="Reserve"
        onPress={onReserve}   // stub: console.log('TODO Phase 3')
      />
    </BottomSheetView>
  );
}
```

**StyleSheet pattern** — from `AccountScreen.tsx` lines 78–116 (StyleSheet.create, DSColors, consistent paddingHorizontal: 24):
```typescript
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: DSColors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bikeName: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
    marginBottom: 4,
  },
  bikeType: {
    ...DSTypography.body,
    color: DSColors.textSecondary,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
});
```

---

### `src/components/map/FilterSheet.tsx` (component, event-driven)

**Analog:** `src/screens/app/AccountScreen.tsx` lines 52–76 (Portal/Dialog state pattern) + `BikeDetailSheet.tsx` pattern (BottomSheetView layout)

**Imports pattern:**
```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../common/PrimaryButton';
import type { FilterState } from '../../types/bike';
```

**Props pattern** — from `SocialAuthButton.tsx` lines 6–14:
```typescript
interface FilterSheetProps {
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
}
```

**Internal state pattern** — from `AccountScreen.tsx` lines 12–13 (useState for UI state):
```typescript
// Local draft state — only committed to parent on Apply, not on every chip tap
const [draft, setDraft] = useState<FilterState>(initialFilters);
```

**Chip selector pattern** — (no exact analog in codebase; derive from RNP Chip docs + established StyleSheet.create):
```typescript
// Chip group for a single filter dimension:
<View style={styles.chipGroup}>
  <Text style={styles.filterLabel}>Battery</Text>
  <View style={styles.chipRow}>
    {(['low', 'med', 'high'] as const).map(level => (
      <Chip
        key={level}
        selected={draft.battery === level}
        onPress={() => setDraft(d => ({ ...d, battery: d.battery === level ? undefined : level }))}
        style={draft.battery === level ? styles.chipSelected : undefined}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Chip>
    ))}
  </View>
</View>
```

**StyleSheet pattern** — from `AccountScreen.tsx` lines 78–116 (consistent structure):
```typescript
const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingBottom: 32 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: DSColors.border, alignSelf: 'center', marginBottom: 16 },
  title: { ...DSTypography.heading, color: DSColors.textPrimary, marginBottom: 20 },
  filterLabel: { ...DSTypography.label, color: DSColors.textSecondary, marginBottom: 8 },
  chipGroup: { marginBottom: 16 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chipSelected: { backgroundColor: DSColors.primary },
});
```

---

### `src/components/map/BikeListView.tsx` (component, request-response)

**Analog:** `src/screens/auth/LoginScreen.tsx` lines 113–222 (ScrollView/list content structure) + `AccountScreen.tsx` (StyleSheet.create pattern)

**No FlatList exists in codebase yet — use React Native FlatList, which is the standard pattern.**

**Imports pattern** — from `LoginScreen.tsx` lines 1–23 (RN core imports + DS tokens):
```typescript
import React from 'react';
import { FlatList, View, Text, StyleSheet, ListRenderItem } from 'react-native';
import { DSColors, DSTypography } from '../../theme/theme';
import BikeCard from './BikeCard';
import type { Bike } from '../../types/bike';
```

**Props pattern:**
```typescript
interface BikeListViewProps {
  bikes: Bike[];
  onSelectBike: (bike: Bike) => void;
}
```

**FlatList pattern** (React Native standard):
```typescript
export default function BikeListView({ bikes, onSelectBike }: BikeListViewProps) {
  const renderItem: ListRenderItem<Bike> = ({ item }) => (
    <BikeCard bike={item} onPress={() => onSelectBike(item)} />
  );

  if (bikes.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No bikes match your filters.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bikes}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}
```

**StyleSheet pattern** — from `AccountScreen.tsx` lines 78–116:
```typescript
const styles = StyleSheet.create({
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 80 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyText: { ...DSTypography.body, color: DSColors.textSecondary, textAlign: 'center' },
});
```

---

### `src/components/map/BikeCard.tsx` (component, pure render)

**Analog:** `src/components/common/SocialAuthButton.tsx` (lines 1–85) — role-match (TouchableOpacity + icon + text card, StyleSheet.create)

**Imports pattern** — from `SocialAuthButton.tsx` lines 1–4:
```typescript
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DSColors, DSTypography } from '../../theme/theme';
import type { Bike } from '../../types/bike';
```

**Props pattern** — from `SocialAuthButton.tsx` lines 8–14:
```typescript
interface BikeCardProps {
  bike: Bike;
  onPress: () => void;
}
```

**Component pattern** — from `SocialAuthButton.tsx` lines 26–44 (TouchableOpacity > View > icon + text rows):
```typescript
export default function BikeCard({ bike, onPress }: BikeCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.7}   // matches SocialAuthButton touchable feel
      accessibilityRole="button"
    >
      {/* Top row: bolt icon + Bike ID + type */}
      <View style={styles.topRow}>
        <MaterialCommunityIcons name="lightning-bolt" size={16} color={DSColors.accent} />
        <Text style={styles.bikeName}>{bike.name}</Text>
        <Text style={styles.bikeType}>{bike.type}</Text>
      </View>
      {/* Bottom row: battery % + distance */}
      <View style={styles.bottomRow}>
        <Text style={styles.stat}>
          <MaterialCommunityIcons name="battery" size={13} /> {bike.batteryPct}%
        </Text>
        <Text style={styles.stat}>
          {bike.distanceKm != null ? `${bike.distanceKm.toFixed(2)} km` : '—'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
```

**StyleSheet pattern** — from `SocialAuthButton.tsx` lines 58–85:
```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: DSColors.surface,    // matches SocialAuthButton surface colour
    borderWidth: 1,
    borderColor: DSColors.border,         // matches SocialAuthButton border
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bikeName: { ...DSTypography.headingMd, color: DSColors.textPrimary, flex: 1 },
  bikeType: { ...DSTypography.label, color: DSColors.textSecondary, textTransform: 'capitalize' },
  stat: { ...DSTypography.label, color: DSColors.textSecondary },
});
```

---

### `app.json` (config — plugin additions)

**Analog:** Existing `app.json` with established Expo plugin array.

**Pattern:** Append to the existing `plugins` array. Do not remove or reorder existing plugins.

```json
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
```

Note: iOS does NOT need `iosGoogleMapsApiKey` — Apple Maps is the default and requires no key (Decision D-02).

---

## Shared Patterns

### DSColors + DSTypography (applies to ALL new files)

**Source:** `src/theme/theme.ts` lines 11–77

```typescript
// Import pattern used across all screens and components:
import { DSColors, DSTypography } from '../../theme/theme';
// (adjust relative path based on file depth)

// Key tokens for Phase 2:
DSColors.primary         // #C6FF2D — Electric Green — use as bike marker bg, FAB bg, selected chip bg
DSColors.textOnPrimary   // #0F0F0F — black — icon/text ON Electric Green backgrounds
DSColors.accent          // #7D9220 — accessible green for text on white (4.6:1 contrast)
DSColors.surface         // #FAFAFA — list card backgrounds
DSColors.border          // #EBEBEB — card borders, drag handle, dividers
DSColors.textPrimary     // #0F0F0F — primary text
DSColors.textSecondary   // #808080 — secondary/caption text
DSColors.background      // #FFFFFF — screen background

// Typography spreads:
...DSTypography.heading     // { fontSize: 20, lineHeight: 26, fontWeight: '600' }
...DSTypography.headingMd   // { fontSize: 17, lineHeight: 24, fontWeight: '600' }
...DSTypography.body        // { fontSize: 15, lineHeight: 22, fontWeight: '400' }
...DSTypography.label       // { fontSize: 13, lineHeight: 16, fontWeight: '600' }
```

---

### StyleSheet.create (applies to ALL new files)

**Source:** `src/screens/app/AccountScreen.tsx` lines 78–116, `src/components/common/SocialAuthButton.tsx` lines 58–85

```typescript
// Rule: StyleSheet ALWAYS declared at module bottom, after the component.
// Rule: NO NativeWind className on map screens or map components (CONTEXT.md established convention).
// Rule: Use DSColors tokens — no hardcoded hex strings.

const styles = StyleSheet.create({
  // ... DSColors-only values
});
```

---

### MaterialCommunityIcons usage (applies to BikeMarker, BikeCard, BikeDetailSheet)

**Source:** `src/components/common/SocialAuthButton.tsx` lines 34–38, `src/navigation/AppTabs.tsx` lines 31–34

```typescript
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Usage pattern (from SocialAuthButton.tsx lines 34–38):
<MaterialCommunityIcons
  name={iconName as any}   // or specific string literal
  size={20}                // 16–24 for inline; 18 for marker
  color={DSColors.textPrimary}
/>

// Phase 2 icon names:
// "lightning-bolt"   — bike marker, card top row
// "battery"          — battery stat chip/card
// "map-marker"       — distance chip
// "currency-eur"     — price chip
// "filter-variant"   — filter IconButton
// "format-list-bulleted" — list view FAB
// "map"              — map toggle button
```

---

### PrimaryButton reuse (applies to BikeDetailSheet, FilterSheet)

**Source:** `src/components/common/PrimaryButton.tsx` lines 1–37

```typescript
// Import and usage pattern (from LoginScreen.tsx lines 21, 175–180):
import PrimaryButton from '../common/PrimaryButton';

<PrimaryButton
  label="Reserve"        // or "Apply filters"
  onPress={onReserve}
  loading={false}        // set to true during async ops if any
/>
// Note: PrimaryButton width is always '100%' — it fills container width.
// Do NOT wrap in a sized container to constrain width.
```

---

### GestureHandlerRootView (already in App.tsx — no change needed)

**Source:** `App.tsx` lines 44–55

```typescript
// App.tsx already wraps the entire tree:
<GestureHandlerRootView style={{ flex: 1 }}>
  <PaperProvider theme={paperTheme}>
    ...
  </PaperProvider>
</GestureHandlerRootView>

// @gorhom/bottom-sheet requires this wrapper — it is already present.
// Wave 0 task: Add <BottomSheetModalProvider> inside GestureHandlerRootView
// if BottomSheetModal fails to open without it (see RESEARCH.md A1).
```

---

### Error / async pattern (applies to MapScreen useEffect, bikeService)

**Source:** `src/screens/auth/LoginScreen.tsx` lines 52–62, `src/services/authService.ts` lines 9–30

```typescript
// Async handler pattern from LoginScreen.tsx (try/catch/finally):
const handleXxx = async () => {
  setIsLoading(true);
  try {
    const result = await someService.method();
    // update state
  } catch (err: any) {
    if (err?.code === 'KNOWN_CODE') {
      // specific error
    } else {
      // generic fallback
    }
  } finally {
    setIsLoading(false);
  }
};

// For bikeService mock errors, throw plain objects (authService.ts lines 12–14):
throw { code: 'BIKES_UNAVAILABLE' };
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/utils/haversine.ts` (or inline) | utility | transform | No geo utility exists yet. Use the inline Haversine function from RESEARCH.md (Pattern in Code Examples section). No library needed — ~10-line pure function. |

---

## Anti-Patterns to Enforce (from RESEARCH.md)

| Anti-Pattern | Correct Approach | Source |
|---|---|---|
| `tracksViewChanges={true}` on `<Marker>` (default) | Always set `tracksViewChanges={false}` for static marker content | RESEARCH.md Pitfall 3 |
| Inline `snapPoints={['45%']}` in JSX | `const snapPoints = useMemo(() => ['45%'], [])` | RESEARCH.md Pitfall 4 |
| Calling `getCurrentPositionAsync()` without checking `status === 'granted'` | Always gate behind permission check + fallback location | RESEARCH.md Pitfall 2 |
| NativeWind `className` on MapScreen or map components | Use `StyleSheet.create` with DSColors (CONTEXT.md established rule) | CONTEXT.md code_context |
| `<MapView>` inside `<SafeAreaView>` | `style={StyleSheet.absoluteFillObject}` on MapView; overlay controls via absolute position | RESEARCH.md Anti-Patterns |
| `<BottomSheetModal>` inside MapView JSX | Sheet must be a sibling of MapView at screen level | RESEARCH.md Anti-Patterns |

---

## Metadata

**Analog search scope:** `VoltVenture/src/` (all subdirectories)
**Files scanned:** 22 source files
**Pattern extraction date:** 2026-08-17
