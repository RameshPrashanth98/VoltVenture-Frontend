# Phase 8: Payments & Rewards - Research

**Researched:** 2026-08-19
**Domain:** React Native payment form UI, in-memory service patterns, FlatList stats headers, VoltCoins rewards screen
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**AddPaymentMethod — Form & Save Behavior**
- D-01: Saving a card adds it to an in-memory card array in `paymentService` (alongside the hardcoded Visa 4242). Both PaymentMethodsScreen and SelectPaymentMethod read from this shared array. New card appears immediately after save.
- D-02: One card is always marked as the default payment method. Visa 4242 is the initial default. SelectPaymentMethod lets the user change the default; the selected card is used by `processPayment()` at checkout.
- D-03: Basic format validation before Save is enabled: card number = 16 digits, expiry = MM/YY format, CVV = 3–4 digits, cardholder name = non-empty. Inline error text shown under each invalid field. Save button disabled (or shows validation errors) while any field is invalid.

**SelectPaymentMethod — Entry Point & Navigation**
- D-04: SelectPaymentMethod is triggered from PaymentSummaryScreen via a "Change" link/button next to the payment method row.
- D-05: SelectPaymentMethod is added as a new screen in `RideStackParamList` (no params needed). PaymentSummaryScreen pushes it via `navigation.push('SelectPaymentMethod')`.
- D-06: When the user picks a card, SelectPaymentMethod calls `paymentService.setDefault(cardId)` then `navigation.goBack()`. PaymentSummaryScreen re-reads the active card from `paymentService.getDefault()` on re-focus via `useFocusEffect`.

**RideHistoryStats — Stats Header on Existing Screen**
- D-07: No new screen or route. Add a stats summary card/section at the TOP of the existing `RideHistoryScreen`, above the FlatList. Computed from `rideService.getRideHistory()`.
- D-08: Stats section is always visible, even when ride history is empty. Shows zeroed values when empty. Layout: 4 stat tiles in a 2×2 grid or horizontal row of 4 columns.
- D-09: CO2 saved formula: `totalDistanceKm × 0.21` kg. Display as "X.X kg CO2". `distanceKm` is on every `RideSummary`.

**VoltCoins — Earn Model & Screen Layout**
- D-10: VoltCoins balance = sum of `Math.floor(ride.costEur × 10)` for each ride in `rideService.getRideHistory()`. Earn rate: 10 coins per €1 spent. Computed live — no separate service needed.
- D-11: Earn history list: one row per ride, showing bike name + date on left and "+{coins} VoltCoins" on right. Same empty-state pattern as RideHistoryScreen if no rides yet.
- D-12: Available Rewards section: 3–4 static reward cards below the earn history. Each shows reward name, coin cost, and a "Redeem" CTA that shows a Snackbar "Rewards redemption coming soon". No dynamic affordability logic.
- D-13: VoltCoinsRewards is accessed via a new "VoltCoins Rewards" menu row on AccountScreen, between "Payment Methods" and "Settings". Route name: `VoltCoins` in `AccountStackParamList`.

### Claude's Discretion

- Exact layout of the stats header (2×2 grid vs horizontal 4-column row)
- Icon choices for each stat tile
- Visual styling of the VoltCoins balance display (large number vs card vs badge)
- Reward card names and coin costs
- Whether SelectPaymentMethod shows a radio button or a checkmark to indicate the current default
- Exact copy for the "Change" link in PaymentSummaryScreen

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAY-05 | User can add a payment method (card form with number/expiry/CVV/name) | AddPaymentMethod screen + paymentService extension + FormField reuse |
| PAY-06 | User can select from saved payment methods before checkout | SelectPaymentMethod screen + paymentService.getDefault()/setDefault() + useFocusEffect in PaymentSummaryScreen |
| REW-01 | User can view their VoltCoins balance and earn history | VoltCoinsRewards screen + VoltCoins computation from rideService |
| HIST-01 | User can see aggregate ride stats (total rides, km, spend, CO2 saved) | Stats header added to existing RideHistoryScreen |
</phase_requirements>

---

## Summary

Phase 8 is a pure frontend UI phase — no new packages required. All four requirements are addressed by extending existing services with in-memory state, adding new screens to existing navigation stacks, and modifying two existing screens. The codebase is already 4,390+ LOC with strong established patterns: `StyleSheet.create + DSColors`, custom headers with back-arrow-left + centered-title + width-40-spacer-right, `useSafeAreaInsets` or `SafeAreaView edges={['bottom']}`, FlatList with `ListEmptyComponent` and `ItemSeparatorComponent`, and `Snackbar` wrapped in `Portal` for feedback.

The key technical work in this phase is: (1) extending `paymentService` from a simple interface to a module-level mutable state holder with `getSavedCards()`, `addCard()`, `setDefault()`, and `getDefault()`, while keeping `processPayment()` untouched; (2) implementing card number/expiry/CVV formatting with `onChangeText` masking; (3) adding `useFocusEffect` to PaymentSummaryScreen so it re-reads the active card when returning from SelectPaymentMethod; and (4) prepending a stats tile grid to RideHistoryScreen using `ListHeaderComponent` on the existing FlatList.

`FormField.tsx` already supports the `error` prop via `react-native-paper`'s `TextInput error={!!error}` and `HelperText type="error"` — it can be used as-is for AddPaymentMethod form fields. `PrimaryButton` already has a `disabled` prop. No new packages need installation.

**Primary recommendation:** All four plans follow the established screen pattern. Implement paymentService extensions first (they are a shared dependency for Plans 08-01 and any future checkout integration), then build screens top-down within each plan.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Card form UI (AddPaymentMethod) | Frontend Screen | paymentService (in-memory) | Capture + validate input; persist to module-level array |
| Payment method selection (SelectPaymentMethod) | Frontend Screen | paymentService (getDefault/setDefault) | Read/write default; navigation.goBack() to caller |
| PaymentSummaryScreen payment display | Frontend Screen | paymentService (getDefault) | Re-read on focus via useFocusEffect; no params needed |
| VoltCoins balance computation | Frontend Screen | rideService (getRideHistory) | Derived: sum(Math.floor(ride.costEur × 10)) — no service change |
| Ride stats aggregation | Frontend Screen | rideService (getRideHistory) | Derived: sum of rides, distance, cost, CO2 — no service change |
| Rewards catalog display | Frontend Screen | — | Static array, Snackbar on Redeem; no service involvement |
| Navigation routing | Navigation types + navigators | — | Add routes to RideStackParamList + AccountStackParamList |

---

## Standard Stack

### Core (Already Installed — No New Packages)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| react-native | 0.86.2 | Core framework | `[VERIFIED: package.json]` |
| react-native-paper | ^5.15.3 | TextInput, HelperText, Snackbar, Button | `[VERIFIED: package.json]` |
| @react-navigation/stack | ^7.10.22 | Stack navigator, StackScreenProps | `[VERIFIED: package.json]` |
| @react-navigation/native | ^7.3.16 | useFocusEffect, useCallback | `[VERIFIED: package.json]` |
| react-native-safe-area-context | ^5.9.0 | SafeAreaView, useSafeAreaInsets | `[VERIFIED: package.json]` |
| @expo/vector-icons | ^15.0.2 | MaterialCommunityIcons (coins, bike, leaf, cash) | `[VERIFIED: package.json]` |

### No Packages to Install

This phase installs zero new dependencies. All required libraries are present in `package.json`. The Package Legitimacy Audit section is omitted accordingly.

---

## Architecture Patterns

### System Architecture Diagram

```
AccountScreen
  |-- "VoltCoins Rewards" row --> AccountStack/VoltCoins
  |-- "Payment Methods" row --> AccountStack/PaymentMethods
         |-- "Add Payment Method" row --> AccountStack/AddPaymentMethod
                                              |
                                       paymentService.addCard()
                                              |
                                       navigation.goBack()

PaymentSummaryScreen (RideStack)
  |-- useFocusEffect --> paymentService.getDefault() --> display card label
  |-- "Change" CTA --> RideStack/SelectPaymentMethod
                              |
                       paymentService.setDefault(id)
                              |
                       navigation.goBack()

RideHistoryScreen (AccountStack)
  FlatList
    ListHeaderComponent: StatsHeader (computed from rideService.getRideHistory())
    data: rideService.getRideHistory()
    ListEmptyComponent: empty state

VoltCoinsRewards (AccountStack)
  ScrollView
    BalanceCard: sum(Math.floor(ride.costEur × 10))
    SectionHeader: "Earn History"
    FlatList (earn history rows)
    SectionHeader: "Available Rewards"
    RewardCards (static × 3–4 + Snackbar on Redeem)
```

### Recommended Project Structure

```
src/
├── types/
│   └── payment.ts              # Add SavedCard interface (id, last4, brand, expiry, cardholderName, isDefault)
├── services/
│   └── paymentService.ts       # Extend: savedCards[], addCard(), getSavedCards(), setDefault(), getDefault()
├── screens/
│   ├── app/
│   │   ├── RideHistoryScreen.tsx      # Add ListHeaderComponent with stats tiles
│   │   ├── AccountScreen.tsx          # Add VoltCoins Rewards menu row
│   │   ├── PaymentMethodsScreen.tsx   # Wire to getSavedCards(); navigate to AddPaymentMethod
│   │   ├── AddPaymentMethodScreen.tsx # NEW — card form
│   │   └── VoltCoinsRewardsScreen.tsx # NEW — balance + earn history + rewards catalog
│   └── ride/
│       ├── PaymentSummaryScreen.tsx   # Add useFocusEffect + "Change" CTA
│       └── SelectPaymentMethodScreen.tsx # NEW — card list with setDefault()
├── navigation/
│   ├── AccountNavigator.tsx    # Add AddPaymentMethod + VoltCoins screens
│   └── RideNavigator.tsx       # Add SelectPaymentMethod screen
└── types/
    └── navigation.ts           # Add routes to RideStackParamList + AccountStackParamList
```

### Pattern 1: paymentService Extension (Module-Level Mutable State)

**What:** Extend the existing `paymentService` module with a module-level `savedCards` array and an in-memory `defaultCardId` ref. The `PaymentService` interface is widened; the concrete implementation is replaced.

**When to use:** All screens in this phase that read/write card state call these methods rather than local component state.

**Example:**
```typescript
// Source: established project pattern (paymentService.ts lines 8–22)
// Module-level mutable state — survives component unmounts, shared across screens

export interface SavedCard {
  id: string;
  last4: string;
  brand: string;      // e.g., 'Visa', 'Mastercard'
  expiry: string;     // 'MM/YY'
  cardholderName: string;
  isDefault: boolean;
}

// Seed with the hardcoded Visa 4242
const savedCards: SavedCard[] = [
  { id: 'card-seed', last4: '4242', brand: 'Visa', expiry: '12/26',
    cardholderName: 'Test User', isDefault: true },
];

let defaultCardId: string = 'card-seed';

// Service additions (addCard, getSavedCards, setDefault, getDefault)
// processPayment() remains untouched
```

### Pattern 2: FlatList ListHeaderComponent for Stats

**What:** Add a `ListHeaderComponent` prop to the existing `FlatList` in `RideHistoryScreen`. The stats block renders above item rows and scrolls with the list. Stats are computed from the same `rides` array already fetched from `rideService`.

**When to use:** Whenever a summary block must appear above a list and scroll with it (preferred over a wrapping `ScrollView` + `FlatList` combo, which causes nested scroll warnings).

**Example:**
```typescript
// Source: [ASSUMED] — React Native FlatList ListHeaderComponent (standard API)
const stats = {
  totalRides: rides.length,
  totalKm: rides.reduce((acc, r) => acc + r.distanceKm, 0),
  totalEur: rides.reduce((acc, r) => acc + r.costEur, 0),
  co2Kg: rides.reduce((acc, r) => acc + r.distanceKm, 0) * 0.21,
};

<FlatList
  data={rides}
  ListHeaderComponent={<StatsHeader stats={stats} />}
  // ... existing props unchanged
/>
```

### Pattern 3: useFocusEffect for Re-Read on Navigation Return

**What:** `useFocusEffect` from `@react-navigation/native` fires whenever the screen receives focus, including when the user navigates back to it. Use in `PaymentSummaryScreen` to re-read `paymentService.getDefault()` after returning from `SelectPaymentMethod`.

**When to use:** Any screen that displays state that can be mutated by a child screen in the same stack, where the mutation happens via service call + `navigation.goBack()`.

**Example:**
```typescript
// Source: [ASSUMED] — @react-navigation/native useFocusEffect (standard API)
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';

const [activeCard, setActiveCard] = useState(() => paymentService.getDefault());

useFocusEffect(
  useCallback(() => {
    setActiveCard(paymentService.getDefault());
  }, [])
);
```

Note: `useFocusEffect` requires wrapping the callback in `useCallback` — React Navigation enforces this to prevent infinite loops. The project already imports `useCallback` in `PaymentSummaryScreen` (line 1), so no import change is needed for that hook.

### Pattern 4: Card Number / Expiry Input Masking (onChangeText)

**What:** Inline formatting transformations on raw input — no library needed. Strip non-digits, then reformat on each keystroke.

**When to use:** Card number (groups of 4, max 19 chars with spaces) and expiry (auto-insert `/` after MM) fields in AddPaymentMethod.

**Example:**
```typescript
// Source: [ASSUMED] — standard React Native controlled input pattern

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(' ') ?? digits;
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}
```

### Pattern 5: Validation State with Inline Error (FormField reuse)

**What:** `FormField` already accepts an `error?: string` prop, passes it to `TextInput error={!!error}` and renders `HelperText type="error"` below. Use this directly in AddPaymentMethod.

**When to use:** Validation errors on all four card form fields (cardNumber, expiry, cvv, cardholderName).

**Validation rules (per D-03):**
- Card number: stripped digits must be exactly 16
- Expiry: must match `^\d{2}\/\d{2}$`
- CVV: stripped digits must be 3–4
- Cardholder name: `.trim().length > 0`

Save button disabled via `PrimaryButton disabled={!isFormValid}` — `isFormValid` is derived from all four validation checks passing.

### Pattern 6: Custom Header (Back + Centered Title + Spacer)

**What:** `headerShown: false` in navigator; custom `View` header inside the screen with `TouchableOpacity` (arrow-left icon) + `Text` (title) + `View` (width: 40 spacer). Used by SecurityDepositScreen, ProfileScreen, and many others.

**When to use:** AddPaymentMethod, SelectPaymentMethod, VoltCoinsRewards — all three new screens.

**Example (from SecurityDepositScreen.tsx lines 26–35):**
```typescript
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
    <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Screen Title</Text>
  <View style={{ width: 40 }} />
</View>
// header style: flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:24, paddingTop:16, paddingBottom:12
// headerTitle style: fontSize:20, fontWeight:'600', color:DSColors.textPrimary
```

### Anti-Patterns to Avoid

- **Nested ScrollView inside FlatList:** RideHistoryScreen uses a FlatList. Adding a stats block via a wrapping `ScrollView` and nesting the `FlatList` inside will cause "VirtualizedLists should never be nested" warning. Use `ListHeaderComponent` instead.
- **Component-local state for card list:** If `PaymentMethodsScreen` or `SelectPaymentMethod` reads from component-local state instead of `paymentService.getSavedCards()`, they will not reflect cards added in `AddPaymentMethod`. Always read from the shared module-level service.
- **Calling `useFocusEffect` without `useCallback`:** React Navigation requires the effect callback to be stable (wrapped in `useCallback`). Omitting `useCallback` causes infinite re-renders.
- **Computing VoltCoins balance in service:** D-10 specifies live computation in the screen from `rideService.getRideHistory()`. Do not add a `getVoltCoins()` method to a service — the screen owns this derived value.
- **Using NativeWind on complex layout screens:** Project convention: `StyleSheet.create + DSColors` for all screens in this phase. NativeWind is reserved for simple auth/list screens only.
- **Snackbar outside Portal:** Prior screens (`SecurityDepositScreen`) wrap `Snackbar` in `Portal`. Without `Portal`, Snackbar may render behind other UI layers. Always use `<Portal><Snackbar .../></Portal>`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Error display under form fields | Custom error text + red border | `FormField` with `error` prop | Already renders `HelperText type="error"` from RNP; consistent styling |
| Card list with selection indicator | Custom radio/checkmark component | `MaterialCommunityIcons name="check-circle"` + conditional color | Already used in PaymentMethodsScreen for the default card indicator |
| Feedback toast | Custom toast overlay | `Snackbar` from react-native-paper (in `Portal`) | Already used in PaymentMethodsScreen, SecurityDepositScreen |
| Primary CTA button with disabled state | Custom TouchableOpacity with opacity logic | `PrimaryButton` with `disabled` prop | Already handles loading + disabled; consistent sizing (minHeight 52) |
| Stats computation | Separate stats service | Inline `.reduce()` in the screen | Trivial arithmetic; keeping computation in the component avoids unnecessary abstraction |

**Key insight:** This phase is primarily about wiring existing infrastructure. Every UI primitive needed already exists in the codebase; the work is assembling them correctly with the right data flow.

---

## Common Pitfalls

### Pitfall 1: PaymentSummaryScreen Shows Stale Card After Navigation Return

**What goes wrong:** `PaymentSummaryScreen` initializes `activeCard` once on mount from `paymentService.getDefault()`. After user selects a different card in `SelectPaymentMethod` and navigates back, the screen still shows the old card.

**Why it happens:** React state initialized in `useState(() => paymentService.getDefault())` does not re-run when the component re-focuses — only on unmount/remount.

**How to avoid:** Use `useFocusEffect(useCallback(() => { setActiveCard(paymentService.getDefault()); }, []))` — fires on every focus event, including navigation return.

**Warning signs:** "Change" CTA works but card label in PaymentSummaryScreen does not update.

### Pitfall 2: Card Validation Fires on First Render (Empty Field Shows Error Immediately)

**What goes wrong:** If validation runs on every render without a "touched" gate, all four fields show error messages before the user has typed anything.

**Why it happens:** Deriving `error` directly from field value without tracking whether the field has been interacted with.

**How to avoid:** Track `touched` state per field (boolean, set to `true` in `onBlur` or on first keystroke). Only show `error` prop when `touched[field] === true`. On final Save press, force all fields to touched to surface all errors at once.

**Warning signs:** Red outlines on all form fields immediately on screen open.

### Pitfall 3: FlatList ListHeaderComponent Loses Scroll Sync

**What goes wrong:** Stats header and list items do not scroll together — the header stays fixed or the FlatList overscrolls past it.

**Why it happens:** Wrapping FlatList in a ScrollView (VirtualizedList nesting) or using an absolute-positioned stats header.

**How to avoid:** Pass the stats block directly as `ListHeaderComponent={<StatsHeader />}` on the existing FlatList. Do not add any scroll wrapper around the FlatList.

**Warning signs:** "VirtualizedLists should never be nested inside plain ScrollViews" warning in Metro console.

### Pitfall 4: paymentService Interface Mismatch

**What goes wrong:** `PaymentService` interface exported from `paymentService.ts` does not include the new methods, causing TypeScript errors in screens that call `paymentService.addCard()` etc.

**Why it happens:** The current file exports `interface PaymentService { processPayment }` — the interface and the `mockPaymentService` object must both be extended.

**How to avoid:** Update both the `PaymentService` interface AND the `mockPaymentService` object AND the re-export (`export const paymentService: PaymentService`). TypeScript will flag any mismatch at compile time.

**Warning signs:** `Property 'addCard' does not exist on type 'PaymentService'` TS error.

### Pitfall 5: AddPaymentMethod Route Missing from AccountNavigator AND Navigation Types

**What goes wrong:** Navigating to `AddPaymentMethod` crashes at runtime ("The action NAVIGATE with payload ... was not handled by any navigator").

**Why it happens:** The screen must be registered in TWO places: (1) `AccountStackParamList` in `navigation.ts`; (2) `<Stack.Screen name="AddPaymentMethod" ...>` in `AccountNavigator.tsx`. Omitting either causes the crash.

**How to avoid:** Always update both files atomically. The TypeScript type error from (1) will surface before runtime if (2) is also updated correctly.

### Pitfall 6: VoltCoins Balance Shows NaN or 0 When No Rides

**What goes wrong:** `rideService.getRideHistory()` returns `[]` when no rides have been completed in the current session (in-memory only). Reduce on an empty array returns `0` for sum operations — this is correct. The risk is `NaN` if `costEur` is undefined on some item.

**Why it happens:** `RideSummary` type guarantees `costEur: number`, so this should not occur. However, defensively using `(ride.costEur ?? 0)` in the reduce prevents any runtime issues.

**How to avoid:** Use `rides.reduce((acc, r) => acc + Math.floor((r.costEur ?? 0) * 10), 0)` for VoltCoins balance. Show "0 VoltCoins" and display the empty-state component when `rides.length === 0`.

---

## Code Examples

### Verified Pattern: Card Row Layout (from PaymentMethodsScreen.tsx)

```typescript
// Source: VoltVenture/src/screens/app/PaymentMethodsScreen.tsx lines 21–38
// Reuse this exact row structure for SelectPaymentMethod card list items

<View style={styles.cardRow}>
  <View style={styles.cardRowLeft}>
    <MaterialCommunityIcons name="credit-card" size={22} color={DSColors.textPrimary} />
    <View>
      <Text style={styles.cardName}>Visa {'\u2022\u2022\u2022\u2022'} 4242</Text>
      <Text style={styles.cardExpiry}>Expires 12/26</Text>
    </View>
  </View>
  <MaterialCommunityIcons name="check-circle" size={18} color={DSColors.primary} />
</View>
```

### Verified Pattern: Section Header Style (from PaymentMethodsScreen.tsx)

```typescript
// Source: VoltVenture/src/screens/app/PaymentMethodsScreen.tsx lines 83–92
sectionHeader: {
  fontSize: 12,
  fontWeight: '600',
  color: DSColors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  paddingHorizontal: 24,
  paddingTop: 20,
  paddingBottom: 8,
},
```

### Verified Pattern: FlatList with Empty State (from RideHistoryScreen.tsx)

```typescript
// Source: VoltVenture/src/screens/app/RideHistoryScreen.tsx lines 55–62
<FlatList
  data={rides}
  keyExtractor={item => item.id}
  renderItem={renderItem}
  ListEmptyComponent={ListEmptyComponent}
  ItemSeparatorComponent={ItemSeparatorComponent}
/>
// Extend with: ListHeaderComponent={<StatsHeader stats={stats} />}
```

### Verified Pattern: Snackbar in Portal (from SecurityDepositScreen.tsx)

```typescript
// Source: VoltVenture/src/screens/app/SecurityDepositScreen.tsx lines 69–77
<Portal>
  <Snackbar
    visible={snackVisible}
    onDismiss={() => setSnackVisible(false)}
    duration={3000}
  >
    Message text here
  </Snackbar>
</Portal>
```

### Verified Pattern: FormField with Error (from FormField.tsx)

```typescript
// Source: VoltVenture/src/components/common/FormField.tsx
// Already supports error prop — use as-is for all four AddPaymentMethod fields
<FormField
  label="Card Number"
  value={cardNumber}
  onChangeText={handleCardNumberChange}
  onBlur={() => setTouched(t => ({ ...t, cardNumber: true }))}
  error={touched.cardNumber ? validateCardNumber(cardNumber) : undefined}
  keyboardType="number-pad"
/>
```

### Verified Pattern: AccountScreen Menu Row (from AccountScreen.tsx)

```typescript
// Source: VoltVenture/src/screens/app/AccountScreen.tsx lines 90–109
// Replicate for VoltCoins Rewards row (insert between PaymentMethods and Settings rows)
<TouchableOpacity
  style={styles.menuRow}
  onPress={() => navigation.navigate('VoltCoins')}
  activeOpacity={0.7}
>
  <View style={styles.menuRowLeft}>
    <MaterialCommunityIcons name="star-circle" size={20} color={DSColors.textPrimary} />
    <Text style={styles.menuRowText}>VoltCoins Rewards</Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
</TouchableOpacity>
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| `useState` in component for shared card list | Module-level `savedCards[]` in service | Survives component unmounts; shared across navigators |
| React Navigation `useIsFocused` | `useFocusEffect` + `useCallback` | `useFocusEffect` is preferred — fires synchronously on focus, not asynchronously |
| Wrapping FlatList in ScrollView for a header | `ListHeaderComponent` on FlatList | Avoids VirtualizedList nesting warning; header scrolls with list |

---

## Integration Points Inventory

All files that must be modified or created in this phase:

### Files to MODIFY

| File | Change Required |
|------|----------------|
| `src/types/payment.ts` | Add `SavedCard` interface |
| `src/services/paymentService.ts` | Add `savedCards[]`, `addCard()`, `getSavedCards()`, `setDefault()`, `getDefault()`; widen `PaymentService` interface |
| `src/types/navigation.ts` | Add `AddPaymentMethod: undefined` to `AccountStackParamList`; add `VoltCoins: undefined` to `AccountStackParamList`; add `SelectPaymentMethod: undefined` to `RideStackParamList` |
| `src/navigation/AccountNavigator.tsx` | Import + register `AddPaymentMethodScreen` and `VoltCoinsRewardsScreen` |
| `src/navigation/RideNavigator.tsx` | Import + register `SelectPaymentMethodScreen` |
| `src/screens/app/AccountScreen.tsx` | Add "VoltCoins Rewards" menu row between Payment Methods and Settings |
| `src/screens/app/PaymentMethodsScreen.tsx` | Change hardcoded card to `getSavedCards()`; change "Add" stub to `navigation.navigate('AddPaymentMethod')` |
| `src/screens/app/RideHistoryScreen.tsx` | Add `ListHeaderComponent` with 4-tile stats grid |
| `src/screens/ride/PaymentSummaryScreen.tsx` | Replace hardcoded "Visa •••• 4242" with `getDefault()` read; add `useFocusEffect` re-read; add "Change" CTA that pushes `SelectPaymentMethod` |

### Files to CREATE

| File | Content |
|------|---------|
| `src/screens/app/AddPaymentMethodScreen.tsx` | Card form (number/expiry/CVV/name), validation, `paymentService.addCard()`, `navigation.goBack()` |
| `src/screens/app/VoltCoinsRewardsScreen.tsx` | Balance header, earn history FlatList, static rewards catalog with Snackbar |
| `src/screens/ride/SelectPaymentMethodScreen.tsx` | Card list from `getSavedCards()`, tap sets default + goBack() |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `useFocusEffect` from `@react-navigation/native` fires when navigating back to a screen via `navigation.goBack()` | Pattern 3 | Low — this is the documented and universally expected behavior of useFocusEffect |
| A2 | Card number/expiry/CVV formatting via `onChangeText` masking works without third-party library | Pattern 4 | Low — controlled input + `replace(/\D/g, '')` is a React Native standard pattern |
| A3 | `ListHeaderComponent` on FlatList renders above all items and scrolls with the list | Pattern 2 | Low — this is documented FlatList API behavior |

No high-risk assumptions. All critical facts were verified against the actual source files.

---

## Open Questions (RESOLVED)

1. **AddPaymentMethod placement in AccountNavigator: `headerShown: false` vs standard header**
   - What we know: CONTEXT.md says "use standard header" for SelectPaymentMethod. AddPaymentMethod is listed under "custom header" screens in D-13 of CONTEXT.md.
   - What's unclear: CONTEXT.md says custom header for AddPaymentMethod/SelectPaymentMethod/VoltCoins, but also says "no header override needed" for SelectPaymentMethod in D-05.
   - Recommendation: Apply `headerShown: false` to all three new screens (AddPaymentMethod, SelectPaymentMethod, VoltCoinsRewards) and implement custom headers consistently. This matches every other complex screen in the codebase. The "standard header" note in D-05 was overridden by the canonical_refs section which lists "custom header" for all three.

---

## Environment Availability

Step 2.6: SKIPPED — no external dependencies. This phase adds zero new packages. All required libraries verified present in `package.json`.

---

## Validation Architecture

`nyquist_validation` is `false` in `.planning/config.json` — Validation Architecture section omitted per config.

---

## Security Domain

This phase implements a card entry form for mock/in-memory use only. No real payment processing, no real card numbers transmitted, no network calls. ASVS V5 (Input Validation) applies nominally — validation is implemented (D-03) for UX correctness, not for financial security. No cryptographic operations, no auth changes, no session changes.

Security note: Do NOT log or persist raw card numbers even in mock code. The `addCard()` method should store only `last4` (the final 4 characters of the raw input), not the full number.

---

## Sources

### Primary (HIGH confidence)
- `VoltVenture/src/services/paymentService.ts` — current interface + mock implementation
- `VoltVenture/src/types/payment.ts` — current PaymentResult type
- `VoltVenture/src/services/rideService.ts` — getRideHistory() return shape
- `VoltVenture/src/screens/app/PaymentMethodsScreen.tsx` — card row layout, section header style, Snackbar pattern
- `VoltVenture/src/screens/app/RideHistoryScreen.tsx` — FlatList pattern, formatDate/formatDuration helpers
- `VoltVenture/src/screens/ride/PaymentSummaryScreen.tsx` — current hardcoded payment display
- `VoltVenture/src/screens/app/SecurityDepositScreen.tsx` — custom header pattern, Snackbar in Portal pattern
- `VoltVenture/src/screens/app/AccountScreen.tsx` — menu row pattern, insert location for VoltCoins row
- `VoltVenture/src/components/common/FormField.tsx` — error prop support confirmed
- `VoltVenture/src/components/common/PrimaryButton.tsx` — disabled prop confirmed
- `VoltVenture/src/types/navigation.ts` — current param lists (routes to add confirmed)
- `VoltVenture/src/navigation/AccountNavigator.tsx` — current screen registrations
- `VoltVenture/src/navigation/RideNavigator.tsx` — current screen registrations
- `VoltVenture/src/theme/theme.ts` — DSColors tokens
- `VoltVenture/package.json` — all dependency versions confirmed

### Secondary (MEDIUM confidence)
- `.planning/phases/08-payments-and-rewards/08-CONTEXT.md` — all locked decisions

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against package.json
- Architecture: HIGH — all patterns lifted from existing codebase source files
- Pitfalls: HIGH — all pitfalls derived from concrete code inspection, not speculation
- Integration points: HIGH — every file path verified to exist

**Research date:** 2026-08-19
**Valid until:** 2026-09-19 (stable React Native codebase; no package changes planned)
