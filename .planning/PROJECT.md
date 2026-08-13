# VoltVenture

## What This Is

VoltVenture is a mobile e-bike rental app for tourists. It lets travelers find nearby available electric bikes, book and unlock them directly from their phone, and pay in-app — making short-range exploration frictionless for visitors who don't know the area.

## Core Value

A tourist can go from opening the app to riding an e-bike in under 2 minutes.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can sign up and log in (email/password or social)
- [ ] User can see available e-bikes near them on a map
- [ ] User can view bike details (battery, distance, price per minute)
- [ ] User can book / reserve an e-bike
- [ ] User can unlock a bike via the app (QR scan or Bluetooth)
- [ ] User can see an active ride session (timer, live cost, battery)
- [ ] User can end a ride and complete payment in-app
- [ ] User can view ride history and past receipts
- [ ] User can manage payment methods

### Out of Scope

- Fleet / operator management dashboard — separate product for bike operators
- Web version — mobile-first only for this milestone
- Business / multi-rider accounts — personal tourist use only

## Context

- **Design System**: Volt Venture Design System (https://volt-venture-design-system.vercel.app/) — all UI must use components and tokens from this system
- **Framework**: React Native with React Native Paper as the component foundation
- **Styling**: NativeWind (Tailwind CSS for React Native) for layout and spacing
- **Approach**: Screens and components built incrementally — scope revealed per phase by the user
- **Target users**: Tourists / travelers; assume low familiarity with the city, limited time, likely first-time users

## Constraints

- **Tech Stack**: React Native + React Native Paper + NativeWind — no substitutions
- **Design**: Must follow the Volt Venture Design System (colors, typography, components)
- **Platform**: iOS and Android (React Native cross-platform)
- **Scope**: Frontend only — backend/API integration mocked or stubbed until connected

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Native Paper as UI base | Aligns with design system component model | — Pending |
| NativeWind for Tailwind styling | Brings familiar utility-class approach to React Native | — Pending |
| Incremental phase-by-phase scope | User reveals what to build each stage | — Pending |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-13 after initialization*
