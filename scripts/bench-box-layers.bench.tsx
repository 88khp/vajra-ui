/**
 * Benchmarks the render cost of vajra-ui's Box (styled, wraps
 * @88khp/vajra-ui-core's Box) against the headless CoreBox it wraps and
 * a raw React Native View, at scale.
 *
 * Run with: npx jest --config jest.config.js --testMatch '<rootDir>/scripts/*.bench.tsx' --verbose
 * Results feed docs/PERFORMANCE.md — regenerate that table if this file or
 * the underlying Box implementations change.
 */
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { View } from 'react-native';

import { Box as CoreBox } from '@88khp/vajra-ui-core';
import { Box } from '../src/ui/core/box/box';
import { VajraProvider } from '../src/ui/vajra-theme';

// Capped at 10k: a screen with 10,000 simultaneous sibling nodes is already
// an unrealistic stress case (a long scrollable form or dense list is a few
// hundred to low thousands). Sizes beyond this land in a GC-pressure regime
// where a single Node process mounting/unmounting huge trees repeatedly
// produces noisy, non-representative numbers — not a real per-node cost.
const COUNTS = [100, 1000, 5000, 10000];
const RUNS = 20;

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

const timeMount = (render: () => TestRenderer.ReactTestRenderer): number => {
  let renderer: TestRenderer.ReactTestRenderer;
  const start = performance.now();

  act(() => {
    renderer = render();
  });

  const elapsed = performance.now() - start;

  act(() => {
    renderer.unmount();
  });

  return elapsed;
};

const benchRawView = (count: number): number[] =>
  Array.from({ length: RUNS }, () =>
    timeMount(() =>
      TestRenderer.create(
        <View>
          {Array.from({ length: count }, (_, k) => (
            <View key={k} style={{ padding: 8, borderRadius: 4 }} />
          ))}
        </View>,
      ),
    ),
  );

const benchCoreBox = (count: number): number[] =>
  Array.from({ length: RUNS }, () =>
    timeMount(() =>
      TestRenderer.create(
        <CoreBox>
          {Array.from({ length: count }, (_, k) => (
            <CoreBox key={k} p={8} rounded={4} />
          ))}
        </CoreBox>,
      ),
    ),
  );

const benchStyledBox = (count: number): number[] =>
  Array.from({ length: RUNS }, () =>
    timeMount(() =>
      TestRenderer.create(
        <VajraProvider>
          <Box>
            {Array.from({ length: count }, (_, k) => (
              <Box key={k} p="s-2" rounded="r-1" bg="surface" />
            ))}
          </Box>
        </VajraProvider>,
      ),
    ),
  );

describe('Box layering benchmark', () => {
  it('measures mount time across tree sizes', () => {
    const rows: string[] = [];

    rows.push(
      '| Tree size | Raw View (median ms) | CoreBox (median ms) | Box (median ms) | Box vs View overhead |',
    );
    rows.push('|---|---|---|---|---|');

    for (const count of COUNTS) {
      // Warm up JIT before measuring.
      benchRawView(Math.min(count, 100));
      benchCoreBox(Math.min(count, 100));
      benchStyledBox(Math.min(count, 100));

      const rawMedian = median(benchRawView(count));
      const coreMedian = median(benchCoreBox(count));
      const styledMedian = median(benchStyledBox(count));
      const overheadPerNode = ((styledMedian - rawMedian) / count) * 1000; // µs/node

      rows.push(
        `| ${count} | ${rawMedian.toFixed(2)} | ${coreMedian.toFixed(2)} | ${styledMedian.toFixed(2)} | +${(styledMedian - rawMedian).toFixed(2)}ms total, ${overheadPerNode.toFixed(2)}µs/node |`,
      );
    }

    // eslint-disable-next-line no-console
    console.log('\n' + rows.join('\n') + '\n');
    expect(rows.length).toBe(COUNTS.length + 2);
  }, 120000);
});
