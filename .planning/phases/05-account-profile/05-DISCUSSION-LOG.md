# Phase 5: Account & Profile - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-18
**Phase:** 5-Account & Profile
**Areas discussed:** Profile header layout, Mock profile data, Photo picker depth, Settings persistence

---

## Profile Header Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Avatar header (Recommended) | Top of AccountScreen shows avatar circle + name + email; tapping pushes ProfileScreen. Common mobile pattern (Uber, Airbnb). | ✓ |
| My Profile row | Add a 'My Profile' menu row at the top of the existing list, consistent with Ride History / Payment Methods. Simpler. | |

**User's choice:** Avatar header — tapping the header block pushes ProfileScreen.

**Notes:** ProfileScreen is view-only (large avatar, name, email, member since). "Edit" button in header right navigates to EditProfileScreen.

---

## Mock Profile Data

| Option | Description | Selected |
|--------|-------------|----------|
| userService.ts (Recommended) | Mock service returning static profile object. Same pattern as bikeService.ts / rideService.ts. | ✓ |
| SecureStore at sign-up | Store name/email in SecureStore during sign-up, read back on Profile. More realistic but requires touching Phase 1 auth screens. | |
| Hardcoded on screen | Inline constants in ProfileScreen.tsx. Not reusable across AccountScreen header. | |

**User's choice:** userService.ts with mockUser export.

**Follow-up:** Edits persist in-memory for the session (until restart). AccountScreen header updates live after returning from EditProfile.

| Persistence option | Description | Selected |
|---|---|---|
| In-memory session state | Updated name/avatar persists until app restart | ✓ |
| Discard on navigate back | EditProfile saves nothing — shows original mock data | |

---

## Photo Picker Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Real expo-image-picker (Recommended) | Opens device gallery; selected photo displays in-memory. Realistic UX for testers. | ✓ |
| Mock Snackbar only | Tapping avatar shows 'Photo updated' Snackbar, no actual image. Consistent with Add Card stub (D-16). | |

**User's choice:** Real expo-image-picker. Selected URI stored in in-memory session profile. No upload.

---

## Settings Persistence

| Option | Description | Selected |
|--------|-------------|----------|
| AsyncStorage (Recommended) | Units, map style, language, notification toggles saved to AsyncStorage. Reads on mount, writes on change. | ✓ |
| In-memory useState only | Settings reset to defaults on each restart. | |

**User's choice:** AsyncStorage.

**Navigation structure:**

| Option | Description | Selected |
|--------|-------------|----------|
| Settings → Preferences (nested) | SettingsScreen has a 'Notification Preferences' row that pushes PreferencesScreen. | ✓ |
| Flat siblings in AccountNavigator | Separate Settings and Notifications rows on AccountScreen. | |
| Single merged screen | All settings and toggles on one screen. | |

**User's choice:** SettingsScreen links to PreferencesScreen (nested push).

---

## Claude's Discretion

- Mechanism for sharing in-memory profile state (React context vs prop-drilling) — prefer minimal ProfileContext or lift into AccountNavigator.
- Exact notification toggle categories on PreferencesScreen — use domain-appropriate defaults.
- Placeholder avatar rendering (initials circle).

## Deferred Ideas

None — discussion stayed within phase scope.
