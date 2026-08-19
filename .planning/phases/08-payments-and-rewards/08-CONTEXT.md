# Phase 8: Payments & Rewards - Context

**Gathered:** 2026-08-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 8 delivers: (1) AddPaymentMethod screen — a card entry form (number, expiry, CVV, name) that saves new cards to an in-memory list in paymentService; (2) SelectPaymentMethod screen — a card picker pushed from PaymentSummaryScreen, updating the default card in paymentService; (3) VoltCoinsRewards screen — shows live balance computed from rideHistory (10 coins per €1 spent), a per-ride earn history list, and a static rewards catalog; (4) RideHistoryStats — a stats summary header added to the top of the existing RideHistoryScreen showing total rides, total distance, total spend, and CO2 saved.

All screens are frontend-only with mocked/in-memory data. No new navigator stack is needed — all screens plug into the existing AccountStack.

</domain>

<decisions>
## Implementation Decisions

### AddPaymentMethod — Form & Save Behavior

- **D-01:** Saving a card adds it to an in-memory card array in `paymentService` (alongside the hardcoded Visa •••• 4242). Both PaymentMethodsScreen and SelectPaymentMethod read from this shared array. The new card appears immediately after save.
- **D-02:** One card is always marked as the default payment method. Visa •••• 4242 is the initial default. SelectPaymentMethod lets the user change the default; the selected card is used by `paymentService.processPayment()` at checkout.
- **D-03:** Basic format validation before Save is enabled: card number = 16 digits, expiry = MM/YY format, CVV = 3–4 digits, cardholder name = non-empty. Inline error text shown under each invalid field. Save button disabled (or shows validation errors) while any field is invalid.

### SelectPaymentMethod — Entry Point & Navigation

- **D-04:** SelectPaymentMethod is triggered from PaymentSummaryScreen. Add a "Change" link/button next to the payment method row in PaymentSummaryScreen (where "Visa •••• 4242" is currently hardcoded).
- **D-05:** SelectPaymentMethod is added as a new screen in `RideStackParamList` (no params needed). PaymentSummaryScreen pushes it via `navigation.push('SelectPaymentMethod')`.
- **D-06:** When the user picks a card, SelectPaymentMethod calls `paymentService.setDefault(cardId)` then `navigation.goBack()`. PaymentSummaryScreen re-reads the active card from `paymentService.getDefault()` on re-focus (via `useFocusEffect` or `useIsFocused`).

### RideHistoryStats — Stats Header on Existing Screen

- **D-07:** No new screen or route. Add a stats summary card/section at the TOP of the existing `RideHistoryScreen`, above the FlatList. Computed from `rideService.getRideHistory()` — same data source the screen already uses.
- **D-08:** Stats section is always visible, even when ride history is empty. Shows zeroed values: "0 rides · 0.0 km · €0.00 · 0 kg CO2 saved". Layout: 4 stat tiles in a 2×2 grid or a horizontal row of 4 columns.
- **D-09:** CO2 saved formula: `totalDistanceKm × 0.21` kg (average car emission factor). Display as "X.X kg CO2". Already have `distanceKm` on every `RideSummary`.

### VoltCoins — Earn Model & Screen Layout

- **D-10:** VoltCoins balance = sum of `Math.floor(ride.costEur × 10)` for each ride in `rideService.getRideHistory()`. Earn rate: 10 coins per €1 spent. Computed live — no separate service needed.
- **D-11:** Earn history list: one row per ride from `rideService.getRideHistory()`, showing bike name + date on the left and "+{coins} VoltCoins" on the right. Same empty-state pattern as RideHistoryScreen if no rides yet.
- **D-12:** Available Rewards section: 3–4 static reward cards below the earn history. Each shows reward name, coin cost, and a "Redeem" CTA that shows a Snackbar "Rewards redemption coming soon". No dynamic affordability logic — all rewards always shown.
- **D-13:** VoltCoinsRewards is accessed via a new "VoltCoins Rewards" menu row on AccountScreen, inserted between "Payment Methods" and "Settings". Route name: `VoltCoins` in `AccountStackParamList`.

### Claude's Discretion

- Exact layout of the stats header (2×2 grid vs horizontal 4-column row)
- Icon choices for each stat tile (e.g., `map-marker-distance`, `cash`, `leaf`, `bike`)
- Visual styling of the VoltCoins balance display (large number vs card vs badge)
- Reward card names and coin costs (e.g., "€1 off next ride — 100 coins", "Free 10-min ride — 500 coins")
- Whether SelectPaymentMethod shows a radio button or a checkmark to indicate the current default
- Exact copy for the "Change" link in PaymentSummaryScreen

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Screens Being Modified

- `VoltVenture/src/screens/app/PaymentMethodsScreen.tsx` — currently has hardcoded Visa 4242 + stub "Add Payment Method" row; needs updating to read from paymentService card list
- `VoltVenture/src/screens/app/RideHistoryScreen.tsx` — add stats header above FlatList; already uses `rideService.getRideHistory()`
- `VoltVenture/src/screens/app/AccountScreen.tsx` — add "VoltCoins Rewards" menu row between Payment Methods and Settings
- `VoltVenture/src/screens/ride/PaymentSummaryScreen.tsx` — add "Change" CTA next to payment method row; re-read default on focus

### Services & Types (Integration Points)

- `VoltVenture/src/services/paymentService.ts` — extend with `getSavedCards()`, `addCard()`, `setDefault()`, `getDefault()` methods; keep `processPayment()` unchanged
- `VoltVenture/src/types/payment.ts` — currently has only `PaymentResult`; add `SavedCard` interface (`id`, `last4`, `brand`, `expiry`, `cardholderName`, `isDefault`)
- `VoltVenture/src/services/rideService.ts` — read-only; provides `getRideHistory()` returning `RideSummary[]` with `costEur`, `distanceKm`, `durationMin`, `bikeName`, `startTime`

### Navigation Types & Navigators

- `VoltVenture/src/types/navigation.ts` — add `SelectPaymentMethod: undefined` to `RideStackParamList`; add `VoltCoins: undefined` to `AccountStackParamList`
- `VoltVenture/src/navigation/RideNavigator.tsx` — register `SelectPaymentMethod` screen (after PaymentSummary; no header override needed — use standard header)
- `VoltVenture/src/navigation/AccountNavigator.tsx` — register `VoltCoins` screen (after PaymentMethods); also register `AddPaymentMethod: undefined` if AddPaymentMethod is a new AccountStack screen

### Design System & Styling

- `VoltVenture/src/theme/theme.ts` — DSColors: `primary #C6FF2D`, `textOnPrimary #0F0F0F`, `background`, `surface`, `border`, `textPrimary`, `textSecondary`, `destructive`
- Design system reference: https://volt-venture-design-system.vercel.app/ — component tokens

### Prior Phase Context

- `.planning/phases/06-security-and-verification/06-CONTEXT.md` — custom header pattern, Snackbar feedback pattern (SecurityDepositScreen)
- `.planning/phases/04-active-ride-and-payment/04-CONTEXT.md` — PaymentSummaryScreen context; modal stack pattern
- `.planning/PROJECT.md` — key decisions table (StyleSheet.create convention, mock approach, textOnPrimary = #0F0F0F, PAY-02 decision: view-only card was deferred to v2 — now superseded by Phase 8 scope)

### Project & Planning

- `.planning/ROADMAP.md` — Phase 8 goal and success criteria (PAY-05, PAY-06, REW-01, HIST-01)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `PaymentMethodsScreen` — existing card row layout (icon + name + expiry + check-circle) reusable as a template for SelectPaymentMethod list items; divider + sectionHeader style reusable for AddPaymentMethod form sections
- `RideHistoryScreen` — `formatDate()` and `formatDuration()` helpers reusable in VoltCoinsRewards earn history
- `rideService.getRideHistory()` — already returns `RideSummary[]` with all fields needed for both stats header and VoltCoins earn history; no service changes needed for reading
- `PrimaryButton` (`src/components/common/PrimaryButton.tsx`) — "Save Card" CTA in AddPaymentMethod (with disabled state for validation)
- `FormField` (`src/components/common/FormField.tsx`) — existing text input component; check if it supports error state for validation display
- `MaterialCommunityIcons` — already installed; use for stat tile icons, coin icon (`coins`), reward icons
- `Snackbar` (react-native-paper) — already used in PaymentMethodsScreen and SecurityDepositScreen; use for "Rewards redemption coming soon"
- `useFocusEffect` from `@react-navigation/native` — use in PaymentSummaryScreen to re-read default card when returning from SelectPaymentMethod

### Established Patterns

- `StyleSheet.create` + `DSColors` — all screens in this phase (no NativeWind)
- `SafeAreaView` wrapping every screen root
- `StackScreenProps<ParamList, 'ScreenName'>` for all screen prop types
- Custom header: back button left + centered title + `width: 40` spacer right — for AddPaymentMethod, SelectPaymentMethod, VoltCoinsRewards
- `headerShown: false` on screens using custom headers
- Section header style: uppercase, 12px, `DSColors.textSecondary`, 0.8 letterSpacing — already in PaymentMethodsScreen
- `FlatList` with `ListEmptyComponent` and `ItemSeparatorComponent` — RideHistoryScreen pattern; reuse for VoltCoins earn history and SelectPaymentMethod card list

### Integration Points

- `PaymentSummaryScreen.tsx` — currently hardcodes "Visa •••• 4242"; change to `paymentService.getDefault()` and add "Change" CTA that pushes `SelectPaymentMethod`
- `PaymentMethodsScreen.tsx` — change "Add Payment Method" row from Snackbar stub to `navigation.navigate('AddPaymentMethod')`; change card list from hardcoded to `paymentService.getSavedCards()`
- `AccountScreen.tsx` — add "VoltCoins Rewards" row between Payment Methods and Settings rows
- `RideNavigator.tsx` — add `SelectPaymentMethod` as a `Stack.Screen` after `PaymentSummary`
- `AccountNavigator.tsx` — add `AddPaymentMethod` and `VoltCoins` screens

</code_context>

<specifics>
## Specific Ideas

- VoltCoins balance display: large centered number with "VoltCoins" label below, Electric Green accent (e.g., coin icon in `#C6FF2D`)
- Reward examples: "€1 off next ride — 100 coins", "Free 10-min ride — 500 coins", "Partner café voucher — 250 coins", "Priority bike hold — 75 coins"
- Stats layout in RideHistoryScreen: 4 tiles in a 2×2 grid — "Total Rides" (bike icon), "Distance" (map marker), "Total Spend" (cash icon), "CO2 Saved" (leaf icon)
- Card number input: format as groups of 4 with spaces as user types (e.g., "4242 4242 4242 4242")
- Expiry field: auto-insert "/" after MM (e.g., "12/" → "12/26")
- SelectPaymentMethod: currently active default card shown with `check-circle` in `DSColors.primary` (same as PaymentMethodsScreen today)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 8-Payments & Rewards*
*Context gathered: 2026-08-19*
