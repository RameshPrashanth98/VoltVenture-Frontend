# Phase 7: Navigation & Ride Extras - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-19
**Phase:** 07-Navigation & Ride Extras
**Areas discussed:** NavigateToBike entry point, SafetyMount flow insertion, Charging screens entry point, Route visualization (mock)

---

## NavigateToBike Entry Point

### Q1: Where does "Get Directions" live on BikeDetailSheet?

| Option | Description | Selected |
|--------|-------------|----------|
| Secondary button below "Book Bike" | Keeps booking CTA dominant; familiar pattern (Airbnb, Google Maps) | ✓ |
| Icon button / link in sheet header | Less prominent; easy to miss | |
| Two equal-weight CTAs side by side | Dilutes primary booking CTA | |

**User's choice:** Secondary button below "Book Bike"

### Q2: How does NavigateToBike open?

| Option | Description | Selected |
|--------|-------------|----------|
| New NavStack modal (presentation: 'modal') | Matches BookingStack/RideStack pattern; dismissible with swipe-down | ✓ |
| Push from BikeDetailSheet inline | Muddies the tab navigator stack | |

**User's choice:** New NavStack modal

### Q3: NavigateToBike top UI?

| Option | Description | Selected |
|--------|-------------|----------|
| Floating ETA card at top | Semi-transparent dark overlay, ETA + bike name + "View Turn-by-Turn"; same as ActiveRide pattern | ✓ |
| Bottom sheet with ETA + directions button | More complex; bottom sheet over map | |

**User's choice:** Floating ETA card at top

### Q4: WalkingDirections content?

| Option | Description | Selected |
|--------|-------------|----------|
| Mock hardcoded steps list | 3–5 fake turn-by-turn steps, FlatList with direction icons | ✓ |
| Dynamic ETA-only screen | Just big walking icon + ETA; doesn't satisfy ROADMAP step-list criterion | |

**User's choice:** Mock hardcoded steps list

---

## SafetyMount Flow Insertion

### Q1: Where does SafetyMount insert?

| Option | Description | Selected |
|--------|-------------|----------|
| Inside RideStack: before ActiveRide | RideStack: SafetyMount → ActiveRide → PaymentSummary → RideReceipt | ✓ |
| Inside BookingStack: after UnlockSuccess | Out of place — BookingStack is about booking/unlocking | |
| Standalone modal before RideStack | More complex layering; three modal stacks | |

**User's choice:** Inside RideStack, before ActiveRide

### Q2: SafetyMount checklist interaction?

| Option | Description | Selected |
|--------|-------------|----------|
| Checkboxes — all must be ticked to enable "Start Ride" | 4–5 items; "Start Ride" disabled until all checked | ✓ |
| Static instructions, single confirm button | No interaction; just a "I Understand" CTA | |

**User's choice:** Interactive checkboxes, disabled CTA until all checked

---

## Charging Screens Entry Point

### Q1: How does user reach EndRideFindCharging?

| Option | Description | Selected |
|--------|-------------|----------|
| RideReceipt secondary "Find a Charging Station" CTA | Below "Done"; dismisses RideStack, opens ChargeStack modal | ✓ |
| Automatic prompt after RideReceipt "Done" | Snackbar/bottom sheet on map after dismiss; easy to miss | |
| Charging tab or map filter | Adds complexity to MapScreen; scope creep | |

**User's choice:** Secondary CTA on RideReceipt

### Q2: EndRideFindCharging layout?

| Option | Description | Selected |
|--------|-------------|----------|
| Map with charging station pins | MapView + bolt icon pins; tap for name/distance/"Navigate Here" | ✓ |
| List of nearby chargers | No map; doesn't meet ROADMAP "on a map" criterion | |

**User's choice:** Map with charger pins

### Q3: RidingToCharging vs NavigateToBike?

| Option | Description | Selected |
|--------|-------------|----------|
| Same pattern, different context | Reuse floating ETA card + polyline; no new components | ✓ |
| Charger-specific UI (port availability, charge time) | Extra complexity beyond phase scope | |

**User's choice:** Same pattern as NavigateToBike, different destination

---

## Route Visualization (Mock)

### Q1: Polyline approach?

| Option | Description | Selected |
|--------|-------------|----------|
| Mock waypoint polyline (3–4 manual bends) | Looks like a real walking route; just an array of coords to `<Polyline>` | ✓ |
| Straight-line Polyline | Honest but looks unrealistic (walks through buildings) | |
| No polyline — just markers + ETA | Doesn't meet ROADMAP "route polyline" criterion | |

**User's choice:** Mock waypoint polyline

### Q2: ETA formula?

| Option | Description | Selected |
|--------|-------------|----------|
| Haversine ÷ 5 km/h walk speed | Deterministic; reuses haversineKm already in MapScreen.tsx | ✓ |
| Hardcoded mock ETA per destination | Simpler but ETA won't match visible map distance | |

**User's choice:** Haversine formula

### Q3: Polyline style?

| Option | Description | Selected |
|--------|-------------|----------|
| Electric Green (#C6FF2D), strokeWidth 4 | On-brand; matches DS primary color | ✓ |
| White (#FFFFFF), strokeWidth 3 | Off-brand | |
| Blue (#2196F3), strokeWidth 4 | Conventional but inconsistent with DS | |

**User's choice:** Electric Green, strokeWidth 4

---

## Claude's Discretion

- Exact mock waypoint coordinates for routes
- MaterialCommunityIcons icon for charger pins
- Whether NavStack and ChargeStack are two separate stacks or one combined ExtraStack
- Direction icons for WalkingDirections step types

## Deferred Ideas

None — discussion stayed within phase scope.
