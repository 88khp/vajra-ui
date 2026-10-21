# Styling benchmark report

> **PRELIMINARY.** JavaScript-side measurements under react-test-renderer on a host machine.
> These are not device or native display timings. See "Not measured" below.

## Configuration

- Collected: 2026-10-21T19:42:44.421Z
- Host: darwin 25.5.0 arm64, Apple M4 (10 logical CPUs, 16 GB RAM), Node v24.22.0
- Versions: react 19.2.3, react-native 0.84.1, react-test-renderer 19.2.3, jest 29.7.0
- Styling libraries: vajra-ui 3.0.0-alpha.1 (core 3.0.0-alpha.1), styled-components 6.6.0, tamagui 3.1.2, nativewind 4.2.7, twrnc 4.16.0 (tailwindcss 3.4.19, css-interop 0.2.7)
- @88khp/vajra-ui: `file:./vendor/88khp-vajra-ui-3.0.0-alpha.1-7b3a116e.tgz#7b3a116e45d1ac8c39d389250852c27a22bf1890`, `undefined`
- @88khp/vajra-ui-core: `file:./vendor/88khp-vajra-ui-core-3.0.0-alpha.1-53bf2d2c.tgz#53bf2d2c639ee85a97196924eaa633627d3fedae`, `undefined`
- @88khp/vajra-ui-prev: `https://registry.yarnpkg.com/@88khp/vajra-ui/-/vajra-ui-3.0.0-alpha.0.tgz#8ee58bf13e946b22a5b734ae8646daa2685e503a`, `sha512-SemEQI66QVWrszCyBlLrHf1zv0dBHxwH8UX4GcojA3YHYjmmsE587F771KruO6nRWp8NeuAoTW1UNQuakr7L4w==`
- @88khp/vajra-ui-core-prev: `https://registry.yarnpkg.com/@88khp/vajra-ui-core/-/vajra-ui-core-3.0.0-alpha.0.tgz#0c53bcaa64e1ee8068d43699dc55540ae480ca84`, `sha512-AZ+AqVhAFqK3Yl/KmzDHbECP/MnivUlEKfdF52yPudQX9VE3wVRpk+C11YDTPDZ+8EBNT/L9XVa+nxNc1RTRiQ==`
- Repository commit: `38bfa6512fbc554876e15f30e8aa6150fd77fd31`; uncommitted paths at run time: 9
- Options: 5 rounds, 10 measured trials, 3 warm-up trials, 12 steps per update trial

## Vajra UI 3.0.0-alpha.1 vs 3.0.0-alpha.0 (same run)

Both versions ran in the same rounds, in shuffled order. Positive improvement means the current version is faster.

| Scenario | Count | 3.0.0-alpha.0 median (ms) | 3.0.0-alpha.1 median (ms) | Improvement (95% CI) | Verdict |
|---|---|---|---|---|---|
| A. Initial mount (React commit) | 100 | 18.000 | 17.000 | 5.6% [5.56, 5.56] | faster |
| B. Re-render, styles unchanged | 100 | 0.000 | 0.000 | n/a% n/a | within noise |
| C. Variant switching (per update) | 100 | 9.000 | 8.000 | 11.1% [11.11, 11.11] | faster |
| C-variant-switch-trial-total | 100 | 112.500 | 102.000 | 9.3% [6.70, 11.69] | faster |
| D. Theme switching (per update) | 100 | 10.000 | 9.000 | 10.0% [10.00, 18.18] | faster |
| D-theme-switch-trial-total | 100 | 132.000 | 116.000 | 12.1% [9.85, 14.50] | faster |
| E. Combined theme + variant (per update) | 100 | 12.000 | 11.000 | 8.3% [8.33, 8.33] | faster |
| E-combined-trial-total | 100 | 154.500 | 138.500 | 10.4% [6.27, 14.91] | faster |

## Fastest implementation per scenario

| Scenario | Count | Fastest | Median (ms) |
|---|---|---|---|
| A. Initial mount (React commit) | 100 | StyleSheet | 12.000 |
| B. Re-render, styles unchanged | 100 | NativeWind | 0.000 |
| C. Variant switching (per update) | 100 | StyleSheet | 7.500 |
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
| NativeWind | 50 | 30.000 | [29.00, 30.50] | 33.000 | -18.000 ms | -150.0% [-154.17, -141.67] | slower | n/a |
| StyledComponents | 50 | 15.000 | [15.00, 15.00] | 17.000 | -3.000 ms | -25.0% [-25.00, -20.83] | slower | n/a |
| StyleSheet | 50 | 12.000 | [12.00, 12.00] | 35.000 | baseline | — | — | n/a |
| Tamagui | 50 | 68.000 | [67.00, 70.00] | 114.000 | -56.000 ms | -466.7% [-483.33, -458.33] | slower | n/a |
| twrnc | 50 | 13.000 | [13.00, 14.00] | 36.000 | -1.000 ms | -8.3% [-16.67, -8.33] | slower | n/a |
| VajraUI 3.0.0-alpha.0 | 50 | 18.000 | [18.00, 18.00] | 19.000 | -6.000 ms | -50.0% [-50.00, -50.00] | slower | n/a |
| VajraUI 3.0.0-alpha.1 | 50 | 17.000 | [17.00, 17.00] | 19.000 | -5.000 ms | -41.7% [-41.67, -41.67] | slower | n/a |

### B. Re-render, styles unchanged, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 0.000 | [0.00, 0.00] | 0.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| StyledComponents | 50 | 0.000 | [0.00, 0.00] | 0.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| StyleSheet | 50 | 0.000 | [0.00, 0.00] | 0.000 | baseline | — | — | 1 |
| Tamagui | 50 | 0.000 | [0.00, 0.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| twrnc | 50 | 0.000 | [0.00, 0.00] | 0.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| VajraUI 3.0.0-alpha.0 | 50 | 0.000 | [0.00, 0.00] | 0.000 | 0.000 ms | n/a% n/a | within noise | 1 |
| VajraUI 3.0.0-alpha.1 | 50 | 0.000 | [0.00, 0.00] | 1.000 | 0.000 ms | n/a% n/a | within noise | 1 |

### C. Variant switching (per update), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 600 | 20.000 | [19.00, 20.00] | 51.000 | -12.500 ms | -166.7% [-185.71, -137.50] | slower | 1001 |
| StyledComponents | 600 | 10.000 | [10.00, 10.00] | 21.000 | -2.500 ms | -33.3% [-42.86, -25.00] | slower | 1001 |
| StyleSheet | 600 | 7.500 | [7.00, 8.00] | 27.000 | baseline | — | — | 1001 |
| Tamagui | 600 | 33.000 | [33.00, 33.00] | 57.000 | -25.500 ms | -340.0% [-371.43, -312.50] | slower | 601 |
| twrnc | 600 | 8.000 | [8.00, 8.00] | 12.000 | -0.500 ms | -6.7% [-14.29, 0.00] | within noise | 1001 |
| VajraUI 3.0.0-alpha.0 | 600 | 9.000 | [9.00, 9.00] | 14.000 | -1.500 ms | -20.0% [-28.57, -12.50] | slower | 601 |
| VajraUI 3.0.0-alpha.1 | 600 | 8.000 | [8.00, 8.00] | 12.000 | -0.500 ms | -6.7% [-14.29, 0.00] | within noise | 601 |

### C-variant-switch-trial-total, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 262.000 | [248.00, 277.50] | 345.000 | -167.000 ms | -175.8% [-191.58, -157.37] | slower | n/a |
| StyledComponents | 50 | 126.500 | [122.00, 133.00] | 205.000 | -31.500 ms | -33.2% [-39.89, -27.08] | slower | n/a |
| StyleSheet | 50 | 95.000 | [94.00, 98.00] | 178.000 | baseline | — | — | n/a |
| Tamagui | 50 | 430.000 | [399.50, 467.00] | 490.000 | -335.000 ms | -352.6% [-388.42, -316.15] | slower | n/a |
| twrnc | 50 | 103.000 | [101.00, 105.00] | 183.000 | -8.000 ms | -8.4% [-10.53, -4.64] | slower | n/a |
| VajraUI 3.0.0-alpha.0 | 50 | 112.500 | [111.00, 115.00] | 192.000 | -17.500 ms | -18.4% [-21.58, -14.65] | slower | n/a |
| VajraUI 3.0.0-alpha.1 | 50 | 102.000 | [101.00, 105.00] | 180.000 | -7.000 ms | -7.4% [-10.53, -4.08] | slower | n/a |

### D. Theme switching (per update), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 600 | 23.000 | [22.00, 23.50] | 59.000 | -16.000 ms | -228.6% [-235.71, -214.29] | slower | 1001 |
| StyledComponents | 600 | 8.000 | [8.00, 8.00] | 14.000 | -1.000 ms | -14.3% [-14.29, -14.29] | slower | 1001 |
| StyleSheet | 600 | 7.000 | [7.00, 7.00] | 12.000 | baseline | — | — | 1001 |
| Tamagui | 600 | 54.000 | [54.00, 54.00] | 88.000 | -47.000 ms | -671.4% [-671.43, -671.43] | slower | 1001 |
| twrnc | 600 | 8.000 | [8.00, 8.00] | 26.000 | -1.000 ms | -14.3% [-14.29, -14.29] | slower | 1001 |
| VajraUI 3.0.0-alpha.0 | 600 | 10.000 | [10.00, 11.00] | 29.000 | -3.000 ms | -42.9% [-57.14, -42.86] | slower | 1001 |
| VajraUI 3.0.0-alpha.1 | 600 | 9.000 | [9.00, 9.00] | 29.000 | -2.000 ms | -28.6% [-28.57, -28.57] | slower | 1001 |

### D-theme-switch-trial-total, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 288.500 | [282.00, 313.50] | 373.000 | -197.500 ms | -217.0% [-246.15, -209.19] | slower | n/a |
| StyledComponents | 50 | 107.000 | [104.00, 108.50] | 183.000 | -16.000 ms | -17.6% [-20.00, -14.29] | slower | n/a |
| StyleSheet | 50 | 91.000 | [89.50, 92.00] | 174.000 | baseline | — | — | n/a |
| Tamagui | 50 | 762.500 | [748.00, 771.00] | 807.000 | -671.500 ms | -737.9% [-752.81, -720.43] | slower | n/a |
| twrnc | 50 | 97.500 | [97.00, 99.50] | 178.000 | -6.500 ms | -7.1% [-9.55, -5.43] | slower | n/a |
| VajraUI 3.0.0-alpha.0 | 50 | 132.000 | [131.00, 135.00] | 225.000 | -41.000 ms | -45.1% [-48.35, -43.48] | slower | n/a |
| VajraUI 3.0.0-alpha.1 | 50 | 116.000 | [114.00, 119.00] | 199.000 | -25.000 ms | -27.5% [-31.69, -25.00] | slower | n/a |

### E. Combined theme + variant (per update), 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 600 | 23.000 | [22.00, 24.00] | 61.000 | -16.000 ms | -228.6% [-242.86, -214.29] | slower | 1001 |
| StyledComponents | 600 | 10.000 | [10.00, 10.00] | 15.000 | -3.000 ms | -42.9% [-42.86, -42.86] | slower | 1001 |
| StyleSheet | 600 | 7.000 | [7.00, 7.00] | 13.000 | baseline | — | — | 1001 |
| Tamagui | 600 | 90.000 | [90.00, 91.00] | 144.000 | -83.000 ms | -1185.7% [-1200.00, -1185.71] | slower | 1001 |
| twrnc | 600 | 8.000 | [8.00, 8.00] | 12.000 | -1.000 ms | -14.3% [-14.29, -14.29] | slower | 1001 |
| VajraUI 3.0.0-alpha.0 | 600 | 12.000 | [12.00, 12.00] | 24.000 | -5.000 ms | -71.4% [-71.43, -71.43] | slower | 1001 |
| VajraUI 3.0.0-alpha.1 | 600 | 11.000 | [11.00, 11.00] | 18.000 | -4.000 ms | -57.1% [-57.14, -57.14] | slower | 1001 |

### E-combined-trial-total, 100 cards

| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |
|---|---|---|---|---|---|---|---|---|
| NativeWind | 50 | 284.000 | [278.50, 325.00] | 383.000 | -191.000 ms | -205.4% [-249.46, -199.46] | slower | n/a |
| StyledComponents | 50 | 123.000 | [121.50, 124.50] | 212.000 | -30.000 ms | -32.3% [-35.91, -30.11] | slower | n/a |
| StyleSheet | 50 | 93.000 | [91.00, 94.00] | 182.000 | baseline | — | — | n/a |
| Tamagui | 50 | 1210.500 | [1184.50, 1216.00] | 1307.000 | -1117.500 ms | -1201.6% [-1230.22, -1171.28] | slower | n/a |
| twrnc | 50 | 100.000 | [99.00, 102.50] | 185.000 | -7.000 ms | -7.5% [-11.48, -5.38] | slower | n/a |
| VajraUI 3.0.0-alpha.0 | 50 | 154.500 | [151.00, 161.00] | 235.000 | -61.500 ms | -66.1% [-73.91, -61.70] | slower | n/a |
| VajraUI 3.0.0-alpha.1 | 50 | 138.500 | [135.00, 143.00] | 238.000 | -45.500 ms | -48.9% [-54.59, -44.97] | slower | n/a |

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
- `raw/round-1-tamagui.json` — tamagui, round 1, 410 samples
- `raw/round-1-twrnc.json` — twrnc, round 1, 410 samples
- `raw/round-1-vajra-prev.json` — vajra-prev, round 1, 410 samples
- `raw/round-1-vajra.json` — vajra, round 1, 410 samples
- `raw/round-2-nativewind.json` — nativewind, round 2, 410 samples
- `raw/round-2-styled-components.json` — styled-components, round 2, 410 samples
- `raw/round-2-stylesheet.json` — stylesheet, round 2, 410 samples
- `raw/round-2-tamagui.json` — tamagui, round 2, 410 samples
- `raw/round-2-twrnc.json` — twrnc, round 2, 410 samples
- `raw/round-2-vajra-prev.json` — vajra-prev, round 2, 410 samples
- `raw/round-2-vajra.json` — vajra, round 2, 410 samples
- `raw/round-3-nativewind.json` — nativewind, round 3, 410 samples
- `raw/round-3-styled-components.json` — styled-components, round 3, 410 samples
- `raw/round-3-stylesheet.json` — stylesheet, round 3, 410 samples
- `raw/round-3-tamagui.json` — tamagui, round 3, 410 samples
- `raw/round-3-twrnc.json` — twrnc, round 3, 410 samples
- `raw/round-3-vajra-prev.json` — vajra-prev, round 3, 410 samples
- `raw/round-3-vajra.json` — vajra, round 3, 410 samples
- `raw/round-4-nativewind.json` — nativewind, round 4, 410 samples
- `raw/round-4-styled-components.json` — styled-components, round 4, 410 samples
- `raw/round-4-stylesheet.json` — stylesheet, round 4, 410 samples
- `raw/round-4-tamagui.json` — tamagui, round 4, 410 samples
- `raw/round-4-twrnc.json` — twrnc, round 4, 410 samples
- `raw/round-4-vajra-prev.json` — vajra-prev, round 4, 410 samples
- `raw/round-4-vajra.json` — vajra, round 4, 410 samples
- `raw/round-5-nativewind.json` — nativewind, round 5, 410 samples
- `raw/round-5-styled-components.json` — styled-components, round 5, 410 samples
- `raw/round-5-stylesheet.json` — stylesheet, round 5, 410 samples
- `raw/round-5-tamagui.json` — tamagui, round 5, 410 samples
- `raw/round-5-twrnc.json` — twrnc, round 5, 410 samples
- `raw/round-5-vajra-prev.json` — vajra-prev, round 5, 410 samples
- `raw/round-5-vajra.json` — vajra, round 5, 410 samples
