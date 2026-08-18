---
plan: 05-02
status: complete
completed_at: "2026-08-18"
commit: 625a1eb
phase: 05-account-profile
subsystem: screens/account
tags: [edit-profile, image-picker, form-validation, discard-dialog]
dependency_graph:
  requires: [05-01]
  provides: [EditProfileScreen]
  affects: [ProfileContext, AccountNavigator]
tech_stack:
  added: []
  patterns: [beforeRemove-listener, discardConfirmed-ref, staged-local-state, expo-image-picker-v57]
key_files:
  created:
    - VoltVenture/src/screens/app/EditProfileScreen.tsx
  modified: []
decisions:
  - "Staged avatarUri in localAvatarUri (not committed to context on pick) — only written to ProfileContext on Save"
  - "discardConfirmed useRef used to bypass beforeRemove listener after user confirms Discard dialog"
  - "mediaTypes: 'images' string literal used (not deprecated MediaTypeOptions enum) per SDK 57 API"
metrics:
  duration: "< 10 minutes"
  tasks_completed: 1
  files_created: 1
---

# Phase 5 Plan 02: Edit Profile Screen Summary

## One-liner

EditProfileScreen with expo-image-picker (SDK 57 API), staged local state, beforeRemove back-intercept, and Discard Changes dialog.

## What was built

**EditProfileScreen.tsx** — new screen at `VoltVenture/src/screens/app/EditProfileScreen.tsx`

- **Avatar photo picker**: Tapping the avatar opens the device gallery via `ImagePicker.launchImageLibraryAsync` with `mediaTypes: 'images'` (SDK 57 string form). Photo is staged in `localAvatarUri` state — not committed to ProfileContext until Save.
- **Name input**: React Native Paper `TextInput` in `mode="outlined"` with `error={nameError}`. Empty-name validation shows "Name can't be empty" inline error text in `DSColors.error`.
- **Save Changes button**: `PrimaryButton` (label, onPress, loading, disabled). On tap: validates name, calls `updateProfile({ name: localName.trim(), avatarUri: localAvatarUri })`, then `navigation.goBack()`.
- **beforeRemove listener**: `useEffect` registers `navigation.addListener('beforeRemove', ...)`. When back is pressed with unsaved changes, `e.preventDefault()` is called and the Discard Changes dialog is shown.
- **discardConfirmed ref**: `useRef(false)` — set to `true` in the Discard button handler before calling `navigation.goBack()`, allowing the beforeRemove listener to pass through without re-triggering the dialog.
- **Discard Changes dialog**: Portal > Dialog with "Discard Changes?" title, body text, "Keep Editing" (cancel) and "Discard" (`textColor={DSColors.destructive}`) action buttons.
- **Camera badge**: Absolutely-positioned 24x24 circle over the avatar, bottom-right, containing a `camera` icon from MaterialCommunityIcons.
- **Header**: Back button (arrow-left) + "Edit Profile" title + 40px spacer, matching ProfileScreen header layout.

## Acceptance criteria: all met

- [x] EditProfileScreen.tsx exists at VoltVenture/src/screens/app/EditProfileScreen.tsx
- [x] Imports `* as ImagePicker from 'expo-image-picker'` (namespace import, not named)
- [x] Calls `ImagePicker.launchImageLibraryAsync` with `mediaTypes: 'images'` (string literal)
- [x] Guards image result: `!result.canceled && result.assets && result.assets.length > 0` before `result.assets[0].uri`
- [x] Uses `localAvatarUri` staged state — does NOT call `updateProfile` in `handlePickPhoto`
- [x] Calls `updateProfile({ name: localName.trim(), avatarUri: localAvatarUri })` in `handleSave`
- [x] Implements `beforeRemove` listener via `navigation.addListener('beforeRemove', ...)` in `useEffect`
- [x] Uses `discardConfirmed` ref to allow navigation after user confirms Discard
- [x] Renders Portal > Dialog with `visible={showDiscard}`, title "Discard Changes?", buttons "Keep Editing" and "Discard"
- [x] Discard button has `textColor={DSColors.destructive}`
- [x] TextInput has `mode="outlined"` and `error={nameError}`
- [x] Conditional error Text with `color: DSColors.error` and "Name can't be empty"
- [x] PrimaryButton with `label="Save Changes"` and `loading={isSaving}`
- [x] Camera badge View absolutely positioned over avatar with `MaterialCommunityIcons name="camera"`
- [x] No `MediaTypeOptions` enum anywhere in file
- [x] No `result.uri` (legacy shape) anywhere in file

## Deviations from Plan

None — plan executed exactly as written.

## Threat mitigations applied

| Threat ID | Mitigation |
|-----------|-----------|
| T-05-04 | Name validated on save: `localName.trim()` empty check with `setNameError(true)` and early return — ProfileContext never receives empty name |
| T-05-06 | `result.assets` guarded: `!result.canceled && result.assets && result.assets.length > 0` before accessing `result.assets[0].uri` — prevents crash on Android permission denial |

## Known Stubs

None. All data flows from ProfileContext (real in-memory state). Photo URI is a local device path — no network involved.

## Threat Flags

None. EditProfileScreen introduces no new network endpoints, auth paths, or file access patterns beyond what the plan specifies.

## Self-Check: PASSED

- [x] `VoltVenture/src/screens/app/EditProfileScreen.tsx` exists (227 lines)
- [x] Commit `625a1eb` exists in git log
- [x] All 4 verification greps returned matches
- [x] `thumbColor` does NOT appear in file
- [x] `result.uri` does NOT appear in file (only `result.assets[0].uri`)
