import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import { CheckCircleIcon } from '@88khp/vajra-icons';

import { VajraProvider } from '../../../../vajra-theme';
import { ToastItem } from './toast-item';

describe('ToastItem', () => {
  it('renders the message', () => {
    render(
      <VajraProvider>
        <ToastItem message="Saved" />
      </VajraProvider>,
    );

    expect(screen.getByText('Saved')).toBeTruthy();
  });

  it('renders the default icon for a variant', () => {
    render(
      <VajraProvider>
        <ToastItem message="Saved" variant="success" />
      </VajraProvider>,
    );

    expect(screen.UNSAFE_queryAllByType(CheckCircleIcon).length).toBe(1);
  });

  it('renders no icon for the default variant', () => {
    render(
      <VajraProvider>
        <ToastItem message="Saved" />
      </VajraProvider>,
    );

    expect(screen.UNSAFE_queryAllByType(CheckCircleIcon).length).toBe(0);
  });

  it('renders a custom icon override', () => {
    render(
      <VajraProvider>
        <ToastItem message="Saved" variant="success" icon={<View testID="custom-icon" />} />
      </VajraProvider>,
    );

    expect(screen.getByTestId('custom-icon')).toBeTruthy();
    expect(screen.UNSAFE_queryAllByType(CheckCircleIcon).length).toBe(0);
  });

  it('does not render a dismiss button by default', () => {
    render(
      <VajraProvider>
        <ToastItem message="Saved" testID="toast" />
      </VajraProvider>,
    );

    expect(screen.queryByTestId('toast-dismiss')).toBeNull();
  });

  it('renders a dismiss button and calls onDismiss when pressed', () => {
    const onDismiss = jest.fn();

    render(
      <VajraProvider>
        <ToastItem message="Saved" dismissible onDismiss={onDismiss} testID="toast" />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('toast-dismiss'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
