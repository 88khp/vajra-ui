# Vajra UI 3.0.0-alpha.1: styling benchmark results

This page reports how fast Vajra UI 3.0.0-alpha.1 renders compared with the published
3.0.0-alpha.0 and with five other React Native styling libraries. It also explains exactly how the
numbers were produced, what could have biased them, and how to check or reproduce them.

The raw samples, the generated report and the dashboard for this run are in
[`results/release-3.0.0-alpha.1/`](results/release-3.0.0-alpha.1/).

## Summary

**3.0.0-alpha.1 is 9–12% faster than 3.0.0-alpha.0 on every update scenario.** Both versions ran
in the same run, and for each scenario the 95% confidence interval of the improvement excludes zero.

| Scenario (100 cards, total of 12 updates) | 3.0.0-alpha.0 | 3.0.0-alpha.1 | Improvement (95% CI) | Verdict |
|---|---|---|---|---|
| Variant switch | 112.5 ms | 102.0 ms | +9.3% [6.7, 11.7] | faster |
| Theme switch | 132.0 ms | 116.0 ms | +12.1% [9.9, 14.5] | faster |
| Theme + variant | 154.5 ms | 138.5 ms | +10.4% [6.3, 14.9] | faster |
| Mount (one render of 100 cards) | 18 ms | 17 ms | +5.6% | faster, by 1 ms, which is the timer's resolution |

Against the other libraries, in the same run (median ms, 100 cards; lower is faster):

| Library | Mount | Variant switch | Theme switch | Theme + variant |
|---|---|---|---|---|
| StyleSheet (hand-written baseline) | 12 | 95 | 91 | 93 |
| twrnc 4.16.0 | 13 | 103 | 97.5 | 100 |
| styled-components 6.6.0 | 15 | 126.5 | 107 | 123 |
| **Vajra UI 3.0.0-alpha.1** | **17** | **102** | **116** | **138.5** |
| Vajra UI 3.0.0-alpha.0 | 18 | 112.5 | 132 | 154.5 |
| NativeWind 4.2.7 | 30 | 262 | 288.5 | 284 |
| Tamagui 3.1.2 (runtime only, no compiler) | 68 | 430 | 762.5 | 1,210.5 |

Switch columns are the total of 12 updates in one trial. In plain terms:

- **Variant switching** (the common interaction) is now level with twrnc and ahead of styled-components.
- **Theme switching and mount** are still behind StyleSheet, twrnc and styled-components.
  [Where the remaining time goes](#where-the-remaining-time-goes) explains why.
- **Compared with NativeWind and Tamagui**, Vajra is about 2–2.6× faster than NativeWind on
  updates and about 4–9× faster than Tamagui.

These are JavaScript-side timings under Jest on a desktop machine, not frame times on a phone.
See [Limits of these numbers](#limits-of-these-numbers).

## What was compared

| Package | Version | Source | Hash |
|---|---|---|---|
| `@88khp/vajra-ui` (previous) | 3.0.0-alpha.0 | npm registry | `sha512-SemEQI66QVWrszCyBlLrHf1zv0dBHxwH8UX4GcojA3YHYjmmsE587F771KruO6nRWp8NeuAoTW1UNQuakr7L4w==` |
| `@88khp/vajra-ui-core` (previous) | 3.0.0-alpha.0 | npm registry | `sha512-AZ+AqVhAFqK3Yl/KmzDHbECP/MnivUlEKfdF52yPudQX9VE3wVRpk+C11YDTPDZ+8EBNT/L9XVa+nxNc1RTRiQ==` |
| `@88khp/vajra-ui` (new) | 3.0.0-alpha.1 | `npm pack` of the release build, `vendor/88khp-vajra-ui-3.0.0-alpha.1-7b3a116e.tgz` | SHA-1 `7b3a116e45d1ac8c39d389250852c27a22bf1890`, SHA-256 `fdbfb531b9ac7fbad5f8be7671a64ebf336893457e38daef8a65473b36ae0a01` |
| `@88khp/vajra-ui-core` (new) | 3.0.0-alpha.1 | `npm pack` of the release build, `vendor/88khp-vajra-ui-core-3.0.0-alpha.1-53bf2d2c.tgz` | SHA-1 `53bf2d2c639ee85a97196924eaa633627d3fedae`, SHA-256 `e7b96b17958dc7f1da4635566efc3ba6f1669ab9e7386898d353a0563e11efbf` |

The 3.0.0-alpha.1 tarballs were built from these commits. Running `yarn build && npm pack` on each
commit reproduces the same SHA-1 as above. This was checked after committing.

| Repository | Branch | Commit |
|---|---|---|
| [88khp/vajra-ui](https://github.com/88khp/vajra-ui) | `feat/api-fixes-2.0` | `e70b6e2` |
| [88khp/vajra-ui-core](https://github.com/88khp/vajra-ui-core) | `perf/core-style-builder` | `d863332` |

The run's `meta.json` records `38bfa65` with uncommitted paths, because the benchmark ran before
these commits were made. The changes in between are the ones the reproduced hashes cover.

The previous version is the package anyone can install from npm. It was not rebuilt from source,
so it cannot have been built in a slower configuration. The new version was benchmarked before it
was published, from tarballs made with `npm pack`, the same command `npm publish` uses. Both runs
record these sources and hashes in `meta.json`, and the dashboard prints them under "Environment".

Other libraries: StyleSheet from React Native 0.84.1, twrnc 4.16.0, styled-components 6.6.0,
NativeWind 4.2.7 (Tailwind 3.4.19, css-interop 0.2.7) and Tamagui 3.1.2. All are pinned in
`package.json` and `yarn.lock`. Unistyles is not measured because it needs its native runtime.

## How it was measured

- **Machine.** Apple M4, 10 CPUs, 16 GB, macOS 26.5.2, Node 24.22.0, on mains power. The load
  average before the run was 5.5, so other work was running. Every library ran under the same
  load, in shuffled order, so the load adds noise but no bias toward any library. See
  [`machine-state.txt`](results/release-3.0.0-alpha.1/machine-state.txt).
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
  - The order of every round is in [`meta.json`](results/release-3.0.0-alpha.1/meta.json) and
    [`run.log`](results/release-3.0.0-alpha.1/run.log).
- **Statistics.**
  - Median, p95, and a 95% bootstrap confidence interval (2,000 seeded resamples) for both the
    median and the relative improvement.
  - A result is called "faster" or "slower" only when the interval excludes zero and the change is
    at least 5%. Otherwise it is "within noise". These rules are in
    [`scripts/generate-report.js`](scripts/generate-report.js) and were the same for every library
    and both Vajra versions.

## Why the comparison is fair

These are the things that could have made Vajra look better than it is, and what rules each one out.

1. **Same output from every implementation.** The parity suite (`yarn benchmark:visual`) checks
   that every implementation renders the same host tree, with the same styles, copy and
   accessibility labels, for 3 variants × 2 themes, and that presses reach the right handler.
   - Result: 48 passed and 1 skipped (Unistyles), run once normally and once with
     `BENCH_IMPL=vajra-prev`.
   - So 3.0.0-alpha.0 and 3.0.0-alpha.1 render the same thing. A version that skipped work would fail it.
2. **The same card code for both Vajra versions.** `vajra` and `vajra-prev` load the same file,
   [`implementations/vajra/benchmark-card.tsx`](implementations/vajra/benchmark-card.tsx). Only the
   package it imports changes, so the gain comes from the library, not the benchmark code.
3. **Each version runs with its own core.** Each library runs in its own Jest process.
   - In the `vajra-prev` process, [`jest.config.js`](jest.config.js) points both `@88khp/vajra-ui`
     and `@88khp/vajra-ui-core` at the 3.0.0-alpha.0 copies. Without that, the old vajra-ui would
     have loaded the new, faster core.
   - Before the run, a check in each process confirmed which files loaded:
     - **`vajra-prev`:** `vajra-ui-prev/dist`, with no `omit` in core's specs, which means the alpha.0 core.
     - **`vajra`:** `vajra-ui/dist` with the alpha.1 core.
4. **Same run, not two runs.** Both versions ran in the same rounds, interleaved with the other
   libraries. Comparing separate runs would have mixed drift between runs into the result: in an
   earlier pair of runs on the same machine, StyleSheet's variant-switch total moved from 113 to
   93 ms with no code change.
5. **The timed code didn't change.** The scenario runner
   ([`scenarios/bench.scenario.tsx`](scenarios/bench.scenario.tsx)), the shared spec and every
   card implementation were not edited during this work. The implementation registry,
   `implementations/index.ts`, only gained the `vajra-prev` entry. The harness changes listed
   below all affect setup or reporting, never what is timed.
6. **The same rules for every library.** Every implementation is memoized at the card level and
   uses the same `Screen`, `Root` and `Profiler`. The harness garbage-collects around each mount
   and calls `jest.clearAllMocks()` after every trial, outside the timed window, the same way for
   all of them.
7. **Disclosed choices that favor someone.**
   - **StyleSheet:** precomputes all 6 theme × variant style sets at load. That's the fastest way
     to write it, which is the point of a baseline.
   - **Vajra:** its card computes its `createRecipe` variant output once at load, because the
     recipe is pure. Theme tokens are still resolved by `Box`, `Text` and `Pressable` at render
     time, which is Vajra's normal path.
   - **twrnc:** builds its class strings on every render, as documented.
   - **Tamagui:** runs without its optional compiler, which would make it faster.

## What changed in the harness during this work

All of these affect setup or reporting. None changes what is timed.

- **Comparing two versions in one run.** Added the `vajra-prev` implementation, the alias mapping in
  `jest.config.js`, and `vsPrevious` in the report.
- **Recording the previous version.** `meta.json` records the previous version's version, source and hash.
- **Report fix.** `@88khp/vajra-ui-core`'s source had always been reported as `undefined`. The
  lockfile reader missed the first entry in `yarn.lock`, and now trims each entry before matching.
- **Dashboard.** Rewritten with charts. It is still built only from `summary.json`.
- **Versioned labels.** Rows are labelled with the version that ran, for example
  "VajraUI 3.0.0-alpha.1".

## What changed in Vajra UI

Everything in 3.0.0-alpha.1 is in the
[vajra-ui](../../CHANGELOG.md) and vajra-ui-core changelogs. In short:

- **Resolve and build only on a cache miss.** Theme tokens are resolved, and style objects built,
  only when a style isn't cached yet.
  - Styles are cached per theme by the token names as written, so a repeated `bg="primary" p="s-4"`
    skips both steps.
  - Before, every render of every `Box`, `Text`, `Pressable` and `TextInput` copied all its props
    to resolve tokens, then built a new style object, even when an identical one was already cached.
- **No more key strings.** The style cache is a tree keyed by style key and value, so a lookup no
  longer builds a string key.
- **One layer less.** `Pressable` and `TextInput` render the React Native component directly
  instead of through core's wrappers.
- **Stable `Pressable` style prop.** The `style` callback is reused while its style is unchanged,
  so React Native can skip the update.
- **No rest destructuring.** `Text`, `Pressable` and `TextInput` read their own props directly.
  - React Native's Babel preset compiles `const { a, ...rest } = props` into a helper that
    searches the excluded keys for every prop on every render.
  - Moving the build target from ES2017 to ES2018 doesn't avoid that, because Metro's Babel
    preset rewrites rest destructuring either way.
- **Input re-renders.** `Input` fields pass `TextInput` stable styles and handlers, so typing in
  one input doesn't re-render the others.

Not every change paid off.

- **Removing rest destructuring and moving to ES2018** was measured on its own, in the same kind of
  same-run A/B. It gave about 5% on theme switching and 2% on theme + variant, and neither reached
  the 5%-with-CI rule.
- **Per element, styling is now close to free.** In a micro-benchmark, a component that only
  renders `View` cost the same as `Box` with five tokens. More caching therefore can't close the
  remaining gap.

## Where the remaining time goes

A CPU profile of the theme-switch scenario (self time across the whole test, in ms):

| | React and the test renderer | Library code | GC and native |
|---|---|---|---|
| twrnc | 1,093 | 75 | 739 |
| styled-components | 1,373 | 147 | 761 |
| Vajra UI (before removing rest destructuring) | 1,414 | 150 | 893 |

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

## Limits of these numbers

- **Not a phone.** These are JavaScript-side timings in Jest with React's development build, on a
  desktop CPU. They include React render and commit. They don't include native view mounting,
  layout on the UI thread, or drawing. The development build exaggerates the cost per component.
- **Device runs not repeated.** An earlier Release build on the iOS simulator and Android emulator
  (3.0.0-alpha.0) ranked the libraries the same way as Jest. That run was not repeated for 3.0.0-alpha.1.
- **Timer resolution.** Timings are whole milliseconds.
  - At 100 cards one update takes 7–12 ms, so per-update medians move in 1 ms steps, and their
    intervals can collapse to a single value.
  - The per-trial totals in the tables above are the reliable figures.
- **One size.** Only 100 cards. Larger lists (2,000 cards) and `FlatList` scrolling were not measured.
- **One machine, one run.** Background load was present. Interleaving spreads it evenly across
  libraries, but it widens the intervals.

## Check it yourself

1. **Confirm the published packages match what was tested.** After 3.0.0-alpha.1 is on npm,
   compare its tarballs with the ones in `vendor/`:

   ```bash
   npm pack @88khp/vajra-ui@3.0.0-alpha.1 @88khp/vajra-ui-core@3.0.0-alpha.1
   shasum 88khp-vajra-ui-3.0.0-alpha.1.tgz 88khp-vajra-ui-core-3.0.0-alpha.1.tgz
   # expected: 7b3a116e45d1ac8c39d389250852c27a22bf1890 and 53bf2d2c639ee85a97196924eaa633627d3fedae
   ```

   If they differ, rerun the benchmark against the published packages. Don't rely on these numbers.

2. **Reproduce the run** from `benchmarks/styling/`:

   ```bash
   yarn install
   yarn benchmark:visual                          # parity, current version
   BENCH_IMPL=vajra-prev yarn benchmark:visual    # parity, previous version
   node scripts/run-benchmark.js --smoke --rounds 5 --trials 10 --warmup 3 --steps 12 \
     --impls stylesheet,vajra,vajra-prev,twrnc,styled-components,nativewind,tamagui
   yarn benchmark:report -- --smoke
   open results/smoke/dashboard.html
   ```

   After publishing, pin `@88khp/vajra-ui` and `@88khp/vajra-ui-core` to `3.0.0-alpha.1` from npm
   instead of the `vendor/` tarballs. Absolute times depend on the machine. The comparison between
   versions and libraries in the same run is what should hold.

3. **Read the raw data.** Each `round-<n>-<impl>.json` in
   [`results/release-3.0.0-alpha.1/`](results/release-3.0.0-alpha.1/) holds every sample.
   `summary.json` holds every number on this page, and `REPORT.md` has the full tables.
