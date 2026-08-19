# Phase 9: Discovery & Content - Pattern Map

**Mapped:** 2026-08-19
**Files analyzed:** 14 (10 new, 4 modified)
**Analogs found:** 13 / 14 (SupportScreen has no direct analog — first List.Accordion usage)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/components/map/CafeMarker.tsx` | component | request-response | `src/components/map/BikeMarker.tsx` | exact |
| `src/components/map/CafeDetailSheet.tsx` | component | request-response | `src/components/map/BikeDetailSheet.tsx` | exact |
| `src/navigation/DiscoverNavigator.tsx` | navigator | — | `src/navigation/AccountNavigator.tsx` | exact |
| `src/screens/discover/DiscoverScreen.tsx` | screen | request-response | `src/screens/app/AccountScreen.tsx` | exact |
| `src/screens/discover/CuratedRoutesScreen.tsx` | screen | batch | `src/screens/app/RideHistoryScreen.tsx` | role-match |
| `src/screens/discover/VipHubsScreen.tsx` | screen | batch | `src/screens/app/RideHistoryScreen.tsx` + `src/screens/navigation/NavigateToBikeScreen.tsx` | role-match |
| `src/screens/navigation/NavigateToPoiScreen.tsx` | screen | request-response | `src/screens/navigation/NavigateToBikeScreen.tsx` | exact |
| `src/screens/discover/SupportScreen.tsx` | screen | request-response | `src/screens/app/VoltCoinsRewardsScreen.tsx` (Snackbar + ScrollView) | partial |
| `src/screens/discover/PrivacyPolicyScreen.tsx` | screen | request-response | `src/screens/app/VoltCoinsRewardsScreen.tsx` (ScrollView + custom header) | role-match |
| `src/screens/discover/TermsOfServiceScreen.tsx` | screen | request-response | `src/screens/app/VoltCoinsRewardsScreen.tsx` (ScrollView + custom header) | role-match |
| `src/navigation/AppTabs.tsx` *(modify)* | navigator | — | self | exact |
| `src/types/navigation.ts` *(modify)* | types | — | self | exact |
| `src/navigation/NavNavigator.tsx` *(modify)* | navigator | — | self | exact |
| `src/screens/app/MapScreen.tsx` *(modify)* | screen | request-response | self | exact |

---

## Pattern Assignments

### `src/components/map/CafeMarker.tsx` (component, request-response)

**Analog:** `src/components/map/BikeMarker.tsx`

**Full analog** (lines 1–41 — small file, copy and adapt):
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DSColors } from '../../theme/theme';

export default function CafeMarker() {
  return (
    <View style={styles.pinContainer}>
      <View style={styles.circle}>
        <MaterialCommunityIcons name="coffee" size={18} color={DSColors.textPrimary} />
      </View>
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DSColors.background,   // WHITE — distinct from Electric Green bike pins
    borderWidth: 2,
    borderColor: DSColors.border,           // #EBEBEB border
    alignItems: 'center',
    justifyContent: 'center',
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: DSColors.background,    // white tail (matches circle bg)
  },
});
```

**Diff from BikeMarker:**
- `backgroundColor`: `DSColors.primary` → `DSColors.background`
- `borderColor`: `DSColors.textOnPrimary` → `DSColors.border`
- `borderTopColor` (tail): `DSColors.primary` → `DSColors.background`
- Icon: `"lightning-bolt"` → `"coffee"`
- Icon color: `DSColors.textOnPrimary` → `DSColors.textPrimary`

---

### `src/components/map/CafeDetailSheet.tsx` (component, request-response)

**Analog:** `src/components/map/BikeDetailSheet.tsx`

**Imports pattern** (lines 1–7 of BikeDetailSheet, adapted):
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DSColors, DSTypography } from '../../theme/theme';
import PrimaryButton from '../common/PrimaryButton';
```

**Props interface** (adapt from BikeDetailSheet lines 9–13):
```typescript
// Cafe type (declare locally or import from types/cafe.ts)
type Cafe = { id: string; name: string; hours: string; latitude: number; longitude: number };

interface CafeDetailSheetProps {
  cafe: Cafe | null;
  userLocation: { latitude: number; longitude: number } | null;
  onGetDirections: () => void;
}
```

**Null guard pattern** (from BikeDetailSheet line 16):
```typescript
export default function CafeDetailSheet({ cafe, userLocation, onGetDirections }: CafeDetailSheetProps) {
  if (!cafe) return null;
  // ...
}
```

**haversineKm inline copy** (from MapScreen.tsx lines 18–29 — NOT exported, copy verbatim):
```typescript
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

**Core pattern** (BottomSheetView root, handle, content — from BikeDetailSheet lines 18–39):
```typescript
return (
  <BottomSheetView style={styles.container}>
    <View style={styles.handle} />
    {/* Photo placeholder */}
    <View style={styles.photoPlaceholder}>
      <MaterialCommunityIcons name="coffee" size={48} color={DSColors.textSecondary} />
    </View>
    <Text style={styles.cafeName}>{cafe.name}</Text>
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name="clock-outline" size={14} color={DSColors.textSecondary} />
      <Text style={styles.infoText}>{cafe.hours}</Text>
    </View>
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name="map-marker" size={14} color={DSColors.textSecondary} />
      <Text style={styles.infoText}>
        {distanceKm != null ? `${distanceKm.toFixed(1)} km away` : '—'}
      </Text>
    </View>
    <PrimaryButton label="Get Directions" onPress={onGetDirections} />
  </BottomSheetView>
);
```

**StyleSheet pattern** (from BikeDetailSheet lines 42–86, key values to replicate):
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
    marginTop: 8,
    marginBottom: 16,
  },
  photoPlaceholder: {
    height: 120,
    backgroundColor: DSColors.surface,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cafeName: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: DSColors.textSecondary,
  },
});
```

---

### `src/navigation/DiscoverNavigator.tsx` (navigator)

**Analog:** `src/navigation/AccountNavigator.tsx`

**Full analog** (lines 1–41 of AccountNavigator, adapted — no ProfileProvider wrapper needed):
```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../types/navigation';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import CuratedRoutesScreen from '../screens/discover/CuratedRoutesScreen';
import VipHubsScreen from '../screens/discover/VipHubsScreen';
import SupportScreen from '../screens/discover/SupportScreen';
import PrivacyPolicyScreen from '../screens/discover/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/discover/TermsOfServiceScreen';

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

**Key diff from AccountNavigator:** No `<ProfileProvider>` wrapper. All screens use `headerShown: false` (custom headers throughout).

---

### `src/screens/discover/DiscoverScreen.tsx` (screen, request-response)

**Analog:** `src/screens/app/AccountScreen.tsx`

**Imports pattern** (from AccountScreen lines 1–11, adapted):
```typescript
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import { DSColors } from '../../theme/theme';
import type { DiscoverStackParamList } from '../../types/navigation';

type Props = StackScreenProps<DiscoverStackParamList, 'DiscoverMain'>;
```

**Section header pattern** (from VoltCoinsRewardsScreen lines 153–162 — exact style to replicate):
```typescript
// Style:
sectionHeader: {
  fontSize: 12,
  fontWeight: '600',
  color: DSColors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  paddingHorizontal: 24,
  paddingTop: 20,
  paddingBottom: 8,
},
```

**Menu row pattern** (from AccountScreen lines 70–88, 222–241 — exact styles to copy):
```typescript
// JSX for one menu row:
<TouchableOpacity
  style={styles.menuRow}
  onPress={() => navigation.navigate('CuratedRoutes')}
  activeOpacity={0.7}
  accessibilityRole="button"
  accessibilityLabel="Curated Routes"
>
  <View style={styles.menuRowLeft}>
    <MaterialCommunityIcons name="map-route" size={20} color={DSColors.textPrimary} />
    <Text style={styles.menuRowText}>Curated Routes</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>

// Styles (from AccountScreen lines 222–241):
menuRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingVertical: 16,
  backgroundColor: DSColors.surface,
  borderTopWidth: 1,
  borderColor: DSColors.border,
},
menuRowLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},
menuRowText: {
  fontSize: 16,
  fontWeight: '400',
  color: DSColors.textPrimary,
},
```

**Last row in section** — add `borderBottomWidth: 1` (AccountScreen line 269 `logoutRow` pattern):
```typescript
// Last row style (VIP Hubs in Explore section, Terms of Service in Info section):
menuRowLast: {
  ...menuRow styles...,
  borderBottomWidth: 1,
},
```

**Icon assignments per D-02 and CONTEXT specifics:**
- "Curated Routes": `map-route`
- "VIP Hubs": `lightning-bolt-circle`
- "Support & Help": `help-circle-outline`
- "Privacy Policy": `file-document-outline`
- "Terms of Service": `file-check-outline`

**Screen title pattern** (from AccountScreen lines 212–221):
```typescript
titleSection: {
  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 16,
},
title: {
  fontSize: 24,
  fontWeight: '700',
  color: DSColors.textPrimary,
},
```

---

### `src/screens/discover/CuratedRoutesScreen.tsx` (screen, batch)

**Analog:** `src/screens/app/RideHistoryScreen.tsx`

**Imports pattern** (from RideHistoryScreen lines 1–9, adapted):
```typescript
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<DiscoverStackParamList, 'CuratedRoutes'>;
```

**Custom header pattern** (from VoltCoinsRewardsScreen lines 35–45):
```typescript
<View style={styles.header}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    accessibilityRole="button"
    accessibilityLabel="Go back"
  >
    <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Curated Routes</Text>
  <View style={{ width: 40 }} />
</View>

// Header styles (from VoltCoinsRewardsScreen lines 122–131, add border per UI-SPEC):
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingTop: 16,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderColor: DSColors.border,
  backgroundColor: DSColors.background,
},
headerTitle: {
  fontSize: 17,
  fontWeight: '600',
  color: DSColors.textPrimary,
},
```

**FlatList pattern** (from RideHistoryScreen lines 96–105):
```typescript
<FlatList
  data={MOCK_ROUTES}
  keyExtractor={item => item.id}
  renderItem={renderRoute}
  ItemSeparatorComponent={() => <View style={styles.separator} />}
  contentContainerStyle={styles.listContent}
/>
```

**ItemSeparatorComponent** (from RideHistoryScreen line 92):
```typescript
// Style (from RideHistoryScreen lines 148–152):
separator: {
  height: 1,
  backgroundColor: DSColors.border,
  marginHorizontal: 24,
},
```

**Mock data** (inline const in screen file, per CONTEXT.md specifics):
```typescript
type Route = {
  id: string;
  name: string;
  distanceKm: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  tags: string[];
};

const MOCK_ROUTES: Route[] = [
  { id: 'r1', name: 'Canal Ring Classic', distanceKm: 12, difficulty: 'Easy', tags: ['Waterfront', 'Historic'] },
  { id: 'r2', name: 'Vondelpark Loop', distanceKm: 8, difficulty: 'Easy', tags: ['Park', 'Family-Friendly'] },
  { id: 'r3', name: 'Harbor Views Ride', distanceKm: 18, difficulty: 'Moderate', tags: ['Waterfront', 'Scenic'] },
  { id: 'r4', name: 'Amstel Riverside Run', distanceKm: 22, difficulty: 'Moderate', tags: ['Riverside', 'Historic'] },
  { id: 'r5', name: 'Noord Cross', distanceKm: 28, difficulty: 'Challenging', tags: ['Urban', 'Adventurous'] },
];
```

**Snackbar pattern** (from VoltCoinsRewardsScreen lines 30, 104–112):
```typescript
const [snackVisible, setSnackVisible] = useState(false);

// Trigger on card tap:
onPress={() => setSnackVisible(true)}

// JSX (outside FlatList, inside SafeAreaView):
<Portal>
  <Snackbar
    visible={snackVisible}
    onDismiss={() => setSnackVisible(false)}
    duration={2500}
  >
    Route details coming soon
  </Snackbar>
</Portal>
```

**Difficulty badge colors** (inline rgba per UI-SPEC — not DSColors tokens):
```typescript
// Badge background by difficulty:
// Easy: rgba(198, 255, 45, 0.15) with color DSColors.accent (#7D9220)
// Moderate: rgba(255, 165, 0, 0.15) with color '#A35F00'
// Challenging: rgba(255, 59, 48, 0.15) with color DSColors.destructive
```

---

### `src/screens/discover/VipHubsScreen.tsx` (screen, batch)

**Analogs:** `src/screens/app/RideHistoryScreen.tsx` (FlatList) + `src/screens/navigation/NavigateToBikeScreen.tsx` (MapView)

**Imports pattern:**
```typescript
import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { DiscoverStackParamList, RootStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

type Props = StackScreenProps<DiscoverStackParamList, 'VipHubs'>;
```

**Map + list split layout** (Dimensions pattern per RESEARCH.md Pattern 11):
```typescript
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);

// Refs:
const mapRef = useRef<MapView>(null);
const flatListRef = useRef<FlatList>(null);

// State:
const [expandedHubId, setExpandedHubId] = useState<string | null>(null);

// Layout JSX:
<SafeAreaView style={styles.safeArea} edges={['bottom']}>
  {/* Custom header */}
  <View style={styles.header}>...</View>
  {/* Fixed-height map */}
  <MapView
    ref={mapRef}
    style={{ height: MAP_HEIGHT }}
    scrollEnabled={false}
    zoomEnabled={false}
    pitchEnabled={false}
    rotateEnabled={false}
    initialRegion={{ latitude: 52.3676, longitude: 4.9041, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
  >
    {MOCK_HUBS.map(hub => (
      <Marker
        key={hub.id}
        coordinate={{ latitude: hub.latitude, longitude: hub.longitude }}
        onPress={() => handleHubMarkerPress(hub)}
        tracksViewChanges={false}
      >
        <View style={styles.hubMarkerCircle}>
          <MaterialCommunityIcons name="star-circle" size={18} color={DSColors.textOnPrimary} />
        </View>
      </Marker>
    ))}
  </MapView>
  {/* FlatList fills remaining space */}
  <FlatList
    ref={flatListRef}
    data={MOCK_HUBS}
    keyExtractor={item => item.id}
    renderItem={renderHub}
    style={styles.list}
    getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    contentContainerStyle={{ paddingBottom: 24 }}
  />
</SafeAreaView>
```

**getItemLayout constant** (from RESEARCH.md Pattern 11):
```typescript
const ITEM_HEIGHT = 108; // collapsed card: paddingVertical 16×2 + name ~22 + status row ~22 + margin ~32
```

**Hub marker style** (from RESEARCH.md Pattern 11 — same shape as BikeMarker, DSColors.primary bg):
```typescript
hubMarkerCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: DSColors.primary,   // Electric Green — same as bike pins but different icon
  borderWidth: 2,
  borderColor: DSColors.textOnPrimary,
  alignItems: 'center',
  justifyContent: 'center',
},
```

**Inline expand renderHub** (from RESEARCH.md code example, adapted):
```typescript
function renderHub({ item, index }: { item: VipHub; index: number }) {
  const isExpanded = expandedHubId === item.id;
  return (
    <TouchableOpacity
      style={styles.hubCard}
      onPress={() => {
        setExpandedHubId(isExpanded ? null : item.id);
        mapRef.current?.animateToRegion(
          { latitude: item.latitude, longitude: item.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
          500,
        );
        if (!isExpanded) {
          flatListRef.current?.scrollToIndex({ index, animated: true });
        }
      }}
      activeOpacity={0.8}
    >
      {/* Collapsed content */}
      <View style={styles.hubCardRow}>
        <Text style={styles.hubName}>{item.name}</Text>
        <View style={styles.vipBadge}><Text style={styles.vipBadgeText}>VIP</Text></View>
      </View>
      <View style={styles.hubCardRow}>
        <Text style={styles.hubDistance}>{item.distanceKm.toFixed(1)} km</Text>
        <View style={[styles.statusBadge, item.status === 'Full' && styles.statusBadgeFull]}>
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
      </View>
      {/* Expanded content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.hubDescription}>{item.description}</Text>
          <Text style={styles.hubAmenities}>Fast charge · Covered parking · 24h access</Text>
          <Text style={styles.hubHours}>{item.hours}</Text>
          <PrimaryButton
            label="Get Directions"
            onPress={() => {
              navigation.navigate('NavStack', {
                screen: 'NavigateToPoi',
                params: { name: item.name, location: { latitude: item.latitude, longitude: item.longitude } },
              });
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}
```

**Mock data:**
```typescript
type VipHub = {
  id: string; name: string; latitude: number; longitude: number;
  distanceKm: number; status: 'Available' | 'Full';
  description: string; hours: string;
};

const MOCK_HUBS: VipHub[] = [
  { id: 'h1', name: 'VoltHub Central Station', latitude: 52.3791, longitude: 4.9003, distanceKm: 1.2, status: 'Available', description: 'Premium charging hub adjacent to Amsterdam Centraal.', hours: '24/7' },
  { id: 'h2', name: 'Dam Square VoltHub', latitude: 52.3731, longitude: 4.8936, distanceKm: 0.8, status: 'Available', description: 'Covered hub in the heart of Amsterdam.', hours: '06:00–24:00' },
  { id: 'h3', name: 'Leidseplein VoltHub', latitude: 52.3643, longitude: 4.8833, distanceKm: 1.5, status: 'Full', description: 'Popular entertainment district hub.', hours: '24/7' },
  { id: 'h4', name: 'Waterlooplein VoltHub', latitude: 52.3674, longitude: 4.9016, distanceKm: 0.4, status: 'Available', description: 'Hub near the flea market and opera house.', hours: '08:00–22:00' },
  { id: 'h5', name: 'Vondelpark VoltHub', latitude: 52.3585, longitude: 4.8706, distanceKm: 2.1, status: 'Available', description: 'Scenic park-side charging station.', hours: '07:00–22:00' },
];
```

---

### `src/screens/navigation/NavigateToPoiScreen.tsx` (screen, request-response)

**Analog:** `src/screens/navigation/NavigateToBikeScreen.tsx`

**Full analog** (lines 1–153 — copy verbatim, apply these diffs):

**Imports** (lines 1–8 — identical, change type import):
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { NavStackParamList } from '../../types/navigation';
import { DSColors, DSTypography } from '../../theme/theme';
```

**haversineKm inline copy** (lines 11–22 — copy verbatim, comment preserved):
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

const USER_LAT = 52.3676;
const USER_LON = 4.9041;
```

**Type and param destructure** (lines 27–30, change both):
```typescript
// FROM (NavigateToBike):
type Props = StackScreenProps<NavStackParamList, 'NavigateToBike'>;
export default function NavigateToBikeScreen({ route, navigation }: Props) {
  const { bike } = route.params;

// TO (NavigateToPoi):
type Props = StackScreenProps<NavStackParamList, 'NavigateToPoi'>;
export default function NavigateToPoiScreen({ route, navigation }: Props) {
  const { name, location } = route.params;
```

**Computed values** (lines 34–36, change coordinate refs):
```typescript
// FROM:
const distanceKm = haversineKm(USER_LAT, USER_LON, bike.latitude, bike.longitude);
// TO:
const distanceKm = haversineKm(USER_LAT, USER_LON, location.latitude, location.longitude);
// etaMin and distanceM lines are identical
```

**MapView initialRegion** (lines 57–61, change coordinate refs):
```typescript
// FROM:
initialRegion={{
  latitude: (USER_LAT + bike.latitude) / 2,
  longitude: (USER_LON + bike.longitude) / 2,
// TO:
initialRegion={{
  latitude: (USER_LAT + location.latitude) / 2,
  longitude: (USER_LON + location.longitude) / 2,
```

**Destination Marker** (line 73, change coordinate refs):
```typescript
// FROM:
<Marker coordinate={{ latitude: bike.latitude, longitude: bike.longitude }}>
// TO:
<Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
```

**Polyline endpoint** (line 82, change coordinate refs):
```typescript
// FROM:
{ latitude: bike.latitude, longitude: bike.longitude },
// TO:
{ latitude: location.latitude, longitude: location.longitude },
```

**Overlay card changes** (lines 90–101 — three changes):
```typescript
// 1. ETA card destination name (line 91):
// FROM: <Text style={styles.bikeName}>{bike.name}</Text>
// TO:   <Text style={styles.bikeName}>{name}</Text>

// 2. Add back button (new — NavigateToPoiScreen specific per UI-SPEC):
<TouchableOpacity
  onPress={() => navigation.goBack()}
  style={styles.backButton}
  accessibilityRole="button"
  accessibilityLabel="Go back"
>
  <MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" />
</TouchableOpacity>

// 3. OMIT "View Turn-by-Turn" button entirely (lines 95–101 in NavigateToBike — remove)
```

**StyleSheet** (lines 106–153 — copy verbatim, add backButton style, rename bikeName → poiName):
```typescript
const styles = StyleSheet.create({
  // ... all styles identical to NavigateToBikeScreen ...
  backButton: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  // rename: bikeName → poiName (same values)
  poiName: {
    ...DSTypography.headingMd,
    color: '#FFFFFF',
  },
  // etaLabel, turnByTurnButton, turnByTurnLabel, userMarker, loadingContainer — all identical
});
```

---

### `src/screens/discover/SupportScreen.tsx` (screen, request-response)

**Analog:** `src/screens/app/VoltCoinsRewardsScreen.tsx` (Snackbar + ScrollView structure)
**Note:** List.Accordion is first usage in codebase — no prior analog. Pattern from RESEARCH.md Pattern 12.

**Imports pattern:**
```typescript
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Divider, Portal, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<DiscoverStackParamList, 'Support'>;
```

**Custom header** (from VoltCoinsRewardsScreen lines 35–45 — copy verbatim, change title):
```typescript
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
    <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Support & Help</Text>
  <View style={{ width: 40 }} />
</View>
```

**List.Accordion pattern** (from RESEARCH.md Pattern 12 — first occurrence, no codebase analog):
```typescript
// State: uncontrolled (no expanded prop needed)
<ScrollView showsVerticalScrollIndicator={false}>
  <List.Section>
    <List.Subheader style={styles.sectionHeader}>Rides & Billing</List.Subheader>
    <List.Accordion
      title="How do I start a ride?"
      titleStyle={styles.accordionTitle}
    >
      <List.Item
        description="Tap any green bike pin on the map, book the bike, and scan the QR code on the bike's handlebars."
        descriptionStyle={styles.accordionBody}
        descriptionNumberOfLines={0}
      />
    </List.Accordion>
    <Divider style={{ backgroundColor: DSColors.border }} />
    {/* More accordions... */}
  </List.Section>

  {/* "Contact Support" CTA at bottom */}
  <TouchableOpacity
    style={styles.contactButton}
    onPress={() => setSnackVisible(true)}
    accessibilityRole="button"
    accessibilityLabel="Contact Support"
  >
    <Text style={styles.contactButtonText}>Contact Support</Text>
  </TouchableOpacity>
</ScrollView>

<Portal>
  <Snackbar
    visible={snackVisible}
    onDismiss={() => setSnackVisible(false)}
    duration={2500}
  >
    Support chat coming soon
  </Snackbar>
</Portal>
```

**Key List.Accordion styles:**
```typescript
accordionTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: DSColors.textPrimary,
},
accordionBody: {
  fontSize: 15,
  color: DSColors.textSecondary,
  lineHeight: 22,
},
// descriptionNumberOfLines={0} on List.Item is REQUIRED — default truncates at 2 lines
```

**Snackbar state** (from VoltCoinsRewardsScreen line 30):
```typescript
const [snackVisible, setSnackVisible] = useState(false);
```

**FAQ mock content** (inline — 3 sections, 6–8 items per CONTEXT D-12):
- Section "Rides & Billing": "How do I start a ride?", "How am I charged?", "How do I end a ride?"
- Section "Account": "How do I reset my password?", "How do I add a payment method?"
- Section "Bikes & Safety": "What if the bike doesn't unlock?", "What should I do in an emergency?"

---

### `src/screens/discover/PrivacyPolicyScreen.tsx` (screen, request-response)

**Analog:** `src/screens/app/VoltCoinsRewardsScreen.tsx` (ScrollView + custom header structure)

**Imports pattern:**
```typescript
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<DiscoverStackParamList, 'PrivacyPolicy'>;
```

**Custom header** (from VoltCoinsRewardsScreen lines 35–45 — copy verbatim, change title to "Privacy Policy"):

**Core pattern** (ScrollView with section headers + paragraphs — no analog, implement directly):
```typescript
<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
  <Text style={styles.sectionTitle}>Data We Collect</Text>
  <Text style={styles.paragraph}>
    We collect information you provide when creating an account, including your name, email address, and payment information. We also collect location data to show nearby bikes and navigation services.
  </Text>
  <Text style={styles.sectionTitle}>How We Use Data</Text>
  <Text style={styles.paragraph}>
    Your data is used to operate the VoltVenture platform, process payments, provide customer support, and improve our services. We do not sell your personal data to third parties.
  </Text>
  <Text style={styles.sectionTitle}>Your Rights (GDPR)</Text>
  <Text style={styles.paragraph}>
    You have the right to access, correct, or delete your personal data. To exercise these rights, contact support@voltventure.app. Requests are processed within 30 days.
  </Text>
  <Text style={styles.sectionTitle}>Contact</Text>
  <Text style={styles.paragraph}>
    VoltVenture BV, Keizersgracht 123, Amsterdam, Netherlands. privacy@voltventure.app
  </Text>
</ScrollView>
```

**Styles:**
```typescript
scrollContent: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16 },
sectionTitle: { fontSize: 16, fontWeight: '600', color: DSColors.textPrimary, marginTop: 20, marginBottom: 8 },
paragraph: { fontSize: 15, color: DSColors.textSecondary, lineHeight: 22 },
```

---

### `src/screens/discover/TermsOfServiceScreen.tsx` (screen, request-response)

**Analog:** Same as `PrivacyPolicyScreen.tsx` — identical structure.

**Diff from PrivacyPolicyScreen:**
- Type: `StackScreenProps<DiscoverStackParamList, 'TermsOfService'>`
- Header title: "Terms of Service"
- Section titles: "Use of Service", "Rental Terms", "Liability", "Governing Law"
- Paragraph content: rental terms, damage liability, cancellation policy, Amsterdam jurisdiction

---

### `src/navigation/AppTabs.tsx` *(modify)*

**Self-analog** (lines 1–55)

**Changes required:**

1. Add import for DiscoverNavigator (after line 6 `import AccountNavigator`):
```typescript
import DiscoverNavigator from './DiscoverNavigator';
```

2. Insert Discover Tab.Screen between Map and Account (after line 38, before line 39):
```typescript
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
```

**Note:** `AppTabParamList` must be updated in `navigation.ts` BEFORE this file is touched to avoid TypeScript error.

---

### `src/types/navigation.ts` *(modify)*

**Self-analog** (lines 1–77)

**Three additions required:**

1. Add `DiscoverStackParamList` (after line 38 `AccountStackParamList`, before line 41 `AppTabParamList`):
```typescript
export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  CuratedRoutes: undefined;
  VipHubs: undefined;
  Support: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};
```

2. Update `AppTabParamList` (line 41–44, add Discover entry):
```typescript
export type AppTabParamList = {
  Map: undefined;
  Discover: NavigatorScreenParams<DiscoverStackParamList>;  // NEW — insert between Map and Account
  Account: NavigatorScreenParams<AccountStackParamList>;
};
```

3. Update `NavStackParamList` (line 53–56, add NavigateToPoi entry):
```typescript
export type NavStackParamList = {
  NavigateToBike: { bike: Bike };
  WalkingDirections: { bike: Bike };
  NavigateToPoi: { name: string; location: { latitude: number; longitude: number } };  // NEW
};
```

`NavigatorScreenParams` is already imported at line 1 — no new import needed.

---

### `src/navigation/NavNavigator.tsx` *(modify)*

**Self-analog** (lines 1–16)

**Changes required:**

1. Add import for NavigateToPoiScreen (after line 4):
```typescript
import NavigateToPoiScreen from '../screens/navigation/NavigateToPoiScreen';
```

2. Add Stack.Screen inside navigator (after line 13):
```typescript
<Stack.Screen name="NavigateToPoi" component={NavigateToPoiScreen} />
```

---

### `src/screens/app/MapScreen.tsx` *(modify)*

**Self-analog** (lines 1–262)

**Changes required:**

1. Add CafeMarker and CafeDetailSheet imports (after line 16):
```typescript
import CafeMarker from '../../components/map/CafeMarker';
import CafeDetailSheet from '../../components/map/CafeDetailSheet';
```

2. Define Cafe type and MOCK_CAFES const (after line 29 haversineKm function):
```typescript
type Cafe = { id: string; name: string; hours: string; latitude: number; longitude: number };

const MOCK_CAFES: Cafe[] = [
  { id: 'c1', name: 'Café de Jaren', hours: 'Mon–Sun 9:00–23:00', latitude: 52.3684, longitude: 4.8960 },
  { id: 'c2', name: 'Screaming Beans', hours: 'Mon–Fri 8:00–17:00, Sat–Sun 9:00–17:00', latitude: 52.3637, longitude: 4.8833 },
  { id: 'c3', name: 'Lot Sixty One Coffee', hours: 'Mon–Fri 8:00–17:00, Sat 9:00–17:00', latitude: 52.3612, longitude: 4.8745 },
  { id: 'c4', name: 'Headfirst Coffee', hours: 'Mon–Sun 8:00–18:00', latitude: 52.3703, longitude: 4.9014 },
  { id: 'c5', name: 'Black Gold Coffee', hours: 'Mon–Sun 8:30–18:00', latitude: 52.3671, longitude: 4.9044 },
];
```

3. Add state and ref (parallel to existing `selectedBike` and `bikeDetailRef` at lines 34, 39):
```typescript
const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
const cafeDetailRef = useRef<BottomSheetModal>(null);
const cafeSnapPoints = useMemo(() => ['55%'], []);
```

4. Add handler (parallel to `handleMarkerPress` at line 86–89):
```typescript
const handleCafeMarkerPress = useCallback((cafe: Cafe) => {
  setSelectedCafe(cafe);
  cafeDetailRef.current?.present();
}, []);
```

5. Add café Markers inside MapView (after line 137, the closing `</Marker>` of bike markers block):
```typescript
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

6. Add CafeDetailSheet BottomSheetModal (after line 177, after existing BikeDetailSheet BottomSheetModal):
```typescript
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
        params: {
          name: selectedCafe.name,
          location: { latitude: selectedCafe.latitude, longitude: selectedCafe.longitude },
        },
      });
    }}
  />
</BottomSheetModal>
```

**Note:** `renderBackdrop` is already defined at line 100–103 and shared between BikeDetailSheet, FilterSheet, and CafeDetailSheet.

---

## Shared Patterns

### Custom Header (back button + centered title + spacer)
**Source:** `src/screens/app/VoltCoinsRewardsScreen.tsx` lines 35–45, 122–134
**Apply to:** CuratedRoutesScreen, VipHubsScreen, SupportScreen, PrivacyPolicyScreen, TermsOfServiceScreen
```typescript
// JSX:
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
    <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>{/* Screen title */}</Text>
  <View style={{ width: 40 }} />
</View>

// Styles:
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingTop: 16,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderColor: DSColors.border,
  backgroundColor: DSColors.background,
},
headerTitle: {
  fontSize: 17,
  fontWeight: '600',
  color: DSColors.textPrimary,
},
```

### SafeAreaView Root
**Source:** All existing screens (e.g., `src/screens/app/RideHistoryScreen.tsx` line 95)
**Apply to:** All Discover screens
```typescript
<SafeAreaView style={styles.safeArea} edges={['bottom']}>
// ...
safeArea: { flex: 1, backgroundColor: DSColors.background },
```

### Section Header (overline uppercase label)
**Source:** `src/screens/app/VoltCoinsRewardsScreen.tsx` lines 153–162
**Apply to:** DiscoverScreen ("Explore", "Info" sections)
```typescript
sectionHeader: {
  fontSize: 12,
  fontWeight: '600',
  color: DSColors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  paddingHorizontal: 24,
  paddingTop: 20,
  paddingBottom: 8,
},
```

### Snackbar + Portal
**Source:** `src/screens/app/VoltCoinsRewardsScreen.tsx` lines 30, 104–112
**Apply to:** CuratedRoutesScreen (route card tap), SupportScreen (Contact Support tap)
```typescript
const [snackVisible, setSnackVisible] = useState(false);

<Portal>
  <Snackbar visible={snackVisible} onDismiss={() => setSnackVisible(false)} duration={2500}>
    {message}
  </Snackbar>
</Portal>
```

### BottomSheetModal Mounting
**Source:** `src/screens/app/MapScreen.tsx` lines 39–42, 100–103, 158–177
**Apply to:** CafeDetailSheet addition in MapScreen (parallel pattern to BikeDetailSheet)
```typescript
const ref = useRef<BottomSheetModal>(null);
const snapPoints = useMemo(() => ['55%'], []);
const renderBackdrop = useCallback(
  (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
  [],
);

<BottomSheetModal ref={ref} snapPoints={snapPoints} enablePanDownToClose backdropComponent={renderBackdrop}>
  {/* Content component */}
</BottomSheetModal>
```

### StyleSheet + DSColors (no NativeWind)
**Source:** Every existing screen in the codebase
**Apply to:** All Phase 9 files
- Never use inline hex literals — always `DSColors.*`
- Exception: badge `rgba(...)` backgrounds per UI-SPEC
- Never use NativeWind className props on Phase 9 screens

### Marker with tracksViewChanges={false}
**Source:** `src/screens/app/MapScreen.tsx` line 133
**Apply to:** CafeMarker Marker wrapper in MapScreen, VIP hub Markers in VipHubsScreen
```typescript
<Marker
  key={item.id}
  coordinate={{ latitude: item.latitude, longitude: item.longitude }}
  onPress={() => handlePress(item)}
  tracksViewChanges={false}
>
  {/* Custom marker component */}
</Marker>
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/screens/discover/SupportScreen.tsx` (List.Accordion portion) | screen | request-response | `List.Accordion` from react-native-paper has no prior usage in codebase. ScrollView + custom header + Snackbar analogs exist; only the accordion component itself is new. Use RESEARCH.md Pattern 12 as the reference. |

---

## Metadata

**Analog search scope:** `VoltVenture/src/` — navigation, screens, components, types
**Files scanned:** 10 analog files read directly
**Key analogs by priority:**
1. `BikeMarker.tsx` — exact template for CafeMarker (change 4 color/icon values)
2. `BikeDetailSheet.tsx` — exact template for CafeDetailSheet (change props interface + content)
3. `AccountNavigator.tsx` — exact template for DiscoverNavigator (no ProfileProvider wrapper)
4. `AccountScreen.tsx` — exact menu-row styles for DiscoverScreen
5. `NavigateToBikeScreen.tsx` — exact template for NavigateToPoiScreen (param/coordinate substitution)
6. `MapScreen.tsx` — BottomSheetModal mounting pattern + Marker layer pattern for modifications
7. `VoltCoinsRewardsScreen.tsx` — custom header + Snackbar + sectionHeader style
8. `RideHistoryScreen.tsx` — FlatList + ItemSeparatorComponent + sectionHeader label style
9. `NavNavigator.tsx` — minimal touch pattern for adding NavigateToPoi screen
10. `navigation.ts` — type update locations and NavigatorScreenParams import

**Pattern extraction date:** 2026-08-19
