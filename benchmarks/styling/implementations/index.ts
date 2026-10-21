/**
 * Registry of the six BenchmarkCard implementations.
 *
 * Each module is loaded lazily. Unistyles needs its native runtime and must not be
 * required from a Jest run that does not use it. `jestRunnable` marks implementations
 * that execute under the Jest harness. The rest are verified on a simulator or device
 * build (see README.md).
 */
import type { TBenchCardProps, TBenchTheme } from '../shared/spec';

export type TImplementationModule = {
  Provider: (props: { theme: TBenchTheme; children: React.ReactNode }) => React.ReactElement;
  BenchmarkCard: React.ComponentType<TBenchCardProps>;
};

export type TImplementationMeta = {
  id: string;
  label: string;
  jestRunnable: boolean;
  load: () => TImplementationModule;
};

export const IMPLEMENTATIONS: TImplementationMeta[] = [
  {
    id: 'stylesheet',
    label: 'StyleSheet',
    jestRunnable: true,
    load: () => require('./stylesheet/benchmark-card'),
  },
  {
    id: 'vajra',
    label: 'VajraUI',
    jestRunnable: true,
    load: () => require('./vajra/benchmark-card'),
  },
  {
    // Same card as `vajra`, run against the earlier version installed as
    // @88khp/vajra-ui-prev, through jest.config.js's alias mapping.
    id: 'vajra-prev',
    label: 'VajraUI (previous)',
    jestRunnable: true,
    load: () => require('./vajra/benchmark-card'),
  },
  {
    id: 'nativewind',
    label: 'NativeWind',
    jestRunnable: true,
    load: () => require('./nativewind/benchmark-card'),
  },
  {
    id: 'unistyles',
    label: 'Unistyles',
    jestRunnable: false,
    load: () => require('./unistyles/benchmark-card'),
  },
  {
    id: 'tamagui',
    label: 'Tamagui',
    jestRunnable: true,
    load: () => require('./tamagui/benchmark-card'),
  },
  {
    id: 'styled-components',
    label: 'StyledComponents',
    jestRunnable: true,
    load: () => require('./styled-components/benchmark-card'),
  },
  {
    id: 'twrnc',
    label: 'twrnc',
    jestRunnable: true,
    load: () => require('./twrnc/benchmark-card'),
  },
];

export const findImplementation = (id: string): TImplementationMeta => {
  const meta = IMPLEMENTATIONS.find(i => i.id === id);
  if (!meta) throw new Error(`Unknown implementation: ${id}`);
  return meta;
};
