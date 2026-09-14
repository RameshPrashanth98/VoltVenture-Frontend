# VoltVenture

A mobile e-bike rental app for tourists. Find nearby electric bikes, book and unlock them from your phone, and pay in-app — all in under 2 minutes.

> **Frontend only** — backend/API calls are mocked/stubbed until integration phase.

---

## Features

**Authentication**
- Email/password sign up and login
- Social auth (Google, Apple) buttons
- Forgot password flow
- Session persistence via Expo Secure Store

**Bike Discovery**
- Map view of available e-bikes with battery, distance, and pricing
- Filter chips (by distance, battery, price)
- List view toggle
- Bike detail bottom sheet

**Booking & Unlock**
- Bike reservation with 10-minute countdown timer
- QR-code scanner unlock screen
- BLE mock unlock flow

**Active Ride**
- Full-screen map overlay with live timer, cost, and battery
- Safety mount checklist
- Charging station finder map
- Ride-to-charger navigation

**Payments & Receipts**
- Checkout screen
- Payment method selection and add-card form
- Ride receipt

**Profile & Account**
- Profile view and edit
- Settings and notification preferences
- Ride history with statistics

**Security & Verification**
- Login security hub
- ID scan flow (mock)
- Facial recognition flow (mock)
- Security deposit screen

**Navigation Extras**
- Navigate-to-bike map with walking directions
- Step-by-step directions list

**Rewards**
- VoltCoins balance and earn history
- Rewards catalog

**Discovery & Content**
- Café markers and detail sheet
- Curated cycling routes
- VIP hubs
- Support FAQ, Privacy Policy, Terms of Service

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 57) |
| UI Components | React Native Paper |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Navigation | React Navigation (Stack + Bottom Tabs) |
| Maps | MapLibre React Native (`@maplibre/maplibre-react-native` v11) |
| Auth | Google Sign-In, Apple Authentication, Expo Secure Store |

## Design System

All UI follows the [Volt Venture Design System](https://volt-venture-design-system.vercel.app/) — colors, typography, spacing, and components.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Android Studio (for Android emulator) or Xcode (for iOS simulator)
- Expo CLI

> **Note:** This project uses Expo SDK 57, which is **not supported by the published Expo Go app**. You must use an Android/iOS emulator or an EAS development build.

### Install

```bash
cd VoltVenture
npm install
```

### Run

```bash
# Android emulator
npx expo run:android

# iOS simulator
npx expo run:ios

# Start dev server only (requires existing dev build)
npm start
```

> **Windows build note:** If you encounter CMake path length errors on Windows, copy the project to a short path (e.g. `C:\vv`) and build from there. Set `CMAKE_BUILD_PARALLEL_LEVEL=1` to avoid OOM during native compilation.

---

## Project Structure

```
VoltVenture/
├── src/
│   ├── screens/        # All app screens (Auth, Map, Booking, Ride, Account, etc.)
│   ├── components/     # Shared UI components
│   ├── navigation/     # React Navigation setup (Stack + Bottom Tabs)
│   ├── theme/          # Design system tokens (colors, typography, spacing)
│   └── services/       # Mocked API and data services
├── assets/             # Icons, images, fonts
├── app.json            # Expo config
└── tailwind.config.js  # NativeWind / Tailwind config
```

---

## Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Foundation & Authentication | Complete |
| 2 | Bike Discovery (Map) | Complete |
| 3 | Booking & Unlock | Complete |
| 4 | Active Ride & Payment | Complete |
| 5 | Account & Profile | Complete |
| 6 | Security & Verification | Complete |
| 7 | Navigation & Ride Extras | Complete |
| 8 | Payments & Rewards | Complete |
| 9 | Discovery & Content | Complete |
| 10 | Emulator Setup & Smoke Test | In Progress |
| 11 | Core Flow UAT | Pending |
| 12 | Ride & Account UAT | Pending |
| 13 | Extras UAT & Bug Fixes | Pending |

---

## Platform Support

- Android (primary — tested on emulator API 33+)
- iOS
