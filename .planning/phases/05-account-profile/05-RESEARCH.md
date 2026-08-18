# Phase 5: Account & Profile - Research

**Researched:** 2026-08-18
**Domain:** React Native profile UI, expo-image-picker, AsyncStorage, React context state sharing
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** AccountScreen gets an avatar+name+email header block at the top (before the menu rows). Tapping this header pushes `ProfileScreen` via the AccountNavigator stack.
- **D-02:** ProfileScreen is view-only — large avatar, name, email, "Member since" date. An "Edit" button in the header right navigates to `EditProfileScreen`.
- **D-03:** AccountNavigator (AccountStackParamList) must add: `Profile`, `EditProfile`, `Settings`, `Preferences` routes.
- **D-04:** Create `src/services/userService.ts` with a `mockUser` export — `{ name: 'Jamie Torres', email: 'jamie@voltventure.app', avatarUri: null | string, memberSince: '2026-08-18' }`. Same pattern as `bikeService.ts` / `rideService.ts`.
- **D-05:** Edits to name and avatar persist in-memory for the session (until app restart). AccountScreen avatar header updates live after returning from EditProfile. Implementation: React state lifted into AccountNavigator or a lightweight profile context — Claude's discretion on mechanism.
- **D-06:** Use `expo-image-picker` in EditProfileScreen. Tapping the avatar opens the device gallery. Selected image URI is stored in in-memory session profile state and displayed on ProfileScreen and AccountScreen header. No upload — local URI only.
- **D-07:** No permission flow beyond what expo-image-picker handles natively (it requests gallery permission automatically).
- **D-08:** Settings and Preferences choices persist via `AsyncStorage`. Reads on screen mount, writes on toggle/selection change. Keys: `settings.units`, `settings.mapStyle`, `settings.language`, `prefs.notifications.*`.
- **D-09:** Navigation: AccountScreen → (menu row) → SettingsScreen → (menu row inside Settings) → PreferencesScreen (notification toggles). Two separate screens, nested push.

### Claude's Discretion

- Mechanism for sharing in-memory profile state between AccountScreen, ProfileScreen, and EditProfileScreen (React context vs prop-drilling via navigator). Prefer a minimal `ProfileContext` or lift state into AccountNavigator — do not use Redux or Zustand.
- Exact set of notification toggle categories on PreferencesScreen (e.g., Ride alerts, Promotions, System) — use reasonable defaults.
- Placeholder avatar rendering: initials-based circle (e.g., "JT") using `DSColors.primary` background and `DSColors.textOnPrimary` text — until a real photo is selected.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PROF-01 | User can view their profile (name, photo, email, member since) | ProfileScreen pattern documented; mockUser shape defined |
| PROF-02 | User can edit display name and photo | EditProfileScreen pattern; expo-image-picker v57 API verified; TextInput error state documented |
| PROF-03 | User can manage app settings (units, map style, language) | SettingsScreen pattern; AsyncStorage read/write pattern documented |
| PROF-04 | User can configure notification preferences | PreferencesScreen toggle pattern; AsyncStorage keys defined; Switch component usage documented |
</phase_requirements>

---

## Summary

Phase 5 adds profile viewing, editing, and settings screens to the existing AccountNavigator stack. All four new screens (`ProfileScreen`, `EditProfileScreen`, `SettingsScreen`, `PreferencesScreen`) follow the established `StyleSheet.create` + `DSColors` convention from `AccountScreen.tsx` — NativeWind is not used. The existing AccountNavigator is extended additively (no breaking changes to `AccountMain`, `RideHistory`, `PaymentMethods` routes).

Two packages must be installed before implementation: `expo-image-picker` (not yet in package.json; Expo SDK package with well-known provenance) and `@react-native-async-storage/async-storage` (not yet in package.json; official React Native community package with ~5-year history). Both are installed via `npx expo install` to get SDK-compatible versions. The Expo v57 image picker API uses `result.assets[0].uri` (not the legacy `result.uri`) and accepts `mediaTypes: 'images'` string (the modern `MediaType` string form) rather than the deprecated `MediaTypeOptions.Images` enum.

For in-memory profile state, a minimal `ProfileContext` is the recommended mechanism. It avoids prop-drilling through the AccountNavigator stack while keeping state co-located and not touching `AuthContext`. Context provides `profile` state and an `updateProfile` function; `AccountNavigator` wraps its `Stack.Navigator` in the `ProfileProvider`.

**Primary recommendation:** Install both missing packages first (Wave 0 task), then implement in dependency order: types → userService → ProfileContext → AccountScreen update → ProfileScreen → EditProfileScreen → SettingsScreen → PreferencesScreen.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Profile view (name, email, photo, member since) | Screen (ProfileScreen) | ProfileContext | Read-only display; context holds live state |
| Profile editing (name, photo) | Screen (EditProfileScreen) | ProfileContext + expo-image-picker | Mutations go through context updater |
| Avatar initials placeholder | Screen component | DSColors tokens | Pure rendering logic; no external dependency |
| In-memory profile session state | ProfileContext | AccountNavigator (provider wrapper) | Shared across 3 screens without Redux |
| Settings persistence (units, map, language) | Screen (SettingsScreen) | AsyncStorage | Reads on mount, writes on selection |
| Notification preferences persistence | Screen (PreferencesScreen) | AsyncStorage | Toggle writes immediately on change |
| Photo gallery access | expo-image-picker | OS permission dialog | SDK handles permission request automatically |
| Navigation routing | AccountNavigator + AccountStackParamList | React Navigation stack | Additive-only extension of existing stack |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `expo-image-picker` | `~57.0.11` (SDK-matched) | Gallery photo picker for avatar | Official Expo SDK package; handles permissions automatically |
| `@react-native-async-storage/async-storage` | `3.1.1` | Key-value persistence for settings/prefs | Official React Native community package; required by D-08 |
| `react-native-paper` (TextInput, Switch, Portal, Dialog) | `^5.15.3` (already installed) | Form inputs and overlays | Already in use project-wide |
| `StyleSheet.create` + `DSColors` | built-in / `src/theme/theme.ts` | Styling | Established convention for account screens |

[VERIFIED: npm registry] — `expo-image-picker@57.0.11` confirmed on npm (created 2019, part of Expo monorepo at github.com/expo/expo).
[VERIFIED: npm registry] — `@react-native-async-storage/async-storage@3.1.1` confirmed on npm (created 2020, github.com/react-native-async-storage/async-storage).

### Supporting (already installed — no new installs needed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@expo/vector-icons` (MaterialCommunityIcons) | `^15.0.2` | Menu icons, camera badge, toggle icons | Already imported in AccountScreen; reuse |
| `react-native-safe-area-context` (SafeAreaView) | `^5.9.0` | Root wrapper for all new screens | Existing pattern on every screen |
| `react-native-paper` (Button) | `^5.15.3` | "Edit" header button; dialog actions | Existing pattern in AccountScreen |
| `src/components/common/PrimaryButton` | project-internal | "Save Changes" CTA on EditProfileScreen | Existing component; minHeight 52 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ProfileContext | Prop-drilling via navigator | Context is cleaner for 3+ screens sharing state; decided by Claude's Discretion |
| ProfileContext | Zustand / Redux | Explicit out-of-scope: D-05 says no Zustand/Redux |
| `mediaTypes: 'images'` (string) | `MediaTypeOptions.Images` | MediaTypeOptions is legacy/deprecated in SDK 57; string form is current |

**Installation (Wave 0 — must run before any screen implementation):**
```bash
npx expo install expo-image-picker
npx expo install @react-native-async-storage/async-storage
```

---

## Package Legitimacy Audit

> slopcheck was not available in this environment (pip not found on Windows). All packages marked `[ASSUMED]` for provenance; however, both are high-confidence based on official Expo documentation and npm registry metadata.

| Package | Registry | Age | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-------------|-----------|-------------|
| `expo-image-picker` | npm | ~7 yrs (2019) | github.com/expo/expo | [ASSUMED] | Approved — official Expo SDK monorepo, documented at docs.expo.dev/versions/v57.0.0/sdk/imagepicker/ |
| `@react-native-async-storage/async-storage` | npm | ~6 yrs (2020) | github.com/react-native-async-storage/async-storage | [ASSUMED] | Approved — official React Native community org, referenced in Expo v57 docs |

**Packages removed due to slopcheck [SLOP] verdict:** none

**Packages flagged as suspicious [SUS]:** none

**Neither package has a `postinstall` script** (confirmed via `npm view` — no output returned for either).

*slopcheck was unavailable at research time. Both packages are tagged `[ASSUMED]` for slopcheck provenance but are verified against official Expo v57 documentation and confirmed on npm with multi-year history under authoritative organizations.*

---

## Architecture Patterns

### System Architecture Diagram

```
AccountNavigator (Stack)
│
├── ProfileProvider (wraps Stack.Navigator)
│   │  state: { name, avatarUri, email, memberSince }
│   │  updateProfile(patch) → sets in-memory state
│   │
│   ├── AccountMain (AccountScreen) ──reads ProfileContext──► header block (avatar, name, email)
│   │   ├── tap header ──navigate('Profile')──────────────────────────────────────┐
│   │   ├── Ride History row ──navigate('RideHistory')                            │
│   │   ├── Payment Methods row ──navigate('PaymentMethods')                      │
│   │   ├── Settings row ──navigate('Settings') ──────────────────────────────┐  │
│   │   └── Log Out row (existing)                                            │  │
│   │                                                                         │  │
│   ├── Profile (ProfileScreen) ◄───────────────────────────────────────────┘  │
│   │   reads ProfileContext                                                      │
│   │   ├── tap "Edit" (header-right) ──navigate('EditProfile')──────────────────┘
│   │   └── display: avatar, name, email, memberSince
│   │
│   ├── EditProfile (EditProfileScreen)
│   │   reads + writes ProfileContext via updateProfile()
│   │   ├── tap avatar ──expo-image-picker──► assets[0].uri ──updateProfile({avatarUri})
│   │   ├── TextInput (Display Name) ── validation on save
│   │   ├── "Save Changes" (PrimaryButton) ──updateProfile({name}) ──navigation.goBack()
│   │   └── back nav w/ unsaved edits ──Portal > Dialog ("Discard Changes?")
│   │
│   ├── Settings (SettingsScreen)
│   │   AsyncStorage keys: settings.units | settings.mapStyle | settings.language
│   │   ├── mount: AsyncStorage.getItem for each key → setState
│   │   ├── inline segmented picker per row
│   │   └── on select: AsyncStorage.setItem → setState
│   │   └── "Notifications" row ──navigate('Preferences')
│   │
│   └── Preferences (PreferencesScreen)
│       AsyncStorage keys: prefs.notifications.ride | prefs.notifications.promo | prefs.notifications.system
│       ├── mount: AsyncStorage.multiGet([...keys]) → setState
│       └── Switch toggle: AsyncStorage.setItem → setState
│
├── RideHistory (existing, unchanged)
└── PaymentMethods (existing, unchanged)
```

### Recommended Project Structure

```
src/
├── context/
│   ├── AuthContext.tsx          (existing — DO NOT MODIFY)
│   └── ProfileContext.tsx       (NEW — in-memory profile state)
├── services/
│   ├── bikeService.ts           (existing)
│   └── userService.ts           (NEW — mockUser data export)
├── screens/app/
│   ├── AccountScreen.tsx        (UPDATE — add profile header block)
│   ├── ProfileScreen.tsx        (NEW)
│   ├── EditProfileScreen.tsx    (NEW)
│   ├── SettingsScreen.tsx       (NEW)
│   └── PreferencesScreen.tsx   (NEW)
├── navigation/
│   └── AccountNavigator.tsx    (UPDATE — add 4 routes + ProfileProvider wrap)
└── types/
    └── navigation.ts           (UPDATE — add Profile, EditProfile, Settings, Preferences to AccountStackParamList)
```

### Pattern 1: ProfileContext (Minimal React Context for In-Memory State)

**What:** Lightweight context holding mutable profile state for the session. No persistence — resets on app restart.
**When to use:** Sharing state across 3+ screens in the same navigator without prop-drilling or Redux.

```typescript
// Source: AuthContext.tsx pattern adapted for simpler (non-reducer) profile use case
import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

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

const ProfileContext = createContext<ProfileContextValue>({} as ProfileContextValue);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Jamie Torres',
    email: 'jamie@voltventure.app',
    avatarUri: null,
    memberSince: '2026-08-18',
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

export function useProfileContext(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx || !('profile' in ctx)) {
    throw new Error('useProfileContext must be used within ProfileProvider');
  }
  return ctx;
}
```

[ASSUMED] — Pattern derived from existing AuthContext.tsx structure; standard React context idiom.

### Pattern 2: AccountNavigator Extension (Additive Stack Routes)

**What:** Wrap the existing `Stack.Navigator` in `ProfileProvider` and append 4 new `Stack.Screen` entries. Existing routes are untouched.
**When to use:** Adding routes to an existing stack without breaking existing navigation.

```typescript
// Source: AccountNavigator.tsx (existing) extended
import { ProfileProvider } from '../context/ProfileContext';
import ProfileScreen from '../screens/app/ProfileScreen';
import EditProfileScreen from '../screens/app/EditProfileScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import PreferencesScreen from '../screens/app/PreferencesScreen';

export default function AccountNavigator() {
  return (
    <ProfileProvider>
      <Stack.Navigator>
        {/* Existing routes — unchanged */}
        <Stack.Screen name="AccountMain" component={AccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RideHistory" component={RideHistoryScreen} options={{ title: 'Ride History' }} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment Methods' }} />
        {/* New Phase 5 routes */}
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </ProfileProvider>
  );
}
```

[ASSUMED] — Standard React Navigation stack extension pattern.

### Pattern 3: expo-image-picker v57 Gallery Launch

**What:** Launch device photo gallery; extract URI from `result.assets[0].uri`. Permissions are requested automatically by the picker.
**When to use:** EditProfileScreen avatar tap handler.

```typescript
// Source: [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/imagepicker/]
import * as ImagePicker from 'expo-image-picker';

const handlePickPhoto = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',          // modern string form — NOT MediaTypeOptions.Images
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets.length > 0) {
    const uri = result.assets[0].uri;   // NOT result.uri — that is the legacy shape
    updateProfile({ avatarUri: uri });
  }
};
```

### Pattern 4: AsyncStorage Read on Mount, Write on Change

**What:** Load persisted settings when screen mounts; write immediately when user makes a selection.
**When to use:** SettingsScreen and PreferencesScreen.

```typescript
// Source: [CITED: react-native-async-storage.github.io] + [ASSUMED: hook pattern]
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

// Read on mount
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

// Write on change
const handleUnitsChange = async (value: string) => {
  setUnits(value);
  try {
    await AsyncStorage.setItem('settings.units', value);
  } catch {
    // ignore write failure — in-session state already updated
  }
};
```

For PreferencesScreen toggles (multiple keys at once on mount), use `multiGet`:
```typescript
// [ASSUMED] — multiGet pattern from official docs
const keys = ['prefs.notifications.ride', 'prefs.notifications.promo', 'prefs.notifications.system'];
const pairs = await AsyncStorage.multiGet(keys);
// pairs: [['key', 'value' | null], ...]
const rideAlerts = pairs[0][1] !== 'false';   // default true when null
```

### Pattern 5: Avatar Initials Circle

**What:** Render a `View` styled as a circle with initials extracted from `profile.name`. Falls back gracefully before a photo is selected.
**When to use:** AccountScreen header, ProfileScreen, EditProfileScreen — whenever `avatarUri` is null.

```typescript
// [ASSUMED] — Standard React Native approach; no external library
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Render:
{profile.avatarUri ? (
  <Image
    source={{ uri: profile.avatarUri }}
    style={styles.avatar}
    accessibilityLabel={`${getInitials(profile.name)} avatar`}
  />
) : (
  <View style={styles.avatarPlaceholder} accessibilityLabel={`${getInitials(profile.name)} avatar`}>
    <Text style={styles.avatarInitials}>{getInitials(profile.name)}</Text>
  </View>
)}

// Styles:
avatarPlaceholder: {
  width: 80, height: 80, borderRadius: 40,
  backgroundColor: DSColors.surface,
  alignItems: 'center', justifyContent: 'center',
},
avatarInitials: {
  fontSize: 24, fontWeight: '600', color: DSColors.textPrimary,
},
avatar: {
  width: 80, height: 80, borderRadius: 40,
},
```

### Pattern 6: React Native Paper TextInput Outlined with Error State (MD3)

**What:** TextInput in `outlined` mode with inline error display. Error prop shows red helper text automatically via RN Paper MD3.
**When to use:** Display Name field on EditProfileScreen.

```typescript
// [ASSUMED] — React Native Paper v5 TextInput API; verified against existing paperTheme
import { TextInput } from 'react-native-paper';

<TextInput
  label="Display Name"
  mode="outlined"
  value={name}
  onChangeText={setName}
  error={nameError}
/>
{nameError && (
  <Text style={{ color: DSColors.error, fontSize: 12, marginTop: 4, paddingHorizontal: 16 }}>
    Name can't be empty
  </Text>
)}
```

Note: RN Paper v5 `TextInput` has an `error` boolean prop that changes the outline color to the theme error color. The `errorText` is NOT a built-in prop — display error text as a separate `Text` element below the input.

### Pattern 7: userService.ts (Mock Data Export)

**What:** Stateless mock data object following the bikeService.ts pattern. Profile live state lives in ProfileContext, not here — this is the initial seed data.
**When to use:** ProfileContext initializer reads from this.

```typescript
// Source: bikeService.ts pattern
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

### Anti-Patterns to Avoid

- **Using `result.uri` from image picker:** The legacy result shape (`result.uri` directly) was removed in Expo SDK 46+. Always use `result.assets[0].uri`. [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/imagepicker/]
- **Using `MediaTypeOptions.Images`:** `MediaTypeOptions` is the legacy enum. Use the string `'images'` for `mediaTypes`. [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/imagepicker/]
- **Adding profile data to AuthContext:** CONTEXT.md explicitly says do not add user profile data to AuthContext (canonical_refs). Keep profile in separate ProfileContext.
- **Using NativeWind on account screens:** CONTEXT.md and CLAUDE.md both specify `StyleSheet.create` + DSColors for account screens — NativeWind is for map/discovery screens.
- **JSON.stringify omission in AsyncStorage:** AsyncStorage stores strings only. Boolean switch values must be stored as `'true'`/`'false'` strings and compared accordingly on read.
- **Switch `thumbColor` on DSColors.primary:** Electric Green (#C6FF2D) on the Switch `thumbColor` could make the thumb invisible (light on light). Use Switch `trackColor` for the on-state; the thumb color is handled by RN Paper defaults. [ASSUMED]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Photo gallery access | Custom file browser | `expo-image-picker` | Handles OS permissions, gallery UI, format normalization |
| Persistent key-value storage | Custom file I/O or MMKV | `AsyncStorage` | D-08 explicitly mandates AsyncStorage; MMKV not installed |
| Dialog (Discard Changes) | Custom modal View | `Portal > Dialog` (RN Paper) | Already used in AccountScreen for logout; consistent pattern |
| Loading spinner on Save button | Custom spinner component | `PrimaryButton` `loading` prop (RN Paper Button) | PrimaryButton passes `loading` to RN Paper Button which shows spinner |
| Navigation header buttons | Custom View in screen body | `navigation.setOptions({ headerRight: ... })` | React Navigation built-in; keeps header button in correct position |

**Key insight:** Every "custom" solution in this phase has a direct library equivalent already installed or being installed. The phase is pattern reuse, not new engineering.

---

## Common Pitfalls

### Pitfall 1: Image Picker Returns `canceled: true` on Android Permission Denied

**What goes wrong:** On Android, if the user denies the media library permission inside the picker flow, `result.canceled` is `true` AND `result.assets` is `null`. Accessing `result.assets[0]` throws.
**Why it happens:** Android prompts for permission the first time the picker opens. If denied, the picker closes immediately.
**How to avoid:** Always guard: `if (!result.canceled && result.assets && result.assets.length > 0)`.
**Warning signs:** Crash on avatar tap after permission denial.

[ASSUMED] — Based on standard expo-image-picker behavior; verify against Expo v57 docs if issues arise.

### Pitfall 2: AsyncStorage Default Values When Key Never Written

**What goes wrong:** `AsyncStorage.getItem('settings.units')` returns `null` (not `'km'`) on first launch. If UI renders `null` directly, the setting picker shows blank.
**Why it happens:** AsyncStorage returns `null` for keys that have never been set.
**How to avoid:** Always apply `?? 'km'` (nullish coalescing) fallback when reading. Default values: `units: 'km'`, `mapStyle: 'Standard'`, `language: 'English'`, all notification prefs: `true`.
**Warning signs:** Empty setting rows on first open.

[CITED: react-native-async-storage.github.io — getItem returns null for missing keys]

### Pitfall 3: ProfileContext Stale State After goBack

**What goes wrong:** AccountScreen does not re-render after returning from EditProfileScreen, so the avatar/name in the header still shows the old value.
**Why it happens:** If profile state is managed via `useState` in a parent component and passed down rather than via context, the parent may not re-render.
**How to avoid:** Use `ProfileContext` (context value change triggers all consumers to re-render automatically). Do not pass profile as a route param.
**Warning signs:** Header still shows old name/initials after saving in EditProfile.

[ASSUMED] — Standard React re-render behavior; context subscription is the correct solution.

### Pitfall 4: `headerShown: false` Required for Custom Headers

**What goes wrong:** React Navigation renders a default header bar on top of the custom "Profile / Edit" heading text, creating a double-header.
**Why it happens:** `Stack.Screen` renders its own header unless `headerShown: false` is set in `options`.
**How to avoid:** Set `options={{ headerShown: false }}` on all 4 new screens that implement their own custom header layouts. Use `navigation.setOptions` for the "Edit" button on ProfileScreen.
**Warning signs:** Two title bars visible on ProfileScreen.

[ASSUMED] — Established pattern in AccountScreen (`AccountMain` uses `headerShown: false`).

### Pitfall 5: TextInput `error` Prop Does Not Show Error Text Automatically

**What goes wrong:** Developer sets `error={true}` on RN Paper TextInput expecting helper text to appear, but no error text shows.
**Why it happens:** RN Paper v5 `TextInput` changes the outline/label color to error red when `error={true}`, but it does NOT render error text. There is no `errorText` prop on `TextInput` in RN Paper v5.
**How to avoid:** Render error message as a separate `<Text>` element beneath the TextInput, conditionally shown.
**Warning signs:** Red outline shows but no error message visible.

[ASSUMED] — RN Paper v5 TextInput API; aligned with UI-SPEC.md which calls for "inline red text beneath field".

### Pitfall 6: Navigation.setOptions Must Be Called Inside useEffect or useLayoutEffect

**What goes wrong:** Calling `navigation.setOptions({ headerRight: ... })` at component render level (not in an effect) causes React warning about state updates during render.
**Why it happens:** `navigation.setOptions` is a side effect.
**How to avoid:** Wrap in `useLayoutEffect(() => { navigation.setOptions({...}) }, [navigation])`.
**Warning signs:** React warning: "Cannot update a component while rendering a different component."

[ASSUMED] — Standard React Navigation pattern.

---

## Code Examples

### Navigation Types Extension

```typescript
// src/types/navigation.ts — ADD to AccountStackParamList
export type AccountStackParamList = {
  AccountMain: undefined;
  RideHistory: undefined;
  PaymentMethods: undefined;
  // Phase 5 additions:
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Preferences: undefined;
};
```

### ProfileScreen Header with "Edit" Navigation Button

```typescript
// [ASSUMED] — React Navigation setOptions pattern
import { useLayoutEffect } from 'react';
import { Button } from 'react-native-paper';
import { DSColors } from '../../theme/theme';

export default function ProfileScreen({ navigation }: Props) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          textColor={DSColors.accent}
          onPress={() => navigation.navigate('EditProfile')}
        >
          Edit
        </Button>
      ),
    });
  }, [navigation]);

  // ... rest of screen
}
```

Note: If `headerShown: false` is used (custom header in screen body), place the "Edit" button as a `TouchableOpacity` in the header `View` instead, with `color: DSColors.accent`.

### Discard Changes Dialog (matching AccountScreen logout dialog pattern)

```typescript
// [CITED: AccountScreen.tsx existing Portal > Dialog pattern]
import { Portal, Dialog, Button } from 'react-native-paper';

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

### Intercept Back Navigation for Discard Dialog

```typescript
// [ASSUMED] — React Navigation beforeRemove event
import { useEffect } from 'react';

useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    if (!hasUnsavedChanges) return;
    e.preventDefault();
    setShowDiscard(true);
  });
  return unsubscribe;
}, [navigation, hasUnsavedChanges]);
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `result.uri` (ImagePicker) | `result.assets[0].uri` | Expo SDK ~46 | Direct `result.uri` access crashes — always use `assets` array |
| `MediaTypeOptions.Images` | `mediaTypes: 'images'` (string) | Expo SDK ~53+ | Old enum still works but is deprecated; string form is preferred |
| `AsyncStorage` from `react-native` | `@react-native-async-storage/async-storage` | React Native 0.59 | Core AsyncStorage was extracted to community package |

**Deprecated/outdated:**
- `MediaTypeOptions` enum: Still functional in SDK 57 but officially legacy — use string `'images'` instead. [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/imagepicker/]
- `result.uri` on image picker result: Removed. `result.assets[0].uri` is the only valid accessor. [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/imagepicker/]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | ProfileContext using `useState` + `useMemo` (not `useReducer`) is the right mechanism for profile state | Architecture Patterns, Pattern 1 | Low — either works; useReducer could be used instead with no functional difference |
| A2 | `navigation.setOptions` called in `useLayoutEffect` is the correct way to add "Edit" header button | Code Examples | Low — if headerShown: false is used, button goes in custom header View instead; both work |
| A3 | RN Paper v5 TextInput does NOT auto-render error text — it only changes outline color | Pitfall 5 | Medium — if RN Paper v5 does have errorText prop, a separate Text element would be redundant (harmless) |
| A4 | `navigation.addListener('beforeRemove')` is available in @react-navigation/stack v7 | Code Examples | Low — this is a stable React Navigation API since v5 |
| A5 | `AsyncStorage.multiGet` returns `Array<[key, value | null]>` pairs | Pattern 4 | Low — this is the documented API but was not confirmed against official docs in this session |
| A6 | All notification preference defaults should be `true` (opted in) | Architecture | Low — user preference; can adjust in implementation |
| A7 | Electric Green (#C6FF2D) on Switch thumbColor is problematic (light on light) | Anti-Patterns | Low — UI-SPEC says Switch active color is DSColors.primary for trackColor, thumb is RN Paper default |

---

## Open Questions

1. **`headerShown: false` vs React Navigation header for "Edit" button**
   - What we know: AccountMain uses `headerShown: false`; new screens have custom layouts in UI-SPEC
   - What's unclear: Whether to use RN stack header (with `navigation.setOptions`) or a fully custom header View in screen body
   - Recommendation: Use `headerShown: false` + custom header View for consistency with the rest of AccountNavigator. This avoids the complexity of `setOptions` and matches how other screens in this navigator work.

2. **AsyncStorage multiGet vs individual getItem calls for PreferencesScreen**
   - What we know: AsyncStorage supports both patterns; multiGet is more efficient for 3+ keys
   - What's unclear: No official docs were reachable to confirm multiGet return shape
   - Recommendation: Use individual `getItem` calls (same pattern as SettingsScreen) — simpler, type-safe, and the performance difference is negligible for 3 keys.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Android emulator | Testing Expo SDK 57 app | Assumed ✓ | Android Studio (user confirmed in v1.0) | EAS dev build |
| `expo-image-picker` | D-06 photo picker | ✗ — NOT in package.json | — | No fallback — must install |
| `@react-native-async-storage/async-storage` | D-08 settings persistence | ✗ — NOT in package.json | — | No fallback — must install |
| `expo` SDK | All new packages | ✓ | `~57.0.12` | — |
| `react-native-paper` | TextInput, Switch, Dialog | ✓ | `^5.15.3` | — |
| `@expo/vector-icons` | MaterialCommunityIcons | ✓ | `^15.0.2` | — |
| `@react-navigation/stack` | New screen routes | ✓ | `^7.10.22` | — |

**Missing dependencies with no fallback:**
- `expo-image-picker` — required by D-06; install in Wave 0 with `npx expo install expo-image-picker`
- `@react-native-async-storage/async-storage` — required by D-08; install in Wave 0 with `npx expo install @react-native-async-storage/async-storage`

**Missing dependencies with fallback:**
- None

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 5 |
|-----------|-------------------|
| All UI must use Volt Venture Design System tokens | All new screens use DSColors + DSTypography — confirmed |
| Use React Native Paper as base | TextInput, Switch, Dialog, Button all from RN Paper — confirmed |
| StyleSheet.create + DSColors for account screens (not NativeWind) | All Phase 5 screens follow this — confirmed |
| Frontend only — backend calls mocked/stubbed | userService.ts uses mockUser; no real API calls — confirmed |
| Do not add features beyond phase scope | Phase delivers PROF-01 to PROF-04 only — confirmed |
| Expo SDK 57 — use Android emulator, not Expo Go | Testing note: `npx expo run:android` |
| textOnPrimary = #0F0F0F (black) on Electric Green | Avatar placeholder uses DSColors.surface bg (not primary) per UI-SPEC |
| accent = #7D9220 for accessible text on white | "Edit" button, section labels use DSColors.accent — confirmed in UI-SPEC |
| DSColors must be inlined in tailwind.config.js | Not applicable — account screens use StyleSheet.create |

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/imagepicker/] — expo-image-picker v57 API, MediaType string form, result.assets shape, launchImageLibraryAsync options
- [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/async-storage/] — @react-native-async-storage/async-storage installation for SDK 57
- [VERIFIED: npm registry] — `expo-image-picker@57.0.11` (created 2019, expo/expo monorepo)
- [VERIFIED: npm registry] — `@react-native-async-storage/async-storage@3.1.1` (created 2020, react-native-async-storage org)
- `VoltVenture/src/context/AuthContext.tsx` — ProfileContext pattern derived from existing implementation
- `VoltVenture/src/screens/app/AccountScreen.tsx` — menu row style pattern, Dialog pattern, DSColors usage
- `VoltVenture/src/navigation/AccountNavigator.tsx` — existing stack structure to extend
- `VoltVenture/src/types/navigation.ts` — AccountStackParamList to extend
- `VoltVenture/src/theme/theme.ts` — DSColors, DSTypography, paperTheme confirmed values
- `VoltVenture/src/components/common/PrimaryButton.tsx` — PrimaryButton API confirmed
- `VoltVenture/package.json` — confirmed expo-image-picker and async-storage NOT installed

### Secondary (MEDIUM confidence)
- [CITED: react-native-async-storage.github.io] — AsyncStorage getItem returns null for missing keys; setItem/getItem string-only API

### Tertiary (LOW confidence)
- [ASSUMED] — ProfileContext useState vs useReducer choice
- [ASSUMED] — beforeRemove navigation event for back intercept
- [ASSUMED] — RN Paper TextInput error prop behavior (outline color only, no auto errorText)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — expo-image-picker verified against official Expo v57 docs; async-storage confirmed on npm with official org
- Architecture: HIGH — patterns derived directly from existing codebase; context pattern mirrors AuthContext
- Pitfalls: MEDIUM — image picker pitfalls verified against official docs; others are standard React Native patterns tagged [ASSUMED]

**Research date:** 2026-08-18
**Valid until:** 2026-09-18 (Expo SDK 57 is pinned; APIs stable)
