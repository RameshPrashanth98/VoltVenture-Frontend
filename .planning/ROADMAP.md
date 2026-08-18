# VoltVenture — Roadmap

**Milestone 1** | 4 phases | 21 requirements | Vertical MVP

---

### Phase 1: Foundation & Authentication

**Goal:** Scaffold the React Native app with design system integration and deliver a fully working auth flow — sign up, login, social auth, password reset.
**Mode:** mvp
**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
**Plans:** 6 plans

Plans:
- [ ] 01-01-PLAN.md — Walking Skeleton (project scaffold, theming, navigation, auth bootstrap)
- [ ] 01-02-PLAN.md — Onboarding Flow (splash, 3-slide onboarding, auth landing)
- [ ] 01-03-PLAN.md — Sign Up (email/password form, inline validation, mock auth, SecureStore)
- [ ] 01-04-PLAN.md — Log In + Forgot Password (session restore, auth forms, password reset)
- [ ] 01-05-PLAN.md — Social Auth (Google + Apple sign-in buttons, mock OAuth flow)
- [ ] 01-06-PLAN.md — Account Tab + Logout (account screen, confirmation dialog, session clear)

**Success Criteria**:
1. App launches on iOS and Android with VoltVenture design system tokens (colors, typography, spacing) applied globally
2. New user can sign up with email/password and be taken to the home screen
3. Returning user can log in and session persists across app restarts
4. User can sign in via Google or Apple ID
5. User can request a password reset email from the login screen

---

### Phase 2: Bike Discovery

**Goal:** User can find available e-bikes near them — map view, bike details, filtering, and list fallback — so they can identify which bike to rent.
**Mode:** mvp
**Requirements:** DISC-01, DISC-02, DISC-03, DISC-04
**Plans:** 4 plans

Plans:
- [ ] 02-01-PLAN.md — Map Foundation (packages, app.json, types, bikeService, BikeMarker, MapScreen rewrite with live bike pins)
- [ ] 02-02-PLAN.md — Bike Detail Sheet (BikeDetailSheet component wired to marker tap)
- [ ] 02-03-PLAN.md — Filter Sheet (FilterSheet component with chip selectors; filter logic updates map)
- [ ] 02-04-PLAN.md — List View (BikeCard, BikeListView, FAB toggle; list sorted by distance)

**Success Criteria**:
1. Map screen loads showing pinned available e-bikes at their locations
2. Tapping a bike pin opens a detail sheet (battery %, price/min, distance from user)
3. User can filter bikes by battery level, price range, or type and map updates accordingly
4. User can toggle to a list view of nearby bikes sorted by distance

---

### Phase 3: Booking & Unlock

**Goal:** User can reserve a bike, scan its QR code or use Bluetooth to unlock it, and see a confirmation — completing the path from selection to unlocked bike.
**Mode:** mvp
**Requirements:** BOOK-01, BOOK-02, BOOK-03, BOOK-04
**Plans:** 3 plans

Plans:
- [ ] 03-01-PLAN.md — BookingStack Foundation + BookingConfirmation (service, navigation types, modal stack, full confirmation screen with countdown and unlock CTAs, MapScreen onReserve wired)
- [ ] 03-02-PLAN.md — QR Scanner Screen (expo-camera install, full-screen CameraView, viewfinder overlay, permission handling, UnlockSuccess screen)
- [ ] 03-03-PLAN.md — BLE Unlock Screen + Expiry (3-state BLE mock auto-advance, reservation expiry Snackbar + dismiss)

**Success Criteria**:
1. User can tap "Reserve" on a bike and complete the booking flow
2. Booking confirmation screen displays with bike location and pickup instructions
3. User can open the QR scanner and scan a bike's code to unlock it
4. User can unlock a nearby bike via Bluetooth without scanning
5. Unlock success state is shown and transitions to the active ride screen

---

### Phase 4: Active Ride & Payment

**Goal:** User can complete a full ride — see live timer and cost, monitor battery, end the session, pay in-app, and view their receipt and ride history.
**Mode:** mvp
**Requirements:** RIDE-01, RIDE-02, RIDE-03, RIDE-04, PAY-01, PAY-02, PAY-03, PAY-04
**Plans:** 3 plans

Plans:
- [ ] 04-01-PLAN.md — Types, services, and navigation wiring (ride.ts, payment.ts, navigation.ts, rideService, paymentService, RideNavigator, AccountNavigator, RootNavigator + AppTabs update, UnlockSuccessScreen Start Ride wired)
- [ ] 04-02-PLAN.md — Ride screens (ActiveRideScreen full-screen map + overlay timer/cost/battery + End Ride, PaymentSummaryScreen, RideReceiptScreen)
- [ ] 04-03-PLAN.md — Account tab additions (AccountScreen new rows, RideHistoryScreen FlatList, PaymentMethodsScreen mock Visa + stub add)

**Success Criteria**:
1. Active ride screen shows a running timer and live cost updating every second
2. Bike's battery percentage is displayed and updates during the ride
3. User's current GPS location is visible on the ride map
4. Tapping "End Ride" locks the bike and triggers the payment flow
5. Saved payment method is charged and user sees a receipt with cost breakdown
6. User can add a credit card or digital wallet in the payment settings
7. Past rides appear in the ride history screen with date, duration, and cost

---

## Phase Status

| # | Phase | Status | Requirements |
|---|-------|--------|--------------|
| 1 | Foundation & Authentication | Executed | AUTH-01–05 |
| 2 | Bike Discovery | Executed | DISC-01–04 |
| 3 | Booking & Unlock | Executed | BOOK-01–04 |
| 4 | Active Ride & Payment | Executed | RIDE-01–04, PAY-01–04 |
