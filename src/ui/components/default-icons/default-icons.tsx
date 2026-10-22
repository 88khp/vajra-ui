import React from 'react';
import { Text } from 'react-native';

import { TVajraIconComponent } from '../icon-button/icon-button-types';

type TDefaultIconName = 'success' | 'error' | 'warning' | 'info' | 'dismiss';

type TVajraIconsModule = Partial<
  Record<
    'CheckCircleIcon' | 'AlertCircleIcon' | 'AlertTriangleIcon' | 'InfoIcon' | 'XIcon',
    TVajraIconComponent
  >
>;

/**
 * @88khp/vajra-icons is an optional peer dependency. Requiring it inside `try`
 * lets Metro and other bundlers treat it as optional, so an app without it
 * still builds and gets the text glyphs below.
 */
const loadVajraIcons = (): TVajraIconsModule => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    return require('@88khp/vajra-icons');
  } catch {
    return {};
  }
};

/** A text glyph that satisfies the icon contract. Decorative, so hidden from screen readers. */
const createGlyphIcon = (glyph: string, name: string): TVajraIconComponent => {
  const GlyphIcon: TVajraIconComponent = ({ size, color }) => (
    <Text
      accessibilityElementsHidden
      importantForAccessibility="no"
      allowFontScaling={false}
      style={{
        color,
        fontSize: Math.round(size * 0.8),
        fontWeight: '700',
        lineHeight: size,
        textAlign: 'center',
        width: size,
      }}
    >
      {glyph}
    </Text>
  );

  GlyphIcon.displayName = name;

  return GlyphIcon;
};

/** U+FE0E asks for text presentation, so iOS doesn't render ⚠ as a colour emoji. */
export const FALLBACK_ICONS: Record<TDefaultIconName, TVajraIconComponent> = {
  dismiss: createGlyphIcon('✕', 'DismissGlyphIcon'),
  error: createGlyphIcon('!', 'ErrorGlyphIcon'),
  info: createGlyphIcon('i', 'InfoGlyphIcon'),
  success: createGlyphIcon('✓', 'SuccessGlyphIcon'),
  warning: createGlyphIcon('⚠︎', 'WarningGlyphIcon'),
};

const vajraIcons = loadVajraIcons();

/** The icons Alert and Toast use by default: @88khp/vajra-icons when installed, text glyphs otherwise. */
export const DEFAULT_ICONS: Record<TDefaultIconName, TVajraIconComponent> = {
  dismiss: vajraIcons.XIcon ?? FALLBACK_ICONS.dismiss,
  error: vajraIcons.AlertCircleIcon ?? FALLBACK_ICONS.error,
  info: vajraIcons.InfoIcon ?? FALLBACK_ICONS.info,
  success: vajraIcons.CheckCircleIcon ?? FALLBACK_ICONS.success,
  warning: vajraIcons.AlertTriangleIcon ?? FALLBACK_ICONS.warning,
};
