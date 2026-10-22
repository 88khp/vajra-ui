import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon } from '@88khp/vajra-icons';

import { VajraProvider, defaultVajraTheme } from '../../vajra-theme';
import { Alert } from './alert';

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

describe('Alert', () => {
  it('renders the message', () => {
    render(
      <VajraProvider>
        <Alert message="Something happened" />
      </VajraProvider>,
    );

    expect(screen.getByText('Something happened')).toBeTruthy();
  });

  it('renders the title when provided', () => {
    render(
      <VajraProvider>
        <Alert title="Heads up" message="Something happened" />
      </VajraProvider>,
    );

    expect(screen.getByText('Heads up')).toBeTruthy();
  });

  it('does not render a dismiss button when onDismiss is not provided', () => {
    render(
      <VajraProvider>
        <Alert message="Something happened" testID="alert" />
      </VajraProvider>,
    );

    expect(screen.queryByTestId('alert-dismiss')).toBeNull();
  });

  it('calls onDismiss when the dismiss button is pressed', () => {
    const onDismiss = jest.fn();

    render(
      <VajraProvider>
        <Alert message="Something happened" onDismiss={onDismiss} testID="alert" />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('alert-dismiss'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders a custom dismiss icon instead of the default XIcon when provided', () => {
    const onDismiss = jest.fn();
    const DismissIcon = () => <View testID="custom-dismiss-icon" />;

    render(
      <VajraProvider>
        <Alert
          message="Something happened"
          onDismiss={onDismiss}
          dismissIcon={DismissIcon}
          testID="alert"
        />
      </VajraProvider>,
    );

    expect(screen.getByTestId('custom-dismiss-icon')).toBeTruthy();
  });

  it('renders the default XIcon dismiss button when onDismiss is set without a custom dismissIcon', () => {
    render(
      <VajraProvider>
        <Alert message="Something happened" onDismiss={() => {}} testID="alert" />
      </VajraProvider>,
    );

    expect(screen.getByTestId('alert-dismiss')).toBeTruthy();
  });

  it('renders a default icon per variant without an explicit icon prop', () => {
    render(
      <VajraProvider>
        <Alert message="Saved" variant="success" testID="alert-success" />
      </VajraProvider>,
    );

    expect(screen.UNSAFE_queryAllByType(CheckCircleIcon).length).toBe(1);
  });

  it('renders no icon for the default variant', () => {
    render(
      <VajraProvider>
        <Alert message="Plain" testID="alert-plain" />
      </VajraProvider>,
    );

    expect(screen.UNSAFE_queryAllByType(CheckCircleIcon).length).toBe(0);
    expect(screen.UNSAFE_queryAllByType(AlertCircleIcon).length).toBe(0);
    expect(screen.UNSAFE_queryAllByType(AlertTriangleIcon).length).toBe(0);
    expect(screen.UNSAFE_queryAllByType(InfoIcon).length).toBe(0);
  });

  it('suppresses the icon when icon={null} is passed', () => {
    render(
      <VajraProvider>
        <Alert message="Saved" variant="success" icon={null} testID="alert-success" />
      </VajraProvider>,
    );

    expect(screen.UNSAFE_queryAllByType(CheckCircleIcon).length).toBe(0);
  });

  it('resolves the error variant to the theme errorSubtle background and error border', () => {
    render(
      <VajraProvider>
        <Alert message="Failed" variant="error" testID="alert" />
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('alert').props.style);

    expect(style.backgroundColor).toBe(defaultVajraTheme.light.colors.errorSubtle);
    expect(style.borderColor).toBe(defaultVajraTheme.light.colors.error);
  });

  it('defaults to the default variant colors', () => {
    render(
      <VajraProvider>
        <Alert message="Info" testID="alert" />
      </VajraProvider>,
    );

    const style = flattenStyle(screen.getByTestId('alert').props.style);

    expect(style.backgroundColor).toBe(defaultVajraTheme.light.colors.surfaceRaised);
  });
});
