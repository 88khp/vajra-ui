import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import { VajraProvider } from '../../vajra-theme';
import { Fab } from './fab';
import { TVajraIconComponent } from '../icon-button';

const TestIcon: TVajraIconComponent = () => <View testID="test-icon" />;

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

describe('Fab', () => {
  it('renders the given icon', () => {
    render(
      <VajraProvider>
        <Fab testID="fab" icon={TestIcon} onPress={() => {}} />
      </VajraProvider>,
    );

    expect(screen.getByTestId('test-icon')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();

    render(
      <VajraProvider>
        <Fab testID="fab" icon={TestIcon} onPress={onPress} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('fab'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders the label in extended mode', () => {
    render(
      <VajraProvider>
        <Fab testID="fab" icon={TestIcon} label="Create" onPress={() => {}} />
      </VajraProvider>,
    );

    expect(screen.getByText('Create')).toBeTruthy();
  });

  it('applies absolute positioning for the given corner', () => {
    render(
      <VajraProvider>
        <Fab testID="fab" icon={TestIcon} onPress={() => {}} position="bottomRight" offset={24} />
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('fab').props.style);

    expect(style.position).toBe('absolute');
    expect(style.bottom).toBe(24);
    expect(style.right).toBe(24);
  });

  it('does not call onPress when isDisabled', () => {
    const onPress = jest.fn();

    render(
      <VajraProvider>
        <Fab testID="fab" icon={TestIcon} onPress={onPress} isDisabled />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('fab'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
