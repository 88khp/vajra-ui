import { TVajraIconComponent } from '../icon-button/icon-button-types';
import { TVajraColors } from '../../vajra-theme/colors';

export type TDatePickerProps = {
  value?: Date;
  onChange: (date: Date) => void;

  minDate?: Date;
  maxDate?: Date;

  placeholder?: string;
  label?: string;
  errorText?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;

  /** Formats the selected date for the trigger field. Defaults to "Jan 1, 2026". */
  formatValue?: (date: Date) => string;

  selectedColor?: TVajraColors;

  /** Icon shown at the trailing edge of the trigger. Defaults to a plain 📅 glyph. */
  icon?: TVajraIconComponent;
  /** Icon for the previous-month control. Defaults to a plain ‹ glyph. */
  prevIcon?: TVajraIconComponent;
  /** Icon for the next-month control. Defaults to a plain › glyph. */
  nextIcon?: TVajraIconComponent;

  testID?: string;
};
