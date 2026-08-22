---
phase: 10-emulator-setup-smoke-test
plan: "01"
subsystem: infra
tags: [maplibre, react-native-maps, expo, prebuild, android, gradle, osm]

# Dependency graph
requires:
  - phase: v1.1-complete-frontend
    provides: App codebase with react-native-maps used across 7 screens
provides:
  - "@maplibre/maplibre-react-native 11.3.6 installed and configured"
  - "react-native-maps removed from package.json and app.json"
  - "MapLibreGL.setAccessToken(null) initialized in index.ts"
  - "Native Android project regenerated via expo prebuild --clean"
  - "Gradle fixes reapplied: -Xmx4g heap + newArchEnabled=false"
affects: [10-02-screen-migration, 10-03-build-smoke-test]

# Tech tracking
tech-stack:
  added:
    - "@maplibre/maplibre-react-native 11.3.6 (RN 0.86.x / Expo 57 compatible, OSM tiles)"
  patterns:
    - "MapLibreGL.setAccessToken(null) called at app entry before registerRootComponent"
    - "Gradle fixes are disk-only (android/ gitignored) — must reapply after every expo prebuild --clean"

key-files:
  created: []
  modified:
    - "VoltVenture/package.json — react-native-maps removed; @maplibre/maplibre-react-native added"
    - "VoltVenture/package-lock.json — updated after install"
    - "VoltVenture/app.json — react-native-maps plugin removed; @maplibre/maplibre-react-native plugin added"
    - "VoltVenture/index.ts — MapLibreGL import + setAccessToken(null) added before registerRootComponent"
    - "VoltVenture/android/gradle.properties — Gradle fixes applied (disk-only, gitignored)"

key-decisions:
  - "MapLibre 11.3.6 chosen: latest stable, requires RN >=0.80.0 (have 0.86.2) and Expo >=54.0.0 (have 57)"
  - "@maplibre/maplibre-react-native plugin added to app.json (has app.plugin.js that sets gradle properties)"
  - "setAccessToken(null) — OSM tiles require no API key; called before registerRootComponent in index.ts"
  - "Gradle fix 1: -Xmx4g -XX:MaxMetaspaceSize=512m + --add-opens flags (prevents OOM Metaspace)"
  - "Gradle fix 2: newArchEnabled=false (prevents CMake failure with react-native-worklets + JDK 17/21)"

patterns-established:
  - "After every expo prebuild --clean: immediately reapply both Gradle fixes to android/gradle.properties"

requirements-completed: []  # SETUP-01 and SETUP-02 verified in Plan 10.3

# Metrics
duration: 15min
completed: 2026-08-22
---

# Phase 10, Plan 01: MapLibre Dependency Swap & App Configuration Summary

**react-native-maps replaced with @maplibre/maplibre-react-native 11.3.6 using OSM tiles (no API key), native Android project regenerated via expo prebuild --clean, and critical Gradle fixes reapplied**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-08-22T00:00:00Z
- **Completed:** 2026-08-22T00:15:00Z
- **Tasks:** 7 (research + remove + install + app.json + index.ts + prebuild + gradle fixes)
- **Files modified:** 5 (package.json, package-lock.json, app.json, index.ts — plus android/gradle.properties disk-only)

## Accomplishments

- Removed `react-native-maps 1.27.2` from all tracked files (package.json, app.json plugin)
- Installed `@maplibre/maplibre-react-native 11.3.6` — compatible with RN 0.86.2 and Expo SDK 57
- Added `@maplibre/maplibre-react-native` Expo plugin to app.json (has app.plugin.js for Gradle properties)
- Initialized `MapLibreGL.setAccessToken(null)` in index.ts before `registerRootComponent` (OSM = no token)
- Ran `expo prebuild --platform android --clean` successfully — native Android project regenerated
- Reapplied both critical Gradle fixes immediately after prebuild: JVM heap (-Xmx4g) and newArchEnabled=false

## Task Commits

1. **Tasks 2-5: Package swap + app.json + index.ts** - `96c3648` (chore)

Tasks 6-7 (prebuild + Gradle fixes) are disk-only operations on the gitignored `android/` directory — no commit needed.

## Files Created/Modified

- `VoltVenture/package.json` — react-native-maps removed; @maplibre/maplibre-react-native@^11.3.6 added
- `VoltVenture/package-lock.json` — updated (15 packages added, 1 removed)
- `VoltVenture/app.json` — react-native-maps plugin removed; @maplibre/maplibre-react-native plugin added
- `VoltVenture/index.ts` — MapLibreGL import and setAccessToken(null) added before registerRootComponent
- `VoltVenture/android/gradle.properties` (disk-only, gitignored) — JVM heap and newArchEnabled fixes

## Decisions Made

- **MapLibre 11.3.6 (latest stable):** Verified peer deps: react-native >=0.80.0 (have 0.86.2), expo >=54.0.0 (have 57.0.12). No --legacy-peer-deps needed.
- **Plugin added to app.json:** MapLibre has `app.plugin.js` that configures Gradle properties during prebuild. Added `"@maplibre/maplibre-react-native"` (no config props needed for OSM).
- **setAccessToken(null) in index.ts:** OSM tiles require no API key. Called before registerRootComponent so it runs at app startup before any map renders.
- **Gradle Fix 1 — JVM heap:** `-Xmx4g -XX:MaxMetaspaceSize=512m -Dfile.encoding=UTF-8 --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.io=ALL-UNNAMED`. Prevents OutOfMemoryError: Metaspace during Gradle build with many RN native modules.
- **Gradle Fix 2 — newArchEnabled=false:** Prevents CMake configureCMakeDebug failure for react-native-worklets and react-native-screens with JDK 17/21. Required for UAT.

## Deviations from Plan

None — plan executed exactly as written. The only discovery was that MapLibre has `app.plugin.js` (not documented in the plan), so the plugin entry was added to app.json per the plan's instruction to "add it only if required" (it is required for proper Gradle integration during prebuild).

## Issues Encountered

None. Prebuild completed without errors. MapLibre 11.3.6 installed without peer dependency conflicts.

## User Setup Required

None — no external service configuration required for this plan.

## Next Phase Readiness

- **Plan 10.2 (Screen Migration) is unblocked:** `@maplibre/maplibre-react-native` is installed and the import path is `@maplibre/maplibre-react-native`
- **Plan 10.3 (Build + Smoke Test) is unblocked:** Native Android project is rebuilt with MapLibre native module linked
- **CRITICAL REMINDER for any future `expo prebuild --clean`:** Immediately reapply both Gradle fixes to `android/gradle.properties` — the file is gitignored and will be regenerated from scratch each time

---
*Phase: 10-emulator-setup-smoke-test*
*Completed: 2026-08-22*
