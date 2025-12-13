# Step 03 — Motion system (subtle section fly-ins, reduced-motion safe)

## Objective
Add a reusable “section reveal” animation for Finwise mode that mimics Finwise’s lightweight motion, while respecting reduced-motion preferences.

## Hard rules
- Motion must be **subtle** (no parallax, no layout thrash).
- Must respect reduced motion:
  - Use `MotionConfig reducedMotion="user"` and/or `useReducedMotion`.
- Motion must not impact input/slider responsiveness.

## Notes
Your repo already includes `framer-motion` in dependencies, so this step should be implementation-only.

## Implementation

### 1) Create a reusable `SectionReveal` component
Add file:
- `client/src/components/motion/SectionReveal.tsx`

```tsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

### 2) Wrap Finwise view in `MotionConfig reducedMotion="user"`
In `CalculatorFinwiseView` root:
```tsx
import { MotionConfig } from "framer-motion";

return (
  <MotionConfig reducedMotion="user">
    <div data-ui="finwise" ...>
      ...
    </div>
  </MotionConfig>
);
```

### 3) Apply reveals at the section level (not per component)
- Wrap the *contents* of each major section with `SectionReveal`.
- Do not animate individual inputs (controls) — keep them static for responsiveness.

Example:
```tsx
<Section id="features" alt>
  <SectionReveal>
    <CarouselSection ... />
  </SectionReveal>
</Section>
```

## Acceptance checks
- With normal OS settings, sections gently fade/slide in when scrolled into view.
- With OS “Reduce motion” enabled, transforms/layout motion is disabled and the page still looks good.
- No noticeable input lag.

## Rollback
- Remove `MotionConfig` wrapper and delete `SectionReveal.tsx`.
