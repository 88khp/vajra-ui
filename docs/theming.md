# Theming

Vajra UI's theme system is built around semantic design tokens. You can override any token, add your own, switch themes at runtime, and bring custom fonts — all fully typed.

---

## createVajraTheme

The main entry point for setting up your theme.

```ts
import { createVajraTheme } from '@88khp/vajra-ui';

export const theme = createVajraTheme({
  colorScheme: 'light',    // 'light' | 'dark' — defaults to 'light'
  fonts: myFonts,          // required
  colors: { ... },         // optional — override existing or add custom color tokens
  spacing: { ... },        // optional — override existing or add custom spacing tokens
  rounded: { ... },        // optional — override existing or add custom border radius tokens
  typography: { ... },     // optional — override existing or add custom text variants
  fontSizes: { ... },      // optional — override existing or add custom font size tokens
  lineHeights: { ... },    // optional — override existing or add custom line height tokens
});
```

Pass the result to `VajraProvider`:

```tsx
<VajraProvider theme={theme}>
  <YourApp />
</VajraProvider>
```

---

## Overriding existing tokens

Pass partial maps — only the keys you provide are overridden, everything else falls back to Vajra defaults.

```ts
export const theme = createVajraTheme({
  fonts: myFonts,
  colorScheme: 'light',
  colors: {
    primary: '#8B5CF6',
    primaryMuted: '#9D68F0',
    primarySubtle: '#F5F3FF',
  },
  spacing: {
    's-4': 20,  // bump the base padding unit
  },
  rounded: {
    'r-2': 10,  // slightly rounder cards
  },
});
```

---

## Adding your own tokens

All token systems support module augmentation. Declare the interface in your app, provide values in `createVajraTheme`, and your tokens are typed end-to-end — autocomplete in props, `useVajraTheme()`, and `createVajraTheme`.

**The pattern is always the same:**
1. Declare the interface (for TypeScript autocomplete)
2. Provide values in `createVajraTheme` (for runtime resolution)
3. Use them in components

---

### Custom color tokens

```ts
// theme.ts
declare module '@88khp/vajra-ui' {
  interface IVajraCustomColors {
    brandGold: string;
    surfaceAccent: string;
  }
}

export const theme = createVajraTheme({
  fonts: myFonts,
  colors: {
    primary: '#8B5CF6',       // override existing
    brandGold: '#D4A017',     // new custom token
    surfaceAccent: '#F0E6FF', // new custom token
  },
});
```

```tsx
<Box bg="brandGold" borderColor="surfaceAccent" />
<Text color="brandGold" />

const { colors } = useVajraTheme();
colors.brandGold     // ✅ typed, autocompletes
colors.surfaceAccent // ✅ typed, autocompletes
```

---

### Custom spacing tokens

```ts
declare module '@88khp/vajra-ui' {
  interface IVajraSpacingTokens {
    's-20': number;
    's-24': number;
  }
}

export const theme = createVajraTheme({
  fonts: myFonts,
  spacing: {
    's-20': 80,
    's-24': 96,
  },
});
```

```tsx
<Box p="s-20" gap="s-24" /> // ✅ typed, autocompletes
```

---

### Custom border radius tokens

```ts
declare module '@88khp/vajra-ui' {
  interface IVajraRoundedTokens {
    'r-12': number;
    'r-16': number;
  }
}

export const theme = createVajraTheme({
  fonts: myFonts,
  rounded: {
    'r-12': 48,
    'r-16': 64,
  },
});
```

```tsx
<Box rounded="r-12" />   // ✅ typed, autocompletes
<Box roundedT="r-16" />  // ✅ typed, autocompletes
```

---

### Custom font size tokens

```ts
declare module '@88khp/vajra-ui' {
  interface IVajraFontSizeTokens {
    'f-2.5': number;
  }
}

export const theme = createVajraTheme({
  fonts: myFonts,
  fontSizes: { 'f-2.5': 18 },
  lineHeights: { 'f-2.5': 24 },
});
```

```tsx
<Text fontSize="f-2.5" /> // ✅ typed, autocompletes, resolves to 18px
```

---

### Custom typography variants

```ts
import { TFontVariantProps } from '@88khp/vajra-ui';

declare module '@88khp/vajra-ui' {
  interface IVajraFontVariants {
    displayLarge: TFontVariantProps;
    eyebrow: TFontVariantProps;
  }
}

export const theme = createVajraTheme({
  fonts: myFonts,
  typography: {
    displayLarge: { fontSize: 48, lineHeight: 56, fontWeight: '700' },
    eyebrow: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  },
});
```

```tsx
<Text variant="displayLarge">Hero</Text>  // ✅ typed, autocompletes
<Text variant="eyebrow">Section</Text>    // ✅ typed, autocompletes
```

---

## Custom fonts

```ts
const myFonts = {
  inter: {
    '400': 'Inter-Regular',
    '500': 'Inter-Medium',
    '700': 'Inter-Bold',
  },
};

export const theme = createVajraTheme({ fonts: myFonts });
```

Augment `IVajraFonts` to get autocomplete on `<Text font="..." />`:

```ts
declare module '@88khp/vajra-ui' {
  interface IVajraFonts {
    inter: true;
  }
}
```

```tsx
<Text font="inter" fontWeight="700">Bold Inter text</Text> // ✅
```

---

## Runtime theme switching

Hold theme state at the app root, rebuild with `createVajraTheme` on change, pass the result to `VajraProvider`.

```tsx
import { useState } from 'react';
import { VajraProvider, createVajraTheme } from '@88khp/vajra-ui';

type TColorScheme = 'light' | 'dark';

const presets = {
  default: {},
  purple: { primary: '#8B5CF6', primaryMuted: '#9D68F0', primarySubtle: '#F5F3FF' },
  orange: { primary: '#F97316', primaryMuted: '#FB923C', primarySubtle: '#FFF7ED' },
};

type TPreset = keyof typeof presets;

export function AppWithTheme({ children }: { children: React.ReactNode }) {
  const [preset, setPreset] = useState<TPreset>('default');
  const [colorScheme, setColorScheme] = useState<TColorScheme>('light');

  const theme = createVajraTheme({
    fonts: myFonts,
    colorScheme,
    colors: presets[preset],
  });

  return (
    <VajraProvider theme={theme}>
      {children}
    </VajraProvider>
  );
}
```

---

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

---

## Token reference

### Colors — `TVajraColors`

| Token | Description |
|-------|-------------|
| `primary` / `primaryMuted` / `primarySubtle` | Brand primary scale |
| `secondary` / `secondaryMuted` / `secondarySubtle` | Brand secondary scale |
| `text` / `textMuted` / `textInverse` / `textDisabled` | Text scale |
| `background` | Screen background |
| `surfaceSunken` / `surface` / `surfaceRaised` / `surfaceOverlay` | Surface scale |
| `overlay` | Semi-transparent scrim |
| `border` / `borderStrong` / `borderFocus` | Border scale |
| `error` / `errorMuted` / `errorSubtle` | Error feedback |
| `success` / `successMuted` / `successSubtle` | Success feedback |
| `warning` / `warningMuted` / `warningSubtle` | Warning feedback |
| `info` / `infoMuted` / `infoSubtle` | Info feedback |
| `transparent` | Transparent |

### Spacing — `TSpacingToken`

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

### Border Radius — `TRoundedToken`

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

### Font Sizes — `TFontSizeToken`

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

### Typography — `TFontVariant`

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
