# Phase 1: Foundation & Authentication - Research

**Researched:** 2026-08-13
**Domain:** React Native (Expo) / React Native Paper / NativeWind v4 / React Navigation / Social Auth
**Confidence:** HIGH (core stack verified via npm registry + official docs) | MEDIUM (compatibility patterns and co-theming approach)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Entry sequence: Splash screen → Onboarding (3 feature slides) → Auth landing
- **D-02:** Onboarding shows on every cold start until user creates an account; once registered, skipped on subsequent launches
- **D-03:** 3 feature slides: "Find bikes" → "Unlock" → "Explore" — each with a visual, headline, and short tagline
- **D-04:** After onboarding, auth landing presents Sign Up as primary CTA; "Already have an account? Log in" as secondary link below
- **D-05:** Root navigator is a stack that switches between AuthStack and AppTabs based on auth state. AuthStack: Splash → Onboarding → Auth landing → Sign Up → Log In → Forgot Password. AppTabs: Bottom tab bar with Map and Account tabs.
- **D-06:** Bottom tab bar has 2 tabs in Phase 1: Map and Account
- **D-07:** All auth screens are headerless — no native navigation header bar. Each screen manages its own back navigation via custom UI elements.
- **D-08:** Design system tokens extracted manually from https://volt-venture-design-system.vercel.app/ and codified into theme.ts
- **D-09:** Theme applied via React Native Paper's PaperProvider at app root
- **D-10:** NativeWind tailwind.config.js extends same DS color and font values as RNP theme
- **D-11:** Priority components to theme: Button (primary/secondary/ghost), TextInput (label + error states), Typography (heading + body), global color palette
- **D-12:** Font: user will share VoltVenture DS font details before implementation. Leave a clear TODO comment — do not hardcode a placeholder font.
- **D-13:** Auth error display: inline field errors using HelperText below the offending input
- **D-14:** Session persistence: token stored in SecureStorage; session persists until explicit logout. No frontend-side automatic expiry.
- **D-15:** Logout flow: confirmation dialog → on confirm, clear session and navigate to Login screen (not onboarding)
- **D-16:** Social auth: `@react-native-google-signin/google-signin` for Google, `expo-apple-authentication` for Apple

### Claude's Discretion
- Loading/spinner behavior on auth actions (login button disabled + spinner while request in flight)
- Keyboard avoidance behavior on forms (KeyboardAvoidingView configuration)
- Specific animation for splash → onboarding transition
- Tab bar icon selection (pending design system icon library review)

### Deferred Ideas (OUT OF SCOPE)
- Profile editing (name, photo) — Phase 2+ or v2
- Notifications permissions prompt — not in Phase 1 auth scope
- Biometric login (Face ID / fingerprint) — potential v2 addition
- Multi-language/localization — out of scope for v1

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | User can create an account with email and password | Sign Up screen with RNP TextInput + mock authService.signUp() |
| AUTH-02 | User can log in and stay logged in across app restarts | Login screen + expo-secure-store token persistence + auth bootstrap on cold start |
| AUTH-03 | User can log out from the app | Account tab logout dialog (RNP Dialog) + SecureStore.deleteItemAsync + navigate to Login |
| AUTH-04 | User can sign in via Google or Apple (social login) | @react-native-google-signin/google-signin + expo-apple-authentication (iOS-only guard) |
| AUTH-05 | User can reset their password via an email link | Forgot Password screen with email field + mock authService.sendResetLink() → success state |

</phase_requirements>

---

## Summary

Phase 1 is a greenfield Expo + React Native project that must establish the entire app scaffold: theming, navigation architecture, auth screens, and social auth. The tech stack is well-established — React Native Paper 5.x, NativeWind v4, React Navigation v6, and Expo SDK 57 packages are all current and actively maintained. The critical integration challenge is wiring PaperProvider and NativeWind from a single `theme.ts` token source; this is architecturally straightforward but requires care because React Native Paper's MD3 color system and NativeWind's Tailwind config use different token shapes.

The biggest operational risk is social auth: `@react-native-google-signin/google-signin` **cannot run in Expo Go** — it requires a development build (EAS or local `expo prebuild`). This is a setup prerequisite that affects how developers run the app during Phase 1. Since the backend is mocked, the social auth flow only needs to simulate a token response; native config (Google Cloud Console OAuth client IDs, iOS URL scheme) will need to be set up before any real device testing.

The auth flow pattern from React Navigation official docs is clean and well-documented: a single root Stack navigator with an `isLoading` bootstrap state reading from `expo-secure-store`, a `useReducer` managing `{ isLoading, userToken, isSignout }`, and conditional screen rendering that React Navigation handles automatically — no manual `navigate()` calls on auth state change. This prevents cold start flicker entirely.

**Primary recommendation:** Scaffold the project in one focused task (Expo init → NativeWind config → RNP PaperProvider → navigation skeleton → theme.ts placeholder), then build each auth screen as a vertical slice with its mock service call, so each task produces a working, testable screen.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Splash screen + font loading | Mobile App (Expo) | — | expo-splash-screen + expo-font run at app bootstrap before any render |
| Auth state management | Mobile App (React Context) | SecureStorage | Auth state is local; token persisted in SecureStorage on device |
| Navigation switching (Auth ↔ App) | Mobile App (React Navigation) | Auth Context | Conditional screen rendering driven by auth context token value |
| Email/password signup + login | Mobile App (screens) | Mock auth service | Screens call service layer; service is mocked in Phase 1 |
| Token persistence | Mobile App (SecureStorage) | — | expo-secure-store writes/reads encrypted keychain storage |
| Social auth (Google) | Mobile App + Google Cloud | — | Native SDK call; requires Google Cloud Console OAuth setup |
| Social auth (Apple) | Mobile App (iOS only) | — | expo-apple-authentication; iOS-exclusive API |
| Password reset | Mobile App (screen) | Mock auth service | Screen sends email to mock service; success state shown |
| Design system theming | Mobile App (PaperProvider + NativeWind) | — | Single theme.ts feeds both RNP PaperProvider and tailwind.config.js |
| Onboarding state (seen/unseen) | Mobile App (SecureStorage) | — | Persist `hasSeenOnboarding` flag alongside auth token |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react-native-paper` | 5.15.3 | UI components — Button, TextInput, Dialog, HelperText, BottomNavigation | Callstack-maintained, MD3, PaperProvider theming. Created 2016, widely adopted. [VERIFIED: npm registry] |
| `nativewind` | 4.2.6 | Tailwind CSS utility classes in React Native | Production v4, jsxImportSource transform, cssInterop for third-party. [VERIFIED: npm registry] |
| `@react-navigation/native` | 7.3.16 | Navigation container | Ecosystem standard, React Navigation official monorepo. [VERIFIED: npm registry] |
| `@react-navigation/stack` | 7.10.22 | Auth stack navigator (headerless screens) | Required for auth flow with `headerShown: false`. [VERIFIED: npm registry] |
| `@react-navigation/bottom-tabs` | 7.18.16 | AppTabs bottom tab navigator | Standard tab pattern. [VERIFIED: npm registry] |
| `react-native-safe-area-context` | 5.9.0 | Safe area insets (notch, home indicator) | Required by React Navigation; AppAndFlow fork on npm. [VERIFIED: npm registry] |
| `react-native-screens` | 4.27.0 | Native screen optimization | Required by React Navigation; software-mansion maintained. [VERIFIED: npm registry] |
| `react-native-gesture-handler` | 3.1.0 | Gesture support for navigation | Required by @react-navigation/stack; software-mansion. [VERIFIED: npm registry] |
| `react-native-reanimated` | 4.5.3 | Animation engine | Required by NativeWind v4 (peer dep); software-mansion. [VERIFIED: npm registry] |
| `expo-secure-store` | 57.0.1 | Encrypted token storage (auth token + onboarding flag) | Expo maintained, expo monorepo. [VERIFIED: npm registry] |
| `expo-font` | 57.0.1 | Load Nunito Sans font at app init | Expo maintained, expo monorepo. [VERIFIED: npm registry] |
| `expo-splash-screen` | 57.0.6 | Control splash screen hide timing | Expo maintained, expo monorepo. [VERIFIED: npm registry] |
| `@react-native-google-signin/google-signin` | 16.1.4 | Google OAuth | Community maintained, widely adopted, has config plugin for Expo. [VERIFIED: npm registry] |
| `expo-apple-authentication` | 57.0.1 | Apple Sign-In on iOS | Expo maintained, expo monorepo. iOS-only. [VERIFIED: npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `tailwindcss` | ^3.4.17 | NativeWind v4 requires Tailwind CSS v3 as devDep | Required peer dep for NativeWind v4 |
| `react-native-reanimated` | 4.5.3 | Peer dep for NativeWind v4 animations | Auto-installed as dep; needed for `Animated` styles |
| `deepmerge` | latest | Merge RNP theme + React Navigation adapted theme | Used when wiring adaptNavigationTheme() with PaperProvider theme |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@react-native-google-signin/google-signin` | `expo-auth-session` (Google provider) | expo-auth-session works in Expo Go but uses web OAuth flow (browser redirect) — less native UX. D-16 locks google-signin. |
| `@react-navigation/stack` | `@react-navigation/native-stack` | native-stack uses native views (better perf) but has limited animation customization needed for headerless screens. Stack chosen for control. |
| expo-secure-store | AsyncStorage | AsyncStorage is unencrypted — not acceptable for auth tokens. |

**Installation:**
```bash
npx create-expo-app@latest VoltVenture --template blank-typescript
cd VoltVenture

# UI + navigation
npm install react-native-paper react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated

# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

# NativeWind v4
npm install nativewind
npm install --save-dev tailwindcss@^3.4.17

# Expo SDK packages
npx expo install expo-secure-store expo-font expo-splash-screen expo-apple-authentication

# Social auth
npm install @react-native-google-signin/google-signin
```

---

## Package Legitimacy Audit

> slopcheck was unavailable at research time (pip not available on this system). All packages verified against npm registry + official source repositories. All are tagged [ASSUMED] per protocol until slopcheck confirms.

| Package | Registry | Age | Source Repo | Disposition |
|---------|----------|-----|-------------|-------------|
| `react-native-paper` | npm | ~10 yrs (2016) | github.com/callstack/react-native-paper | Approved — Callstack official |
| `nativewind` | npm | ~8 yrs (2018) | github.com/nativewind/nativewind | Approved — official project |
| `@react-navigation/native` | npm | ~9 yrs | github.com/react-navigation/react-navigation | Approved — React Navigation official monorepo |
| `@react-navigation/stack` | npm | ~9 yrs | github.com/react-navigation/react-navigation | Approved — same monorepo |
| `@react-navigation/bottom-tabs` | npm | ~9 yrs | github.com/react-navigation/react-navigation | Approved — same monorepo |
| `react-native-safe-area-context` | npm | ~7 yrs | github.com/AppAndFlow/react-native-safe-area-context | Approved — widely adopted |
| `react-native-screens` | npm | ~6 yrs | github.com/software-mansion/react-native-screens | Approved — software-mansion |
| `react-native-gesture-handler` | npm | ~8 yrs | github.com/software-mansion/react-native-gesture-handler | Approved — software-mansion |
| `react-native-reanimated` | npm | ~7 yrs | github.com/software-mansion/react-native-reanimated | Approved — software-mansion |
| `expo-secure-store` | npm | part of Expo monorepo | github.com/expo/expo | Approved — Expo official |
| `expo-font` | npm | part of Expo monorepo | github.com/expo/expo | Approved — Expo official |
| `expo-splash-screen` | npm | part of Expo monorepo | github.com/expo/expo | Approved — Expo official |
| `expo-apple-authentication` | npm | part of Expo monorepo | github.com/expo/expo | Approved — Expo official |
| `@react-native-google-signin/google-signin` | npm | ~5 yrs (2021) | github.com/react-native-google-signin/google-signin | Approved — community standard |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*slopcheck was unavailable at research time. All packages above are tagged `[ASSUMED]` and the planner should gate installs behind a `checkpoint:human-verify` task as a precaution, OR the developer can verify manually against the source repos above.*

---

## Architecture Patterns

### System Architecture Diagram

```
App entry (App.tsx)
       |
       v
SplashScreen.preventAutoHideAsync()  <-- called at module scope
       |
       v
[App component mounts]
       |
       +-- useFonts(NunitoSans)  <-- async font load
       |
       +-- authContext.bootstrap()  <-- SecureStore.getItemAsync("auth_token")
       |                                SecureStore.getItemAsync("has_seen_onboarding")
       |
       v
[When both complete → SplashScreen.hideAsync()]
       |
       v
 NavigationContainer
       |
       v
 RootStack (single Stack.Navigator)
       |
       +-- isLoading=true  →  (nothing rendered, splash visible)
       |
       +-- isLoading=false, userToken=null  →  AuthStack
       |      |
       |      +-- Splash (React Navigation screen, fade-in)
       |      +-- Onboarding (hasSeenOnboarding=false)
       |      +-- AuthLanding
       |      +-- SignUp
       |      +-- LogIn
       |      +-- ForgotPassword
       |
       +-- isLoading=false, userToken != null  →  AppTabs
              |
              +-- Tab: Map (placeholder screen)
              +-- Tab: Account (logout trigger)

Auth actions (signIn / signUp / signOut) dispatch to useReducer
→ update userToken in context
→ React Navigation automatically shows/hides correct stack
```

### Recommended Project Structure

```
src/
├── navigation/
│   ├── RootNavigator.tsx       # Stack switching AuthStack / AppTabs
│   ├── AuthStack.tsx           # All pre-auth screens
│   └── AppTabs.tsx             # Bottom tab navigator
├── screens/
│   ├── auth/
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── AuthLandingScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── ForgotPasswordScreen.tsx
│   └── app/
│       ├── MapScreen.tsx       # Phase 1 placeholder
│       └── AccountScreen.tsx
├── components/
│   ├── common/
│   │   ├── PrimaryButton.tsx
│   │   ├── SecondaryButton.tsx
│   │   ├── GhostButton.tsx
│   │   ├── FormField.tsx       # TextInput + HelperText wrapper
│   │   └── SocialAuthButton.tsx
│   └── onboarding/
│       └── OnboardingSlide.tsx
├── context/
│   └── AuthContext.tsx         # useReducer auth state + AuthContext.Provider
├── hooks/
│   └── useAuth.ts              # Convenience hook: useContext(AuthContext)
├── services/
│   └── authService.ts          # Interface + mock implementation
├── theme/
│   ├── theme.ts                # DS tokens → RNP MD3 theme + tailwind config exports
│   └── index.ts
├── types/
│   └── navigation.ts           # React Navigation typed params
└── utils/
    └── validation.ts           # Email/password validation helpers
```

### Pattern 1: Auth Bootstrap with expo-splash-screen

**What:** Prevent splash auto-hide until fonts are loaded AND auth state is resolved from SecureStorage.
**When to use:** App entry — always, before any navigator renders.

```typescript
// App.tsx
// Source: Expo official docs — docs.expo.dev/versions/latest/sdk/splash-screen/
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync(); // Called at module scope, not in component

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    // TODO: Replace with DS font — see D-12. Font name and asset path TBD.
    'NunitoSans-Regular': require('./assets/fonts/NunitoSans-Regular.ttf'),
    'NunitoSans-Bold': require('./assets/fonts/NunitoSans-Bold.ttf'),
  });

  useEffect(() => {
    // Bootstrap auth state from SecureStore — dispatches RESTORE_TOKEN
    authContext.bootstrap().finally(() => setAuthReady(true));
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && authReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, authReady]);

  if (!fontsLoaded && !fontError) return null;
  return <RootApp />;
}
```

### Pattern 2: Auth Flow with useReducer (no navigator flicker)

**What:** Single root Stack renders screens conditionally based on auth state. React Navigation handles transitions automatically — no `navigate()` calls on auth change.
**When to use:** RootNavigator.tsx — always.

```typescript
// Source: reactnavigation.org/docs/auth-flow/
import React, { useReducer, useEffect, createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';

type AuthState = {
  isLoading: boolean;
  userToken: string | null;
  isSignout: boolean;
};

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null }
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_OUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return { ...state, userToken: action.token, isLoading: false };
    case 'SIGN_IN':
      return { ...state, isSignout: false, userToken: action.token };
    case 'SIGN_OUT':
      return { ...state, isSignout: true, userToken: null };
  }
}

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

const Stack = createStackNavigator();

export function RootNavigator() {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    userToken: null,
    isSignout: false,
  });

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      dispatch({ type: 'RESTORE_TOKEN', token });
    })();
  }, []);

  const authContextValue = useMemo(() => ({
    signIn: async (token: string) => {
      await SecureStore.setItemAsync('auth_token', token);
      dispatch({ type: 'SIGN_IN', token });
    },
    signOut: async () => {
      await SecureStore.deleteItemAsync('auth_token');
      dispatch({ type: 'SIGN_OUT' });
    },
  }), []);

  if (state.isLoading) return null; // Splash screen still visible

  return (
    <AuthContext.Provider value={authContextValue}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.userToken == null ? (
          // Auth screens — React Navigation renders these when logged out
          <>
            <Stack.Screen name="Onboarding" component={OnboardingStack} />
            <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          // App screens — React Navigation renders these when logged in
          <Stack.Screen name="AppTabs" component={AppTabNavigator} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
```

### Pattern 3: React Native Paper MD3 Theme from Design System Tokens

**What:** Extend `MD3LightTheme` with custom DS colors. Export token values reusable in tailwind.config.js.
**When to use:** `src/theme/theme.ts` — single source of truth for all design tokens.

```typescript
// Source: oss.callstack.com/react-native-paper/docs/guides/theming
import { MD3LightTheme } from 'react-native-paper';

// DS color tokens — TODO: Replace placeholders with exact hex values from
// https://volt-venture-design-system.vercel.app/ stories:
//   foundation-color--semantic-colors
//   foundation-color--primitive-green-ramp
//   foundation-color-status-colors--status-colors
export const DSColors = {
  primary: '#TODO',       // Extract from primitive-green-ramp
  background: '#FFFFFF',
  surface: '#F5F5F5',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textOnPrimary: '#FFFFFF',
  error: '#TODO',         // Extract from status-colors
  destructive: '#TODO',   // Extract from status-colors
  border: '#E0E0E0',
  accent: '#TODO',        // Extract from semantic-colors
};

export const DSTypography = {
  // TODO: Replace with DS font — see D-12. Font details to be provided by user.
  fontFamily: 'NunitoSans', // placeholder
};

// MD3 theme for PaperProvider
export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: DSColors.primary,
    background: DSColors.background,
    surface: DSColors.surface,
    error: DSColors.error,
    onPrimary: DSColors.textOnPrimary,
    onBackground: DSColors.textPrimary,
    onSurface: DSColors.textPrimary,
    outline: DSColors.border,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    // Override font family globally
    // Each variant: bodyLarge, bodyMedium, bodySmall, titleLarge, etc.
  },
};
```

**tailwind.config.js — shared token consumption:**
```javascript
// tailwind.config.js
// Import DSColors to keep tailwind in sync with RNP theme
const { DSColors } = require('./src/theme/theme');

module.exports = {
  content: [
    './App.tsx',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: DSColors.primary,
        surface: DSColors.surface,
        'text-primary': DSColors.textPrimary,
        'text-secondary': DSColors.textSecondary,
        error: DSColors.error,
        border: DSColors.border,
        accent: DSColors.accent,
      },
    },
  },
  plugins: [],
};
```

### Pattern 4: NativeWind v4 Full Config

**What:** Three required config files for NativeWind v4 in Expo.

```javascript
// metro.config.js
// Source: NativeWind official docs (nativewind.dev/docs/getting-started/installation)
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

```css
/* global.css — in project root */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```typescript
// nativewind-env.d.ts — for TypeScript
/// <reference types="nativewind/types" />
```

### Pattern 5: Mock Auth Service (swappable for real API)

**What:** TypeScript interface + mock implementation. Real API implementation swaps in later without changing callers.

```typescript
// src/services/authService.ts
export interface AuthService {
  signUp(email: string, password: string): Promise<{ token: string }>;
  signIn(email: string, password: string): Promise<{ token: string }>;
  sendPasswordResetEmail(email: string): Promise<void>;
}

// Mock delays simulate realistic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService: AuthService = {
  async signUp(email, password) {
    await delay(1200);
    if (email === 'taken@example.com') {
      throw { code: 'EMAIL_ALREADY_IN_USE' };
    }
    return { token: 'mock-jwt-token-signup-' + Date.now() };
  },

  async signIn(email, password) {
    await delay(1000);
    if (password !== 'password123') {
      throw { code: 'WRONG_PASSWORD' };
    }
    return { token: 'mock-jwt-token-signin-' + Date.now() };
  },

  async sendPasswordResetEmail(email) {
    await delay(800);
    // Always succeeds in mock (even for unknown emails — security best practice)
  },
};

// Export the active service — swap mock for real implementation here
export const authService: AuthService = mockAuthService;
```

### Pattern 6: Social Auth with Platform Guard

```typescript
// Apple Sign-In — iOS only (D-16)
// Source: docs.expo.dev/versions/latest/sdk/apple-authentication/
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

// Render guard in JSX:
{Platform.OS === 'ios' && (
  <AppleAuthentication.AppleAuthenticationButton
    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
    cornerRadius={8}
    style={{ width: '100%', height: 44 }}
    onPress={handleAppleSignIn}
  />
)}

async function handleAppleSignIn() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    // credential.identityToken → send to backend for verification
    // In Phase 1 mock: treat any success as signed in
    const token = 'mock-apple-token';
    await authContext.signIn(token);
  } catch (e: any) {
    if (e.code === 'ERR_REQUEST_CANCELED') {
      // User cancelled — silent return per UI-SPEC
      return;
    }
    throw e; // Show generic error
  }
}
```

### Pattern 7: Onboarding State — Skip Logic (D-02)

```typescript
// Two SecureStore keys:
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  HAS_REGISTERED: 'has_registered',  // set on successful signup, never cleared on logout
} as const;

// Auth bootstrap reads both keys:
const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
const hasRegistered = await SecureStore.getItemAsync(STORAGE_KEYS.HAS_REGISTERED);

// Navigator logic:
// - isLoading=false, token=null, hasRegistered=null → show Onboarding → Auth flow
// - isLoading=false, token=null, hasRegistered='true' → skip to Login (D-02)
// - isLoading=false, token != null → show AppTabs
```

### Pattern 8: KeyboardAvoidingView (Claude's Discretion)

```typescript
// Source: reactnative.dev/docs/keyboardavoidingview
// UI-SPEC interaction contract
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ flexGrow: 1 }}
  >
    {/* form fields */}
  </ScrollView>
</KeyboardAvoidingView>
```

### Anti-Patterns to Avoid

- **Calling `navigate()` on auth state change:** React Navigation automatically switches screens when the conditional navigator tree changes. Manually calling `navigate()` causes double navigation and race conditions.
- **Calling `SplashScreen.preventAutoHideAsync()` inside a component or useEffect:** Must be called at module scope before any rendering or it may have no effect.
- **Reading SecureStore synchronously at render time:** SecureStore is always async. Always use `getItemAsync` in a useEffect and keep `isLoading: true` until it resolves.
- **Using `behavior="padding"` on Android:** Android keyboard behavior differs from iOS. Use `Platform.OS === 'ios' ? 'padding' : 'height'` or omit `behavior` on Android.
- **Importing NativeWind StyleSheet from `react-native` instead of `nativewind`:** In NativeWind v4, use `import { StyleSheet } from 'nativewind'` when merging className and inline styles to get proper merging behavior.
- **Using `styled()` wrapper from NativeWind v2/v3:** Removed in v4. Use `cssInterop` or `remapProps` for third-party components.
- **Applying `className` directly to React Native Paper components:** RNP components do not accept `className` by default. Use NativeWind's `remapProps` to bridge, OR wrap in a `View` with `className` and use RNP's `style` prop for component-specific overrides.
- **Hardcoding font name before user provides it (D-12):** Leave a `// TODO: Replace with DS font` comment in theme.ts.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Encrypted token storage | Custom AsyncStorage encryption | `expo-secure-store` | Uses OS keychain (iOS Keychain, Android Keystore); platform-native encryption |
| Auth state bootstrap | Custom loading flag + storage polling | `useReducer` + `isLoading` pattern (React Navigation docs) | Race conditions, flicker; documented pattern handles all edge cases |
| Font loading + splash sequencing | Manual timers, custom splash logic | `expo-font` useFonts + `expo-splash-screen` | Missing font causes text flicker; splash APIs have OS-level guarantees |
| Google Sign-In OAuth flow | WebView-based OAuth | `@react-native-google-signin/google-signin` | Google deprecated WebView OAuth; native SDK required |
| Apple Sign-In UI button | Custom-styled button | `AppleAuthentication.AppleAuthenticationButton` | App Store requirement: Apple-approved button UI must be used |
| Safe area padding | Hardcoded padding values per device | `react-native-safe-area-context` | Cannot know notch/island/home indicator sizes at compile time |
| Input validation on blur | Custom blur/focus tracking | `onBlur` + `useState` error state | RNP `HelperText` type="error" handles display; only need the error string state |

**Key insight:** Auth and storage primitives have OS-level security guarantees that custom solutions cannot replicate. Use platform libraries for anything touching encrypted storage, native auth SDKs, or device hardware features.

---

## Common Pitfalls

### Pitfall 1: Google Sign-In Fails in Expo Go

**What goes wrong:** `@react-native-google-signin/google-signin` throws a "module not found" or similar native module error when run inside Expo Go.
**Why it happens:** The library requires native code changes (Android Gradle, iOS plist, URL scheme) that Expo Go does not include.
**How to avoid:** Use a development build. Run `npx expo prebuild --clean` then `npx expo run:ios` / `npx expo run:android`. Add the config plugin to `app.json` first.
**Warning signs:** App crashes or throws on import of the google-signin module.

```json
// app.json — required config plugin (D-16)
{
  "expo": {
    "plugins": [
      ["@react-native-google-signin/google-signin", {
        "iosUrlScheme": "com.googleusercontent.apps.YOUR_CLIENT_ID"
      }]
    ],
    "ios": {
      "usesAppleSignIn": true
    },
    "plugins": ["expo-apple-authentication"]
  }
}
```

### Pitfall 2: NativeWind Styles Not Applying After Config Change

**What goes wrong:** className styles render as unstyled components even though they appear correct in code.
**Why it happens:** Metro caches the compiled CSS output. Config changes to tailwind.config.js or global.css are not picked up with a normal restart.
**How to avoid:** Always restart Metro with `npx expo start --clear` after any change to tailwind.config.js, global.css, metro.config.js, or babel.config.js.
**Warning signs:** Tailwind classes have no visual effect; no error shown.

### Pitfall 3: className Not Working on React Native Paper Components

**What goes wrong:** Applying `className="..."` directly to a RNP `Button`, `TextInput`, or `Dialog` does nothing.
**Why it happens:** NativeWind v4 only processes `className` on native React Native components (View, Text, etc.), not on arbitrary third-party components by default.
**How to avoid:** Two strategies:
1. Wrap RNP components in `View` with `className` for layout/spacing, and use RNP's own `style` prop for component-specific colors.
2. Use `remapProps` or `cssInterop` from NativeWind to bridge className → style on specific RNP components where needed.
**Warning signs:** `className` prop has no visual effect on RNP components; no error.

### Pitfall 4: Cold Start Shows Wrong Screen for ~500ms

**What goes wrong:** App briefly flashes the Auth screen before showing AppTabs (or vice versa) on cold start.
**Why it happens:** Navigator renders before `getItemAsync` from SecureStore resolves, so it starts with the default state.
**How to avoid:** Keep `isLoading: true` in auth reducer initial state. Return `null` from the navigator when `isLoading` is true. Combined with `SplashScreen.preventAutoHideAsync()`, the OS-level splash covers the gap.
**Warning signs:** Brief screen flash on app open.

### Pitfall 5: Apple Sign-In Credentials Only Returned Once

**What goes wrong:** User's name and email are only provided in the `credential` object on the **first** sign-in. Subsequent sign-ins return `null` for name/email.
**Why it happens:** Apple's privacy design — the system only shares user data on first authorization.
**How to avoid:** Store the user's name/email on first sign-in (in SecureStore or send to backend immediately). Do not rely on re-fetching from Apple.
**Warning signs:** User profile is blank after reinstall or on second device.

### Pitfall 6: `rem` Scaling Difference in NativeWind v4

**What goes wrong:** Tailwind spacing values appear smaller than expected compared to v2/v3 or web Tailwind.
**Why it happens:** NativeWind v4 changed the base `rem` value from 16px to **14px**.
**How to avoid:** Either configure `inlineNativeRem: 16` in `withNativeWind()` to restore the original scale, or be aware that `text-base` = 14dp (not 16dp) and adjust Tailwind classes accordingly. The UI-SPEC uses explicit dp values, so prefer specifying font sizes in theme.ts rather than Tailwind text-size classes for typography.
**Warning signs:** Text appears slightly smaller than the DS spec; spacing feels tighter than expected.

### Pitfall 7: Onboarding Skip Logic Confusion (D-02)

**What goes wrong:** After logout, user sees onboarding again even though they've registered.
**Why it happens:** The natural instinct is to tie onboarding visibility to auth token presence. D-02 specifies onboarding should only show until the user registers — not on every logout.
**How to avoid:** Store a separate `has_registered` key in SecureStore that is written on successful signup and **never cleared** on logout. The auth bootstrap reads both keys independently. Onboarding skip = `has_registered === 'true'`, regardless of `auth_token`.
**Warning signs:** Registered users see onboarding after logging out and back in.

---

## Code Examples

### expo-secure-store Key API

```typescript
// Source: docs.expo.dev/versions/latest/sdk/securestore/
import * as SecureStore from 'expo-secure-store';

// Store — value must be a string; max ~2048 bytes (iOS keychain limit)
await SecureStore.setItemAsync('auth_token', jwtToken);

// Read — returns string | null (null if key does not exist)
const token = await SecureStore.getItemAsync('auth_token');

// Delete — on logout
await SecureStore.deleteItemAsync('auth_token');

// Key naming rules: alphanumeric + . - _ only
// Good: 'auth_token', 'has_registered'
// Bad: 'auth token', 'auth:token'
```

### Inline Field Validation Pattern (D-13)

```typescript
// RNP TextInput + HelperText for inline error display
// Source: callstack.github.io/react-native-paper/
import { TextInput, HelperText } from 'react-native-paper';
import { useState } from 'react';

function EmailField() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!value.includes('@')) {
      setError('Please enter a valid email address.');
    } else {
      setError('');
    }
  };

  return (
    <>
      <TextInput
        mode="outlined"
        label="Email"
        value={value}
        onChangeText={setValue}
        onBlur={validate}          // Validate on blur per UI-SPEC
        error={!!error}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
    </>
  );
}
```

### Auth Loading State — Disable Form During Request (Claude's Discretion)

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSignUp = async () => {
  setIsLoading(true);
  try {
    const { token } = await authService.signUp(email, password);
    await authContext.signIn(token);
  } catch (err: any) {
    setFieldError(mapErrorCodeToMessage(err.code));
  } finally {
    setIsLoading(false);
  }
};

// In JSX:
<Button
  mode="contained"
  onPress={handleSignUp}
  disabled={isLoading}
  loading={isLoading}   // RNP Button has built-in loading prop
>
  Create Account
</Button>
```

### Logout Confirmation Dialog (D-15)

```typescript
// Source: callstack.github.io/react-native-paper/ — Dialog
import { Dialog, Button, Portal } from 'react-native-paper';

<Portal>
  <Dialog visible={showLogout} onDismiss={() => setShowLogout(false)}>
    <Dialog.Title>Log Out?</Dialog.Title>
    <Dialog.Content>
      <Text>You'll need to sign in again to access your account.</Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={() => setShowLogout(false)}>Cancel</Button>
      <Button
        onPress={handleLogout}
        textColor={DSColors.destructive}  // Destructive color per UI-SPEC
      >
        Log Out
      </Button>
    </Dialog.Actions>
  </Dialog>
</Portal>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| NativeWind `styled()` HOC | `cssInterop` / `remapProps` + jsxImportSource transform | NativeWind v4 | No more component wrapping boilerplate; className works natively on RN components |
| NativeWind requires `babel-plugin-module-resolver` | `withNativeWind` metro plugin handles all transforms | NativeWind v4 | Simpler config; metro.config.js is the entry point |
| Separate AuthStack / AppStack navigators with conditional rendering at root | Single Stack.Navigator with conditional screens inside | React Navigation v6 | Enables proper transition animations; recommended pattern from official docs |
| React Navigation `navigate()` call on sign-in | Auth state change triggers automatic navigator update | React Navigation v6 | Eliminates race conditions and navigation-after-unmount errors |
| WebView-based Google OAuth | Native `@react-native-google-signin` SDK | Google deprecation | Google deprecated WebView OAuth; native SDK required for App Store compliance |
| RNP Material Design 2 (MD2) theme | MD3 (Material You) via `MD3LightTheme` | RNP v5 | Full MD3 color system with more semantic tokens; better dark mode support |
| expo-splash-screen v1 `hideAsync()` | `setOptions()` for fade animation + `hideAsync()` | SDK 50+ | Fade animation now configurable; calling hideAsync still the hide mechanism |

**Deprecated/outdated:**
- `NativeWindStyleSheet` from NativeWind v2/v3: Renamed to `StyleSheet` in v4; import from `nativewind` not `react-native`
- `styled()` HOC from NativeWind: Removed in v4; use `remapProps`/`cssInterop`
- `SplashScreen.hideAsync()` inside `onLayout`: The `preventAutoHideAsync()` at module scope pattern is preferred

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `tailwindcss` v3.4.17 is the correct peer dep for NativeWind 4.2.6 | Standard Stack | NativeWind v4 targets Tailwind CSS v3; v4 or v5 Tailwind may have breaking changes |
| A2 | `react-native-paper` `Button` component has a built-in `loading` prop for ActivityIndicator | Code Examples | If not present, planner must add custom loading state + ActivityIndicator inside button |
| A3 | NativeWind v4 rem base of 14px applies to this Expo setup | Common Pitfalls | If overridden by default, dp values will be correct; if not set, text appears smaller |
| A4 | `deepmerge` package is needed for merging RNP + React Navigation themes | Standard Stack (Supporting) | Only needed if using `adaptNavigationTheme`; can be omitted if navigation theme not unified with Paper |
| A5 | Social auth mock in Phase 1 does not require actual Google/Apple OAuth credentials | Architecture | If stakeholder wants real OAuth tested in Phase 1, native config (google-services.json, Apple entitlements) must be set up |
| A6 | DS font Nunito Sans will be provided as a local asset (TTF/OTF file) | Pattern 1 | If loaded from Google Fonts CDN, use @expo-google-fonts instead of expo-font with local asset |

---

## Open Questions

1. **Design system color extraction**
   - What we know: The DS Storybook site requires JS execution to render color stories; hex values in UI-SPEC are placeholders.
   - What's unclear: The exact hex values for primary brand color, accent, error, and destructive colors.
   - Recommendation: Wave 0 task must be: developer opens DS site in browser, extracts hex values from the 4 color stories listed in UI-SPEC, and records them in theme.ts before any screen implementation.

2. **Font asset delivery**
   - What we know: Font is Nunito Sans (confirmed from DS site); weights 400 and 700 confirmed. D-12 says user will share font details.
   - What's unclear: Will font be a local asset, Google Fonts, or Expo Google Fonts package?
   - Recommendation: Plan task as `// TODO: Replace with DS font` placeholder; user provides font before implementation task runs.

3. **Google Sign-In OAuth credentials**
   - What we know: `@react-native-google-signin/google-signin` requires an `iosUrlScheme` from Google Cloud Console and SHA-1 fingerprints for Android.
   - What's unclear: Will developer set up Google Cloud Console credentials in Phase 1, or will social auth remain fully mocked?
   - Recommendation: Plan the UI and mock flow first; gate real OAuth config behind a separate sub-task with a `checkpoint:human-verify`. Mock returns a fake token without hitting Google.

4. **Icon library for tab bar**
   - What we know: UI-SPEC notes "TODO — confirm from VoltVenture DS icon gallery story". Claude's Discretion covers icon selection.
   - What's unclear: Does the DS provide a custom icon font, or should react-native-vector-icons / @expo/vector-icons be used?
   - Recommendation: Use `@expo/vector-icons` (MaterialCommunityIcons) as placeholder; update when DS icon library is confirmed.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All npm installs | ✓ (implied by npm being available) | 24.14.0 | — |
| npm | Package installation | ✓ | checked via npm view | — |
| Expo CLI (`npx expo`) | Project scaffold, dev server, prebuild | [ASSUMED] | — | Install via: `npm install -g expo-cli` or use `npx expo` |
| Xcode / iOS Simulator | iOS development build for Google Sign-In | Unknown | — | Use Android or physical device |
| Android Studio / emulator | Android development build | Unknown | — | Use iOS or physical device |
| EAS CLI | Building development build without Xcode/Android Studio | Unknown | — | Install: `npm install -g eas-cli` |

**Missing dependencies with no fallback:**
- Expo project must be created (greenfield — no existing codebase)

**Missing dependencies with fallback:**
- iOS/Android native toolchain: needed for Google Sign-In dev build; EAS Build is a cloud fallback that does not require local Xcode/Android Studio

---

## Project Constraints (from CLAUDE.md)

| Directive | Type | Implication for Phase 1 |
|-----------|------|------------------------|
| All UI must use Volt Venture Design System tokens (colors, typography, spacing) | Required | theme.ts must be created before any screen implementation; color TODOs must be resolved first |
| Use React Native Paper as the base; extend with NativeWind utility classes | Required | PaperProvider wraps app root; NativeWind handles layout/spacing; RNP handles form components |
| Frontend only — backend calls are mocked/stubbed | Required | authService.ts exports mock implementation only; no real API endpoints in Phase 1 |
| Each phase scope revealed by user; do not add features beyond what is asked | Required | Deferred items (profile, biometrics, notifications) must not appear in Phase 1 plan |
| Tech stack locked: React Native + React Native Paper + NativeWind | Required | No substitutions; alternatives in research are for context only |

---

## Validation Architecture

> `workflow.nyquist_validation` is `false` in config.json — this section is skipped per config.

---

## Security Domain

> Phase 1 handles auth tokens and user credentials. Standard controls apply.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Mock auth service; real auth deferred. Passwords validated client-side (min 8 chars) before mock call |
| V3 Session Management | yes | expo-secure-store (OS keychain) for token storage; deleteItemAsync on logout |
| V4 Access Control | yes | Navigator-level guard: AppTabs only renders when `userToken != null` |
| V5 Input Validation | yes | Client-side: email format + password length on blur. Mock service also validates. |
| V6 Cryptography | no | Token storage uses OS keychain (expo-secure-store); no custom crypto |

### Known Threat Patterns for React Native Auth

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Token in AsyncStorage (unencrypted) | Info Disclosure | Use expo-secure-store (OS keychain) — never AsyncStorage for tokens |
| Double-submit on tap | Tampering | Disable button + set `isLoading` immediately on first tap |
| Password visible in logs | Info Disclosure | Never log password field values; use `secureTextEntry` on password TextInput |
| WebView-based OAuth | Spoofing | Use native SDK (@react-native-google-signin) — WebView OAuth is deprecated by Google |
| Apple credential only returned once | Info Disclosure | Store name/email on first sign-in; do not rely on re-requesting from Apple |

---

## Sources

### Primary (HIGH confidence)
- [reactnavigation.org/docs/auth-flow/](https://reactnavigation.org/docs/auth-flow/) — auth flow pattern, useReducer, isLoading, token restoration
- [docs.expo.dev/versions/latest/sdk/splash-screen/](https://docs.expo.dev/versions/latest/sdk/splash-screen/) — SplashScreen.preventAutoHideAsync, hideAsync, initialization pattern
- [docs.expo.dev/versions/latest/sdk/font/](https://docs.expo.dev/versions/latest/sdk/font/) — useFonts hook, splash screen integration
- [docs.expo.dev/versions/latest/sdk/apple-authentication/](https://docs.expo.dev/versions/latest/sdk/apple-authentication/) — expo-apple-authentication config, iOS-only pattern, credential gotchas
- [docs.expo.dev/guides/google-authentication/](https://docs.expo.dev/guides/google-authentication/) — Google auth in Expo, dev build requirement
- [oss.callstack.com/react-native-paper/docs/guides/theming](http://oss.callstack.com/react-native-paper/docs/guides/theming) — MD3 theme shape, PaperProvider, component-level overrides
- [react-native-google-signin.github.io/docs/setting-up/expo](https://react-native-google-signin.github.io/docs/setting-up/expo) — config plugin setup, Expo Go limitation, development build requirement
- [nativewind.dev/docs/getting-started/installation](https://www.nativewind.dev/docs/getting-started/installation) — v4 tailwind.config.js, babel.config.js, metro.config.js, withNativeWind
- [nativewind.dev/docs/guides/third-party-components](https://www.nativewind.dev/docs/guides/third-party-components) — cssInterop, remapProps for RNP components
- [nativewind.dev/blog/announcement-nativewind-v4](https://www.nativewind.dev/blog/announcement-nativewind-v4) — v4 breaking changes, styled() removal, rem scaling change
- npm registry — all package versions and repository URLs verified [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)
- [github.com/nativewind/nativewind/discussions/251](https://github.com/nativewind/nativewind/discussions/251) — NativeWind + RNP compatibility confirmed by maintainer ("works with any component accepting style prop")
- [github.com/tristanmanchester/agent-skills/blob/HEAD/styling-nativewind-v4-expo/SKILL.md](https://github.com/tristanmanchester/agent-skills/blob/HEAD/styling-nativewind-v4-expo/SKILL.md) — NativeWind v4 Expo setup checklist, TypeScript types, Metro cache gotcha
- WebSearch: KeyboardAvoidingView behavior patterns — cross-verified with reactnative.dev/docs/keyboardavoidingview

### Tertiary (LOW confidence)
- WebSearch: deepmerge for RNP + React Navigation theme merging — referenced in community guides, not verified in official docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified on npm registry with source repos confirmed
- Auth flow pattern: HIGH — sourced directly from React Navigation official docs
- NativeWind v4 config: HIGH — sourced from official nativewind.dev docs
- RNP + NativeWind co-theming: MEDIUM — approach is correct but exact token mapping requires developer verification against DS site
- Social auth setup: HIGH — sourced from official Expo and google-signin docs; Expo Go limitation is documented fact
- Pitfalls: HIGH (based on official docs); MEDIUM (rem scaling — verified from v4 announcement blog)

**Research date:** 2026-08-13
**Valid until:** 2026-09-13 (30 days — stable ecosystem; NativeWind v5 is pre-release and does not affect v4 setup)
