# VoltVenture — Roadmap

## Milestones

- **v1.0 MVP** — Phases 1-4 (shipped 2026-08-18)
- **v1.1 Complete Frontend** — Phases 5-9 (in progress)

---

## Phases

<details>
<summary>v1.0 MVP (Phases 1-4) — SHIPPED 2026-08-18</summary>

- [x] Phase 1: Foundation & Authentication (6 plans) — completed 2026-08-18
- [x] Phase 2: Bike Discovery (4 plans) — completed 2026-08-18
- [x] Phase 3: Booking & Unlock (3 plans) — completed 2026-08-18
- [x] Phase 4: Active Ride & Payment (3 plans) — completed 2026-08-18

See full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### v1.1 Complete Frontend (In Progress)

---

### Phase 5: Account & Profile

**Goal:** User can view and edit their profile, manage app settings, and configure notification preferences.
**Mode:** mvp
**Requirements:** PROF-01, PROF-02, PROF-03, PROF-04
**Plans:** 3 plans

Plans:
- [ ] 05-01-PLAN.md — Profile screen slice: packages + userService + ProfileContext + navigation types + AccountNavigator extension + AccountScreen header + ProfileScreen
- [ ] 05-02-PLAN.md — Edit Profile screen slice: EditProfileScreen with expo-image-picker and name editing
- [ ] 05-03-PLAN.md — Settings + Preferences screens slice: SettingsScreen (AsyncStorage units/map/language) + PreferencesScreen (AsyncStorage notification toggles)

**Success Criteria:**
1. User can tap their avatar/name in the Account tab to open a Profile screen
2. User can edit their display name and pick a profile photo (mock)
3. User can change app settings (distance units, map style, language preference)
4. User can toggle notification categories on/off

---

### Phase 6: Security & Verification

**Goal:** User can access security settings, complete identity and biometric verification flows, and view their security deposit.
**Mode:** mvp
**Requirements:** SEC-01, SEC-02, SEC-03, SEC-04
**Plans:** TBD

Plans:
- [ ] 06-01-PLAN.md — LoginSecurity screen (2FA toggle, active session list)
- [ ] 06-02-PLAN.md — IdScan screen (camera-based document scan, mock OCR result)
- [ ] 06-03-PLAN.md — FacialScan screen (camera-based liveness mock) + SecurityDeposit screen (status card, refund CTA)

**Success Criteria:**
1. User can enable/disable two-factor authentication from settings
2. User can scan an ID document and see a mock verified result
3. User can complete a facial scan flow and see a biometric confirmed screen
4. User can view their security deposit amount and estimated refund date

---

### Phase 7: Navigation & Ride Extras

**Goal:** User can navigate to a selected bike on foot, see safety instructions before mounting, and locate charging stations during and after a ride.
**Mode:** mvp
**Requirements:** NAV-01, NAV-02, RIDE-05, RIDE-06, RIDE-07
**Plans:** TBD

Plans:
- [ ] 07-01-PLAN.md — NavigateToBike screen (map + route polyline + ETA) + WalkingDirections screen (step-by-step list)
- [ ] 07-02-PLAN.md — SafetyMount screen (safety checklist before ride start)
- [ ] 07-03-PLAN.md — EndRideFindCharging screen (nearby charger pins) + RidingToCharging screen (map + nav to charger)

**Success Criteria:**
1. Tapping "Get Directions" on a bike opens a map showing the walking route and ETA
2. User can view turn-by-turn walking directions to the bike
3. Before starting a ride, user sees a safety checklist and confirms readiness
4. After ending a ride, user can see nearby charging stations on a map
5. User can navigate to a charging station with a live map route

---

### Phase 8: Payments & Rewards

**Goal:** User can add a payment method, select a payment method at checkout, view their VoltCoins rewards balance, and see aggregate ride statistics.
**Mode:** mvp
**Requirements:** PAY-05, PAY-06, REW-01, HIST-01
**Plans:** TBD

Plans:
- [ ] 08-01-PLAN.md — AddPaymentMethod screen (card form with number/expiry/CVV) + SelectPaymentMethod screen (list with radio selection)
- [ ] 08-02-PLAN.md — VoltCoinsRewards screen (balance, earn history list, available rewards)
- [ ] 08-03-PLAN.md — RideHistoryStats screen (total rides, distance, spend, CO2 saved)

**Success Criteria:**
1. User can enter card details on an Add Payment Method screen (mock save)
2. User can select from saved payment methods before checkout
3. User can view their VoltCoins balance and a list of past earn events
4. User can see aggregate ride stats: total rides, km ridden, total spend, CO2 saved

---

### Phase 9: Discovery & Content

**Goal:** User can explore nearby cafés and POIs, browse curated e-bike routes, discover VIP hubs, and access support and legal content.
**Mode:** mvp
**Requirements:** DISC-05, DISC-06, DISC-07, CONT-01, CONT-02, CONT-03
**Plans:** TBD

Plans:
- [ ] 09-01-PLAN.md — CafeDetail screen (photo header, name, hours, distance, "Get Directions" CTA)
- [ ] 09-02-PLAN.md — CuratedRoutes screen (route cards with distance/difficulty/highlights) + DiscoverVipHubs screen (hub cards on map + list)
- [ ] 09-03-PLAN.md — Support screen (FAQ accordion + contact CTA) + PrivacyPolicy screen (scrollable content) + TermsOfService screen (scrollable content)

**Success Criteria:**
1. Tapping a café pin on the map opens a detail sheet with name, hours, and directions
2. User can browse a list of curated e-bike routes with distance and difficulty labels
3. User can discover VIP hubs on a map and tap to see hub details
4. User can search and read FAQ articles in the support screen
5. Privacy Policy and Terms of Service are readable in-app (no external browser required)

---

## Phase Status

| # | Phase | Milestone | Plans | Status | Completed |
|---|-------|-----------|-------|--------|-----------|
| 1 | Foundation & Authentication | v1.0 | 6 | Complete | 2026-08-18 |
| 2 | Bike Discovery | v1.0 | 4 | Complete | 2026-08-18 |
| 3 | Booking & Unlock | v1.0 | 3 | Complete | 2026-08-18 |
| 4 | Active Ride & Payment | v1.0 | 3 | Complete | 2026-08-18 |
| 5 | Account & Profile | v1.1 | 3 | Not started | — |
| 6 | Security & Verification | v1.1 | 3 | Not started | — |
| 7 | Navigation & Ride Extras | v1.1 | 3 | Not started | — |
| 8 | Payments & Rewards | v1.1 | 3 | Not started | — |
| 9 | Discovery & Content | v1.1 | 3 | Not started | — |
