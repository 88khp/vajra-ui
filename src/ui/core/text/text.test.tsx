import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { VajraProvider, defaultVajraTheme, createVajraTheme } from '../../vajra-theme';
import { Text } from './text';

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

describe('Text', () => {
  it('renders its text content', () => {
    render(
      <VajraProvider>
        <Text>Hello world</Text>
      </VajraProvider>,
    );

    expect(screen.getByText('Hello world')).toBeTruthy();
  });

  it('defaults to the body variant font size and the theme default text color', () => {
    render(
      <VajraProvider>
        <Text>Body text</Text>
      </VajraProvider>,
    );

    const element = screen.getByText('Body text');
    const style = flattenStyle(element.props.style);

    expect(style.fontSize).toBe(defaultVajraTheme.light.typography.body.fontSize);
    expect(style.color).toBe(defaultVajraTheme.light.colors.text);
  });

  it('resolves the h1 variant to its theme font size and weight', () => {
    render(
      <VajraProvider>
        <Text variant="h1">Heading</Text>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByText('Heading').props.style);

    expect(style.fontSize).toBe(defaultVajraTheme.light.typography.h1.fontSize);
    expect(style.fontWeight).toBe(defaultVajraTheme.light.typography.h1.fontWeight);
  });

  it('resolves a color token to the theme color value', () => {
    render(
      <VajraProvider>
        <Text color="primary">Colored text</Text>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByText('Colored text').props.style);

    expect(style.color).toBe(defaultVajraTheme.light.colors.primary);
  });

  it('resolves an explicit fontSize token over the variant default', () => {
    render(
      <VajraProvider>
        <Text fontSize="f-6">Big text</Text>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByText('Big text').props.style);

    expect(style.fontSize).toBe(defaultVajraTheme.light.fontSizes['f-6']);
  });
});

describe('Text font resolution', () => {
  const fonts = {
    Inter: { '400': 'Inter-Regular', '600': 'Inter-SemiBold', '700': 'Inter-Bold' },
  };

  it('applies the theme default font at the variant weight', () => {
    const theme = createVajraTheme({ fonts, defaultFont: 'Inter' });

    render(
      <VajraProvider theme={theme}>
        <Text variant="h2">Title</Text>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByText('Title').props.style);

    expect(style.fontFamily).toBe('Inter-SemiBold');
    expect(style.fontWeight).toBeUndefined();
  });

  it('uses the variant weight when a font prop is passed', () => {
    const theme = createVajraTheme({ fonts });

    // IVajraFonts is an empty augmentation point, so the font key needs a cast here.
    render(
      <VajraProvider theme={theme}>
        <Text variant="h1" font={'Inter' as never}>
          Heading
        </Text>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByText('Heading').props.style);

    expect(style.fontFamily).toBe('Inter-Bold');
  });

  it('lets an explicit fontWeight override the variant weight', () => {
    const theme = createVajraTheme({ fonts, defaultFont: 'Inter' });

    render(
      <VajraProvider theme={theme}>
        <Text variant="h1" fontWeight="400">
          Light
        </Text>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByText('Light').props.style);

    expect(style.fontFamily).toBe('Inter-Regular');
  });

  it('applies the fontVariant from the variant definition', () => {
    const theme = createVajraTheme({
      fonts,
      typography: {
        body: { ...defaultVajraTheme.light.typography.body, fontVariant: ['tabular-nums'] },
      },
    });

    render(
      <VajraProvider theme={theme}>
        <Text>$12.00</Text>
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByText('$12.00').props.style);

    expect(style.fontVariant).toEqual(['tabular-nums']);
  });
});
