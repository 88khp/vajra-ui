/**
 * NativeWind implementation.
 *
 * Utility classes are literal strings so Tailwind's content scanner sees them.
 * Theme colors are CSS variables. The provider sets them with NativeWind's vars(),
 * which cascades to every card. Variant accents are static class names chosen from
 * a lookup table.
 */
import React, { createContext, memo, useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import { vars } from 'nativewind';

import {
  accessibilityFor,
  COPY,
  colorsFor,
  renderCounter,
  TBenchCardProps,
  TBenchTheme,
  TBenchVariant,
} from '../../shared/spec';

const colorVars = (theme: TBenchTheme) => {
  const c = colorsFor(theme);
  return vars({
    '--color-surface': c.surface,
    '--color-surfaceRaised': c.surfaceRaised,
    '--color-border': c.border,
    '--color-text': c.text,
    '--color-textSubtle': c.textSubtle,
    '--color-textInverse': c.textInverse,
    '--color-primary': c.primary,
    '--color-secondary': c.secondary,
    '--color-error': c.error,
  });
};

const VARS: Record<TBenchTheme, ReturnType<typeof vars>> = {
  light: colorVars('light'),
  dark: colorVars('dark'),
};

const CARD_BORDER: Record<TBenchVariant, string> = {
  primary: 'border-primary',
  secondary: 'border-secondary',
  danger: 'border-error',
};

const PRIMARY_BUTTON: Record<TBenchVariant, string> = {
  primary: 'bg-primary border-primary',
  secondary: 'bg-secondary border-secondary',
  danger: 'bg-error border-error',
};

const STATUS: Record<TBenchVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  danger: 'bg-error',
};

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
  const a11y = accessibilityFor(title);

  return (
    <View style={VARS[theme]} className={`gap-3 rounded-xl border bg-surface p-4 ${CARD_BORDER[variant]}`}>
      <View className="flex-row items-center justify-between">
        <Text className="text-bench-title text-text">{title}</Text>
        <View
          accessibilityRole={a11y.status.role}
          accessibilityLabel={a11y.status.label}
          className={`h-2 w-2 rounded-full ${STATUS[variant]}`}
        />
      </View>
      <Text className="text-bench-body text-textSubtle">{description}</Text>
      <View className="flex-row gap-2">
        <Pressable
          accessibilityRole={a11y.primary.role}
          accessibilityLabel={a11y.primary.label}
          onPress={onPrimaryPress}
          className={`rounded-lg border px-4 py-2 ${PRIMARY_BUTTON[variant]}`}
        >
          <Text className="text-bench-button text-textInverse">{COPY.primaryLabel}</Text>
        </Pressable>
        <Pressable
          accessibilityRole={a11y.secondary.role}
          accessibilityLabel={a11y.secondary.label}
          onPress={onSecondaryPress}
          className="rounded-lg border border-border bg-surfaceRaised px-4 py-2"
        >
          <Text className="text-bench-button text-text">{COPY.secondaryLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const BenchmarkCard = memo(BenchmarkCardComponent);
BenchmarkCard.displayName = 'BenchmarkCard';
