# Phase 1: Foundation & Authentication — Discussion Log

**Date:** 2026-08-13
**Areas discussed:** App entry flow, Navigation structure, Design system wiring, Auth UX details

---

## Area 1: App Entry Flow

| Question | Options presented | Selected |
|----------|-------------------|----------|
| What does a new tourist see first? | Splash → Login / Splash → Onboarding → Auth / Splash → Map (guest) | Splash → Onboarding → Auth |
| What does onboarding show? | 3 feature slides / 2 value prop slides / You decide | 3 feature slides (Find bikes → Unlock → Explore) |
| Returning user onboarding behavior? | Show once forever / Always on cold start until registered / Skip button always visible | Always show on cold start until registered |
| Default auth action after onboarding? | Sign up prominent / Two equal buttons / Login first | Sign up prominent, login secondary |

---

## Area 2: Navigation Structure

| Question | Options presented | Selected |
|----------|-------------------|----------|
| Main navigation pattern (logged in)? | Bottom tab bar / Drawer / Stack only | Bottom tab bar |
| Tabs in Phase 1? | Map + Account / Map + Rides + Account / You decide | Map + Account (2 tabs) |
| Auth vs main app structure? | Root stack: Auth stack vs App tabs / Single navigator / You decide | Root stack: Auth stack vs App tabs |
| Auth screen headers? | Headerless (custom UI only) / Native header on some screens | Headerless (custom UI only) |

---

## Area 3: Design System Wiring

| Question | Options presented | Selected |
|----------|-------------------|----------|
| How to bring in DS tokens? | Extract manually → theme.ts / npm package / User shares values | Extract manually into theme.ts |
| Priority DS components for Phase 1? | Button / TextInput / Typography / Colors & brand theme | All four |
| Where to apply the theme? | PaperProvider at root / PaperProvider + separate NativeWind config | PaperProvider + separate NativeWind config |
| Font setup? | User will share / System fonts for now / Inter/Poppins placeholder | User will share the design system font details |

---

## Area 4: Auth UX Details

| Question | Options presented | Selected |
|----------|-------------------|----------|
| How are auth errors displayed? | Inline field errors / Top-of-form banner / Toast notification | Inline field errors |
| Session persistence? | Until manual logout / 30-day sliding expiry / Backend decides | Until manually logged out (SecureStorage) |
| Logout behavior? | Confirm dialog → login screen / Instant logout / Confirm → onboarding | Confirm dialog, then navigate to login screen |
| Social auth library? | @react-native-google-signin + expo-apple-authentication / Firebase Auth / You decide | @react-native-google-signin + expo-apple-authentication |

---

## Deferred Ideas

- Profile editing, biometric login, multi-language — noted, out of scope for v1
