import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Animated, View } from 'react-native';

import { VajraProvider, defaultVajraTheme } from '../../vajra-theme';
import { Select } from './select';

// Select renders its options inside Sheet, which fades its backdrop via
// Animated.timing with useNativeDriver: true — not supported by this test
// environment's react-native / react-test-renderer combo. Stub it, same
// pattern used by modal.test.tsx / sheet.test.tsx / toast.test.tsx.
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

const options = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
];

const flattenStyle = (style: unknown): Record<string, unknown> => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle));
  }

  return (style as Record<string, unknown>) ?? {};
};

type TControlledSelectProps = Partial<
  Omit<React.ComponentProps<typeof Select>, 'multiple' | 'value' | 'onChange'>
> & {
  initialValue?: string;
};

const ControlledSelect = ({ initialValue, ...props }: TControlledSelectProps = {}) => {
  const [value, setValue] = useState<string | undefined>(initialValue);

  return (
    <Select options={options} value={value} onChange={setValue} testID="color-select" {...props} />
  );
};

describe('Select', () => {
  it('shows the placeholder when nothing is selected', () => {
    render(
      <VajraProvider>
        <ControlledSelect />
      </VajraProvider>,
    );

    expect(screen.getByText('Select…')).toBeTruthy();
  });

  it('opens the options sheet when the trigger is pressed', () => {
    render(
      <VajraProvider>
        <ControlledSelect />
      </VajraProvider>,
    );

    expect(screen.queryByText('Red')).toBeNull();

    fireEvent.press(screen.getByTestId('color-select'));

    expect(screen.getByText('Red')).toBeTruthy();
    expect(screen.getByText('Green')).toBeTruthy();
    expect(screen.getByText('Blue')).toBeTruthy();
  });

  it('calls onChange and closes the sheet when an option is pressed', () => {
    render(
      <VajraProvider>
        <ControlledSelect />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('color-select'));
    fireEvent.press(screen.getByTestId('color-select-option-green'));

    expect(screen.getByText('Green')).toBeTruthy();
    expect(screen.queryByText('Select…')).toBeNull();
  });

  it('does not open when disabled', () => {
    render(
      <VajraProvider>
        <ControlledSelect isDisabled />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('color-select'));

    expect(screen.queryByText('Red')).toBeNull();
  });

  it('renders a custom trigger icon instead of the default ▲/▼ glyph when provided', () => {
    const TriggerIcon = () => <View testID="custom-trigger-icon" />;

    render(
      <VajraProvider>
        <ControlledSelect icon={TriggerIcon} />
      </VajraProvider>,
    );

    expect(screen.getByTestId('custom-trigger-icon')).toBeTruthy();
    expect(screen.queryByText('▼')).toBeNull();
  });

  it('renders a custom check icon on the selected option instead of the default ✓ glyph when provided', () => {
    const CheckIcon = () => <View testID="custom-check-icon" />;

    render(
      <VajraProvider>
        <ControlledSelect initialValue="green" checkIcon={CheckIcon} />
      </VajraProvider>,
    );

    fireEvent.press(screen.getByTestId('color-select'));

    expect(screen.getByTestId('custom-check-icon')).toBeTruthy();
    expect(screen.queryByText('✓')).toBeNull();
  });

  it('shows the error text and resolves the border to the error color when invalid', () => {
    render(
      <VajraProvider>
        <ControlledSelect isInvalid errorText="Pick a color" />
      </VajraProvider>,
    );

    expect(screen.getByText('Pick a color')).toBeTruthy();

    const style = flattenStyle(screen.getByTestId('color-select').props.style);

    expect(style.borderColor).toBe(defaultVajraTheme.light.colors.error);
  });
});
