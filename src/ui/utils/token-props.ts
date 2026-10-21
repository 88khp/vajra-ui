import { TVajraTheme } from '../vajra-theme/use-vajra-theme';

type TTokenKind = 'color' | 'rounded' | 'spacing';

export type TTokenSpec = ReadonlyMap<string, TTokenKind>;

const SPACING_TOKEN_KEYS = [
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'gap',
] as const;

const ROUNDED_TOKEN_KEYS = ['rounded', 'roundedT', 'roundedB', 'roundedL', 'roundedR'] as const;

const createTokenSpec = (tokens: Record<TTokenKind, readonly string[]>): TTokenSpec =>
  new Map(
    (Object.keys(tokens) as TTokenKind[]).flatMap(kind =>
      tokens[kind].map(key => [key, kind] as const),
    ),
  );

export const BOX_TOKEN_SPEC = createTokenSpec({
  color: ['bg', 'borderColor'],
  rounded: ROUNDED_TOKEN_KEYS,
  spacing: SPACING_TOKEN_KEYS,
});

export const TEXT_INPUT_TOKEN_SPEC = createTokenSpec({
  color: ['bg', 'borderColor', 'color', 'placeholderColor'],
  rounded: ['rounded'],
  spacing: SPACING_TOKEN_KEYS,
});

export const TEXT_TOKEN_SPEC = createTokenSpec({
  color: [],
  rounded: [],
  spacing: ['m', 'mx', 'my', 'mt', 'mb', 'ml', 'mr'],
});

/**
 * Copies props, replacing token props (color, rounded, spacing) with their theme
 * values, in one pass. Token props passed as `undefined` are dropped instead of
 * forwarded, so core's style builder only sees the props that were set.
 */
export const resolveTokenProps = <T extends object>(
  props: T,
  spec: TTokenSpec,
  theme: TVajraTheme,
): Record<string, unknown> => {
  const resolved: Record<string, unknown> = {};

  for (const prop in props) {
    const value = props[prop] as unknown;
    const kind = spec.get(prop);

    if (kind === undefined) {
      resolved[prop] = value;
      continue;
    }

    if (value === undefined) continue;

    const scale: Partial<Record<string, unknown>> =
      kind === 'color' ? theme.colors : kind === 'rounded' ? theme.rounded : theme.spacing;

    resolved[prop] = scale[value as string];
  }

  return resolved;
};
