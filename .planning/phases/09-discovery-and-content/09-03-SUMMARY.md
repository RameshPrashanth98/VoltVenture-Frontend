---
phase: 09-discovery-and-content
plan: 03
status: complete
completed_at: "2026-08-19T17:00:00Z"
---

# Plan 09-03 Summary — NavigateToPoiScreen + Info Screens

## Deliverables

### NavigateToPoiScreen.tsx (full implementation replacing stub)
- Props type: `StackScreenProps<NavStackParamList, 'NavigateToPoi'>`
- Params destructure: `{ name, location }` (NOT bike)
- distanceKm uses `location.latitude / location.longitude`
- Inline haversineKm with "not exported" comment
- Full-screen MapView with Polyline (DSColors.primary, strokeWidth 4)
- User marker dot (white circle with green border)
- POI destination marker (map-marker icon DSColors.primary)
- Overlay ETA card: back button (arrow-left white) → navigation.goBack()
- POI name text (DSTypography.headingMd, white)
- ETA: "{etaMin} min walk — {distanceM} m"
- NO WalkingDirections / Turn-by-Turn button

### SupportScreen.tsx (created)
- Custom header "Support & Help"
- 3 List.Section blocks via List.Accordion (RNP component)
- Section 1 "Rides & Billing": 3 FAQ items
- Section 2 "Account": 3 FAQ items
- Section 3 "Bikes & Safety": 2 FAQ items
- Total: 8 FAQ items
- Every List.Item has `descriptionNumberOfLines={0}` (prevents truncation)
- List.Subheader styled: 13px, weight 600, DSColors.textSecondary, uppercase, letterSpacing 0.8
- Divider (DSColors.border) after each accordion
- PrimaryButton "Contact Support" → Snackbar "Support chat coming soon" in Portal

### PrivacyPolicyScreen.tsx (created)
- 4 sections: "Data We Collect", "How We Use Your Data", "Your Rights (GDPR)", "Data Retention"
- ScrollView contentContainerStyle paddingBottom 64
- Paragraph text: DSColors.textPrimary (not secondary — legal text must be readable)
- Contains "privacy@voltventure.app"

### TermsOfServiceScreen.tsx (created)
- 4 sections: "Use of the Service", "Bookings & Payments", "User Responsibilities", "Limitation of Liability"
- Same style pattern as PrivacyPolicyScreen
- Contains "support@voltventure.app"

### DiscoverNavigator.tsx (fully wired)
- All 6 Stack.Screen entries use real imported components
- No stub/placeholder components remain

## Verification
- ✅ NavigateToPoiScreen: NavigateToPoi in Props, location.latitude used, haversineKm present, back button, no WalkingDirections
- ✅ SupportScreen: List.Accordion, descriptionNumberOfLines, 8 items, "Support chat coming soon", Portal
- ✅ PrivacyPolicyScreen: 4 sections, GDPR, privacy@voltventure.app, paddingBottom 64
- ✅ TermsOfServiceScreen: 4 sections, support@voltventure.app, Limitation of Liability
- ✅ DiscoverNavigator: all 6 screens real imports, no stubs

## Phase 9 Requirements Coverage
- DISC-05: Discover tab + DiscoverScreen (Plans 01 + 02)
- DISC-06: CuratedRoutesScreen (Plan 02)
- DISC-07: VipHubsScreen (Plan 02)
- CONT-01: CafeMarker + CafeDetailSheet + MapScreen café integration (Plan 01)
- CONT-02: SupportScreen FAQ accordion (Plan 03)
- CONT-03: PrivacyPolicyScreen + TermsOfServiceScreen (Plan 03)
