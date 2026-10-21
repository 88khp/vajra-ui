import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';

import { VajraProvider, defaultVajraTheme } from '../../vajra-theme';
import { Pressable } from './pressable';

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

describe('Pressable', () => {
  it('renders its children', () => {
    render(
      <VajraProvider>
        <Pressable>
          <RNText>press me</RNText>
        </Pressable>
      </VajraProvider>,
    );

    expect(screen.getByText('press me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();

    render(
      <VajraProvider>
        <Pressable testID="pressable" onPress={onPress}>
          <RNText>press me</RNText>
        </Pressable>
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('pressable'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('resolves bg and rounded tokens to theme values', () => {
    render(
      <VajraProvider>
        <Pressable testID="pressable" bg="primary" rounded="r-2">
          <RNText>content</RNText>
        </Pressable>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('pressable').props.style);

    expect(style.backgroundColor).toBe(defaultVajraTheme.light.colors.primary);
    expect(style.borderRadius).toBe(defaultVajraTheme.light.rounded['r-2']);
  });

  it('does not forward activeOpacity to the native Pressable', () => {
    render(
      <VajraProvider>
        <Pressable testID="pressable" activeOpacity={0.5}>
          <RNText>content</RNText>
        </Pressable>
      </VajraProvider>,
    );

    expect(screen.getByTestId('pressable').props).not.toHaveProperty('activeOpacity');
  });
});
