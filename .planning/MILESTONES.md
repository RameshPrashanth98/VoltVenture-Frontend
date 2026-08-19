# VoltVenture — Milestones

## v1.0 MVP — Shipped 2026-08-18

**Phases:** 4 | **Plans:** 16 | **Timeline:** 5 days (2026-08-13 → 2026-08-18)
**Commits:** 60 | **LOC:** ~4,390 TypeScript | **TypeScript errors:** 0

### Delivered

Full tourist e-bike rental frontend — open the app, find a bike, book it, unlock it, ride, pay, and see your history. All screens implemented across 4 phases with mocked backend services.

### Key Accomplishments

1. React Native scaffold with Volt Venture Design System tokens (NativeWind + React Native Paper) wired from a single `theme.ts` source — zero TypeScript errors throughout
2. Complete auth flow: email/password sign-up and login, Google/Apple social auth buttons, forgot password, session persistence via SecureStore
3. Map-based bike discovery with live markers, bottom sheet detail, filter chips, and distance-sorted list view toggle
4. Booking & unlock modal stack: 10-minute countdown timer, QR code scanner via expo-camera, and 3-state BLE mock unlock
5. Active ride experience: full-screen MapView with floating timer/cost/battery overlay, payment checkout, and ride receipt screen
6. Account tab with ride history FlatList and payment methods screen

### Archive

- `.planning/milestones/v1.0-ROADMAP.md` — full phase details and decisions
- `.planning/milestones/v1.0-REQUIREMENTS.md` — all 21 requirements with outcomes

### Known Deferred Items at Close

- UAT skipped (Expo SDK 57 requires emulator or EAS dev build — Expo Go incompatible)
- All backend services are mocked — real API integration is next milestone
- Fonts (Manjari/Inter), real OAuth, Google Maps API key, BLE library, card management — all deferred to backend integration phase

---

## v1.1 Complete Frontend — Shipped 2026-08-19

**Phases:** 5–9 | **Plans:** 15 | **Timeline:** 2 days (2026-08-18 → 2026-08-19)
**Commits:** 60 | **LOC:** ~9,214 TypeScript total (~4,824 added) | **TypeScript errors:** 0

### Delivered

All remaining Volt Venture design system screens implemented as frontend-only interfaces. App expanded from core rental loop to full tourist experience: account management, security verification, navigation to bikes and chargers, payments and rewards, and discovery of cafés/routes/VIP hubs with support and legal content.

### Key Accomplishments

1. Account & Profile — ProfileContext (React Context), ProfileScreen + EditProfileScreen (expo-image-picker), SettingsScreen + PreferencesScreen (AsyncStorage persistence)
2. Security & Verification — LoginSecurity hub (2FA toggle, session list, verification badge pills), IdScanScreen (3-state capture machine), FacialScanScreen, SecurityDepositScreen
3. Navigation & Ride Extras — NavigateToBikeScreen + WalkingDirectionsScreen (NavStack modal), SafetyMountScreen (checklist gate before ride start), EndRideFindCharging + RidingToCharging (ChargeStack modal)
4. Payments & Rewards — AddPaymentMethodScreen (card form, last4 storage only), SelectPaymentMethodScreen, VoltCoinsRewardsScreen (balance + earn history + rewards catalog), RideHistoryStats 2×2 header
5. Discovery & Content — Discover tab (AppTabs) with CafeMarker + CafeDetailSheet on MapScreen, CuratedRoutesScreen, VipHubsScreen (split map+list), SupportScreen FAQ accordion, PrivacyPolicy + TermsOfService in-app, NavigateToPoiScreen

### Archive

- `.planning/milestones/v1.1-ROADMAP.md` — full phase details and decisions
- `.planning/milestones/v1.1-REQUIREMENTS.md` — all 23 requirements with outcomes

### Known Deferred Items at Close

- UAT (all phases): Expo SDK 57 not compatible with Expo Go; emulator required — UAT skipped again
- All backend services remain mocked (API integration is v2.0)
- Real camera/biometric: IdScan and FacialScan are mock flows (no OCR, no liveness detection)
- Real routing: NavigateToBike, WalkingDirections, NavigateToPoi use static mock data
- Real rewards redemption: VoltCoins display only, no real earn/redeem
