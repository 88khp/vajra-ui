import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import type { TImplementationModule } from '../implementations';
import type { TBenchTheme, TBenchVariant } from '../shared/spec';
import { normalizeTree, TNormalizedNode } from './normalize';

export const SAMPLE_PROPS = {
  title: 'Project 1',
  description: 'Keeps the deployment pipeline healthy and reports failures in one place.',
};

/** Renders one card for a given implementation, theme and variant, and returns its normalized host tree. */
export const renderCard = (
  impl: TImplementationModule,
  theme: TBenchTheme,
  variant: TBenchVariant,
  handlers: { onPrimaryPress?: () => void; onSecondaryPress?: () => void } = {},
): { nodes: TNormalizedNode[]; renderer: TestRenderer.ReactTestRenderer } => {
  const { BenchmarkCard, Provider } = impl;
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(
      <Provider theme={theme}>
        <BenchmarkCard
          {...SAMPLE_PROPS}
          variant={variant}
          onPrimaryPress={handlers.onPrimaryPress ?? (() => {})}
          onSecondaryPress={handlers.onSecondaryPress ?? (() => {})}
        />
      </Provider>,
    );
  });
  return { nodes: normalizeTree(renderer.toJSON()), renderer };
};
