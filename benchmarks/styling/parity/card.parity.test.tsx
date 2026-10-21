/**
 * Visual and behavioral parity for the six BenchmarkCard implementations.
 *
 * 1. The StyleSheet baseline must match the spec-derived expected tree.
 * 2. Every Jest-runnable implementation must match the baseline's normalized host tree
 *    for every theme × variant combination.
 * 3. Pressing each button must call the matching handler exactly once.
 *
 * Implementations that need a native runtime (see IMPLEMENTATIONS) are reported as
 * skipped. They are verified on a simulator build instead (see README.md).
 */
import { fireEvent, render, screen } from '@testing-library/react-native';

import { findImplementation, IMPLEMENTATIONS, TImplementationMeta } from '../implementations';
import { THEMES, VARIANTS, TBenchTheme, TBenchVariant } from '../shared/spec';
import { expectedCardNodes } from './expected';
import { prepareImplementation } from '../harness/prepare-implementation';
import { renderCard, SAMPLE_PROPS } from './render-card';

const baseline = findImplementation('stylesheet').load();
const combos = THEMES.flatMap(theme => VARIANTS.map(variant => ({ theme, variant })));

describe('baseline matches the spec', () => {
  it.each(combos)('stylesheet $theme / $variant', ({ theme, variant }: { theme: TBenchTheme; variant: TBenchVariant }) => {
    const { nodes, renderer } = renderCard(baseline, theme, variant);
    expect(nodes).toEqual(expectedCardNodes(theme, variant, SAMPLE_PROPS.title));
    renderer.unmount();
  });
});

describe.each(IMPLEMENTATIONS.filter(i => i.id !== 'stylesheet'))('$label', (meta: TImplementationMeta) => {
  if (!meta.jestRunnable) {
    it.skip('requires a native runtime; verified on a simulator build', () => {});
    return;
  }

  beforeAll(() => prepareImplementation(meta.id));

  it.each(combos)('$theme / $variant matches the StyleSheet baseline', ({ theme, variant }) => {
    const reference = renderCard(baseline, theme, variant);
    const candidate = renderCard(meta.load(), theme, variant);
    expect(candidate.nodes).toEqual(reference.nodes);
    reference.renderer.unmount();
    candidate.renderer.unmount();
  });

  it('routes presses to the matching handler exactly once', () => {
    const mod = meta.load();
    const onPrimaryPress = jest.fn();
    const onSecondaryPress = jest.fn();
    const { BenchmarkCard, Provider } = mod;
    render(
      <Provider theme="light">
        <BenchmarkCard
          {...SAMPLE_PROPS}
          variant="primary"
          onPrimaryPress={onPrimaryPress}
          onSecondaryPress={onSecondaryPress}
        />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText(`${SAMPLE_PROPS.title} primary action`));
    expect(onPrimaryPress).toHaveBeenCalledTimes(1);
    expect(onSecondaryPress).not.toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText(`${SAMPLE_PROPS.title} secondary action`));
    expect(onSecondaryPress).toHaveBeenCalledTimes(1);
    expect(onPrimaryPress).toHaveBeenCalledTimes(1);
  });
});
