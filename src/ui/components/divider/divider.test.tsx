import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { VajraProvider } from '../../vajra-theme';
import { Divider } from './divider';

describe('Divider', () => {
  it('renders a plain horizontal divider by default', () => {
    render(
      <VajraProvider>
        <Divider />
      </VajraProvider>,
    );
  });

  it('renders a label centered on the line when provided', () => {
    render(
      <VajraProvider>
        <Divider label="OR" />
      </VajraProvider>,
    );

    expect(screen.getByText('OR')).toBeTruthy();
  });
});
