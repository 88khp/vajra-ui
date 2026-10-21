/**
 * styled-components/native implementation.
 *
 * Theme values come from ThemeProvider. Variant styling uses transient `$variant`
 * props with theme-aware interpolations, which is the documented pattern for
 * styled-components v6.
 */
import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';

import {
  accessibilityFor,
  COPY,
  colorsFor,
  renderCounter,
  SIZE,
  TBenchCardProps,
  TBenchTheme,
  TBenchVariant,
  TYPOGRAPHY,
  VARIANT_ACCENT_TOKEN,
} from '../../shared/spec';

type TThemeShape = { colors: ReturnType<typeof colorsFor> };

// Typed theme for every styled() interpolation in this file.
declare module 'styled-components/native' {
  export interface DefaultTheme extends TThemeShape {}
}

const themeFor = (theme: TBenchTheme): TThemeShape => ({ colors: colorsFor(theme) });
const THEMES: Record<TBenchTheme, TThemeShape> = { light: themeFor('light'), dark: themeFor('dark') };

const accentFor = (theme: TThemeShape, variant: TBenchVariant) =>
  theme.colors[VARIANT_ACCENT_TOKEN[variant]];

const Card = styled(View)<{ $variant: TBenchVariant }>`
  padding: ${SIZE.cardPadding}px;
  gap: ${SIZE.cardGap}px;
  border-radius: ${SIZE.cardRadius}px;
  border-width: ${SIZE.cardBorderWidth}px;
  background-color: ${({ theme }: { theme: TThemeShape }) => theme.colors.surface};
  border-color: ${({ theme, $variant }: { theme: TThemeShape; $variant: TBenchVariant }) =>
    accentFor(theme, $variant)};
`;

const HeaderRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: ${TYPOGRAPHY.title.fontSize}px;
  line-height: ${TYPOGRAPHY.title.lineHeight}px;
  font-weight: ${TYPOGRAPHY.title.fontWeight};
  color: ${({ theme }: { theme: TThemeShape }) => theme.colors.text};
`;

const Description = styled(Text)`
  font-size: ${TYPOGRAPHY.description.fontSize}px;
  line-height: ${TYPOGRAPHY.description.lineHeight}px;
  font-weight: ${TYPOGRAPHY.description.fontWeight};
  color: ${({ theme }: { theme: TThemeShape }) => theme.colors.textSubtle};
`;

const Status = styled(View)<{ $variant: TBenchVariant }>`
  width: ${SIZE.statusSize}px;
  height: ${SIZE.statusSize}px;
  border-radius: ${SIZE.statusRadius}px;
  background-color: ${({ theme, $variant }: { theme: TThemeShape; $variant: TBenchVariant }) =>
    accentFor(theme, $variant)};
`;

const ActionRow = styled(View)`
  flex-direction: row;
  gap: ${SIZE.actionGap}px;
`;

const ButtonBase = styled(Pressable)`
  padding: ${SIZE.buttonPaddingY}px ${SIZE.buttonPaddingX}px;
  border-radius: ${SIZE.buttonRadius}px;
  border-width: ${SIZE.cardBorderWidth}px;
`;

const PrimaryButton = styled(ButtonBase)<{ $variant: TBenchVariant }>`
  background-color: ${({ theme, $variant }: { theme: TThemeShape; $variant: TBenchVariant }) =>
    accentFor(theme, $variant)};
  border-color: ${({ theme, $variant }: { theme: TThemeShape; $variant: TBenchVariant }) =>
    accentFor(theme, $variant)};
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: ${({ theme }: { theme: TThemeShape }) => theme.colors.surfaceRaised};
  border-color: ${({ theme }: { theme: TThemeShape }) => theme.colors.border};
`;

const ButtonLabel = styled(Text)`
  font-size: ${TYPOGRAPHY.button.fontSize}px;
  line-height: ${TYPOGRAPHY.button.lineHeight}px;
  font-weight: ${TYPOGRAPHY.button.fontWeight};
`;

const PrimaryLabel = styled(ButtonLabel)`
  color: ${({ theme }: { theme: TThemeShape }) => theme.colors.textInverse};
`;

const SecondaryLabel = styled(ButtonLabel)`
  color: ${({ theme }: { theme: TThemeShape }) => theme.colors.text};
`;

export const Provider = ({ theme, children }: { theme: TBenchTheme; children: React.ReactNode }) => (
  <ThemeProvider theme={THEMES[theme]}>{children}</ThemeProvider>
);

const BenchmarkCardComponent = ({
  title,
  description,
  variant,
  onPrimaryPress,
  onSecondaryPress,
}: TBenchCardProps) => {
  renderCounter.count += 1;
  const a11y = accessibilityFor(title);

  return (
    <Card $variant={variant}>
      <HeaderRow>
        <Title>{title}</Title>
        <Status
          $variant={variant}
          accessibilityRole={a11y.status.role}
          accessibilityLabel={a11y.status.label}
        />
      </HeaderRow>
      <Description>{description}</Description>
      <ActionRow>
        <PrimaryButton
          $variant={variant}
          accessibilityRole={a11y.primary.role}
          accessibilityLabel={a11y.primary.label}
          onPress={onPrimaryPress}
        >
          <PrimaryLabel>{COPY.primaryLabel}</PrimaryLabel>
        </PrimaryButton>
        <SecondaryButton
          accessibilityRole={a11y.secondary.role}
          accessibilityLabel={a11y.secondary.label}
          onPress={onSecondaryPress}
        >
          <SecondaryLabel>{COPY.secondaryLabel}</SecondaryLabel>
        </SecondaryButton>
      </ActionRow>
    </Card>
  );
};

export const BenchmarkCard = memo(BenchmarkCardComponent);
BenchmarkCard.displayName = 'BenchmarkCard';
