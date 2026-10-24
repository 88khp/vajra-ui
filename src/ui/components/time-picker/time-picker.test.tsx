import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { VajraProvider } from '../../vajra-theme';
import { TimePicker } from './time-picker';

jest.spyOn(Animated, 'timing').mockReturnValue({
  start: () => {},
  stop: () => {},
  reset: () => {},
} as unknown as Animated.CompositeAnimation);
jest.spyOn(Animated, 'spring').mockReturnValue({
  start: () => {},
  stop: () => {},
  reset: () => {},
} as unknown as Animated.CompositeAnimation);

describe('TimePicker', () => {
  it('shows the placeholder when no value is set', () => {
    render(
      <VajraProvider>
        <TimePicker onChange={() => {}} />
      </VajraProvider>,
    );

    expect(screen.getByText('Select a time…')).toBeTruthy();
  });

  it('shows the formatted value when set', () => {
    render(
      <VajraProvider>
        <TimePicker value={{ hour: 14, minute: 5 }} onChange={() => {}} />
      </VajraProvider>,
    );

    expect(screen.getByText('2:05 PM')).toBeTruthy();
  });

  it('opens the sheet and increments the hour via the stepper', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <TimePicker testID="time-picker" value={{ hour: 9, minute: 0 }} onChange={onChange} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('time-picker'));
    fireEvent.press(screen.getByTestId('time-picker-hour-increment'));

    expect(onChange).toHaveBeenCalledWith({ hour: 10, minute: 0 });
  });

  it('switches AM/PM via the segmented control', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <TimePicker testID="time-picker" value={{ hour: 9, minute: 0 }} onChange={onChange} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('time-picker'));
    fireEvent.press(screen.getByText('PM'));

    expect(onChange).toHaveBeenCalledWith({ hour: 21, minute: 0 });
  });
});
