import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { VajraProvider } from '../../vajra-theme';
import { Popover } from './popover';

describe('Popover', () => {
  it('renders the trigger always, and content only when visible', () => {
    render(
      <VajraProvider>
        <Popover
          isVisible={false}
          onClose={() => {}}
          content={<Text testID="popover-content">Content</Text>}
        >
          <View testID="trigger" />
        </Popover>
      </VajraProvider>,
    );

    expect(screen.getByTestId('trigger')).toBeTruthy();
  });

  it('calls onClose when the outside backdrop is pressed', () => {
    const onClose = jest.fn();

    render(
      <VajraProvider>
        <Popover isVisible onClose={onClose} content={<Text>Content</Text>}>
          <View testID="trigger" />
        </Popover>
      </VajraProvider>,
    );

    fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
