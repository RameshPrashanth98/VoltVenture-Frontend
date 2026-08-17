# Phase 3: Booking & Unlock — Discussion Log

**Date:** 2026-08-17
**Areas discussed:** Navigation pattern, Booking confirmation, QR scanner, Bluetooth unlock

---

## Navigation pattern

**Q: How should booking screens be presented over the map?**
Options: Modal stack / Flat root screens / AppStack inside AppTabs
**Selected:** Modal stack — BookingStack in RootStackParamList with modal presentation (BookingConfirmation, QRScanner, UnlockSuccess)

**Q: How does the user get back from the booking flow to the map?**
Options: X / back button / Auto-dismiss on unlock
**Selected:** X / back button on BookingConfirmation

---

## Booking confirmation

**Q: What information should appear on the booking confirmation screen?**
Options: Full details / Minimal details / You decide
**Selected:** Full details — bike name/type, battery %, price/min, static location card with pickup address, pickup instructions, countdown timer

**Q: Should the countdown timer cancel the booking when it hits 0:00?**
Options: Yes — auto-cancel / No — timer display only
**Selected:** Yes — auto-cancel; show "Reservation expired" and dismiss back to map

**Q: Which unlock options appear on the confirmation screen?**
Options: Both QR and Bluetooth / QR only / Sequential — QR first, BLE fallback
**Selected:** Both QR and Bluetooth (two equally prominent CTAs)

---

## QR scanner

**Q: Should the QR scanner use a real camera, or simulate the scan?**
Options: Real camera — expo-camera / Simulated scan
**Selected:** Real camera — expo-camera (SDK 57 compatible)

**Q: What should the scanner UI look like?**
Options: Full-screen camera + viewfinder / Camera + bottom sheet controls
**Selected:** Full-screen camera + viewfinder — Electric Green corner brackets, instruction text below, X close button

---

## Bluetooth unlock

**Q: How deep should the Bluetooth mock go?**
Options: Full UI states, no BLE library / Simple tap-to-unlock / You decide
**Selected:** Full UI states, no BLE library — 3 auto-advancing states: Scanning → Found → Connecting, then UnlockSuccess

**Q: What should the UnlockSuccess screen show before transitioning to Phase 4?**
Options: Success screen + Start Ride CTA / Auto-transition / You decide
**Selected:** Success screen + Start Ride CTA — checkmark, "Bike unlocked!", bike name, "Start Ride" PrimaryButton (Phase 4 stub)

---

## Deferred ideas

- Real Bluetooth with hardware pairing → v2 / backend integration
- QR content validation → backend integration phase
- Push notifications → v2
