/**
 * twrnc implementation (Tailwind classes compiled to React Native styles at runtime).
 *
 * Each theme gets its own `tw` instance whose color palette is the shared spec's
 * colors, so class names such as `bg-surface` resolve to the same values as the
 * other implementations. Classes are built per render with `tw(...)`, which is how
 * twrnc is documented to be used. No styles are precomputed here, so the cost of
 * parsing classes is included in every render.
 */
import React, { createContext, memo, useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import { create } from 'twrnc';

import {
  accessibilityFor,
  COPY,
  colorsFor,
  renderCounter,
  TBenchCardProps,
  TBenchTheme,
  TBenchVariant,
} from '../../shared/spec';

type TTw = ReturnType<typeof create>;

/** Tailwind's default `font-normal` is the keyword 'normal'; the spec uses weight 400. */
const themeFor = (theme: TBenchTheme) => ({
  theme: { extend: { colors: colorsFor(theme), fontWeight: { normal: '400' } } },
});

const TW: Record<TBenchTheme, TTw> = {
  light: create(themeFor('light')),
  dark: create(themeFor('dark')),
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
  const tw = TW[theme];
  const a11y = accessibilityFor(title);

  return (
    <View style={tw.style(`gap-3 rounded-[12px] border p-4 bg-surface ${CARD_BORDER[variant]}`)}>
      <View style={tw.style('flex-row items-center justify-between')}>
        <Text style={tw.style('text-[20px] leading-[24px] font-semibold text-text')}>{title}</Text>
        <View
          accessibilityRole={a11y.status.role}
          accessibilityLabel={a11y.status.label}
          style={tw.style(`h-2 w-2 rounded-full ${STATUS[variant]}`)}
        />
      </View>
      <Text style={tw.style('text-[16px] leading-[20px] font-normal text-textSubtle')}>{description}</Text>
      <View style={tw.style('flex-row gap-2')}>
        <Pressable
          accessibilityRole={a11y.primary.role}
          accessibilityLabel={a11y.primary.label}
          onPress={onPrimaryPress}
          style={tw.style(`rounded-[8px] border px-4 py-2 ${PRIMARY_BUTTON[variant]}`)}
        >
          <Text style={tw.style('text-[16px] leading-[20px] font-semibold text-textInverse')}>
            {COPY.primaryLabel}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole={a11y.secondary.role}
          accessibilityLabel={a11y.secondary.label}
          onPress={onSecondaryPress}
          style={tw.style('rounded-[8px] border border-border bg-surfaceRaised px-4 py-2')}
        >
          <Text style={tw.style('text-[16px] leading-[20px] font-semibold text-text')}>
            {COPY.secondaryLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export const BenchmarkCard = memo(BenchmarkCardComponent);
BenchmarkCard.displayName = 'BenchmarkCard';
