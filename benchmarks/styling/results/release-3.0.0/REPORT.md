# Styling benchmark report

> **PRELIMINARY.** JavaScript-side measurements under react-test-renderer on a host machine.
> These are not device or native display timings. See "Not measured" below.

## Configuration

- Collected: 2026-10-22T13:45:03.608Z
- Host: darwin 25.5.0 arm64, Apple M4 (10 logical CPUs, 16 GB RAM), Node v24.22.0
- Versions: react 19.2.3, react-native 0.84.1, react-test-renderer 19.2.3, jest 29.7.0
- Styling libraries: vajra-ui 3.0.0 (core 3.0.0), styled-components 6.6.0, tamagui 3.1.2, nativewind 4.2.7, twrnc 4.16.0 (tailwindcss 3.4.19, css-interop 0.2.7)
- @88khp/vajra-ui: `https://registry.yarnpkg.com/@88khp/vajra-ui/-/vajra-ui-3.0.0.tgz#7e5e46aa3e6672317a60d9ca35206296c490530d`, `sha512-8Q5ehdvYUXTHvB7WIqZJ3NlBID8L6Dg69XFi0l61N1+twV2T+7PPSgAZDM/OFzvPGiaLR+lIYPHk4K0015iXrw==`
- @88khp/vajra-core: `https://registry.yarnpkg.com/@88khp/vajra-core/-/vajra-core-3.0.0.tgz#35a9ffa9c00be5c2f229e53895720846846a1cc2`, `sha512-ZHIOPSz+1wjsumkOzwfniELwIPa7CSlpuQhkfowMcI8IY/ja2EEXLBU0oRGNrkVStmZgHsUUomyXNMAJMRmcqg==`
- @88khp/vajra-ui-prev: `undefined`, `undefined`
- @88khp/vajra-core-prev: `undefined`, `undefined`
- Repository commit: `6f6f881c061b07b70ac657a752b9c1cf8b6cb63f`; uncommitted paths at run time: 6
- Options: 5 rounds, 10 measured trials, 3 warm-up trials, 12 steps per update trial

## Fastest implementation per scenario

| Scenario | Count | Fastest | Median (ms) |
|---|---|---|---|
| A. Initial mount (React commit) | 100 | StyleSheet | 12.000 |
| B. Re-render, styles unchanged | 100 | NativeWind | 0.000 |
| C. Variant switching (per update) | 100 | StyleSheet | 7.000 |
| C-variant-switch-trial-total | 100 | StyleSheet | 95.000 |
| D. Theme switching (per update) | 100 | StyleSheet | 7.000 |
| D-theme-switch-trial-total | 100 | StyleSheet | 91.000 |
| E. Combined theme + variant (per update) | 100 | StyleSheet | 7.000 |
| E-combined-trial-total | 100 | StyleSheet | 93.000 |

## Results

Relative improvement is measured against StyleSheet with `((baseline − candidate) / baseline) × 100`. Positive means the candidate is faster. The verdict is "meaningful" only when the 95% CI excludes zero and |improvement| ≥ 5%.

### A. Initial mount (React commit), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 30.000 | [29.00, 30.00] | 31.000 | -18.000 ms | -150.0% [-150.00, -123.08] | slower | n/a |
| StyledComponents | 50 | 15.000 | [15.00, 15.00] | 17.000 | -3.000 ms | -25.0% [-25.00, -15.38] | slower | n/a |
| StyleSheet | 50 | 12.000 | [12.00, 13.00] | 35.000 | baseline | — | — | n/a |
| Tamagui (compiled) | 50 | 60.000 | [58.00, 96.00] | 228.000 | -48.000 ms | -400.0% [-700.00, -350.00] | slower | n/a |
| Tamagui | 50 | 68.000 | [67.00, 70.00] | 113.000 | -56.000 ms | -466.7% [-483.33, -423.08] | slower | n/a |
| twrnc | 50 | 13.000 | [13.00, 13.50] | 35.000 | -1.000 ms | -8.3% [-8.33, 0.00] | within noise | n/a |
| VajraUI 3.0.0 | 50 | 17.000 | [16.00, 17.00] | 28.000 | -5.000 ms | -41.7% [-41.67, -23.08] | slower | n/a |

### B. Re-render, styles unchanged, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 0.000 | [0.00, 0.00] | 0.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| StyledComponents | 50 | 0.000 | [0.00, 0.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| StyleSheet | 50 | 0.000 | [0.00, 0.00] | 1.000 | baseline | — | — | 1 |
| Tamagui (compiled) | 50 | 0.000 | [0.00, 1.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| Tamagui | 50 | 0.000 | [0.00, 0.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| twrnc | 50 | 0.000 | [0.00, 0.00] | 0.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| VajraUI 3.0.0 | 50 | 0.000 | [0.00, 0.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |

### C. Variant switching (per update), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 600 | 19.000 | [19.00, 20.00] | 44.000 | -12.000 ms | -171.4% [-178.57, -137.50] | slower | 1001 |
| StyledComponents | 600 | 10.000 | [10.00, 10.00] | 16.000 | -3.000 ms | -42.9% [-42.86, -25.00] | slower | 1001 |
| StyleSheet | 600 | 7.000 | [7.00, 8.00] | 26.000 | baseline | — | — | 1001 |
| Tamagui (compiled) | 600 | 33.000 | [33.00, 33.00] | 58.000 | -26.000 ms | -371.4% [-371.43, -312.50] | slower | 601 |
| Tamagui | 600 | 33.000 | [32.00, 33.00] | 57.000 | -26.000 ms | -371.4% [-371.43, -300.00] | slower | 601 |
| twrnc | 600 | 8.000 | [8.00, 8.00] | 27.000 | -1.000 ms | -14.3% [-14.29, 0.00] | within noise | 1001 |
| VajraUI 3.0.0 | 600 | 8.000 | [8.00, 8.00] | 18.000 | -1.000 ms | -14.3% [-14.29, 0.00] | within noise | 601 |

### C-variant-switch-trial-total, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 257.000 | [244.00, 271.00] | 331.000 | -162.000 ms | -170.5% [-186.17, -156.32] | slower | n/a |
| StyledComponents | 50 | 122.500 | [121.00, 125.00] | 201.000 | -27.500 ms | -28.9% [-32.98, -27.08] | slower | n/a |
| StyleSheet | 50 | 95.000 | [94.00, 96.00] | 179.000 | baseline | — | — | n/a |
| Tamagui (compiled) | 50 | 445.500 | [403.00, 471.00] | 602.000 | -350.500 ms | -368.9% [-398.94, -325.13] | slower | n/a |
| Tamagui | 50 | 422.500 | [403.50, 440.00] | 514.000 | -327.500 ms | -344.7% [-363.68, -324.21] | slower | n/a |
| twrnc | 50 | 106.000 | [103.00, 110.50] | 192.000 | -11.000 ms | -11.6% [-16.49, -8.33] | slower | n/a |
| VajraUI 3.0.0 | 50 | 103.000 | [101.00, 108.00] | 185.000 | -8.000 ms | -8.4% [-14.89, -6.25] | slower | n/a |

### D. Theme switching (per update), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 600 | 22.000 | [22.00, 22.00] | 60.000 | -15.000 ms | -214.3% [-214.29, -214.29] | slower | 1001 |
| StyledComponents | 600 | 8.000 | [8.00, 8.00] | 16.000 | -1.000 ms | -14.3% [-14.29, -14.29] | slower | 1001 |
| StyleSheet | 600 | 7.000 | [7.00, 7.00] | 11.000 | baseline | — | — | 1001 |
| Tamagui (compiled) | 600 | 46.000 | [46.00, 46.00] | 79.000 | -39.000 ms | -557.1% [-557.14, -557.14] | slower | 1001 |
| Tamagui | 600 | 54.000 | [54.00, 54.00] | 87.000 | -47.000 ms | -671.4% [-671.43, -671.43] | slower | 1001 |
| twrnc | 600 | 8.000 | [8.00, 8.00] | 26.000 | -1.000 ms | -14.3% [-14.29, -14.29] | slower | 1001 |
| VajraUI 3.0.0 | 600 | 9.000 | [9.00, 10.00] | 28.000 | -2.000 ms | -28.6% [-42.86, -28.57] | slower | 1001 |

### D-theme-switch-trial-total, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 279.500 | [273.00, 345.00] | 366.000 | -188.500 ms | -207.1% [-279.12, -200.55] | slower | n/a |
| StyledComponents | 50 | 107.000 | [104.00, 109.00] | 187.000 | -16.000 ms | -17.6% [-20.90, -14.29] | slower | n/a |
| StyleSheet | 50 | 91.000 | [89.00, 91.00] | 168.000 | baseline | — | — | n/a |
| Tamagui (compiled) | 50 | 626.500 | [613.00, 671.00] | 701.000 | -535.500 ms | -588.5% [-646.07, -574.73] | slower | n/a |
| Tamagui | 50 | 764.000 | [756.00, 773.00] | 797.000 | -673.000 ms | -739.6% [-765.17, -732.24] | slower | n/a |
| twrnc | 50 | 97.000 | [96.00, 101.00] | 182.000 | -6.000 ms | -6.6% [-12.22, -6.04] | slower | n/a |
| VajraUI 3.0.0 | 50 | 121.500 | [116.50, 146.00] | 263.000 | -30.500 ms | -33.5% [-59.89, -28.57] | slower | n/a |

### E. Combined theme + variant (per update), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 600 | 22.000 | [22.00, 23.50] | 61.000 | -15.000 ms | -214.3% [-235.71, -214.29] | slower | 1001 |
| StyledComponents | 600 | 10.000 | [10.00, 10.00] | 24.000 | -3.000 ms | -42.9% [-42.86, -42.86] | slower | 1001 |
| StyleSheet | 600 | 7.000 | [7.00, 7.00] | 12.000 | baseline | — | — | 1001 |
| Tamagui (compiled) | 600 | 81.000 | [80.00, 81.00] | 133.000 | -74.000 ms | -1057.1% [-1057.14, -1042.86] | slower | 1001 |
| Tamagui | 600 | 89.000 | [88.00, 89.00] | 143.000 | -82.000 ms | -1171.4% [-1171.43, -1157.14] | slower | 1001 |
| twrnc | 600 | 8.000 | [8.00, 8.00] | 12.000 | -1.000 ms | -14.3% [-14.29, -14.29] | slower | 1001 |
| VajraUI 3.0.0 | 600 | 11.000 | [11.00, 11.00] | 21.000 | -4.000 ms | -57.1% [-57.14, -57.14] | slower | 1001 |

### E-combined-trial-total, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 287.000 | [279.00, 298.00] | 374.000 | -194.000 ms | -208.6% [-222.28, -198.92] | slower | n/a |
| StyledComponents | 50 | 124.000 | [122.00, 129.00] | 230.000 | -31.000 ms | -33.3% [-39.78, -29.79] | slower | n/a |
| StyleSheet | 50 | 93.000 | [91.50, 94.00] | 179.000 | baseline | — | — | n/a |
| Tamagui (compiled) | 50 | 1071.000 | [1065.00, 1077.00] | 1159.000 | -978.000 ms | -1051.6% [-1070.65, -1033.51] | slower | n/a |
| Tamagui | 50 | 1188.500 | [1170.50, 1200.00] | 1272.000 | -1095.500 ms | -1178.0% [-1201.09, -1148.94] | slower | n/a |
| twrnc | 50 | 99.500 | [98.00, 102.00] | 184.000 | -6.500 ms | -7.0% [-10.33, -4.26] | slower | n/a |
| VajraUI 3.0.0 | 50 | 134.500 | [133.00, 146.00] | 215.000 | -41.500 ms | -44.6% [-58.70, -41.80] | slower | n/a |

## Not measured

- Native display timing (time until pixels are drawn) — needs a simulator or device build
- Scenario F: FlatList scrolling and frame timing — needs a native list on device
- Unistyles, all scenarios — needs its native runtime (simulator or device build)
- Bundle size, native binary size, build time — see README.md
- Native memory — JS heap only; no platform profiler
- Thermal state — no device
- Style-resolution time and allocation counts — not instrumented in this harness

## Definitions

- **Host re-renders:** Host View/Text nodes whose props object is new after a commit. Comparable across libraries because all render the same host tree.
- **Card invocations:** BenchmarkCard function calls. NOT comparable across libraries for context-driven updates (Vajra and Tamagui read the theme inside children).

## Raw measurements

Each raw file holds every sample for one implementation in one round. See `results/summary.csv` and `results/summary.json` for the aggregated numbers.

- `raw/round-1-nativewind.json` — nativewind, round 1, 410 samples
- `raw/round-1-styled-components.json` — styled-components, round 1, 410 samples
- `raw/round-1-stylesheet.json` — stylesheet, round 1, 410 samples
- `raw/round-1-tamagui-compiled.json` — tamagui-compiled, round 1, 410 samples
- `raw/round-1-tamagui.json` — tamagui, round 1, 410 samples
- `raw/round-1-twrnc.json` — twrnc, round 1, 410 samples
- `raw/round-1-vajra.json` — vajra, round 1, 410 samples
- `raw/round-2-nativewind.json` — nativewind, round 2, 410 samples
- `raw/round-2-styled-components.json` — styled-components, round 2, 410 samples
- `raw/round-2-stylesheet.json` — stylesheet, round 2, 410 samples
- `raw/round-2-tamagui-compiled.json` — tamagui-compiled, round 2, 410 samples
- `raw/round-2-tamagui.json` — tamagui, round 2, 410 samples
- `raw/round-2-twrnc.json` — twrnc, round 2, 410 samples
- `raw/round-2-vajra.json` — vajra, round 2, 410 samples
- `raw/round-3-nativewind.json` — nativewind, round 3, 410 samples
- `raw/round-3-styled-components.json` — styled-components, round 3, 410 samples
- `raw/round-3-stylesheet.json` — stylesheet, round 3, 410 samples
- `raw/round-3-tamagui-compiled.json` — tamagui-compiled, round 3, 410 samples
- `raw/round-3-tamagui.json` — tamagui, round 3, 410 samples
- `raw/round-3-twrnc.json` — twrnc, round 3, 410 samples
- `raw/round-3-vajra.json` — vajra, round 3, 410 samples
- `raw/round-4-nativewind.json` — nativewind, round 4, 410 samples
- `raw/round-4-styled-components.json` — styled-components, round 4, 410 samples
- `raw/round-4-stylesheet.json` — stylesheet, round 4, 410 samples
- `raw/round-4-tamagui-compiled.json` — tamagui-compiled, round 4, 410 samples
- `raw/round-4-tamagui.json` — tamagui, round 4, 410 samples
- `raw/round-4-twrnc.json` — twrnc, round 4, 410 samples
- `raw/round-4-vajra.json` — vajra, round 4, 410 samples
- `raw/round-5-nativewind.json` — nativewind, round 5, 410 samples
- `raw/round-5-styled-components.json` — styled-components, round 5, 410 samples
- `raw/round-5-stylesheet.json` — stylesheet, round 5, 410 samples
- `raw/round-5-tamagui-compiled.json` — tamagui-compiled, round 5, 410 samples
- `raw/round-5-tamagui.json` — tamagui, round 5, 410 samples
- `raw/round-5-twrnc.json` — twrnc, round 5, 410 samples
- `raw/round-5-vajra.json` — vajra, round 5, 410 samples
