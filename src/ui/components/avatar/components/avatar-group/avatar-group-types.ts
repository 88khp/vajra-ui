import React from 'react';

export type TAvatarGroupProps = {
  children: React.ReactNode;
  /** Diameter (px) used to size each Avatar child consistently, default 40 */
  size?: number;
  /** How much each avatar overlaps its neighbor, in px (default: size * 0.3) */
  overlap?: number;
  /** Cap the number of avatars shown, rendering a "+N" overflow avatar for the rest */
  max?: number;
};
