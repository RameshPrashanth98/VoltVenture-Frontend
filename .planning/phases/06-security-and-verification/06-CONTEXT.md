# Phase 6: Security & Verification - Context

**Gathered:** 2026-08-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 delivers: the user can access login security settings (2FA toggle, active sessions), submit an ID document scan (mock viewfinder, no real OCR), complete a facial liveness check (mock viewfinder, no real biometric), and view their security deposit status with a refund CTA. All data is frontend-only with mocked/in-memory state.

Screens: LoginSecurity (hub), IdScan, FacialScan, SecurityDeposit.
AccountScreen is updated with a new "Security" menu row.

</domain>

<decisions>
## Implementation Decisions

### Account Menu Entry Point

- **D-01:** AccountScreen gets a new "Security" menu row placed between the existing "Settings" row and the "Log Out" row. It uses the same icon + label + chevron-right pattern as all other rows (MaterialCommunityIcons, borderTopWidth: 1, borderColor: DSColors.border). Icon: `shield-lock` or `security`. Tapping navigates to `LoginSecurity`.
- **D-02:** `AccountStackParamList` must add: `LoginSecurity`, `IdScan`, `FacialScan`, `SecurityDeposit` routes.

### LoginSecurity Hub Screen

- **D-03:** LoginSecurity is the Security hub screen. Layout from top to bottom:
  1. **Two-Factor Authentication section** — section label ("ACCOUNT SECURITY") + Switch toggle row (icon + "Two-Factor Authentication" label + description "Require a code when signing in" + Switch from react-native-paper). Default state: off.
  2. **Active Sessions section** — section label ("ACTIVE SESSIONS") + 2–3 mock session rows (device icon + device name + location + "Last active" timestamp). Mock data: "iPhone 14 Pro — Bangkok, Thailand — Active now", "Chrome on Windows — Chiang Mai, Thailand — 2 days ago", "iPad Air — Phuket, Thailand — 5 days ago".
  3. **Identity Verification section** — section label ("IDENTITY VERIFICATION") + two rows: "Verify Identity (ID Scan)" + "Facial Verification". Each row shows a Pending (amber) / Verified (DSColors.primary green) pill badge. Default state: Pending for both.
  4. **Security Deposit row** — at the bottom, same menu-row pattern. Navigates to SecurityDeposit.

- **D-04:** 2FA toggle uses Switch from react-native-paper. Toggling on: switch flips immediately + Snackbar "Two-factor authentication enabled". Toggling off: switch flips + Snackbar "Two-factor authentication disabled". State is in-memory per session.

- **D-05:** Verification status badges are pill-shaped Views: "Pending" (backgroundColor: amber #F59E0B, text white) before verification, "Verified" (backgroundColor: DSColors.primary, text: DSColors.textOnPrimary) after completing the scan flow. State is in-memory per session — completing IdScan marks that row Verified, completing FacialScan marks that row Verified independently.

### Camera Viewfinder Mock (IdScan & FacialScan)

- **D-06:** Both screens use a camera viewfinder placeholder UI — no expo-camera, no permissions. The "viewfinder" is a dark View (backgroundColor: #0F0F0F or similar) filling most of the screen, with corner-bracket overlays drawn via View borders (four corner decorations) to suggest a scanning frame.
  - IdScan: landscape rectangle frame (wider than tall) — document/card format. Instructional text above frame: "Position your ID document within the frame."
  - FacialScan: oval or rounded-square frame — face format. Instructional text: "Center your face within the frame and hold still."

- **D-07:** A "Capture" button (PrimaryButton or equivalent) sits below the viewfinder. Tapping Capture triggers:
  1. ActivityIndicator overlay (on the viewfinder) with text "Verifying..." — duration ~1.5 seconds (setTimeout mock).
  2. Viewfinder area transforms to show an inline success state: green checkmark icon (DSColors.primary) + bold text "Identity Verified" (IdScan) or "Face Verified" (FacialScan).
  3. A "Continue" button appears. Tapping Continue navigates back (navigation.goBack()) to LoginSecurity.

- **D-08:** Both screens follow the same pattern — same component structure, different frame shape and instructional text. This keeps code DRY and consistent.

### Verification Flow

- **D-09:** IdScan and FacialScan are independently accessible from LoginSecurity — each row opens its own screen. There is no forced linear sequence between them. Completing one does NOT auto-navigate to the other.
- **D-10:** On returning from IdScan or FacialScan after success, the corresponding LoginSecurity row badge updates from Pending to Verified. Implementation: in-memory state lifted into LoginSecurity (or a minimal context), passed down to screens via navigation params or stored in a shared ref.

### SecurityDeposit Screen

- **D-11:** SecurityDeposit shows a single static active-hold state. Layout:
  - Large status card: "Security Deposit" header + "Active Hold" status badge (DSColors.surface with border) + "$150.00" amount in large bold text.
  - "Estimated refund: 7 days after your last active ride."
  - "What is this?" explanation paragraph: "Your deposit is held to cover any outstanding charges or damage. It's automatically refunded after your account is in good standing for 7 days following your last ride."
  - "Request Refund" button (PrimaryButton or styled button).

- **D-12:** "Request Refund" button tap: shows Snackbar "Refund request submitted. Processing may take 5–7 business days." Button becomes disabled (grays out) after being tapped — cannot re-submit. State is in-memory.

### Claude's Discretion

- Exact icon name for the "Security" menu row in AccountScreen (e.g., `shield-lock`, `lock`, `security`).
- Whether to use a separate `<Snackbar>` provider or the existing Portal pattern for Snackbar messages.
- Exact corner-bracket styling for the viewfinder (View borders vs absolute-positioned corner pieces).
- Whether to pass verification status via navigation params back to LoginSecurity, or use a lightweight SecurityContext/ref.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Screens & Navigation
- `VoltVenture/src/screens/app/AccountScreen.tsx` — current Account menu rows; add "Security" row between Settings and Log Out
- `VoltVenture/src/navigation/AccountNavigator.tsx` — stack to extend with 4 new routes
- `VoltVenture/src/types/navigation.ts` — `AccountStackParamList` must add `LoginSecurity`, `IdScan`, `FacialScan`, `SecurityDeposit`

### Design System & Styling
- `VoltVenture/src/theme/theme.ts` — DSColors, paperTheme; use `StyleSheet.create` + DSColors (not NativeWind) for all Phase 6 screens
- Design system reference: https://volt-venture-design-system.vercel.app/ — tokens and component patterns

### Prior Phase Patterns (read for conventions)
- `VoltVenture/src/screens/app/SettingsScreen.tsx` — custom header pattern (back + centered title + width:40 spacer), section label style (DSColors.accent, textTransform uppercase), menu row structure
- `VoltVenture/src/screens/app/PreferencesScreen.tsx` — Switch from react-native-paper, toggle row pattern

### Project Decisions
- `.planning/PROJECT.md` — key decisions table (textOnPrimary = #0F0F0F, StyleSheet.create convention, mock approach)
- `.planning/ROADMAP.md` — Phase 6 goal and success criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Menu row pattern (icon + label + chevron-right, `borderTopWidth: 1, borderColor: DSColors.border`) — established in AccountScreen; reuse for Security row, SecurityDeposit row, and verification rows in LoginSecurity
- Custom header pattern (back button left + centered title + `width: 40` spacer right) — from SettingsScreen/ProfileScreen; reuse for all Phase 6 screens
- `Switch` from `react-native-paper` with `trackColor={{ true: DSColors.primary }}` — from PreferencesScreen; reuse for 2FA toggle
- `Portal + Dialog` from `react-native-paper` — available if needed for any confirmation dialogs
- `PrimaryButton` (`src/components/common/PrimaryButton.tsx`) — use for Capture button and Request Refund button
- `MaterialCommunityIcons` — already imported in AccountScreen and SettingsScreen; use for row icons and session device icons
- Section label style (DSColors.accent, fontSize 12, fontWeight '600', textTransform uppercase, paddingHorizontal 24) — from SettingsScreen

### Established Patterns
- `StyleSheet.create` + `DSColors` for all Account-section screens — not NativeWind
- `headerShown: false` + custom header for all new screens
- `SafeAreaView` wrapping every screen root
- `StackScreenProps<ParamList, 'ScreenName'>` for screen prop types
- `useAuthContext()` hook for auth — do NOT add security state to AuthContext; use local state or a minimal SecurityContext
- In-memory state per session (resets on restart) — same as ProfileContext pattern

### Integration Points
- `AccountNavigator.tsx` pushes all 4 new screens onto the existing stack
- `AccountScreen.tsx` gets one new menu row — does not replace any existing row
- `AccountStackParamList` in `navigation.ts` needs 4 new string-keyed routes

</code_context>

<specifics>
## Specific Ideas

- Mock session data for LoginSecurity: "iPhone 14 Pro — Bangkok, Thailand — Active now", "Chrome on Windows — Chiang Mai, Thailand — 2 days ago", "iPad Air — Phuket, Thailand — 5 days ago"
- Mock deposit amount: $150.00
- Snackbar messages: "Two-factor authentication enabled", "Two-factor authentication disabled", "Refund request submitted. Processing may take 5–7 business days."
- Verification success text: "Identity Verified" (IdScan), "Face Verified" (FacialScan)
- Instructional text: "Position your ID document within the frame." (IdScan), "Center your face within the frame and hold still." (FacialScan)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 6-Security & Verification*
*Context gathered: 2026-08-18*
