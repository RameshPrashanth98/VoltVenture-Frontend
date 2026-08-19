---
phase: 08-payments-and-rewards
plan: "03"
subsystem: rewards-and-stats
tags: [VoltCoins, rewards, ride-history, stats, account-navigation]
requires: [08-01]
provides: [VoltCoinsRewardsScreen, AccountScreen-VoltCoins-row, RideHistoryScreen-stats-header]
affects: [AccountNavigator, AccountScreen, RideHistoryScreen]
tech-stack:
  added: []
  patterns: [in-screen-computation, ScrollView-map, FlatList-ListHeaderComponent, Portal-Snackbar]
key-files:
  created:
    - VoltVenture/src/screens/app/VoltCoinsRewardsScreen.tsx
  modified:
    - VoltVenture/src/screens/app/AccountScreen.tsx
    - VoltVenture/src/screens/app/RideHistoryScreen.tsx
decisions:
  - "Balance computed live in component from rideService.getRideHistory() — no separate state or effect needed"
  - "ScrollView + map used for VoltCoinsRewardsScreen (not nested FlatList) to avoid VirtualizedLists warning"
  - "StatsHeader defined as JSX const (not function component) passed directly to ListHeaderComponent"
  - "CO2 formula: totalKm * 0.21 per D-09"
  - "Auto-fix: 'coins' icon replaced with 'hand-coin' — 'coins' is not a valid MaterialCommunityIcons name"
metrics:
  duration: ~12 minutes
  completed: 2026-08-19T12:10:00Z
  tasks: 2
  files: 3
---

# Phase 8 Plan 03: VoltCoins Rewards Screen + Account Entry + Ride History Stats Summary

VoltCoins rewards screen with live balance (sum of ride costs x 10), earn history, and static rewards catalog; plus VoltCoins row in AccountScreen and 2x2 stats header in RideHistoryScreen via ListHeaderComponent.

## What Was Done

### Task 1: Create VoltCoinsRewardsScreen + add VoltCoins row to AccountScreen

Created `VoltCoinsRewardsScreen.tsx` with:
- Custom header: arrow-left back button + "VoltCoins Rewards" title + width:40 spacer (matching SecurityDepositScreen pattern)
- Balance card: `hand-coin` icon (48px, DSColors.primary) + balance as 48px bold number + "VoltCoins" label
- Balance computed inline: `rides.reduce((acc, r) => acc + Math.floor((r.costEur ?? 0) * 10), 0)`
- Earn history section: per-ride rows showing bike name + date (left) and +N VoltCoins (right); empty state when no rides
- Available Rewards section: 4 static reward cards from REWARDS module-level const; each has Redeem button
- Redeem button shows Snackbar "Rewards redemption coming soon" via Portal > Snackbar

Updated `AccountScreen.tsx`:
- Inserted VoltCoins Rewards row BETWEEN Payment Methods (line 109) and Settings (line 111)
- Uses `star-circle` icon, same `menuRow`/`menuRowLeft`/`menuRowText` styles as all other rows
- onPress: `navigation.navigate('VoltCoins')`

### Task 2: Add stats summary header to RideHistoryScreen

Updated `RideHistoryScreen.tsx`:
- Added 4 derived stats: totalRides, totalKm, totalEur, co2Kg (= totalKm * 0.21)
- Defined `StatsHeader` as JSX const before return, containing a 2x2 grid of stat tiles
- Tiles: Total Rides (bike icon), Distance (map-marker-distance icon), Total Spend (cash icon), CO2 Saved (leaf icon)
- Each tile: icon + large value (24px bold) + label (12px muted)
- "RIDE HISTORY" uppercase section label below the grid
- Added `ListHeaderComponent={StatsHeader}` to existing FlatList — no ScrollView wrapping
- Added StyleSheet entries: statsGrid, statsTile, statsTileCard, statValue, statLabel, rideHistoryLabel

## Files Changed

| File | Change |
|------|--------|
| `VoltVenture/src/screens/app/VoltCoinsRewardsScreen.tsx` | Created (205 lines) |
| `VoltVenture/src/screens/app/AccountScreen.tsx` | Added VoltCoins Rewards row (20 lines inserted) |
| `VoltVenture/src/screens/app/RideHistoryScreen.tsx` | Added stats header, derived stats, new StyleSheet entries |

## Verification Results

`npx tsc --noEmit` — **zero errors** after auto-fix of invalid icon name.

The `SelectPaymentMethodScreen` TS2459 error observed during Wave 1 check was from 08-02 (parallel plan), not from 08-03 files. After the icon fix, 08-03's own files produce no TS errors.

## Commits

| Hash | Message |
|------|---------|
| `464fa78` | feat(08-03): VoltCoins rewards screen + account entry + ride history stats |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced invalid 'coins' icon with 'hand-coin'**
- **Found during:** TypeScript verification
- **Issue:** `MaterialCommunityIcons name="coins"` is not a valid icon name — TS2322 error. The icon set does not include "coins"; closest match is "hand-coin".
- **Fix:** Changed `name="coins"` to `name="hand-coin"` in the balance card.
- **Files modified:** `VoltVenture/src/screens/app/VoltCoinsRewardsScreen.tsx`
- **Commit:** `464fa78`

## Known Stubs

- **VoltCoins Redeem CTA** — All 4 reward cards show Snackbar "Rewards redemption coming soon" — intentional stub per plan (D-12 / T-08-06). Actual redemption API is a v1.2+ feature.

## Threat Flags

No new threat surface beyond plan's threat model. rideService.getRideHistory() is read-only in-memory data; REWARDS array is module-level const with no user mutation path.

## Self-Check: PASSED

- `VoltVenture/src/screens/app/VoltCoinsRewardsScreen.tsx` — FOUND, exports default VoltCoinsRewardsScreen
- `VoltVenture/src/screens/app/AccountScreen.tsx` — FOUND, contains `navigation.navigate('VoltCoins')`
- `VoltVenture/src/screens/app/RideHistoryScreen.tsx` — FOUND, contains `ListHeaderComponent={StatsHeader}`, `co2Kg`, `CO2 Saved`, `Total Rides`
- Commit `464fa78` — FOUND in git log
