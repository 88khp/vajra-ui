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
  { id: 'stylesheet', label: 'StyleSheet (hand-written)', ms: { mount: 12, variant: 96, theme: 90.5, combined: 93 } },
  { id: 'twrnc', label: 'twrnc 4.16', ms: { mount: 13, variant: 102.5, theme: 96, combined: 99.5 } },
  { id: 'vajra', label: 'Vajra UI 3.0', isVajra: true, ms: { mount: 16, variant: 103, theme: 117.5, combined: 134.5 } },
  { id: 'styled-components', label: 'styled-components 6.6', ms: { mount: 15, variant: 121, theme: 104, combined: 121 } },
  { id: 'nativewind', label: 'NativeWind 4.2', ms: { mount: 29, variant: 248.5, theme: 305.5, combined: 299 } },
  { id: 'tamagui-compiled', label: 'Tamagui 3.1, compiled', ms: { mount: 57.5, variant: 432, theme: 643.5, combined: 1051 } },
  { id: 'tamagui', label: 'Tamagui 3.1, runtime', ms: { mount: 68, variant: 427.5, theme: 768.5, combined: 1163 } },
];

export const BENCH_RESULTS_URL =
  'https://github.com/88khp/vajra-ui/blob/main/benchmarks/styling/RESULTS.md';
