# VoltVenture — Project Guide

## Project

Tourist e-bike rental mobile app built with React Native, React Native Paper, and NativeWind (Tailwind CSS).

See `.planning/PROJECT.md` for full project context.

## Tech Stack

- **Framework**: React Native
- **UI Components**: React Native Paper
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Design System**: Volt Venture Design System — https://volt-venture-design-system.vercel.app/

## GSD Workflow

This project uses the GSD planning system. Planning artifacts live in `.planning/`.

### Key files
- `.planning/PROJECT.md` — project context, requirements, decisions
- `.planning/REQUIREMENTS.md` — v1 requirements with REQ-IDs
- `.planning/ROADMAP.md` — 4-phase roadmap
- `.planning/STATE.md` — current phase and status
- `.planning/config.json` — workflow settings (YOLO mode, coarse granularity)

### Workflow commands
- `/gsd:discuss-phase 1` — discuss Phase 1 before planning
- `/gsd:plan-phase 1` — create execution plan for Phase 1
- `/gsd:execute-phase 1` — execute the plan
- `/gsd:verify-work` — verify deliverables against success criteria
- `/gsd:progress` — check current status

## Development Conventions

- All UI components must use the Volt Venture Design System tokens (colors, typography, spacing)
- Use React Native Paper components as the base; extend with NativeWind utility classes
- Frontend only — backend calls are mocked/stubbed until API integration phase
- Each phase scope is revealed by the user; do not add features beyond what is asked

## Phases

| # | Phase | Status |
|---|-------|--------|
| 1 | Foundation & Authentication | Pending |
| 2 | Bike Discovery | Pending |
| 3 | Booking & Unlock | Pending |
| 4 | Active Ride & Payment | Pending |
