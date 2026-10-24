import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { VajraProvider } from '../../vajra-theme';
import { Searchbar } from './searchbar';

describe('Searchbar', () => {
  it('shows the default placeholder', () => {
    render(
      <VajraProvider>
        <Searchbar testID="search" onChangeText={() => {}} />
      </VajraProvider>,
    );

    expect(screen.getByPlaceholderText('Search…')).toBeTruthy();
  });

  it('calls onChangeText immediately when debounceMs is 0', () => {
    const onChangeText = jest.fn();

    render(
      <VajraProvider>
        <Searchbar testID="search" onChangeText={onChangeText} />
      </VajraProvider>,
    );

    fireEvent.changeText(screen.getByPlaceholderText('Search…'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('debounces onChangeText when debounceMs is set', () => {
    jest.useFakeTimers();

    const onChangeText = jest.fn();

    render(
      <VajraProvider>
        <Searchbar testID="search" onChangeText={onChangeText} debounceMs={300} />
      </VajraProvider>,
    );

    fireEvent.changeText(screen.getByPlaceholderText('Search…'), 'hello');
    expect(onChangeText).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(onChangeText).toHaveBeenCalledWith('hello');

    jest.useRealTimers();
  });
});
