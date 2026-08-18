# VoltVenture

A mobile e-bike rental app for tourists. Find nearby electric bikes, book and unlock them from your phone, and pay in-app — all in under 2 minutes.

> **Frontend only** — backend/API calls are mocked/stubbed until integration phase.

---

## Features

- Email/password and social (Google, Apple) authentication
- Map view of available e-bikes nearby with battery, distance, and pricing
- Bike booking and QR-code unlock
- Active ride session with live timer and cost tracking
- In-app payment and receipt
- Ride history and payment method management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 57) |
| UI Components | React Native Paper |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Navigation | React Navigation (Stack + Bottom Tabs) |
| Maps | react-native-maps |
| Auth | Google Sign-In, Apple Authentication, Expo Secure Store |

## Design System

All UI follows the [Volt Venture Design System](https://volt-venture-design-system.vercel.app/) — colors, typography, spacing, and components.

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
npm run android

# iOS simulator
npm run ios

# Start dev server only
npm start
```

## Project Structure

```
VoltVenture/
├── src/
│   ├── screens/        # App screens (Auth, Map, Booking, Ride, Account)
│   ├── components/     # Shared UI components
│   ├── navigation/     # React Navigation setup
│   ├── theme/          # Design system tokens
│   └── services/       # Mocked API services
├── assets/             # Icons, images, fonts
├── app.json            # Expo config
└── tailwind.config.js  # NativeWind / Tailwind config
```

## Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Foundation & Authentication | Complete |
| 2 | Bike Discovery (Map) | Complete |
| 3 | Booking & Unlock | Complete |
| 4 | Active Ride & Payment | Complete |

## Platform Support

- iOS (iPhone + iPad)
- Android
