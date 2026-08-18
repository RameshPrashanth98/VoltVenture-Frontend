---
plan: 06-03
status: complete
wave: 2
completed: "2026-08-19"
---

# Plan 06-03 Summary — FacialScanScreen & SecurityDepositScreen

## Deliverables

- **FacialScanScreen.tsx** — Square viewfinder (aspectRatio 1) with centered dashed oval (width 200, height 240, borderRadius 120); identical 3-state machine as IdScan; "Face Verified" success copy; Continue calls `onVerified` then `goBack()`
- **SecurityDepositScreen.tsx** — Status card with $150.00, Active Hold badge, 7-day refund estimate; "What is this?" explanation; Request Refund button disabled after first tap; Snackbar with 5–7 business days message

## Verification

- TypeScript: zero errors
- FacialScanScreen: borderRadius 120 + "Face Verified" present (count = 2)
- SecurityDepositScreen: refundRequested (3+ matches) + 150.00 + 5–7 business days (count = 4)
- No expo-camera import in either file
- No NativeWind className props in either file
