# Phase 4: Active Ride & Payment — Discussion Log

**Date:** 2026-08-18
**Mode:** auto (gsd-autonomous — all decisions auto-selected)

## Areas Discussed

### 1. Active Ride Screen Layout
- **Q:** How should the timer/cost be displayed during the ride?
- **Selected:** Full-screen map with floating top overlay card (dark semi-transparent) showing timer, cost, battery
- **Rationale:** Standard e-bike app pattern (Lime, Bird); map stays visible so tourist knows their location; Electric Green timer creates urgency

### 2. Navigation Architecture
- **Q:** How does "Start Ride" navigate from BookingStack to ActiveRide?
- **Selected:** New `RideStack` modal in `RootStackParamList`; `UnlockSuccessScreen` "Start Ride" navigates to it via `getParent()?.navigate('RideStack', ...)`
- **Rationale:** Consistent with BookingStack pattern; isolates ride flow; dismisses BookingStack cleanly

### 3. Payment Flow Structure
- **Q:** How many screens in the payment flow? Is there a confirmation step?
- **Selected:** PaymentSummary (trip summary + mock saved card + "Confirm & Pay") → RideReceipt (success + breakdown + "Done")
- **Rationale:** Two-screen flow is standard checkout UX; prevents accidental payments; matches PAY-01 and PAY-03 requirements

### 4. Account Tab Additions
- **Q:** Where do payment methods and ride history live?
- **Selected:** AccountScreen adds two rows (Ride History, Payment Methods) navigating to sub-screens via a new AccountNavigator stack
- **Rationale:** Keeps navigation discoverable within existing Account tab; AccountStack wrapping is the clean React Navigation pattern for tab → push flows

## Claude's Discretion Items

- Exact live cost formula and rounding
- Mock distance in RideSummary
- Map region and user location marker style on ActiveRide
- AccountStack header style for sub-screens

## Deferred Ideas

- Real GPS, real payment processing, real battery telemetry — backend integration phase
- Ride rating/review — v2
