# Phase 8: Payments & Rewards - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-19
**Phase:** 08-payments-and-rewards
**Areas discussed:** Card save behavior, SelectPaymentMethod entry point, RideHistoryStats placement, VoltCoins earn model

---

## Card Save Behavior

### Q1: What happens when user taps Save on AddPaymentMethod?

| Option | Description | Selected |
|--------|-------------|----------|
| In-memory card list | Card added to paymentService array; appears in PaymentMethods and SelectPaymentMethod | ✓ |
| Snackbar ack only | "Card saved" Snackbar, no state change; Visa 4242 stays as only mock card | |
| Replace Visa 4242 | Saved card replaces the hardcoded card — only one card at a time | |

**User's choice:** In-memory card list

---

### Q2: Should there be a default card concept?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, with a default marker | Visa 4242 starts as default; newly added cards can be set as default from SelectPaymentMethod | ✓ |
| No default, always prompt | No pre-selected card — SelectPaymentMethod always requires user to pick | |
| Last added = default | Saving a new card automatically makes it the default | |

**User's choice:** Yes, with a default marker

---

### Q3: Should AddPaymentMethod validate card fields?

| Option | Description | Selected |
|--------|-------------|----------|
| Basic format validation | 16-digit card number, MM/YY expiry, 3-4 digit CVV, non-empty name; inline error text | ✓ |
| Non-empty only | Just check all fields have some value | |
| No validation | Save always enabled; accepts anything | |

**User's choice:** Basic format validation

---

## SelectPaymentMethod Entry Point

### Q1: Where is SelectPaymentMethod triggered?

| Option | Description | Selected |
|--------|-------------|----------|
| From PaymentSummaryScreen | "Change" link next to payment method row; user picks card, returns to summary | ✓ |
| From PaymentMethods in AccountStack only | Only reachable from account settings as a "Set default" sub-screen | |
| Both | Accessible from checkout AND account settings | |

**User's choice:** From PaymentSummaryScreen

---

### Q2: How does SelectPaymentMethod fit into navigation?

| Option | Description | Selected |
|--------|-------------|----------|
| Push onto RideStack | New screen in RideStackParamList; PaymentSummary pushes it | ✓ |
| Modal from RootNavigator | New PayStack modal (like BookingStack/RideStack) | |
| Sheet / bottom drawer | In-place bottom sheet on PaymentSummaryScreen | |

**User's choice:** Push onto RideStack

---

### Q3: How is selection communicated back to PaymentSummaryScreen?

| Option | Description | Selected |
|--------|-------------|----------|
| Update default in paymentService, pop back | setDefault(cardId) + goBack(); PaymentSummary re-reads on focus | ✓ |
| Route params callback | Navigate back with selected card id as params | |
| Shared React context | New PaymentContext holds selected card | |

**User's choice:** Update default in paymentService, pop back

---

## RideHistoryStats Placement

### Q1: Where does the stats screen/section live?

| Option | Description | Selected |
|--------|-------------|----------|
| Stats header in RideHistoryScreen | Stats summary card at top of existing screen; no new route | ✓ |
| Separate RideHistoryStats screen | New AccountStack route, accessible from "View Stats" CTA | |
| Stats tab inside RideHistoryScreen | 2-tab toggle: "Rides" list / "Stats" aggregate | |

**User's choice:** Stats header in RideHistoryScreen

---

### Q2: Stats section when ride history is empty?

| Option | Description | Selected |
|--------|-------------|----------|
| Show zeroed stats | Always visible: "0 rides · 0.0 km · €0.00 · 0 kg CO2" | ✓ |
| Hide stats section | Only appears when ≥1 ride exists | |
| Show only when ≥2 rides | Threshold: 2+ rides before showing header | |

**User's choice:** Show zeroed stats

---

### Q3: CO2 savings calculation?

| Option | Description | Selected |
|--------|-------------|----------|
| Formula from distanceKm | CO2 = distanceKm × 0.21 kg (avg car emission factor) | ✓ |
| Static mock value | Hardcode placeholder e.g. "2.4 kg CO2 saved" | |
| Let Claude decide | Claude picks a reasonable formula | |

**User's choice:** Formula from distanceKm (0.21 kg CO2/km)

---

## VoltCoins Earn Model

### Q1: How does VoltCoins balance accumulate?

| Option | Description | Selected |
|--------|-------------|----------|
| Spend-based: 10 coins per €1 | Coins = sum(costEur × 10) across all rides | ✓ |
| Fixed per ride: 50 coins/ride | Each completed ride earns 50 coins regardless of cost | |
| Static mock balance | Hardcode a balance; no live accumulation | |

**User's choice:** Spend-based: 10 coins per €1 spent

---

### Q2: Available Rewards section?

| Option | Description | Selected |
|--------|-------------|----------|
| Static rewards list | 3-4 hardcoded reward cards with "Redeem" CTA → Snackbar "coming soon" | ✓ |
| Dynamic based on balance | Same static list but affordable rewards highlighted | |
| Empty state only | Just balance + earn history; no rewards catalog | |

**User's choice:** Static rewards list

---

### Q3: Where does VoltCoinsRewards live in navigation?

| Option | Description | Selected |
|--------|-------------|----------|
| AccountStack route + AccountScreen row | New menu row on AccountScreen between Payment Methods and Settings | ✓ |
| AccountStack only, no AccountScreen row | Route exists but no entry point on AccountScreen yet | |
| Standalone tab | New bottom tab in AppTabs | |

**User's choice:** AccountStack route + AccountScreen row

---

### Q4: What does the earn history list show?

| Option | Description | Selected |
|--------|-------------|----------|
| One row per ride from rideService | Bike name + date left, "+{coins} VoltCoins" right; computed from rideHistory | ✓ |
| Static mock earn events | 3-5 hardcoded history entries | |
| No earn history | Just balance + rewards; skip history list | |

**User's choice:** One row per ride from rideService

---

## Claude's Discretion

- Stats header layout (2×2 grid vs horizontal 4-column row)
- Icon choices for stat tiles
- VoltCoins balance display visual styling
- Reward card names and coin costs
- SelectPaymentMethod default indicator (radio vs checkmark)
- Exact "Change" link copy in PaymentSummaryScreen
- Card number and expiry auto-formatting behavior

## Deferred Ideas

None — discussion stayed within phase scope.
