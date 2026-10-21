/**
 * Expected host tree for one BenchmarkCard, derived directly from the spec and Vajra's
 * default theme. It is independent of every implementation, so the StyleSheet baseline
 * is checked against it as well as against the other libraries.
 */
import { colorsFor, COPY, SIZE, TBenchTheme, TBenchVariant, TYPOGRAPHY, VARIANT_ACCENT_TOKEN } from '../shared/spec';
import type { TNormalizedNode } from './normalize';

export const expectedCardNodes = (
  theme: TBenchTheme,
  variant: TBenchVariant,
  title: string,
): TNormalizedNode[] => {
  const c = colorsFor(theme);
  const accent = c[VARIANT_ACCENT_TOKEN[variant]];
  const pad = (x: number, y: number) => ({
    paddingTop: y,
    paddingBottom: y,
    paddingLeft: x,
    paddingRight: x,
  });
  const a11y = {
    primary: `${title} primary action`,
    secondary: `${title} secondary action`,
  };

  return [
    {
      type: 'View',
      style: {
        backgroundColor: c.surface,
        borderColor: accent,
        borderWidth: SIZE.cardBorderWidth,
        borderRadius: SIZE.cardRadius,
        gap: SIZE.cardGap,
        ...pad(SIZE.cardPadding, SIZE.cardPadding),
      },
    },
    {
      type: 'View',
      style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    },
    {
      type: 'Text',
      text: title,
      style: {
        color: c.text,
        fontSize: TYPOGRAPHY.title.fontSize,
        lineHeight: TYPOGRAPHY.title.lineHeight,
        fontWeight: TYPOGRAPHY.title.fontWeight,
      },
    },
    {
      type: 'View',
      role: 'image',
      label: 'Status: active',
      style: { width: SIZE.statusSize, height: SIZE.statusSize, borderRadius: SIZE.statusRadius, backgroundColor: accent },
    },
    {
      type: 'Text',
      text: 'Keeps the deployment pipeline healthy and reports failures in one place.',
      style: {
        color: c.textSubtle,
        fontSize: TYPOGRAPHY.description.fontSize,
        lineHeight: TYPOGRAPHY.description.lineHeight,
        fontWeight: TYPOGRAPHY.description.fontWeight,
      },
    },
    {
      type: 'View',
      style: { flexDirection: 'row', gap: SIZE.actionGap },
    },
    {
      type: 'View',
      role: 'button',
      label: a11y.primary,
      style: {
        backgroundColor: accent,
        borderColor: accent,
        borderWidth: SIZE.cardBorderWidth,
        borderRadius: SIZE.buttonRadius,
        ...pad(SIZE.buttonPaddingX, SIZE.buttonPaddingY),
      },
    },
    {
      type: 'Text',
      text: COPY.primaryLabel,
      style: {
        color: c.textInverse,
        fontSize: TYPOGRAPHY.button.fontSize,
        lineHeight: TYPOGRAPHY.button.lineHeight,
        fontWeight: TYPOGRAPHY.button.fontWeight,
      },
    },
    {
      type: 'View',
      role: 'button',
      label: a11y.secondary,
      style: {
        backgroundColor: c.surfaceRaised,
        borderColor: c.border,
        borderWidth: SIZE.cardBorderWidth,
        borderRadius: SIZE.buttonRadius,
        ...pad(SIZE.buttonPaddingX, SIZE.buttonPaddingY),
      },
    },
    {
      type: 'Text',
      text: COPY.secondaryLabel,
      style: {
        color: c.text,
        fontSize: TYPOGRAPHY.button.fontSize,
        lineHeight: TYPOGRAPHY.button.lineHeight,
        fontWeight: TYPOGRAPHY.button.fontWeight,
      },
    },
  ];
};
