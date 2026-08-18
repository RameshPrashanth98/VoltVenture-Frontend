# Phase 6: Security & Verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-18
**Phase:** 6-Security & Verification
**Areas discussed:** Security menu entry, Camera mock style, Verification flow shape, SecurityDeposit screen design

---

## Security Menu Entry

**Q1: Where should the 'Security' row appear in AccountScreen?**

| Option | Description | Selected |
|--------|-------------|----------|
| Between Settings and Log Out | Security sits just above Log Out — natural grouping. Matches iOS Settings app pattern. | ✓ |
| Between Payment Methods and Settings | Security near financial controls. | |
| Sub-row inside Settings | More buried, Android hierarchy pattern. | |

**User's choice:** Between Settings and Log Out

---

**Q2: What does the LoginSecurity screen contain?**

| Option | Description | Selected |
|--------|-------------|----------|
| 2FA toggle + active session list | Toggle at top, 2–3 mock sessions below. | ✓ |
| 2FA toggle only | Simpler screen, less content. | |
| 2FA toggle + Change Password CTA + sessions | More comprehensive. | |

**User's choice:** 2FA toggle + active session list

---

**Q3: When the user toggles 2FA on, what happens?**

| Option | Description | Selected |
|--------|-------------|----------|
| Toggle switches + confirmation snackbar | Flip immediately, Snackbar "2-factor authentication enabled". | ✓ |
| Toggle switches + Dialog confirmation | Dialog before enabling. More friction. | |
| Toggle switches to 'Pending' state | Amber/pending state + "Setup required" note. | |

**User's choice:** Toggle switches + confirmation snackbar

---

## Camera Mock Style

**Q1: How should the scanning UI be presented?**

| Option | Description | Selected |
|--------|-------------|----------|
| Camera viewfinder placeholder | Dark View with corner-bracket overlay + Capture button. No expo-camera. | ✓ |
| Static illustration + Scan button | Icon/illustration + "Start Scan" button. No camera UI. | |
| Real expo-camera viewfinder | Actual device camera, no processing, mock result. | |

**User's choice:** Camera viewfinder placeholder

---

**Q2: After 'Capture' is tapped, what happens?**

| Option | Description | Selected |
|--------|-------------|----------|
| Loading state → success result inline | 1–2s ActivityIndicator "Verifying..." → inline green checkmark + "Identity Verified" → "Continue". | ✓ |
| Immediate success screen push | Navigate immediately to separate "Verified" screen. | |
| Loading state → modal confirmation | Dialog pops with confirmed identity details. | |

**User's choice:** Loading state → success result inline

---

**Q3: Should IdScan and FacialScan share the same UI pattern?**

| Option | Description | Selected |
|--------|-------------|----------|
| Same pattern, different content | Both use dark viewfinder + Capture + inline success. Different frame shape (rectangle vs oval). | ✓ |
| Distinct layouts for each | Different visual treatment — document card feel vs face-detection pulse ring. | |

**User's choice:** Same pattern, different content

---

## Verification Flow Shape

**Q1: How should IdScan and FacialScan be accessed?**

| Option | Description | Selected |
|--------|-------------|----------|
| Two separate menu rows on LoginSecurity | Each opens independently. Pending/Verified badge per row. | ✓ |
| Single 'Verify Account' row → linear flow | One entry point → IdScan → FacialScan → done. | |
| Separate top-level Security screen hub | Separate SecurityScreen with cards for each flow. | |

**User's choice:** Two separate menu rows on LoginSecurity

---

**Q2: What verification status badge?**

| Option | Description | Selected |
|--------|-------------|----------|
| Pending / Verified badge pill | Pill: amber "Pending" → green "Verified". In-memory. | ✓ |
| Checkmark icon when done | No badge initially, checkmark replaces chevron after. | |
| No status indicator | Rows always look the same. | |

**User's choice:** Pending / Verified badge pill

---

**Q3: Where does SecurityDeposit appear?**

| Option | Description | Selected |
|--------|-------------|----------|
| Row on LoginSecurity screen | LoginSecurity is the full Security hub. | ✓ |
| Separate row on AccountScreen | Two entry points from Account menu. | |
| You decide | Claude's discretion. | |

**User's choice:** Row on LoginSecurity screen

---

## SecurityDeposit Screen Design

**Q1: What deposit amount and status?**

| Option | Description | Selected |
|--------|-------------|----------|
| $150 active hold with refund CTA | Single state: "$150.00 — Active Hold". "Request Refund" button mocked. | ✓ |
| $100 and toggleable mock state | Cycles: Active Hold → Pending Refund → Returned. | |
| You decide the amount | Claude's discretion. | |

**User's choice:** $150 active hold with refund CTA

---

**Q2: What should 'Request Refund' do?**

| Option | Description | Selected |
|--------|-------------|----------|
| Show a Snackbar 'Refund request submitted' | Snackbar + button disabled after tap. Consistent with mock action pattern. | ✓ |
| Open a confirmation Dialog before submitting | Dialog → Snackbar. More friction for financial action. | |
| Button disabled with tooltip explanation | Always disabled with note "Available after last ride ends." | |

**User's choice:** Show a Snackbar "Refund request submitted"

---

**Q3: What additional info on deposit screen?**

| Option | Description | Selected |
|--------|-------------|----------|
| Amount card + refund date + what deposit covers | Educates tourist users with "What is this?" paragraph. | ✓ |
| Amount card + refund date only | Cleaner, less text. | |
| You decide the layout | Claude's discretion. | |

**User's choice:** Amount card + refund date + what deposit covers

---

## Claude's Discretion

- Exact icon name for the "Security" menu row (shield-lock, lock, or security)
- Snackbar provider approach (Portal vs standalone Snackbar component)
- Exact corner-bracket styling for viewfinder (View borders vs absolute-positioned corner pieces)
- Whether to pass verification status back to LoginSecurity via navigation params or lightweight SecurityContext/ref

## Deferred Ideas

None — discussion stayed within phase scope.
