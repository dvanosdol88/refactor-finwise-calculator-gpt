# Finwise Fidelity Scorecard (baseline)

Scope: **first screen** in `?ui=finwise` (hero + survey + controls + chart + chrome).

Legend: **Pass / Partial / Fail / Unknown**

## 1) Safety rails
- **No behavior changes**: **Pass** (Finwise gating is render-only; calculator math/state stays in `Calculator()`).
- **No test-id breakage**: **Pass** (core test ids present in both views).
- **Scoped styling**: **Pass** (Finwise tokens are under `[data-ui="finwise"]`).

## 2) Tokens & color discipline (Finwise mode)
- **No hard-coded hex** for primary/accents: **Fail**
  - Examples: `SurveySection` uses `#006044`; `ChartCarousel` uses `text-[#006044]`; charts use `#2563eb`, `#76a923`.
- **One accent green (token-driven)**: **Partial**
  - Many Finwise elements use `text-primary`, but several still use hard-coded values.
- **Surface palette is token-driven**: **Partial**
  - Finwise view cards are token-based, but several components still force `bg-white/...` and raw slate grays.

## 3) Typography (Finwise mode)
- **Manrope for headings/numeric callouts**: **Pass** (Finwise hero + savings callout use `font-fwheading`).
- **Source Sans 3 for body**: **Pass** (loaded and applied globally).
- **No Montserrat leakage**: **Partial**
  - Some chart labels still explicitly use Montserrat.
- **Consistent scale**: **Partial**
  - Hero spacing/scale is close, but not yet “Finwise exact” (needs polish pass).

## 4) Layout & rhythm (Finwise mode)
- **Hero spacing (Finwise-like)**: **Partial**
- **Container width/padding consistency**: **Pass** (`max-w-6xl` + `px-5` via `Container`).
- **Section rhythm**: **Pass** (`Section` with consistent `py` and `alt` background).

## 5) Surfaces (cards) & elevation
- **Consistent card spec**: **Pass** for the two main “surface cards”.
- **No mixed rounding**: **Partial**
  - Inner fields still use smaller rounding (`rounded-md`) and a different “app UI” feel.

## 6) Primary actions & buttons
- **Share button looks Finwise**: **Partial**
- **Focus rings consistent/accessible**: **Pass** (but needs re-check across survey + carousel dots/arrows).

## 7) Controls (CalculatorControls) in Finwise mode
- **Accent color token-driven**: **Partial**
  - Inputs/selects support Finwise accent, but the segmented control still hard-codes `bg-green-600`.
- **Field styling matches Finwise**: **Partial**
- **Label hierarchy**: **Pass** (generally consistent).

## 8) Survey block (highest visual weight)
- **Looks Finwise**: **Fail**
- **Accessible semantics**: **Fail** (clickable `div` pretending to be radio).
- **Token-driven styling**: **Fail** (hard-coded color + drop-shadow hacks).

## 9) Chart + carousel chrome
- **Carousel navigation matches Finwise**: **Fail** (hard-coded colors; dots positioned outside content).
- **Chart palette token-driven**: **Fail**
- **Tooltip token-driven**: **Partial**
- **No console noise**: **Fail** (`DonutChart` logs).

## 10) Motion
- **Section-level only**: **Pass**
- **Reduced motion respected**: **Pass** (`MotionConfig reducedMotion="user"` + `useReducedMotion` in `SectionReveal`).

## 11) Responsive QA (manual)
- **Breakpoints**: **Unknown** (needs run-through).
- **No horizontal scroll**: **Unknown**
- **Stacking cleanly**: **Unknown**


