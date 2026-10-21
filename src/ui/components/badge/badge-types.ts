import { TUiBoxProps } from '../../core/box';
import { TVajraColors } from '../../vajra-theme/colors';
import { TVajraIconComponent } from '../icon-button/icon-button-types';
import { TTextProps } from '../../core/text/text-types';
import { TVajraTone } from '../../utils/tone';

export type TBadgeProps = TUiBoxProps & {
  label: string;
  textProps?: Omit<TTextProps, 'children'>;
  icon?: TVajraIconComponent;
  iconSize?: number;
  iconColor?: TVajraColors;
  tone?: TVajraTone;
};
