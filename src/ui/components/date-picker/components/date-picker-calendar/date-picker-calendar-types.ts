import { TVajraColors } from '../../../../vajra-theme/colors';
import { TVajraIconComponent } from '../../../icon-button/icon-button-types';

export type TDatePickerCalendarProps = {
  value?: Date;
  onSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  selectedColor?: TVajraColors;
  prevIcon?: TVajraIconComponent;
  nextIcon?: TVajraIconComponent;
};
