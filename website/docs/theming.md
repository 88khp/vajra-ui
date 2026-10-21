---
id: theming
title: Theming
sidebar_position: 3
---

import ColorSwatches from '@site/src/components/ColorSwatches';

# Theming

Vajra UI's theme system is built around semantic design tokens: colors, spacing, border radius, and typography. Every component prop reads from these tokens instead of raw values, so the whole library reflects one consistent theme. This page shows the default theme as it actually renders. To override tokens, add your own, or switch themes at runtime, see [Custom Theme](./custom-theme).

## createVajraTheme

The entry point for setting up your theme. Wrap your app in `VajraProvider` with the result.

```ts
import { createVajraTheme } from '@88khp/vajra-ui';

export const theme = createVajraTheme({
  colorScheme: 'light',    // 'light' | 'dark', defaults to 'light'
  fonts: myFonts,          // required
  defaultFont: 'inter',    // optional: family used by every <Text>, at each variant's weight
  appBar: { bg: 'background', tint: 'text' }, // optional: default AppBar.Header colors
});
```

```tsx
<VajraProvider theme={theme}>
  <YourApp />
</VajraProvider>
```

## useVajraTheme

Access the resolved theme anywhere inside `VajraProvider`.

```tsx
import { useVajraTheme } from '@88khp/vajra-ui';

const { colors, spacing, rounded, typography, fontSizes, lineHeights, fonts } = useVajraTheme();
```

| Property | Type | Description |
|----------|------|-------------|
| `colors` | `Record<TVajraColors, string>` | All color tokens, resolved to hex strings |
| `spacing` | `Record<TSpacingToken, number>` | All spacing tokens, resolved to numbers |
| `rounded` | `Record<TRoundedToken, number>` | All border radius tokens, resolved to numbers |
| `typography` | `Record<TFontVariant, TFontVariantProps>` | Font size, line height, weight per variant |
| `fontSizes` | `Record<TFontSizeToken, number>` | All font size tokens, resolved to numbers |
| `lineHeights` | `Record<string, number>` | All line height tokens, resolved to numbers |
| `fonts` | your font map | Custom font families |

## Colors

The default theme's brand, text, surface, border, and feedback scales, rendered with their live resolved hex values. Switch the site's color mode to see the dark theme's values.

### Brand

<ColorSwatches tokens={['primary', 'primaryEmphasis', 'primaryMuted', 'primarySubtle', 'secondary', 'secondaryEmphasis', 'secondaryMuted', 'secondarySubtle']} />

### Text

<ColorSwatches tokens={['text', 'textSubtle', 'textMuted', 'textDisabled', 'textInverse', 'textInverseMuted']} />

### Background & surface

<ColorSwatches tokens={['background', 'backgroundSunken', 'backgroundRaised', 'surface', 'surfaceSunken', 'surfaceRaised', 'surfaceOverlay']} />

### Border

<ColorSwatches tokens={['border', 'borderSubtle', 'borderStrong', 'borderFocus']} />

### Feedback

<ColorSwatches tokens={['error', 'errorMuted', 'errorSubtle', 'success', 'successMuted', 'successSubtle', 'warning', 'warningMuted', 'warningSubtle', 'info', 'infoMuted', 'infoSubtle']} />

### Overlay

<ColorSwatches tokens={['overlayLight', 'overlay', 'overlayStrong']} />

Plus `transparent`, resolving to CSS `transparent`.

## Spacing, `TSpacingToken`

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

## Border Radius, `TRoundedToken`

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

## Font Sizes, `TFontSizeToken`

| Token | Value (px) |
|-------|-----------|
| `f-1` | 12 |
| `f-1.5` | 14 |
| `f-2` | 16 |
| `f-2.5` | 18 |
| `f-3` | 20 |
| `f-4` | 24 |
| `f-5` | 28 |
| `f-6` | 32 |

## Typography, `TFontVariant`

| Variant | Font Size | Line Height | Weight | Use |
|---------|-----------|-------------|--------|-----|
| `display` | 32 | 36 | 700 | Hero text |
| `h1` | 28 | 32 | 700 | Page title |
| `h2` | 24 | 28 | 600 | Section title |
| `h3` | 20 | 24 | 600 | Sub-section title |
| `subheading` | 20 | 24 | 500 | Section label |
| `body` | 16 | 20 | 400 | Default body copy |
| `bodyMedium` | 16 | 20 | 500 | Emphasized body |
| `bodySmall` | 14 | 18 | 400 | Secondary body copy |
| `button` | 16 | 20 | 600 | Button labels |
| `label` | 12 | 16 | 400 | Small UI labels |
| `labelMedium` | 12 | 16 | 500 | Medium weight label |
| `caption` | 14 | 18 | 400 | Helper text, timestamps |

A variant can also set `fontVariant` to any React Native `fontVariant` value, for example `['tabular-nums']` so prices line up:

```ts
const theme = createVajraTheme({
  fonts: myFonts,
  typography: {
    body: { fontSize: 16, lineHeight: 20, fontWeight: '400', fontVariant: ['tabular-nums'] },
  },
});
```
