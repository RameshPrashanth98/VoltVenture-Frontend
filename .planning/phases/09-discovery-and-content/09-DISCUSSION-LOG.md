# Phase 9: Discovery & Content - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-19
**Phase:** 9-Discovery & Content
**Areas discussed:** Discover nav home, Café entry point, VIP Hubs layout, Support FAQ depth

---

## Discover nav home

### Q1: Where should the user access curated routes, VIP hubs, support, and legal content?

| Option | Description | Selected |
|--------|-------------|----------|
| New Discover tab | 3rd tab in AppTabs (Map | Discover | Account). Dedicated stack. Most visible. | ✓ |
| AccountScreen rows | Add rows below existing Account items. Simpler, but buried in settings. | |
| From MapScreen | Floating FAB on MapScreen opens DiscoverStack modal. Map tab gets overloaded. | |

**User's choice:** New Discover tab

### Q2: What does the Discover home screen look like?

| Option | Description | Selected |
|--------|-------------|----------|
| Section rows | Scrollable screen with section headers + menu rows. Consistent with AccountScreen. | ✓ |
| Card grid | Large illustrated feature cards in 2×2 grid. Needs new components. | |
| Full list of items | Combined list of all content inline. No sub-navigation. | |

**User's choice:** Section rows — "Explore" (Routes, VIP Hubs) + "Info" (Support, Privacy Policy, Terms of Service)

### Q3: Should Discover home have a 'Nearby Cafés' row?

| Option | Description | Selected |
|--------|-------------|----------|
| Map pins only | Cafés only via MapScreen pins. Clean separation: map = spatial, Discover = routes/hubs/content. | ✓ |
| Both: Discover row + map pins | Café list in Discover + pins on map. Two entry paths. | |
| Discover row only (no map pins) | Café pins removed from scope. List in Discover only. | |

**User's choice:** Map pins only

### Q4: What icon and label for the Discover tab?

| Option | Description | Selected |
|--------|-------------|----------|
| compass / Discover | MaterialCommunityIcons 'compass' / 'compass-outline'. Tourist-relevant. | ✓ |
| map-search / Explore | 'map-search' / 'map-search-outline'. Emphasises map/location. | |
| view-grid / Browse | 'view-grid' / 'view-grid-outline'. Generic. Less evocative. | |

**User's choice:** compass / Discover

---

## Café entry point

### Q1: When a user taps a café pin on MapScreen, how does CafeDetail open?

| Option | Description | Selected |
|--------|-------------|----------|
| Bottom sheet | @gorhom/bottom-sheet, same as BikeDetailSheet. No navigation push. | ✓ |
| DiscoverStack modal screen | Full-screen push via modal stack. More real estate. | |
| Inline info card on map | Small floating card on map. 'View Details' pushes to full screen. | |

**User's choice:** Bottom sheet

### Q2: How should café pins be visually distinct from bike pins?

| Option | Description | Selected |
|--------|-------------|----------|
| Different icon, same marker shape | 'coffee' icon, white/bordered background. Consistent visual language. | ✓ |
| Different color only | Same icon style, different color (amber/orange). Minimal change. | |
| Standard map pin | Default Marker, no custom component. Fastest, least consistent. | |

**User's choice:** Different icon, same marker shape — coffee icon, white/bordered circular marker

### Q3: What happens when the user taps 'Get Directions' in CafeDetailSheet?

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse NavStack | Open NavStack/NavigateToPoi with café name + location. Zero new screens. | ✓ |
| Open OS maps app | Linking.openURL to Apple/Google Maps. Exits the app. | |
| New CafeNavStack modal | Dedicated stack for café navigation. Duplicates NavigateToBike logic. | |

**User's choice:** Reuse NavStack — NavigateToPoi new route

### Q4: How to handle NavStack param type mismatch (Bike vs. café)?

| Option | Description | Selected |
|--------|-------------|----------|
| New NavStack route: NavigateToPoi | NavigateToPoi: { name, location } added to NavStackParamList. NavigateToBike untouched. | ✓ |
| Generalize NavigateToBike params | Change NavigateToBike params to generic destination type. Touches Phase 7 code. | |

**User's choice:** New NavigateToPoi route

---

## VIP Hubs layout

### Q1: How should the VIP Hubs screen combine the map and the list?

| Option | Description | Selected |
|--------|-------------|----------|
| Map top + list below | MapView ~45% top, scrollable FlatList below. Both visible simultaneously. | ✓ |
| Map only + info card on tap | Full-screen map with info card floating on pin tap. Like EndRideFindCharging. | |
| Tab switcher: Map / List | Two tabs at top — user switches manually between map and list. | |

**User's choice:** Map top (~45%) + FlatList below

### Q2: What happens when the user taps a VIP hub pin or card?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline expand in list | Card expands in-place to show details. Tapping a pin scrolls and expands. | ✓ |
| Push VipHubDetailScreen | Navigate to full detail screen. Requires new route. | |
| Bottom sheet | Sheet appears with hub details. Same gorhom pattern. | |

**User's choice:** Inline expand in list

### Q3: What is a VIP Hub and what info do hub cards show?

| Option | Description | Selected |
|--------|-------------|----------|
| Premium e-bike stations | Fast-charging + covered parking. Collapsed: name, distance, VIP badge, status. Expanded: description, amenities, hours, Get Directions. | ✓ |
| Partner venue hubs | Hotels/attractions where bikes are prioritised. Perks and availability shown. | |

**User's choice:** Premium e-bike stations

---

## Support FAQ depth

### Q1: How interactive should the Support FAQ be?

| Option | Description | Selected |
|--------|-------------|----------|
| Static accordion + contact CTA | 6-8 hardcoded FAQs, expandable. "Contact Support" Snackbar stub. No search. | ✓ |
| Search bar + filtered accordion | Mock substring search filters FAQ list. More interactive. | |
| Category tabs + accordion | Tabs filter by category. More structured but complex for static items. | |

**User's choice:** Static accordion + contact CTA

### Q2: Which accordion implementation?

| Option | Description | Selected |
|--------|-------------|----------|
| React Native Paper List.Accordion | Built-in Paper component. Already installed, matches theming. | ✓ |
| Custom expand/collapse | TouchableOpacity + Animated. More control, more code. | |

**User's choice:** React Native Paper List.Accordion

### Q3: How should Privacy Policy and Terms of Service content be presented?

| Option | Description | Selected |
|--------|-------------|----------|
| Hardcoded text with sections | ScrollView with section headers + paragraphs. Frontend-only. | ✓ |
| WebView loading a URL | Requires react-native-webview + a real URL. Adds dependency. | |
| Single ScrollView, no sections | Long text block only. No headers. Unprofessional for legal content. | |

**User's choice:** Hardcoded text with sections (3-4 sections each)

---

## Claude's Discretion

- Exact café mock data (names, hours, coordinates near Amsterdam bike locations)
- CuratedRoutes card visual treatment (difficulty badge color/style)
- VIP hub mock names, coordinates, and pin icon/color
- FAQ question/answer content (realistic e-bike rental FAQs)
- Privacy Policy and Terms of Service body text (GDPR-style placeholder)
- Whether NavigateToPoi is a separate file or a near-copy of NavigateToBike
- VipHubs map height implementation (fixed height vs. flex fraction)

## Deferred Ideas

None — discussion stayed within phase scope.
