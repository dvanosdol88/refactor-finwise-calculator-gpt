# Refactor Finwise Calculator (UI Variant Rollout)

This repo contains the **Financial Fee Savings Calculator** with a safe, gated **Finwise UI** redesign.

## UI variants

- **Legacy (default)**: current production UI
- **Finwise preview**: add `?ui=finwise` to the calculator route to see the in-progress redesign

## Safety rails (non-negotiable)

- Calculator math/state behavior must remain unchanged.
- Do not remove or rename existing `data-testid` attributes.
- Legacy UI remains the default experience until Finwise QA is clean.

## Development

### Prereqs

- Node.js 18+
- npm

### Install

```bash
npm ci
```

### Run dev

```bash
npm run dev
```

The app serves on `http://localhost:5000` by default (configurable via `PORT`).

### Typecheck / build

```bash
npm run check
npm run build
```

## QA checklist (quick)

- Verify **legacy route** renders exactly as before (no query param).
- Verify `?ui=finwise` renders the Finwise preview.
- Inputs update charts and total savings; reset works.
- `data-testid="chart-container"`, `button-share`, `button-reset`, and total savings test id are present.
- No horizontal scrolling on common breakpoints.


