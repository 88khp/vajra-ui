import React, { memo, useState } from 'react';

import { Box } from '../../core/box';
import { Col } from '../../core/col';
import { Pressable } from '../../core/pressable';
import { Row } from '../../core/row';
import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { Sheet } from '../sheet';
import { Stepper } from '../stepper';
import { TabBar } from '../tab-bar';
import { formatTime } from './time-picker-utils';
import { TTimePickerProps, TTimeValue } from './time-picker-types';

const to12Hour = (hour: number): { hour12: number; period: 'AM' | 'PM' } => ({
  hour12: hour % 12 === 0 ? 12 : hour % 12,
  period: hour >= 12 ? 'PM' : 'AM',
});

const to24Hour = (hour12: number, period: 'AM' | 'PM'): number => {
  const base = hour12 % 12;

  return period === 'PM' ? base + 12 : base;
};

const TimePickerComponent: React.FC<TTimePickerProps> = ({
  value,
  onChange,
  minuteStep = 1,
  placeholder = 'Select a time…',
  label,
  errorText,
  isInvalid = false,
  isDisabled = false,
  formatValue = formatTime,
  buttonBg,
  buttonColor,
  icon: Icon,
  testID,
}) => {
  const { colors } = useVajraTheme();
  const [isOpen, setIsOpen] = useState(false);

  const current: TTimeValue = value ?? { hour: 9, minute: 0 };
  const { hour12, period } = to12Hour(current.hour);

  const handleHourChange = (nextHour12: number) => {
    onChange({ hour: to24Hour(nextHour12, period), minute: current.minute });
  };

  const handleMinuteChange = (nextMinute: number) => {
    onChange({ hour: current.hour, minute: nextMinute });
  };

  const handlePeriodChange = (nextPeriod: string) => {
    onChange({ hour: to24Hour(hour12, nextPeriod as 'AM' | 'PM'), minute: current.minute });
  };

  return (
    <Box>
      {label !== undefined && (
        <Text variant="label" color="textMuted" mb="s-1">
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => !isDisabled && setIsOpen(true)}
        bg="background"
        borderColor={isInvalid ? 'error' : 'border'}
        borderWidth={1}
        rounded="r-2"
        px="s-3"
        py="s-3"
        style={{ opacity: isDisabled ? 0.5 : 1 }}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, expanded: isOpen }}
      >
        <Row align="center" justify="space-between">
          <Text variant="body" color={value ? 'text' : 'textMuted'}>
            {value ? formatValue(value) : placeholder}
          </Text>
          {Icon ? (
            <Icon size={16} width={16} height={16} color={colors.textMuted} />
          ) : (
            <Text variant="label" color="textMuted">
              🕐
            </Text>
          )}
        </Row>
      </Pressable>

      {isInvalid && errorText !== undefined && (
        <Text variant="label" color="error" mt="s-1">
          {errorText}
        </Text>
      )}

      <Sheet
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        testID={testID ? `${testID}-sheet` : undefined}
      >
        <Col gap="s-4" align="center">
          <Text variant="subheading">
            {formatValue({ hour: current.hour, minute: current.minute })}
          </Text>

          <Row gap="s-6">
            <Col gap="s-2" align="center">
              <Text variant="label" color="textMuted">
                Hour
              </Text>
              <Stepper
                value={hour12}
                onChange={handleHourChange}
                min={1}
                max={12}
                buttonBg={buttonBg}
                buttonColor={buttonColor}
                testID={testID ? `${testID}-hour` : undefined}
              />
            </Col>

            <Col gap="s-2" align="center">
              <Text variant="label" color="textMuted">
                Minute
              </Text>
              <Stepper
                value={current.minute}
                onChange={handleMinuteChange}
                min={0}
                max={59}
                step={minuteStep}
                buttonBg={buttonBg}
                buttonColor={buttonColor}
                testID={testID ? `${testID}-minute` : undefined}
              />
            </Col>
          </Row>

          <Box style={{ width: 160 }}>
            <TabBar
              variant="segmented"
              tabs={[
                { value: 'AM', label: 'AM' },
                { value: 'PM', label: 'PM' },
              ]}
              value={period}
              onChange={handlePeriodChange}
            />
          </Box>
        </Col>
      </Sheet>
    </Box>
  );
};

export const TimePicker = memo(TimePickerComponent);
TimePicker.displayName = 'TimePicker';
