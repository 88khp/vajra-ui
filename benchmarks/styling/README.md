# Styling benchmark: Vajra UI vs StyleSheet, NativeWind, Unistyles, Tamagui, styled-components

An isolated workspace that renders one `BenchmarkCard` in six styling systems and measures
React render and commit cost under identical workloads.

It lives in `benchmarks/styling/` and has its own `package.json` and lockfile. The root
project's dependencies, config, and tests are not changed.

> **Status: preliminary.** Scenarios A–E run in two harnesses: under Jest with
> react-test-renderer on the host, and inside a Release build of a real app on the iOS
> simulator and the Android emulator (see [Simulator and emulator runs](#simulator-and-emulator-runs)).
> Routine checks use the Jest smoke run only; earlier smoke runs ranked the libraries the
> same way under Jest, iOS and Android. Native display timing, scenario F (FlatList
> scrolling), Unistyles, bundle size, and physical-device runs are **not** measured yet.
> See [What is not measured](#what-is-not-measured).
>
> The results for Vajra UI 3.0.0, and exactly how they were produced, are in
> [RESULTS.md](RESULTS.md).

## Status by implementation

| Implementation | Compiles (tsc) | Visual and behavioral parity (Jest) | JS-side scenarios A–E | Notes |
|---|---|---|---|---|
| StyleSheet (baseline) | yes | reference; matches spec | yes | Theme × variant styles precomputed with `StyleSheet.create` at load |
| VajraUI | yes | passes (6 of 6 combinations) | yes | Public API only: `VajraProvider`, `Box`, `Text`, `Pressable`, `createRecipe` |
| VajraUI, previous version (`vajra-prev`) | yes | passes (6 of 6), with `BENCH_IMPL=vajra-prev` | yes | The same card file, run against an earlier Vajra version. See [Comparing two Vajra versions](#comparing-two-vajra-versions) |
| NativeWind 4.2.7 | yes | passes (6 of 6) | yes | Tailwind compiled once per process and registered (see [Methodology](#methodology)) |
| Tamagui 3.1.2 | yes | passes (6 of 6) | yes | Runtime only. Requires `react-dom` as a peer, even on native |
| Tamagui 3.1.2, compiled (`tamagui-compiled`) | yes | passes (6 of 6) | yes | The same card, compiled by Tamagui's compiler. See [Tamagui's compiler](#tamaguis-compiler) |
| styled-components 6.6.0 | yes | passes (6 of 6) | yes | `styled.View` / `$variant` transient props |
| Unistyles 3.5.3 | yes | **skipped** | **not run** | Needs its Nitro and Reanimated native runtime. Requires a simulator or device build |

Parity result at the time of writing: `55 passed, 1 skipped` (the skip is Unistyles), both
with and without `BENCH_IMPL=vajra-prev`.

## Setup

Prerequisites: Node 20 or newer (tested on Node 24.22.0), Yarn 1.22, macOS.

```bash
cd /path/to/vajra-ui/benchmarks/styling
yarn install
```

Vajra is installed as `@88khp/vajra-ui` and `@88khp/vajra-ui-core`, pinned to exact sources in
`package.json`:

- A **published** version is pinned to its npm version, with its integrity hash in `yarn.lock`.
- A version that is **not published yet** is installed from a tarball made with `npm pack` in
  each repository and copied to `vendor/`. The file name carries the first 8 characters of the
  tarball's SHA-1 (for example `88khp-vajra-ui-3.0.0-alpha.1-7b3a116e.tgz`), and `yarn.lock`
  records the full SHA-1, so the tested build is identifiable. Yarn caches `file:` tarballs by
  path, so a rebuilt tarball must get a new file name, or Yarn installs the old one.

Both runners record each package's version, resolved source and integrity in `meta.json`, and
the report and dashboard print them. To benchmark another Vajra version, change the pins and
run `yarn install`. Check `node_modules/@88khp/*/package.json` afterwards: when a `file:` pin
changes, Yarn can keep the old entry in `yarn.lock` and install it. Delete the stale
`yarn.lock` entry if that happens.

For the simulator and emulator runs you also need Xcode with an iOS simulator, CocoaPods,
and the Android SDK with an emulator image and JDK 17 (tested with Xcode 26.4.1, CocoaPods
1.16.2, Zulu JDK 17.0.16, and a Pixel 6 API 34 arm64 image). The runner runs `pod install`
the first time.

## Commands

All commands run from `benchmarks/styling/`.

| Command | What it does |
|---|---|
| `yarn benchmark:visual` | Parity suite: each implementation's host tree must match the spec-derived expectations (StyleSheet) and the baseline (every other implementation), for 3 variants × 2 themes. Also checks that presses reach the right handler, once. |
| `yarn benchmark:run -- --rounds 3 --trials 30 --warmup 5 --steps 12` | Runs scenarios A–E. One Jest process per implementation per round. The implementation order is shuffled per round with a recorded seed. Writes `results/raw/round-<r>-<impl>.json` and `results/meta.json`. |
| `yarn benchmark:report` | Reads `results/raw/`. Writes `results/summary.json`, `results/summary.csv`, `results/dashboard.html`, and `REPORT.md`. |
| `yarn device:ios -- --smoke` | Builds the Release app, installs it on the booted iOS simulator, and runs the smoke scenarios once per implementation. Writes `results/smoke/ios/`. Without `--smoke` it takes the same options as `benchmark:run` and writes `results/ios/raw/`. |
| `yarn device:android -- --smoke` | The same on the running Android emulator. Writes `results/smoke/android/` (or `results/android/raw/`). |
| `yarn benchmark:report -- --smoke --platform ios` | Builds the report for a simulator or emulator run. `--platform` is `ios` or `android`. Drop `--smoke` for a full run. |
| `yarn benchmark:report-card` | Builds the report-card dashboard, `results/report-card.html`, from the Jest, iOS, and Android full-run summaries, with a platform switch and each library's multiple of StyleSheet per platform. Run `benchmark:report` for each platform first. |
| `yarn benchmark:smoke-card` | The same card for the smoke runs: `results/smoke/smoke-test.html`. |
| `node scripts/run-benchmark.js --smoke --rounds 5 --trials 10 --warmup 3 --steps 12 --impls stylesheet,vajra,vajra-prev,twrnc,styled-components,nativewind,tamagui,tamagui-compiled` | The release comparison: two Vajra versions and every other library in the same run. Writes `results/smoke/`. Then run `yarn benchmark:report -- --smoke`. |
| `node scripts/compile-tamagui.js` | Rebuilds `implementations/tamagui-compiled/` with Tamagui's compiler. Run it after changing the Tamagui card or config. |
| `node scripts/snapshot-tamagui-theme.js` | Rewrites `implementations/tamagui/theme-values.json` from Vajra's default theme. Run it after changing the Vajra version. |
| `yarn tsc --noEmit -p tsconfig.json` | Type-checks all six implementations, the shared spec, and both harnesses. |

A full run (3 rounds × 5 implementations × 30 trials) takes on the order of an hour or two on
a laptop. Close other applications first. Thermal throttling and background load add noise.
Use `--impls stylesheet,vajra` to run a subset.

## Layout

```
benchmarks/styling/
  shared/spec.ts              The one shared definition: hierarchy, copy, a11y labels,
                              variant → accent mapping, deterministic data, render counter.
                              Colors and typography come from Vajra's default theme.
  implementations/
    index.ts                  Registry. Loads each implementation lazily.
    stylesheet/               Baseline
    vajra/                    VajraUI
    nativewind/               NativeWind (+ tailwind.config.js, global.css)
    unistyles/                Unistyles (+ config.ts). Not run in Jest.
    tamagui/                  Tamagui (+ config.ts, theme-values.json)
    tamagui-compiled/         Generated: the Tamagui card after Tamagui's compiler
    styled-components/        styled-components/native
  parity/                     Visual and behavioral parity tests and the normalizer
  harness/                    Per-implementation runtime setup (NativeWind CSS registration)
  scenarios/bench.scenario.tsx  Scenarios A–E for one implementation (Jest)
  device/                     The same scenarios inside the real app (simulator/emulator)
    App.tsx                   Fetches the run config, runs one implementation, posts results
    run-scenarios.ts          Scenarios A–E on the Fabric renderer
    commit-hook.ts            Commit timing and the committed tree, in release builds too
  index.js, app.json, metro.config.js, ios/, android/
                              The React Native 0.84.1 app (from the community CLI template)
  scripts/
    run-benchmark.js          Runner: rounds, seeded order, one process per implementation
    run-device-benchmark.js   Runner for the simulator/emulator: build, install, relaunch per implementation
    bench-common.js           Options, seeded order, and meta.json shared by both runners
    generate-report.js        Statistics and report generation
    compile-tamagui.js        Compiles the Tamagui card with @tamagui/metro-plugin
    snapshot-tamagui-theme.js Writes the Tamagui config's theme values from Vajra's theme
    dashboard-template.html   Dashboard. Every number is embedded from summary.json
    dashboard.tailwind.config.js  Tailwind config for the dashboard. The CSS is compiled at
                              report time and inlined, so a dashboard is one file that opens offline
  vendor/                     Vajra tarballs from `npm pack`, only while benchmarking a version not on npm yet
  results/                    Raw and generated output: results/smoke/ for smoke runs,
                              each with REPORT.md, summary.json/csv and dashboard.html.
                              Only results/release-<version>/ snapshots are committed
  RESULTS.md                  The published results and how they were produced
```

## The shared component

Every implementation renders the same host tree, with the same copy, accessibility labels,
and layout:

```
Card (View: padding 16, gap 12, radius 12, 1px border in the variant accent, surface background)
├── HeaderRow (View: row, space-between, centered)
│   ├── Title (Text: 20/24, weight 600)
│   └── Status (View, 8×8 full radius, accent color, a11y: image "Status: active")
├── Description (Text: 16/20, weight 400, textSubtle)
└── ActionRow (View: row, gap 8)
    ├── Primary (Pressable, a11y: button "<title> primary action", accent background, Text "Deploy")
    └── Secondary (Pressable, a11y: button "<title> secondary action", surfaceRaised, Text "Details")
```

Variants (`primary`, `secondary`, `danger`) set the accent: `primary`, `secondary`, or `error`.
Themes are `light` and `dark`, from Vajra's default theme tokens.

Theme is set by a provider in each library, using that library's documented mechanism:
`VajraProvider colorScheme`, `ThemeProvider`, `TamaguiProvider defaultTheme`, a context
for StyleSheet, and `vars()` for NativeWind. Unistyles uses `UnistylesRuntime.setTheme`.
This is a deliberate difference, covered under [Deviations](#deviations-from-the-brief).

## Scenarios

| ID | Scenario | Counts | Measured |
|---|---|---|---|
| A | Initial mount | 200, 500, 2,000 | React commit time (`act` around `create`), JS heap delta after GC, host re-renders |
| B | Re-render, unrelated parent state | 1,000 | Re-render time, host re-renders (expected: only the footer), commits |
| C | Variant switching (theme fixed) | 1,000 | Per-update latency, host re-renders, commits, per-trial total |
| D | Theme switching (variant fixed) | 1,000 | Per-update latency, host re-renders, commits, per-trial total |
| E | Combined theme + variant | 1,000 | Per-update latency, host re-renders, commits, per-trial total |
| F | List and scrolling | — | **Not implemented.** Needs a native `FlatList` on a device |

Every update in C, D, and E is checked outside the timed window. The first card's accent
must match the requested theme and variant, or the run fails.

"Host re-renders" counts host `View`/`Text` nodes whose props object is new after a commit.
All implementations render the same host tree, so this count is comparable across them.
The `BenchmarkCard` function-invocation count is recorded too, but it is **not** comparable
for context-driven updates. Vajra and Tamagui read the theme inside child components, so
their card function does not re-run.

## Methodology

- **Isolation.** One Jest process per implementation per round, run in band. Tamagui's global
  config and NativeWind's registered CSS therefore cannot leak into other measurements.
- **Order.** Each round shuffles the implementation order with a seeded PRNG. The seed and
  the order are written to `results/meta.json`.
- **Warm-up.** 5 untimed trials per scenario by default, then 30 measured trials. Trials
  are run for every (scenario, count) pair in the same process.
- **Statistics.** Median, p95 (nearest rank), mean, sample stdev, and a 95% percentile
  bootstrap CI (2,000 seeded resamples) for the median and for the relative improvement vs
  StyleSheet. Improvement = `((baseline − candidate) / baseline) × 100`.
- **Verdict.** "faster" or "slower" only when the 95% CI excludes zero **and** |improvement| ≥ 5%.
  Otherwise "within noise".
- **Garbage collection.** `node --expose-gc`. The heap is collected before and after each
  mount. The heap delta is JS heap only. It is not native memory.
- **Shared code.** Every implementation uses the same `Screen`, `Root`, `Profiler`, and
  `React.memo` boundary. The benchmark components are memoized in all six implementations.
- **Visual parity.** The normalizer reads style values from the rendered host tree. It
  expands padding shorthands, collapses equal per-corner radii, per-side borders, and equal
  row/column gaps into their shorthand, drops React Native's default `flexDirection: column`,
  and compares `fontWeight` as a string. These are equivalent CSS transforms. Any other
  difference fails. The StyleSheet baseline must also match the spec-derived expected tree
  independently.

### Comparing two Vajra versions

To measure a Vajra change, both versions run in the **same run**, so they share the machine
state, the shuffled order and the warm-up. Comparing two separate runs mixes run-to-run drift
into the result: between two runs on the same day, StyleSheet's variant-switch total moved from
113 ms to 93 ms with no code change.

- The earlier version is installed under aliases, for example
  `yarn add "@88khp/vajra-ui-prev@npm:@88khp/vajra-ui@3.0.0-alpha.0" "@88khp/vajra-ui-core-prev@npm:@88khp/vajra-ui-core@3.0.0-alpha.0"`.
- The `vajra-prev` implementation renders the **same card file** as `vajra`
  (`implementations/vajra/benchmark-card.tsx`). Only the package it imports differs.
- Each implementation runs in its own Jest process. When `BENCH_IMPL=vajra-prev`,
  `jest.config.js` maps `@88khp/vajra-ui` and `@88khp/vajra-ui-core` to the aliases, so the
  earlier vajra-ui loads its own core and not the hoisted current one. Mixing the two would
  measure neither version.
- The report adds `vsPrevious` to the `vajra` rows: the same bootstrap CI and verdict rule as
  `vsBaseline`, with the earlier version as the baseline. `REPORT.md` gets a "vs (same run)"
  table and the dashboard a per-scenario chart.
- `meta.json` records both versions and both sources. Rows are labelled with the version that ran.

### Tamagui's compiler

Tamagui's compiler is optional but recommended for production, so Tamagui is measured twice:
`tamagui` on its runtime path, and `tamagui-compiled` with the compiler.

- Tamagui 3 has no standalone Babel plugin. The compiler runs inside `@tamagui/metro-plugin`.
  `scripts/compile-tamagui.js` drives the plugin's frontend and transformer with the options an
  app passes to `withTamagui()`, and writes what Metro would ship to
  `implementations/tamagui-compiled/benchmark-card.js`. It prints the compiler's report and
  refuses to write a build the compiler did not lower.
- The plugin requires Metro 0.84 or newer. React Native 0.84.1 ships Metro 0.83.8, so the
  workspace adds `metro-resolver` 0.84.4 for the compile step. The app's Metro keeps its own copy.
- The compiler evaluates `implementations/tamagui/config.ts` in Node. It cannot import the shared
  spec, which loads the full `@88khp/vajra-ui` entry, so it reads `theme-values.json`, a snapshot
  of Vajra's default theme. The parity suite checks the rendered styles against the spec.

### NativeWind under Jest

NativeWind compiles `className` against CSS produced by Tailwind. In a Metro build that happens
at bundle time. Under Jest, `harness/prepare-implementation.ts` runs the same Tailwind
pipeline once per process on the card source, then registers the CSS with css-interop
and calls `setupAllComponents()`. That is one-time setup and is never inside a measured
render. Without it, NativeWind renders with empty styles. The parity suite catches that.

## Deviations from the brief

These are deliberate, or they are constraints of the libraries. Each one is listed so
the results can be read correctly.

1. **"Precomputed styles" is not Vajra's runtime model.** `Box` resolves tokens during
   render, with `colors[bg]` and `resolveSpacing`, inside `React.memo`. The variant recipe
   (`createRecipe`) is pure, so this benchmark computes its output once at module load.
   Token resolution against the theme still happens at render time. The StyleSheet baseline
   precomputes all six theme × variant style sets. Both are "precomputed" in different ways.
2. **Theme as a prop.** The brief's example API includes a `theme` prop on each card. All six
   libraries take the theme from a provider, because that is their documented model. The
   Card's own props are identical across implementations.
3. **Unistyles is not measured here.** `react-native-unistyles` 3.x needs its Nitro and
   Reanimated native modules. The `react-native-unistyles/mocks` entry replaces the native
   runtime, which is the part we want to measure, so using it would produce misleading
   numbers. Its implementation type-checks; its numbers must come from a simulator or device.
4. **Unistyles theme switching is native.** `UnistylesRuntime.setTheme` updates the native
   layer without a React re-render. Scenario D therefore measures a different mechanism for
   Unistyles than for the others. That is expected. It is one of the library's main claims.
5. **NativeWind's rem is 14 px** (its default). The Tailwind config pins the spacing and radius
   scale to the spec's pixel values, so `p-4` and `rounded-xl` produce 16 and 12. The parity
   suite verifies this.
6. **NativeWind theme variables sit on the card root.** Its `vars()` is applied on the
   card's root `View`, not on a wrapper, so the host tree has the same shape as every other
   implementation.
7. **Tamagui needs `react-dom` installed on native.** `@tamagui/floating` and
   `@tamagui/popper` import it in their native builds. This is a peer requirement, not an
   optional web dependency. The workspace pins `react-dom` 19.2.4.
8. **Tamagui's `lineHeight` must use font tokens.** A numeric `lineHeight` in `styled()` is
   scaled by Tamagui (24 became 480 in an early run). The parity suite caught this. The
   implementation now uses `createFont` tokens for size, line height, and weight.
9. **StyleSheet status color.** The baseline first used the theme's `success` green for the
   status dot. The spec and the other five implementations use the variant accent. The parity
   suite caught the mismatch, and the baseline now matches the other five.

## Vajra UI findings

These were found while building the benchmark.

- **Import-time React warning (fixed in 3.0.0-alpha.1).** `input-root.tsx` called
  `forwardRef` with a render function that takes one argument, so React logged "forwardRef
  render functions accept exactly two parameters" whenever `vajra-ui` was imported in development.
- **`Box` props use `w`/`h`, `direction`, `justify`, `align`.** They are not `width`,
  `height`, `flexDirection`, `justifyContent`, or `alignItems`. Writing the React Native names
  fails type-checking. The public API is the one to follow.

## Limitations

- **Jest mock records.** React Native's Jest mocks record every call with its arguments. That
  grows the heap about 45 MB per 2,000-card mount, without bound, and it was the cause of an
  out-of-memory crash in the first attempts. The scenario calls `jest.clearAllMocks()` after every
  trial, for every implementation alike, which keeps the heap flat (verified: 745 MB and rising without
  it, 95 MB flat with it). The clear happens outside the timed window.
- **Host-tree metric.** "Host re-renders" counts changed props objects on host nodes. It is
  not a count of style allocations.
- **Same process, same renderer.** Every implementation renders with `react-test-renderer` and
  `act`. Native rendering, the Fabric/Paper bridge, and display timing are outside this harness.
- **Machine noise.** The runner shuffles order, but it cannot control background load,
  thermal state, or power source. Record those when you publish numbers
  (`results/machine-state.txt` holds them for the published run).
- **Timer resolution.** Jest timings are whole milliseconds. At 100 cards a single update takes
  7–12 ms, so per-update medians move in 1 ms steps and their CIs can collapse to one value.
  Compare per-trial totals (12 updates) instead. Scenario B is below the resolution entirely.

## What is not measured

Each item below needs a simulator or device build. None of it is in the current results.

- **Native display timing.** The time from commit until pixels are drawn. Needs a native
  profiler (Instruments on iOS, Perfetto or `systrace` on Android).
- **Scenario F.** `FlatList` scrolling, frame time, and dropped frames.
- **Unistyles, all scenarios.**
- **Screenshot parity.** The parity suite compares host-tree style values, not pixels. Pixel
  comparison needs the same app running in the simulator for every implementation.
- **Bundle size, binary size, build time, and Babel/compiler config cost.** Measure with
  release builds of the same app, one per implementation, and compare uncompressed
  artifacts with uncompressed artifacts.
- **Native memory.** The JS heap delta is reported. Platform memory needs Instruments or
  Android Studio profiling.
- **Thermal state, allocations, and style-resolution time.** Not instrumented.

## Simulator and emulator runs

The workspace is also a React Native 0.84.1 app. `ios/`, `android/`, `app.json`, and
`metro.config.js` come from the community CLI template
(`npx @react-native-community/cli@20 init StylingBench --version 0.84.1 --package-name com.vajra.stylingbench`).
The only changes to the template are the bundle id and, on Android, a network security
config that allows plain HTTP to localhost, so the release build can report to the runner. `react`, `react-dom`, and
`react-test-renderer` are pinned to 19.2.3, the version React Native 0.84.1's renderer
is built against.

How a run works:

1. `scripts/run-device-benchmark.js` builds the **Release** configuration: Hermes,
   production React, the New Architecture (Fabric), and the JS bundle embedded in the app.
   Metro is not running.
2. It serves the run config on `http://localhost:8099`. The iOS simulator reaches the host
   directly. The Android emulator reaches it through `adb reverse`.
3. For each implementation, in the same seeded per-round order as the Jest runner, it
   terminates the app, relaunches it, and waits for the samples. One launch runs one
   implementation, so no library's global state can leak into another's numbers.
4. The app (`device/`) runs scenarios A–E with the same card counts, warm-up and trial loops,
   correctness check, and sample shape as `scenarios/bench.scenario.tsx`.

What the device numbers measure, and how they differ from Jest:

- **Timed window.** From `setState` until the last React commit of that update has
  finished. That covers React render and commit, creating and cloning Fabric shadow nodes,
  and Yoga layout, all on the JS thread. It does **not** cover the UI thread mounting native
  views or drawing pixels.
- **Commits.** `Profiler.onRender` does not fire in production builds, so
  `device/commit-hook.ts` installs the React DevTools global hook before the renderer
  loads. React calls its `onCommitFiberRoot` at the end of every commit, in release builds
  too. An update counts as settled once a whole frame passes with no further commit, so
  follow-up commits a library schedules from an effect are included, as `act` includes them
  in Jest.
- **Host re-renders and the accent check** read the committed fiber tree instead of the test
  renderer, with the same definitions. The real host tree has a few more host nodes than the
  Jest mocks (scenario B reports 3 where Jest reports 1). The count is still the same for
  every library.
- **Heap.** Not recorded. Hermes in a release build exposes no `gc()`.
- **Simulator, not device.** The iOS simulator and the Android emulator run on the host
  Mac's CPU. They show how the libraries compare on the real renderer and engine, not how
  fast a phone is.

## Physical device guide (not yet run)

This guide is written from the setup above and has not been run against a physical device.
The simulator/emulator app above is the starting point: the same app, built in Release,
installed on a device instead.

1. Create one release app per implementation that mounts the same `BenchmarkCard` tree from
   `shared/spec.ts`. Use the same React Native version, Hermes build, and architecture.
   Keep the app-level code identical. Only the implementation import changes.
2. iOS: `cd ios && pod install`, then build the Release configuration for a physical
   iPhone. The simulator on this machine (iPhone 16, iOS 18.6) is not a substitute for
   performance numbers.
3. Connect the device. Check `xcrun xctrace list devices`. At the time of writing, the iPhone
   listed there was offline.
4. Record the device model, OS version, battery level, and temperature, and let the device
   settle for a few minutes between runs.
5. Run the scenarios in release mode and collect Instruments traces (Time Profiler,
   Core Animation, Allocations) for the native measurements.
6. Repeat the rounds with a rotated implementation order, as the runner does.
7. Label the results separately from the JS-side results. Do not mix them.
