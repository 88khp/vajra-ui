import React from 'react';
import { Animated } from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';

import { VajraProvider } from '../../vajra-theme';
import { Switch } from './switch';

// SwitchIndicator animates its track color via Animated.timing on mount/update.
// Flushing the animation clock inside act() keeps assertions synchronous and
// avoids the "not wrapped in act(...)" warning without touching component code.
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  act(() => {
    jest.runOnlyPendingTimers();
  });
  jest.useRealTimers();
});

describe('Switch', () => {
  it('renders labels for each item', () => {
    render(
      <VajraProvider>
        <Switch.Root value="a" onChange={() => {}}>
          <Switch.Item value="a" label="Option A" />
          <Switch.Item value="b" label="Option B" />
        </Switch.Root>
      </VajraProvider>,
    );

    expect(screen.getByText('Option A')).toBeTruthy();
    expect(screen.getByText('Option B')).toBeTruthy();
  });

  it('calls onChange with the pressed item value', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <Switch.Root value="a" onChange={onChange}>
          <Switch.Item value="a" label="Option A" />
          <Switch.Item value="b" label="Option B" />
        </Switch.Root>
      </VajraProvider>,
    );

    fireEvent.press(screen.getByText('Option B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onChange when the root is disabled', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <Switch.Root value="a" onChange={onChange} isDisabled>
          <Switch.Item value="a" label="Option A" />
          <Switch.Item value="b" label="Option B" />
        </Switch.Root>
      </VajraProvider>,
    );

    fireEvent.press(screen.getByText('Option B'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('moves the thumb toward the "on" position when the item becomes selected', () => {
    const { UNSAFE_getAllByType, rerender } = render(
      <VajraProvider>
        <Switch.Root value="b" onChange={() => {}}>
          <Switch.Item value="a" label="Option A" />
        </Switch.Root>
      </VajraProvider>,
    );

    const [thumb] = UNSAFE_getAllByType(Animated.View).slice(-1);
    const getAnimatedValue = (value: Animated.AnimatedInterpolation<number>): number =>
      (value as unknown as { __getValue: () => number }).__getValue();

    const offTranslateX = getAnimatedValue(thumb.props.style.transform[0].translateX);

    rerender(
      <VajraProvider>
        <Switch.Root value="a" onChange={() => {}}>
          <Switch.Item value="a" label="Option A" />
        </Switch.Root>
      </VajraProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const [thumbAfter] = UNSAFE_getAllByType(Animated.View).slice(-1);
    const onTranslateX = getAnimatedValue(thumbAfter.props.style.transform[0].translateX);

    expect(onTranslateX).toBeGreaterThan(offTranslateX);
  });
});

describe('Switch toggle', () => {
  it('calls onChange with the negated value when pressed', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <Switch value={false} onChange={onChange} label="Notifications" />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByText('Notifications'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <Switch value onChange={onChange} label="Locked" isDisabled />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByText('Locked'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
