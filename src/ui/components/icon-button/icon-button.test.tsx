import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import { VajraProvider, defaultVajraTheme } from '../../vajra-theme';
import { IconButton } from './icon-button';
import { TVajraIconComponent } from './icon-button-types';

const TestIcon: TVajraIconComponent = ({ size, color }) => (
  <View testID="test-icon" accessibilityLabel={`icon-${size}-${color}`} />
);

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

describe('IconButton', () => {
  it('renders the given icon', () => {
    render(
      <VajraProvider>
        <IconButton icon={TestIcon} onPress={() => {}} />
      </VajraProvider>,
    );

    expect(screen.getByTestId('test-icon')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();

    render(
      <VajraProvider>
        <IconButton testID="icon-button" icon={TestIcon} onPress={onPress} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('icon-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('resolves solid variant bg to the theme primary color', () => {
    render(
      <VajraProvider>
        <IconButton testID="icon-button" icon={TestIcon} onPress={() => {}} variant="solid" />
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('icon-button').props.style);

    expect(style.backgroundColor).toBe(defaultVajraTheme.light.colors.primary);
  });

  it('passes the resolved md size icon color to the icon (textInverse for solid)', () => {
    render(
      <VajraProvider>
        <IconButton icon={TestIcon} onPress={() => {}} variant="solid" size="md" />
      </VajraProvider>,
    );

    expect(
      screen.getByLabelText(`icon-24-${defaultVajraTheme.light.colors.textInverse}`),
    ).toBeTruthy();
  });

  it('does not call onPress when isDisabled', () => {
    const onPress = jest.fn();

    render(
      <VajraProvider>
        <IconButton testID="icon-button" icon={TestIcon} onPress={onPress} isDisabled />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('icon-button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('IconButton isPill', () => {
  it('uses a fully rounded corner when isPill is set', () => {
    render(
      <VajraProvider>
        <IconButton testID="icon-button" icon={TestIcon} isPill />
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('icon-button').props.style);

    expect(style.borderRadius).toBe(defaultVajraTheme.light.rounded['r-full']);
  });
});
