import React, { memo } from 'react';
import { Platform, Text as RNText, TextProps, TextStyle } from 'react-native';

import { composeStyle, splitStyleProps, TEXT_STYLE_SPEC, TStyleSpec } from '@88khp/vajra-ui-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { resolveTokenProps, TEXT_TOKEN_SPEC } from '../../utils/token-props';
import { TTextProps } from './text-types';

// Core's text spec plus fontStyle, so italics are part of the cached style.
const VAJRA_TEXT_STYLE_SPEC: TStyleSpec = {
  ...TEXT_STYLE_SPEC,
  keys: new Map([...TEXT_STYLE_SPEC.keys, ['fontStyle', 'fontStyle']]),
};

// fontVariant is an array, which core's style cache can't key on, so it gets
// its own style object, shared per typography variant.
const fontVariantStyles = new WeakMap<object, TextStyle>();

const getFontVariantStyle = (variantStyle: {
  fontVariant?: TextStyle['fontVariant'];
}): TextStyle | undefined => {
  if (variantStyle.fontVariant === undefined) return undefined;

  let style = fontVariantStyles.get(variantStyle);

  if (style === undefined) {
    style = { fontVariant: variantStyle.fontVariant };
    fontVariantStyles.set(variantStyle, style);
  }

  return style;
};

// Renders RN Text directly with core's style builder, so the built style is
// shared by value across every Text with the same resolved tokens.
// Memoized because text children are usually strings, which compare equal.
export const Text = memo(
  ({
    variant = 'body',
    fontSize,
    lineHeight,
    font,
    fontWeight,
    fontStyle,
    color,
    ...rest
  }: TTextProps) => {
    const theme = useVajraTheme();
    const fontVariantStyle = theme.typography[variant];
    const { fonts: fontsMap, defaultFont } = theme as unknown as {
      fonts: Record<string, Record<string, string>>;
      defaultFont?: string;
    };
    const familyKey = font ?? defaultFont;
    const family = familyKey != null ? fontsMap?.[familyKey] : undefined;
    const resolvedWeight = fontWeight ?? fontVariantStyle.fontWeight;
    const italicKey = `${resolvedWeight}i`;
    const hasItalicFontFile = family?.[italicKey] != null;
    const resolvedFontFamily =
      family != null
        ? fontStyle === 'italic' && family[italicKey]
          ? family[italicKey]
          : family[resolvedWeight]
        : undefined;

    const props = resolveTokenProps(rest, TEXT_TOKEN_SPEC, theme);

    props.fontSize = fontSize != null ? theme.fontSizes[fontSize] : fontVariantStyle.fontSize;
    props.lineHeight =
      lineHeight ?? (fontSize != null ? theme.lineHeights[fontSize] : fontVariantStyle.lineHeight);
    props.fontWeight = resolvedFontFamily != null ? undefined : resolvedWeight;
    props.fontFamily = resolvedFontFamily;
    props.color = color !== undefined ? theme.colors[color] : theme.colors.text;
    props.fontStyle = hasItalicFontFile
      ? Platform.OS === 'ios'
        ? fontStyle
        : undefined
      : fontStyle;

    const [textStyle, textProps] = splitStyleProps<TextProps, TextStyle>(
      props,
      VAJRA_TEXT_STYLE_SPEC,
    );
    const variantStyle = getFontVariantStyle(fontVariantStyle);

    return (
      <RNText
        {...textProps}
        style={
          variantStyle === undefined
            ? composeStyle(textStyle, rest.style)
            : [textStyle, variantStyle, rest.style]
        }
      />
    );
  },
);

Text.displayName = 'TextVariant';
