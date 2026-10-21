/**
 * Baseline: handwritten React Native StyleSheet.
 *
 * Static layout styles are created once. Theme × variant styles are precomputed
 * once at module load (2 themes × 3 variants), so rendering only looks up a
 * stable StyleSheet object. No style objects are created during render.
 */
import React, { createContext, memo, useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  accessibilityFor,
  COPY,
  colorsFor,
  renderCounter,
  SIZE,
  TBenchCardProps,
  TBenchTheme,
  TBenchVariant,
  THEMES,
  TYPOGRAPHY,
  VARIANT_ACCENT_TOKEN,
  VARIANTS,
} from '../../shared/spec';

const layout = StyleSheet.create({
  card: {
    padding: SIZE.cardPadding,
    borderRadius: SIZE.cardRadius,
    borderWidth: SIZE.cardBorderWidth,
    gap: SIZE.cardGap,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.title.fontSize,
    lineHeight: TYPOGRAPHY.title.lineHeight,
    fontWeight: TYPOGRAPHY.title.fontWeight,
  },
  description: {
    fontSize: TYPOGRAPHY.description.fontSize,
    lineHeight: TYPOGRAPHY.description.lineHeight,
    fontWeight: TYPOGRAPHY.description.fontWeight,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SIZE.actionGap,
  },
  button: {
    paddingHorizontal: SIZE.buttonPaddingX,
    paddingVertical: SIZE.buttonPaddingY,
    borderRadius: SIZE.buttonRadius,
    borderWidth: SIZE.cardBorderWidth,
  },
  buttonLabel: {
    fontSize: TYPOGRAPHY.button.fontSize,
    lineHeight: TYPOGRAPHY.button.lineHeight,
    fontWeight: TYPOGRAPHY.button.fontWeight,
  },
  status: {
    width: SIZE.statusSize,
    height: SIZE.statusSize,
    borderRadius: SIZE.statusRadius,
  },
});

type TThemedStyles = ReturnType<typeof buildThemedStyles>;

const buildThemedStyles = (theme: TBenchTheme, variant: TBenchVariant) => {
  const colors = colorsFor(theme);
  const accent = colors[VARIANT_ACCENT_TOKEN[variant]];

  return StyleSheet.create({
    card: { backgroundColor: colors.surface, borderColor: accent },
    title: { color: colors.text },
    description: { color: colors.textSubtle },
    primaryButton: { backgroundColor: accent, borderColor: accent },
    primaryButtonLabel: { color: colors.textInverse },
    secondaryButton: { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
    secondaryButtonLabel: { color: colors.text },
    status: { backgroundColor: accent },
  });
};

/** Precomputed once: THEMED[theme][variant]. Never rebuilt during render. */
const THEMED: Record<TBenchTheme, Record<TBenchVariant, TThemedStyles>> = Object.fromEntries(
  THEMES.map(theme => [
    theme,
    Object.fromEntries(VARIANTS.map(variant => [variant, buildThemedStyles(theme, variant)])),
  ]),
) as Record<TBenchTheme, Record<TBenchVariant, TThemedStyles>>;

const ThemeContext = createContext<TBenchTheme>('light');

export const Provider = ({ theme, children }: { theme: TBenchTheme; children: React.ReactNode }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

const BenchmarkCardComponent = ({
  title,
  description,
  variant,
  onPrimaryPress,
  onSecondaryPress,
}: TBenchCardProps) => {
  renderCounter.count += 1;
  const theme = useContext(ThemeContext);
  const s = THEMED[theme][variant];
  const a11y = accessibilityFor(title);

  return (
    <View style={[layout.card, s.card]}>
      <View style={layout.headerRow}>
        <Text style={[layout.title, s.title]}>{title}</Text>
        <View
          accessibilityRole={a11y.status.role}
          accessibilityLabel={a11y.status.label}
          style={[layout.status, s.status]}
        />
      </View>
      <Text style={[layout.description, s.description]}>{description}</Text>
      <View style={layout.actionRow}>
        <Pressable
          accessibilityRole={a11y.primary.role}
          accessibilityLabel={a11y.primary.label}
          onPress={onPrimaryPress}
          style={[layout.button, s.primaryButton]}
        >
          <Text style={[layout.buttonLabel, s.primaryButtonLabel]}>{COPY.primaryLabel}</Text>
        </Pressable>
        <Pressable
          accessibilityRole={a11y.secondary.role}
          accessibilityLabel={a11y.secondary.label}
          onPress={onSecondaryPress}
          style={[layout.button, s.secondaryButton]}
        >
          <Text style={[layout.buttonLabel, s.secondaryButtonLabel]}>{COPY.secondaryLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const BenchmarkCard = memo(BenchmarkCardComponent);
BenchmarkCard.displayName = 'BenchmarkCard';
