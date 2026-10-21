---
id: installation
title: Installation & Setup
sidebar_position: 2
---

# Installation & Setup

## Install

```sh
npm install @88khp/vajra-ui @88khp/vajra-ui-core
```

`@88khp/vajra-ui-core` (formerly `@devraj-labs/vajra-ui-core`) is a required peer dependency: the headless, unstyled primitives that `@88khp/vajra-ui` builds its token-aware components on top of.

### Peer dependencies

```sh
npm install react react-native react-native-safe-area-context
```

| Package | Minimum version |
|---|---|
| `react` | `>=18.0.0` |
| `react-native` | `>=0.73.0` |
| `react-native-safe-area-context` | `>=4.8.0` |

## Wrap your app

`VajraProvider` makes theme tokens available to every component via `useVajraTheme()`.

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

### Safe area setup

`VajraProvider` does not include a `SafeAreaProvider`. Components that read safe-area insets (`AppBar.Header`, for one) need your app wrapped in one, so add it above `VajraProvider`:

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VajraProvider } from '@88khp/vajra-ui';

export default function App() {
  return (
    <SafeAreaProvider>
      <VajraProvider colorScheme="light">
        <YourApp />
      </VajraProvider>
    </SafeAreaProvider>
  );
}
```

## Fonts

Vajra UI ships no default fonts. `createVajraTheme` requires a `fonts` map before anything renders, and every font it references must already be linked as a native asset in your app, `createVajraTheme` only maps a name and weight to a PostScript font family, it doesn't link the font file itself.

### 1. Link the font files

Place your `.ttf`/`.otf` files under an assets folder (e.g. `assets/fonts/`) and link them:

```sh
npx react-native-asset
```

This copies the fonts into the native iOS and Android projects and registers them, using each file's own PostScript name. If you're on Expo, use `expo-font` and `useFonts` instead, following [Expo's font guide](https://docs.expo.dev/develop/user-interface/fonts/).

### 2. Map font families in your theme

```ts
// fonts.ts
export const myFonts = {
  inter: {
    '400': 'Inter-Regular',
    '500': 'Inter-Medium',
    '700': 'Inter-Bold',
  },
};
```

Each key under a font family is a `fontWeight` value (`'400' | '500' | '600' | '700'`), pointing at the exact PostScript name the font file linked as.

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

### 3. (Optional) Get autocomplete on `font="..."`

```ts
declare module '@88khp/vajra-ui' {
  interface IVajraFonts {
    inter: true;
  }
}
```

```tsx
<Text font="inter" fontWeight="700">Bold Inter text</Text>
```

See [Custom Theme](./custom-theme) for overriding colors, spacing, and other tokens, and [Theming](./theming) for the full default token reference.

## Quick start

```tsx
import { VajraProvider, Box, Text, Button } from '@88khp/vajra-ui';

export default function App() {
  return (
    <VajraProvider colorScheme="light">
      <Box p="s-4" gap="s-3">
        <Text variant="subheading">Hello</Text>
        <Button label="Get started" onPress={() => {}} />
      </Box>
    </VajraProvider>
  );
}
```
