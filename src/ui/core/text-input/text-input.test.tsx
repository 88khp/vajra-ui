import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { VajraProvider, defaultVajraTheme } from '../../vajra-theme';
import { TextInput } from './text-input';

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

describe('TextInput', () => {
  it('renders with a placeholder', () => {
    render(
      <VajraProvider>
        <TextInput placeholder="Enter text" />
      </VajraProvider>,
    );

    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();

    render(
      <VajraProvider>
        <TextInput testID="input" onChangeText={onChangeText} />
      </VajraProvider>,
    );

    fireEvent.changeText(screen.getByTestId('input'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('resolves bg, color, and rounded tokens to theme values', () => {
    render(
      <VajraProvider>
        <TextInput testID="input" bg="surface" color="text" rounded="r-2" />
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('input').props.style);

    expect(style.backgroundColor).toBe(defaultVajraTheme.light.colors.surface);
    expect(style.color).toBe(defaultVajraTheme.light.colors.text);
    expect(style.borderRadius).toBe(defaultVajraTheme.light.rounded['r-2']);
  });

  it('maps placeholderColor to placeholderTextColor without forwarding it', () => {
    render(
      <VajraProvider>
        <TextInput testID="input" placeholderColor="textMuted" />
      </VajraProvider>,
    );

    const { props } = screen.getByTestId('input');

    expect(props.placeholderTextColor).toBe(defaultVajraTheme.light.colors.textMuted);
    expect(props).not.toHaveProperty('placeholderColor');
  });
});
