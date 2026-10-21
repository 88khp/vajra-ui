import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';

import { VajraProvider, defaultVajraTheme } from '../../vajra-theme';
import { Box } from './box';

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

describe('Box', () => {
  it('renders its children', () => {
    render(
      <VajraProvider>
        <Box>
          <RNText>Inside box</RNText>
        </Box>
      </VajraProvider>,
    );

    expect(screen.getByText('Inside box')).toBeTruthy();
  });

  it('resolves a bg token to the theme color value', () => {
    render(
      <VajraProvider>
        <Box testID="box" bg="primary">
          <RNText>content</RNText>
        </Box>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('box').props.style);

    expect(style.backgroundColor).toBe(defaultVajraTheme.light.colors.primary);
  });

  it('resolves a rounded token to the theme rounded value', () => {
    render(
      <VajraProvider>
        <Box testID="box" rounded="r-4">
          <RNText>content</RNText>
        </Box>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('box').props.style);

    expect(style.borderRadius).toBe(defaultVajraTheme.light.rounded['r-4']);
  });

  it('resolves spacing tokens (p, m) to theme spacing values', () => {
    render(
      <VajraProvider>
        <Box testID="box" p="s-4" m="s-2">
          <RNText>content</RNText>
        </Box>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('box').props.style);

    expect(style.padding).toBe(defaultVajraTheme.light.spacing['s-4']);
    expect(style.margin).toBe(defaultVajraTheme.light.spacing['s-2']);
  });

  it('resolves colors against the dark theme when dark colorScheme is used', () => {
    render(
      <VajraProvider colorScheme="dark">
        <Box testID="box" bg="primary">
          <RNText>content</RNText>
        </Box>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('box').props.style);

    expect(style.backgroundColor).toBe(defaultVajraTheme.dark.colors.primary);
  });

  it('shares one style object between Boxes with the same tokens', () => {
    render(
      <VajraProvider>
        <Box testID="first" bg="primary" p="s-4" />
        <Box testID="second" bg="primary" p="s-4" />
      </VajraProvider>,
    );

    expect(screen.getByTestId('second').props.style).toBe(screen.getByTestId('first').props.style);
  });

  it('resolves the same tokens again when the theme changes', () => {
    const { rerender } = render(
      <VajraProvider colorScheme="light">
        <Box testID="box" bg="primary" />
      </VajraProvider>,
    );

    expect(flattenStyle(screen.getByTestId('box').props.style).backgroundColor).toBe(
      defaultVajraTheme.light.colors.primary,
    );

    rerender(
      <VajraProvider colorScheme="dark">
        <Box testID="box" bg="primary" />
      </VajraProvider>,
    );

    expect(flattenStyle(screen.getByTestId('box').props.style).backgroundColor).toBe(
      defaultVajraTheme.dark.colors.primary,
    );
  });
});
