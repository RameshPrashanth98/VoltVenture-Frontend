---
phase: 08-payments-and-rewards
plan: "01"
subsystem: payments
tags: [payment-service, navigation, types, foundation]
requires: []
provides: [SavedCard, paymentService-extended, AddPaymentMethod-route, VoltCoins-route, SelectPaymentMethod-route]
affects: [AccountNavigator, RideNavigator]
tech-stack:
  added: []
  patterns: [in-memory-mock-state, module-level-singleton]
key-files:
  created: []
  modified:
    - VoltVenture/src/types/payment.ts
    - VoltVenture/src/services/paymentService.ts
    - VoltVenture/src/types/navigation.ts
    - VoltVenture/src/navigation/AccountNavigator.tsx
    - VoltVenture/src/navigation/RideNavigator.tsx
decisions:
  - "Store only last4 of card number in addCard — raw card numbers never persisted (T-08-01 mitigation)"
  - "Module-level savedCards array shared across all service calls — single in-memory state for mock phase"
  - "Wave 2 screen imports accepted in navigators; Cannot-find-module errors expected until 08-02/08-03 execute"
metrics:
  duration: ~8 minutes
  completed: 2026-08-19T11:33:07Z
  tasks: 2
  files: 5
---

# Phase 8 Plan 01: Payment Service Foundation Summary

Extended paymentService with in-memory SavedCard CRUD methods and registered three new navigation routes (AddPaymentMethod, VoltCoins, SelectPaymentMethod) across AccountNavigator and RideNavigator.

## What Was Done

### Task 1: SavedCard interface + extended paymentService

Added `SavedCard` interface to `types/payment.ts` below the existing `PaymentResult` interface. Fields: `id`, `last4`, `brand`, `expiry` (MM/YY), `cardholderName`, `isDefault`.

Extended `paymentService.ts`:
- Widened `PaymentService` interface with `getSavedCards()`, `addCard()`, `setDefault()`, `getDefault()`
- Added module-level `savedCards: SavedCard[]` array seeded with Visa 4242 card
- Implemented all four methods in `mockPaymentService`
- `processPayment()` left exactly as-is
- `addCard()` applies `.slice(-4)` to enforce last4-only storage (T-08-01 mitigated)

### Task 2: Navigation param lists + screen registrations

`types/navigation.ts`:
- `AccountStackParamList`: added `AddPaymentMethod: undefined` and `VoltCoins: undefined` (after PaymentMethods)
- `RideStackParamList`: added `SelectPaymentMethod: undefined` (between PaymentSummary and RideReceipt)

`AccountNavigator.tsx`:
- Added imports for `AddPaymentMethodScreen` and `VoltCoinsRewardsScreen`
- Registered `AddPaymentMethod` screen after PaymentMethods
- Registered `VoltCoins` screen after SecurityDeposit

`RideNavigator.tsx`:
- Added import for `SelectPaymentMethodScreen`
- Registered `SelectPaymentMethod` screen after PaymentSummary

## Files Changed

| File | Change |
|------|--------|
| `VoltVenture/src/types/payment.ts` | Added `SavedCard` interface (8 lines) |
| `VoltVenture/src/services/paymentService.ts` | Widened interface + 4 new methods + savedCards array (rewritten, 67 lines) |
| `VoltVenture/src/types/navigation.ts` | Added 3 new route entries |
| `VoltVenture/src/navigation/AccountNavigator.tsx` | Added 2 imports + 2 Stack.Screen registrations |
| `VoltVenture/src/navigation/RideNavigator.tsx` | Added 1 import + 1 Stack.Screen registration |

## Verification Results

`npx tsc --noEmit` output — **Wave 1 result (expected)**:

```
src/navigation/AccountNavigator.tsx(16,36): error TS2307: Cannot find module '../screens/app/AddPaymentMethodScreen'
src/navigation/AccountNavigator.tsx(17,36): error TS2307: Cannot find module '../screens/app/VoltCoinsRewardsScreen'
src/navigation/RideNavigator.tsx(8,39): error TS2307: Cannot find module '../screens/ride/SelectPaymentMethodScreen'
```

Zero errors in `payment.ts`, `paymentService.ts`, or `navigation.ts`. All three "Cannot find module" errors are expected — the referenced screen files are created in Wave 2 (plans 08-02 and 08-03). Verification passes per plan spec.

Grep checks:
- `AddPaymentMethod` in navigation.ts: 1 match (pass)
- `SelectPaymentMethod` in navigation.ts: 1 match (pass)
- `VoltCoins` in navigation.ts: 1 match (pass)

## Commits

| Hash | Message |
|------|---------|
| `8b58473` | feat(08-01): payment service foundation — SavedCard type, extended service, navigation routes |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan creates no UI rendering stubs. The `savedCards` seed data (Visa 4242) is intentional mock state, not a UI stub.

## Threat Flags

No new threat surface beyond what is documented in the plan's threat model. T-08-01 mitigated via `.slice(-4)` in `addCard()`. T-08-02 accepted (in-memory only).

## Self-Check: PASSED

- `VoltVenture/src/types/payment.ts` — FOUND, contains `export interface SavedCard`
- `VoltVenture/src/services/paymentService.ts` — FOUND, exports `paymentService`, contains `getSavedCards`, `addCard`, `setDefault`, `getDefault`
- `VoltVenture/src/types/navigation.ts` — FOUND, contains `AddPaymentMethod`, `VoltCoins`, `SelectPaymentMethod`
- `VoltVenture/src/navigation/AccountNavigator.tsx` — FOUND, registers `AddPaymentMethod` and `VoltCoins`
- `VoltVenture/src/navigation/RideNavigator.tsx` — FOUND, registers `SelectPaymentMethod`
- Commit `8b58473` — FOUND in git log
