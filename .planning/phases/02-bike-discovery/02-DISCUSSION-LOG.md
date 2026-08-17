# Phase 2: Bike Discovery - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-17
**Phase:** 02-Bike Discovery
**Areas discussed:** Map library, Bike pin style, Detail panel, Filter + list toggle

---

## Map Library

### Map provider choice

| Option | Description | Selected |
|--------|-------------|----------|
| react-native-maps (Recommended) | Battle-tested standard for React Native, Expo config plugin, large community | ✓ |
| expo-maps (new in SDK 56+) | Expo's first-party maps package, still early access, evolving API | |

**User's choice:** react-native-maps
**Notes:** No special rationale given — recommended option accepted.

### Map tiles / provider

| Option | Description | Selected |
|--------|-------------|----------|
| Google Maps | Requires Google Maps API key on both platforms | |
| Apple Maps on iOS / Google on Android | Default react-native-maps behavior, no API key needed on iOS | ✓ |
| You decide | Defer to planner | |

**User's choice:** Apple Maps on iOS / Google Maps on Android (default behavior)
**Notes:** Avoids Google API key setup for iOS. Simpler configuration.

---

## Bike Pin Style

### Marker design

| Option | Description | Selected |
|--------|-------------|----------|
| Custom icon — branded bolt (Recommended) | Electric Green circle with bolt icon inside, pin tail | ✓ |
| Battery-aware icon | Pin color changes based on battery level (green/amber/red) | |
| Simple dot / default pin | Standard react-native-maps Marker pin in Electric Green | |

**User's choice:** Custom branded bolt icon in Electric Green (#C6FF2D)
**Notes:** No special notes — recommended option accepted.

### Clustering

| Option | Description | Selected |
|--------|-------------|----------|
| No clustering (Recommended) | Individual pins always visible, simpler implementation | ✓ |
| Cluster with count badge | Groups nearby pins into a single circle with count badge | |

**User's choice:** No clustering
**Notes:** Appropriate for mock data set size (10–30 bikes).

---

## Detail Panel

### How bike details appear

| Option | Description | Selected |
|--------|-------------|----------|
| Bottom sheet (Recommended) | Slide-up panel, map stays visible above it | ✓ |
| Full-screen modal | Navigates to dedicated Bike Detail screen, loses map context | |
| Overlay card on map | Small floating card near selected pin, limited space | |

**User's choice:** Bottom sheet
**Notes:** Map remains visible while reviewing bike details — ideal for tourist context.

### Bottom sheet content

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal — key stats + Reserve (Recommended) | Drag handle, name, type, battery %, price/min, distance, Reserve button | ✓ |
| Extended — stats + photo + Reserve | Adds bike photo/illustration above stats | |

**User's choice:** Minimal content
**Notes:** Clean and fast to scan — appropriate for tourist making a quick decision.

---

## Filter + List Toggle

### Filter placement

| Option | Description | Selected |
|--------|-------------|----------|
| Filter button → modal (Recommended) | Filter icon top-right, opens bottom sheet with all controls | ✓ |
| Inline chip bar | Horizontal scrollable row of filter chips pinned above the map | |

**User's choice:** Filter button → modal
**Notes:** Keeps map surface clean until filters are needed.

### Filter controls

| Option | Description | Selected |
|--------|-------------|----------|
| Segmented selectors (Recommended) | Chip buttons for Battery (Low/Med/High), Price (Low/Med/High), Type (Standard/Speed/Cargo) | ✓ |
| Sliders + chips | Range sliders for battery and price, chips for type | |

**User's choice:** Segmented chip selectors with Apply button
**Notes:** Touch-friendly, no sliders needed, fast interaction.

### Map/List switch mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| FAB on map / header toggle on list (Recommended) | FAB "List view" on map; "Map" button in list header | ✓ |
| Toggle switch in header | Segmented Map/List control always in the MapScreen header | |

**User's choice:** FAB on map, header button on list
**Notes:** Clear and unambiguous — each view has one obvious way to switch.

### List item design

| Option | Description | Selected |
|--------|-------------|----------|
| Row card — compact (Recommended) | Two-row card: bolt + ID + type / battery % + distance | ✓ |
| Taller card with price | Three-row card adding price/min | |

**User's choice:** Compact two-row card
**Notes:** Tapping a list row opens the same bottom sheet as the map pin.

---

## Claude's Discretion

- Bottom sheet library choice (Expo SDK 57 compatible option)
- FAB exact position and styling
- Empty state UI when no bikes match active filters
- Location permission request UX
- Mock data structure and quantity
- Map initial region / camera position

## Deferred Ideas

- Bike pin clustering — future iteration if bike count grows
- Real-time availability updates — backend integration phase
- Route/navigation to a selected bike — Phase 3 or later
- Saved/favourite bikes — v2
- Bike photos in detail sheet — not in Phase 2 scope
