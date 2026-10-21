# Performance & benchmarks

Vajra UI resolves design tokens at runtime, so you get `bg="primary"` and live theme switching
with no compiler or build step. This page shows what that costs against the other React Native
styling libraries, measured in one run with every library rendering the same card.

The full method, every library's implementation and the raw samples are in
[`benchmarks/styling/`](../benchmarks/styling/). Start with
[RESULTS.md](../benchmarks/styling/RESULTS.md).

## Against other styling libraries

Median ms for 100 cards (a title, a status dot, a description and two buttons). The switch
scenarios are the total of 12 updates. Lower is faster.

| Library | Mount | Variant switch | Theme switch | Theme + variant |
|---|---|---|---|---|
| StyleSheet (hand-written baseline) | 12 | 96 | 90.5 | 93 |
| twrnc 4.16.0 | 13 | 102.5 | 96 | 99.5 |
| **Vajra UI 3.0** | **16** | **103** | **117.5** | **134.5** |
| styled-components 6.6.0 | 15 | 121 | 104 | 121 |
| NativeWind 4.2.7 | 29 | 248.5 | 305.5 | 299 |
| Tamagui 3.1.2, compiled | 57.5 | 432 | 643.5 | 1,051 |
| Tamagui 3.1.2, runtime only | 68 | 427.5 | 768.5 | 1,163 |

- **Variant switching runs at hand-written speed.** Vajra is level with twrnc and within 7% of a
  hand-written `StyleSheet` that precomputes every style. It is 15% faster than styled-components.
- **2.2–2.6× faster than NativeWind** on every update, and 1.8× faster to mount.
- **4–8× faster than Tamagui**, measured with Tamagui's compiler on.
- **Theme switching is where Vajra trails the fastest libraries**: 13% behind styled-components,
  22% behind twrnc and 30% behind StyleSheet, and further behind with theme and variant at once.
  Every `Box`, `Text` and `Pressable` follows the theme on its own, so a theme change re-renders
  each of them. In twrnc only the card re-renders.

3.0 is 9–11% faster than 3.0.0-alpha.0 on every update scenario, with both versions in the same
run.

**How it was measured.** Each library renders the same card, and a parity suite checks that the
rendered host trees, styles, copy and accessibility labels are identical. Each library is used as
its docs describe, and Tamagui is measured both on its runtime path and compiled by its own
compiler. 5 rounds in a seeded random order, each library in its own Jest process, 50 trials per
library per scenario, medians with 95% bootstrap confidence intervals.

These are JavaScript-side timings under Jest (Apple M4, Node 24, React 19.2, React Native 0.84),
not frame times on a phone. They include React render and commit, not native layout or drawing.

## The cost of the token layer

`Box` resolves tokens and renders React Native's `View` directly, with core's cached style
builder. [`scripts/bench-box-layers.bench.tsx`](../scripts/bench-box-layers.bench.tsx) mounts trees
of 100 to 10,000 sibling nodes as raw `View`, as `@88khp/vajra-ui-core`'s `Box` and as
`vajra-ui`'s `Box`, and takes the median of 20 runs each, after a warm-up.

| Tree size | Raw View (median ms) | CoreBox (median ms) | Box (median ms) | Box vs View overhead |
|---|---|---|---|---|
| 100 | 1.00 | 1.00 | 1.00 | +0.00 ms total, 0.00 µs/node |
| 1,000 | 6.00 | 8.00 | 9.00 | +3.00 ms total, 3.00 µs/node |
| 5,000 | 34.00 | 50.50 | 48.00 | +14.00 ms total, 2.80 µs/node |
| 10,000 | 70.00 | 99.50 | 103.00 | +33.00 ms total, 3.30 µs/node |

A token-styled `Box` costs about **3 µs per node** over a raw `View`, and that stays flat from
1,000 to 10,000 nodes. A dense screen with 300 styled nodes spends about 1 ms on it, once, at mount.
Measured on 3.0. Sizes past 10,000 are left out: there, Node's garbage collection dominates.

Reproduce it from the repository root:

```bash
npx jest --config jest.config.js --testMatch '<rootDir>/scripts/*.bench.tsx' --verbose
```
