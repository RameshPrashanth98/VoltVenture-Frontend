---
phase: 08-payments-and-rewards
plan: "02"
subsystem: payments
tags: [add-card-form, card-picker, payment-methods, useFocusEffect, validation]
requires: [08-01]
provides: [AddPaymentMethodScreen, SelectPaymentMethodScreen, PaymentMethodsScreen-dynamic, PaymentSummaryScreen-dynamic]
affects: [AccountNavigator, RideNavigator]
tech-stack:
  added: []
  patterns: [touched-validation, card-number-masking, expiry-auto-slash, useFocusEffect-refresh, in-memory-mock-state]
key-files:
  created:
    - VoltVenture/src/screens/app/AddPaymentMethodScreen.tsx
    - VoltVenture/src/screens/ride/SelectPaymentMethodScreen.tsx
  modified:
    - VoltVenture/src/screens/app/PaymentMethodsScreen.tsx
    - VoltVenture/src/screens/ride/PaymentSummaryScreen.tsx
decisions:
  - "Import SavedCard from types/payment not paymentService — paymentService imports but does not re-export the type (Rule 1 fix)"
  - "PrimaryButton disabled=false always; pressing while invalid surfaces all touched errors at once (spec-compliant UX)"
metrics:
  duration: ~3 minutes
  completed: 2026-08-19T11:38:53Z
  tasks: 2
  files: 4
---

# Phase 8 Plan 02: Payment Method Screens Summary

Card entry form with 4-field touched validation and card masking, card picker with default indicator, and dynamic card lists in PaymentMethodsScreen and PaymentSummaryScreen — all wired through the shared paymentService.

## What Was Done

### Task 1: AddPaymentMethodScreen

Created `VoltVenture/src/screens/app/AddPaymentMethodScreen.tsx`:

- **State:** `cardNumber` (display with spaces), `expiry` (MM/YY), `cvv`, `cardholderName`, `touched` object (all false initially)
- **Helper functions (outside component):** `formatCardNumber` (strips non-digits, groups into 4-char blocks joined by spaces), `formatExpiry` (auto-inserts `/` after 2 digits), `detectBrand` (Visa/Mastercard/Card by first digit)
- **Validation functions:** `validateCardNumber` (16 digits after stripping spaces), `validateExpiry` (/^\d{2}\/\d{2}$/ regex), `validateCvv` (3–4 digits), `validateName` (non-empty trim)
- **isFormValid:** derived boolean — all four validators undefined
- **handleSave:** strips spaces to get rawDigits, calls `paymentService.addCard({ last4: rawDigits.slice(-4), brand, expiry, cardholderName })`, then `navigation.goBack()`
- **Save press:** if valid call handleSave; else set all touched true (surfaces all errors at once)
- **Layout:** SafeAreaView edges={['bottom']}, custom header (arrow-left + title + 40px spacer), ScrollView with padding, "CARD DETAILS" section label, 4x FormField, PrimaryButton "Save Card"
- **Threat T-08-03 mitigated:** raw card number never passed to service — only `last4` extracted via `rawDigits.slice(-4)`

### Task 2: SelectPaymentMethodScreen, PaymentMethodsScreen, PaymentSummaryScreen

**SelectPaymentMethodScreen** (`VoltVenture/src/screens/ride/SelectPaymentMethodScreen.tsx`):
- Cards initialized once from `paymentService.getSavedCards()`
- FlatList with custom header, card rows matching PaymentMethodsScreen layout
- Each row: credit-card icon + brand/last4 + expiry; check-circle in DSColors.primary if isDefault, else transparent
- onPress: `paymentService.setDefault(item.id)` then `navigation.goBack()`
- ItemSeparatorComponent: 1px DSColors.border

**PaymentMethodsScreen** (updated):
- Replaced hardcoded Visa 4242 row with `useState<SavedCard[]>(() => paymentService.getSavedCards())`
- Added `useFocusEffect(useCallback(() => { setCards(paymentService.getSavedCards()); }, []))` to refresh after AddPaymentMethod goBack
- Replaced single row with `FlatList` rendering one row per card
- Changed "Add Payment Method" onPress from `setSnackbarVisible(true)` to `navigation.navigate('AddPaymentMethod')`
- Removed Snackbar and snackbarVisible state
- All existing StyleSheet styles preserved

**PaymentSummaryScreen** (updated):
- Added `useFocusEffect` import from `@react-navigation/native`
- Added `activeCard` state: `useState(() => paymentService.getDefault())`
- Added `useFocusEffect(useCallback(() => { setActiveCard(paymentService.getDefault()); }, []))` for stale-card prevention
- Replaced static "Visa •••• 4242" + "Saved" label with dynamic: `activeCard ? \`${activeCard.brand} •••• ${activeCard.last4}\` : 'No card selected'`
- Added "Change" TouchableOpacity calling `navigation.push('SelectPaymentMethod')`
- Removed `savedLabel` style usage (style definition kept for safety)
- Added `changeLink` style: fontSize:13, fontWeight:'500', color:DSColors.primary

## Files Changed

| File | Change |
|------|--------|
| `VoltVenture/src/screens/app/AddPaymentMethodScreen.tsx` | Created — 4-field card form with validation |
| `VoltVenture/src/screens/ride/SelectPaymentMethodScreen.tsx` | Created — card picker with default indicator |
| `VoltVenture/src/screens/app/PaymentMethodsScreen.tsx` | Updated — dynamic list, navigate to AddPaymentMethod, removed Snackbar |
| `VoltVenture/src/screens/ride/PaymentSummaryScreen.tsx` | Updated — dynamic card label, useFocusEffect, Change CTA |

## Verification Results

`npx tsc --noEmit` — **one pre-existing error only:**
```
src/screens/app/VoltCoinsRewardsScreen.tsx(50,35): error TS2322: Type '"coins"' is not assignable to ...
```
This error is from Wave 3 (plan 08-03) — VoltCoinsRewardsScreen was registered in AccountNavigator (08-01) but the screen file is created in 08-03. Zero errors in any of the four files modified by this plan.

## Commits

| Hash | Message |
|------|---------|
| `56dbc3f` | feat(08-02): payment method screens — add card form, card picker, dynamic lists |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed SavedCard import source in SelectPaymentMethodScreen**
- **Found during:** TypeScript verification
- **Issue:** Plan prompt specified `import { paymentService, SavedCard } from '../../services/paymentService'` but `paymentService.ts` imports `SavedCard` from `types/payment` and does not re-export it, causing TS2459.
- **Fix:** Changed to `import type { SavedCard } from '../../types/payment'` (consistent with PaymentMethodsScreen approach in same plan)
- **Files modified:** `VoltVenture/src/screens/ride/SelectPaymentMethodScreen.tsx`
- **Commit:** `56dbc3f`

## Known Stubs

None — all card data flows from `paymentService.getSavedCards()` and `paymentService.getDefault()`. The seed card (Visa 4242) is intentional mock state from 08-01, not a UI stub.

## Threat Flags

No new threat surface beyond the plan's threat model. T-08-03 mitigated: `rawDigits.slice(-4)` enforced in `handleSave`; raw card number never reaches `paymentService.addCard()`.

## Self-Check: PASSED

- `VoltVenture/src/screens/app/AddPaymentMethodScreen.tsx` — FOUND
- `VoltVenture/src/screens/ride/SelectPaymentMethodScreen.tsx` — FOUND
- `VoltVenture/src/screens/app/PaymentMethodsScreen.tsx` — FOUND, contains `getSavedCards`, `navigate('AddPaymentMethod')`, no `setSnackbarVisible`
- `VoltVenture/src/screens/ride/PaymentSummaryScreen.tsx` — FOUND, contains `useFocusEffect`, `getDefault`, `navigation.push('SelectPaymentMethod')`
- Commit `56dbc3f` — FOUND in git log
