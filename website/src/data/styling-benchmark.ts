// Median ms for 100 cards from benchmarks/styling/results/release-3.0.0/summary.json.
// Switch scenarios are the total of 12 updates in one trial. Lower is faster.
export type TBenchScenario = 'mount' | 'variant' | 'theme' | 'combined';

export type TBenchLibrary = {
  id: string;
  label: string;
  isVajra?: boolean;
  ms: Record<TBenchScenario, number>;
};

export const BENCH_SCENARIOS: { id: TBenchScenario; label: string; description: string }[] = [
  { id: 'variant', label: 'Variant switch', description: 'Every card changes variant, 12 times' },
  { id: 'theme', label: 'Theme switch', description: 'Light and dark flip, 12 times' },
  { id: 'combined', label: 'Theme + variant', description: 'Both at once, 12 times' },
  { id: 'mount', label: 'Mount', description: 'One render of 100 cards' },
];

export const BENCH_LIBRARIES: TBenchLibrary[] = [
  { id: 'stylesheet', label: 'StyleSheet (hand-written)', ms: { mount: 12, variant: 95, theme: 91, combined: 93 } },
  { id: 'twrnc', label: 'twrnc 4.16', ms: { mount: 13, variant: 106, theme: 97, combined: 99.5 } },
  { id: 'vajra', label: 'Vajra UI 3.0.0', isVajra: true, ms: { mount: 17, variant: 103, theme: 121.5, combined: 134.5 } },
  { id: 'styled-components', label: 'styled-components 6.6', ms: { mount: 15, variant: 122.5, theme: 107, combined: 124 } },
  { id: 'nativewind', label: 'NativeWind 4.2', ms: { mount: 30, variant: 257, theme: 279.5, combined: 287 } },
  { id: 'tamagui-compiled', label: 'Tamagui 3.1, compiled', ms: { mount: 60, variant: 445.5, theme: 626.5, combined: 1071 } },
  { id: 'tamagui', label: 'Tamagui 3.1, runtime', ms: { mount: 68, variant: 422.5, theme: 764, combined: 1188.5 } },
];

export const BENCH_RESULTS_URL =
  'https://github.com/88khp/vajra-ui/blob/main/benchmarks/styling/RESULTS.md';
