# VoltVenture

## What This Is

VoltVenture is a mobile e-bike rental app for tourists. It lets travelers find nearby available electric bikes, book and unlock them directly from their phone, ride with live cost tracking, and pay in-app — making short-range exploration frictionless for visitors who don't know the area.

v1.1 Complete Frontend shipped 2026-08-19. All Volt Venture design system screens are now implemented as a full frontend-only vertical slice with mocked backend services. The app covers the complete tourist journey: onboarding → bike discovery → booking & unlock → active ride & payment → account management → discovery & content.

## Core Value

A tourist can go from opening the app to riding an e-bike in under 2 minutes.

## Requirements

### Validated (v1.0)

- ✓ User can sign up and log in (email/password or social) — v1.0
- ✓ User can see available e-bikes near them on a map — v1.0
- ✓ User can view bike details (battery, distance, price per minute) — v1.0
- ✓ User can book / reserve an e-bike — v1.0
- ✓ User can unlock a bike via the app (QR scan or Bluetooth mock) — v1.0
- ✓ User can see an active ride session (timer, live cost, battery) — v1.0
- ✓ User can end a ride and complete payment in-app — v1.0
- ✓ User can view ride history and past receipts — v1.0
- ✓ User can view payment methods (mock Visa 4242) — v1.0

### Validated (v1.1)

- ✓ User can view and manage login security settings (2FA toggle, active sessions) — v1.1 SEC-01
- ✓ User can scan their ID document for identity verification (mock flow) — v1.1 SEC-02
- ✓ User can complete a facial scan for biometric verification (mock flow) — v1.1 SEC-03
- ✓ User can view and manage their security deposit status — v1.1 SEC-04
- ✓ User can add a new payment method (card form, last4 stored only) — v1.1 PAY-05
- ✓ User can select a payment method before or during checkout — v1.1 PAY-06
- ✓ User can view map directions to a selected bike — v1.1 NAV-01
- ✓ User can follow step-by-step walking directions to a bike — v1.1 NAV-02
- ✓ User sees safety mounting instructions before starting a ride — v1.1 RIDE-05
- ✓ User can find a nearby charging station when ending a ride — v1.1 RIDE-06
- ✓ User can navigate to a charging station while riding — v1.1 RIDE-07
- ✓ User can view ride history statistics (total rides, distance, spend, CO2 saved) — v1.1 HIST-01
- ✓ User can view their profile (name, photo, email, member since) — v1.1 PROF-01
- ✓ User can edit their profile details (name, photo) — v1.1 PROF-02
- ✓ User can manage app settings (units, map style, language) — v1.1 PROF-03
- ✓ User can set notification preferences (ride alerts, promos, safety) — v1.1 PROF-04
- ✓ User can view their VoltCoins balance, earn history, and available rewards — v1.1 REW-01
- ✓ User can access in-app support and help center — v1.1 CONT-01
- ✓ User can view the privacy policy — v1.1 CONT-02
- ✓ User can view the terms of service — v1.1 CONT-03
- ✓ User can view details of a nearby café or point of interest — v1.1 DISC-05
- ✓ User can browse curated e-bike routes — v1.1 DISC-06
- ✓ User can discover and explore VIP hubs on the map — v1.1 DISC-07

### Active (v2.0)

- [ ] Real backend API integration (auth, bikes, bookings, rides, payments)
- [ ] Real Google/Apple OAuth
- [ ] Real BLE unlock (native BLE library)
- [ ] Real payment processing (Stripe or equivalent)
- [ ] Push notifications
- [ ] UAT on emulator (all v1.0 and v1.1 screens)

### Out of Scope

- Fleet / operator management dashboard — separate product for bike operators
- Web version — mobile-first only
- Business / multi-rider accounts — personal tourist use only
- Ride ratings / reviews — deferred to v2
- Localization — deferred to v2
- Offline mode — real-time is core value

## Context

- **Design System**: Volt Venture Design System (https://volt-venture-design-system.vercel.app/) — all UI uses components and tokens from this system
- **Framework**: React Native (Expo SDK 57) with React Native Paper v5 as the component foundation
- **Styling**: NativeWind v4 (Tailwind CSS for React Native) for layout and spacing; StyleSheet.create with DSColors for map/complex screens
- **Target users**: Tourists / travelers; low familiarity with city, limited time, likely first-time users
- **Current state**: Frontend-only, all backend mocked/stubbed. ~9,214 LOC TypeScript, 0 errors.
- **Build**: Expo SDK 57 requires Android emulator (Android Studio) or EAS dev build — not compatible with published Expo Go
- **Screen count**: ~40+ screens across 9 phases covering full tourist rental journey

## Constraints

- **Tech Stack**: React Native + React Native Paper + NativeWind — no substitutions
- **Design**: Must follow the Volt Venture Design System (colors, typography, components)
- **Platform**: iOS and Android (React Native cross-platform)
- **Scope**: Frontend-first — backend/API integration mocked until v2.0

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Native Paper as UI base | Aligns with design system component model | ✓ Good — Paper components integrate cleanly with DSColors/paperTheme |
| NativeWind for Tailwind styling | Familiar utility-class approach to RN | ✓ Good — works well for auth/list screens; avoid on map/complex screens (layout issues) |
| DSColors inlined in tailwind.config.js | Cannot require() TS ESM files in Node.js/jiti | ✓ Good — stable fix; keep in sync with theme.ts manually |
| textOnPrimary = #0F0F0F (black) | Electric Green (#C6FF2D) is LIGHT (1.36:1 contrast on white) | ✓ Critical — never use green as text on white |
| accent = #7D9220 for green text on white | Only accessible green (4.6:1 contrast ratio) | ✓ Good — use for any green text on white backgrounds |
| Modal stack pattern for BookingStack + RideStack | Overlays AppTabs without replacing tab navigator | ✓ Good — clean dismiss back to map; mirrors expected mobile UX |
| NavStack + ChargeStack as modal siblings | NavigateToBike and charging flows overlay any screen | ✓ Good — same pattern as BookingStack/RideStack |
| useRef epoch anchor for timers | Drift-free vs decrementing counter | ✓ Good — proven on both countdown (booking) and count-up (ride) |
| Social auth mocked (getMockGoogleToken) | Real OAuth requires dev build + Google Cloud Console | — Deferred to v2.0 |
| In-memory rideHistory | Acceptable for mock scope (resets on restart) | — Deferred — needs persistent storage in backend integration |
| PAY-02 view-only per D-16 | Real card entry requires backend/Stripe integration | — Deferred to v2.0 |
| StyleSheet.create for map/booking screens | NativeWind caused layout issues on Phase 2 map screens | ✓ Good — convention adopted for all complex screens |
| End Ride = raw TouchableOpacity (#E53935) | Green CTA and red destructive must be visually distinct | ✓ Good — PrimaryButton reserved for forward-progress CTAs |
| Store only last4 in paymentService.addCard() | Raw card numbers must never be persisted (T-08-01) | ✓ Good — security-first even in mock phase |
| ScrollView (not FlatList) for VoltCoinsRewardsScreen | Earn history is short; rewards catalog below — nested FlatList avoided | ✓ Good — per RESEARCH.md Pitfall 6 |
| Incremental phase-by-phase scope | User reveals what to build each stage | ✓ Good — each phase cleanly built on the previous |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

*Last updated: 2026-08-19 after v1.1 milestone*
