/**
 * Shared specification for the BenchmarkCard component.
 *
 * Every implementation in ../implementations/ reads from this file so that the
 * component hierarchy, copy, accessibility labels, variant→accent mapping and
 * token names are defined exactly once. Colors and typography values are NOT
 * re-declared here: they come from Vajra UI's default theme, so every library
 * is handed the same numbers.
 */
import { defaultVajraTheme } from '@88khp/vajra-ui';

export type TBenchTheme = 'light' | 'dark';
export type TBenchVariant = 'primary' | 'secondary' | 'danger';

export const THEMES: readonly TBenchTheme[] = ['light', 'dark'];
export const VARIANTS: readonly TBenchVariant[] = ['primary', 'secondary', 'danger'];

/** Color token names (keys of defaultVajraTheme[theme].colors). */
export const VARIANT_ACCENT_TOKEN: Record<TBenchVariant, 'primary' | 'secondary' | 'error'> = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'error',
};

/** Spacing / radius values, in dp. Copied from Vajra's scale and asserted in parity tests. */
export const SIZE = {
  cardPadding: 16, // s-4
  cardGap: 12, // s-3
  cardRadius: 12, // r-3
  cardBorderWidth: 1,
  actionGap: 8, // s-2
  buttonPaddingX: 16, // s-4
  buttonPaddingY: 8, // s-2
  buttonRadius: 8, // r-2
  statusSize: 8,
  statusRadius: 9999, // r-full
} as const;

/** Typography: taken from Vajra's named variants so every library uses the same sizes. */
export const TYPOGRAPHY = {
  title: defaultVajraTheme.light.typography.h3,
  description: defaultVajraTheme.light.typography.body,
  button: defaultVajraTheme.light.typography.button,
} as const;

/** Resolved color values for a theme, read from Vajra's default theme. */
export const colorsFor = (theme: TBenchTheme) => defaultVajraTheme[theme].colors;

/** Copy and accessibility labels. Identical across all implementations. */
export const COPY = {
  primaryLabel: 'Deploy',
  secondaryLabel: 'Details',
  statusLabel: 'Status: active',
  statusDescription: 'Shared card description used for every benchmark card.',
} as const;

export const accessibilityFor = (title: string) => ({
  primary: { role: 'button' as const, label: `${title} primary action` },
  secondary: { role: 'button' as const, label: `${title} secondary action` },
  status: { role: 'image' as const, label: COPY.statusLabel },
});

/** Deterministic description copy; cycles through a fixed list so no RNG is involved. */
const DESCRIPTIONS = [
  'Keeps the deployment pipeline healthy and reports failures in one place.',
  'Tracks weekly usage across every workspace in the organisation.',
  'Summarises incoming requests and groups them by priority.',
  'Mirrors the staging environment nightly for regression checks.',
  'Collects metrics from background workers and publishes a digest.',
  'Coordinates rollouts across regions with automatic rollback.',
  'Archives stale branches and proposes cleanup actions for review.',
  'Watches certificate expiry dates and renews them before they lapse.',
] as const;

export type TBenchCardData = {
  id: number;
  title: string;
  description: string;
  variant: TBenchVariant;
};

/** Deterministic card data: same input count always yields the same data. */
export const makeCardData = (count: number): TBenchCardData[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Project ${i + 1}`,
    description: DESCRIPTIONS[i % DESCRIPTIONS.length],
    variant: VARIANTS[i % VARIANTS.length],
  }));

/** Deterministic sequence of (theme, variant) steps used by the update scenarios. */
export const stepSequence = (steps: number): { theme: TBenchTheme; variant: TBenchVariant }[] =>
  Array.from({ length: steps }, (_, i) => ({
    theme: THEMES[i % THEMES.length],
    variant: VARIANTS[i % VARIANTS.length],
  }));

/**
 * Render counter shared by all six implementations. Each BenchmarkCard increments it
 * on every function invocation, using the same single line, so render counts are
 * instrumented identically.
 */
export const renderCounter = { count: 0 };

export type TBenchCardProps = {
  title: string;
  description: string;
  variant: TBenchVariant;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
};
