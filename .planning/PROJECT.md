# VoltVenture

## What This Is

VoltVenture is a mobile e-bike rental app for tourists. It lets travelers find nearby available electric bikes, book and unlock them directly from their phone, ride with live cost tracking, and pay in-app — making short-range exploration frictionless for visitors who don't know the area.

v1.0 MVP shipped 2026-08-18. All screens implemented as a frontend-only vertical slice with mocked backend services.

## Core Value

A tourist can go from opening the app to riding an e-bike in under 2 minutes.

## Requirements

### Validated (v1.0)

- User can sign up and log in (email/password or social) — v1.0
- User can see available e-bikes near them on a map — v1.0
- User can view bike details (battery, distance, price per minute) — v1.0
- User can book / reserve an e-bike — v1.0
- User can unlock a bike via the app (QR scan or Bluetooth mock) — v1.0
- User can see an active ride session (timer, live cost, battery) — v1.0
- User can end a ride and complete payment in-app — v1.0
- User can view ride history and past receipts — v1.0
- User can view payment methods (mock Visa 4242) — v1.0

### Active (v1.1 — Backend Integration)

- [ ] Real backend API integration (auth, bikes, bookings, rides, payments)
- [ ] Real Google / Apple OAuth (getMockGoogleToken replaced)
- [ ] Real Bluetooth unlock (BLE library integration)
- [ ] Persistent ride history (database-backed)
- [ ] Real payment processing (Stripe or equivalent)
- [ ] Real payment method management (add/remove cards)
- [ ] Google Maps API key for device builds
- [ ] Font loading: Manjari (display) + Inter (body)

### Out of Scope

- Fleet / operator management dashboard — separate product for bike operators
- Web version — mobile-first only
- Business / multi-rider accounts — personal tourist use only
- Profile management (name/photo/language) — deferred to v2
- Notification preferences — deferred to v2
- Ride ratings / reviews — deferred to v2
- Loyalty / points — deferred to v2
- Localization — deferred to v2

## Context

- **Design System**: Volt Venture Design System (https://volt-venture-design-system.vercel.app/) — all UI uses components and tokens from this system
- **Framework**: React Native (Expo SDK 57) with React Native Paper v5 as the component foundation
- **Styling**: NativeWind v4 (Tailwind CSS for React Native) for layout and spacing; StyleSheet.create with DSColors for map/complex screens
- **Target users**: Tourists / travelers; low familiarity with city, limited time, likely first-time users
- **Current state**: Frontend-only, all backend mocked/stubbed. ~4,390 LOC TypeScript, 0 errors.
- **Build**: Expo SDK 57 requires Android emulator (Android Studio) or EAS dev build — not compatible with published Expo Go

## Constraints

- **Tech Stack**: React Native + React Native Paper + NativeWind — no substitutions
- **Design**: Must follow the Volt Venture Design System (colors, typography, components)
- **Platform**: iOS and Android (React Native cross-platform)
- **Scope**: Frontend-first — backend/API integration mocked until v1.1

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Native Paper as UI base | Aligns with design system component model | Good — Paper components integrate cleanly with DSColors/paperTheme |
| NativeWind for Tailwind styling | Familiar utility-class approach to RN | Good — works well for auth/list screens; avoid on map/complex screens (layout issues) |
| DSColors inlined in tailwind.config.js | Cannot require() TS ESM files in Node.js/jiti | Good — stable fix; keep in sync with theme.ts manually |
| textOnPrimary = #0F0F0F (black) | Electric Green (#C6FF2D) is LIGHT (1.36:1 contrast on white) | Critical — never use green as text on white |
| accent = #7D9220 for green text on white | Only accessible green (4.6:1 contrast ratio) | Good — use for any green text on white backgrounds |
| Modal stack pattern for BookingStack + RideStack | Overlays AppTabs without replacing tab navigator | Good — clean dismiss back to map; mirrors expected mobile UX |
| useRef epoch anchor for timers | Drift-free vs decrementing counter | Good — proven on both countdown (booking) and count-up (ride) |
| Social auth mocked (getMockGoogleToken) | Real OAuth requires dev build + Google Cloud Console | Deferred — mock sufficient for Phase 1 demo scope |
| In-memory rideHistory | Acceptable for mock scope (resets on restart) | Deferred — needs persistent storage in backend integration |
| PAY-02 view-only per D-16 | Real card entry requires backend/Stripe integration | Deferred — Add card stubbed with Snackbar |
| StyleSheet.create for map/booking screens | NativeWind caused layout issues on Phase 2 map screens | Good — convention adopted for all complex screens |
| End Ride = raw TouchableOpacity (#E53935) | Green CTA and red destructive must be visually distinct | Good — PrimaryButton reserved for forward-progress CTAs |
| Incremental phase-by-phase scope | User reveals what to build each stage | Good — each phase cleanly built on the previous |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

*Last updated: 2026-08-18 after v1.0 milestone*
