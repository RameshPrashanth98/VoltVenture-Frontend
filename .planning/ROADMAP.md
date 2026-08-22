# VoltVenture — Roadmap

## Milestones

- ✅ **v1.0 MVP** — Phases 1–4 (shipped 2026-08-18)
- ✅ **v1.1 Complete Frontend** — Phases 5–9 (shipped 2026-08-19)
- 🔄 **v1.2 Android UAT** — Phases 10–13 (in progress)

---

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–4) — SHIPPED 2026-08-18</summary>

- [x] Phase 1: Foundation & Authentication (6 plans) — completed 2026-08-18
- [x] Phase 2: Bike Discovery (4 plans) — completed 2026-08-18
- [x] Phase 3: Booking & Unlock (3 plans) — completed 2026-08-18
- [x] Phase 4: Active Ride & Payment (3 plans) — completed 2026-08-18

See full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v1.1 Complete Frontend (Phases 5–9) — SHIPPED 2026-08-19</summary>

- [x] Phase 5: Account & Profile (3 plans) — completed 2026-08-19
- [x] Phase 6: Security & Verification (3 plans) — completed 2026-08-19
- [x] Phase 7: Navigation & Ride Extras (3 plans) — completed 2026-08-19
- [x] Phase 8: Payments & Rewards (3 plans) — completed 2026-08-19
- [x] Phase 9: Discovery & Content (3 plans) — completed 2026-08-19

See full details: `.planning/milestones/v1.1-ROADMAP.md`

</details>

---

## Phase Status

| # | Phase | Milestone | Plans | Status | Completed |
|---|-------|-----------|-------|--------|-----------|
| 1 | Foundation & Authentication | v1.0 | 6 | Complete | 2026-08-18 |
| 2 | Bike Discovery | v1.0 | 4 | Complete | 2026-08-18 |
| 3 | Booking & Unlock | v1.0 | 3 | Complete | 2026-08-18 |
| 4 | Active Ride & Payment | v1.0 | 3 | Complete | 2026-08-18 |
| 5 | Account & Profile | v1.1 | 3 | Complete | 2026-08-19 |
| 6 | Security & Verification | v1.1 | 3 | Complete | 2026-08-19 |
| 7 | Navigation & Ride Extras | v1.1 | 3 | Complete | 2026-08-19 |
| 8 | Payments & Rewards | v1.1 | 3 | Complete | 2026-08-19 |
| 9 | Discovery & Content | v1.1 | 3 | Complete | 2026-08-19 |
| 10 | Emulator Setup & Smoke Test | v1.2 | 3 (1 of 3 done) | In Progress | — |
| 11 | Core Flow UAT | v1.2 | — | Pending | — |
| 12 | Ride & Account UAT | v1.2 | — | Pending | — |
| 13 | Extras UAT & Bug Fixes | v1.2 | — | Pending | — |

---

## v1.2 Phase Details

### Phase 10: Emulator Setup & Smoke Test

**Goal:** App launches on Android emulator (API 33+) with all tabs accessible and no startup crashes.

**Requirements:** SETUP-01, SETUP-02

**Success criteria:**
1. Android Studio emulator (API 33+) running and reachable via `adb devices`
2. `npx expo start` connects to emulator and app launches without crash
3. All 3 bottom tabs load (Map, Discover, Account) and switching works without errors
4. No red-screen errors or TypeScript runtime exceptions on startup
5. Metro bundler resolves all modules (no missing dependency errors)

---

### Phase 11: Core Flow UAT

**Goal:** Auth, discovery, and booking/unlock flows verified working on emulator.

**Requirements:** UAT-01, UAT-02, UAT-03

**Success criteria:**
1. Sign up, login, forgot password, and social auth button screens all render without crash (AUTH-01–AUTH-05)
2. Session persists after app restart
3. Map loads with bike markers, filter chips work, list view toggle works, bottom sheet opens on tap (DISC-01–DISC-04)
4. Booking modal opens, countdown timer runs, QR scanner renders, BLE mock unlock completes (BOOK-01–BOOK-04)
5. Fixes applied for any crashes/layout issues found

---

### Phase 12: Ride & Account UAT

**Goal:** Ride, payment, profile, and security flows verified working on emulator.

**Requirements:** UAT-04, UAT-05, UAT-06, UAT-07

**Success criteria:**
1. Active ride screen renders with map overlay, timer counts up, cost updates, battery displays (RIDE-01–RIDE-04)
2. Safety mount screen checklist, charging station finder, ride-to-charger navigation render (RIDE-05–RIDE-07)
3. Payment checkout, method selection, add card form, and ride receipt render correctly (PAY-01–PAY-06)
4. Profile view/edit, settings, notification preferences, and ride history stats render (PROF-01–PROF-04, HIST-01)
5. Login security hub, ID scan flow, facial scan, and security deposit screen render (SEC-01–SEC-04)
6. Fixes applied for any crashes/layout issues found

---

### Phase 13: Extras UAT & Bug Fixes

**Goal:** Nav, rewards, and discovery/content screens verified; all outstanding failures resolved and re-verified.

**Requirements:** UAT-08, UAT-09, UAT-10, FIX-01

**Success criteria:**
1. Navigate-to-bike map and walking directions step list render correctly (NAV-01–NAV-02)
2. VoltCoins balance, earn history, and rewards catalog render correctly (REW-01)
3. Café markers/detail, curated routes, VIP hubs, support FAQ, privacy policy, ToS all render (DISC-05–DISC-07, CONT-01–CONT-03)
4. All requirements that failed in Phases 11–12 resolved and re-verified green
5. All 13 REQ-IDs (SETUP-01–02, UAT-01–10, FIX-01) marked complete
6. MILESTONES.md updated with v1.2 summary
