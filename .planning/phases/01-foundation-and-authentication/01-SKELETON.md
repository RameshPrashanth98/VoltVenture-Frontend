# Phase 1 — Walking Skeleton

**Phase:** 01-foundation-and-authentication
**Plan:** 01-01 (Walking Skeleton)
**Created:** 2026-08-13

---

## What the Walking Skeleton Proves

A tourist can open the app cold and:
1. See the native OS splash screen (no crash, no white flash)
2. Have fonts and auth state bootstrap before splash hides
3. Land on the Onboarding screen (if first-time) or the Login screen (if registered) or the AppTabs (if logged in)
4. See a bottom tab bar with Map and Account tabs — correct DS colors applied globally

This proves the full vertical path: Expo init → NativeWind → RNP PaperProvider → NavigationContainer → RootNavigator auth-state switch → screen renders with correct token styling.

---

## Architectural Decisions (Locked)

These decisions are established in Phase 1 and must not be renegotiated in subsequent phases.

| Decision | Value | Source |
|----------|-------|--------|
| Framework | Expo (managed workflow; dev build for social auth) | RESEARCH.md |
| UI library | React Native Paper v5 (MD3) + NativeWind v4 | D-09, D-10 |
| Navigation | React Navigation v6 — @react-navigation/stack + @react-navigation/bottom-tabs | D-05 |
| Token source | src/theme/theme.ts — single source of truth for DS colors, exported to PaperProvider and tailwind.config.js | D-08, D-09, D-10 |
| Auth state | useReducer in src/context/AuthContext.tsx — { isLoading, userToken, isSignout } | RESEARCH.md Pattern 2 |
| Token storage | expo-secure-store — keys: 'auth_token', 'has_registered' | D-14 |
| Font | Nunito Sans via expo-font — placeholder TTF; user to provide asset before implementation | D-12 |
| Social auth | @react-native-google-signin/google-signin (Google), expo-apple-authentication (Apple iOS-only) | D-16 |
| Navigation header | headerShown: false on all auth screens (D-07) | D-07 |

---

## Minimum File Tree (Walking Skeleton)

```
VoltVenture/                          <- project root (created by create-expo-app)
├── App.tsx                           <- PaperProvider + NavigationContainer + AuthContext.Provider
├── app.json                          <- Expo config (plugins: google-signin, apple-authentication)
├── babel.config.js                   <- babel-preset-expo with jsxImportSource nativewind
├── metro.config.js                   <- withNativeWind(config, { input: './global.css' })
├── global.css                        <- @tailwind base/components/utilities
├── tailwind.config.js                <- extends DSColors from theme.ts
├── nativewind-env.d.ts               <- /// <reference types="nativewind/types" />
├── tsconfig.json                     <- paths alias: @/* -> src/*
├── package.json                      <- all dependencies installed
└── src/
    ├── navigation/
    │   ├── RootNavigator.tsx         <- Stack switching AuthStack / AppTabs on userToken
    │   ├── AuthStack.tsx             <- screens: Splash, Onboarding, AuthLanding, SignUp, Login, ForgotPassword
    │   └── AppTabs.tsx               <- BottomTabs: Map, Account
    ├── screens/
    │   ├── auth/
    │   │   ├── SplashScreen.tsx      <- placeholder (replaced in 01-02)
    │   │   ├── OnboardingScreen.tsx  <- placeholder (replaced in 01-02)
    │   │   ├── AuthLandingScreen.tsx <- placeholder (replaced in 01-02)
    │   │   ├── SignUpScreen.tsx      <- placeholder (replaced in 01-03)
    │   │   ├── LoginScreen.tsx       <- placeholder (replaced in 01-04)
    │   │   └── ForgotPasswordScreen.tsx <- placeholder (replaced in 01-04)
    │   └── app/
    │       ├── MapScreen.tsx         <- Phase 1 placeholder ("Bikes Coming Soon")
    │       └── AccountScreen.tsx     <- placeholder (replaced in 01-06)
    ├── context/
    │   └── AuthContext.tsx           <- useReducer AuthContext, Provider, bootstrap hook
    ├── hooks/
    │   └── useAuth.ts                <- useContext(AuthContext) convenience hook
    ├── services/
    │   └── authService.ts            <- AuthService interface + mockAuthService
    ├── theme/
    │   ├── theme.ts                  <- DSColors, DSTypography, paperTheme exports
    │   └── index.ts                  <- re-exports from theme.ts
    ├── types/
    │   └── navigation.ts             <- RootStackParamList, AuthStackParamList, AppTabParamList
    └── utils/
        └── validation.ts             <- validateEmail(), validatePassword() helpers
```

---

## Skeleton Verification

Run the following to confirm the walking skeleton is operational:

```bash
npx expo start --clear
```

Then open on iOS simulator (or Android emulator):

Acceptance:
- App launches without crash or red error screen
- Native splash screen appears (no white flash before it)
- Fonts load before splash hides — no text re-render flash
- Onboarding placeholder screen renders (first cold start — SecureStore empty)
- Bottom tab bar visible after mocking auth state as logged in
- RNP PaperProvider theme applied — verify by checking that RNP `Button` renders with non-default color (DS primary brand color placeholder `#TODO` → should be a colored button, not grey, once token is filled)
- No TypeScript compilation errors (tsc --noEmit passes)

---

## Notes for Subsequent Phases

- **Phase 2 (Bike Discovery):** Add Map tab implementation; AppTabs.tsx already has the Map tab slot
- **Phase 3 (Booking & Unlock):** May add a third tab; update AppTabs.tsx and types/navigation.ts
- **Phase 4 (Active Ride & Payment):** Ride screen and payment; no navigation architecture changes expected
- **Font:** Developer must place Nunito Sans TTF files in assets/fonts/ and update theme.ts once font details confirmed (D-12)
- **DS Color tokens:** Developer must extract exact hex values from volt-venture-design-system.vercel.app before any screen implementation (UI-SPEC blocker)
