import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Animated, Text as RNText } from 'react-native';

import { VajraProvider } from '../../vajra-theme';
import { Drawer } from './drawer';

// Drawer composes Modal (backdrop fade via Animated.timing) and its own drag
// handle (Animated.spring on release). Both use useNativeDriver: true, which
// the installed react-native / react-test-renderer combo can't connect to in
// this test environment. Stub both, same pattern as sheet.test.tsx.
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

describe('Drawer', () => {
  it('renders its children when visible', () => {
    render(
      <VajraProvider>
        <Drawer isVisible onClose={() => {}}>
          <RNText>Drawer content</RNText>
        </Drawer>
      </VajraProvider>,
    );

    expect(screen.getByText('Drawer content')).toBeTruthy();
  });

  it('does not render its content when not visible', () => {
    render(
      <VajraProvider>
        <Drawer isVisible={false} onClose={() => {}}>
          <RNText>Drawer content</RNText>
        </Drawer>
      </VajraProvider>,
    );

    expect(screen.queryByText('Drawer content')).toBeNull();
  });

  it('calls onClose when the backdrop is pressed by default', () => {
    const onClose = jest.fn();

    render(
      <VajraProvider>
        <Drawer isVisible onClose={onClose} testID="drawer">
          <RNText>Drawer content</RNText>
        </Drawer>
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('drawer-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
