# Vajra UI 3.0.0: styling benchmark results

This page reports how fast Vajra UI 3.0.0 renders compared with five other React Native styling
libraries. It also explains exactly how the numbers were produced, what could have biased them,
and how to check or reproduce them.

The raw samples, the generated report and the dashboard for this run are in
[`results/release-3.0.0/`](results/release-3.0.0/).

## Summary

Median ms for 100 cards, all libraries in the same run. Lower is faster.

| Library | Mount | Variant switch | Theme switch | Theme + variant |
|---|---|---|---|---|
| StyleSheet (hand-written baseline) | 12 | 95 | 91 | 93 |
| twrnc 4.16.0 | 13 | 106 | 97 | 99.5 |
| **Vajra UI 3.0.0** | **17** | **103** | **121.5** | **134.5** |
| styled-components 6.6.0 | 15 | 122.5 | 107 | 124 |
| NativeWind 4.2.7 | 30 | 257 | 279.5 | 287 |
| Tamagui 3.1.2, compiled | 60 | 445.5 | 626.5 | 1,071 |
| Tamagui 3.1.2, runtime only | 68 | 422.5 | 764 | 1,188.5 |

Switch columns are the total of 12 updates in one trial. In plain terms:

- **Variant switching**, the most common interaction, is level with twrnc (103 against 106 ms),
  8% behind hand-written StyleSheet, and 16% faster than styled-components.
- **Against NativeWind**, Vajra is 2.1–2.5× faster on every update, and 1.8× faster to mount.
- **Against Tamagui**, with Tamagui's compiler on, Vajra is 4.3× faster on variant switches,
  5.2× on theme switches and 8× on both at once.
- **Theme switching is where Vajra trails.** It is 14% slower than styled-components, 25% slower
  than twrnc and 34% slower than StyleSheet. With theme and variant at once it is 9%, 35% and 45%
  slower. [Where the remaining time goes](#where-the-remaining-time-goes) explains why.
- **Mount** is 17 ms for 100 cards, 2–5 ms behind StyleSheet, twrnc and styled-components.

These are JavaScript-side timings under Jest on a desktop machine, not frame times on a phone.
See [Limits of these numbers](#limits-of-these-numbers).

## What was compared

| Package | Version | Source |
|---|---|---|
| `@88khp/vajra-ui` | 3.0.0 | npm registry (SHA-1 `7e5e46aa3e6672317a60d9ca35206296c490530d`) |
| `@88khp/vajra-core` | 3.0.0 | npm registry (SHA-1 `35a9ffa9c00be5c2f229e53895720846846a1cc2`) |

These are the published packages, the same files anyone installs. `@88khp/vajra-icons` is not
installed: it is optional, and the benchmark card doesn't use `Alert` or `Toast`.

Other libraries: StyleSheet from React Native 0.84.1, twrnc 4.16.0, styled-components 6.6.0,
NativeWind 4.2.7 (Tailwind 3.4.19, css-interop 0.2.7) and Tamagui 3.1.2, with and without its
compiler (`@tamagui/metro-plugin` 3.1.2). All are pinned in `package.json` and `yarn.lock`.
Unistyles is not measured because it needs its native runtime.

## How it was measured

- **Machine.** Apple M4, 10 CPUs, 16 GB, macOS 26.5.2, Node 24.22.0, on mains power. The load
  average before the run was 3.1. See
  [`machine-state.txt`](results/release-3.0.0/machine-state.txt).
- **Harness.** Jest 29.7.0 with react-test-renderer 19.2.3 and React 19.2.3. Every library
  renders through React Native's Jest host components.
- **Workload.** One `BenchmarkCard` (a card with a title, a status dot, a description and two
  buttons) rendered 100 times, defined once in [`shared/spec.ts`](shared/spec.ts). Each library
  has one card implementation in [`implementations/`](implementations/).
- **Scenarios.**
  - **A. Mount:** render 100 cards.
  - **C. Variant switch:** change every card's variant.
  - **D. Theme switch:** flip light and dark.
  - **E. Theme + variant:** both at once.
  - **B.** A parent re-render that changes nothing. It is below the timer's resolution, so it isn't reported.
- **Run settings.** `--smoke --rounds 5 --trials 10 --warmup 3 --steps 12`:
  - 5 rounds, each with every library in a seeded shuffled order.
  - Per scenario: 3 untimed warm-up trials, then 10 timed trials.
  - In C, D and E each trial makes 12 updates. That gives 50 trials and 600 single updates per
    library per scenario.
  - The order of every round is in [`meta.json`](results/release-3.0.0/meta.json) and
    [`run.log`](results/release-3.0.0/run.log).
- **Statistics.**
  - Median, p95, and a 95% bootstrap confidence interval (2,000 seeded resamples) for both the
    median and the relative difference.
  - A result is called "faster" or "slower" only when the interval excludes zero and the change is
    at least 5%. Otherwise it is "within noise". These rules are in
    [`scripts/generate-report.js`](scripts/generate-report.js) and are the same for every library.

## Why the comparison is fair

These are the things that could have made Vajra look better than it is, and what rules each one out.

1. **Same output from every implementation.** The parity suite (`yarn benchmark:visual`) checks
   that every implementation renders the same host tree, with the same styles, copy and
   accessibility labels, for 3 variants × 2 themes, and that presses reach the right handler.
   - Result: 55 passed and 1 skipped (Unistyles). Both Tamagui builds pass.
   - A library that skipped work would fail it.
2. **Each library used the way its docs describe.**
   - **NativeWind** runs the same Tailwind → css-interop pipeline Metro runs at bundle time, once
     per process, outside the timed window
     ([`harness/prepare-implementation.ts`](harness/prepare-implementation.ts)). Classes are
     literal strings, the theme is `vars()`, and variants are a lookup table.
   - **twrnc** builds its class strings with `tw.style()` on every render, as documented.
   - **styled-components** uses `ThemeProvider` and transient `$variant` props.
   - **Tamagui** uses `styled()` with `variants` and theme tokens, and is measured twice: on its
     runtime path and compiled.
3. **Tamagui is measured with its compiler.** Tamagui's compiler is optional but recommended for
   production, so runtime-only numbers would understate it.
   - Tamagui 3 has no standalone Babel plugin. Its compiler runs inside `@tamagui/metro-plugin`.
     [`scripts/compile-tamagui.js`](scripts/compile-tamagui.js) drives the plugin's frontend and
     transformer with the options an app passes to `withTamagui()`, and writes the output that
     Metro would ship to `implementations/tamagui-compiled/`. The script refuses to write a build
     the compiler did not lower.
   - On this card the compiler flattens 2 of 5 candidates, the two button labels. It reports that
     `Card` stays on the runtime because its `variant` is dynamic, and `Title` and `Description`
     because native text metrics need the runtime. That is the compiler's own verdict, not a
     choice made here.
   - Compiling makes Tamagui 12% faster to mount, 18% on theme switches and 10% with theme and
     variant at once. Variant switches are not faster.
   - The plugin needs Metro 0.84 or newer and React Native 0.84.1 ships Metro 0.83.8, so the
     workspace adds `metro-resolver` 0.84.4 for the compile step. The app's Metro keeps its own copy.
   - The compiler evaluates the Tamagui config in Node, which cannot load the full
     `@88khp/vajra-ui` entry the shared spec imports. The config reads the same values from
     [`implementations/tamagui/theme-values.json`](implementations/tamagui/theme-values.json),
     a snapshot of Vajra's default theme written by
     [`scripts/snapshot-tamagui-theme.js`](scripts/snapshot-tamagui-theme.js). Parity confirms
     the styles are unchanged.
4. **Same run, not separate runs.** Every library ran in the same rounds, interleaved. Comparing
   separate runs would mix drift between runs into the result: in an earlier pair of runs on the
   same machine, StyleSheet's variant-switch total moved from 113 to 93 ms with no code change.
5. **The same rules for every library.** Every implementation is memoized at the card level and
   uses the same `Screen`, `Root` and `Profiler`. The harness garbage-collects around each mount
   and calls `jest.clearAllMocks()` after every trial, outside the timed window, the same way for
   all of them.
6. **Disclosed choices that favor someone.**
   - **StyleSheet:** precomputes all 6 theme × variant style sets at load. That's the fastest way
     to write it, which is the point of a baseline.
   - **Vajra:** its card computes its `createRecipe` variant output once at load, because the
     recipe is pure. Theme tokens are still resolved by `Box`, `Text` and `Pressable` at render
     time, which is Vajra's normal path.
   - **Every card was written by the Vajra team.** Parity proves each one renders the same thing.
     It doesn't prove each one is the fastest way to write it in that library. Improvements from
     each library's maintainers are welcome.

## Where the remaining time goes

A CPU profile of the theme-switch scenario from the 3.0 performance work (self time across the
whole test, in ms):

| | React and the test renderer | Library code | GC and native |
|---|---|---|---|
| twrnc | 1,093 | 75 | 739 |
| styled-components | 1,373 | 147 | 761 |
| Vajra UI, before the rest-destructuring change | 1,414 | 150 | 893 |

React's own work is what separates Vajra from twrnc. On a theme switch:

- **Vajra:** each card re-renders 11 components that read the theme (5 `Box`, 4 `Text`,
  2 `Pressable`).
- **twrnc:** the card reads the theme once and renders plain `View` and `Text`, so 1 component
  per card re-renders.
- **styled-components:** each styled element reads the theme too, and its React time is about
  the same as Vajra's.

This is the cost of `<Box bg="surface">` restyling itself on a theme change without the screen
passing the theme down. Avoiding it would mean components that don't follow the theme, or a build
step that compiles `Box` into a plain `View`. Neither is part of this release.

Per element, styling is already close to free: in a micro-benchmark, a component that only renders
`View` cost the same as `Box` with five tokens. More caching can't close the remaining gap.

## Limits of these numbers

- **Not a phone.** These are JavaScript-side timings in Jest with React's development build, on a
  desktop CPU. They include React render and commit. They don't include native view mounting,
  layout on the UI thread, or drawing. The development build exaggerates the cost per component.
- **Device runs not repeated.** An earlier Release build on the iOS simulator and Android emulator
  ranked the libraries the same way as Jest. That run was not repeated for 3.0.0.
- **Timer resolution.** Timings are whole milliseconds.
  - At 100 cards one update takes 7–12 ms, so per-update medians move in 1 ms steps, and their
    intervals can collapse to a single value.
  - The per-trial totals in the tables above are the reliable figures.
- **One size.** Only 100 cards. Larger lists (2,000 cards) and `FlatList` scrolling were not measured.
- **One machine, one run.** Interleaving spreads background load evenly across libraries, but it
  widens the intervals. Vajra's theme-switch interval (116.5–146 ms) is the widest of the top four.

## Check it yourself

1. **Confirm the packages match what was tested.**

   ```bash
   npm view @88khp/vajra-ui@3.0.0 dist.shasum     # expected: 7e5e46aa3e6672317a60d9ca35206296c490530d
   npm view @88khp/vajra-core@3.0.0 dist.shasum   # expected: 35a9ffa9c00be5c2f229e53895720846846a1cc2
   ```

2. **Reproduce the run** from `benchmarks/styling/`:

   ```bash
   yarn install
   node scripts/compile-tamagui.js                # rebuilds implementations/tamagui-compiled/
   yarn benchmark:visual                          # parity
   node scripts/run-benchmark.js --smoke --rounds 5 --trials 10 --warmup 3 --steps 12 \
     --impls stylesheet,vajra,twrnc,styled-components,nativewind,tamagui,tamagui-compiled
   yarn benchmark:report -- --smoke
   open results/smoke/dashboard.html
   ```

   Absolute times depend on the machine. The comparison between libraries in the same run is what
   should hold.

3. **Read the raw data.** Each `round-<n>-<impl>.json` in
   [`results/release-3.0.0/`](results/release-3.0.0/) holds every sample. `summary.json` holds
   every number on this page, and `REPORT.md` has the full tables.
