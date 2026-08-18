# Phase 5: Account & Profile - Pattern Map

**Mapped:** 2026-08-18
**Files analyzed:** 9 (2 modified, 7 new/replaced)
**Analogs found:** 9 / 9

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/types/navigation.ts` | config | request-response | `src/types/navigation.ts` (self) | self — additive edit |
| `src/navigation/AccountNavigator.tsx` | route | request-response | `src/navigation/AccountNavigator.tsx` (self) | self — additive edit |
| `src/screens/app/AccountScreen.tsx` | component | request-response | `src/screens/app/AccountScreen.tsx` (self) | self — additive edit |
| `src/context/ProfileContext.tsx` | provider | event-driven | `src/context/AuthContext.tsx` | exact role; simpler (useState not useReducer) |
| `src/services/userService.ts` | service | CRUD | `src/services/bikeService.ts` | exact |
| `src/screens/app/ProfileScreen.tsx` | component | request-response | `src/screens/app/PaymentMethodsScreen.tsx` | role-match (read-only display + section headers) |
| `src/screens/app/EditProfileScreen.tsx` | component | request-response | `src/screens/app/AccountScreen.tsx` | role-match (form + Dialog + PrimaryButton) |
| `src/screens/app/SettingsScreen.tsx` | component | request-response | `src/screens/app/AccountScreen.tsx` | role-match (menu rows + navigation pushes) |
| `src/screens/app/PreferencesScreen.tsx` | component | request-response | `src/screens/app/AccountScreen.tsx` | role-match (menu rows + toggle state) |

---

## Pattern Assignments

### `src/types/navigation.ts` (config, additive edit)

**Analog:** `src/types/navigation.ts` (self — lines 23-27 to extend)

**Current AccountStackParamList** (lines 23-27):
```typescript
export type AccountStackParamList = {
  AccountMain: undefined;
  RideHistory: undefined;
  PaymentMethods: undefined;
};
```

**Add these 4 routes** (append before closing brace):
```typescript
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Preferences: undefined;
```

**No other changes to navigation.ts.** `AccountNavProp` (line 52) continues to work — it references `AccountStackParamList` which now includes the new routes.

---

### `src/navigation/AccountNavigator.tsx` (route, additive edit)

**Analog:** `src/navigation/AccountNavigator.tsx` (self — full file, 18 lines)

**Current file** (lines 1-18):
```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { AccountStackParamList } from '../types/navigation';
import AccountScreen from '../screens/app/AccountScreen';
import RideHistoryScreen from '../screens/app/RideHistoryScreen';
import PaymentMethodsScreen from '../screens/app/PaymentMethodsScreen';

const Stack = createStackNavigator<AccountStackParamList>();

export default function AccountNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AccountMain" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RideHistory" component={RideHistoryScreen} options={{ title: 'Ride History' }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment Methods' }} />
    </Stack.Navigator>
  );
}
```

**Modification pattern — wrap with ProfileProvider, append 4 screens:**
```typescript
import { ProfileProvider } from '../context/ProfileContext';
import ProfileScreen from '../screens/app/ProfileScreen';
import EditProfileScreen from '../screens/app/EditProfileScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import PreferencesScreen from '../screens/app/PreferencesScreen';

export default function AccountNavigator() {
  return (
    <ProfileProvider>
      <Stack.Navigator>
        {/* Existing — DO NOT CHANGE options */}
        <Stack.Screen name="AccountMain" component={AccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RideHistory" component={RideHistoryScreen} options={{ title: 'Ride History' }} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment Methods' }} />
        {/* Phase 5 additions — all use headerShown: false (custom header in screen body) */}
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </ProfileProvider>
  );
}
```

---

### `src/screens/app/AccountScreen.tsx` (component, additive edit)

**Analog:** `src/screens/app/AccountScreen.tsx` (self — full file, 183 lines)

**Imports to add** (after line 8, `useAuthContext`):
```typescript
import { useProfileContext } from '../../context/ProfileContext';
import { Image } from 'react-native';
```

**Profile header block** — insert between `</View>` (titleSection close, line 41) and the first `<TouchableOpacity>` (Ride History row, line 43). Tapping pushes `Profile`:
```typescript
{/* Profile header — D-01 */}
<TouchableOpacity
  style={styles.profileHeader}
  onPress={() => navigation.navigate('Profile')}
  activeOpacity={0.7}
>
  {profile.avatarUri ? (
    <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
  ) : (
    <View style={styles.avatarPlaceholder}>
      <Text style={styles.avatarInitials}>{getInitials(profile.name)}</Text>
    </View>
  )}
  <View style={styles.profileInfo}>
    <Text style={styles.profileName}>{profile.name}</Text>
    <Text style={styles.profileEmail}>{profile.email}</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>
```

**Settings menu row** — insert before the Log Out row (after PaymentMethods `TouchableOpacity`):
```typescript
{/* Settings row — D-09 */}
<TouchableOpacity
  style={styles.menuRow}
  onPress={() => navigation.navigate('Settings')}
  activeOpacity={0.7}
>
  <View style={styles.menuRowLeft}>
    <MaterialCommunityIcons name="cog" size={20} color={DSColors.textPrimary} />
    <Text style={styles.menuRowText}>Settings</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>
```

**Helper function** (add before component definition):
```typescript
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
```

**New styles** (append to `StyleSheet.create` block, lines 124-182):
```typescript
profileHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 24,
  paddingVertical: 16,
  backgroundColor: DSColors.surface,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: DSColors.border,
  gap: 12,
},
profileInfo: {
  flex: 1,
},
profileName: {
  fontSize: 16,
  fontWeight: '600',
  color: DSColors.textPrimary,
},
profileEmail: {
  fontSize: 13,
  color: DSColors.textSecondary,
  marginTop: 2,
},
avatar: {
  width: 48,
  height: 48,
  borderRadius: 24,
},
avatarPlaceholder: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: DSColors.primary,
  alignItems: 'center',
  justifyContent: 'center',
},
avatarInitials: {
  fontSize: 16,
  fontWeight: '600',
  color: DSColors.textOnPrimary,
},
```

---

### `src/context/ProfileContext.tsx` (provider, event-driven)

**Analog:** `src/context/AuthContext.tsx` (lines 1-119)

**Key differences from AuthContext:**
- Uses `useState` (not `useReducer`) — profile mutations are simple patches, no action dispatch needed
- Uses `useMemo` for context value (same as AuthContext lines 83-105)
- No SecureStore — state is in-memory only (resets on restart)
- No async initialization `useEffect` — initial state seeded directly from `mockUser`
- Guard check in hook uses `'profile' in ctx` (not `'state' in ctx`)

**Imports pattern** (from AuthContext lines 1-8, adapted):
```typescript
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import { mockUser } from '../services/userService';
```

**Type definitions** (adapted from AuthContext lines 18-52):
```typescript
export type UserProfile = {
  name: string;
  email: string;
  avatarUri: string | null;
  memberSince: string;
};

type ProfileContextValue = {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
};
```

**Context creation** (from AuthContext line 54):
```typescript
export const ProfileContext = createContext<ProfileContextValue>({} as ProfileContextValue);
```

**Provider with useMemo** (from AuthContext lines 57-109, simplified):
```typescript
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: mockUser.name,
    email: mockUser.email,
    avatarUri: mockUser.avatarUri,
    memberSince: mockUser.memberSince,
  });

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      updateProfile: (patch) => setProfile(prev => ({ ...prev, ...patch })),
    }),
    [profile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
```

**Convenience hook** (from AuthContext lines 113-119):
```typescript
export function useProfileContext(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx || !('profile' in ctx)) {
    throw new Error('useProfileContext must be used within ProfileProvider');
  }
  return ctx;
}
```

---

### `src/services/userService.ts` (service, CRUD)

**Analog:** `src/services/bikeService.ts` (lines 1-33)

**bikeService pattern** (lines 1-8 — imports + type):
```typescript
import { Bike } from '../types/bike';

export interface BikeService {
  getNearbyBikes(): Promise<Bike[]>;
}
```

**mockBikes data object** (lines 9-23 — static data export):
```typescript
const mockBikes: Bike[] = [
  { id: 'b01', name: 'City Cruiser 1', type: 'standard', ... },
  ...
];
```

**userService.ts follows same structure** — type export + static mock constant (no async delay needed since it is a single object, not a list fetch):
```typescript
export type MockUser = {
  name: string;
  email: string;
  avatarUri: string | null;
  memberSince: string;
};

export const mockUser: MockUser = {
  name: 'Jamie Torres',
  email: 'jamie@voltventure.app',
  avatarUri: null,
  memberSince: '2026-08-18',
};
```

**No service interface or async function needed** — `ProfileContext` reads the object directly on initialization. If a future phase needs async fetching, add a `UserService` interface following the `BikeService` interface pattern (bikeService.ts lines 3-5).

---

### `src/screens/app/ProfileScreen.tsx` (component, request-response)

**Analog:** `src/screens/app/PaymentMethodsScreen.tsx` (lines 1-141) for section-header layout; `src/screens/app/AccountScreen.tsx` for custom header pattern.

**Imports pattern** (from PaymentMethodsScreen lines 1-9, adapted):
```typescript
import React, { useLayoutEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import { useProfileContext } from '../../context/ProfileContext';
```

**Screen prop type** (from PaymentMethodsScreen line 10):
```typescript
type Props = StackScreenProps<AccountStackParamList, 'Profile'>;
```

**Custom header with back button + "Edit" action** (headerShown: false means implement in JSX):
```typescript
{/* Custom header */}
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Profile</Text>
  <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
    <Text style={styles.editButton}>Edit</Text>
  </TouchableOpacity>
</View>
```

**Section header style** (from PaymentMethodsScreen lines 83-91):
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

**Avatar render pattern** (initials or image — same helper as AccountScreen):
```typescript
// Large avatar (80x80) — same getInitials helper, larger size for ProfileScreen
{profile.avatarUri ? (
  <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
) : (
  <View style={styles.avatarPlaceholder}>
    <Text style={styles.avatarInitials}>{getInitials(profile.name)}</Text>
  </View>
)}
```

**SafeAreaView root** (from PaymentMethodsScreen line 16):
```typescript
<SafeAreaView style={styles.safeArea} edges={['bottom']}>
```

---

### `src/screens/app/EditProfileScreen.tsx` (component, request-response)

**Analog:** `src/screens/app/AccountScreen.tsx` (lines 1-182) for Dialog + Portal pattern; `src/components/common/PrimaryButton.tsx` for save CTA.

**Imports pattern** (from AccountScreen lines 1-9, extended):
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { StackScreenProps } from '@react-navigation/stack';
import { useProfileContext } from '../../context/ProfileContext';
import PrimaryButton from '../../components/common/PrimaryButton';
import { DSColors } from '../../theme/theme';
import type { AccountStackParamList } from '../../types/navigation';
```

**Screen prop type:**
```typescript
type Props = StackScreenProps<AccountStackParamList, 'EditProfile'>;
```

**Back intercept with beforeRemove** (RESEARCH.md Code Examples):
```typescript
useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    if (!hasUnsavedChanges) return;
    e.preventDefault();
    setShowDiscard(true);
  });
  return unsubscribe;
}, [navigation, hasUnsavedChanges]);
```

**expo-image-picker v57 handler** (RESEARCH.md Pattern 3):
```typescript
const handlePickPhoto = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',   // string form — NOT MediaTypeOptions.Images
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  if (!result.canceled && result.assets && result.assets.length > 0) {
    updateProfile({ avatarUri: result.assets[0].uri });
  }
};
```

**TextInput with error state** (from RESEARCH.md Pattern 6 + RN Paper v5 convention):
```typescript
<TextInput
  label="Display Name"
  mode="outlined"
  value={localName}
  onChangeText={setLocalName}
  error={nameError}
/>
{nameError && (
  <Text style={styles.errorText}>Name can't be empty</Text>
)}
```

**PrimaryButton save** (from PrimaryButton.tsx lines 1-37):
```typescript
<PrimaryButton
  label="Save Changes"
  onPress={handleSave}
  loading={isSaving}
/>
// Props: label (string), onPress, loading?, disabled? — minHeight: 52 applied internally
```

**Discard Changes dialog** (from AccountScreen lines 99-119, adapted pattern):
```typescript
<Portal>
  <Dialog visible={showDiscard} onDismiss={() => setShowDiscard(false)}>
    <Dialog.Title>Discard Changes?</Dialog.Title>
    <Dialog.Content>
      <Text style={styles.dialogBody}>
        Your edits haven't been saved. Go back without saving?
      </Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={() => setShowDiscard(false)}>Keep Editing</Button>
      <Button
        textColor={DSColors.destructive}
        onPress={() => { setShowDiscard(false); navigation.goBack(); }}
      >
        Discard
      </Button>
    </Dialog.Actions>
  </Dialog>
</Portal>
```

---

### `src/screens/app/SettingsScreen.tsx` (component, request-response)

**Analog:** `src/screens/app/AccountScreen.tsx` (lines 42-96) for menu row structure; `src/screens/app/PaymentMethodsScreen.tsx` (lines 83-91) for section header style.

**Imports pattern:**
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StackScreenProps } from '@react-navigation/stack';
import { DSColors } from '../../theme/theme';
import type { AccountStackParamList } from '../../types/navigation';
```

**Screen prop type:**
```typescript
type Props = StackScreenProps<AccountStackParamList, 'Settings'>;
```

**AsyncStorage read on mount** (RESEARCH.md Pattern 4):
```typescript
useEffect(() => {
  const load = async () => {
    try {
      const units = await AsyncStorage.getItem('settings.units');
      const mapStyle = await AsyncStorage.getItem('settings.mapStyle');
      const language = await AsyncStorage.getItem('settings.language');
      setUnits(units ?? 'km');
      setMapStyle(mapStyle ?? 'Standard');
      setLanguage(language ?? 'English');
    } catch {
      // silently use defaults
    }
  };
  load();
}, []);
```

**AsyncStorage write on change** (RESEARCH.md Pattern 4):
```typescript
const handleUnitsChange = async (value: string) => {
  setUnits(value);
  try {
    await AsyncStorage.setItem('settings.units', value);
  } catch {
    // ignore write failure — in-session state already updated
  }
};
```

**Menu row style** (from AccountScreen lines 142-160):
```typescript
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

**Section header style** (from PaymentMethodsScreen lines 83-91):
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

**Notifications row** — navigates to `Preferences` using same pattern as AccountScreen's `navigation.navigate('RideHistory')`:
```typescript
<TouchableOpacity
  style={styles.menuRow}
  onPress={() => navigation.navigate('Preferences')}
  activeOpacity={0.7}
>
  <View style={styles.menuRowLeft}>
    <MaterialCommunityIcons name="bell" size={20} color={DSColors.textPrimary} />
    <Text style={styles.menuRowText}>Notifications</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>
```

---

### `src/screens/app/PreferencesScreen.tsx` (component, request-response)

**Analog:** `src/screens/app/AccountScreen.tsx` (lines 1-182) for screen structure and SafeAreaView; `src/screens/app/PaymentMethodsScreen.tsx` (lines 83-91) for section header style.

**Imports pattern:**
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StackScreenProps } from '@react-navigation/stack';
import { DSColors } from '../../theme/theme';
import type { AccountStackParamList } from '../../types/navigation';
```

**Screen prop type:**
```typescript
type Props = StackScreenProps<AccountStackParamList, 'Preferences'>;
```

**AsyncStorage read on mount — individual getItem calls** (RESEARCH.md Open Question 2 resolution — simpler than multiGet):
```typescript
useEffect(() => {
  const load = async () => {
    try {
      const ride = await AsyncStorage.getItem('prefs.notifications.ride');
      const promo = await AsyncStorage.getItem('prefs.notifications.promo');
      const system = await AsyncStorage.getItem('prefs.notifications.system');
      setRideAlerts(ride !== 'false');    // null → default true
      setPromoAlerts(promo !== 'false');
      setSystemAlerts(system !== 'false');
    } catch {
      // silently use defaults (all true)
    }
  };
  load();
}, []);
```

**Toggle write pattern** (booleans stored as strings — RESEARCH.md Anti-Patterns):
```typescript
const handleRideAlertsToggle = async (value: boolean) => {
  setRideAlerts(value);
  try {
    await AsyncStorage.setItem('prefs.notifications.ride', String(value));
  } catch {
    // ignore
  }
};
```

**Switch row layout** — inline row with label on left, Switch on right:
```typescript
<View style={styles.toggleRow}>
  <Text style={styles.toggleLabel}>Ride Alerts</Text>
  <Switch
    value={rideAlerts}
    onValueChange={handleRideAlertsToggle}
    trackColor={{ true: DSColors.primary }}
    // Do NOT set thumbColor to DSColors.primary — Electric Green thumb on green track = invisible
  />
</View>
```

**Toggle row style** (adapted from AccountScreen `menuRow`, lines 142-160):
```typescript
toggleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingVertical: 16,
  backgroundColor: DSColors.surface,
  borderTopWidth: 1,
  borderColor: DSColors.border,
},
toggleLabel: {
  fontSize: 16,
  fontWeight: '400',
  color: DSColors.textPrimary,
},
```

**Notification categories** (Claude's Discretion from CONTEXT.md):
- `prefs.notifications.ride` — Ride Alerts (start/stop/battery warnings)
- `prefs.notifications.promo` — Promotions (deals, discounts)
- `prefs.notifications.system` — System (account, payment, app updates)

---

## Shared Patterns

### SafeAreaView Root Wrapper
**Source:** Every existing screen (`AccountScreen.tsx` line 35, `PaymentMethodsScreen.tsx` line 16, `RideHistoryScreen.tsx` line 54)
**Apply to:** All 4 new screens

```typescript
// AccountScreen.tsx line 35 — full SafeArea:
<SafeAreaView style={styles.safeArea}>

// PaymentMethodsScreen.tsx line 16 — bottom edges only (when stack header is shown):
<SafeAreaView style={styles.safeArea} edges={['bottom']}>

// safeArea style in all screens:
safeArea: {
  flex: 1,
  backgroundColor: DSColors.background,
},
```

Since all new Phase 5 screens use `headerShown: false`, they own their full header and should use `<SafeAreaView style={styles.safeArea}>` (no `edges` restriction) to capture the top safe area.

### DSColors Import
**Source:** `src/theme/theme.ts` (lines 11-38)
**Apply to:** All new screens and ProfileContext

```typescript
import { DSColors } from '../../theme/theme';
// or from context:
import { DSColors } from '../theme/theme';
```

Key tokens for Phase 5:
- `DSColors.background` — `#FFFFFF` screen/root background
- `DSColors.surface` — `#FAFAFA` card/row fill
- `DSColors.textPrimary` — `#0F0F0F` primary labels
- `DSColors.textSecondary` — `#808080` secondary/meta labels
- `DSColors.border` — `#EBEBEB` row separators
- `DSColors.accent` — `#7D9220` "Edit" buttons, section accents (accessible green on white)
- `DSColors.primary` — `#C6FF2D` avatar placeholder bg, Switch trackColor active
- `DSColors.textOnPrimary` — `#0F0F0F` text ON the green primary (initials in avatar)
- `DSColors.destructive` — `#B00020` Discard button in dialog

### Menu Row Pattern
**Source:** `src/screens/app/AccountScreen.tsx` (lines 42-96, styles lines 142-160)
**Apply to:** SettingsScreen (all setting rows), AccountScreen (new Settings row)

```typescript
// JSX pattern — AccountScreen.tsx lines 43-61:
<TouchableOpacity
  style={styles.menuRow}
  onPress={() => navigation.navigate('RideHistory')}
  activeOpacity={0.7}
>
  <View style={styles.menuRowLeft}>
    <MaterialCommunityIcons name="history" size={20} color={DSColors.textPrimary} />
    <Text style={styles.menuRowText}>Ride History</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>

// Style pattern — AccountScreen.tsx lines 142-160:
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

### Portal + Dialog Pattern
**Source:** `src/screens/app/AccountScreen.tsx` (lines 99-119)
**Apply to:** EditProfileScreen (Discard Changes dialog)

```typescript
// AccountScreen.tsx lines 99-119:
<Portal>
  <Dialog visible={showLogout} onDismiss={() => setShowLogout(false)}>
    <Dialog.Title>Log Out?</Dialog.Title>
    <Dialog.Content>
      <Text style={styles.dialogBody}>
        You'll need to sign in again to access your account.
      </Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={() => setShowLogout(false)}>Cancel</Button>
      <Button
        textColor={DSColors.destructive}
        loading={isLoggingOut}
        disabled={isLoggingOut}
        onPress={handleLogout}
      >
        Log Out
      </Button>
    </Dialog.Actions>
  </Dialog>
</Portal>

// dialogBody style (AccountScreen.tsx line 178-181):
dialogBody: {
  fontSize: 16,
  color: DSColors.textSecondary,
},
```

### StackScreenProps Typing
**Source:** `src/screens/app/AccountScreen.tsx` (lines 6, 11), `src/screens/app/PaymentMethodsScreen.tsx` (lines 6, 10)
**Apply to:** All 4 new screens

```typescript
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';

type Props = StackScreenProps<AccountStackParamList, 'ScreenName'>;

export default function ScreenName({ navigation }: Props) {
```

### Section Header Style
**Source:** `src/screens/app/PaymentMethodsScreen.tsx` (lines 83-91)
**Apply to:** SettingsScreen, PreferencesScreen, ProfileScreen

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

### getInitials Helper
**Source:** Defined once in AccountScreen.tsx (new, Phase 5) — shared conceptually
**Apply to:** AccountScreen, ProfileScreen, EditProfileScreen — each file defines its own local copy (no shared utility file needed for a 6-line function)

```typescript
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
```

---

## No Analog Found

All files have analogs in the existing codebase. No files require falling back to RESEARCH.md patterns exclusively.

| File | Note |
|---|---|
| `src/services/userService.ts` | AsyncStorage-using screen pattern has no analog (first AsyncStorage usage in project) — use RESEARCH.md Pattern 4 for the exact API shape |

---

## Critical Implementation Notes

### textOnPrimary on Avatar Placeholder
`DSColors.primary` is Electric Green `#C6FF2D` — a LIGHT color (1.36:1 contrast on white). When used as avatar placeholder background, the initials text MUST use `DSColors.textOnPrimary` (`#0F0F0F`, black). **Do NOT use `#FFFFFF` or `DSColors.background` as initials color.**

### Switch trackColor — Do Not Set thumbColor to Primary
`DSColors.primary` (Electric Green) on `thumbColor` renders invisible against the green `trackColor`. Leave `thumbColor` unset (RN Paper default) and only set `trackColor={{ true: DSColors.primary }}`.

### AsyncStorage Boolean Storage
`AsyncStorage` is string-only. Store booleans as `'true'`/`'false'` strings:
```typescript
await AsyncStorage.setItem('prefs.notifications.ride', String(value));  // 'true' or 'false'
const raw = await AsyncStorage.getItem('prefs.notifications.ride');
const isEnabled = raw !== 'false';  // null (never set) → true (default on)
```

### Image Picker — Guard result.assets Before Accessing
```typescript
// CORRECT:
if (!result.canceled && result.assets && result.assets.length > 0) {
  const uri = result.assets[0].uri;
}
// WRONG — crashes on permission denial:
if (!result.canceled) {
  const uri = result.assets[0].uri;  // result.assets may be null
}
```

### Wave 0 Package Installs Required Before Any Screen Implementation
```bash
npx expo install expo-image-picker
npx expo install @react-native-async-storage/async-storage
```
Both packages are absent from `package.json`. Any screen that imports them will fail to compile until installed.

---

## Metadata

**Analog search scope:** `VoltVenture/src/` — context/, services/, screens/app/, navigation/, types/, components/common/, theme/
**Files scanned:** 9 source files read in full
**Pattern extraction date:** 2026-08-18
