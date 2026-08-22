---
phase: 10
plan: "10-02"
subsystem: maps
tags: [maplibre, migration, react-native-maps, screens]
dependency_graph:
  requires: ["10-01"]
  provides: ["10-03"]
  affects: ["MapScreen", "ActiveRideScreen", "EndRideFindChargingScreen", "VipHubsScreen", "NavigateToBikeScreen", "RidingToChargingScreen", "NavigateToPoiScreen"]
tech_stack:
  added: ["@maplibre/maplibre-react-native (MapLibreGL.MapView, MapLibreGL.Camera, MapLibreGL.PointAnnotation, MapLibreGL.UserLocation, MapLibreGL.ShapeSource, MapLibreGL.LineLayer)"]
  patterns: ["GeoJSON coordinate order [longitude, latitude]", "buildLineGeoJSON helper for Polyline replacement", "state-driven Camera ref for map pan (flyTo)"]
key_files:
  modified:
    - VoltVenture/src/screens/ride/ActiveRideScreen.tsx
    - VoltVenture/src/screens/charging/EndRideFindChargingScreen.tsx
    - VoltVenture/src/screens/discover/VipHubsScreen.tsx
    - VoltVenture/src/screens/app/MapScreen.tsx
    - VoltVenture/src/screens/navigation/NavigateToBikeScreen.tsx
    - VoltVenture/src/screens/charging/RidingToChargingScreen.tsx
    - VoltVenture/src/screens/navigation/NavigateToPoiScreen.tsx
decisions:
  - "Used MapLibreGL.Camera ref (flyTo) in VipHubsScreen to replace MapView.animateToRegion — no MapLibre MapView method equivalent exists"
  - "Wrapped BikeMarker/CafeMarker in View in MapScreen for PointAnnotation single-child requirement"
  - "Wrapped MaterialCommunityIcons in View in navigation/charging screens for PointAnnotation single-child requirement"
  - "PointAnnotation IDs follow pattern: bike-{id}, cafe-{id}, hub-{id}, charger-{name}, route-start, route-end, destination, user-location"
  - "zoomLevel 13 used for latitudeDelta 0.05 screens; zoomLevel 14 for latitudeDelta 0.02 screens"
metrics:
  duration: "~20 minutes"
  completed: "2026-08-22T15:16:19Z"
  tasks_completed: 7
  files_modified: 7
---

# Phase 10 Plan 02: MapLibre Screen Migration Summary

MapLibre API migration across all 7 react-native-maps screens — pure import/JSX swap with no business logic changes. All screens now use `MapLibreGL.MapView`, `MapLibreGL.Camera`, `MapLibreGL.PointAnnotation`, and (for 3 screens) `MapLibreGL.ShapeSource` + `MapLibreGL.LineLayer` for route polylines.

## Tasks Completed

| # | Screen | Commit | Type |
|---|--------|--------|------|
| 1 | ActiveRideScreen | a4ba80c | Marker-only |
| 2 | EndRideFindChargingScreen | a4ba80c | Marker-only |
| 3 | VipHubsScreen | bda4705 | Marker-only + animateToRegion |
| 4 | MapScreen | 4647bce | Marker + UserLocation + custom children |
| 5 | NavigateToBikeScreen | 056876a | Marker + Polyline |
| 6 | RidingToChargingScreen | 735509f | Marker + Polyline |
| 7 | NavigateToPoiScreen | d27387e | Marker + Polyline |

## Migration Patterns Applied

**MapView:** `<MapView initialRegion={...}>` → `<MapLibreGL.MapView styleURL="https://demotiles.maplibre.org/style.json">` + `<MapLibreGL.Camera centerCoordinate={[lon, lat]} zoomLevel={13} />`

**Marker:** `<Marker coordinate={{ latitude, longitude }}>` → `<MapLibreGL.PointAnnotation id="unique-id" coordinate={[longitude, latitude]}>`

**User location:** `showsUserLocation={true}` on MapView → `<MapLibreGL.UserLocation />` inside MapView

**Polyline:** `<Polyline coordinates={[{lat,lon},...]} strokeColor="..." strokeWidth={4} />` → `<MapLibreGL.ShapeSource id="route" shape={buildLineGeoJSON(...)}><MapLibreGL.LineLayer id="routeLine" style={{ lineColor, lineWidth }} /></MapLibreGL.ShapeSource>`

**Map pan (VipHubsScreen):** `mapRef.current?.animateToRegion({lat,lon,...}, 500)` → `cameraRef.current?.flyTo([lon, lat], 500)` using `MapLibreGL.Camera` ref

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] VipHubsScreen: animateToRegion not available on MapLibreGL.MapView**
- **Found during:** Task 3 (VipHubsScreen)
- **Issue:** The original screen used `mapRef.current?.animateToRegion(...)` on `MapView` — MapLibre's MapView does not expose this method. The equivalent is `MapLibreGL.Camera.flyTo(coordinate, duration)`.
- **Fix:** Changed `mapRef` from `useRef<MapView>` to `useRef<MapLibreGL.Camera>`, added `ref={cameraRef}` to `<MapLibreGL.Camera>`, replaced both `animateToRegion` call sites with `cameraRef.current?.flyTo([lon, lat], 500)`.
- **Files modified:** VipHubsScreen.tsx
- **Commit:** bda4705

**2. [Rule 2 - Missing critical] PointAnnotation single-child requirement for icon-only markers**
- **Found during:** Tasks 5, 6, 7 (navigation/charging screens with MaterialCommunityIcons as direct child)
- **Issue:** MapLibre PointAnnotation requires a single View child. Screens that used `<Marker><MaterialCommunityIcons ... /></Marker>` would crash — the icon is not a View.
- **Fix:** Wrapped all bare icon children in `<View>` before placing inside PointAnnotation.
- **Files modified:** NavigateToBikeScreen.tsx, RidingToChargingScreen.tsx, NavigateToPoiScreen.tsx
- **Commits:** 056876a, 735509f, d27387e

## Known Stubs

None — all map data sources remain as they were (mock data). No new stubs introduced.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundaries introduced.

## Self-Check: PASSED

- [x] All 7 screen files exist and modified
- [x] Zero `from 'react-native-maps'` imports remaining in src/
- [x] All coordinates use GeoJSON [longitude, latitude] order
- [x] All PointAnnotation `id` props are unique strings within each map
- [x] Polyline screens (5, 6, 7) have buildLineGeoJSON helper + ShapeSource/LineLayer
- [x] All 5 task commits exist in git log (a4ba80c, bda4705, 4647bce, 056876a, 735509f, d27387e)
