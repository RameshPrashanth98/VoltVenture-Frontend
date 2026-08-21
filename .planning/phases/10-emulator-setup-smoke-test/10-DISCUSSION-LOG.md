# Phase 10: Emulator Setup & Smoke Test - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-21
**Phase:** 10-emulator-setup-smoke-test
**Areas discussed:** Google Maps API key, Native plugin risks, UAT results tracking, Fix scope for Phase 10

---

## Google Maps API Key

| Option | Description | Selected |
|--------|-------------|----------|
| Google Maps free tier key | Get a real Google Maps API key (free within $200/month credit). No code changes — fill in app.json placeholder. | |
| Accept blank map for now | Leave placeholder as-is. Map shows grey but tab still loads. | |
| Swap to mock map view | Replace react-native-maps with static image for UAT. | |
| OpenStreetMap + MapLibre native SDK | Replace react-native-maps with @maplibre/maplibre-react-native using OSM tiles. Native performance, no API key needed. | ✓ |

**User's choice:** OpenStreetMap + Leaflet for right now (clarified to MapLibre native SDK — Leaflet is web-only and not native RN)
**Notes:** User wants a free map solution that avoids Google Maps API key requirement for UAT. MapLibre + OSM chosen as the best-fit native implementation. Google Maps is the planned future target after backend integration.

---

## Native Plugin Risks

| Option | Description | Selected |
|--------|-------------|----------|
| Expect graceful failure | Leave plugins in place. Google Sign-In is mocked. Apple auth silently no-ops on Android. Only fix if actual crash. | ✓ |
| Remove / stub both plugins | Remove from app.json plugins for UAT build. Eliminates risk but requires config changes. | |
| Fix Google Sign-In config only | Add real or dummy Google client ID to app.json, keep Apple auth. | |

**User's choice:** Expect graceful failure (Recommended)
**Notes:** Google Sign-In is already behind getMockGoogleToken mock. No expected issues. Only intervene if actual build or startup crash surfaces.

---

## UAT Results Tracking

| Option | Description | Selected |
|--------|-------------|----------|
| VERIFICATION.md per phase | Each UAT phase writes its own VERIFICATION.md with REQ-ID checklist, pass/fail, failure notes. Standard GSD pattern. | ✓ |
| Single UAT-RESULTS.md | One master file updated across all 4 phases. Easier to see overall status. | |
| Inline in REQUIREMENTS.md | Check off requirements directly in REQUIREMENTS.md as they pass. | |

**User's choice:** VERIFICATION.md per phase (Recommended)
**Notes:** Standard GSD pattern. Each phase owns its results independently.

---

## Fix Scope for Phase 10

| Option | Description | Selected |
|--------|-------------|----------|
| Fix blockers inline, log the rest | Fix SETUP-01/02 blockers in Phase 10. Log cosmetic/non-blocker failures for FIX-01. | ✓ |
| Fix everything inline in Phase 10 | Phase 10 resolves all issues found before moving to Phase 11. | |
| Log all, fix in Phase 13 only | Phase 10 documents failures only. All fixes in Phase 13 FIX-01. | |

**User's choice:** Fix blockers inline, log the rest (Recommended)
**Notes:** Ensures Phases 11-12 start from a working baseline (all tabs accessible, no startup crash). Non-blocking issues accumulate in VERIFICATION.md and are addressed in FIX-01.

---

## Claude's Discretion

- MapLibre equivalent API mapping for react-native-maps components (MapView → MapLibreGL.MapView, Marker → MapLibreGL.PointAnnotation, etc.) — implementation detail for the planner/executor
- OSM tile URL selection (standard OSM or a hosted tile provider) — Claude's discretion

## Deferred Ideas

- Google Maps API key integration — deferred to v3.0 backend integration milestone
- iOS emulator UAT — Android-only for v1.2; iOS deferred
- EAS dev build / Expo Go compatibility — emulator-only for v1.2
