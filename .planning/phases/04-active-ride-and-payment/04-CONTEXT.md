# Phase 4: Active Ride & Payment - Context

**Gathered:** 2026-08-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete the full ride lifecycle after unlock: show the ActiveRide screen (live timer, running cost, battery %, user location on map), let the user end the ride in one tap, process mock payment via a PaymentSummary screen, display a RideReceipt, and add payment method management and ride history to the Account tab. Phase starts from the "Start Ride" CTA on UnlockSuccessScreen and ends when the user taps "Done" on RideReceipt. All services are mocked — no real API, no real payment processing.

</domain>

<decisions>
## Implementation Decisions

### Navigation Architecture
- **D-01:** A new `RideStack` is added to `RootStackParamList` alongside the existing `BookingStack`, with **modal presentation** (slides up over AppTabs). Screens in the stack: `ActiveRide`, `PaymentSummary`, `RideReceipt`. The "Start Ride" button on `UnlockSuccessScreen` is updated to call `navigation.getParent()?.navigate('RideStack', { screen: 'ActiveRide', params: { bike } })` instead of the current `getParent()?.goBack()` stub. `BookingStack` is dismissed as part of this navigation.
- **D-02:** All RideStack screens are full-screen (no header). Exit the ride flow only via "Done" on RideReceipt, which pops the entire RideStack back to the map. There is no back/X button during an active ride — the user must end the ride to leave the screen.

### Active Ride Screen
- **D-03:** **Full-screen map** (react-native-maps, same as Phase 2) with the user's current location shown as a distinct marker (Electric Green filled circle). The map is non-interactive during the ride (no pin tapping).
- **D-04:** **Floating top overlay card**: semi-transparent dark background (`rgba(15,15,15,0.85)`), paddingHorizontal 24. Shows: ride timer counting UP in MM:SS (large, Electric Green), running cost in euros (e.g., "€0.42") below the timer in white, battery % with battery icon on the right. Updated every second via `setInterval`.
- **D-05:** **"End Ride" button**: large red button (`backgroundColor: '#E53935'`, color white label) pinned to the bottom of the screen above safe area. One tap navigates to `PaymentSummary` within RideStack.

### Mock Ride Service
- **D-06:** Create `src/services/rideService.ts` (mirror bikeService/bookingService pattern: interface + delay + mockRideService + export singleton). Interface: `startRide(bike: Bike): Promise<ActiveRide>` and `endRide(rideId: string, bike: Bike, durationSec: number): Promise<RideSummary>`. Types in `src/types/ride.ts`: `ActiveRide { id: string; bikeId: string; bikeName: string; startTime: string; batteryPct: number; pricePerMin: number }`, `RideSummary { id: string; bikeId: string; bikeName: string; startTime: string; endTime: string; durationMin: number; costEur: number; distanceKm: number }`.
- **D-07:** Battery in ActiveRide: static during the ride (mock — use bike.batteryPct from route params). No decrement simulation needed. Claude's discretion.

### Payment Flow
- **D-08:** "End Ride" navigates to `PaymentSummary`. This screen shows: trip summary card (duration in MM:SS, distance (mock), cost breakdown: base fare €0.50 + per-minute charge), a saved payment method row (Visa ending 4242, mock), and a primary "Confirm & Pay" button. No back button — force-forward only.
- **D-09:** "Confirm & Pay" calls `paymentService.processPayment()` (stub: await delay(1500)), shows an `ActivityIndicator` during processing, then navigates to `RideReceipt`.
- **D-10:** Create `src/services/paymentService.ts` (same pattern). Interface: `processPayment(summary: RideSummary): Promise<PaymentResult>`. Type: `PaymentResult { id: string; amount: number; method: string; timestamp: string }`. Singleton exported as `paymentService`.

### Ride Receipt Screen
- **D-11:** Shows: large Electric Green checkmark (`check-circle`, size 80), "Payment confirmed!" heading (28px/700), cost total prominently (e.g., "€1.24"), cost breakdown rows (base fare / per-minute / total), bike name and ride duration in secondary text, and a `PrimaryButton` labelled "Done" that calls `navigation.getParent()?.goBack()` to dismiss the entire RideStack back to the map.
- **D-12:** After RideReceipt renders, the completed ride is added to the mock ride history in `rideService` (stored in an in-memory array — resets on app restart, acceptable for this phase).

### Account Tab Additions
- **D-13:** `AccountScreen.tsx` gains two new tappable rows above the Log Out row: "Ride History" (navigates to a new `RideHistoryScreen`) and "Payment Methods" (navigates to a new `PaymentMethodsScreen`). Use the same row pattern as the existing Log Out row (TouchableOpacity, chevron-right icon, DSColors).
- **D-14:** These new screens live in `src/screens/app/` and are accessed via the Account tab's navigation. Since AppTabs uses bottom-tab navigation (no stack), the Account tab needs a wrapping stack navigator (`AccountStack`) to enable push navigation to sub-screens. Create `AccountNavigator.tsx` with screens: `AccountMain` (current AccountScreen) and sub-screens `RideHistory`, `PaymentMethods`. Update `AppTabs` to use `AccountNavigator` instead of `AccountScreen` directly.
- **D-15:** `RideHistoryScreen`: List of past rides from `rideService.getRideHistory()`. Each row: date (e.g., "Aug 18"), bike name, duration, cost. FlatList. Empty state: "No rides yet — your completed rides will appear here." (no rides until first ride completes in the app session).
- **D-16:** `PaymentMethodsScreen`: Shows one mock saved card row (Visa •••• 4242, card icon). An "Add Payment Method" row at the bottom (stub: shows a Toast/Snackbar "Payment method management coming soon"). Phase 4 scope is viewing the existing method — not a real card entry form.

### Claude's Discretion
- Exact live cost formula: `(elapsedSeconds / 60) * bike.pricePerMin` — round to 2 decimal places
- Mock distance in RideSummary (e.g., 1.2 km static or derived from elapsed time)
- Map region during active ride: center on mock user location (same Amsterdam coords as Phase 2 mock)
- User location marker style on ActiveRide map (distinct from bike pins — e.g., blue or white filled circle with DS border)
- Exact spacing/card styling of PaymentSummary and RideReceipt screens
- AccountStack navigator header style (headerShown: false for AccountMain, shown with back button for sub-screens)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning
- `.planning/PROJECT.md` — Project context, constraints, core value, tech stack decisions
- `.planning/REQUIREMENTS.md` — v1 requirements; RIDE-01 through RIDE-04 and PAY-01 through PAY-04 are in scope for this phase
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria

### Prior Phase Context
- `.planning/phases/03-booking-and-unlock/03-CONTEXT.md` — Phase 3 decisions (BookingStack pattern, service pattern, StyleSheet.create convention)
- `.planning/phases/03-booking-and-unlock/03-01-SUMMARY.md` — BookingStack, bookingService, navigation types established in Phase 3

### Existing Codebase — Navigation
- `VoltVenture/src/types/navigation.ts` — Current nav types (add RideStackParamList + update RootStackParamList; add AccountStackParamList + update AppTabParamList)
- `VoltVenture/src/navigation/RootNavigator.tsx` — Add RideStack with modal presentation (same as BookingStack)
- `VoltVenture/src/navigation/AppTabs.tsx` — Account tab currently uses AccountScreen directly; Phase 4 wraps it in AccountNavigator
- `VoltVenture/src/navigation/BookingNavigator.tsx` — Mirror this pattern for RideNavigator.tsx and AccountNavigator.tsx

### Existing Codebase — Integration Points
- `VoltVenture/src/screens/booking/UnlockSuccessScreen.tsx` — "Start Ride" CTA currently calls `navigation.getParent()?.goBack()` — Phase 4 replaces this with navigate to RideStack
- `VoltVenture/src/screens/app/AccountScreen.tsx` — Add Ride History and Payment Methods rows; AccountScreen becomes AccountMain within AccountStack
- `VoltVenture/src/screens/app/MapScreen.tsx` — Map patterns for ActiveRide screen (MapView, mock location)

### Existing Codebase — Services & Types
- `VoltVenture/src/services/bookingService.ts` — Mirror this exact pattern for rideService.ts and paymentService.ts
- `VoltVenture/src/services/bikeService.ts` — Pattern reference (interface + delay + mockXxx + export singleton)
- `VoltVenture/src/types/bike.ts` — Bike interface (passed as route param to ActiveRide)
- `VoltVenture/src/types/booking.ts` — Mirror this pattern for ride.ts and payment.ts types

### Existing Codebase — UI Patterns
- `VoltVenture/src/theme/theme.ts` — DSColors (primary #C6FF2D, background #FFFFFF, textPrimary #0F0F0F, textSecondary #808080, destructive, surface, border), DSTypography
- `VoltVenture/src/components/common/PrimaryButton.tsx` — Use for "Confirm & Pay", "Done" CTAs
- `VoltVenture/src/screens/booking/BookingConfirmationScreen.tsx` — setInterval countdown pattern (apply same to count-UP timer in ActiveRide)
- `VoltVenture/src/screens/booking/UnlockSuccessScreen.tsx` — check-circle receipt pattern (mirror for RideReceiptScreen)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PrimaryButton` (`src/components/common/PrimaryButton.tsx`) — primary CTAs: "Confirm & Pay", "Done"
- `DSColors`, `DSTypography` from `src/theme/theme.ts` — same import pattern across all screens
- `MaterialCommunityIcons` — `check-circle` (receipt), `credit-card` (payment methods), `history` (ride history), `battery` (active ride), `map-marker` (location)
- `react-native-maps` `MapView` — already installed; reuse for ActiveRide full-screen map
- `bookingService.ts` / `bikeService.ts` — mirror exactly for `rideService.ts` and `paymentService.ts`
- `BookingNavigator.tsx` — mirror for `RideNavigator.tsx` and `AccountNavigator.tsx`
- setInterval countdown pattern from `BookingConfirmationScreen.tsx` — count UP instead of down for ride timer
- `AccountScreen.tsx` — row pattern (TouchableOpacity + text + chevron) for adding Ride History and Payment Methods rows

### Established Patterns
- **StyleSheet.create with DSColors/DSTypography** — no NativeWind on ride/payment/account screens
- **Service pattern** — interface + const delay + mockXxxService + export const xxxService
- **Modal stack** — RideStack follows BookingStack's `presentation: 'modal'` pattern in RootNavigator
- **useCallback / useMemo** for handlers and computed values
- **useSafeAreaInsets** for safe area padding on full-screen screens

### Integration Points
- `UnlockSuccessScreen.tsx` line 45 — replace `navigation.getParent()?.goBack()` with `navigation.getParent<any>()?.navigate('RideStack', { screen: 'ActiveRide', params: { bike } })`
- `navigation.ts` — add `RideStackParamList` (ActiveRide, PaymentSummary, RideReceipt), `AccountStackParamList` (AccountMain, RideHistory, PaymentMethods), update `RootStackParamList` and `AppTabParamList`
- `RootNavigator.tsx` — add `<Stack.Screen name="RideStack" component={RideNavigator} options={{ presentation: 'modal', headerShown: false }} />`
- `AppTabs.tsx` — change Account tab from `component={AccountScreen}` to `component={AccountNavigator}`

</code_context>

<specifics>
## Specific Ideas

- ActiveRide overlay card: dark semi-transparent (`rgba(15,15,15,0.85)`) panel at the top of the screen; timer in Electric Green (large, ~32px/700) to feel urgent/live; cost in white below; battery icon + % on the right edge
- "End Ride" button: red (`#E53935`), full-width, bottom-pinned — visually distinct from the green PrimaryButton so there's no confusion between "pay" and "end ride"
- PaymentSummary: clean white card layout with a horizontal separator between trip summary and payment method — similar to a standard checkout screen
- RideReceipt: mirrors UnlockSuccess layout (centered checkmark, large total amount, breakdown rows below) — familiar success-screen pattern

</specifics>

<deferred>
## Deferred Ideas

- Real GPS location tracking during ride — v2 / backend integration (Phase 4 uses mock coords)
- Real payment processing (Stripe/Adyen integration) — backend integration phase
- Real bike battery telemetry during ride — backend integration phase
- Ride rating / review after receipt — v2 (REQUIREMENTS.md deferred section)
- Push notification on ride end / payment confirmation — v2
- Multi-currency support — v2

</deferred>

---

*Phase: 4-Active-Ride-and-Payment*
*Context gathered: 2026-08-18*
