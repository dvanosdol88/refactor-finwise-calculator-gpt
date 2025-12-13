# Step 01 — Finwise design baseline (tokens + typography + hero backdrop)

## Objective
Establish a Finwise-like visual baseline in the calculator app by adding **scoped** design tokens, matching **typography**, and implementing the Finwise **hero background grid + radial mask + bottom blur** treatment.

## Hard rules
- All changes must be **scoped** to Finwise mode (so legacy UI remains untouched).
- No changes to calculator logic, event handlers, or chart data.
- No “scroll-snap” or `body { overflow: hidden; }` behavior (high break risk for app UIs).

## Inputs (reference patterns to mimic)
Finwise Hero includes:
- background grid + radial mask fade
- bottom blur gradient strip
- headline in `#006044`
- Source Sans 3 body + Manrope headings

## Implementation

### 1) Add scoped Finwise tokens (do not replace existing tokens)
Target file:
- `client/src/index.css`

Add a scoped block near the bottom:
```css
/* Finwise skin: apply only under data-ui="finwise" */
[data-ui="finwise"] {
  --fw-accent: #006044;
  --fw-hero-background: #F3F3F5;

  /* Remap existing design tokens within this subtree */
  --background: 0 0% 100%;
  --foreground: 0 0% 10%;

  /* Approx of #006044 in HSL */
  --primary: 163 100% 19%;
  --primary-foreground: 0 0% 100%;

  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 35%;

  --card: 0 0% 100%;
  --card-foreground: 0 0% 10%;
  --card-border: 0 0% 90%;

  /* Finwise-style rounding and shadow feel */
  --radius: 1.5rem; /* 24px */
}
```

### 2) Add Finwise hero backdrop utilities
Also in `client/src/index.css`, add utilities in `@layer utilities`:
```css
@layer utilities {
  .fw-hero-grid {
    background-color: var(--fw-hero-background);
    background-image:
      linear-gradient(to right, rgba(128,128,128,0.07) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(128,128,128,0.07) 1px, transparent 1px);
    background-size: 40px 40px;
    -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%);
    mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%);
  }

  .fw-hero-bottom-blur {
    backdrop-filter: blur(2px);
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(233,238,255,0.5),
      rgba(202,208,230,0.5)
    );
  }
}
```

### 3) Match typography (Manrope headings)
Target file:
- `tailwind.config.ts`

Update heading font family to Manrope:
```ts
fontFamily: {
  sans: ["Source Sans 3", "var(--font-sans)"],
  heading: ["Manrope", "sans-serif"],
  mono: ["var(--font-mono)"],
},
```

Also ensure Manrope is loaded (choose one):
- Add `<link>` in `client/index.html` for Google Fonts (Manrope).
- Or import via CSS in `client/src/index.css` (preferred if you already import Source Sans 3 this way).

Additionally, in `client/src/index.css` you may mirror Finwise behavior by ensuring headings use `font-heading` consistently in the Finwise layout.

## Acceptance checks
- In Finwise mode only, `text-primary` renders as Finwise green and cards can use a 24px radius.
- `.fw-hero-grid` and `.fw-hero-bottom-blur` classes render correctly when used (we’ll apply them in Step 02).
- Legacy mode visuals are unchanged.

## Rollback
- Remove the `[data-ui="finwise"]` block and the two `.fw-*` utilities.
- Revert `tailwind.config.ts` heading font family.
