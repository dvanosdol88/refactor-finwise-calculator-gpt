# Step 05 — Responsive QA + regression checklist (Rule #1 enforcement)

## Objective
Validate that the Finwise UI variant is safe to ship and that no interactions regress. This is the “you don’t ship until it passes” step.

## Hard rules
- If any regression is found, fix it or roll back the offending change.
- Do not ship scroll-trapping behavior (no `body { overflow: hidden; }`, no mandatory scroll snap).

## Test matrix
Test the Finwise UI variant (`?ui=finwise`) and the legacy UI (default) on:
- Mobile: 360×800 (or iPhone-ish)
- Tablet: 768×1024
- Desktop: 1280×800, 1440×900

## Functional regression checks (must-pass)
### Calculator logic
- Changing each input updates the chart and the total savings number.
- Reset button restores defaults.
- Year range and fee/growth dropdowns still work.
- Spending mode is unchanged from current behavior (no new view mode exposure unless explicitly desired).

### Charts
- `data-testid="chart-container"` exists and charts render.
- Charts resize correctly (no overflow, no clipped labels).
- ChartCarousel navigation still works.

### Share
- Share button still triggers Web Share API when available; otherwise copies URL.

### Tooltip(s)
- Tooltip on total savings still opens and text is readable.
- Tooltip does not render off-screen on mobile.

## Visual/UX checks
- No horizontal scrolling on any breakpoint.
- Hero background grid looks correct, does not “band” or pixelate badly.
- Section spacing is consistent (no random `ml-[90px]` style offsets).
- Focus rings are visible when tabbing through inputs and buttons.

## Performance & build checks
- `npm run check`
- `npm run build`
- Open production build and confirm Finwise variant works.

## Optional (recommended) quick automation
If you have Playwright/Cypress, create smoke tests that:
- load the page,
- change `portfolioValue`,
- verify that `text-total-savings` changes,
- click reset and verify defaults.

## Rollback strategy
- If something breaks in Finwise view, do not patch legacy view.
- Revert only the Finwise view code paths first.
- Keep the `?ui=finwise` gate until QA is clean.
