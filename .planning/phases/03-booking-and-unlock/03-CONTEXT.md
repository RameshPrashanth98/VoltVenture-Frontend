# Phase 3: Booking & Unlock - Context

**Gathered:** 2026-08-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the complete path from tapping "Reserve" on a bike to having it physically unlocked and ready to ride. This phase adds a modal BookingStack (BookingConfirmation → QRScanner or BLEUnlock → UnlockSuccess) on top of the existing AppTabs. All booking and unlock behaviour is mocked — no real API, no real Bluetooth hardware. Phase ends at the "Start Ride" CTA on the UnlockSuccess screen; the active ride screen is Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Navigation Architecture
- **D-01:** A new `BookingStack` is added to `RootStackParamList` with **modal presentation** (slides up over AppTabs). Screens in the stack: `BookingConfirmation`, `QRScanner`, `UnlockSuccess`. The BikeDetailSheet Reserve button dismisses the bottom sheet and navigates to `BookingConfirmation`, passing the selected Bike as a route param.
- **D-02:** User exits the booking flow via an **X / close button** on `BookingConfirmation`. If the reservation expires or the user cancels, the BookingStack is dismissed and the user lands back on the map.

### Booking Confirmation Screen
- **D-03:** The screen shows **full bike details**: bike name, type, battery %, price/min. Plus a **static location card** (no live map — a MapView snapshot or a simple address text with a pin icon) showing the bike's pickup location, and a short pickup instructions text block.
- **D-04:** A **countdown timer** shows "Bike held for MM:SS" starting from 10:00 (mock duration). When it reaches 0:00, the booking auto-cancels: show a "Reservation expired" message (snackbar or alert), then dismiss the BookingStack back to the map.
- **D-05:** **Two unlock CTAs** are shown below the bike details — a primary `PrimaryButton` labelled "Scan QR Code" and a secondary outlined button labelled "Unlock via Bluetooth". Both are equally prominent choices — no fallback hierarchy.

### QR Scanner Screen
- **D-06:** Uses **expo-camera** (SDK 57 compatible). Camera permission is requested on mount; if denied, show a permission-denied message with a link to Settings.
- **D-07:** **Full-screen camera** with a centred square viewfinder overlay. Corner brackets rendered in Electric Green (#C6FF2D). Instruction text below the viewfinder: "Point at the bike's QR code". X button in the top-left to close and return to BookingConfirmation.
- **D-08:** Any valid QR code scan is treated as a successful unlock (no validation of QR content in this phase). On scan detected → navigate to UnlockSuccess.

### Bluetooth Unlock Screen
- **D-09:** **No BLE library installed.** The screen is a pure mock with three auto-advancing UI states:
  1. **Scanning** — spinner + "Looking for nearby bikes…" (1.5 s)
  2. **Found** — bike name displayed + "Bike found" (1.0 s)
  3. **Connecting** — "Unlocking…" (1.0 s)
  After Connecting, auto-navigate to UnlockSuccess. A "Cancel" text button is shown throughout to return to BookingConfirmation.

### Unlock Success Screen
- **D-10:** Shows a large Electric Green checkmark icon (MaterialCommunityIcons `check-circle`), "Bike unlocked!" heading, the bike name below it, and a `PrimaryButton` labelled "Start Ride". Tapping "Start Ride" is a **Phase 4 stub** — for now it pops the BookingStack back to the map (Phase 4 will replace this with navigation to the ActiveRide screen).

### Mock Service
- **D-11:** Create a `bookingService.ts` (mirrors authService/bikeService pattern: interface + delay + mockBookingService + export singleton). Methods: `reserveBike(bikeId): Promise<Booking>` (returns a mock Booking object with id, bikeId, expiresAt). No real API calls.

### Claude's Discretion
- Exact styling of the static location card on BookingConfirmation (address text + pin icon is sufficient; no MapView needed)
- Snackbar vs Alert for "Reservation expired" notification
- Countdown timer implementation (setInterval in useEffect, clearInterval on unmount)
- BLE mock timing (1.5 / 1.0 / 1.0 s per state — adjust if feel is off)
- UnlockSuccess checkmark animation style (static icon is acceptable; a simple fade-in is fine)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning
- `.planning/PROJECT.md` — Project context, constraints, core value, tech stack decisions
- `.planning/REQUIREMENTS.md` — v1 requirements; BOOK-01 through BOOK-04 are in scope for this phase
- `.planning/ROADMAP.md` — Phase 3 goal and success criteria

### Prior Phase Context
- `.planning/phases/02-bike-discovery/02-CONTEXT.md` — Phase 2 decisions (StyleSheet.create convention, no NativeWind on map/complex screens, BikeMarker, bikeService pattern, BottomSheetModal setup)
- `.planning/phases/02-bike-discovery/02-01-SUMMARY.md` — Installed packages and key decisions from Phase 2 Wave 1 (BottomSheetModalProvider placement, absoluteFill vs absoluteFillObject fix)

### Existing Codebase — Navigation
- `VoltVenture/src/types/navigation.ts` — Current nav types (needs BookingStackParamList added)
- `VoltVenture/src/navigation/RootNavigator.tsx` — Root stack (needs BookingStack added with modal presentation)
- `VoltVenture/src/navigation/AppTabs.tsx` — AppTabs (unchanged in Phase 3)

### Existing Codebase — Integration Points
- `VoltVenture/src/components/map/BikeDetailSheet.tsx` — Reserve button currently has `console.log('TODO Phase 3')` — Phase 3 replaces this with navigation to BookingConfirmation
- `VoltVenture/src/services/bikeService.ts` — Bike data and BikeService interface (mirror for bookingService.ts)
- `VoltVenture/src/services/authService.ts` — Service pattern to mirror exactly
- `VoltVenture/src/theme/theme.ts` — DSColors, DSTypography tokens (all new screens use these)
- `VoltVenture/src/components/common/PrimaryButton.tsx` — Reuse for "Scan QR Code", "Start Ride" CTAs

### Libraries
- Expo SDK 57 docs: https://docs.expo.dev/versions/v57.0.0/ — verify expo-camera API for SDK 57
- expo-camera — QR/barcode scanning (install via `npx expo install expo-camera`)
- React Native Paper: https://callstack.github.io/react-native-paper/ — Snackbar (for expiry notification), Button (outlined variant for secondary CTA)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PrimaryButton` (`src/components/common/PrimaryButton.tsx`) — use for "Scan QR Code" (primary, full-width) and "Start Ride" on UnlockSuccess
- `DSColors`, `DSTypography` from `src/theme/theme.ts` — same import pattern as all Phase 2 screens
- `MaterialCommunityIcons` (`@expo/vector-icons`) — already installed; use `check-circle` for success, `bluetooth` for BLE screen
- `bikeService.ts` — mirror its pattern exactly for `bookingService.ts`
- `Bike` type from `src/types/bike.ts` — pass selectedBike as route param to BookingConfirmation

### Established Patterns
- **StyleSheet.create with DSColors** — no NativeWind on booking/unlock screens (same rule as Phase 2 map screens)
- **Service pattern** — interface + const delay + mockXxxService + export const xxxService
- **useCallback / useMemo** — use for handlers and computed values (established across Phase 2 screens)
- **No SafeAreaView on full-screen screens** — use insets or StyleSheet.absoluteFill where needed (QRScanner is full-screen camera)

### Integration Points
- `BikeDetailSheet.tsx` line with `console.log('TODO Phase 3: navigate to booking')` — replace with `navigation.navigate('BookingStack', { screen: 'BookingConfirmation', params: { bike } })` or equivalent
- `navigation.ts` — add `BookingStackParamList` and update `RootStackParamList`
- `RootNavigator.tsx` — add `<Stack.Screen name="BookingStack" component={BookingNavigator} options={{ presentation: 'modal' }} />`

</code_context>

<specifics>
## Specific Ideas

- QR viewfinder: square bracket corners in Electric Green, similar to a standard scanning UI; no rounded-rect overlay fill — keep camera fully visible inside the brackets
- BLE screen: use `ActivityIndicator` (react-native-paper or React Native) for the spinner during Scanning and Connecting states
- CountdownTimer: a pure `setInterval` hook in BookingConfirmation — clear on unmount; when it reaches 0 dismiss the stack
- "Unlock via Bluetooth" should be a visually distinct secondary button (outlined, not contained) so "Scan QR Code" reads as the primary action even though both are offered

</specifics>

<deferred>
## Deferred Ideas

- Real Bluetooth unlock with hardware pairing — Phase 3 intent is met by the mock; real BLE is a v2 or backend-integration concern
- QR code content validation (checking the code belongs to the booked bike) — backend integration phase
- Booking modification / cancellation API — backend integration phase
- Push notification when bike is unlocked — v2

</deferred>

---

*Phase: 3-Booking-and-Unlock*
*Context gathered: 2026-08-17*
