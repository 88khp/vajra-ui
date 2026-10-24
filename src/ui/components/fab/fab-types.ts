import { TUiPressableProps } from '../../core/pressable/pressable-types';
import { TIconButtonSize, TIconButtonVariant, TVajraIconComponent } from '../icon-button';

export type TFabPosition = 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';

export type TFabProps = Omit<TUiPressableProps, 'disabled' | 'position'> & {
  icon: TVajraIconComponent;
  /** Optional label — renders an extended FAB (icon + text) instead of an icon-only circle. */
  label?: string;
  variant?: TIconButtonVariant;
  size?: TIconButtonSize;
  isDisabled?: boolean;
  /** Corner the FAB docks to when used as a fixed overlay. Defaults to 'bottomRight'. */
  position?: TFabPosition;
  /** Offset (px) from the two edges implied by `position`. Defaults to 16. */
  offset?: number;
};
