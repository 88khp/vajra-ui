import React from 'react';

import { TUiPressableProps } from '../../core/pressable/pressable-types';
import { TVajraColors } from '../../vajra-theme/colors';
import { TIconButtonSize, TIconButtonVariant } from './icon-button-variants';

/**
 * Contract every icon component must satisfy to work with IconButton.
 * `size` and `color` are injected automatically by IconButton based on
 * the button's `size` and `variant` — you never pass them at the call site.
 *
 * Usage:
 *
 *   // wrap any icon library once
 *   const BellIcon: TVajraIconComponent = ({ size, color }) => (
 *     <Ionicons name="bell" size={size} color={color} />
 *   );
 *
 *   // or with react-native-svg
 *   const BellIcon: TVajraIconComponent = ({ size, color }) => (
 *     <Svg width={size} height={size} viewBox="0 0 24 24">
 *       <Path d="..." fill={color} />
 *     </Svg>
 *   );
 *
 *   // then just pass the ref — size and color are handled for you
 *   <IconButton icon={BellIcon} />
 *   <IconButton icon={BellIcon} size="lg" variant="outline" />
 */
export type TVajraIconComponent = React.ComponentType<{
  size: number;
  width: number;
  height: number;
  color: string;
}>;

export type TIconButtonLoadingProps = {
  loader?: React.ReactNode;
};

export type TIconButtonProps = Omit<TUiPressableProps, 'disabled'> & {
  icon: TVajraIconComponent;
  iconColor?: TVajraColors;
  variant?: TIconButtonVariant;
  size?: TIconButtonSize;
  isDisabled?: boolean;
  isLoading?: boolean;
  isPill?: boolean;
  loading?: TIconButtonLoadingProps;
};
