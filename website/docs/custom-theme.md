---
id: custom-theme
title: Custom Theme
sidebar_position: 4
---

# Custom Theme

Override any default token, add entirely new ones, or switch themes at runtime, all fully typed via `createVajraTheme`. See [Theming](./theming) for the default token values this builds on.

## Overriding existing tokens

Pass partial maps to `createVajraTheme`. Only the keys you provide are overridden, everything else falls back to Vajra defaults.

```ts
import { createVajraTheme } from '@88khp/vajra-ui';

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

## Adding your own tokens

All token systems support module augmentation. Declare the interface in your app, provide values in `createVajraTheme`, and your tokens are typed end-to-end: autocomplete in props, `useVajraTheme()`, and `createVajraTheme`.

**The pattern is always the same:**
1. Declare the interface (for TypeScript autocomplete)
2. Provide values in `createVajraTheme` (for runtime resolution)
3. Use them in components

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
