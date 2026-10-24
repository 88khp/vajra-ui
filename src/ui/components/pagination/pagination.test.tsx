import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { VajraProvider } from '../../vajra-theme';
import { Pagination } from './pagination';
import { getPaginationRange } from './pagination-utils';

describe('getPaginationRange', () => {
  it('returns every page when pageCount fits within the visible window', () => {
    expect(getPaginationRange(1, 5, 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it('windows around the current page with ellipses for large counts', () => {
    expect(getPaginationRange(10, 20, 1)).toEqual([1, '…', 9, 10, 11, '…', 20]);
  });
});

describe('Pagination', () => {
  it('calls onChange with the pressed page number', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <Pagination page={1} pageCount={5} onChange={onChange} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByLabelText('Page 3'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('disables the previous control on the first page', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <Pagination page={1} pageCount={5} onChange={onChange} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByLabelText('Previous page'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('advances to the next page', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <Pagination page={2} pageCount={5} onChange={onChange} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByLabelText('Next page'));
    expect(onChange).toHaveBeenCalledWith(3);
  });
});
