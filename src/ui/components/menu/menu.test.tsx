import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Animated, View } from 'react-native';

import { VajraProvider, defaultVajraTheme } from '../../vajra-theme';
import { Menu } from './menu';
import { TVajraIconComponent } from '../icon-button/icon-button-types';

// Menu renders inside Sheet, which fades its backdrop via Animated.timing
// with useNativeDriver: true — not supported by this test environment's
// react-native / react-test-renderer combo. Stub it, same pattern used by
// modal.test.tsx / sheet.test.tsx / select.test.tsx.
jest.spyOn(Animated, 'timing').mockReturnValue({
  start: () => {},
  stop: () => {},
  reset: () => {},
} as unknown as Animated.CompositeAnimation);
jest.spyOn(Animated, 'spring').mockReturnValue({
  start: () => {},
  stop: () => {},
  reset: () => {},
} as unknown as Animated.CompositeAnimation);

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

describe('Menu', () => {
  it('renders no actions when not visible', () => {
    render(
      <VajraProvider>
        <Menu
          isVisible={false}
          onClose={() => {}}
          actions={[{ label: 'Edit', onPress: () => {} }]}
        />
      </VajraProvider>,
    );

    expect(screen.queryByText('Edit')).toBeNull();
  });

  it('renders each action label when visible', () => {
    render(
      <VajraProvider>
        <Menu
          isVisible
          onClose={() => {}}
          actions={[
            { label: 'Edit', onPress: () => {} },
            { label: 'Delete', onPress: () => {}, isDestructive: true },
          ]}
        />
      </VajraProvider>,
    );

    expect(screen.getByText('Edit')).toBeTruthy();
    expect(screen.getByText('Delete')).toBeTruthy();
  });

  it('renders the title when provided', () => {
    render(
      <VajraProvider>
        <Menu
          isVisible
          onClose={() => {}}
          title="Actions"
          actions={[{ label: 'Edit', onPress: () => {} }]}
        />
      </VajraProvider>,
    );

    expect(screen.getByText('Actions')).toBeTruthy();
  });

  it('calls the action onPress and onClose when an action is pressed', () => {
    const onPress = jest.fn();
    const onClose = jest.fn();

    render(
      <VajraProvider>
        <Menu isVisible onClose={onClose} actions={[{ label: 'Edit', onPress }]} testID="menu" />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('menu-action-0'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress for a disabled action', () => {
    const onPress = jest.fn();

    render(
      <VajraProvider>
        <Menu
          isVisible
          onClose={() => {}}
          actions={[{ label: 'Edit', onPress, isDisabled: true }]}
          testID="menu"
        />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('menu-action-0'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('resolves a destructive action label to the theme error color', () => {
    render(
      <VajraProvider>
        <Menu
          isVisible
          onClose={() => {}}
          actions={[{ label: 'Delete', onPress: () => {}, isDestructive: true }]}
        />
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByText('Delete').props.style);

    expect(style.color).toBe(defaultVajraTheme.light.colors.error);
  });
});

describe('Menu icon components', () => {
  const ActionIcon: TVajraIconComponent = ({ color }) => (
    <View testID="action-icon" accessibilityLabel={color} />
  );

  it('colors a destructive action icon with the error color', () => {
    render(
      <VajraProvider>
        <Menu
          isVisible
          onClose={() => {}}
          actions={[{ label: 'Delete', onPress: () => {}, icon: ActionIcon, isDestructive: true }]}
        />
      </VajraProvider>,
    );

    expect(screen.getByTestId('action-icon').props.accessibilityLabel).toBe(
      defaultVajraTheme.light.colors.error,
    );
  });

  it('colors a regular action icon with the text color', () => {
    render(
      <VajraProvider>
        <Menu
          isVisible
          onClose={() => {}}
          actions={[{ label: 'Edit', onPress: () => {}, icon: ActionIcon }]}
        />
      </VajraProvider>,
    );

    expect(screen.getByTestId('action-icon').props.accessibilityLabel).toBe(
      defaultVajraTheme.light.colors.text,
    );
  });
});
