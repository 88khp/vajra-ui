import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { VajraProvider } from '../../vajra-theme';
import { Banner } from './banner';

describe('Banner', () => {
  it('renders the message', () => {
    render(
      <VajraProvider>
        <Banner message="A new version is available" />
      </VajraProvider>,
    );

    expect(screen.getByText('A new version is available')).toBeTruthy();
  });

  it('calls the action onPress when its label is pressed', () => {
    const onPress = jest.fn();

    render(
      <VajraProvider>
        <Banner message="Update required" action={{ label: 'Update now', onPress }} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByText('Update now'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when the dismiss button is pressed', () => {
    const onDismiss = jest.fn();

    render(
      <VajraProvider>
        <Banner testID="banner" message="Dismiss me" onDismiss={onDismiss} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('banner-dismiss'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
