# Step 00 — Safety rails: Finwise UI variant (no behavior changes)

## Objective
Introduce a **zero-risk** “Finwise UI” variant of the calculator page so you can iterate without breaking the existing production UI.

## Hard rules
- Do **not** change calculator math/state behavior (all `useState`, `useMemo`, and derived values remain unchanged).
- Do **not** remove or rename any existing `data-testid` attributes.
- Default experience must remain the current layout.

## Why this step exists
Your current `Calculator.tsx` contains many ad-hoc layout offsets (e.g., `ml-[90px]`, `pl-[100px]`) and a large header block; refactoring layout directly is riskier than needed. This step lets us build the Finwise layout beside the legacy layout and flip it on via a query param.

## Implementation

### 1) Split the current `Calculator` render into two components
Target file:
- `client/src/pages/Calculator.tsx`

Approach:
- Keep all existing state + `useMemo` at the top-level `Calculator()` component.
- Move the current JSX returned today into `CalculatorLegacyView(props)`.
- Create an empty/placeholder `CalculatorFinwiseView(props)` that will be filled in Step 02.

Suggested skeleton (illustrative):
```tsx
export default function Calculator() {
  // KEEP: existing useState + useMemo exactly as-is.

  const isFinwise =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("ui") === "finwise";

  return isFinwise ? (
    <CalculatorFinwiseView
      // pass the same props you already pass into controls/charts
    />
  ) : (
    <CalculatorLegacyView
      // current JSX (copy/paste) goes here
    />
  );
}
```

### 2) Preserve legacy output as the default
- No route changes required.
- The Finwise variant is activated only via `?ui=finwise`.

### 3) Add a clear developer-only banner inside Finwise mode (temporary)
In `CalculatorFinwiseView`, render a small badge like:
- “Finwise UI preview (ui=finwise)”
This prevents confusion during QA.

## Acceptance checks
- Visiting `/calculator` (or the page’s normal route) shows the exact existing UI.
- Visiting `/calculator?ui=finwise` shows the placeholder Finwise view with the banner.
- `npm run check` succeeds.
- No calculator behavior changes in legacy mode.

## Rollback
If anything goes wrong, delete `CalculatorFinwiseView` and the query-param switch, and restore the old `return (...)` block as-is.
