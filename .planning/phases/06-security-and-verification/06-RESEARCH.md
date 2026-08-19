# Phase 6: Security & Verification — Research

**Researched:** 2026-08-18
**Domain:** React Native screen development — security UI, camera viewfinder mock, verification flows, in-memory state
**Confidence:** HIGH

---

## Summary

Phase 6 adds four new screens (LoginSecurity, IdScan, FacialScan, SecurityDeposit) and updates AccountScreen with a "Security" menu row. All screens live in the existing AccountNavigator stack. The phase is entirely frontend — no real camera, no real biometrics, no real 2FA, no backend calls, and no AsyncStorage persistence. All state is in-memory and resets on app restart.

This is a low-complexity phase. Every component pattern is established in the Phase 5 codebase (SettingsScreen, PreferencesScreen, ProfileContext, AccountNavigator). The implementation involves: three TypeScript type additions, one navigator extension, one AccountScreen edit, and four new screen files. The camera viewfinder is a styled View with absolute-positioned corner brackets — no camera library is required.

The one non-trivial decision is how to pass verification callbacks from LoginSecurity back after IdScan/FacialScan complete. React Navigation recommends against function references in params (they are not serializable and cause warnings in Expo/Metro). The UI-SPEC acknowledges this and grants Claude's discretion. The correct pattern for this codebase — given the absence of a SecurityContext — is `navigation.addListener('focus', ...)` in LoginSecurity to re-read a shared ref or route params on return, or React Navigation's `setParams` / `navigation.navigate` back with result params. The simplest approach that matches prior codebase patterns: pass callback via params (works in memory-only, no serialization warning at dev time for function refs in React Navigation v6 within a single stack), guarded by `useCallback`.

**Primary recommendation:** Implement all four screens using `StyleSheet.create + DSColors` with the exact patterns from SettingsScreen and PreferencesScreen. Use navigation params with `useCallback` for the verification callback. No new library installs required.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** AccountScreen gets a new "Security" menu row between "Settings" and "Log Out". Icon: `shield-lock`. Navigates to `LoginSecurity`. Same `menuRow` pattern.
- **D-02:** `AccountStackParamList` adds: `LoginSecurity`, `IdScan`, `FacialScan`, `SecurityDeposit` routes.
- **D-03:** LoginSecurity layout: ACCOUNT SECURITY section (2FA toggle), ACTIVE SESSIONS section (3 mock rows), IDENTITY VERIFICATION section (IdScan + FacialScan rows with badges), SECURITY section (SecurityDeposit nav row). Entire content in ScrollView.
- **D-04:** 2FA toggle uses Switch from react-native-paper. Toggle shows Snackbar. State in-memory.
- **D-05:** Verification badges are pill-shaped Views — Pending: amber `#F59E0B` bg / white text; Verified: `DSColors.primary` bg / `DSColors.textOnPrimary` text. Completing scan flow marks that badge Verified.
- **D-06:** Both IdScan and FacialScan use a dark View viewfinder placeholder (no expo-camera). IdScan: landscape rectangle frame. FacialScan: oval/rounded frame.
- **D-07:** Capture button triggers 1500ms mock delay with ActivityIndicator overlay → success state (icon + text) → Continue button that navigates back.
- **D-08:** Both scan screens share the same component structure, differing only in frame shape and copy.
- **D-09:** IdScan and FacialScan are independently accessible from LoginSecurity — no forced sequence.
- **D-10:** Returning from a scan screen updates the corresponding badge in LoginSecurity. State managed via in-memory mechanism (navigation params or shared ref).
- **D-11:** SecurityDeposit shows static "$150.00" active hold card with refund estimate.
- **D-12:** Request Refund button: shows Snackbar, then disables (cannot re-submit). State in-memory.

### Claude's Discretion

- Exact icon name for the "Security" menu row (e.g., `shield-lock`, `lock`, `security`).
- Whether to use a separate `<Snackbar>` provider or the existing Portal pattern for Snackbar messages.
- Exact corner-bracket styling for the viewfinder (View borders vs absolute-positioned corner pieces).
- Whether to pass verification status via navigation params back to LoginSecurity, or use a lightweight SecurityContext/ref.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEC-01 | User can enable/disable two-factor authentication from settings | Switch toggle row in LoginSecurity with Snackbar feedback; in-memory boolean state |
| SEC-02 | User can scan an ID document and see a mock verified result | IdScan screen — viewfinder mock + 1500ms capture animation + success state + badge update |
| SEC-03 | User can complete a facial scan flow and see a biometric confirmed screen | FacialScan screen — identical structure to IdScan with oval frame and different copy |
| SEC-04 | User can view their security deposit amount and estimated refund date | SecurityDeposit screen — static card with $150.00, 7-day refund estimate, Request Refund CTA |

</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| 2FA toggle UI | Frontend (React Native screen) | — | In-memory state only; no backend |
| Active sessions list | Frontend (React Native screen) | — | Hardcoded mock data; no API |
| Verification badge state | Frontend (React Native state) | — | In-memory per session; no persistence |
| Camera viewfinder mock | Frontend (React Native View) | — | Styled View + `setTimeout`; no camera lib |
| Security deposit display | Frontend (React Native screen) | — | Static mock data; no payment API |
| Navigation routing | AccountNavigator (stack) | navigation.ts types | All screens are stack-pushed from AccountMain |

---

## Standard Stack

### Core (no new installs — all already in package.json)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react-native` | SDK 57 | Core RN primitives (View, Text, StyleSheet, ScrollView, ActivityIndicator) | Project foundation |
| `react-native-paper` | already installed | Switch, Snackbar, Portal | Used in PreferencesScreen, AccountScreen |
| `@expo/vector-icons` (MaterialCommunityIcons) | already installed | Icons for all rows | Already imported in AccountScreen, SettingsScreen |
| `react-native-safe-area-context` | already installed | SafeAreaView | Used by all existing screens |
| `@react-navigation/stack` | already installed | StackScreenProps, navigation.navigate | AccountNavigator pattern |

[VERIFIED: codebase grep] All libraries above are confirmed in existing screen imports — no new packages to install.

### Phase-local constant (not a library)

```ts
// Defined at top of LoginSecurityScreen.tsx only
const AMBER = '#F59E0B';
```

[CITED: 06-UI-SPEC.md §2.1] Amber is a one-off literal for the Pending badge — not added to DSColors.

---

## Package Legitimacy Audit

**No new packages to install for Phase 6.** All required libraries are already present in the project.

| Package | Status |
|---------|--------|
| All Phase 6 dependencies | Already installed — see Standard Stack above |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
AccountScreen (AccountMain)
  └── "Security" row tap
        └── LoginSecurity (hub)
              ├── 2FA Switch ──────────── in-memory boolean → Snackbar
              ├── Session rows ────────── static mock data (non-interactive)
              ├── IdScan row ──────────── navigate('IdScan', { onVerified })
              │     └── IdScan screen
              │           ├── Idle: Viewfinder + Capture button
              │           ├── Verifying: ActivityIndicator overlay (1500ms)
              │           └── Success: check-circle + "Identity Verified" + Continue
              │                 └── Continue: onVerified() → goBack()
              ├── FacialScan row ──────── navigate('FacialScan', { onVerified })
              │     └── FacialScan screen (same flow, oval frame)
              │           └── Continue: onVerified() → goBack()
              └── SecurityDeposit row ─── navigate('SecurityDeposit')
                    └── SecurityDeposit screen
                          ├── Status card ($150.00, Active Hold)
                          └── Request Refund → disabled + Snackbar
```

### Recommended Project Structure

```
src/
├── screens/app/
│   ├── AccountScreen.tsx          # Update: add Security row between Settings + Log Out
│   ├── LoginSecurityScreen.tsx    # Create: security hub
│   ├── IdScanScreen.tsx           # Create: ID document mock viewfinder
│   ├── FacialScanScreen.tsx       # Create: facial liveness mock viewfinder
│   └── SecurityDepositScreen.tsx  # Create: deposit status card
├── navigation/
│   └── AccountNavigator.tsx       # Update: 4 new Stack.Screen entries
└── types/
    └── navigation.ts              # Update: 4 new AccountStackParamList entries
```

No new directories needed. All screen files follow the existing `src/screens/app/` convention.

### Pattern 1: Custom Header (all Phase 6 screens)

**What:** Back button left, centered title, `width: 40` spacer right — prevents title from shifting when no right action exists.
**When to use:** All new screens in AccountNavigator with `headerShown: false`.

```ts
// Source: verified from SettingsScreen.tsx and PreferencesScreen.tsx
<View style={styles.header}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    accessibilityRole="button"
    accessibilityLabel="Go back"
  >
    <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>{/* screen title */}</Text>
  <View style={{ width: 40 }} />
</View>

// styles:
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingTop: 16,
  paddingBottom: 12,
},
headerTitle: {
  fontSize: 20,
  fontWeight: '600',
  color: DSColors.textPrimary,
},
```

### Pattern 2: Section Label (Overline)

**What:** Uppercase accent-colored label before a group of rows.
**When to use:** ACCOUNT SECURITY, ACTIVE SESSIONS, IDENTITY VERIFICATION, SECURITY sections in LoginSecurity.

```ts
// Source: verified from SettingsScreen.tsx
sectionHeader: {
  fontSize: 12,
  fontWeight: '600',
  color: DSColors.accent,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 8,
},
```

### Pattern 3: Menu Row (navigate-to variant)

**What:** Icon + label left, chevron-right right. Identical across AccountScreen, SettingsScreen.
**When to use:** Security row in AccountScreen, SecurityDeposit row in LoginSecurity.

```ts
// Source: verified from AccountScreen.tsx
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

### Pattern 4: Switch Toggle Row

**What:** Icon + label column left, Switch right. No chevron.
**When to use:** 2FA toggle in LoginSecurity.

```ts
// Source: verified from PreferencesScreen.tsx
<Switch
  value={twoFAEnabled}
  onValueChange={handleToggle}
  trackColor={{ true: DSColors.primary, false: DSColors.border }}
  thumbColor={DSColors.background}
/>
// Row layout: flex:1 middle column (label + description sublabel)
// Description: fontSize 13, color textSecondary
```

### Pattern 5: Snackbar via Portal

**What:** React Native Paper Snackbar inside Portal. Auto-dismisses after 3000ms.
**When to use:** 2FA toggle feedback, Refund request feedback.

```ts
// Source: verified from AccountScreen.tsx (Portal + Dialog pattern)
// Snackbar equivalent:
<Portal>
  <Snackbar
    visible={snackVisible}
    onDismiss={() => setSnackVisible(false)}
    duration={3000}
  >
    {snackMessage}
  </Snackbar>
</Portal>

// State shape:
const [snackVisible, setSnackVisible] = useState(false);
const [snackMessage, setSnackMessage] = useState('');
```

[ASSUMED] Snackbar is imported from `react-native-paper` — confirmed in existing package.json via Portal/Dialog usage but the Snackbar import specifically has not been seen in codebase. It is part of the react-native-paper package which is confirmed installed.

### Pattern 6: Verification Callback via Navigation Params

**What:** Pass a callback to a sub-screen so it can signal completion back to the parent.
**When to use:** IdScan and FacialScan — on Continue, call `params.onVerified()` then `navigation.goBack()`.

The UI-SPEC defines this pattern explicitly:

```ts
// In LoginSecurity — navigate with callback
navigation.navigate('IdScan', { onVerified: () => setIdVerified(true) });

// In IdScan — on Continue
const { onVerified } = route.params;
onVerified?.();
navigation.goBack();
```

**Important note on serialization:** React Navigation v6 warns about non-serializable values in params (functions) if `@react-navigation/devtools` or deep linking is configured. This project does not use deep linking or state persistence (Expo SDK 57 dev build, no linking config found). Function params work correctly in-memory in a single stack navigator. The UI-SPEC explicitly permits this approach. [ASSUMED — based on project structure review; no deep linking config observed in codebase]

**Navigation types addition required:**

```ts
// src/types/navigation.ts — AccountStackParamList
LoginSecurity: undefined;
IdScan: { onVerified: () => void };
FacialScan: { onVerified: () => void };
SecurityDeposit: undefined;
```

### Pattern 7: Camera Viewfinder Mock

**What:** Dark `View` with `aspectRatio`, four absolute-positioned corner `View` elements using selective border sides to create L-shaped brackets.
**When to use:** IdScan (landscape 1.6 ratio) and FacialScan (square 1:1 ratio with centered oval).

```ts
// IdScan viewfinder
viewfinder: {
  backgroundColor: '#0F0F0F',
  width: '100%',
  aspectRatio: 1.6,
  position: 'relative',
},

// Corner bracket base
cornerBase: {
  position: 'absolute',
  width: 20,
  height: 20,
},
// Top-left: borderTopWidth:3, borderLeftWidth:3, borderColor:'#FFFFFF'
// Top-right: borderTopWidth:3, borderRightWidth:3, ...
// Bottom-left: borderBottomWidth:3, borderLeftWidth:3, ...
// Bottom-right: borderBottomWidth:3, borderRightWidth:3, ...
// Positioning: top:12/left:12, top:12/right:12, bottom:12/left:12, bottom:12/right:12

// Verifying overlay
overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.6)',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
},

// FacialScan oval (inside square viewfinder)
oval: {
  width: 200,
  height: 240,
  borderRadius: 120,
  borderWidth: 2,
  borderColor: '#FFFFFF',
  borderStyle: 'dashed',
},
```

### Pattern 8: Verification Badge Pill

**What:** Inline pill with conditional background color.
**When to use:** ID Scan row, Facial Verification row in LoginSecurity.

```ts
// Pending state
badge (pending): { backgroundColor: AMBER, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }
badgeText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' }

// Verified state
badge (verified): { backgroundColor: DSColors.primary }
badgeText (verified): { color: DSColors.textOnPrimary }  // #0F0F0F — black on green
```

### Anti-Patterns to Avoid

- **NativeWind on Phase 6 screens:** All Account-section screens must use `StyleSheet.create + DSColors` only. No `className` props.
- **expo-camera import:** The viewfinder is a styled `View` — never import `expo-camera` for this phase.
- **Adding security state to AuthContext:** The CONTEXT.md explicitly prohibits this. Use local state in LoginSecurity (or a minimal separate context if sharing state becomes necessary).
- **AsyncStorage for security state:** Explicitly out of scope. All state is in-memory only.
- **White text on Electric Green (#C6FF2D):** Always use `DSColors.textOnPrimary` (`#0F0F0F` — black) for text on the Verified badge (green background).
- **Hardcoded hex literals:** All colors via `DSColors` tokens, except `AMBER = '#F59E0B'` defined as a local constant in LoginSecurityScreen.tsx, and the viewfinder dark background `'#0F0F0F'` and white `'#FFFFFF'` which are structural (same as `DSColors.textPrimary` / `DSColors.background` values — use DSColors tokens where applicable).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toggle switch | Custom animated View toggle | `Switch` from `react-native-paper` | Already used in PreferencesScreen — consistent behavior, accessibility |
| Toast/feedback message | Custom positioned Text overlay | `Snackbar + Portal` from react-native-paper | Already available, handles dismissal and z-index |
| Action button | Styled TouchableOpacity | `PrimaryButton` component | Already exists at `src/components/common/PrimaryButton.tsx`, handles disabled/loading states |
| Loading spinner | Custom spinner | `ActivityIndicator` from `react-native` | Core primitive — correct size and color props |

**Key insight:** Zero hand-rolled UI infrastructure is needed. Every interactive primitive exists in the codebase already.

---

## Common Pitfalls

### Pitfall 1: Callback Serialization Warning in React Navigation

**What goes wrong:** Passing `onVerified: () => void` in navigation params triggers a React Navigation dev-mode warning about non-serializable values.
**Why it happens:** React Navigation recommends serializable params for deep linking and state restoration. Functions are not serializable.
**How to avoid:** The project has no deep linking config and no state persistence. The warning is cosmetic in dev-only. Accept it, or suppress with a ref pattern: store the callback in a `useRef` in LoginSecurity, assign it on navigate, read it in the sub-screen via a shared context/ref.
**Warning signs:** Yellow box warning in dev build: "Non-serializable values were found in the navigation state."

### Pitfall 2: `borderStyle: 'dashed'` on React Native Android

**What goes wrong:** `borderStyle: 'dashed'` has inconsistent rendering on Android — the dashed oval border in FacialScan may not render as dashes.
**Why it happens:** Android's Skia/Canvas renderer handles dashed borders differently than iOS.
**How to avoid:** Accept the visual inconsistency (scope is MVP, emulator dev-only). Or use `borderStyle: 'solid'` and a slightly different opacity, which renders consistently. Decision is Claude's discretion per CONTEXT.md.
**Warning signs:** FacialScan oval shows as a solid ring on Android emulator.

### Pitfall 3: ScrollView Not Wrapping LoginSecurity

**What goes wrong:** LoginSecurity has four sections and 6+ rows. Without ScrollView, content clips on smaller screens.
**Why it happens:** The AccountNavigator stack fills the screen — content that overflows is clipped by the parent View.
**How to avoid:** Wrap LoginSecurity body in `<ScrollView showsVerticalScrollIndicator={false}>`.
**Warning signs:** Bottom rows (SecurityDeposit row) not visible on screen without scrolling gesture.

### Pitfall 4: Verified Badge Text Color on Green

**What goes wrong:** Using white text on the Verified (Electric Green `#C6FF2D`) badge. Green has 1.36:1 contrast with white — completely inaccessible.
**Why it happens:** Developers assume green is dark.
**How to avoid:** Always use `DSColors.textOnPrimary` (`#0F0F0F`) for text on green backgrounds. Verified badge: `{ backgroundColor: DSColors.primary, ... }` + `{ color: DSColors.textOnPrimary }`.
**Warning signs:** Text appears invisible on the green badge.

### Pitfall 5: `StyleSheet.absoluteFillObject` Missing spread

**What goes wrong:** Overlay does not cover the viewfinder because `absoluteFillObject` is referenced without spreading.
**Why it happens:** `StyleSheet.absoluteFillObject` is an object `{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }` — must be spread into the style object.
**How to avoid:** Use `{ ...StyleSheet.absoluteFillObject, backgroundColor: '...' }` in StyleSheet.create.
**Warning signs:** Overlay renders at zero size or off-position.

### Pitfall 6: PrimaryButton Width Inside ScrollView

**What goes wrong:** `PrimaryButton` with `width: '100%'` may not fill correctly when inside a ScrollView without explicit parent width constraints.
**Why it happens:** ScrollView with horizontal scrolling disabled can still affect flex width propagation.
**How to avoid:** Wrap PrimaryButton in a `<View style={{ paddingHorizontal: 24, paddingTop: 24 }}>` — the View establishes width context.
**Warning signs:** Button appears too narrow or squished.

---

## Code Examples

### AccountScreen — Security Row Insertion

```ts
// Source: verified from AccountScreen.tsx lines 111–124 (Settings row pattern)
{/* Security row — insert between Settings and Log Out */}
<TouchableOpacity
  style={styles.menuRow}
  onPress={() => navigation.navigate('LoginSecurity')}
  activeOpacity={0.7}
  accessibilityRole="button"
  accessibilityLabel="Security"
>
  <View style={styles.menuRowLeft}>
    <MaterialCommunityIcons name="shield-lock" size={20} color={DSColors.textPrimary} />
    <Text style={styles.menuRowText}>Security</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>
```

### LoginSecurity — 2FA Toggle Row

```ts
// Source: verified pattern from PreferencesScreen.tsx (toggle row with description)
<View style={styles.toggleRow}>
  <View style={styles.toggleRowLeft}>
    <MaterialCommunityIcons name="shield-account" size={20} color={DSColors.textPrimary} />
    <View style={styles.toggleLabelGroup}>
      <Text style={styles.toggleLabel}>Two-Factor Authentication</Text>
      <Text style={styles.toggleDescription}>Require a code when signing in</Text>
    </View>
  </View>
  <Switch
    value={twoFAEnabled}
    onValueChange={handleToggle}
    trackColor={{ true: DSColors.primary, false: DSColors.border }}
    thumbColor={DSColors.background}
    accessibilityLabel={`Two-Factor Authentication, currently ${twoFAEnabled ? 'on' : 'off'}`}
  />
</View>
```

### IdScan — State Machine

```ts
// Source: D-07 from CONTEXT.md
type ScanState = 'idle' | 'verifying' | 'success';
const [scanState, setScanState] = useState<ScanState>('idle');

function startCapture() {
  setScanState('verifying');
  setTimeout(() => setScanState('success'), 1500);
}

function handleContinue() {
  route.params.onVerified?.();
  navigation.goBack();
}
```

### Verification Badge

```ts
// Source: 06-UI-SPEC.md §3.5
const AMBER = '#F59E0B';

function VerificationBadge({ verified }: { verified: boolean }) {
  return (
    <View style={[
      styles.badge,
      { backgroundColor: verified ? DSColors.primary : AMBER }
    ]}>
      <Text style={[
        styles.badgeText,
        { color: verified ? DSColors.textOnPrimary : '#FFFFFF' }
      ]}>
        {verified ? 'Verified' : 'Pending'}
      </Text>
    </View>
  );
}

// styles:
badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
badgeText: { fontSize: 12, fontWeight: '600' },
```

### AccountNavigator — New Routes

```ts
// Source: verified from AccountNavigator.tsx pattern
import LoginSecurityScreen from '../screens/app/LoginSecurityScreen';
import IdScanScreen from '../screens/app/IdScanScreen';
import FacialScanScreen from '../screens/app/FacialScanScreen';
import SecurityDepositScreen from '../screens/app/SecurityDepositScreen';

// Inside Stack.Navigator:
<Stack.Screen name="LoginSecurity" component={LoginSecurityScreen} options={{ headerShown: false }} />
<Stack.Screen name="IdScan" component={IdScanScreen} options={{ headerShown: false }} />
<Stack.Screen name="FacialScan" component={FacialScanScreen} options={{ headerShown: false }} />
<Stack.Screen name="SecurityDeposit" component={SecurityDepositScreen} options={{ headerShown: false }} />
```

---

## Project Constraints (from CLAUDE.md)

All actionable directives extracted from `CLAUDE.md` and the project's established conventions:

| Directive | Applies to Phase 6 |
|-----------|-------------------|
| All UI uses Volt Venture Design System tokens | Yes — DSColors and DSTypography from `src/theme/theme.ts` |
| Use React Native Paper components as base | Yes — Switch, Snackbar, Portal, PrimaryButton |
| Frontend only — backend calls mocked/stubbed | Yes — all data is in-memory |
| Each phase scope: do not add features beyond what is asked | Yes — no real camera, no real auth |
| Account-section screens use `StyleSheet.create + DSColors` (not NativeWind) | Yes — confirmed in CONTEXT.md D-06 |
| `headerShown: false` + custom header for all new screens | Yes |
| `SafeAreaView` wrapping every screen root | Yes |
| `StackScreenProps<ParamList, 'ScreenName'>` for screen prop types | Yes |
| Do NOT add security state to AuthContext | Yes — use local state or separate context |
| `textOnPrimary = #0F0F0F` — Electric Green is LIGHT; never white text on green | Yes — Verified badge must use `DSColors.textOnPrimary` |
| `tailwind.config.js`: DSColors MUST be inlined (not imported) | Not relevant — no NativeWind in Phase 6 |
| Expo SDK 57: use Android emulator or EAS dev build (not Expo Go) | Test environment constraint |

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| NativeWind for Account screens | StyleSheet.create + DSColors | Phase 5 (established) | No className props — all styles in StyleSheet objects |
| ProfileContext-style shared context for cross-screen state | Local component state + navigation params | Phase 6 (per CONTEXT.md D-10) | Simpler; no new provider needed unless callback-ref complexity warrants it |

**Deprecated/outdated for this phase:**
- `expo-camera`: explicitly out of scope (D-06). Do not install or import.
- `AsyncStorage` for security toggles: explicitly out of scope. All security state is session-only.

---

## Environment Availability

| Dependency | Required By | Available | Notes |
|------------|------------|-----------|-------|
| React Native Paper (Switch, Snackbar, Portal) | 2FA toggle, feedback messages | Yes | Installed — imported in AccountScreen, PreferencesScreen |
| MaterialCommunityIcons | All row icons | Yes | Installed — imported in AccountScreen, SettingsScreen |
| react-native-safe-area-context | SafeAreaView in all screens | Yes | Installed — used by all existing screens |
| @react-navigation/stack | Navigation types + Stack.Screen | Yes | Installed — AccountNavigator uses it |
| Android emulator | UI testing | Required — Expo Go not supported (SDK 57) | User must use Android Studio emulator or EAS dev build |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None.

**Step 2.6: COMPLETE** — No new external dependencies. All required libraries are already installed.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `Snackbar` is importable from `react-native-paper` in this project | Standard Stack, Pattern 5 | Low — react-native-paper is installed and Snackbar is a core component of the package; Portal/Dialog already confirmed working |
| A2 | Function params in React Navigation cause only a dev-mode warning (not a runtime error) in this project configuration | Pattern 6, Pitfall 1 | Low — no deep linking or state persistence config found in codebase; warning is cosmetic |
| A3 | `borderStyle: 'dashed'` may render inconsistently on Android for the FacialScan oval | Pitfall 2 | Low — visual-only; MVP scope accepts inconsistency |

---

## Open Questions (RESOLVED)

1. **Verification callback implementation preference**
   - What we know: UI-SPEC grants discretion between (a) navigation params with function, (b) `navigation.addListener('focus')` + ref, (c) minimal SecurityContext.
   - What's unclear: Whether the team prefers the simplest approach (params with function) or a cleaner pattern.
   - Recommendation: Use navigation params with `useCallback` (approach a). Matches the UI-SPEC's explicit example. Accept the dev-mode warning. If it becomes a problem, migrate to a `useFocusEffect` + shared ref pattern.

2. **`borderStyle: 'dashed'` on Android emulator**
   - What we know: Dashed borders can be unreliable on Android.
   - What's unclear: Whether the project owner has a preference for solid vs dashed oval.
   - Recommendation: Implement as `dashed` per UI-SPEC; note in plan that `solid` is an acceptable fallback if rendering is broken on the test emulator.

---

## Sources

### Primary (HIGH confidence)
- `VoltVenture/src/screens/app/AccountScreen.tsx` — menu row pattern, Portal/Dialog, imports confirmed
- `VoltVenture/src/screens/app/SettingsScreen.tsx` — custom header, section label, menu row styles confirmed
- `VoltVenture/src/screens/app/PreferencesScreen.tsx` — Switch toggle row pattern confirmed
- `VoltVenture/src/navigation/AccountNavigator.tsx` — Stack.Screen pattern confirmed
- `VoltVenture/src/types/navigation.ts` — AccountStackParamList current shape confirmed
- `VoltVenture/src/theme/theme.ts` — DSColors tokens confirmed
- `VoltVenture/src/components/common/PrimaryButton.tsx` — props interface confirmed
- `VoltVenture/src/context/ProfileContext.tsx` — context pattern confirmed
- `.planning/phases/06-security-and-verification/06-CONTEXT.md` — locked decisions
- `.planning/phases/06-security-and-verification/06-UI-SPEC.md` — pixel-exact specs

### Secondary (MEDIUM confidence)
- `.planning/config.json` — nyquist_validation: false confirmed (validation section omitted)
- `.planning/ROADMAP.md` — Phase 6 plan structure confirmed

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed in codebase imports
- Architecture: HIGH — all patterns directly sourced from existing screen files
- Pitfalls: HIGH — drawn from known RN platform behaviors and direct codebase review
- Navigation callback pattern: MEDIUM — approach is standard but project-specific tradeoffs are discretionary

**Research date:** 2026-08-18
**Valid until:** 2026-09-18 (stable; no fast-moving dependencies)
