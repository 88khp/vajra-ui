import { TVajraIconComponent } from '../icon-button/icon-button-types';
import { TVajraColors } from '../../vajra-theme/colors';
import { TTimeValue } from './time-picker-utils';

export type { TTimeValue };

export type TTimePickerProps = {
  value?: TTimeValue;
  onChange: (value: TTimeValue) => void;

  /** Minute increment the stepper moves by. Defaults to 1. */
  minuteStep?: number;

  placeholder?: string;
  label?: string;
  errorText?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;

  /** Formats the selected time for the trigger field. Defaults to "1:30 PM". */
  formatValue?: (value: TTimeValue) => string;

  buttonBg?: TVajraColors;
  buttonColor?: TVajraColors;

  /** Icon shown at the trailing edge of the trigger. Defaults to a plain 🕐 glyph. */
  icon?: TVajraIconComponent;

  testID?: string;
};
