import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { VajraProvider } from '../../vajra-theme';
import { Rating } from './rating';

describe('Rating', () => {
  it('renders max cells', () => {
    render(
      <VajraProvider>
        <Rating testID="rating" value={3} onChange={() => {}} max={5} />
      </VajraProvider>,
    );

    expect(screen.getByLabelText('Rate 1 out of 5')).toBeTruthy();
    expect(screen.getByLabelText('Rate 5 out of 5')).toBeTruthy();
  });

  it('calls onChange with the pressed cell number', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <Rating value={2} onChange={onChange} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByLabelText('Rate 4 out of 5'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('does not render pressable cells when isReadOnly', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <Rating value={2} onChange={onChange} isReadOnly />
      </VajraProvider>,
    );

    expect(screen.queryByLabelText('Rate 4 out of 5')).toBeNull();
  });
});
