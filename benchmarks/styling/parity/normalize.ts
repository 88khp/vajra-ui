/**
 * Normalizes a rendered BenchmarkCard host tree into the visual and accessibility
 * properties the spec defines.
 *
 * Normalization only rewrites values that are equivalent CSS:
 *  - padding shorthands expand to per-side values
 *  - per-corner radii collapse to borderRadius when all four are equal
 *  - per-side border widths and colors collapse to borderWidth / borderColor when equal
 *  - equal rowGap and columnGap collapse to gap (NativeWind emits the pair)
 *  - flexDirection "column" is dropped, since it is React Native's default
 *  - fontWeight is compared as a string ("600" and 600 are the same weight)
 *
 * Anything else that differs fails the comparison. Unrelated keys (for example
 * Tamagui's borderStyle) are dropped by the whitelist.
 */
import { StyleSheet } from 'react-native';
import type { ReactTestRendererJSON } from 'react-test-renderer';

export const VISUAL_KEYS = [
  'backgroundColor',
  'borderColor',
  'borderWidth',
  'borderRadius',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'gap',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'width',
  'height',
  'color',
  'fontSize',
  'lineHeight',
  'fontWeight',
] as const;

export type TNormalizedNode = {
  type: string;
  role?: string;
  label?: string;
  text?: string;
  style: Record<string, string | number>;
};

type TStyle = Record<string, unknown>;

const CORNERS = [
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
] as const;
const SIDE_WIDTHS = ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'] as const;
const SIDE_COLORS = ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'] as const;

const allEqual = (keys: readonly string[], style: TStyle): boolean => {
  const values = keys.map(key => style[key]);
  return values.every(v => v !== undefined && v === values[0]);
};

/** Expands padding shorthands into per-side values. */
const expandPadding = (style: TStyle): TStyle => {
  const { padding, paddingHorizontal, paddingVertical, ...rest } = style;
  if (padding === undefined && paddingHorizontal === undefined && paddingVertical === undefined) {
    return rest;
  }
  const all = padding as number | undefined;
  const h = (paddingHorizontal as number | undefined) ?? all;
  const v = (paddingVertical as number | undefined) ?? all;
  return {
    ...rest,
    paddingTop: rest.paddingTop ?? v,
    paddingBottom: rest.paddingBottom ?? v,
    paddingLeft: rest.paddingLeft ?? h,
    paddingRight: rest.paddingRight ?? h,
  };
};

/** Collapses equal per-corner and per-side values into their shorthand. */
const collapseBorders = (style: TStyle): TStyle => {
  const out: TStyle = { ...style };
  if (allEqual(CORNERS, out)) {
    out.borderRadius = out[CORNERS[0]];
  }
  for (const key of CORNERS) delete out[key];
  if (allEqual(SIDE_WIDTHS, out)) {
    out.borderWidth = out[SIDE_WIDTHS[0]];
  }
  for (const key of SIDE_WIDTHS) delete out[key];
  if (allEqual(SIDE_COLORS, out)) {
    out.borderColor = out[SIDE_COLORS[0]];
  }
  for (const key of SIDE_COLORS) delete out[key];
  return out;
};

/** Collapses equal rowGap and columnGap into gap, which is what React Native's gap means. */
const collapseGap = (style: TStyle): TStyle => {
  const out: TStyle = { ...style };
  if (out.rowGap !== undefined && out.rowGap === out.columnGap) {
    out.gap = out.rowGap;
  }
  delete out.rowGap;
  delete out.columnGap;
  return out;
};

const pickVisual = (flat: TStyle): Record<string, string | number> => {
  const canonical = collapseGap(collapseBorders(expandPadding(flat)));
  if (canonical.flexDirection === 'column') {
    delete canonical.flexDirection;
  }
  const out: Record<string, string | number> = {};
  for (const key of VISUAL_KEYS) {
    const value = canonical[key];
    if (value === undefined || value === null) continue;
    out[key] = key === 'fontWeight' ? String(value) : (value as string | number);
  }
  return out;
};

const textOf = (node: ReactTestRendererJSON | string | null): string => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  return (node.children ?? []).map(child => textOf(child as ReactTestRendererJSON | string)).join('');
};

/** Walks host nodes in document order and returns one normalized entry per host node. */
export const normalizeTree = (
  root: ReactTestRendererJSON | ReactTestRendererJSON[] | null,
): TNormalizedNode[] => {
  const out: TNormalizedNode[] = [];
  const visit = (node: ReactTestRendererJSON | string) => {
    if (typeof node === 'string') return;
    const props = node.props as Record<string, unknown>;
    const flat = (StyleSheet.flatten(props.style as never) ?? {}) as TStyle;
    const isText = node.type === 'Text';
    out.push({
      type: String(node.type),
      role: props.accessibilityRole as string | undefined,
      label: props.accessibilityLabel as string | undefined,
      text: isText ? textOf(node) : undefined,
      style: pickVisual(flat),
    });
    (node.children ?? []).forEach(child => visit(child as ReactTestRendererJSON | string));
  };
  (Array.isArray(root) ? root : root ? [root] : []).forEach(visit);
  return out;
};
