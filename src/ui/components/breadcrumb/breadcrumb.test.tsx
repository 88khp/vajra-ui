import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { VajraProvider } from '../../vajra-theme';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  it('renders every item label and separators between them', () => {
    render(
      <VajraProvider>
        <Breadcrumb
          items={[
            { label: 'Home', onPress: () => {} },
            { label: 'Settings', onPress: () => {} },
            { label: 'Profile' },
          ]}
        />
      </VajraProvider>,
    );

    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getAllByText('/')).toHaveLength(2);
  });

  it('calls onPress for an interactive item', () => {
    const onPress = jest.fn();

    render(
      <VajraProvider>
        <Breadcrumb items={[{ label: 'Home', onPress }, { label: 'Current' }]} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByText('Home'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
