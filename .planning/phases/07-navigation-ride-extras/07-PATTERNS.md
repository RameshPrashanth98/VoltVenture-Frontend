# Phase 7: Navigation & Ride Extras — Pattern Map

**Mapped:** 2026-08-19
**Files analyzed:** 11 (5 new screens, 2 new navigators, 4 file edits)
**Analogs found:** 11 / 11

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/screens/navigation/NavigateToBikeScreen.tsx` | screen | request-response (map + mock) | `src/screens/ride/ActiveRideScreen.tsx` | exact |
| `src/screens/navigation/WalkingDirectionsScreen.tsx` | screen | request-response (FlatList + mock) | `src/screens/app/LoginSecurityScreen.tsx` | role-match |
| `src/screens/ride/SafetyMountScreen.tsx` | screen | event-driven (checklist state) | `src/screens/app/LoginSecurityScreen.tsx` | role-match |
| `src/screens/charging/EndRideFindChargingScreen.tsx` | screen | request-response (map + state) | `src/screens/ride/ActiveRideScreen.tsx` + `src/screens/app/MapScreen.tsx` | exact (composite) |
| `src/screens/charging/RidingToChargingScreen.tsx` | screen | request-response (map + mock) | `src/screens/ride/ActiveRideScreen.tsx` | exact |
| `src/navigation/NavNavigator.tsx` | navigator | — | `src/navigation/BookingNavigator.tsx` | exact |
| `src/navigation/ChargeNavigator.tsx` | navigator | — | `src/navigation/BookingNavigator.tsx` | exact |
| `src/types/navigation.ts` | config | — | self (append new types) | exact |
| `src/navigation/RootNavigator.tsx` | navigator | — | self (append new Stack.Screen entries) | exact |
| `src/navigation/RideNavigator.tsx` | navigator | — | self (prepend SafetyMount screen) | exact |
| `src/components/map/BikeDetailSheet.tsx` | component | request-response | self (add prop + secondary button) | exact |
| `src/screens/booking/UnlockSuccessScreen.tsx` | screen (edit) | — | self (one-line change) | exact |
| `src/screens/ride/RideReceiptScreen.tsx` | screen (edit) | event-driven | self (add secondary CTA + parent nav) | exact |

---

## Pattern Assignments

### `src/screens/navigation/NavigateToBikeScreen.tsx` (screen, map + mock ETA)

**Analog:** `src/screens/ride/ActiveRideScreen.tsx`

**Imports pattern** (ActiveRideScreen.tsx lines 1-16):
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';  // add Polyline
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { NavStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
```

**Props type pattern** (ActiveRideScreen.tsx line 19):
```typescript
type Props = StackScreenProps<NavStackParamList, 'NavigateToBike'>;

export default function NavigateToBikeScreen({ route, navigation }: Props) {
  const { bike } = route.params;
  const insets = useSafeAreaInsets();
```

**haversineKm — inline this function body** (MapScreen.tsx lines 18-29, NOT exported — must copy):
```typescript
// Inline copy from MapScreen.tsx — haversineKm is not exported
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

**ETA derived values** (D-11 — compute at render-time, no useEffect needed):
```typescript
const USER_LAT = 52.3676;
const USER_LON = 4.9041;
const distanceKm = haversineKm(USER_LAT, USER_LON, bike.latitude, bike.longitude);
const etaMin = Math.round(distanceKm / 5 * 60);
const distanceM = Math.round(distanceKm * 1000);
```

**Loading state pattern** (ActiveRideScreen.tsx lines 71-77):
```typescript
// Use for location-resolving state if needed; for pure mock, skip:
if (loading) {
  return (
    <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
      <ActivityIndicator size="large" color={DSColors.primary} />
    </View>
  );
}
```

**Full-screen map + Polyline + overlay card + bottom action** (ActiveRideScreen.tsx lines 79-131, adapted):
```typescript
return (
  <View style={StyleSheet.absoluteFill}>
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: (USER_LAT + bike.latitude) / 2,
        longitude: (USER_LON + bike.longitude) / 2,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      scrollEnabled={false}
      zoomEnabled={true}
      rotateEnabled={false}
      pitchEnabled={false}
    >
      {/* User position dot */}
      <Marker coordinate={{ latitude: USER_LAT, longitude: USER_LON }}>
        <View style={styles.userMarker} />
      </Marker>
      {/* Bike destination pin */}
      <Marker coordinate={{ latitude: bike.latitude, longitude: bike.longitude }}>
        <MaterialCommunityIcons name="bicycle" size={24} color={DSColors.primary} />
      </Marker>
      {/* Route polyline — must be INSIDE MapView, not in overlay */}
      <Polyline
        coordinates={[
          { latitude: USER_LAT, longitude: USER_LON },
          { latitude: 52.3690, longitude: 4.9020 },  // waypoint 1
          { latitude: 52.3710, longitude: 4.9005 },  // waypoint 2
          { latitude: bike.latitude, longitude: bike.longitude },
        ]}
        strokeColor={DSColors.primary}
        strokeWidth={4}
      />
    </MapView>

    {/* Top ETA card */}
    <View style={[styles.overlayCard, { top: insets.top + 8 }]}>
      <Text style={styles.bikeName}>{bike.name}</Text>
      <Text style={styles.etaLabel}>{etaMin} min walk — {distanceM} m</Text>
      {/* View Turn-by-Turn button inside ETA card */}
      <TouchableOpacity
        style={styles.turnByTurnButton}
        onPress={() => navigation.push('WalkingDirections', { bike })}
      >
        <Text style={styles.turnByTurnLabel}>View Turn-by-Turn</Text>
      </TouchableOpacity>
    </View>
  </View>
);
```

**StyleSheet pattern** (ActiveRideScreen.tsx lines 135-201):
```typescript
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: DSColors.background,
  },
  overlayCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15,15,15,0.85)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 10,
  },
  bikeName: {
    ...DSTypography.headingMd,
    color: '#FFFFFF',
  },
  etaLabel: {
    ...DSTypography.label,
    color: '#FFFFFF',
    marginTop: 4,
  },
  turnByTurnButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  turnByTurnLabel: {
    fontSize: 15, fontWeight: '400', color: '#FFFFFF',
  },
  userMarker: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: DSColors.primary,
  },
});
```

**Navigation note:** Use `navigation.push('WalkingDirections', { bike })` (not `navigate`) to always create a new instance.

---

### `src/screens/navigation/WalkingDirectionsScreen.tsx` (screen, FlatList + mock data)

**Analog:** `src/screens/app/LoginSecurityScreen.tsx` (custom header + SafeAreaView + ScrollView/list pattern)

**Imports pattern** (LoginSecurityScreen.tsx lines 1-8):
```typescript
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { NavStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
```

**Props type** (mirrors LoginSecurityScreen.tsx line 10):
```typescript
type Props = StackScreenProps<NavStackParamList, 'WalkingDirections'>;

export default function WalkingDirectionsScreen({ route, navigation }: Props) {
  const { bike } = route.params;
```

**Custom header pattern** (LoginSecurityScreen.tsx lines 33-43, SettingsScreen.tsx lines 56-66 — EXACT pattern):
```typescript
<SafeAreaView style={styles.safeArea}>
  {/* Header */}
  <View style={styles.header}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Walking Directions</Text>
    <View style={{ width: 40 }} />
  </View>
```

**Mock steps data** (define above component):
```typescript
type Step = { id: string; icon: string; text: string; distance: string; isArrival?: boolean };

const MOCK_STEPS: Step[] = [
  { id: '1', icon: 'arrow-up',          text: 'Head north on Damrak',                             distance: '150 m' },
  { id: '2', icon: 'arrow-left',         text: 'Turn left onto Nieuwendijk',                       distance: '200 m' },
  { id: '3', icon: 'arrow-up',          text: 'Continue straight for 200 m',                      distance: '200 m' },
  { id: '4', icon: 'arrow-right',        text: 'Turn right onto Warmoesstraat',                    distance: '120 m' },
  { id: '5', icon: 'flag-checkered',     text: 'Arrive at your bike — right side of the street',  distance: '',      isArrival: true },
];
```

**FlatList step row** (UI-SPEC pattern — icon + text + distance):
```typescript
<FlatList
  data={MOCK_STEPS}
  keyExtractor={item => item.id}
  contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
  renderItem={({ item }) => (
    <View style={styles.stepRow}>
      <View style={styles.iconColumn}>
        <MaterialCommunityIcons
          name={item.icon as any}
          size={24}
          color={item.isArrival ? DSColors.primary : DSColors.textPrimary}
        />
      </View>
      <Text style={styles.stepText}>{item.text}</Text>
      {item.distance ? (
        <Text style={styles.stepDistance}>{item.distance}</Text>
      ) : null}
    </View>
  )}
/>
```

**StyleSheet pattern** (header from LoginSecurityScreen.tsx lines 185-196, adapted):
```typescript
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DSColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DSColors.border,
    height: 56,
  },
  headerTitle: { ...DSTypography.headingMd, color: DSColors.textPrimary },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: DSColors.border,
  },
  iconColumn: { width: 32 },
  stepText: { ...DSTypography.body, color: DSColors.textPrimary, flex: 1 },
  stepDistance: { ...DSTypography.label, color: DSColors.textSecondary, minWidth: 48, textAlign: 'right' },
});
```

---

### `src/screens/ride/SafetyMountScreen.tsx` (screen, checklist state)

**Analog:** `src/screens/app/LoginSecurityScreen.tsx` (custom header + SafeAreaView + ScrollView + TouchableOpacity rows with state) and `src/components/common/PrimaryButton.tsx` (disabled prop)

**Imports pattern:**
```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RideStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';
```

**Props type:**
```typescript
type Props = StackScreenProps<RideStackParamList, 'SafetyMount'>;
```

**Checklist state pattern** (RESEARCH.md code example):
```typescript
type ChecklistItem = { id: number; label: string; icon: string };

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 1, label: 'Helmet secured',      icon: 'helmet' },
  { id: 2, label: 'Brakes tested',       icon: 'car-brake-hold' },
  { id: 3, label: 'Lights working',      icon: 'lightbulb-on' },
  { id: 4, label: 'App tracking active', icon: 'map-marker-check' },
];

const [checked, setChecked] = useState<Set<number>>(new Set());

const toggleItem = (id: number) => {
  setChecked(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};

const allChecked = checked.size === CHECKLIST_ITEMS.length;
```

**Custom header** (same pattern as LoginSecurityScreen.tsx lines 33-43, SettingsScreen.tsx lines 56-66):
```typescript
<SafeAreaView style={styles.safeArea}>
  <View style={styles.header}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Safety Check</Text>
    <View style={{ width: 40 }} />
  </View>
```

**Checklist row pattern** (similar to LoginSecurityScreen.tsx toggleRow, lines 49-64):
```typescript
{CHECKLIST_ITEMS.map(item => (
  <TouchableOpacity
    key={item.id}
    style={styles.checkRow}
    onPress={() => toggleItem(item.id)}
    activeOpacity={0.7}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: checked.has(item.id) }}
    accessibilityLabel={item.label}
  >
    <MaterialCommunityIcons
      name={item.icon as any}
      size={24}
      color={checked.has(item.id) ? DSColors.accent : DSColors.textSecondary}
    />
    <Text style={styles.checkLabel}>{item.label}</Text>
    <MaterialCommunityIcons
      name={checked.has(item.id) ? 'check-circle' : 'circle-outline'}
      size={24}
      color={checked.has(item.id) ? DSColors.accent : DSColors.border}
    />
  </TouchableOpacity>
))}
```

**PrimaryButton disabled pattern** (PrimaryButton.tsx lines 17-37 — `disabled` prop already supported):
```typescript
// PrimaryButton accepts disabled prop; when disabled, Paper applies opacity internally
<PrimaryButton
  label="Start Ride"
  disabled={!allChecked}
  onPress={() => navigation.navigate('ActiveRide', { bike })}
/>
```

**StyleSheet pattern:**
```typescript
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DSColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DSColors.border,
    height: 56,
  },
  headerTitle: { ...DSTypography.headingMd, color: DSColors.textPrimary },
  subtitle: { ...DSTypography.body, color: DSColors.textSecondary, marginBottom: 24 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: DSColors.border,
  },
  checkLabel: { ...DSTypography.body, color: DSColors.textPrimary, flex: 1 },
});
```

---

### `src/screens/charging/EndRideFindChargingScreen.tsx` (screen, map + marker state + info card)

**Analog (composite):** `src/screens/ride/ActiveRideScreen.tsx` (absoluteFill + overlay) + `src/screens/app/MapScreen.tsx` (Marker onPress + state pattern)

**Imports pattern:**
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ChargeStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';
```

**Props type:**
```typescript
type Props = StackScreenProps<ChargeStackParamList, 'EndRideFindCharging'>;
```

**Mock charger data** (RESEARCH.md + UI-SPEC):
```typescript
type ChargerStation = { name: string; latitude: number; longitude: number };

const MOCK_CHARGERS: ChargerStation[] = [
  { name: 'VoltHub Central',       latitude: 52.3731, longitude: 4.8936 },
  { name: 'Dam Square Charger',    latitude: 52.3728, longitude: 4.8936 },
  { name: 'Waterlooplein Station', latitude: 52.3678, longitude: 4.9006 },
  { name: 'Leidseplein EV Point',  latitude: 52.3638, longitude: 4.8831 },
  { name: 'Vondelpark Charge Bay', latitude: 52.3580, longitude: 4.8688 },
];
```

**Selected charger state** (RESEARCH.md code example):
```typescript
const [selectedCharger, setSelectedCharger] = useState<ChargerStation | null>(null);
const USER_LAT = 52.3676;
const USER_LON = 4.9041;
```

**Full-screen map + charger pins + info card** (ActiveRideScreen.tsx absoluteFill pattern + MapScreen.tsx Marker pattern):
```typescript
return (
  <View style={StyleSheet.absoluteFill}>
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: USER_LAT, longitude: USER_LON,
        latitudeDelta: 0.02, longitudeDelta: 0.02,
      }}
      scrollEnabled={true}
      zoomEnabled={true}
      onPress={() => setSelectedCharger(null)}
    >
      {MOCK_CHARGERS.map(charger => (
        <Marker
          key={charger.name}
          coordinate={{ latitude: charger.latitude, longitude: charger.longitude }}
          onPress={() => setSelectedCharger(charger)}
          tracksViewChanges={false}       // CRITICAL — prevents Android re-render perf issue
        >
          <View style={styles.chargerPin}>
            <MaterialCommunityIcons name="ev-station" size={28} color={DSColors.primary} />
          </View>
        </Marker>
      ))}
    </MapView>

    {/* Close button — top left */}
    <TouchableOpacity
      style={[styles.closeButton, { top: insets.top + 8 }]}
      onPress={() => navigation.getParent()?.goBack()}
      accessibilityLabel="Close"
    >
      <MaterialCommunityIcons name="close" size={24} color={DSColors.textPrimary} />
    </TouchableOpacity>

    {/* Charger info card — conditional */}
    {selectedCharger && (
      <View style={[styles.infoCard, { bottom: insets.bottom + 16 }]}>
        <Text style={styles.chargerName}>{selectedCharger.name}</Text>
        <Text style={styles.chargerDistance}>
          {Math.round(haversineKm(USER_LAT, USER_LON, selectedCharger.latitude, selectedCharger.longitude) * 1000)} m away
        </Text>
        <PrimaryButton
          label="Navigate Here"
          onPress={() => navigation.push('RidingToCharging', {
            chargerName: selectedCharger.name,
            location: { latitude: selectedCharger.latitude, longitude: selectedCharger.longitude },
          })}
        />
      </View>
    )}
  </View>
);
```

**StyleSheet pattern:**
```typescript
const styles = StyleSheet.create({
  chargerPin: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: DSColors.background,
    borderWidth: 2, borderColor: DSColors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  infoCard: {
    position: 'absolute',
    left: 16, right: 16,
    backgroundColor: DSColors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: DSColors.border,
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
    zIndex: 10,
  },
  chargerName: { ...DSTypography.headingMd, color: DSColors.textPrimary, marginBottom: 4 },
  chargerDistance: { ...DSTypography.label, color: DSColors.textSecondary, marginBottom: 12 },
});
```

**Note:** Inline `haversineKm` function body same as NavigateToBikeScreen (not exported from MapScreen).

---

### `src/screens/charging/RidingToChargingScreen.tsx` (screen, map + mock ETA)

**Analog:** `src/screens/ride/ActiveRideScreen.tsx` — identical pattern to NavigateToBikeScreen

**Imports pattern:**
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ChargeStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
```

**Props type:**
```typescript
type Props = StackScreenProps<ChargeStackParamList, 'RidingToCharging'>;

export default function RidingToChargingScreen({ route, navigation }: Props) {
  const { chargerName, location } = route.params;
  const insets = useSafeAreaInsets();

  const USER_LAT = 52.3676;
  const USER_LON = 4.9041;
  const distanceKm = haversineKm(USER_LAT, USER_LON, location.latitude, location.longitude);
  const etaMin = Math.round(distanceKm / 5 * 60);
  const distanceM = Math.round(distanceKm * 1000);
```

**ETA card content diff from NavigateToBike** — no secondary button; shows charger name + ETA only:
```typescript
<View style={[styles.overlayCard, { top: insets.top + 8 }]}>
  <Text style={styles.chargerName}>{chargerName}</Text>
  <Text style={styles.etaLabel}>{etaMin} min walk — {distanceM} m</Text>
</View>
```

**Charger destination marker:**
```typescript
<Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
  <MaterialCommunityIcons name="ev-station" size={28} color={DSColors.primary} />
</Marker>
```

**StyleSheet:** Same structure as NavigateToBikeScreen — copy overlayCard, userMarker, etaLabel, chargerName styles.

---

### `src/navigation/NavNavigator.tsx` (navigator)

**Analog:** `src/navigation/BookingNavigator.tsx` — exact copy pattern

**Full file pattern** (BookingNavigator.tsx lines 1-20):
```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { NavStackParamList } from '../types/navigation';
import NavigateToBikeScreen from '../screens/navigation/NavigateToBikeScreen';
import WalkingDirectionsScreen from '../screens/navigation/WalkingDirectionsScreen';

const Stack = createStackNavigator<NavStackParamList>();

export default function NavNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NavigateToBike" component={NavigateToBikeScreen} />
      <Stack.Screen name="WalkingDirections" component={WalkingDirectionsScreen} />
    </Stack.Navigator>
  );
}
```

---

### `src/navigation/ChargeNavigator.tsx` (navigator)

**Analog:** `src/navigation/BookingNavigator.tsx` — exact copy pattern

**Full file pattern:**
```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { ChargeStackParamList } from '../types/navigation';
import EndRideFindChargingScreen from '../screens/charging/EndRideFindChargingScreen';
import RidingToChargingScreen from '../screens/charging/RidingToChargingScreen';

const Stack = createStackNavigator<ChargeStackParamList>();

export default function ChargeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EndRideFindCharging" component={EndRideFindChargingScreen} />
      <Stack.Screen name="RidingToCharging" component={RidingToChargingScreen} />
    </Stack.Navigator>
  );
}
```

---

### `src/types/navigation.ts` (config — append new types)

**Current file:** `VoltVenture/src/types/navigation.ts` (61 lines, fully read)

**Current `RootStackParamList`** (lines 49-54):
```typescript
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>;
  RideStack: NavigatorScreenParams<RideStackParamList>;
};
```

**New param lists to add** (after existing exports, before line 56):
```typescript
export type NavStackParamList = {
  NavigateToBike: { bike: Bike };
  WalkingDirections: { bike: Bike };
};

export type ChargeStackParamList = {
  EndRideFindCharging: undefined;
  RidingToCharging: { chargerName: string; location: { latitude: number; longitude: number } };
};
```

**Updated `RideStackParamList`** (lines 17-21 — prepend SafetyMount):
```typescript
export type RideStackParamList = {
  SafetyMount: { bike: Bike };         // NEW — first entry
  ActiveRide: { bike: Bike };
  PaymentSummary: { rideSummary: RideSummary };
  RideReceipt: { paymentResult: PaymentResult; rideSummary: RideSummary };
};
```

**Updated `RootStackParamList`** (lines 49-54 — append NavStack + ChargeStack):
```typescript
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  BookingStack: NavigatorScreenParams<BookingStackParamList>;
  RideStack: NavigatorScreenParams<RideStackParamList>;
  NavStack: NavigatorScreenParams<NavStackParamList>;      // NEW
  ChargeStack: NavigatorScreenParams<ChargeStackParamList>; // NEW
};
```

**No new imports needed** — `Bike` is already imported on line 4.

---

### `src/navigation/RootNavigator.tsx` (navigator — append two Stack.Screen entries)

**Current file:** `VoltVenture/src/navigation/RootNavigator.tsx` (45 lines, fully read)

**Current imports** (lines 1-8): Add NavNavigator and ChargeNavigator:
```typescript
import NavNavigator from './NavNavigator';       // NEW
import ChargeNavigator from './ChargeNavigator'; // NEW
```

**Add after RideStack Stack.Screen** (after line 42):
```typescript
<Stack.Screen
  name="NavStack"
  component={NavNavigator}
  options={{ presentation: 'modal', headerShown: false }}
/>
<Stack.Screen
  name="ChargeStack"
  component={ChargeNavigator}
  options={{ presentation: 'modal', headerShown: false }}
/>
```

**Pattern source:** Existing BookingStack and RideStack entries (RootNavigator.tsx lines 33-42) — copy verbatim, change name + component.

---

### `src/navigation/RideNavigator.tsx` (navigator — prepend SafetyMount screen)

**Current file:** `VoltVenture/src/navigation/RideNavigator.tsx` (18 lines, fully read)

**Add import** (after line 4):
```typescript
import SafetyMountScreen from '../screens/ride/SafetyMountScreen'; // NEW
```

**Add as first Stack.Screen** (before current line 13 `ActiveRide`):
```typescript
<Stack.Screen name="SafetyMount" component={SafetyMountScreen} />   {/* NEW — first */}
<Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
<Stack.Screen name="PaymentSummary" component={PaymentSummaryScreen} />
<Stack.Screen name="RideReceipt" component={RideReceiptScreen} />
```

---

### `src/components/map/BikeDetailSheet.tsx` (component — add prop + secondary button)

**Current file:** `VoltVenture/src/components/map/BikeDetailSheet.tsx` (65 lines, fully read)

**Current interface** (lines 9-12):
```typescript
interface BikeDetailSheetProps {
  bike: Bike | null;
  onReserve: () => void;
}
```

**Updated interface** (add `onGetDirections`):
```typescript
interface BikeDetailSheetProps {
  bike: Bike | null;
  onReserve: () => void;
  onGetDirections: () => void;   // NEW — mirrors onReserve pattern
}
```

**Updated destructure** (line 14):
```typescript
export default function BikeDetailSheet({ bike, onReserve, onGetDirections }: BikeDetailSheetProps) {
```

**Add secondary button** after `<PrimaryButton label="Reserve" onPress={onReserve} />` (line 29):
```typescript
<PrimaryButton label="Reserve" onPress={onReserve} />
<TouchableOpacity
  style={styles.getDirectionsButton}
  onPress={onGetDirections}
  activeOpacity={0.7}
>
  <Text style={styles.getDirectionsLabel}>Get Directions</Text>
</TouchableOpacity>
```

**Add import** (line 2 — add TouchableOpacity):
```typescript
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
```

**Add styles** (after existing StyleSheet):
```typescript
getDirectionsButton: {
  borderWidth: 1,
  borderColor: DSColors.border,
  borderRadius: 8,
  paddingVertical: 12,
  alignItems: 'center',
  marginTop: 8,
},
getDirectionsLabel: {
  fontSize: 15, fontWeight: '600', color: DSColors.textPrimary,
},
```

**MapScreen.tsx caller update** (MapScreen.tsx lines 164-172 — add `onGetDirections` callback):
```typescript
<BikeDetailSheet
  bike={selectedBike}
  onReserve={() => {
    if (!selectedBike) return;
    bikeDetailRef.current?.dismiss();
    navigation.navigate('BookingStack', { screen: 'BookingConfirmation', params: { bike: selectedBike } });
  }}
  onGetDirections={() => {                        // NEW
    if (!selectedBike) return;
    bikeDetailRef.current?.dismiss();
    navigation.navigate('NavStack', { screen: 'NavigateToBike', params: { bike: selectedBike } });
  }}
/>
```

---

### `src/screens/booking/UnlockSuccessScreen.tsx` (screen — one-line change)

**Current file:** `VoltVenture/src/screens/booking/UnlockSuccessScreen.tsx` (79 lines, fully read)

**Change line 45 only:**
```typescript
// BEFORE:
onPress={() => navigation.getParent<any>()?.navigate('RideStack', { screen: 'ActiveRide', params: { bike } })}

// AFTER:
onPress={() => navigation.getParent<any>()?.navigate('RideStack', { screen: 'SafetyMount', params: { bike } })}
```

No other changes. No visual changes. No imports to add.

---

### `src/screens/ride/RideReceiptScreen.tsx` (screen — add secondary CTA)

**Current file:** `VoltVenture/src/screens/ride/RideReceiptScreen.tsx` (157 lines, fully read)

**Current Done button** (lines 79-82):
```typescript
<PrimaryButton
  label="Done"
  onPress={() => navigation.getParent()?.goBack()}
/>
```

**Add secondary CTA below PrimaryButton** (capture parent before goBack — CRITICAL for timing):
```typescript
<PrimaryButton
  label="Done"
  onPress={() => navigation.getParent()?.goBack()}
/>
<TouchableOpacity
  style={styles.findChargingButton}
  onPress={() => {
    const parent = navigation.getParent();
    parent?.goBack();                          // dismiss RideStack
    setTimeout(() => {
      parent?.navigate('ChargeStack', { screen: 'EndRideFindCharging' });
    }, 300);                                   // wait for dismiss animation
  }}
>
  <Text style={styles.findChargingLabel}>Find a Charging Station</Text>
</TouchableOpacity>
```

**Add import** (line 2 — add TouchableOpacity to RN imports):
```typescript
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
```

**Add styles:**
```typescript
findChargingButton: {
  marginTop: 12,
  paddingVertical: 12,
  alignItems: 'center',
},
findChargingLabel: {
  fontSize: 15, fontWeight: '400', color: DSColors.textSecondary,
},
```

**Critical note:** Capture `parent` before `goBack()`. After RideStack dismisses, the `navigation` prop becomes invalid for cross-stack navigation. The captured `parent` reference (RootNavigator) persists. See RESEARCH.md Critical Finding #7.

---

## Shared Patterns

### Full-Screen Map Root
**Source:** `src/screens/ride/ActiveRideScreen.tsx` lines 79-80 and `src/screens/app/MapScreen.tsx` lines 116-117
**Apply to:** NavigateToBikeScreen, EndRideFindChargingScreen, RidingToChargingScreen
```typescript
<View style={StyleSheet.absoluteFill}>
  <MapView style={StyleSheet.absoluteFill} ...>
```

### Floating Overlay Card (dark semi-transparent)
**Source:** `src/screens/ride/ActiveRideScreen.tsx` lines 100-118 and styles lines 142-151
**Apply to:** NavigateToBikeScreen (ETA card), RidingToChargingScreen (ETA card)
```typescript
<View style={[styles.overlayCard, { top: insets.top + 8 }]}>
  {/* content */}
</View>

// Style:
overlayCard: {
  position: 'absolute',
  left: 16, right: 16,
  backgroundColor: 'rgba(15,15,15,0.85)',
  borderRadius: 16,
  paddingHorizontal: 24, paddingVertical: 16,
  zIndex: 10,
},
```

### User Marker (white dot, green border)
**Source:** `src/screens/ride/ActiveRideScreen.tsx` lines 95-97, styles lines 193-200
**Apply to:** NavigateToBikeScreen, RidingToChargingScreen
```typescript
<Marker coordinate={{ latitude: USER_LAT, longitude: USER_LON }}>
  <View style={styles.userMarker} />
</Marker>

// Style:
userMarker: {
  width: 16, height: 16, borderRadius: 8,
  backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: DSColors.primary,
},
```

### Custom Header Row (back arrow + centered title + spacer)
**Source:** `src/screens/app/SettingsScreen.tsx` lines 56-66 and `src/screens/app/LoginSecurityScreen.tsx` lines 33-43
**Apply to:** WalkingDirectionsScreen, SafetyMountScreen
```typescript
<View style={styles.header}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    accessibilityRole="button"
    accessibilityLabel="Go back"
  >
    <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>{/* title */}</Text>
  <View style={{ width: 40 }} />
</View>

// Style:
header: {
  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  paddingHorizontal: 16, paddingVertical: 12,
  borderBottomWidth: 1, borderBottomColor: DSColors.border,
  height: 56,
},
headerTitle: { ...DSTypography.headingMd, color: DSColors.textPrimary },
```

### Cross-Stack Navigation (getParent pattern)
**Source:** `src/screens/booking/UnlockSuccessScreen.tsx` line 45
**Apply to:** RideReceiptScreen (Find a Charging Station), SafetyMountScreen (navigate to ActiveRide within same stack)
```typescript
// Within-stack push (SafetyMount → ActiveRide):
navigation.navigate('ActiveRide', { bike });

// Cross-stack with capture (RideReceipt → ChargeStack):
const parent = navigation.getParent();
parent?.goBack();
setTimeout(() => parent?.navigate('ChargeStack', { screen: 'EndRideFindCharging' }), 300);
```

### Modal Stack Registration
**Source:** `src/navigation/RootNavigator.tsx` lines 33-42
**Apply to:** NavStack and ChargeStack entries in RootNavigator
```typescript
<Stack.Screen
  name="NavStack"
  component={NavNavigator}
  options={{ presentation: 'modal', headerShown: false }}
/>
```

### StyleSheet.create Convention (no NativeWind on map screens)
**Source:** All existing map screens (MapScreen.tsx, ActiveRideScreen.tsx)
**Apply to:** NavigateToBikeScreen, EndRideFindChargingScreen, RidingToChargingScreen
```typescript
// CORRECT — use StyleSheet.create + DSColors
const styles = StyleSheet.create({ ... });

// WRONG — do not use className props on map screens
// <View className="flex-1 bg-white">  ← NativeWind causes layout issues
```

### DSColors and DSTypography Tokens
**Source:** `src/theme/theme.ts` lines 11-77
```typescript
// Key tokens used in this phase:
DSColors.primary          // '#C6FF2D' — polyline, button BG, charger pins
DSColors.background       // '#FFFFFF' — light screen BG, info card BG
DSColors.surface          // '#FAFAFA' — list row fill
DSColors.textPrimary      // '#0F0F0F' — body text, header title
DSColors.textSecondary    // '#808080' — step distances, ETA distance label
DSColors.accent           // '#7D9220' — checked item icon color
DSColors.border           // '#EBEBEB' — row dividers, card borders

DSTypography.headingMd    // { fontSize: 17, lineHeight: 24, fontWeight: '600' }
DSTypography.body         // { fontSize: 15, lineHeight: 22, fontWeight: '400' }
DSTypography.label        // { fontSize: 13, lineHeight: 16, fontWeight: '600' }
```

### tracksViewChanges on Custom Markers
**Source:** `src/screens/app/MapScreen.tsx` line 133
**Apply to:** EndRideFindChargingScreen charger Marker components
```typescript
<Marker
  key={charger.name}
  coordinate={{ latitude: charger.latitude, longitude: charger.longitude }}
  tracksViewChanges={false}   // prevents Android re-render perf degradation
>
```

---

## No Analog Found

All files in this phase have close codebase analogs. No files without analog.

---

## Anti-Patterns to Avoid

| Pattern | Why Wrong | Correct Approach |
|---------|-----------|------------------|
| `import { haversineKm } from '../../screens/app/MapScreen'` | `haversineKm` has no `export` keyword in MapScreen.tsx (line 18) | Inline the 10-line function body in each new screen |
| `<Polyline>` placed outside `<MapView>` | Will not render; coordinate projection only works inside MapView | Place `<Polyline>` as a direct JSX child of `<MapView>` |
| `navigation.navigate('NavStack', ...)` before NavStack is in RootStackParamList | TypeScript error; types must precede screen code | Update `navigation.ts` first (07-01 first task) |
| `navigation.navigate('ChargeStack', ...)` immediately after `goBack()` | Stack mid-dismiss animation causes navigation error | Capture `parent`, call `goBack()`, then `setTimeout(300ms)` before `parent.navigate(...)` |
| NativeWind `className` on map screens | Layout issues on full-screen MapView | Use `StyleSheet.create` + `DSColors` tokens only |

---

## Metadata

**Analog search scope:** `VoltVenture/src/screens/`, `VoltVenture/src/navigation/`, `VoltVenture/src/components/`, `VoltVenture/src/types/`, `VoltVenture/src/theme/`
**Files scanned:** 11 source files read in full
**Pattern extraction date:** 2026-08-19
