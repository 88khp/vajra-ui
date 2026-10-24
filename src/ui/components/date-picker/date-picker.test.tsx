import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { VajraProvider } from '../../vajra-theme';
import { DatePicker } from './date-picker';

// DatePicker composes Sheet (Modal backdrop fade + drag-dismiss spring), both
// of which use useNativeDriver: true — not supported by this test
// environment's react-native / react-test-renderer combo. Stub both, same
// pattern as sheet.test.tsx.
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

describe('DatePicker', () => {
  it('shows the placeholder when no value is set', () => {
    render(
      <VajraProvider>
        <DatePicker onChange={() => {}} />
      </VajraProvider>,
    );

    expect(screen.getByText('Select a date…')).toBeTruthy();
  });

  it('shows the formatted value when set', () => {
    render(
      <VajraProvider>
        <DatePicker value={new Date(2026, 0, 15)} onChange={() => {}} />
      </VajraProvider>,
    );

    expect(screen.getByText('Jan 15, 2026')).toBeTruthy();
  });

  it('opens the calendar sheet when the trigger is pressed', () => {
    render(
      <VajraProvider>
        <DatePicker testID="date-picker" onChange={() => {}} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('date-picker'));
    expect(screen.getByLabelText('Previous month')).toBeTruthy();
  });

  it('calls onChange with the pressed date and closes the sheet', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <DatePicker testID="date-picker" value={new Date(2026, 0, 15)} onChange={onChange} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('date-picker'));
    fireEvent.press(screen.getByLabelText(new Date(2026, 0, 20).toDateString()));

    expect(onChange).toHaveBeenCalledTimes(1);

    const calledWith: Date = onChange.mock.calls[0][0];

    expect(calledWith.getDate()).toBe(20);
    expect(calledWith.getMonth()).toBe(0);
  });

  it('does not call onChange for a date before minDate', () => {
    const onChange = jest.fn();

    render(
      <VajraProvider>
        <DatePicker
          testID="date-picker"
          value={new Date(2026, 0, 15)}
          minDate={new Date(2026, 0, 10)}
          onChange={onChange}
        />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('date-picker'));
    fireEvent.press(screen.getByLabelText(new Date(2026, 0, 5).toDateString()));

    expect(onChange).not.toHaveBeenCalled();
  });
});
