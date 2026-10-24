import { TVajraIconComponent } from '../icon-button/icon-button-types';
import { TVajraColors } from '../../vajra-theme/colors';

export type TSelectOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

type TSelectCommonProps<TValue extends string = string> = {
  options: TSelectOption<TValue>[];

  placeholder?: string;
  label?: string;
  errorText?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;

  selectedColor?: TVajraColors;

  /** Icon shown at the trailing edge, rotated/swapped between open and closed state. Defaults to a plain ▲/▼ glyph. */
  icon?: TVajraIconComponent;
  /** Icon shown next to the selected option in the list. Defaults to a plain ✓ glyph. */
  checkIcon?: TVajraIconComponent;

  /** Shows a search field above the options list, filtering by label. */
  isSearchable?: boolean;
  /** Placeholder for the search field. Defaults to 'Search…'. */
  searchPlaceholder?: string;
  /** Icon shown at the start of the search field. */
  searchIcon?: TVajraIconComponent;

  testID?: string;
};

export type TSelectSingleProps<TValue extends string = string> = TSelectCommonProps<TValue> & {
  multiple?: false;
  value?: TValue;
  onChange: (value: TValue) => void;
};

export type TSelectMultipleProps<TValue extends string = string> = TSelectCommonProps<TValue> & {
  multiple: true;
  value?: TValue[];
  onChange: (value: TValue[]) => void;
};

export type TSelectProps<TValue extends string = string> =
  | TSelectSingleProps<TValue>
  | TSelectMultipleProps<TValue>;
