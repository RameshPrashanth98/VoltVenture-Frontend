# VoltVenture v1.2 — Requirements

**Milestone:** Android UAT
**Goal:** Verify all frontend screens work correctly on Android emulator; fix every failing requirement before backend integration begins.
**Date:** 2026-08-20

---

## Requirements

### Setup & Infrastructure

- [ ] **SETUP-01**: App launches on Android emulator (API 33+) without crashes or startup errors
- [ ] **SETUP-02**: All navigation tabs load correctly (Map, Discover, Account) and tab switching works

### Authentication (verifies AUTH-01–AUTH-05)

- [ ] **UAT-01**: All authentication screens render and function correctly on emulator — sign up, login, forgot password, social auth buttons, and session persistence after restart

### Bike Discovery (verifies DISC-01–DISC-04)

- [ ] **UAT-02**: Map-based bike discovery renders correctly — map loads with bike markers, bottom sheet detail, filter chips, and list view toggle all work

### Booking & Unlock (verifies BOOK-01–BOOK-04)

- [ ] **UAT-03**: Booking and unlock flows work end-to-end — reservation, 10-minute countdown timer, QR scanner screen, and BLE mock unlock all function correctly

### Active Ride (verifies RIDE-01–RIDE-07)

- [ ] **UAT-04**: Active ride experience works — full-screen map with overlay timer/cost/battery, safety mount screen, charging station finder, and ride-to-charger navigation all render correctly

### Payments (verifies PAY-01–PAY-06)

- [ ] **UAT-05**: Payment screens work — checkout, payment method selection, add card form (last4 stored), and ride receipt all render and function correctly

### Profile & Account (verifies PROF-01–PROF-04, HIST-01)

- [ ] **UAT-06**: Profile and account screens work — profile view/edit, settings, notification preferences, and ride history statistics all render correctly

### Security & Verification (verifies SEC-01–SEC-04)

- [ ] **UAT-07**: Security screens work — login security hub, ID scan flow, facial scan flow, and security deposit screen all render and function correctly

### Navigation Extras (verifies NAV-01–NAV-02)

- [ ] **UAT-08**: Navigation screens work — navigate-to-bike map and walking directions step list both render correctly

### Rewards (verifies REW-01)

- [ ] **UAT-09**: VoltCoins & Rewards screen works — balance display, earn history, and rewards catalog all render correctly

### Discovery & Content (verifies DISC-05–DISC-07, CONT-01–CONT-03)

- [ ] **UAT-10**: Discovery and content screens work — café markers/detail sheet, curated routes, VIP hubs, support FAQ, privacy policy, and terms of service all render correctly

### Bug Fixes

- [ ] **FIX-01**: All requirements that failed UAT pass are resolved and re-verified before milestone close

---

## Future Requirements (v3.0 Backend Integration)

- Real backend API integration (auth, bikes, bookings, rides, payments)
- Real Google/Apple OAuth
- Real BLE unlock (native BLE library)
- Real payment processing (Stripe or equivalent)
- Push notifications

---

## Out of Scope (v1.2)

- Backend/API integration — frontend-only milestone; all services remain mocked
- Real camera/biometric — IdScan and FacialScan remain mock flows (no OCR, no liveness)
- Real routing — navigation screens use static mock data
- Performance optimization — functional correctness only
- Fleet/operator dashboard — separate product
- Web version — mobile-first only
- Localization — deferred

---

## Traceability

| REQ-ID   | Phase | Plan |
|----------|-------|------|
| SETUP-01 | 10    | 10.3 |
| SETUP-02 | 10    | 10.3 |
| UAT-01   | 11    | —    |
| UAT-02   | 11    | —    |
| UAT-03   | 11    | —    |
| UAT-04   | 12    | —    |
| UAT-05   | 12    | —    |
| UAT-06   | 12    | —    |
| UAT-07   | 12    | —    |
| UAT-08   | 13    | —    |
| UAT-09   | 13    | —    |
| UAT-10   | 13    | —    |
| FIX-01   | 13    | —    |
