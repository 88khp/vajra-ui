/**
 * JavaScript-side benchmark scenarios A–E for one styling implementation.
 *
 * One implementation runs per Jest process (selected with BENCH_IMPL), so global state
 * from one library (Tamagui's config, NativeWind's registered CSS) cannot leak into
 * another library's numbers. scripts/run-benchmark.js handles ordering and rounds.
 *
 * What this measures: React render and commit cost under react-test-renderer on the
 * host machine. It does NOT measure native layout, paint, or display time. Those need a
 * simulator or device build. See README.md.
 *
 * Scenario F (FlatList scrolling) is not implemented here. It needs a real native list.
 */
import fs from 'fs';
import path from 'path';
import v8 from 'v8';
import vm from 'vm';

import React, { memo, Profiler, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';

import { findImplementation, TImplementationModule } from '../implementations';
import { prepareImplementation } from '../harness/prepare-implementation';
import {
  makeCardData,
  renderCounter,
  stepSequence,
  TBenchCardData,
  TBenchTheme,
  TBenchVariant,
  THEMES,
  VARIANT_ACCENT_TOKEN,
  VARIANTS,
  colorsFor,
} from '../shared/spec';

// Exposed by the runner via `node --expose-gc`. This gives the test VM a real `gc`.
const gc: () => void = vm.runInNewContext('gc');

const env = (name: string, fallback: string): string => process.env[name] ?? fallback;
const IMPL_ID = env('BENCH_IMPL', '');
const OUT_FILE = env('BENCH_OUT', '');
const ROUND = Number(env('BENCH_ROUND', '0'));
const TRIALS = Number(env('BENCH_TRIALS', '30'));
const WARMUP = Number(env('BENCH_WARMUP', '5'));
const STEPS = Number(env('BENCH_STEPS', '12'));

// BENCH_SMOKE=1 runs every scenario at 100 cards, for a quick check that each library works.
const SMOKE = env('BENCH_SMOKE', '') === '1';
const MOUNT_COUNTS = SMOKE ? [100] : [200, 500, 2000];
const UPDATE_COUNT = SMOKE ? 100 : 1000;
const RERENDER_COUNT = SMOKE ? 100 : 1000;

const noop = () => {};

type TState = { theme: TBenchTheme; variant: TBenchVariant | null; tick: number };

type TControl = { set: ((next: TState) => void) | null; current: TState | null };

type TSample = Record<string, string | number | boolean>;

const samples: TSample[] = [];

const timed = (fn: () => void): number => {
  const start = performance.now();
  fn();
  return performance.now() - start;
};

/**
 * Builds the component tree once per implementation. Every scenario uses the same
 * Root, Screen, and Profiler, so the only thing that differs between libraries is the
 * styling code inside BenchmarkCard and Provider.
 */
const buildRoot = (impl: TImplementationModule) => {
  const { Provider, BenchmarkCard } = impl;

  const Screen = memo(function Screen({
    data,
    variant,
  }: {
    data: TBenchCardData[];
    variant: TBenchVariant | null;
  }) {
    return (
      <>
        {data.map(item => (
          <BenchmarkCard
            key={item.id}
            title={item.title}
            description={item.description}
            variant={variant ?? item.variant}
            onPrimaryPress={noop}
            onSecondaryPress={noop}
          />
        ))}
      </>
    );
  });

  const Root = ({
    data,
    initial,
    control,
    onCommit,
  }: {
    data: TBenchCardData[];
    initial: TState;
    control: TControl;
    onCommit: () => void;
  }) => {
    const [state, setState] = useState<TState>(initial);
    control.set = setState;
    control.current = state;

    return (
      <Profiler id="cards" onRender={onCommit}>
        <Provider theme={state.theme}>
          <Text>{`tick ${state.tick}`}</Text>
          <Screen data={data} variant={state.variant} />
        </Provider>
      </Profiler>
    );
  };

  return Root;
};

/** Reads the accent color off the first card's status dot. */
const firstAccent = (renderer: TestRenderer.ReactTestRenderer): string | undefined => {
  const status = renderer.root.findAll(
    node => typeof node.type === 'string' && node.props.accessibilityLabel === 'Status: active',
  )[0];
  return (StyleSheet.flatten(status.props.style) as { backgroundColor?: string }).backgroundColor;
};

/**
 * Host-node re-renders: the number of host View/Text nodes whose props object is new after
 * a commit. Every implementation renders the same host tree, so this count is comparable
 * across libraries even when a library reads context inside its children.
 */
const hostPropsSnapshot = (renderer: TestRenderer.ReactTestRenderer): object[] =>
  renderer.root.findAll(node => typeof node.type === 'string').map(node => node.props);

const countHostRerenders = (before: object[], renderer: TestRenderer.ReactTestRenderer): number => {
  const after = hostPropsSnapshot(renderer);
  let changed = Math.abs(after.length - before.length);
  const shared = Math.min(after.length, before.length);
  for (let i = 0; i < shared; i++) {
    if (after[i] !== before[i]) changed += 1;
  }
  return changed;
};

const expectedAccent = (theme: TBenchTheme, variant: TBenchVariant): string =>
  colorsFor(theme)[VARIANT_ACCENT_TOKEN[variant]];

const mountTree = (
  Root: ReturnType<typeof buildRoot>,
  data: TBenchCardData[],
  control: TControl,
  counters: { commits: number },
  initial: TState,
): TestRenderer.ReactTestRenderer => {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(
      <Root
        data={data}
        initial={initial}
        control={control}
        onCommit={() => {
          counters.commits += 1;
        }}
      />,
    );
  });
  return renderer;
};

/**
 * React Native's Jest mocks record every call they receive (arguments included), so the
 * record grows with every node ever rendered. That grows the heap about 45 MB per
 * 2,000-card mount, without bound. Clearing the records after each trial keeps the heap
 * flat, and it is done identically for every implementation.
 */
const releaseHarnessRecords = (): void => {
  jest.clearAllMocks();
};

const heapUsed = (): number => {
  gc();
  return process.memoryUsage().heapUsed;
};

describe(`styling benchmark: ${IMPL_ID}`, () => {
  let impl: TImplementationModule;
  let Root: ReturnType<typeof buildRoot>;

  beforeAll(async () => {
    if (!IMPL_ID) throw new Error('BENCH_IMPL is required');
    await prepareImplementation(IMPL_ID);
    impl = findImplementation(IMPL_ID).load();
    Root = buildRoot(impl);
  });

  afterAll(() => {
    if (!OUT_FILE) return;
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(
      OUT_FILE,
      JSON.stringify(
        {
          impl: IMPL_ID,
          round: ROUND,
          trials: TRIALS,
          warmup: WARMUP,
          steps: STEPS,
          heapLimitMB: Math.round(v8.getHeapStatistics().heap_size_limit / 1048576),
          collectedAt: new Date().toISOString(),
          samples,
        },
        null,
        2,
      ),
    );
  });

  // A. Initial mount: React commit time and JS heap after stabilization.
  describe.each(MOUNT_COUNTS)('A. mount %i cards', count => {
    it('measures commit time and heap', () => {
      const data = makeCardData(count);
      for (let i = 0; i < WARMUP + TRIALS; i++) {
        const control: TControl = { set: null, current: null };
        const counters = { commits: 0 };
        const before = heapUsed();
        let renderer: TestRenderer.ReactTestRenderer | undefined;
        const mountMs = timed(() => {
          renderer = mountTree(Root, data, control, counters, {
            theme: 'light',
            variant: null,
            tick: 0,
          });
        });
        const heapDeltaBytes = heapUsed() - before;

        expect(firstAccent(renderer!)).toBe(expectedAccent('light', data[0].variant));

        if (i >= WARMUP) {
          samples.push({
            scenario: 'A-mount',
            count,
            trial: i - WARMUP,
            round: ROUND,
            ms: mountMs,
            commits: counters.commits,
            heapDeltaBytes,
          });
        }
        act(() => renderer!.unmount());
        releaseHarnessRecords();
      }
    });
  });

  // B. Re-render with no style change: parent updates an unrelated value.
  describe(`B. re-render, ${RERENDER_COUNT} cards, styles unchanged`, () => {
    it('measures re-render cost and card renders', () => {
      const data = makeCardData(RERENDER_COUNT);
      const control: TControl = { set: null, current: null };
      const counters = { commits: 0 };
      const renderer = mountTree(Root, data, control, counters, {
        theme: 'light',
        variant: null,
        tick: 0,
      });
      for (let i = 0; i < WARMUP + TRIALS; i++) {
        const commitsBefore = counters.commits;
        const rendersBefore = renderCounter.count;
        const hostBefore = hostPropsSnapshot(renderer);
        const ms = timed(() => {
          act(() => control.set!({ ...control.current!, tick: control.current!.tick + 1 }));
        });
        const hostRerenders = countHostRerenders(hostBefore, renderer);
        if (i >= WARMUP) {
          samples.push({
            scenario: 'B-rerender-unrelated',
            count: RERENDER_COUNT,
            trial: i - WARMUP,
            round: ROUND,
            ms,
            commits: counters.commits - commitsBefore,
            hostRerenders,
            cardInvocations: renderCounter.count - rendersBefore,
          });
        }
      }
      act(() => renderer.unmount());
      releaseHarnessRecords();
    });
  });

  // Shared driver for the update scenarios C, D, and E.
  const runUpdateScenario = (
    scenario: string,
    steps: { theme: TBenchTheme; variant: TBenchVariant }[],
  ) => {
    const data = makeCardData(UPDATE_COUNT);
    const control: TControl = { set: null, current: null };
    const counters = { commits: 0 };
    // Mount in a state that differs from step 0, so the first measured update is a real change
    // and not a no-op that React bails out of.
    const renderer = mountTree(Root, data, control, counters, {
      theme: steps[0].theme === 'light' ? 'dark' : 'light',
      variant: VARIANTS.find(v => v !== steps[0].variant)!,
      tick: 0,
    });

    for (let trial = 0; trial < WARMUP + TRIALS; trial++) {
      const recorded: TSample[] = [];
      let trialMs = 0;

      steps.forEach((step, stepIndex) => {
        const commitsBefore = counters.commits;
        const rendersBefore = renderCounter.count;
        const hostBefore = hostPropsSnapshot(renderer);
        const ms = timed(() => {
          act(() => control.set!({ theme: step.theme, variant: step.variant, tick: 0 }));
        });
        trialMs += ms;
        const hostRerenders = countHostRerenders(hostBefore, renderer);

        // Correctness check, kept outside the timed window. The first card's accent must
        // match the requested theme and variant after every update.
        expect(firstAccent(renderer)).toBe(expectedAccent(step.theme, step.variant));

        recorded.push({
          scenario,
          count: UPDATE_COUNT,
          trial: trial - WARMUP,
          step: stepIndex,
          round: ROUND,
          ms,
          commits: counters.commits - commitsBefore,
          hostRerenders,
          cardInvocations: renderCounter.count - rendersBefore,
          theme: step.theme,
          variant: step.variant,
        });
      });

      releaseHarnessRecords();
      if (trial >= WARMUP) {
        samples.push(...recorded);
        samples.push({
          scenario: `${scenario}-trial-total`,
          count: UPDATE_COUNT,
          trial: trial - WARMUP,
          round: ROUND,
          ms: trialMs,
        });
      }
    }
    act(() => renderer.unmount());
    releaseHarnessRecords();
  };

  // C. Variant switching: the theme stays fixed and the variant cycles deterministically.
  it(`C. variant switching, ${UPDATE_COUNT} cards`, () => {
    const steps = stepSequence(STEPS).map(s => ({ theme: 'light' as const, variant: s.variant }));
    runUpdateScenario('C-variant-switch', steps);
  });

  // D. Theme switching: the variant stays fixed and the theme alternates.
  it(`D. theme switching, ${UPDATE_COUNT} cards`, () => {
    const steps = stepSequence(STEPS).map((s, i) => ({
      theme: THEMES[i % THEMES.length],
      variant: 'primary' as const,
    }));
    runUpdateScenario('D-theme-switch', steps);
  });

  // E. Combined: theme and variant both change on every step.
  it(`E. combined theme + variant, ${UPDATE_COUNT} cards`, () => {
    runUpdateScenario('E-combined', stepSequence(STEPS));
  });
});
