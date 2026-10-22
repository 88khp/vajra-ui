<div align="center">

<h1>88khp · Vajra UI ⚡️</h1>

<p><strong>Design tokens, not class strings.</strong></p>

<p>A typed React Native design system: style with props you already know, get 40+ components out of the box, and switch themes live, with no compiler and no build step. Free and MIT.</p>

[![npm version](https://img.shields.io/npm/v/@88khp/vajra-ui)](https://www.npmjs.com/package/@88khp/vajra-ui)
[![license](https://img.shields.io/npm/l/@88khp/vajra-ui)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)](https://reactnative.dev)

<p><a href="https://88khp.github.io/vajra-ui/"><strong>Documentation</strong></a> · <a href="https://88khp.github.io/vajra-ui/docs/performance"><strong>Benchmarks</strong></a></p>

> **✅ v3.0.0 — stable release**
> Level with twrnc on variant switches, 2.1–2.5× faster than NativeWind and 4–8× faster than
> Tamagui. [See the benchmarks](#performance). Full release history in [CHANGELOG.md](./CHANGELOG.md).

</div>

```tsx
<Box p="s-4" gap="s-3" bg="surface" rounded="r-3">
  <Text variant="subheading">Hello</Text>
  <Button label="Get started" onPress={() => {}} />
</Box>

// <Box bg="primry" />
// ✗ Type '"primry"' is not assignable. Did you mean '"primary"'?
```

---

## Is it for you?

### Why use it

- You want a typed design system for React Native with components already built.
- You want theming (colors, radii, fonts, light and dark) without a build step or a compiler.
- You want token typos to fail at compile time, not show up as a wrong color on a device.
- You want styling through typed props: `bg`, `p` and `rounded` take token names, and each component declares which props it accepts. Styles resolve at runtime and are cached per prop set, with no build step or compiler.

### The problem it solves

React Native styling usually means one of two things. Either you hand-write a `StyleSheet` per component and repeat the same spacing and color decisions everywhere, or you adopt a class-string or compiler-based setup that adds a build step and runtime cost. Vajra gives you tokens, components and theming as typed props, with nothing to configure first.

### Who it's not for

- Web projects. The package targets iOS and Android only.
- Teams that want a fully custom look and no default components. Use `@88khp/vajra-core` for unstyled primitives instead.
- Apps that want Tailwind-style class strings.

### What it doesn't do

- It doesn't ship navigation. It works with any navigation library.
- It doesn't bundle icons. Use [`@88khp/vajra-icons`](https://github.com/88khp/vajra-icons) or your own icon components.
- It doesn't fetch data or manage app state.

---

## Why Vajra UI

A design system, not a styling dialect. Utility classes give you a vocabulary; Vajra gives you the
components, the tokens and the theme, typed and ready to ship.

- **Nothing new to learn** — style with props (`bg`, `p`, `rounded`, `color`) that map to design tokens and to React Native styles. No class vocabulary to memorise.
- **Components included** — 40+ components for real screens, from Button and Input to Modal, Sheet, Toast and Tabs, plus `createRecipe` for your own variants. Build each component once instead of rebuilding it from class strings on every screen.
- **No build step** — no Babel plugin, Metro config or CSS file. Install, wrap your app in `VajraProvider`, and build.
- **Typed end to end** — tokens are typed unions, so a typo fails at compile time with *Did you mean...?*
- **Your brand, live theming** — override colors, spacing, radii and fonts with `createVajraTheme`; switch light and dark at runtime.
- **Fast, with proof** — tokens resolve at runtime with cached styles, within 8% of hand-written `StyleSheet` on variant switches. [Benchmarks](#performance)
- **Headless core** — unstyled primitives in `@88khp/vajra-core` if you want full control.
- **Free and MIT** — every component, no Pro tier, nothing behind a paywall.
- **Zero opinions on navigation** — works with any navigation library.

---

## Performance

Benchmarked against five other React Native styling libraries in one run, every library rendering
the same card with identical output. Median ms for 100 cards; switch scenarios are the total of 12
updates. Lower is faster.

| Library | Mount | Variant switch | Theme switch | Theme + variant |
|---|---|---|---|---|
| StyleSheet (hand-written baseline) | 12 | 95 | 91 | 93 |
| twrnc 4.16.0 | 13 | 106 | 97 | 99.5 |
| **Vajra UI 3.0.0** | **17** | **103** | **121.5** | **134.5** |
| styled-components 6.6.0 | 15 | 122.5 | 107 | 124 |
| NativeWind 4.2.7 | 30 | 257 | 279.5 | 287 |
| Tamagui 3.1.2, compiled | 60 | 445.5 | 626.5 | 1,071 |
| Tamagui 3.1.2, runtime only | 68 | 422.5 | 764 | 1,188.5 |

- **Variant switches run at hand-written speed**: level with twrnc, within 8% of a `StyleSheet` that
  precomputes every style, and 16% faster than styled-components.
- **2.1–2.5× faster than NativeWind** on every update, and **4–8× faster than Tamagui** with
  Tamagui's compiler on.
- **Theme switching trails the fastest libraries**: 14% behind styled-components and 25% behind
  twrnc, because every `Box`, `Text` and `Pressable` follows the theme on its own.

JavaScript-side timings under Jest on an Apple M4, each library used as its docs describe. The
harness, every library's implementation, the raw samples and the full method are in
[`benchmarks/styling/`](./benchmarks/styling/RESULTS.md). Run it yourself and check.

---

## Packages

| Package | Description |
|---------|-------------|
| `@88khp/vajra-ui` | Token-aware components + Vajra theme system |
| `@88khp/vajra-core` | Headless, unstyled primitives — no theme, no tokens |
| `@88khp/vajra-icons` | Optional. Lucide icons adapted to Vajra's icon contract, used as Alert and Toast defaults |

---

## Installation

```sh
npm install @88khp/vajra-ui @88khp/vajra-core react-native-safe-area-context
# or
yarn add @88khp/vajra-ui @88khp/vajra-core react-native-safe-area-context
```

No Babel plugin, Metro config or CSS file. `react` (>=18) and `react-native` (>=0.73) are peer
dependencies your app already has.

**Icons (optional).** `Alert` and `Toast` use icons from `@88khp/vajra-icons` when it's installed,
and text glyphs (✓ ! ⚠︎ i ✕) when it isn't. Every other component takes any icon component you pass.

```sh
npm install @88khp/vajra-icons lucide-react-native react-native-svg
```

See the [installation guide](https://88khp.github.io/vajra-ui/docs/installation) for details.

---

## Quick Start

### 1. Wrap your app

```tsx
import { VajraProvider } from '@88khp/vajra-ui';

export default function App() {
  return (
    <VajraProvider colorScheme="light">
      <YourApp />
    </VajraProvider>
  );
}
```

### 2. Build with token props

```tsx
import { Box, Text, Button, Badge } from '@88khp/vajra-ui';

export function MyScreen() {
  return (
    <Box p="s-4" gap="s-3">
      <Text variant="subheading">Hello</Text>
      <Badge label="New" bg="primary" />
      <Button label="Get started" onPress={() => {}} />
    </Box>
  );
}
```

### 3. Access tokens in your own components

```tsx
import { useVajraTheme } from '@88khp/vajra-ui';
import { View } from 'react-native';

export function MyCard() {
  const { colors, spacing, rounded } = useVajraTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        padding: spacing['s-4'],
        borderRadius: rounded['r-3'],
      }}
    />
  );
}
```

---

## Theming

### Text — italic fonts

Pass `fontStyle="italic"` as a prop on `<Text>`. The component handles cross-platform rendering automatically — no `StyleSheet` workarounds needed.

```tsx
<Text font="newsreader9pt" fontSize="_f-36px" color="text" fontStyle="italic">
  Templates
</Text>
```

**How it works internally:**
- When the font has a named italic variant registered (e.g. `Newsreader9pt-Italic`), the component resolves the PostScript font family name.
- On **iOS** — also passes `fontStyle: 'italic'` in the style object (iOS requires it even with a named font).
- On **Android** — suppresses `fontStyle` from the style object (the PostScript name alone is enough; passing `fontStyle` causes Android to apply synthetic skew on top, breaking the font).
- If no named italic file exists, falls back to synthetic italic on both platforms.

**Never duplicate `fontStyle: 'italic'` in a StyleSheet alongside the DS prop** — it overrides the internal platform logic and breaks Android:

```tsx
// BAD — breaks Android italic rendering
const styles = StyleSheet.create({ title: { fontStyle: 'italic' } });
<Text font="newsreader9pt" fontStyle="italic" style={styles.title}>...</Text>

// GOOD
<Text font="newsreader9pt" fontStyle="italic">...</Text>

// GOOD — other styles alongside are fine, just not fontStyle
const styles = StyleSheet.create({ title: { marginTop: 8 } });
<Text font="newsreader9pt" fontStyle="italic" style={styles.title}>...</Text>
```

---

### Custom fonts

```ts
// theme.ts
import { createVajraTheme } from '@88khp/vajra-ui';
import { myFonts } from './fonts';

export const theme = createVajraTheme({ fonts: myFonts });
```

```tsx
<VajraProvider theme={theme}>
  <YourApp />
</VajraProvider>
```

Get font autocomplete on `<Text font="..." />` by augmenting the module:

```ts
export type TAppFonts = keyof typeof myFonts;

declare module '@88khp/vajra-ui' {
  interface IVajraFonts extends Record<TAppFonts, true> {}
}
```

### Override brand colors

Pass a partial `colors` map — only the keys you provide are overridden, the rest stay as defaults.

```ts
export const theme = createVajraTheme({
  fonts: myFonts,
  colorScheme: 'light',
  colors: {
    primary: '#8B5CF6',
    primaryMuted: '#9D68F0',
    primarySubtle: '#F5F3FF',
    borderFocus: '#9D68F0',
  },
});
```

### Override spacing and border radii

```ts
export const theme = createVajraTheme({
  fonts: myFonts,
  spacing: { 's-4': 20 },   // bump base padding
  rounded: { 'r-2': 10 },   // slightly rounder cards
});
```

### Runtime theme switching

Hold `preset` and `colorScheme` in state, rebuild the theme on change, pass it to `VajraProvider`:

```tsx
function AppWithTheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  const theme = createVajraTheme({ fonts: myFonts, colorScheme });

  return (
    <VajraProvider theme={theme}>
      <YourApp />
    </VajraProvider>
  );
}
```

### Adding your own tokens

**Custom colors** — augment `IVajraCustomColors`. Your tokens are typed through `useVajraTheme()` alongside ours.

```ts
// theme.ts
declare module '@88khp/vajra-ui' {
  interface IVajraCustomColors {
    surfaceAccent: string;
    brandGold: string;
  }
}

export const theme = createVajraTheme({
  fonts: myFonts,
  colors: {
    surfaceAccent: '#F0E6FF',
    brandGold: '#D4A017',
  },
});
```

```tsx
// YourComponent.tsx
const { colors } = useVajraTheme();
colors.surfaceAccent // ✅ typed, autocompletes
colors.brandGold     // ✅ typed, autocompletes
```

**Custom rounded tokens** — augment `IVajraRoundedTokens`. Accepted by `rounded`, `roundedT/B/L/R` on `Box` and other components.

```ts
declare module '@88khp/vajra-ui' {
  interface IVajraRoundedTokens { 'r-12': number; }
}
```

**Custom spacing tokens** — augment `IVajraSpacingTokens`. Accepted by all spacing props (`p`, `m`, `px`, `gap`, etc.).

```ts
declare module '@88khp/vajra-ui' {
  interface IVajraSpacingTokens { 's-20': number; }
}
```

**Custom typography variants** — augment `IVajraFontVariants`. Accepted by `variant` on `Text` and available via `useVajraTheme().typography`.

```ts
import { TFontVariantProps } from '@88khp/vajra-ui';

declare module '@88khp/vajra-ui' {
  interface IVajraFontVariants {
    displayLarge: TFontVariantProps;
  }
}

// Provide values in createVajraTheme
export const theme = createVajraTheme({
  fonts: myFonts,
  typography: {
    displayLarge: { fontSize: 48, lineHeight: 56, fontWeight: '700' },
  },
});
```

> Our components only use our tokens — nothing breaks. Your tokens are only visible through props and hooks in your own components.

For the full augmentation guide — see [docs/theming.md](./docs/theming.md).

For the full theming guide including runtime switching, spacing/radius overrides, and custom fonts — see [docs/theming.md](./docs/theming.md).

---

## Design Tokens

### Colors

| Token | Description |
|-------|-------------|
| `primary` / `primaryMuted` / `primarySubtle` | Brand primary scale |
| `secondary` / `secondaryMuted` / `secondarySubtle` | Brand secondary scale |
| `text` / `textMuted` / `textInverse` / `textDisabled` | Text scale |
| `background` | Screen background |
| `surfaceSunken` / `surface` / `surfaceRaised` / `surfaceOverlay` | Surface scale |
| `border` / `borderStrong` / `borderFocus` | Border scale |
| `error` / `errorMuted` / `errorSubtle` | Error feedback |
| `success` / `successMuted` / `successSubtle` | Success feedback |
| `warning` / `warningMuted` / `warningSubtle` | Warning feedback |
| `info` / `infoMuted` / `infoSubtle` | Info feedback |

### Spacing

| Token | Value (px) |
|-------|-----------|
| `s-0` | 0 |
| `s-1` | 4 |
| `s-2` | 8 |
| `s-3` | 12 |
| `s-4` | 16 |
| `s-5` | 20 |
| `s-6` | 24 |
| `s-8` | 32 |
| `s-10` | 40 |
| `s-12` | 48 |
| `s-16` | 64 |

### Border Radius

| Token | Value (px) |
|-------|-----------|
| `r-0` | 0 |
| `r-1` | 4 |
| `r-2` | 8 |
| `r-3` | 12 |
| `r-4` | 16 |
| `r-5` | 20 |
| `r-6` | 24 |
| `r-7` | 28 |
| `r-8` | 32 |
| `r-9` | 36 |
| `r-10` | 40 |
| `r-full` | 9999 |

### Typography

| Variant | Use |
|---------|-----|
| `display` | Hero text |
| `h1` / `h2` / `h3` | Page and section headings |
| `subheading` | Section labels |
| `body` / `bodyMedium` / `bodySmall` | Body copy |
| `button` | Button labels |
| `label` / `labelMedium` | UI labels |
| `caption` | Helper text, timestamps |

---

## Architecture

```
@88khp/vajra-ui
├── core/           Token-aware wrappers (Box, Text, Pressable...)
├── components/     Opinionated components (Button, Badge, TabBar...)
├── vajra-theme/    Default tokens, VajraProvider, useVajraTheme
└── theme/          Generic ThemeProvider + useTheme (no vajra tokens)

@88khp/vajra-core
└── Headless primitives — no theme dependency
```

**Layer rule:** `core` imports from `vajra-core`. `components` imports from `core`. Nothing imports across layers.

`Box`, `Text`, `Pressable` and `TextInput` render React Native's host components directly with
core's cached style builder. A token-styled `Box` costs about 3 µs per node over a raw `View`; see
[docs/PERFORMANCE.md](./docs/PERFORMANCE.md).

---

## Contributing

See [CODING_GUIDELINES.md](./CODING_GUIDELINES.md) for naming conventions, folder structure, and component patterns.

---

## License

MIT © [88khp](https://github.com/88khp)
