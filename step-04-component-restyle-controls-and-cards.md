# Step 04 — Component restyle (controls + cards) to match Finwise

## Objective
Make the calculator UI components (especially `CalculatorControls`) visually consistent with the Finwise system:
- Green accent, not default Tailwind blue
- Rounded card surfaces
- Strong typographic hierarchy
- Clean focus styles
- No ad-hoc inline colors

## Hard rules
- Do not change calculator logic or state wiring.
- Keep `data-testid` attributes exactly the same.
- Avoid changes that reduce accessibility (focus rings must remain obvious).

## Implementation

### 1) Remove “blue UI” from CalculatorControls
Target file:
- `client/src/components/CalculatorControls.tsx`

Replace:
- `text-blue-600` -> `text-primary`
- `caretColor: '#2563eb'` -> use token-based caret, e.g. `caretColor: 'hsl(var(--primary))'`

Example (input):
```tsx
className="font-heading font-bold text-2xl bg-transparent border-none outline-none p-0 text-primary custom-number-input"
style={{ width: `${inputWidth}ch`, caretColor: "hsl(var(--primary))" }}
```

Example (select):
```tsx
className="font-heading font-bold text-2xl bg-transparent border-none outline-none p-0 pr-6 appearance-none text-primary cursor-pointer"
```

### 2) Make control containers look like “Finwise fields”
The wrapper currently uses `rounded-md` and `shadow-none`. In Finwise mode, we want softer, larger rounding and subtle elevation.

Safe approach (minimize conditional complexity):
- Keep existing classes as-is for legacy mode.
- Add an optional `className` prop to `CalculatorControls` OR wrap it in a “card” in the page (preferred).
- In Step 02, controls are already inside a large rounded card, so inside-control rounding can remain smaller.

If you still want nicer field styling:
- change `rounded-md` -> `rounded-xl`
- ensure `border-card-border` stays
- keep focus ring: `focus-within:ring-2 focus-within:ring-primary`

### 3) Remove inline green styles from Calculator.tsx (Finwise view only)
Target file:
- `client/src/pages/Calculator.tsx`

In the Finwise variant, avoid:
- `style={{ color: '#01793D' }}`
Use `text-primary` or `text-[color:var(--fw-accent)]` (if you introduced `--fw-accent`).

### 4) Chart card + tooltip styles
- Ensure the chart container is a real card with padding and shadow.
- Keep tooltip content readable on the lighter Finwise backgrounds.
- Do not change tooltip logic.

## Acceptance checks
- In Finwise mode, inputs and selects are green-accented (not blue).
- Focus rings remain visible and consistent.
- Legacy mode visuals unchanged.
- Inputs still behave identically (no parsing regressions, commas behavior unchanged).

## Rollback
- Revert the color/token changes in `CalculatorControls.tsx`.
- Keep page-level card wrappers (they’re generally safe).
