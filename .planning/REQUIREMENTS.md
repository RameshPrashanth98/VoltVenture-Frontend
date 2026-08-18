# VoltVenture — v1.1 Requirements

## v1.1 Requirements

### Auth & Security

- [ ] **SEC-01**: User can view and manage login security settings (2FA toggle, active sessions)
- [ ] **SEC-02**: User can scan their ID document for identity verification
- [ ] **SEC-03**: User can complete a facial scan for biometric verification
- [ ] **SEC-04**: User can view and manage their security deposit status

### Payments

- [ ] **PAY-05**: User can add a new payment method (credit card or digital wallet)
- [ ] **PAY-06**: User can select a payment method before or during checkout

### Navigation

- [ ] **NAV-01**: User can view map directions to a selected bike
- [ ] **NAV-02**: User can follow step-by-step walking directions to a bike

### Ride Extras

- [ ] **RIDE-05**: User sees safety mounting instructions before starting a ride
- [ ] **RIDE-06**: User can find a nearby charging station when ending a ride
- [ ] **RIDE-07**: User can navigate to a charging station while riding

### Post-Ride

- [ ] **HIST-01**: User can view ride history statistics (total rides, distance, spend, CO2 saved)

### Account & Profile

- [ ] **PROF-01**: User can view their profile (name, photo, email, member since)
- [ ] **PROF-02**: User can edit their profile details (name, photo)
- [ ] **PROF-03**: User can manage app settings (units, map style, language)
- [ ] **PROF-04**: User can set notification preferences (ride alerts, promos, safety)

### Rewards

- [ ] **REW-01**: User can view their VoltCoins balance, earn history, and available rewards

### Content & Legal

- [ ] **CONT-01**: User can access in-app support and help center
- [ ] **CONT-02**: User can view the privacy policy
- [ ] **CONT-03**: User can view the terms of service

### Discovery

- [ ] **DISC-05**: User can view details of a nearby café or point of interest
- [ ] **DISC-06**: User can browse curated e-bike routes
- [ ] **DISC-07**: User can discover and explore VIP hubs on the map

---

## Future Requirements (v2.0+)

- Real backend API integration (auth, bikes, bookings, rides, payments)
- Real Google/Apple OAuth
- Real BLE unlock (native library)
- Real payment processing (Stripe or equivalent)
- Push notifications
- Offline mode

---

## Out of Scope (v1.1)

- **Backend integration** — all screens remain frontend-only with mocked data
- **Real camera/biometric processing** — IdScan and FacialScan use mock flows (no real OCR or liveness detection)
- **Real routing/navigation** — NavigateToBike and WalkingDirections use mock/static routes
- **Real rewards redemption** — VoltCoins display only; no real earn/redeem logic
- **Fleet operator dashboard** — separate product
- **Web version** — mobile-only

---

## Traceability

| REQ-ID  | Phase | Plans |
|---------|-------|-------|
| PROF-01 | Phase 5: Account & Profile | TBD |
| PROF-02 | Phase 5: Account & Profile | TBD |
| PROF-03 | Phase 5: Account & Profile | TBD |
| PROF-04 | Phase 5: Account & Profile | TBD |
| SEC-01  | Phase 6: Security & Verification | TBD |
| SEC-02  | Phase 6: Security & Verification | TBD |
| SEC-03  | Phase 6: Security & Verification | TBD |
| SEC-04  | Phase 6: Security & Verification | TBD |
| NAV-01  | Phase 7: Navigation & Ride Extras | TBD |
| NAV-02  | Phase 7: Navigation & Ride Extras | TBD |
| RIDE-05 | Phase 7: Navigation & Ride Extras | TBD |
| RIDE-06 | Phase 7: Navigation & Ride Extras | TBD |
| RIDE-07 | Phase 7: Navigation & Ride Extras | TBD |
| PAY-05  | Phase 8: Payments & Rewards | TBD |
| PAY-06  | Phase 8: Payments & Rewards | TBD |
| REW-01  | Phase 8: Payments & Rewards | TBD |
| HIST-01 | Phase 8: Payments & Rewards | TBD |
| DISC-05 | Phase 9: Discovery & Content | TBD |
| DISC-06 | Phase 9: Discovery & Content | TBD |
| DISC-07 | Phase 9: Discovery & Content | TBD |
| CONT-01 | Phase 9: Discovery & Content | TBD |
| CONT-02 | Phase 9: Discovery & Content | TBD |
| CONT-03 | Phase 9: Discovery & Content | TBD |
