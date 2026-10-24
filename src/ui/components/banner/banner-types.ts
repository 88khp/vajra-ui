import React from 'react';

import { TAlertVariant } from '../alert';
import { TVajraIconComponent } from '../icon-button/icon-button-types';

export type TBannerActionProps = {
  label: string;
  onPress: () => void;
};

export type TBannerProps = {
  message: string;
  title?: string;
  variant?: TAlertVariant;
  onDismiss?: () => void;
  /** Overrides the variant's default icon. Pass `null` to render no icon. */
  icon?: React.ReactNode;
  /** Icon shown in the dismiss button, when `onDismiss` is set. Defaults to a plain ✕ glyph. */
  dismissIcon?: TVajraIconComponent;
  /** Optional inline action (e.g. "Retry", "Update now"), rendered after the message. */
  action?: TBannerActionProps;
  testID?: string;
};
