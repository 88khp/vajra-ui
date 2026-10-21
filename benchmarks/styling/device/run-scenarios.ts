/**
 * Scenarios A–E for one styling implementation, running inside the real app on Hermes.
 *
 * This is the on-device counterpart of scenarios/bench.scenario.tsx. The scenarios,
 * card counts, warm-up and trial loops, correctness check, and sample shape are the same,
 * so scripts/generate-report.js reads both kinds of raw file.
 *
 * What differs from the Jest harness:
 * - Updates go through the real Fabric renderer, not react-test-renderer. The timed window
 *   runs from setState until the last commit of that update has finished, as reported by
 *   the commit hook (device/commit-hook.ts). It includes React render and commit, creating
 *   and cloning shadow nodes, and Yoga layout. It does not include the UI thread mounting
 *   native views or drawing pixels.
 * - An update is "settled" once a frame passes with no further commit, so follow-up
 *   commits that a library schedules from an effect are counted, the way `act` counts
 *   them in Jest.
 * - Heap deltas are not recorded. Hermes in a release build exposes no `gc()`, so a
 *   before/after heap reading would mostly measure when the collector last ran.
 */
import { StyleSheet } from 'react-native';

import {
  colorsFor,
  makeCardData,
  renderCounter,
  stepSequence,
  TBenchCardData,
  TBenchTheme,
  TBenchVariant,
  THEMES,
  VARIANT_ACCENT_TOKEN,
  VARIANTS,
} from '../shared/spec';
import { commitLog, TFiber } from './commit-hook';

export type TBenchConfig = {
  impl: string;
  round: number;
  trials: number;
  warmup: number;
  steps: number;
  mountCounts: number[];
  updateCount: number;
  rerenderCount: number;
};

export type TState = {
  data: TBenchCardData[] | null;
  theme: TBenchTheme;
  variant: TBenchVariant | null;
  tick: number;
};

export type TControl = { set: ((next: TState) => void) | null; current: TState | null };

type TSample = Record<string, string | number | boolean>;

// Fiber tag of a host component (View, Text, ...) in React 19.
const HOST_COMPONENT = 5;
// An update that has not committed after this long is reported as a failure.
const SETTLE_TIMEOUT_MS = 30000;
// Idle time between trials, outside every timed window, so the UI thread can finish mounting.
const IDLE_BETWEEN_TRIALS_MS = 50;

const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/** Waits for the first commit after `before`, then until a whole frame passes with no new commit. */
const settle = async (before: number): Promise<void> => {
  const deadline = performance.now() + SETTLE_TIMEOUT_MS;
  while (commitLog.count === before) {
    if (performance.now() > deadline) throw new Error('Update did not commit before the timeout');
    await nextFrame();
  }
  let seen = -1;
  while (seen !== commitLog.count) {
    seen = commitLog.count;
    await nextFrame();
    await sleep(0);
  }
};

/** Every host component fiber in the current tree, in tree order. */
const hostFibers = (): TFiber[] => {
  const out: TFiber[] = [];
  const stack: TFiber[] = [];
  const root = commitLog.root?.current;
  if (root?.child) stack.push(root.child);
  while (stack.length) {
    const fiber = stack.pop()!;
    if (fiber.tag === HOST_COMPONENT) out.push(fiber);
    if (fiber.sibling) stack.push(fiber.sibling);
    if (fiber.child) stack.push(fiber.child);
  }
  return out;
};

/**
 * Host-node re-renders: host View/Text nodes whose props object is new after a commit. The
 * same definition as the Jest harness, read from the committed fibers instead of the test
 * renderer.
 */
const hostPropsSnapshot = (): object[] => hostFibers().map(f => f.memoizedProps ?? {});

const countHostRerenders = (before: object[]): number => {
  const after = hostPropsSnapshot();
  let changed = Math.abs(after.length - before.length);
  const shared = Math.min(after.length, before.length);
  for (let i = 0; i < shared; i++) {
    if (after[i] !== before[i]) changed += 1;
  }
  return changed;
};

/** Reads the accent color off the first card's status dot. */
const firstAccent = (): string | undefined => {
  const status = hostFibers().find(f => f.memoizedProps?.accessibilityLabel === 'Status: active');
  const style = StyleSheet.flatten(status?.memoizedProps?.style as never) as { backgroundColor?: string } | undefined;
  return style?.backgroundColor;
};

const expectedAccent = (theme: TBenchTheme, variant: TBenchVariant): string =>
  colorsFor(theme)[VARIANT_ACCENT_TOKEN[variant]];

const checkAccent = (where: string, theme: TBenchTheme, variant: TBenchVariant) => {
  const actual = firstAccent();
  const expected = expectedAccent(theme, variant);
  if (actual !== expected) {
    throw new Error(`${where}: first card accent is ${actual}, expected ${expected} (${theme}, ${variant})`);
  }
};

export const runScenarios = async (
  config: TBenchConfig,
  control: TControl,
  onProgress: (label: string) => void,
): Promise<TSample[]> => {
  const { round: ROUND, trials: TRIALS, warmup: WARMUP } = config;
  const samples: TSample[] = [];

  /** Applies a state change and times it until the update has settled. */
  const update = async (next: TState) => {
    const commitsBefore = commitLog.count;
    const start = performance.now();
    control.set!(next);
    await settle(commitsBefore);
    return { ms: commitLog.lastAt - start, commits: commitLog.count - commitsBefore };
  };

  // Status text updates commit too, so each one finishes before the next timed window opens.
  const announce = async (label: string) => {
    onProgress(label);
    await nextFrame();
    await sleep(IDLE_BETWEEN_TRIALS_MS);
  };

  const empty: TState = { data: null, theme: 'light', variant: null, tick: 0 };
  const reset = async () => {
    await update(empty);
    await sleep(IDLE_BETWEEN_TRIALS_MS);
  };

  // A. Initial mount.
  for (const count of config.mountCounts) {
    await announce(`A. mount ${count} cards`);
    const data = makeCardData(count);
    for (let i = 0; i < WARMUP + TRIALS; i++) {
      const { ms, commits } = await update({ data, theme: 'light', variant: null, tick: 0 });
      checkAccent('A-mount', 'light', data[0].variant);
      if (i >= WARMUP) {
        samples.push({ scenario: 'A-mount', count, trial: i - WARMUP, round: ROUND, ms, commits });
      }
      await reset();
    }
  }

  // B. Re-render with no style change: the parent updates an unrelated value.
  {
    await announce(`B. re-render, ${config.rerenderCount} cards`);
    const data = makeCardData(config.rerenderCount);
    await update({ data, theme: 'light', variant: null, tick: 0 });
    for (let i = 0; i < WARMUP + TRIALS; i++) {
      const rendersBefore = renderCounter.count;
      const hostBefore = hostPropsSnapshot();
      const { ms, commits } = await update({ ...control.current!, tick: control.current!.tick + 1 });
      const hostRerenders = countHostRerenders(hostBefore);
      if (i >= WARMUP) {
        samples.push({
          scenario: 'B-rerender-unrelated',
          count: config.rerenderCount,
          trial: i - WARMUP,
          round: ROUND,
          ms,
          commits,
          hostRerenders,
          cardInvocations: renderCounter.count - rendersBefore,
        });
      }
      await sleep(IDLE_BETWEEN_TRIALS_MS);
    }
    await reset();
  }

  // Shared driver for the update scenarios C, D, and E.
  const runUpdateScenario = async (
    scenario: string,
    steps: { theme: TBenchTheme; variant: TBenchVariant }[],
  ) => {
    await announce(`${scenario}, ${config.updateCount} cards`);
    const data = makeCardData(config.updateCount);
    // Mount in a state that differs from step 0, so the first measured update is a real change.
    await update({
      data,
      theme: steps[0].theme === 'light' ? 'dark' : 'light',
      variant: VARIANTS.find(v => v !== steps[0].variant)!,
      tick: 0,
    });

    for (let trial = 0; trial < WARMUP + TRIALS; trial++) {
      const recorded: TSample[] = [];
      let trialMs = 0;
      for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        const step = steps[stepIndex];
        const rendersBefore = renderCounter.count;
        const hostBefore = hostPropsSnapshot();
        const { ms, commits } = await update({ data, theme: step.theme, variant: step.variant, tick: 0 });
        trialMs += ms;
        const hostRerenders = countHostRerenders(hostBefore);
        checkAccent(scenario, step.theme, step.variant);
        recorded.push({
          scenario,
          count: config.updateCount,
          trial: trial - WARMUP,
          step: stepIndex,
          round: ROUND,
          ms,
          commits,
          hostRerenders,
          cardInvocations: renderCounter.count - rendersBefore,
          theme: step.theme,
          variant: step.variant,
        });
      }
      if (trial >= WARMUP) {
        samples.push(...recorded);
        samples.push({
          scenario: `${scenario}-trial-total`,
          count: config.updateCount,
          trial: trial - WARMUP,
          round: ROUND,
          ms: trialMs,
        });
      }
      await sleep(IDLE_BETWEEN_TRIALS_MS);
    }
    await reset();
  };

  // C. Variant switching: the theme stays fixed and the variant cycles deterministically.
  await runUpdateScenario(
    'C-variant-switch',
    stepSequence(config.steps).map(s => ({ theme: 'light' as const, variant: s.variant })),
  );

  // D. Theme switching: the variant stays fixed and the theme alternates.
  await runUpdateScenario(
    'D-theme-switch',
    stepSequence(config.steps).map((_, i) => ({ theme: THEMES[i % THEMES.length], variant: 'primary' as const })),
  );

  // E. Combined: theme and variant both change on every step.
  await runUpdateScenario('E-combined', stepSequence(config.steps));

  return samples;
};
