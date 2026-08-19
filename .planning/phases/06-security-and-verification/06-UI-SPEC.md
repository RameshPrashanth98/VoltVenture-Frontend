# UI Design Contract — Phase 6: Security & Verification

**Phase:** 6
**Generated:** 2026-08-18
**Status:** APPROVED

---

## 1. Scope

Phase 6 delivers four new screens and one screen update:

| Screen | Route | Type |
|--------|-------|------|
| AccountScreen | AccountMain | Update — add "Security" menu row |
| LoginSecurity | LoginSecurity | New — security hub |
| IdScan | IdScan | New — camera viewfinder mock |
| FacialScan | FacialScan | New — camera viewfinder mock |
| SecurityDeposit | SecurityDeposit | New — deposit status |

All screens live in the Account stack (`AccountNavigator`).

---

## 2. Design System

### 2.1 Color Tokens

All colors reference `DSColors` from `src/theme/theme.ts`. No hex literals in component code.

| Token | Hex | Usage |
|-------|-----|-------|
| `DSColors.primary` | `#C6FF2D` | Verified badge bg, Switch track, success icon, PrimaryButton bg |
| `DSColors.textOnPrimary` | `#0F0F0F` | Text on green backgrounds (Verified badge text) |
| `DSColors.background` | `#FFFFFF` | Screen background |
| `DSColors.surface` | `#FAFAFA` | Menu rows, section cards |
| `DSColors.textPrimary` | `#0F0F0F` | All body text, row labels, header titles |
| `DSColors.textSecondary` | `#808080` | Subtitles, timestamps, descriptions, chevron icons |
| `DSColors.accent` | `#7D9220` | Section header labels (uppercase overlines) |
| `DSColors.border` | `#EBEBEB` | Row dividers (`borderTopWidth: 1`) |
| `DSColors.destructive` | `#B00020` | Not used in Phase 6 |

**Phase-local literal (not in DSColors):**

| Name | Hex | Usage |
|------|-----|-------|
| Amber | `#F59E0B` | Pending verification badge background |

Amber is a one-off constant defined at the top of LoginSecurity screen file:
```ts
const AMBER = '#F59E0B';
```

### 2.2 Typography

Source: `DSTypography` from `src/theme/theme.ts`. Apply via `StyleSheet.create`.

| Role | fontSize | fontWeight | color | Where |
|------|----------|------------|-------|-------|
| Screen title (header) | 20 | `'600'` | `textPrimary` | All custom headers |
| Section overline | 12 | `'600'` | `accent` | Section labels (ACCOUNT SECURITY, ACTIVE SESSIONS, etc.) |
| Menu row label | 16 | `'400'` | `textPrimary` | All menu rows |
| Row sublabel / description | 13 | `'400'` | `textSecondary` | 2FA description, session location |
| Session device name | 15 | `'600'` | `textPrimary` | Session rows |
| Session metadata | 13 | `'400'` | `textSecondary` | Location, "Last active" |
| Badge text | 12 | `'600'` | varies | Pending/Verified pills |
| Deposit amount | 32 | `'700'` | `textPrimary` | SecurityDeposit large figure |
| Body paragraph | 15 | `'400'` | `textSecondary` | SecurityDeposit explanatory text |
| Instruction text | 15 | `'400'` | `#FFFFFF` | Viewfinder screens (on dark bg) |
| Success text | 20 | `'700'` | `textPrimary` | Post-capture success state |
| Snackbar message | 14 | `'400'` | `#FFFFFF` | React Native Paper Snackbar default |

### 2.3 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| Screen horizontal padding | 24 | All screens |
| Section label top padding | 24 | Above each section label |
| Section label bottom padding | 8 | Below section label, before first row |
| Menu row vertical padding | 16 | All menu rows |
| Row gap (icon → text) | 12 | All rows with left icon |
| Card internal padding | 20 | SecurityDeposit status card |
| Corner bracket size | 20 | Viewfinder corner decorations |
| Corner bracket thickness | 3 | Viewfinder corner borders |

### 2.4 Styling Approach

- **`StyleSheet.create` + `DSColors` only** — no NativeWind on any Phase 6 screen
- **`headerShown: false`** on all new routes; custom header rendered in-screen
- **`SafeAreaView`** wraps every screen root with `flex: 1, backgroundColor: DSColors.background`

---

## 3. Shared Component Patterns

### 3.1 Custom Header

Identical pattern used in SettingsScreen, PreferencesScreen, ProfileScreen. All Phase 6 screens use this.

```
[ arrow-left (24) ]   [ Title — 20/600 ]   [ width:40 spacer ]
```

```ts
styles.header = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingTop: 16,
  paddingBottom: 12,
}
styles.headerTitle = {
  fontSize: 20,
  fontWeight: '600',
  color: DSColors.textPrimary,
}
```

Back button: `MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary}`.
Spacer: `<View style={{ width: 40 }} />`.

### 3.2 Section Label (Overline)

```ts
styles.sectionHeader = {
  fontSize: 12,
  fontWeight: '600',
  color: DSColors.accent,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 8,
}
```

### 3.3 Menu Row (Navigate-to variant)

```ts
styles.menuRow = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  paddingVertical: 16,
  backgroundColor: DSColors.surface,
  borderTopWidth: 1,
  borderColor: DSColors.border,
}
styles.menuRowLeft = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
}
styles.menuRowText = {
  fontSize: 16,
  fontWeight: '400',
  color: DSColors.textPrimary,
}
```

Right side: `MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary}`.

### 3.4 Menu Row (Verification variant)

Same base as 3.3, but right side contains:
- Badge pill (Pending or Verified)
- No chevron on the pill row itself when it's tappable; add `chevron-right` to the right of the badge

Layout: `[ icon | label ] ... [ badge ] [ chevron-right ]`

### 3.5 Verification Status Badge (Pill)

```
Pending:  backgroundColor: AMBER (#F59E0B)  |  text: '#FFFFFF'  |  label: 'Pending'
Verified: backgroundColor: DSColors.primary  |  text: DSColors.textOnPrimary  |  label: 'Verified'
```

```ts
styles.badge = {
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 12,
}
styles.badgeText = {
  fontSize: 12,
  fontWeight: '600',
}
```

### 3.6 React Native Paper Switch (Toggle row)

Reuse pattern from PreferencesScreen:

```ts
<Switch
  value={twoFAEnabled}
  onValueChange={handleToggle}
  trackColor={{ true: DSColors.primary, false: DSColors.border }}
  thumbColor={DSColors.background}
/>
```

Row layout: `[ icon | label + description column ] ... [ Switch ]`

Description text below label: fontSize 13, color `textSecondary`.

### 3.7 Snackbar

Use `Snackbar` from `react-native-paper` inside a `Portal`. Rendered at bottom of screen.

```ts
<Portal>
  <Snackbar
    visible={snackVisible}
    onDismiss={() => setSnackVisible(false)}
    duration={3000}
  >
    {snackMessage}
  </Snackbar>
</Portal>
```

All snack messages auto-dismiss after 3000ms. No action button required.

### 3.8 PrimaryButton

Use `src/components/common/PrimaryButton.tsx` for:
- Capture button (IdScan, FacialScan)
- Continue button (post-capture success state)
- Request Refund button (SecurityDeposit)

When disabled: pass `disabled={true}` prop — component handles grayed-out appearance internally.

---

## 4. Screen-by-Screen Specification

### 4.1 AccountScreen Update

**Change:** Insert "Security" row between the existing "Settings" row and the "Log Out" row.

**Row spec:**
- Icon: `shield-lock` (MaterialCommunityIcons, size 20, color `textPrimary`)
- Label: `'Security'`
- Right: chevron-right (20, `textSecondary`)
- Style: identical `styles.menuRow` pattern
- `onPress`: `navigation.navigate('LoginSecurity')`
- `accessibilityRole="button"`, `accessibilityLabel="Security"`

**No other changes** to AccountScreen.

---

### 4.2 LoginSecurity Screen

**Route:** `LoginSecurity`
**Header title:** `'Security'`

**Layout (top to bottom, inside ScrollView):**

```
[ Custom Header ]
[ Section: ACCOUNT SECURITY ]
  [ 2FA toggle row ]
[ Section: ACTIVE SESSIONS ]
  [ Session row — iPhone 14 Pro ]
  [ Session row — Chrome on Windows ]
  [ Session row — iPad Air ]
[ Section: IDENTITY VERIFICATION ]
  [ IdScan row — with badge + chevron ]
  [ FacialScan row — with badge + chevron ]
[ Section: SECURITY ]
  [ SecurityDeposit row ]
```

Wrap content in `ScrollView` with `showsVerticalScrollIndicator={false}`.

**2FA Toggle Row:**

```
[ shield-account icon (20) | "Two-Factor Authentication" (16/400) ]
                              "Require a code when signing in" (13/400/textSecondary)
                                                               [ Switch ]
```

Row style: same `menuRow` base. Icon left, `flex: 1` middle column (label + sublabel), Switch right. No chevron.

Initial state: `twoFAEnabled = false`.

**Session Rows:**

Each session row is non-tappable (no `onPress`). Displays:
- Left: device icon (see below), size 24, color `textSecondary`
- Middle: device name (15/600/textPrimary) + location + "Last active" timestamp (13/400/textSecondary)
- Right: nothing (no chevron, non-interactive)

| Device | Icon | Location | Timestamp |
|--------|------|----------|-----------|
| iPhone 14 Pro | `cellphone` | Bangkok, Thailand | Active now |
| Chrome on Windows | `monitor` | Chiang Mai, Thailand | 2 days ago |
| iPad Air | `tablet` | Phuket, Thailand | 5 days ago |

Row style: `menuRow` base but no `onPress` and no right element.

"Active now" is displayed in `DSColors.accent` (green text) to indicate live session. Other timestamps use `textSecondary`.

**Identity Verification Rows:**

Each row: `TouchableOpacity` with `menuRow` style.

```
[ fingerprint icon (20, textPrimary) | "Verify Identity (ID Scan)" ] ... [ badge ] [ chevron-right ]
[ face-recognition icon (20, textPrimary) | "Facial Verification" ] ... [ badge ] [ chevron-right ]
```

Icons: `fingerprint` for ID Scan, `face-recognition` for Facial Scan.

Badge state is controlled by `idVerified: boolean` and `faceVerified: boolean` in component state, both defaulting to `false`.

**SecurityDeposit Row:**

```
[ bank icon (20, textPrimary) | "Security Deposit" ] ... [ chevron-right ]
```

Icon: `bank` or `cash`.
`onPress`: `navigation.navigate('SecurityDeposit')`.

**State Shape:**
```ts
const [twoFAEnabled, setTwoFAEnabled] = useState(false);
const [idVerified, setIdVerified] = useState(false);
const [faceVerified, setFaceVerified] = useState(false);
const [snackVisible, setSnackVisible] = useState(false);
const [snackMessage, setSnackMessage] = useState('');
```

Pass `setIdVerified` and `setFaceVerified` via navigation params to IdScan and FacialScan.

**Navigation to sub-screens:**

```ts
// IdScan row
navigation.navigate('IdScan', { onVerified: () => setIdVerified(true) })

// FacialScan row
navigation.navigate('FacialScan', { onVerified: () => setFaceVerified(true) })
```

> Note: Navigation params with callbacks require the param be stored as a function ref. Alternatively, use `navigation.addListener('focus', ...)` with a shared ref or React context. Claude's discretion on implementation — either approach is acceptable.

---

### 4.3 IdScan Screen

**Route:** `IdScan`
**Header title:** `'ID Verification'`

**Layout:**

```
[ Custom Header ]
[ Instruction text — "Position your ID document within the frame." ]
[ Viewfinder area — dark background with landscape rectangle + corners ]
[ Capture / Continue button ]
```

**States:**

1. **Idle** — Viewfinder shown, "Capture" button active
2. **Verifying** — ActivityIndicator overlay on viewfinder, button hidden
3. **Success** — Viewfinder area replaced by success card, "Continue" button shown

**Viewfinder Spec:**

```ts
viewfinder = {
  backgroundColor: '#0F0F0F',
  width: '100%',
  aspectRatio: 1.6,          // landscape rectangle — wider than tall
  position: 'relative',
}
```

Corner brackets: 4 absolute-positioned `View` elements at each corner. Each bracket uses two Views (horizontal bar + vertical bar) styled with white borders to form an L-shape.

```ts
cornerBracket = {
  position: 'absolute',
  width: 20,
  height: 20,
  borderColor: '#FFFFFF',
  borderWidth: 0,             // base: no border
}
// top-left: borderTopWidth: 3, borderLeftWidth: 3
// top-right: borderTopWidth: 3, borderRightWidth: 3
// bottom-left: borderBottomWidth: 3, borderLeftWidth: 3
// bottom-right: borderBottomWidth: 3, borderRightWidth: 3
```

Positioning: `top: 12, left: 12` / `top: 12, right: 12` / `bottom: 12, left: 12` / `bottom: 12, right: 12`.

**Instruction text:**

```ts
instruction = {
  fontSize: 15,
  fontWeight: '400',
  color: DSColors.textSecondary,
  textAlign: 'center',
  paddingHorizontal: 24,
  paddingVertical: 16,
}
```

Text: `"Position your ID document within the frame."`

**Verifying overlay (state 2):**

Absolute-positioned overlay on the viewfinder:
```ts
overlay = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
}
```

Contains: `ActivityIndicator size="large" color={DSColors.primary}` + `Text "Verifying..." (15/400/#FFFFFF)`.

Duration: `setTimeout(onCapture, 1500)`.

**Success state (state 3):**

Replace viewfinder and instruction with success card:
```ts
successCard = {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 48,
  gap: 16,
}
```

Contains:
- `MaterialCommunityIcons name="check-circle" size={72} color={DSColors.primary}`
- `Text "Identity Verified" — 20/700/textPrimary`

Then `PrimaryButton label="Continue" onPress={() => { params.onVerified?.(); navigation.goBack(); }}`.

**Capture button (state 1):**

`PrimaryButton label="Capture" onPress={startCapture}` — full-width, paddingHorizontal 24, paddingTop 24.

---

### 4.4 FacialScan Screen

**Route:** `FacialScan`
**Header title:** `'Facial Verification'`

Identical structure to IdScan with two changes:

1. **Frame shape:** Oval/circle instead of landscape rectangle.
   ```ts
   viewfinder = {
     backgroundColor: '#0F0F0F',
     width: '100%',
     aspectRatio: 1,           // square container
   }
   oval = {
     width: 200,
     height: 240,
     borderRadius: 120,
     borderWidth: 2,
     borderColor: '#FFFFFF',
     borderStyle: 'dashed',    // dashed oval outline as face guide
   }
   ```
   Oval is centered inside the viewfinder using `alignItems: 'center', justifyContent: 'center'`.

2. **Copy changes:**
   - Instruction text: `"Center your face within the frame and hold still."`
   - Success text: `"Face Verified"`
   - Success icon: `MaterialCommunityIcons name="check-circle" size={72} color={DSColors.primary}` (same)

All other behavior (states, overlay, timing, Continue button) is identical to IdScan.

---

### 4.5 SecurityDeposit Screen

**Route:** `SecurityDeposit`
**Header title:** `'Security Deposit'`

**Layout:**

```
[ Custom Header ]
[ Status Card ]
  [ "Security Deposit" label ]
  [ "Active Hold" status badge ]
  [ "$150.00" large amount ]
  [ "Estimated refund: 7 days after your last active ride." ]
[ Explanation section ]
  [ "What is this?" label ]
  [ Explanation paragraph ]
[ Request Refund button ]
```

**Status Card spec:**

```ts
card = {
  margin: 24,
  padding: 20,
  backgroundColor: DSColors.surface,
  borderWidth: 1,
  borderColor: DSColors.border,
  borderRadius: 12,
  alignItems: 'center',
  gap: 12,
}
```

- Card label: `"Security Deposit"` — 13/600/textSecondary (uppercase, tracking 0.8)
- Status badge (inline): `"Active Hold"` — backgroundColor `DSColors.surface`, borderWidth 1, borderColor `DSColors.border`, borderRadius 12, paddingHorizontal 12, paddingVertical 4, text 12/600/textSecondary
- Amount: `"$150.00"` — fontSize 32, fontWeight `'700'`, color `textPrimary`
- Refund estimate: `"Estimated refund: 7 days after your last active ride."` — 13/400/textSecondary, textAlign center

**Explanation section:**

```ts
explanationSection = {
  paddingHorizontal: 24,
  paddingTop: 8,
  gap: 8,
}
```

- Label: `"What is this?"` — 15/600/textPrimary
- Paragraph: `"Your deposit is held to cover any outstanding charges or damage. It's automatically refunded after your account is in good standing for 7 days following your last ride."` — 15/400/textSecondary, lineHeight 22

**Request Refund button:**

`PrimaryButton label="Request Refund" onPress={handleRefundRequest}` — full-width, paddingHorizontal 24, paddingTop 24.

State: `refundRequested: boolean`, defaulting to `false`.

When `refundRequested = true`:
- Button is `disabled={true}`
- Snackbar shows: `"Refund request submitted. Processing may take 5–7 business days."`

---

## 5. Navigation & Routing

### 5.1 New Routes in AccountStackParamList

```ts
// src/types/navigation.ts
export type AccountStackParamList = {
  // ... existing routes ...
  LoginSecurity: undefined;
  IdScan: { onVerified: () => void };
  FacialScan: { onVerified: () => void };
  SecurityDeposit: undefined;
};
```

### 5.2 AccountNavigator additions

```ts
// src/navigation/AccountNavigator.tsx
<Stack.Screen name="LoginSecurity" component={LoginSecurityScreen} options={{ headerShown: false }} />
<Stack.Screen name="IdScan" component={IdScanScreen} options={{ headerShown: false }} />
<Stack.Screen name="FacialScan" component={FacialScanScreen} options={{ headerShown: false }} />
<Stack.Screen name="SecurityDeposit" component={SecurityDepositScreen} options={{ headerShown: false }} />
```

---

## 6. Copy & Microcopy

All copy is locked. Implementers must use exact strings.

| Location | String |
|----------|--------|
| AccountScreen menu row | `Security` |
| LoginSecurity section 1 | `ACCOUNT SECURITY` |
| 2FA row label | `Two-Factor Authentication` |
| 2FA row description | `Require a code when signing in` |
| LoginSecurity section 2 | `ACTIVE SESSIONS` |
| Session 1 | `iPhone 14 Pro` / `Bangkok, Thailand` / `Active now` |
| Session 2 | `Chrome on Windows` / `Chiang Mai, Thailand` / `2 days ago` |
| Session 3 | `iPad Air` / `Phuket, Thailand` / `5 days ago` |
| LoginSecurity section 3 | `IDENTITY VERIFICATION` |
| ID row label | `Verify Identity (ID Scan)` |
| Facial row label | `Facial Verification` |
| LoginSecurity section 4 | `SECURITY` |
| Deposit row label | `Security Deposit` |
| Pending badge | `Pending` |
| Verified badge | `Verified` |
| 2FA enabled snack | `Two-factor authentication enabled` |
| 2FA disabled snack | `Two-factor authentication disabled` |
| IdScan header | `ID Verification` |
| IdScan instruction | `Position your ID document within the frame.` |
| IdScan overlay | `Verifying...` |
| IdScan success | `Identity Verified` |
| IdScan button idle | `Capture` |
| IdScan/FacialScan button success | `Continue` |
| FacialScan header | `Facial Verification` |
| FacialScan instruction | `Center your face within the frame and hold still.` |
| FacialScan success | `Face Verified` |
| SecurityDeposit header | `Security Deposit` |
| Deposit card label | `Security Deposit` |
| Deposit status badge | `Active Hold` |
| Deposit amount | `$150.00` |
| Deposit refund estimate | `Estimated refund: 7 days after your last active ride.` |
| Explanation label | `What is this?` |
| Explanation body | `Your deposit is held to cover any outstanding charges or damage. It's automatically refunded after your account is in good standing for 7 days following your last ride.` |
| Refund button | `Request Refund` |
| Refund snack | `Refund request submitted. Processing may take 5–7 business days.` |

---

## 7. Interaction & State Contracts

| Interaction | Effect |
|-------------|--------|
| 2FA switch ON | `setTwoFAEnabled(true)` → Snackbar "Two-factor authentication enabled" |
| 2FA switch OFF | `setTwoFAEnabled(false)` → Snackbar "Two-factor authentication disabled" |
| Tap IdScan row | `navigation.navigate('IdScan', { onVerified: () => setIdVerified(true) })` |
| Tap FacialScan row | `navigation.navigate('FacialScan', { onVerified: () => setFaceVerified(true) })` |
| IdScan Capture tap | Start 1500ms mock → show overlay → show success state |
| IdScan Continue tap | Call `onVerified()` → `navigation.goBack()` |
| FacialScan Capture tap | Same as IdScan |
| FacialScan Continue tap | Call `onVerified()` → `navigation.goBack()` |
| Return to LoginSecurity after IdScan | `idVerified = true` → badge shows "Verified" |
| Return to LoginSecurity after FacialScan | `faceVerified = true` → badge shows "Verified" |
| Request Refund tap | `setRefundRequested(true)` → button disabled → Snackbar |
| Refund button (after tap) | `disabled={true}` — no re-submit |
| All state | In-memory only — resets on app restart |

---

## 8. Accessibility

| Element | `accessibilityRole` | `accessibilityLabel` |
|---------|---------------------|----------------------|
| Back button (all screens) | `"button"` | `"Go back"` |
| Security menu row | `"button"` | `"Security"` |
| 2FA switch row | `"button"` | `"Two-Factor Authentication, currently off"` (dynamic) |
| IdScan row | `"button"` | `"Verify Identity, status Pending"` (dynamic badge state) |
| FacialScan row | `"button"` | `"Facial Verification, status Pending"` (dynamic) |
| SecurityDeposit row | `"button"` | `"Security Deposit"` |
| Capture button | `"button"` | `"Capture"` |
| Continue button | `"button"` | `"Continue"` |
| Request Refund button | `"button"` | `"Request Refund"` |

---

## 9. File Locations

| File | Action |
|------|--------|
| `src/screens/app/AccountScreen.tsx` | Update — add Security row |
| `src/screens/app/LoginSecurityScreen.tsx` | Create |
| `src/screens/app/IdScanScreen.tsx` | Create |
| `src/screens/app/FacialScanScreen.tsx` | Create |
| `src/screens/app/SecurityDepositScreen.tsx` | Create |
| `src/navigation/AccountNavigator.tsx` | Update — 4 new routes |
| `src/types/navigation.ts` | Update — 4 new param entries |

---

## 10. Out of Scope (Phase 6)

- Real camera (`expo-camera`, permissions, actual image capture)
- Real OCR or biometric validation
- Backend API calls
- Persistent storage (AsyncStorage) for security state
- Actual 2FA code delivery (SMS/TOTP)
- Real payment holds or Stripe integration
