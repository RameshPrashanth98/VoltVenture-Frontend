# VoltVenture — Retrospective

## Milestone: v1.0 MVP

**Shipped:** 2026-08-18
**Phases:** 4 | **Plans:** 16 | **Timeline:** 5 days | **LOC:** ~4,390 TypeScript

### What Was Built

1. React Native scaffold: NativeWind v4 + React Native Paper v5 with Volt Venture Design System tokens
2. Complete auth flow: sign-up, login, social auth buttons, forgot password, SecureStore persistence
3. Map-based bike discovery: live markers, detail sheet, filter chips, list view toggle
4. Booking & unlock: modal stack, 10-min countdown, QR scanner (expo-camera), BLE mock 3-state
5. Active ride: full-screen map + floating overlay (timer/cost/battery), payment checkout, receipt
6. Account tab: ride history FlatList, payment methods view

### What Worked

- **Stub-then-implement pattern**: Creating typed stub screens in Wave 1 before full implementation in Wave 2 eliminated TypeScript errors throughout and made navigator registration safe
- **Service singleton pattern**: `interface + delay() + mockXxxService + export const xxxService` was consistent across all 5 services — every Wave 1 plan could establish contracts Wave 2 plans relied on
- **useRef epoch anchor for timers**: Both the booking countdown and the ride count-up used `Date.now()` epoch pinned in a ref — drift-free and easy to clean up vs decrementing counters
- **Modal stack sibling pattern**: Registering BookingStack and RideStack as siblings in RootNavigator (not nested) made presentation:modal work cleanly without breaking tab navigation
- **Wave-based execution**: Plans within phases were organized in waves — sequential plans built on each other without race conditions
- **DSColors inlining**: Discovered the require() TypeScript ESM issue early (Plan 01-01) and fixed it once; never recurred

### What Was Inefficient

- **Expo Go SDK mismatch**: Discovered Expo SDK 57 is not supported by published Expo Go only after the first device test attempt — cost a full session on emulator setup. Should have checked SDK compatibility with Expo Go at project init.
- **Android emulator setup**: Multi-step env var setup (ANDROID_HOME, JAVA_HOME, Gradle OOM fix) happened reactively during UAT instead of proactively during scaffold. Worth establishing a "dev env" plan as Phase 0 for future React Native projects.
- **UAT skipped**: All 14 Phase 1 UAT tests and subsequent UAT remain untested on a real device/emulator. Core flows are coded correctly but runtime behavior is unverified.
- **Missing 01-04-SUMMARY.md**: Plan 01-04 (Login + Forgot Password) was committed but the SUMMARY was never written — minor gap in artifact completeness.

### Patterns Established

- `StyleSheet.create` with DSColors for map/complex screens (NativeWind causes layout issues on MapView)
- `getParent()?.navigate()` / `getParent()?.goBack()` for cross-stack navigation from within modal stacks
- `StackScreenProps<ParamList, 'ScreenName'>` typing on all screen components for navigator type safety
- `FlatList` with `ListEmptyComponent` and `ItemSeparatorComponent` for list screens
- Red `TouchableOpacity` (#E53935) for destructive actions; `PrimaryButton` reserved for forward-progress CTAs
- `SafeAreaView edges={['bottom']}` on screens with native stack header (header handles top safe area)

### Key Lessons

- **Check Expo Go / SDK compatibility at project setup** — not all Expo SDK versions are supported by the store-distributed Expo Go. Verify before the first test attempt.
- **Inline design tokens when build tools can't parse TypeScript** — `jiti`/`sucrase` in tailwind.config.js can't parse TypeScript ESM; inline the values or use a pure-JS token file.
- **Electric Green is a background color, not a text color** — 1.36:1 contrast on white makes it inaccessible as text; only use as background (textOnPrimary = black). For green text on white: accent (#7D9220, 4.6:1).
- **Mock services are fine for frontend phases** — the service singleton pattern made it trivial to establish full TypeScript contracts before any real API exists. The interfaces and types will be reused when the backend is integrated.

### Cost Observations

- Model: Claude Sonnet 4.6 throughout
- Sessions: ~6 sessions across 5 days
- Notable: YOLO + coarse granularity kept planning overhead minimal; most time was execution

---

## Milestone: v1.1 — Complete Frontend

**Shipped:** 2026-08-19
**Phases:** 5 | **Plans:** 15 | **Timeline:** 2 days (2026-08-18 → 2026-08-19) | **LOC added:** ~4,824 TypeScript

### What Was Built

1. Account & Profile — ProfileContext (React Context with spread-merge updateProfile), ProfileScreen + EditProfileScreen (expo-image-picker), SettingsScreen + PreferencesScreen (AsyncStorage persistence for all preferences)
2. Security & Verification — LoginSecurityScreen hub (2FA toggle + Snackbar, 3 session rows, ID/Face badge pills), IdScanScreen (landscape viewfinder, corner brackets, 3-state capture machine), FacialScanScreen (oval viewfinder), SecurityDepositScreen ($150 status card + Request Refund Snackbar)
3. Navigation & Ride Extras — NavigateToBikeScreen + WalkingDirectionsScreen (NavStack modal), SafetyMountScreen (4-item checklist gate — Start Ride disabled until all checked), EndRideFindChargingScreen (5 charger pins + info card) + RidingToChargingScreen (ChargeStack modal)
4. Payments & Rewards — AddPaymentMethodScreen (card form, touched validation, last4 only stored), SelectPaymentMethodScreen, VoltCoinsRewardsScreen (balance = costEur×10, earn history, rewards catalog), RideHistoryStats 2×2 header via ListHeaderComponent
5. Discovery & Content — Discover tab in AppTabs, CafeMarker + CafeDetailSheet wired to MapScreen, CuratedRoutesScreen (FlatList + difficulty badges), VipHubsScreen (split map+list + inline expand), SupportScreen (List.Accordion FAQ), PrivacyPolicyScreen + TermsOfServiceScreen, NavigateToPoiScreen

### What Worked

- **Pattern reuse from v1.0**: Modal stack sibling pattern (NavStack/ChargeStack), stub-then-implement, service singleton, StyleSheet.create for map screens — all applied without friction in v1.1
- **Wave-based execution continued**: Phase 7-9 all had Wave 1 (types/navigation/foundation) → Wave 2 (screens) — zero import errors at final execution
- **Security-first in mock phase**: Storing only last4 in paymentService.addCard() was identified in threat modeling (T-08-01) and implemented correctly even before real backend exists
- **List.Accordion for FAQ**: React Native Paper's accordion eliminated custom expand/collapse logic for SupportScreen
- **CafeDetailSheet mirrors BikeDetailSheet**: Reusing the bottom sheet pattern for café POIs made Phase 9 cafe integration fast and consistent
- **Speed**: 5 phases + 15 plans executed in 2 days — YOLO mode + coarse granularity + established patterns from v1.0 made execution very fast

### What Was Inefficient

- **REQUIREMENTS.md never ticked**: All 23 requirements were built but the checkboxes in REQUIREMENTS.md were never updated during execution — administrative gap that required manual resolution at milestone close
- **Stale HANDOFF.json**: Phase 8 HANDOFF.json persisted into Phase 9 and required cleanup at milestone close — HANDOFF.json should be deleted immediately after successful phase resumption
- **UAT still blocked**: Expo SDK 57 emulator requirement continued to block UAT for the entire v1.1 milestone — this is now 2 milestones of unverified runtime behavior
- **Phase 6 committed as single feat commit**: Phases 5, 7, 8, 9 had granular per-plan commits; Phase 6 was squashed into one `feat(06)` commit — makes bisect harder

### Patterns Established

- `useFocusEffect` + `useCallback` for data refresh on screen focus (PaymentSummaryScreen, VoltCoinsRewardsScreen)
- `List.Accordion` from React Native Paper for FAQ/collapsible content (SupportScreen)
- Discover tab inserted between Map and Account tabs — tab order reflects tourist flow (Map → Discover → Account)
- `NavigateToPoiScreen` mirrors `NavigateToBikeScreen` without Turn-by-Turn button — reusable pattern for any POI navigation
- `CafeDetailSheet` bottom sheet pattern mirrors `BikeDetailSheet` — reusable for any map-pin detail

### Key Lessons

- **Keep REQUIREMENTS.md checkboxes updated during execution** — even if SUMMARY.md is the ground truth, the REQUIREMENTS.md traceability table should be ticked off in the same commit as implementation
- **Delete HANDOFF.json immediately after resumption** — it's a one-shot artifact; leaving it creates confusion in subsequent sessions
- **Establish UAT environment early** — two milestones of accumulated untested behavior is a growing risk; v2.0 must begin with emulator setup as a prerequisite step
- **Mock-phase threat modeling pays off** — security decisions like last4-only card storage were made correctly in mock phase and will carry forward to real integration without rework

### Cost Observations

- Model: Claude Sonnet 4.6 throughout
- Sessions: ~4 sessions across 2 days
- Notable: v1.1 was faster than v1.0 per phase — established patterns + YOLO mode + coarse granularity compound over time

---

## Cross-Milestone Trends

| Metric | v1.0 | v1.1 |
|--------|------|------|
| Phases | 4 | 5 |
| Plans | 16 | 15 |
| LOC (TS) | ~4,390 | ~9,214 total (+4,824) |
| Days | 5 | 2 |
| TS errors at ship | 0 | 0 |
| UAT coverage | 0% (emulator blocker) | 0% (emulator blocker) |
| Plans/day | 3.2 | 7.5 |
| Screens added | ~20 | ~20 |
