# Phase 5: Account & Profile - Context

**Gathered:** 2026-08-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 delivers: the user can view their profile (name, photo, email, member since), edit their display name and photo, manage app settings (units, map style, language), and configure notification preferences. All data is frontend-only with mocked/in-memory backend.

Screens: ProfileScreen, EditProfileScreen, SettingsScreen, PreferencesScreen.
AccountScreen is updated with a profile header (not a new screen).

</domain>

<decisions>
## Implementation Decisions

### Profile Header & Navigation

- **D-01:** AccountScreen gets an avatar+name+email header block at the top (before the menu rows). Tapping this header pushes `ProfileScreen` via the AccountNavigator stack.
- **D-02:** ProfileScreen is view-only — large avatar, name, email, "Member since" date. An "Edit" button in the header right navigates to `EditProfileScreen`.
- **D-03:** AccountNavigator (AccountStackParamList) must add: `Profile`, `EditProfile`, `Settings`, `Preferences` routes.

### Mock Profile Data

- **D-04:** Create `src/services/userService.ts` with a `mockUser` export — `{ name: 'Jamie Torres', email: 'jamie@voltventure.app', avatarUri: null | string, memberSince: '2026-08-18' }`. Same pattern as `bikeService.ts` / `rideService.ts`.
- **D-05:** Edits to name and avatar persist in-memory for the session (until app restart). AccountScreen avatar header updates live after returning from EditProfile. Implementation: React state lifted into AccountNavigator or a lightweight profile context — Claude's discretion on mechanism.

### Photo Picker

- **D-06:** Use `expo-image-picker` in EditProfileScreen. Tapping the avatar opens the device gallery. Selected image URI is stored in in-memory session profile state and displayed on ProfileScreen and AccountScreen header. No upload — local URI only.
- **D-07:** No permission flow beyond what expo-image-picker handles natively (it requests gallery permission automatically).

### Settings Persistence

- **D-08:** Settings and Preferences choices persist via `AsyncStorage`. Reads on screen mount, writes on toggle/selection change. Keys: `settings.units`, `settings.mapStyle`, `settings.language`, `prefs.notifications.*`.
- **D-09:** Navigation: AccountScreen → (menu row) → SettingsScreen (units, map style, language) → (menu row inside Settings) → PreferencesScreen (notification toggles). Two separate screens, nested push.

### Claude's Discretion
- Mechanism for sharing in-memory profile state between AccountScreen and ProfileScreen/EditProfileScreen (React context vs prop-drilling via navigator). Prefer a minimal `ProfileContext` or lift state into AccountNavigator — do not use Redux or Zustand.
- Exact set of notification toggle categories on PreferencesScreen (e.g., Ride alerts, Promotions, System) — use reasonable defaults that match the app domain.
- Placeholder avatar rendering: initials-based circle (e.g., "JT") using DSColors.primary background and DSColors.textOnPrimary text — until a real photo is selected.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Screens & Navigation
- `VoltVenture/src/screens/app/AccountScreen.tsx` — current Account tab hub; will be updated with avatar header
- `VoltVenture/src/navigation/AccountNavigator.tsx` — stack to extend with new routes
- `VoltVenture/src/types/navigation.ts` — `AccountStackParamList` must add `Profile`, `EditProfile`, `Settings`, `Preferences`

### Services & Data Patterns
- `VoltVenture/src/services/bikeService.ts` — pattern for `userService.ts` (mock data object export)
- `VoltVenture/src/context/AuthContext.tsx` — existing auth context; do NOT modify — profile data lives separately in `userService.ts`

### Design System & Styling
- `VoltVenture/src/theme/theme.ts` — DSColors, paperTheme; use `StyleSheet.create` + DSColors (not NativeWind) for account screens
- Design system reference: https://volt-venture-design-system.vercel.app/ — tokens and component patterns

### Project Decisions
- `.planning/PROJECT.md` — key decisions table (textOnPrimary = #0F0F0F, StyleSheet.create convention, mock approach)
- `.planning/ROADMAP.md` — Phase 5 success criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `StyleSheet.create` + `DSColors` pattern from `AccountScreen.tsx` — all Phase 5 screens should follow this (not NativeWind)
- `MaterialCommunityIcons` already imported in AccountScreen — reuse for menu row icons
- `Portal` + `Dialog` from React Native Paper — available for confirmations (e.g., discard changes on EditProfile back)
- `PrimaryButton` component (`src/components/common/PrimaryButton.tsx`) — use for Save button on EditProfileScreen

### Established Patterns
- Menu row pattern (icon + label + chevron-right, `borderTopWidth: 1, borderColor: DSColors.border`) — established in AccountScreen; reuse for Settings and Preferences rows
- `SafeAreaView` wrapping every screen root
- `StackScreenProps<ParamList, 'ScreenName'>` for screen prop types
- `useAuthContext()` hook for auth state — do not add user profile data to AuthContext

### Integration Points
- AccountNavigator pushes all 4 new screens onto the existing stack
- AccountScreen `AccountMain` route updated (not replaced) — preserves existing Ride History, Payment Methods, Log Out rows
- `expo-image-picker` is an Expo SDK package — check https://docs.expo.dev/versions/v57.0.0/ for correct v57 API

</code_context>

<specifics>
## Specific Ideas

- Avatar placeholder: initials circle ("JT" for Jamie Torres) — consistent with common mobile profile patterns
- Mock user name: "Jamie Torres", email: "jamie@voltventure.app", memberSince: "2026-08-18"
- AccountScreen header block taps to Profile (Uber/Airbnb-style pattern)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 5-Account & Profile*
*Context gathered: 2026-08-18*
