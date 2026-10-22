---
id: intro
title: Introduction
sidebar_position: 1
slug: /
---

# Vajra UI

**Design tokens, not class strings.** Vajra UI is a typed React Native design system: you style
with props you already know, get 40+ components out of the box, and switch themes live, with no
compiler and no build step.

```tsx
<Box p="s-4" gap="s-3" bg="surface" rounded="r-3">
  <Text variant="subheading">Hello</Text>
  <Button label="Get started" onPress={() => {}} />
</Box>
```

- **Nothing new to learn**: style with props (`bg`, `p`, `rounded`, `color`) that map to design
  tokens and to React Native styles. No class vocabulary to memorise.
- **Components included**: 40+ components for real screens, from Button and Input to Modal, Sheet,
  Toast and Tabs, plus `createRecipe` for your own variants.
- **No build step**: no Babel plugin, Metro config or CSS file. Install, wrap your app in
  `VajraProvider`, and build.
- **Typed end to end**: tokens are typed unions, so `bg="primry"` fails at compile time with
  *Did you mean "primary"?*
- **Your brand, live theming**: override colors, spacing, radii and fonts with `createVajraTheme`,
  and switch light and dark at runtime.
- **Fast, with proof**: level with twrnc on variant switches, 2.2–2.6× faster than NativeWind and
  4–8× faster than Tamagui, in an open benchmark. See [Performance & benchmarks](./performance).
- **Headless core**: unstyled primitives in `@88khp/vajra-core` if you want full control.
- **Free and MIT**: every component, no Pro tier, nothing behind a paywall.

See [Installation & Setup](./installation) to get started, or [Theming](./theming) for the full
token and customization guide.
