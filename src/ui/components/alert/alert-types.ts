import React from 'react';

import { TVajraIconComponent } from '../icon-button/icon-button-types';

export type TAlertVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export type TAlertProps = {
  message: string;
  title?: string;
  variant?: TAlertVariant;
  onDismiss?: () => void;
  /** Overrides the variant's default icon. Pass `null` to render no icon. */
  icon?: React.ReactNode;
  /** Icon shown in the dismiss button, when `onDismiss` is set. Defaults to `XIcon` from `@88khp/vajra-icons` when installed, otherwise a ✕ glyph. */
  dismissIcon?: TVajraIconComponent;
  testID?: string;
};

export type TAlertOptions = {
  message: string;
  title?: string;
  variant?: TAlertVariant;
  /** Milliseconds before auto-dismiss. Defaults to 0 (stays until dismissed). */
  duration?: number;
  /** Overrides the variant's default icon. Pass `null` to render no icon. */
  icon?: React.ReactNode;
  /** Icon shown in the dismiss button. Defaults to `XIcon` from `@88khp/vajra-icons` when installed, otherwise a ✕ glyph. */
  dismissIcon?: TVajraIconComponent;
};

export type TAlertEntry = TAlertOptions & { id: string };

export type TAlertContextValue = {
  show: (options: TAlertOptions | string) => string;
  hide: (id: string) => void;
};

export type TAlertProviderProps = {
  children: React.ReactNode;
  /** Where the alert stack is anchored on screen. Defaults to 'top'. */
  position?: 'top' | 'bottom';
  /** Maximum number of alerts stacked on screen at once. Defaults to the theme's `alert.maxVisible` (3). Extra alerts stay queued and appear as visible ones dismiss. */
  maxVisible?: number;
};
