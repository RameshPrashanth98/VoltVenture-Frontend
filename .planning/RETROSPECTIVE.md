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

## Cross-Milestone Trends

| Metric | v1.0 |
|--------|------|
| Phases | 4 |
| Plans | 16 |
| LOC (TS) | ~4,390 |
| Days | 5 |
| TS errors at ship | 0 |
| UAT coverage | 0% (emulator blocker) |
