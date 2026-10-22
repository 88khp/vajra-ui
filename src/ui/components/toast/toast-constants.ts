import { TVajraColors } from '../../vajra-theme/colors';
import { DEFAULT_ICONS } from '../default-icons';
import { TVajraIconComponent } from '../icon-button/icon-button-types';
import { TToastVariant } from './toast-types';

export const TOAST_DEFAULT_DURATION = 3000;

export const TOAST_VARIANT_COLORS: Record<TToastVariant, { bg: TVajraColors; text: TVajraColors }> =
  {
    default: { bg: 'surfaceRaised', text: 'text' },
    success: { bg: 'success', text: 'textInverse' },
    error: { bg: 'error', text: 'textInverse' },
    warning: { bg: 'warning', text: 'textInverse' },
    info: { bg: 'info', text: 'textInverse' },
  };

export const TOAST_VARIANT_ICONS: Record<TToastVariant, TVajraIconComponent | undefined> = {
  default: undefined,
  success: DEFAULT_ICONS.success,
  error: DEFAULT_ICONS.error,
  warning: DEFAULT_ICONS.warning,
  info: DEFAULT_ICONS.info,
};
