# Finwise UI Variant — High-Level Summary

## What we wanted to do
Create a **zero-risk “Finwise UI” variant** of the calculator behind `?ui=finwise`, then progressively apply **Finwise-like tokens, hero background, layout sections, motion, and component styling**—without changing calculator behavior or breaking `data-testid`s.

## What we did
- Added a **Finwise UI gate** via `?ui=finwise` and kept legacy as the default.
- Added **Finwise-scoped styling** under `[data-ui="finwise"]` (token overrides) plus hero grid + bottom blur utilities.
- Implemented a **Finwise-style page layout** in Finwise mode (hero + two “surface cards” + supporting section + footer).
- Added **section-level motion** with reduced-motion support.
- Updated controls in Finwise mode to use **token-based green** (legacy remains unchanged).
- Ran **typecheck/build** and fixed a console warning plus improved mobile tooltip accessibility.

## Based on what we did, this needs FIXED (why it doesn’t look like Finwise)
- **Not using the real Finwise component system**: we approximated the hero/backdrop, but we didn’t port Finwise’s **layout spacing rules, typography scale, and component styles** (buttons, checkboxes/survey, card radii/shadows, section rhythm).
- **Token mismatch**: the Finwise reference uses a different token model (CSS vars like `--hero-background`, `--foreground-accent`, etc.). Our app uses shadcn-style HSL tokens; the mapping is only “close,” not faithful.
- **Survey + controls dominate**: the checkbox list + control widgets are still the app’s own components. Even with a hero grid, the page reads like a “calculator app,” not a Finwise landing experience.

## Once those are fixed, the most obvious ways to get closer to the vision
- **Lift the Finwise hero block more literally** (structure + classes) into the calculator’s Finwise view, not just the background utilities.
- **Adopt Finwise typography in Finwise mode** (heading scale/weights, body size, line-height, consistent Manrope usage).
- **Restyle the survey + controls area to match Finwise** (checkbox styling, spacing/alignment, and button treatment) so the first screen reads “Finwise.”
- **Unify card surfaces** to Finwise (border, radius, shadow, padding) and remove leftover “app UI” artifacts (carousel dots/buttons, chart chrome) that don’t match the landing style.


