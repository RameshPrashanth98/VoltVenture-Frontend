---
plan: "01-05"
title: "Social Auth — Google + Apple Sign-In Buttons, Mock OAuth Flow"
status: completed
commit: f93cd63
---

## What was built

**SocialAuthButton component** (`src/components/common/SocialAuthButton.tsx`)
- Outlined full-width button: surface bg, border stroke, 48dp height, 8dp radius
- MaterialCommunityIcons icon (left) + bold label (centered), disabled → opacity 0.5
- `getMockGoogleToken()` exported: 1s delay → 'mock-google-token-' + Date.now()
- Comment documents real GoogleSignin.signIn() swap path for integration phase

**SignUpScreen + LoginScreen** — social stubs replaced with wired handlers:
- `handleGoogleSignIn`: getMockGoogleToken() → authContext.signIn(token); formError on failure
- `handleAppleSignIn`: AppleAuthentication.signInAsync() → mock-apple-token; ERR_REQUEST_CANCELED = silent return
- Google: SocialAuthButton component (iconName="google"), disabled={isLoading}
- Apple: AppleAuthentication.AppleAuthenticationButton (App Store compliant), iOS-only Platform guard, height 44, cornerRadius 8

## Decisions

- Real GoogleSignin.signIn() not called in Phase 1 — requires dev build + OAuth credentials (see RESEARCH.md Pitfall 1). getMockGoogleToken() bypasses this cleanly.
- Apple credential storage (name/email) deferred to integration phase — comment in code explains why (not re-returned on repeat sign-in).
- Removed unused social stub styles (socialButton, socialButtonGap, socialButtonText); replaced with `gap: 12` on socialContainer and `appleButton` style.
- TouchableOpacity kept in SignUpScreen imports — still used for back button and login row link.

## Verification

- `npx tsc --noEmit` exits 0
- AUTH-04 delivered: Google mock sign-in wired on both screens; Apple button iOS-only
- ERR_REQUEST_CANCELED silent cancellation per UI-SPEC
- Double-submit protected: isLoading disables all social buttons during any in-flight request
