# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0-alpha.1] - 2026-10-21

### Changed

- The core peer dependency is now `@88khp/vajra-ui-core@3.0.0-alpha.1`.
- `Pressable` renders React Native `Pressable` directly instead of going through core's `CorePressable`, so it is one component layer over `Pressable` instead of two. Props and press feedback are unchanged.
- `TextInput` renders React Native `TextInput` directly instead of going through core's `CoreTextInput`. Props are unchanged.
- `InputRoot` is no longer a `forwardRef` component. It never attached the ref, and React warned about it on import.

### Performance

- `Box`, `Pressable`, `Text` and `TextInput` pass a per-theme token resolver to core's `splitStyleProps` instead of copying every prop to resolve tokens first. Styles are cached per theme by the token names as passed (`bg="primary" p="s-4"`), so an element whose style is cached skips token resolution and style building entirely.
- `Pressable` passes the same `style` callback on every render while its style is unchanged.
- `Input` fields pass `TextInput` a shared style object and stable focus, blur and change handlers, and `InputRoot` memoizes its context value. The memoized `TextInput` now skips re-rendering when its own props have not changed, e.g. while another input in the same form is typed into.

## [3.0.0-alpha.0] - 2026-10-21

### Changed

- **Breaking:** the package is renamed from `@devraj-labs/vajra-ui` to `@88khp/vajra-ui`. Update the dependency and every import. The repository and docs site moved to `github.com/88khp/vajra-ui` and `88khp.github.io/vajra-ui`.
- **Breaking:** the core peer dependency is now `@88khp/vajra-ui-core@3.0.0-alpha.0` (renamed from `@devraj-labs/vajra-ui-core`). Install it alongside `@devraj-labs/vajra-ui` and remove the old package.
- **Breaking:** `Pressable` is built on React Native `Pressable` instead of `TouchableOpacity`, through core's `CorePressable`. `TouchableOpacity`-only props such as `delayPressIn` are no longer accepted. Press feedback is an instant opacity change to `activeOpacity` (default `0.2`, pass `1` to turn it off) instead of a fade.
- `AbsoluteCenter` builds its fill from Box props instead of an inline style, so passing `top`, `left`, `right` or `bottom` now overrides the fill.
- `Box`, `Pressable`, `Row`, `Col`, `Center`, `AbsoluteCenter`, `AbsoluteView`, `Grid.Root` and `Grid.Item` are no longer wrapped in `memo`. They take children, which are new elements on every parent render, so the comparison never skipped a render.

### Performance

- `Box` renders `View` directly with core's `splitStyleProps` instead of going through `CoreBox`, so it is one component layer over `View` instead of two.
- `Text` renders React Native `Text` directly with core's style builder. It no longer builds a new style array with margin, `fontVariant` and `fontStyle` keys on every render, so `Text` elements with the same resolved tokens share one cached style object.
- Token props (colors, rounded, spacing) are resolved in one pass, and token props that were not passed are dropped instead of forwarded as `undefined`. This replaces a 15-key spacing object allocated on every render of `Box`, `Pressable` and `TextInput`.
- `Spacer` renders `View` directly with a cached style.
- `AbsoluteCenter` and `AbsoluteView` no longer pass a new inline style object on every render.

## [2.0.0] - 2026-10-21

### Added

- `Switch` now works as a standalone on/off toggle: `<Switch value={boolean} onChange={(value: boolean) => void} label? color? isDisabled? />`. `Switch.Root` / `Switch.Item` remain the single-select group.
- `Button` and `Badge` accept a `tone` prop (`primary` | `secondary` | `success` | `warning` | `error` | `info`). On `Button`, `tone` re-points the variant's accent color, so `tone="error"` gives a destructive button; on `Badge` it sets the background, and an explicit `bg` still wins.
- `IconButton` accepts `isPill`, matching `Button`.
- `SafeAreaScreenWrapper` accepts a `bg` color token (defaults to `background`), so full-screen sheets can use `surfaceRaised`.
- Typography variants accept `fontVariant` (for example `['tabular-nums']`), applied to every `Text` that uses the variant.
- `createVajraTheme({ defaultFont })` names a font family from `fonts` that every `Text` uses by default, at each variant's own weight.
- `createVajraTheme({ appBar: { bg, tint } })` sets the default colors for `AppBar.Header`, replacing the hard-coded `primary` / `textInverse` pair.
- `TTextInputInstance` type, the instance type `TextInput` refs now expose.

### Changed

- **Breaking:** `Menu` action `icon` takes a `TVajraIconComponent` (like `IconButton` and `AppBar`) instead of a `ReactNode`. The icon receives `size` and `color` automatically, and destructive actions color it with the error token.
- `Text` with a `font` prop now resolves the family at the variant's weight. Previously it always used `fontWeight="400"` unless passed explicitly, so a `h1` with `font` rendered at regular weight.
- `Grid.Item` sizes from its enclosing `Grid.Root`'s measured width (minus the root's horizontal padding), so `screenPadding` is no longer needed. It is only used for the first frame before layout.
- `TextInput` and the `Input` family forward refs typed as `TTextInputInstance` (the instance `TextInput` holds) instead of the `TextInput` component type.

## [1.1.0] - 2026-08-11

### Added

- `AlertProvider` / `useAlert()` — a global, stacked notification-list provider for `Alert`, mirroring `ToastProvider`'s API (`show()`/`hide()`, queued overflow, top/bottom anchoring). Alerts stay visible until dismissed by default (no auto-dismiss timer), unlike Toast.
- `ToastProvider` now stacks up to `maxVisible` toasts on screen simultaneously (previously only one toast was ever visible at a time, with the rest queued behind it) — each toast animates and auto-dismisses independently.
- `maxVisible` prop on `ToastProvider` and `AlertProvider`, and a matching `toast.maxVisible` / `alert.maxVisible` theme default (3) in `defaultVajraTheme`, overridable via `createVajraTheme({ toast: { maxVisible }, alert: { maxVisible } })`.
- `Toast` and `Alert` now show a default icon per variant (`success`/`error`/`warning`/`info`) from `@devraj-labs/vajra-ui-icons` automatically — pass `icon` to override it, or `null` to render none.
- `Toast` gained an optional `dismissible` flag (and `Alert`'s existing `onDismiss` dismiss button now defaults to `XIcon`) rendering a proper dismiss button with a real touch target (`hitSlop` + padding), replacing the old plain "✕" text glyph.
- `@devraj-labs/vajra-ui-icons` added as a dependency — the first consumer of the sibling icons package.

### Fixed

- `ToastProvider`'s overlay used `pointerEvents="none"`, which silently blocked presses on the new dismiss button; changed to `pointerEvents="box-none"` so the container stays click-through while its children remain interactive.
- Docs site (`website/docs/components/toast.mdx`, `alert.mdx`): the live preview card had no `position: relative`, so a triggered Toast rendered outside/above the demo card instead of inside it.

## [1.0.0] - 2026-07-31

First stable release. Two phases of work: hardening the foundation (testing, CI, architecture) so a breadth push could ship on solid ground, then the breadth push itself — 15 new components and a full documentation site with live, in-browser previews of every component.

### Added — Foundation & Trust

- ESLint rule enforcing the layer boundary described in the README: `src/ui/components/**` can no longer import `@devraj-labs/vajra-ui-core` directly and must go through `src/ui/core`.
- Two more ESLint layer-boundary rules: `src/ui/core/**` can no longer import from `src/ui/components/**` (prevents layer inversion), and nothing outside `src/ui/vajra-theme/**` may import `src/theme/**` directly (it's internal plumbing — use `useVajraTheme`/`VajraProvider` instead).
- Jest + React Native Testing Library at the root package — the library itself had zero test coverage before this release.
- CI (`.github/workflows/ci.yml`): typecheck/lint/test/build the library on every PR, a typecheck of `examples/app` against the local package to catch breaking API changes, and a verification that the built `dist/` output is actually importable the way a real consumer would (`scripts/verify-dist.sh` — packs the tarball, installs it fresh, typechecks a real import against it).
- Documented the `src/theme` vs `src/ui/vajra-theme` relationship, a step-by-step component authoring scaffold (simple and compositional), and the optional-peer-dependency pattern for motion-enhanced components in `CODING_GUIDELINES.md`.

### Added — Breadth & Reach

Fifteen new components, closing the gap with other RN component libraries on real-app-screen coverage:

- **Modal** — built on RN's native `Modal` for correct Android back-button/overlay behavior, token-driven backdrop and content.
- **Sheet** — bottom sheet composing `Modal`, drag-to-dismiss via `PanResponder`/`Animated` (no reanimated/gesture-handler dependency needed).
- **Toast** — provider + imperative `useToast().show()` API, queued with auto-dismiss, five feedback variants.
- **Select** — trigger styled like `Input`, options presented in a `Sheet`.
- **List** — thin token-aware `FlatList` wrapper with a default separator and empty-state slot.
- **Skeleton** — pulsing placeholder box.
- **Alert** — inline (non-toast) feedback banner, same five variants as Toast with subtler styling.
- **Accordion** — `Root`/`Item` composition, animated height, single or multi-open.
- **Menu** — action sheet built on `Sheet`, destructive/disabled action states.
- **Tabs** — `Root`/`List`/`Content` composition with real content-switching, distinct from the existing `TabBar` (which is visual-only).
- **Chip** — interactive selectable/removable pill, distinct from the static `Badge`.
- **ProgressBar** — animated 0–1 fill with `accessibilityValue`.
- **Slider** — drag-to-adjust via `PanResponder`, min/max/step.
- **Stepper** — increment/decrement numeric input.
- **Tooltip** — tap-to-toggle (mobile has no hover), positioned relative to its own wrapper.

### Added — Documentation

- Full component reference site (`website/`) with **live, in-browser previews** of every component (all 11 core primitives, all 29 opinionated components) rendered via a hand-rolled `react-native-web` webpack integration — not just static code snippets.
- Real branding, intro/quick-start page, and the existing theming and italic-fonts guides brought in as proper docs pages.
- CI now builds the docs site on every PR.

### Fixed

- `Button`'s barrel (`src/ui/components/button/index.ts`) re-exported `TButtonSize`/`TButtonVariant` from both `button-types` and `button-variants`, causing an `import/export` duplicate-export lint error. The barrel now re-exports those types only once, from `button-types`.
- `check-file/filename-naming-convention` was rejecting every `*.test.tsx` file as invalid kebab-case (it read `.test` as part of the name to validate) — fixed with `ignoreMiddleExtensions: true`.
- `IconSwitch` had no `testID` pass-through, forcing a brittle multi-level DOM-traversal workaround in its test — added the prop and simplified the test.

### Removed

- Deleted the stray, empty top-level `src/core/` directory, a leftover from when headless primitives were extracted into the separate `@devraj-labs/vajra-ui-core` package.

## [0.5.3] - 2026-05-06

### Fixed

- `Text`: iOS requires `fontStyle: 'italic'` passed through even when a named italic font file is resolved; Android must have it suppressed in that case or the OS applies synthetic skew on top of the italic font file, breaking rendering. Platform-branched in `src/ui/core/text/text.tsx`.

## [0.5.2] - 2026-05-06

### Fixed

- `Text`: always pass `fontStyle` through to the underlying core text component for iOS italic rendering (superseded by the platform-branched fix in 0.5.3).

## [0.5.1] - 2026-05-06

### Added

- `Text`: `fontStyle` prop with named italic font file resolution — when a font has a registered italic PostScript variant (e.g. `Newsreader9pt-Italic`), it's resolved and used instead of relying on synthetic italic.

## [0.5.0] - 2026-04-28

### Added

- `IVajraCustomColors` module-augmentation interface so consumers can add or override color tokens with full type safety.
- `IVajraFontSizeTokens` augmentation interface and a new `f-2.5` (18px) font size token.
- `fontSizes`/`lineHeights` moved into the theme object, with custom font size tokens supported via `IVajraFontSizeTokens` and `createVajraTheme`.

### Changed

- `docs/theming.md` rewritten to accurately document the "Bring Your Own Theme" (BYOT) model and all augmentation interfaces.

## [0.4.0] - 2026-04-11

### Added

- `opacity` prop on `Box`.

## [0.3.4] - 2026-04-11

### Added

- `opacity` prop on `Box` (see 0.4.0 — tag cut same day, no functional delta).

## [0.3.3] - 2026-04-11

### Added

- Rounded tokens `r-5` through `r-10`, plus `overflow`/`position` props on `Box`, and an `IVajraRoundedTokens` augmentation interface.
- `IVajraSpacingTokens` and `IVajraFontVariants` augmentation interfaces, and typography overrides in `createVajraTheme`.
- `fontSize` prop on `Text` for finer-grained sizing control.

## [0.3.0] - 2026-04-11

### Fixed

- Variant resolution bug in `Button`.

### Changed

- Icon-related prop changes across components for maximum compatibility with consumer apps.

## [0.2.1] - 2026-04-09

### Changed

- Internal path/config change (no consumer-facing API change).

## [0.2.0] - 2026-04-09

### Added

- `release` script (`build` + `npm publish --access public`).

## [0.1.0] - 2026-04-09

Initial tagged release. Project scaffolding, `CODING_GUIDELINES.md`, and README.
