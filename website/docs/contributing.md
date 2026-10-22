---
id: contributing
title: Contributing
---

# Contributing

Coding guidelines for anyone adding to or modifying `vajra-ui`: naming conventions, folder
structure, and the component-authoring pattern every component in the library follows.

## Naming Conventions

### Types
All TypeScript `type` declarations must be prefixed with `T`. **No `interface` declarations anywhere in the project — use `type` only.**

```ts
// correct
type TButtonVariant = 'solid' | 'outline' | 'ghost';
type TBoxProps = { ... };

// wrong
type ButtonVariant = 'solid' | 'outline' | 'ghost';
interface BoxProps { ... }   // interfaces are banned
```

---

## Exports

**Named exports only. No default exports.**

```ts
// correct
export const Box = memo(BoxComponent);
export type { TBoxProps };

// wrong
export default Box;
```

This applies to components, hooks, utilities, constants, and types.

---

## Folder Structure

Every component lives in its own folder. The folder name uses kebab-case and matches the component name.

```
foobar/
├── foobar.tsx               # UI of the component
├── foobar-types.ts          # All types for this component
├── foobar-constants.ts      # Constants scoped to this component
├── foobar-variants.ts       # Variant definitions (components only, not core primitives)
├── use-foobar.ts            # Custom hook if the component has non-trivial logic
├── components/              # Sub-components (only if the component is compositional)
│   ├── foobar-header/
│   │   ├── foobar-header.tsx
│   │   ├── foobar-header-types.ts
│   │   └── index.ts
│   └── foobar-footer/
│       ├── foobar-footer.tsx
│       ├── foobar-footer-types.ts
│       └── index.ts
└── index.ts                 # Barrel — re-exports everything consumers need
```

When sub-components exist, they are attached as static properties inside `foobar.tsx` itself. `index.ts` stays a plain barrel.

```tsx
// foobar/foobar.tsx
import { FoobarHeader } from './components/foobar-header';
import { FoobarFooter } from './components/foobar-footer';

export const Foobar = {
  Header: FoobarHeader,
  Footer: FoobarFooter,
};
```

```ts
// foobar/index.ts — plain barrel, no composition logic
export * from './foobar';
export * from './foobar-types';
```

```tsx
// usage
<Foobar.Header />
<Foobar.Footer />
```

### Rules per file

| File | Purpose |
|------|---------|
| `foobar.tsx` | JSX only. No business logic. Uses props from `foobar-types.ts`. |
| `foobar-types.ts` | All `type` declarations. No runtime code. |
| `foobar-constants.ts` | Constant values used by the component (e.g. default sizes, maps). |
| `foobar-variants.ts` | Variant style maps or config. Present for components, not core primitives. |
| `use-foobar.ts` | Custom hook. Only add when the component has logic that cannot live in the component itself. |
| `index.ts` | Re-exports with `export * from`. Do not add logic here. |

### index.ts pattern

```ts
// foobar/index.ts
export * from './foobar';
export * from './foobar-types';
// only export variants/constants/hook if consumers need them
export * from './foobar-variants';
```

---

## File Naming

All file names use **kebab-case**.

```
button.tsx              correct
button-variants.ts      correct
use-button.ts           correct
Button.tsx              wrong
buttonVariants.ts       wrong
useButton.ts            wrong
```

---

## Component Pattern

```tsx
// foobar/foobar.tsx
import React, { memo } from 'react';
import { TFoobarProps } from './foobar-types';

export const Foobar = memo<TFoobarProps>(({ ... }) => { return ( ... ); });
```

- Component and memo export are written as a single inline declaration
- Props type lives in `foobar-types.ts`

---

## Token Usage in Components

Never use raw values for colors, spacing, radii, or font scales. Always reference tokens through the theme.

```tsx
// correct
<Box backgroundColor="primary" p="md" br="lg" />

// wrong
<View style={{ backgroundColor: '#0066FF', padding: 16, borderRadius: 8 }} />
```

Token prop types are key-based:
- `TColorToken` — `'primary' | 'surface' | 'error' | 'text' | ...`
- `TSpacingToken` — `'s-1' | 's-2' | 's-3' | 's-4' | 's-6' | 's-8' | ...`
- `TRoundedToken` — `'r-1' | 'r-2' | 'r-3' | 'r-4' | 'r-full' | ...`
- `TFontVariant` — `'heading' | 'subheading' | 'body' | 'bodySmall' | 'label' | 'caption' | 'button'`

---

## Adding a New Component — Step by Step

Use this recipe every time. It's the same shape `button`, `badge`, `card`, and every other component in `src/ui/components/` already follow — don't improvise a new structure per component.

### Simple component (no sub-parts — e.g. `Badge`, `Spinner`, `Avatar`)

1. Create `src/ui/components/<name>/` (kebab-case).
2. `<name>-types.ts` — the props type, named `T<Name>Props`. No runtime code.
3. `<name>-constants.ts` — only if the component has fixed values (default sizes, icon maps, etc.). Skip if not needed.
4. `<name>-variants.ts` — only if the component has visual variants (`solid`/`outline`/`ghost`, size scales, etc.), via `createRecipe` (see `src/ui/utils/create-recipe.ts` and `button-variants.ts` for the pattern). Skip for components with no variants.
5. `<name>.tsx` — the component itself. Import only from `src/ui/core` (never `@88khp/vajra-core` directly — ESLint enforces this) and `useVajraTheme` for token resolution. Follow the inline `memo` pattern:
   ```tsx
   export const Foobar = memo<TFoobarProps>(({ ... }) => { return (...); });
   Foobar.displayName = 'Foobar';
   ```
6. `index.ts` — plain barrel: `export * from './<name>'` + `export * from './<name>-types'` (+ variants/constants only if consumers need them directly).
7. Export the barrel from `src/ui/components/index.ts` (or wherever the components barrel aggregates) so it reaches the public `src/index.ts` surface.
8. Write `<name>.test.tsx` colocated next to `<name>.tsx` (see Testing section below).
9. Add a preview screen under `examples/app/src/screens/examples/` following the existing per-component screen pattern, and register it in `component-registry.tsx` so it shows up in the component gallery.

### Compositional component (has sub-parts — e.g. `Checkbox`, `Radio`, `Switch`, `Input`)

Same as above, plus:

1. `<name>-context.ts` (or `.tsx` if it renders a provider) — a React context carrying shared state (selected value(s), change handler, disabled state, shared color) down to sub-components. See `checkbox-context.ts`.
2. `<name>-root.tsx` — the top-level component that owns state/context and renders children inside the context provider (e.g. `CheckboxRoot`, `RadioRoot`, `SwitchRoot`). This is what consumers actually mount.
3. `components/` — one folder per sub-component (e.g. `checkbox-item/`, `checkbox-indicator/`, `checkbox-label/`), each with its own `<sub>.tsx` + `<sub>-types.ts` + `index.ts`, consuming the parent context via a `use<Name>Context()` hook rather than receiving everything as props.
4. Sub-components are attached as static properties on the root export in the main `.tsx` file:
   ```tsx
   export const Checkbox = {
     Root: CheckboxRoot,
     Item: CheckboxItem,
     Indicator: CheckboxIndicator,
     Label: CheckboxLabel,
   };
   ```
5. Write one test file per meaningfully-testable piece (root + composed usage is usually enough; you don't need to unit-test every sub-component in isolation if the composed test already exercises it).

### Testing a new component

Every component's theme/token props are resolved via `useVajraTheme()`, so it must be rendered inside `<VajraProvider>` in tests or it throws. Minimal shape:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { VajraProvider } from '../../vajra-theme';
import { Foobar } from './foobar';

describe('Foobar', () => {
  it('renders', () => {
    render(
      <VajraProvider>
        <Foobar label="Hello" />
      </VajraProvider>,
    );

    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
```

At minimum, cover: renders with required props, key prop/variant variations produce the expected output, and — for token-driven props (`bg`, `color`, `p`, `rounded`, etc.) — that the resolved value actually comes from the theme (this is the library's core value proposition, so it's the most important thing to verify).

---

## Layer Rules

| Layer | Location | Description |
|-------|----------|--------------|
| Core | `@88khp/vajra-core` | Headless, unstyled. No theme context. No `useVajraTheme`. Raw primitives only. |
| UI Core | `src/ui/core/` | Token-aware wrappers around `@88khp/vajra-core`. Use `useVajraTheme`. Only imports from `@88khp/vajra-core`. |
| Components | `src/ui/components/` | Opinionated components with variants, constants, and optional hooks. Only imports from `src/ui/core` — never `@88khp/vajra-core` directly. |
| Theme | `src/theme/` | Generic `ThemeProvider` + `useTheme`. No vajra-specific tokens. |
| Vajra Theme | `src/ui/vajra-theme/` | Default vajra tokens. `VajraProvider`, `useVajraTheme`, `defaultVajraTheme`. |

### `src/theme` vs `src/ui/vajra-theme`

These are not two competing theme systems — `src/theme` is the generic engine, `src/ui/vajra-theme` is Vajra's specific theme built on top of it.

- **`src/theme/`** is a bare React context mechanism: `ThemeProvider`, `useTheme<T>()`, and an intentionally empty `VajraTheme` interface (`provider-types.ts`) meant to be filled in by whatever sits on top. It has no colors, spacing, or token knowledge of its own, and no consumer should reach for it directly — it's internal plumbing.
- **`src/ui/vajra-theme/`** consumes `src/theme` internally: `VajraProvider` (`vajra-provider.tsx`) wraps the generic `ThemeProvider` and feeds it `defaultVajraTheme`/a `createVajraTheme(...)` result; `useVajraTheme()` (`use-vajra-theme.ts`) is a thin typed wrapper around the generic `useTheme()`. This is the layer components and consumers actually use.
- **Rule:** only `src/ui/vajra-theme/**` may import from `src/theme/**`. Nothing else — not `src/ui/core`, not `src/ui/components` — should import `src/theme` directly; they go through `useVajraTheme`/`VajraProvider` instead.

---

## Optional Motion Dependencies (`react-native-reanimated`, `react-native-gesture-handler`)

Vajra UI is a zero-required-dependency library — nothing beyond `react`/`react-native`/`react-native-safe-area-context` is mandatory to install it. Some components (bottom sheets, drag-to-dismiss toasts, animated accordions) are meaningfully better with `react-native-reanimated` and `react-native-gesture-handler`, but requiring them for every consumer would break that promise and add real native-linking weight to apps that don't need motion. The rule:

1. **List them as `optionalDependencies` / optional `peerDependencies`** in `package.json` (use `peerDependenciesMeta: { "react-native-reanimated": { "optional": true } }` alongside the `peerDependencies` entry) — never as a hard `dependency`.
2. **Never `import` them statically at module scope** in a component file. A static top-level import throws immediately for any consumer who hasn't installed the optional package, even if they never render that component. Use a lazy, guarded require inside the component/hook instead:
   ```ts
   // <name>/use-<name>-motion.ts
   let Reanimated: typeof import('react-native-reanimated') | null = null;
   try {
     // eslint-disable-next-line @typescript-eslint/no-var-requires
     Reanimated = require('react-native-reanimated');
   } catch {
     Reanimated = null;
   }

   export const hasReanimated = Reanimated !== null;
   ```
3. **Every motion-dependent component must have a working fallback path** when the optional package isn't installed — not a thrown error. E.g. `Sheet` falls back to an instant show/hide (no slide animation, no gesture-driven drag-to-dismiss, tap-outside/close-button still work); `Toast` falls back to instant appear/disappear instead of an animated slide-in.
4. **Document the enhancement** in that component's usage docs: "Install `react-native-reanimated` (and `react-native-gesture-handler` for drag-to-dismiss) for animated/gesture behavior — works without them, with reduced motion."
5. Write tests for both paths: one with the optional module mocked as present, one with it mocked as absent (`jest.mock('react-native-reanimated', () => { throw new Error(); })` or similar), asserting the component still renders and functions in the fallback case.
