# Step 02 — Build the Finwise layout (sections + container) in Finwise mode

## Objective
Implement the Finwise “Hero + vertical sections” layout in `CalculatorFinwiseView` while reusing the existing calculator components (`CalculatorControls`, charts, `CarouselSection`, footer copy).

## Hard rules
- Do not change the math, state, or `useMemo` calculation logic.
- Keep `data-testid` attributes (especially `chart-container`, `button-share`, `button-reset`, and the savings text).
- Do not introduce mandatory scroll snapping or disable body scrolling.

## Implementation

### 1) Create 2 tiny layout primitives (Container + Section)
Add files:
- `client/src/components/layout/Container.tsx`
- `client/src/components/layout/Section.tsx`

**Container.tsx**
```tsx
import React from "react";

export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 ${className}`}>{children}</div>;
}
```

**Section.tsx**
```tsx
import React from "react";
import Container from "./Container";

export default function Section({
  id,
  alt = false,
  className = "",
  children,
}: {
  id?: string;
  alt?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${alt ? "bg-muted/40" : ""} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
```

### 2) Implement `CalculatorFinwiseView` (Hero + Surface + Supporting + Footer)
Target file:
- `client/src/pages/Calculator.tsx`

Inside `CalculatorFinwiseView`, wrap the whole page in:
```tsx
<div data-ui="finwise" className="min-h-screen bg-background text-foreground">
```

#### Hero section (Finwise grid + bottom blur)
Structure:
- A `section` with `relative overflow-hidden`
- An absolutely-positioned backdrop using `.fw-hero-grid`
- A bottom blur strip using `.fw-hero-bottom-blur`
- Inside: headline + subhead + row with Survey + Share button
- Below: a two-column “surface” grid (controls card + chart card)

Suggested Hero scaffold:
```tsx
<section className="relative overflow-hidden pt-24 md:pt-32 pb-12">
  <div className="absolute inset-0 -z-10 fw-hero-grid" />
  <div className="absolute inset-x-0 bottom-0 h-40 -z-10 fw-hero-bottom-blur" />

  <div className="mx-auto max-w-6xl px-5">
    {/* headline */}
    {/* survey + share */}
    {/* surface grid */}
  </div>
</section>
```

#### Surface grid
- Left: `CalculatorControls` in a card
- Right: `ChartCarousel` (containing `SavingsChart` and `DonutChart`) in a card
- Use consistent “Finwise card” treatment:
  - `rounded-3xl bg-card border border-border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-6`

Important: keep the existing `data-testid="chart-container"` on the chart card wrapper.

### 3) Supporting content section
Wrap your existing `CarouselSection` in `Section alt`:
```tsx
<Section id="features" alt>
  <CarouselSection ...existing props... />
</Section>
```

### 4) Footer (unchanged copy, Finwise spacing)
Use a simple footer block with `text-muted-foreground text-sm` and spacing.

## Acceptance checks
- Finwise mode shows:
  - Finwise hero backdrop (grid + radial mask) and bottom blur strip.
  - Two-column surface with controls + chart in cards.
  - Carousel section as a separate vertical section.
  - Footer looks “landing-page-ish”.

- Legacy mode still renders exactly as before.

## Rollback
- Revert the JSX in `CalculatorFinwiseView` only.
- Layout primitives can remain (unused), or delete them.
