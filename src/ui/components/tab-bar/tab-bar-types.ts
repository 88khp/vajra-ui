import { TVajraColors } from '../../vajra-theme/colors';
import { TRoundedToken } from '../../vajra-theme/tokens/rounded-tokens';
import { TSpacingToken } from '../../vajra-theme/tokens/spacing-tokens';
import { TTextProps } from '../../core/text';

export type TTabBarTab = {
  value: string;
  label: string;
};

export type TTabBarVariant = 'pills' | 'underline' | 'segmented';

export type TTabBarProps = {
  tabs: TTabBarTab[];
  value: string;
  onChange: (value: string) => void;

  // 'pills' (default): filled sliding pill over a rounded track.
  // 'segmented': same pill indicator, square-ish track (alias with different default roundedness).
  // 'underline': classic thin bottom-border indicator, no track background.
  variant?: TTabBarVariant;

  // track (container)
  trackBg?: TVajraColors;
  trackRounded?: TRoundedToken;
  trackPadding?: TSpacingToken;

  // active indicator pill / underline
  indicatorBg?: TVajraColors;
  indicatorRounded?: TRoundedToken;
  underlineHeight?: number;

  // label colors
  activeColor?: TVajraColors;
  inactiveColor?: TVajraColors;

  // label text props (excluding color, which is controlled by activeColor/inactiveColor)
  labelProps?: Omit<TTextProps, 'color'>;

  // scrollable or equal-width
  scrollable?: boolean;
};
