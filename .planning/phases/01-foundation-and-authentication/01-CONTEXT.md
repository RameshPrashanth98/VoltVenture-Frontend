# Phase 1: Foundation & Authentication - Context

**Gathered:** 2026-08-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold the React Native app project, integrate the VoltVenture design system globally, and deliver a fully working auth flow: splash screen, 3-slide onboarding, sign up (email/password + social), login, and password reset. This phase establishes the navigation architecture and theming foundation that all subsequent phases build on.

</domain>

<decisions>
## Implementation Decisions

### App Entry Flow
- **D-01:** Entry sequence: Splash screen → Onboarding (3 feature slides) → Auth landing
- **D-02:** Onboarding shows on every cold start until the user creates an account; once registered, onboarding is skipped on subsequent launches
- **D-03:** 3 feature slides: "Find bikes" → "Unlock" → "Explore" — each with a visual, headline, and short tagline
- **D-04:** After onboarding, auth landing presents Sign Up as the primary CTA (large button); "Already have an account? Log in" as a secondary link below

### Navigation Structure
- **D-05:** Root navigator is a stack that switches between two child navigators based on auth state:
  - **AuthStack**: Splash → Onboarding → Auth landing → Sign Up → Log In → Forgot Password
  - **AppTabs**: Bottom tab bar with 2 tabs for Phase 1 — Map and Account
- **D-06:** Bottom tab bar has 2 tabs in Phase 1: Map and Account (additional tabs added in later phases)
- **D-07:** All auth screens are headerless — no native navigation header bar. Each screen manages its own back navigation via custom UI elements.

### Design System Integration
- **D-08:** Design system tokens (colors, typography, spacing) are extracted manually from the VoltVenture design system site (https://volt-venture-design-system.vercel.app/) and codified into a `theme.ts` file
- **D-09:** Theme is applied via React Native Paper's `PaperProvider` at the app root — all RNP components inherit DS tokens automatically
- **D-10:** NativeWind `tailwind.config.js` extends the same DS color and font values so utility classes stay in sync with the RNP theme
- **D-11:** Priority components to theme in Phase 1: Button (primary/secondary/ghost variants), TextInput (with label + error states), Typography (heading + body), and the global color palette
- **D-12:** Font: user will share the VoltVenture design system's font details before implementation. Do not hardcode a placeholder font — leave a clear TODO with a comment.

### Auth UX Details
- **D-13:** Auth error display: inline field errors — error text appears directly below the offending input field (e.g., "Incorrect password", "Email already in use")
- **D-14:** Session persistence: token stored in SecureStorage; session persists until the user explicitly logs out. No automatic expiry on the frontend — backend token expiry respected.
- **D-15:** Logout flow: confirmation dialog ("Are you sure?") → on confirm, clear session and navigate to the Login screen (not onboarding)
- **D-16:** Social auth libraries: `@react-native-google-signin/google-signin` for Google, `expo-apple-authentication` for Apple sign-in

### Claude's Discretion
- Loading/spinner behavior on auth actions (login button disabled + spinner while request is in flight)
- Keyboard avoidance behavior on forms (KeyboardAvoidingView configuration)
- Specific animation for splash → onboarding transition
- Tab bar icon selection (pending design system icon library review)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `https://volt-venture-design-system.vercel.app/` — VoltVenture design system site. Extract color tokens, typography scale, spacing, and component variants. All UI must conform to this system.

### Project Planning
- `.planning/PROJECT.md` — Project context, constraints, core value, and tech stack decisions
- `.planning/REQUIREMENTS.md` — v1 requirements with REQ-IDs (AUTH-01 through AUTH-05 are in scope for this phase)
- `.planning/ROADMAP.md` — Phase goals and success criteria

### Libraries (Phase 1)
- React Native Paper: https://callstack.github.io/react-native-paper/ — theming API, PaperProvider, component docs
- NativeWind v4: https://www.nativewind.dev/ — Tailwind CSS for React Native, config setup
- React Navigation v6+: https://reactnavigation.org/ — stack and tab navigator setup, auth flow patterns
- @react-native-google-signin/google-signin — Google OAuth for React Native
- expo-apple-authentication — Apple sign-in for Expo projects

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — greenfield project. This phase establishes the foundation.

### Established Patterns
- None yet — all patterns established in this phase become the baseline for Phases 2–4.

### Integration Points
- `App.tsx` (root): PaperProvider + NativeWind + NavigationContainer wrapping the root stack
- `theme.ts`: DS token definitions exported and consumed by both PaperProvider and tailwind.config.js
- Auth state context/hook: consumed by the root navigator to switch between AuthStack and AppTabs

</code_context>

<specifics>
## Specific Ideas

- Tourist-first onboarding copy: slides should reference exploring the city, not generic "use our app" messaging
- Sign up screen: email + password fields only (keep it minimal for Phase 1; social buttons below the form)
- Inline error example: password field shows "Password must be at least 8 characters" in real time on blur
- Design system font details will be provided by user — leave a `// TODO: Replace with DS font` comment in theme.ts

</specifics>

<deferred>
## Deferred Ideas

- Profile editing (name, photo) — Phase 2+ or v2
- Notifications permissions prompt — not in Phase 1 auth scope
- Biometric login (Face ID / fingerprint) — potential v2 addition
- Multi-language/localization — out of scope for v1

</deferred>

---

*Phase: 1-Foundation & Authentication*
*Context gathered: 2026-08-13*
