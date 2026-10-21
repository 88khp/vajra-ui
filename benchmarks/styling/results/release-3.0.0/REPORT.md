# Styling benchmark report

> **PRELIMINARY.** JavaScript-side measurements under react-test-renderer on a host machine.
> These are not device or native display timings. See "Not measured" below.

## Configuration

- Collected: 2026-10-21T21:09:53.696Z
- Host: darwin 25.5.0 arm64, Apple M4 (10 logical CPUs, 16 GB RAM), Node v24.22.0
- Versions: react 19.2.3, react-native 0.84.1, react-test-renderer 19.2.3, jest 29.7.0
- Styling libraries: vajra-ui 3.0.0-alpha.1 (core 3.0.0-alpha.1), styled-components 6.6.0, tamagui 3.1.2, nativewind 4.2.7, twrnc 4.16.0 (tailwindcss 3.4.19, css-interop 0.2.7)
- @88khp/vajra-ui: `https://registry.yarnpkg.com/@88khp/vajra-ui/-/vajra-ui-3.0.0-alpha.1.tgz#7b3a116e45d1ac8c39d389250852c27a22bf1890`, `sha512-dqEMdDMssWZW/43dXh12Y4mPKasL4QkuA4pVEh8ou0gb1HJXLV1UG6yy67DnkrXRhdzWrp/IzdVmBN8hcmR3VA==`
- @88khp/vajra-ui-core: `https://registry.yarnpkg.com/@88khp/vajra-ui-core/-/vajra-ui-core-3.0.0-alpha.1.tgz#53bf2d2c639ee85a97196924eaa633627d3fedae`, `sha512-pElEaPRTTEKa9tu94c6OEVJzCIeiEAUPqWUVUPGctva/DJtXpz+jlC80fOs79juakKP9o8lY4fpRaXzhfZ4LbA==`
- @88khp/vajra-ui-prev: `https://registry.yarnpkg.com/@88khp/vajra-ui/-/vajra-ui-3.0.0-alpha.0.tgz#8ee58bf13e946b22a5b734ae8646daa2685e503a`, `sha512-SemEQI66QVWrszCyBlLrHf1zv0dBHxwH8UX4GcojA3YHYjmmsE587F771KruO6nRWp8NeuAoTW1UNQuakr7L4w==`
- @88khp/vajra-ui-core-prev: `https://registry.yarnpkg.com/@88khp/vajra-ui-core/-/vajra-ui-core-3.0.0-alpha.0.tgz#0c53bcaa64e1ee8068d43699dc55540ae480ca84`, `sha512-AZ+AqVhAFqK3Yl/KmzDHbECP/MnivUlEKfdF52yPudQX9VE3wVRpk+C11YDTPDZ+8EBNT/L9XVa+nxNc1RTRiQ==`
- Repository commit: `fea86459bdfa54ec82d9cc3232eef7c1aeefffce`; uncommitted paths at run time: 11
- Options: 5 rounds, 10 measured trials, 3 warm-up trials, 12 steps per update trial

## Vajra UI 3.0.0-alpha.1 vs 3.0.0-alpha.0 (same run)

Both versions ran in the same rounds, in shuffled order. Positive improvement means the current version is faster.

| Scenario | Count | 3.0.0-alpha.0 median (ms) | 3.0.0-alpha.1 median (ms) | Improvement (95% CI) | Verdict |
|---|---|---|---|---|---|
| A. Initial mount (React commit) | 100 | 18.000 | 16.000 | 11.1% [11.11, 11.11] | faster |
| B. Re-render, styles unchanged | 100 | 0.000 | 0.000 | n/a% n/a | within noise |
| C. Variant switching (per update) | 100 | 9.000 | 8.000 | 11.1% [11.11, 11.11] | faster |
| C-variant-switch-trial-total | 100 | 113.000 | 103.000 | 8.8% [6.73, 10.96] | faster |
| D. Theme switching (per update) | 100 | 10.000 | 9.000 | 10.0% [10.00, 10.00] | faster |
| D-theme-switch-trial-total | 100 | 131.500 | 117.500 | 10.6% [5.30, 12.78] | faster |
| E. Combined theme + variant (per update) | 100 | 12.000 | 11.000 | 8.3% [8.33, 8.33] | faster |
| E-combined-trial-total | 100 | 151.500 | 134.500 | 11.2% [8.78, 16.46] | faster |

## Fastest implementation per scenario

| Scenario | Count | Fastest | Median (ms) |
|---|---|---|---|
| A. Initial mount (React commit) | 100 | StyleSheet | 12.000 |
| B. Re-render, styles unchanged | 100 | NativeWind | 0.000 |
| C. Variant switching (per update) | 100 | StyleSheet | 7.000 |
| C-variant-switch-trial-total | 100 | StyleSheet | 96.000 |
| D. Theme switching (per update) | 100 | StyleSheet | 7.000 |
| D-theme-switch-trial-total | 100 | StyleSheet | 90.500 |
| E. Combined theme + variant (per update) | 100 | StyleSheet | 7.000 |
| E-combined-trial-total | 100 | StyleSheet | 93.000 |

## Results

Relative improvement is measured against StyleSheet with `((baseline − candidate) / baseline) × 100`. Positive means the candidate is faster. The verdict is "meaningful" only when the 95% CI excludes zero and |improvement| ≥ 5%.

### A. Initial mount (React commit), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 29.000 | [29.00, 30.00] | 31.000 | -17.000 ms | -141.7% [-150.00, -141.67] | slower | n/a |
| StyledComponents | 50 | 15.000 | [15.00, 16.00] | 18.000 | -3.000 ms | -25.0% [-33.33, -25.00] | slower | n/a |
| StyleSheet | 50 | 12.000 | [12.00, 12.00] | 34.000 | baseline | — | — | n/a |
| Tamagui (compiled) | 50 | 57.500 | [57.00, 59.00] | 104.000 | -45.500 ms | -379.2% [-391.67, -375.00] | slower | n/a |
| Tamagui | 50 | 68.000 | [67.00, 69.50] | 112.000 | -56.000 ms | -466.7% [-479.17, -458.33] | slower | n/a |
| twrnc | 50 | 13.000 | [12.50, 13.00] | 35.000 | -1.000 ms | -8.3% [-8.33, -4.17] | slower | n/a |
| VajraUI 3.0.0-alpha.0 | 50 | 18.000 | [18.00, 18.00] | 19.000 | -6.000 ms | -50.0% [-50.00, -45.83] | slower | n/a |
| VajraUI 3.0.0-alpha.1 | 50 | 16.000 | [16.00, 16.00] | 19.000 | -4.000 ms | -33.3% [-33.33, -33.33] | slower | n/a |

### B. Re-render, styles unchanged, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 0.000 | [0.00, 0.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| StyledComponents | 50 | 0.000 | [0.00, 0.00] | 0.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| StyleSheet | 50 | 0.000 | [0.00, 0.00] | 0.000 | baseline | — | — | 1 |
| Tamagui (compiled) | 50 | 0.000 | [0.00, 0.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| Tamagui | 50 | 0.000 | [0.00, 0.00] | 0.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| twrnc | 50 | 0.000 | [0.00, 0.00] | 0.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| VajraUI 3.0.0-alpha.0 | 50 | 0.000 | [0.00, 0.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| VajraUI 3.0.0-alpha.1 | 50 | 0.000 | [0.00, 0.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |

### C. Variant switching (per update), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 600 | 19.000 | [19.00, 19.00] | 42.000 | -12.000 ms | -171.4% [-171.43, -137.50] | slower | 1001 |
| StyledComponents | 600 | 10.000 | [10.00, 10.00] | 15.000 | -3.000 ms | -42.9% [-42.86, -25.00] | slower | 1001 |
| StyleSheet | 600 | 7.000 | [7.00, 8.00] | 26.000 | baseline | — | — | 1001 |
| Tamagui (compiled) | 600 | 33.000 | [32.00, 33.00] | 57.000 | -26.000 ms | -371.4% [-371.43, -300.00] | slower | 601 |
| Tamagui | 600 | 32.000 | [32.00, 33.00] | 57.000 | -25.000 ms | -357.1% [-364.29, -300.00] | slower | 601 |
| twrnc | 600 | 8.000 | [8.00, 8.00] | 27.000 | -1.000 ms | -14.3% [-14.29, 0.00] | within noise | 1001 |
| VajraUI 3.0.0-alpha.0 | 600 | 9.000 | [9.00, 9.00] | 16.000 | -2.000 ms | -28.6% [-28.57, -12.50] | slower | 601 |
| VajraUI 3.0.0-alpha.1 | 600 | 8.000 | [8.00, 8.00] | 12.000 | -1.000 ms | -14.3% [-14.29, 0.00] | within noise | 601 |

### C-variant-switch-trial-total, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 248.500 | [242.00, 260.50] | 327.000 | -152.500 ms | -158.9% [-174.47, -152.08] | slower | n/a |
| StyledComponents | 50 | 121.000 | [120.00, 123.00] | 205.000 | -25.000 ms | -26.0% [-31.02, -24.74] | slower | n/a |
| StyleSheet | 50 | 96.000 | [93.00, 97.00] | 178.000 | baseline | — | — | n/a |
| Tamagui (compiled) | 50 | 432.000 | [401.00, 465.00] | 486.000 | -336.000 ms | -350.0% [-391.58, -317.71] | slower | n/a |
| Tamagui | 50 | 427.500 | [399.00, 454.00] | 485.000 | -331.500 ms | -345.3% [-374.35, -316.15] | slower | n/a |
| twrnc | 50 | 102.500 | [100.00, 104.00] | 178.000 | -6.500 ms | -6.8% [-10.75, -4.17] | slower | n/a |
| VajraUI 3.0.0-alpha.0 | 50 | 113.000 | [111.00, 115.00] | 190.000 | -17.000 ms | -17.7% [-21.58, -15.54] | slower | n/a |
| VajraUI 3.0.0-alpha.1 | 50 | 103.000 | [101.00, 104.00] | 182.000 | -7.000 ms | -7.3% [-10.75, -5.21] | slower | n/a |

### D. Theme switching (per update), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 600 | 23.000 | [22.00, 24.00] | 61.000 | -16.000 ms | -228.6% [-242.86, -214.29] | slower | 1001 |
| StyledComponents | 600 | 8.000 | [8.00, 8.00] | 13.000 | -1.000 ms | -14.3% [-14.29, -14.29] | slower | 1001 |
| StyleSheet | 600 | 7.000 | [7.00, 7.00] | 11.000 | baseline | — | — | 1001 |
| Tamagui (compiled) | 600 | 46.000 | [46.00, 46.00] | 78.000 | -39.000 ms | -557.1% [-557.14, -557.14] | slower | 1001 |
| Tamagui | 600 | 54.000 | [54.00, 55.00] | 89.000 | -47.000 ms | -671.4% [-685.71, -671.43] | slower | 1001 |
| twrnc | 600 | 8.000 | [8.00, 8.00] | 11.000 | -1.000 ms | -14.3% [-14.29, -14.29] | slower | 1001 |
| VajraUI 3.0.0-alpha.0 | 600 | 10.000 | [10.00, 10.00] | 20.000 | -3.000 ms | -42.9% [-42.86, -42.86] | slower | 1001 |
| VajraUI 3.0.0-alpha.1 | 600 | 9.000 | [9.00, 9.00] | 28.000 | -2.000 ms | -28.6% [-28.57, -28.57] | slower | 1001 |

### D-theme-switch-trial-total, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 305.500 | [289.00, 325.50] | 485.000 | -215.000 ms | -237.6% [-258.24, -220.00] | slower | n/a |
| StyledComponents | 50 | 104.000 | [102.50, 107.00] | 180.000 | -13.500 ms | -14.9% [-18.89, -12.64] | slower | n/a |
| StyleSheet | 50 | 90.500 | [89.00, 92.00] | 166.000 | baseline | — | — | n/a |
| Tamagui (compiled) | 50 | 643.500 | [606.50, 667.00] | 700.000 | -553.000 ms | -611.0% [-641.11, -568.13] | slower | n/a |
| Tamagui | 50 | 768.500 | [752.00, 773.50] | 865.000 | -678.000 ms | -749.2% [-762.92, -726.23] | slower | n/a |
| twrnc | 50 | 96.000 | [95.00, 98.00] | 159.000 | -5.500 ms | -6.1% [-8.43, -3.80] | slower | n/a |
| VajraUI 3.0.0-alpha.0 | 50 | 131.500 | [130.00, 133.00] | 215.000 | -41.000 ms | -45.3% [-47.78, -42.39] | slower | n/a |
| VajraUI 3.0.0-alpha.1 | 50 | 117.500 | [115.00, 124.00] | 196.000 | -27.000 ms | -29.8% [-37.91, -26.63] | slower | n/a |

### E. Combined theme + variant (per update), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 600 | 24.000 | [23.00, 24.00] | 63.000 | -17.000 ms | -242.9% [-242.86, -228.57] | slower | 1001 |
| StyledComponents | 600 | 10.000 | [9.00, 10.00] | 14.000 | -3.000 ms | -42.9% [-42.86, -28.57] | slower | 1001 |
| StyleSheet | 600 | 7.000 | [7.00, 7.00] | 12.000 | baseline | — | — | 1001 |
| Tamagui (compiled) | 600 | 79.500 | [79.00, 80.00] | 132.000 | -72.500 ms | -1035.7% [-1042.86, -1028.57] | slower | 1001 |
| Tamagui | 600 | 88.000 | [88.00, 88.00] | 141.000 | -81.000 ms | -1157.1% [-1157.14, -1157.14] | slower | 1001 |
| twrnc | 600 | 8.000 | [8.00, 8.00] | 12.000 | -1.000 ms | -14.3% [-14.29, -14.29] | slower | 1001 |
| VajraUI 3.0.0-alpha.0 | 600 | 12.000 | [12.00, 12.00] | 34.000 | -5.000 ms | -71.4% [-71.43, -71.43] | slower | 1001 |
| VajraUI 3.0.0-alpha.1 | 600 | 11.000 | [11.00, 11.00] | 21.000 | -4.000 ms | -57.1% [-57.14, -57.14] | slower | 1001 |

### E-combined-trial-total, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 299.000 | [279.50, 361.00] | 468.000 | -206.000 ms | -221.5% [-288.17, -200.54] | slower | n/a |
| StyledComponents | 50 | 121.000 | [119.50, 123.00] | 206.000 | -28.000 ms | -30.1% [-32.97, -27.66] | slower | n/a |
| StyleSheet | 50 | 93.000 | [91.00, 94.00] | 178.000 | baseline | — | — | n/a |
| Tamagui (compiled) | 50 | 1051.000 | [1046.00, 1057.50] | 1169.000 | -958.000 ms | -1030.1% [-1052.75, -1013.83] | slower | n/a |
| Tamagui | 50 | 1163.000 | [1156.00, 1178.00] | 1273.000 | -1070.000 ms | -1150.5% [-1177.60, -1132.45] | slower | n/a |
| twrnc | 50 | 99.500 | [98.00, 102.00] | 180.000 | -6.500 ms | -7.0% [-10.27, -4.26] | slower | n/a |
| VajraUI 3.0.0-alpha.0 | 50 | 151.500 | [148.00, 161.00] | 245.000 | -58.500 ms | -62.9% [-73.12, -58.29] | slower | n/a |
| VajraUI 3.0.0-alpha.1 | 50 | 134.500 | [133.00, 136.00] | 226.000 | -41.500 ms | -44.6% [-47.80, -42.25] | slower | n/a |

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
- `raw/round-1-vajra-prev.json` — vajra-prev, round 1, 410 samples
- `raw/round-1-vajra.json` — vajra, round 1, 410 samples
- `raw/round-2-nativewind.json` — nativewind, round 2, 410 samples
- `raw/round-2-styled-components.json` — styled-components, round 2, 410 samples
- `raw/round-2-stylesheet.json` — stylesheet, round 2, 410 samples
- `raw/round-2-tamagui-compiled.json` — tamagui-compiled, round 2, 410 samples
- `raw/round-2-tamagui.json` — tamagui, round 2, 410 samples
- `raw/round-2-twrnc.json` — twrnc, round 2, 410 samples
- `raw/round-2-vajra-prev.json` — vajra-prev, round 2, 410 samples
- `raw/round-2-vajra.json` — vajra, round 2, 410 samples
- `raw/round-3-nativewind.json` — nativewind, round 3, 410 samples
- `raw/round-3-styled-components.json` — styled-components, round 3, 410 samples
- `raw/round-3-stylesheet.json` — stylesheet, round 3, 410 samples
- `raw/round-3-tamagui-compiled.json` — tamagui-compiled, round 3, 410 samples
- `raw/round-3-tamagui.json` — tamagui, round 3, 410 samples
- `raw/round-3-twrnc.json` — twrnc, round 3, 410 samples
- `raw/round-3-vajra-prev.json` — vajra-prev, round 3, 410 samples
- `raw/round-3-vajra.json` — vajra, round 3, 410 samples
- `raw/round-4-nativewind.json` — nativewind, round 4, 410 samples
- `raw/round-4-styled-components.json` — styled-components, round 4, 410 samples
- `raw/round-4-stylesheet.json` — stylesheet, round 4, 410 samples
- `raw/round-4-tamagui-compiled.json` — tamagui-compiled, round 4, 410 samples
- `raw/round-4-tamagui.json` — tamagui, round 4, 410 samples
- `raw/round-4-twrnc.json` — twrnc, round 4, 410 samples
- `raw/round-4-vajra-prev.json` — vajra-prev, round 4, 410 samples
- `raw/round-4-vajra.json` — vajra, round 4, 410 samples
- `raw/round-5-nativewind.json` — nativewind, round 5, 410 samples
- `raw/round-5-styled-components.json` — styled-components, round 5, 410 samples
- `raw/round-5-stylesheet.json` — stylesheet, round 5, 410 samples
- `raw/round-5-tamagui-compiled.json` — tamagui-compiled, round 5, 410 samples
- `raw/round-5-tamagui.json` — tamagui, round 5, 410 samples
- `raw/round-5-twrnc.json` — twrnc, round 5, 410 samples
- `raw/round-5-vajra-prev.json` — vajra-prev, round 5, 410 samples
- `raw/round-5-vajra.json` — vajra, round 5, 410 samples
