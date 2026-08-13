---
status: testing
phase: 01-foundation-and-authentication
source:
  - 01-01-SUMMARY.md
  - 01-02-SUMMARY.md
  - 01-03-SUMMARY.md
  - 01-05-SUMMARY.md
  - 01-06-SUMMARY.md
started: 2026-08-13T00:00:00Z
updated: 2026-08-13T00:00:00Z
---

## Current Test

number: 1
name: App Cold Start
expected: |
  Open the app in Expo Go (or simulator). The app loads without a red error screen.
  You see a bright green (#C6FF2D) full-screen background with "VoltVenture" and a tagline
  centered in dark text (#0F0F0F). No crash, no blank white screen.
awaiting: user response

## Tests

### 1. App Cold Start
expected: Open the app in Expo Go (or simulator). The app loads without a red error screen. You see a bright green (#C6FF2D) full-screen background with "VoltVenture" and a tagline centered in dark text. No crash, no blank white screen.
result: [pending]

### 2. Splash Auto-Advance to Onboarding
expected: After ~2 seconds, the splash screen automatically transitions to the Onboarding screen showing the first slide with a grey placeholder area (labelled "[ Illustration ]"), a headline, tagline, and 3 progress dots at the bottom. No user tap needed.
result: [pending]

### 3. Onboarding Skip Link
expected: On slide 1 or 2, a "Skip" link is visible in the top-right area. Tapping it navigates directly to the Auth Landing screen ("VoltVenture" brand + "Ready to ride?" tagline + Create Account button + Log in link). The skip link is NOT visible on slide 3.
result: [pending]

### 4. Onboarding Slide Progression and Get Started
expected: Swipe left through all 3 slides. Progress dots update as you swipe (active dot is darker/accent colored). On slide 3, a "Get Started" button appears at the bottom instead of Skip. Tapping "Get Started" navigates to the Auth Landing screen.
result: [pending]

### 5. Auth Landing → Sign Up and Log In Navigation
expected: On the Auth Landing screen, tapping "Create Account" navigates to the Sign Up screen. Going back, tapping "Log in" navigates to the Login screen. Both links work.
result: [pending]

### 6. Sign Up — Field Validation
expected: On the Sign Up screen, tap "Create Account" with empty fields. An email error appears (e.g. "Please enter a valid email"). Enter a short password (< 8 chars) and a valid email, tap submit — a password error appears. Errors clear when you start typing in the relevant field.
result: [pending]

### 7. Sign Up — Success Flow
expected: Enter a valid email (not taken@example.com) and a password of 8+ characters. Tap "Create Account". A loading indicator appears briefly, then the app navigates automatically to the main app tabs (Map tab visible). No manual navigation.navigate() needed.
result: [pending]

### 8. Login — Wrong Password Error
expected: On the Login screen, enter any email and a wrong password (not "password123"). Tap "Log In". The password field shows an inline error: "Incorrect password. Try again or reset your password." No form-level error banner.
result: [pending]

### 9. Login — Success Flow
expected: Enter any email and password "password123". Tap "Log In". Loading indicator appears, then app navigates to AppTabs (Map + Account tabs visible in the tab bar).
result: [pending]

### 10. Forgot Password Flow
expected: On the Login screen, tap "Forgot password?". The Forgot Password screen opens ("Reset your password" title, email field, "Send Reset Link" button). Enter any email and tap the button. A success state appears: envelope-check icon, "Check your inbox" title, interpolated message with the email you entered, and a "Back to Log In" link.
result: [pending]

### 11. Continue with Google — Sign Up Screen
expected: On the Sign Up screen (reached without signing in), tap "Continue with Google". The button shows as outlined (white/light background with border, Google icon + label). After ~1 second, the app navigates to AppTabs — simulating a successful mock Google sign-in. No real Google popup appears.
result: [pending]

### 12. Continue with Google — Login Screen
expected: Same as above but from the Login screen. "Continue with Google" button visible, tapping it → ~1 second delay → navigates to AppTabs.
result: [pending]

### 13. Account Tab — Visible Content
expected: In AppTabs, tap the Account tab. The screen shows "Account" as the title and a "Log Out" row (text in red/destructive color) with a chevron. No other content (profile editing is deferred to v2).
result: [pending]

### 14. Logout — Confirmation Dialog
expected: On the Account screen, tap "Log Out". A dialog appears with title "Log Out?", body "You'll need to sign in again to access your account.", and two buttons: Cancel and Log Out. Tapping Cancel dismisses the dialog. Tapping Log Out returns the app to the Login screen (not Onboarding — since user has registered, has_registered persists).
result: [pending]

## Summary

total: 14
passed: 0
issues: 0
skipped: 0
blocked: 0
pending: 14

## Gaps

[none yet]
