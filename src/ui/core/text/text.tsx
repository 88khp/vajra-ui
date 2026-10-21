import React, { memo } from 'react';
import { Platform } from 'react-native';

import { CoreText } from '@devraj-labs/vajra-ui-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { resolveSpacing } from '../../utils/spacing-props';
import { TTextProps } from './text-types';

export const Text = memo(
  ({
    variant = 'body',
    fontSize,
    lineHeight,
    font,
    fontWeight,
    fontStyle,
    color,
    m,
    mx,
    my,
    mt,
    mb,
    ml,
    mr,
    style,
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
    const {
      m: margin,
      mx: marginH,
      my: marginV,
      mt: marginT,
      mb: marginB,
      ml: marginL,
      mr: marginR,
    } = resolveSpacing({ m, mx, my, mt, mb, ml, mr }, theme.spacing);

    return (
      <CoreText
        fontSize={fontSize != null ? theme.fontSizes[fontSize] : fontVariantStyle.fontSize}
        lineHeight={
          lineHeight ??
          (fontSize != null ? theme.lineHeights[fontSize] : fontVariantStyle.lineHeight)
        }
        fontWeight={resolvedFontFamily != null ? undefined : resolvedWeight}
        fontFamily={resolvedFontFamily}
        color={color !== undefined ? theme.colors[color] : theme.colors.text}
        style={[
          {
            fontVariant: fontVariantStyle.fontVariant,
            margin,
            marginHorizontal: marginH,
            marginVertical: marginV,
            marginTop: marginT,
            marginBottom: marginB,
            marginLeft: marginL,
            marginRight: marginR,
            fontStyle: hasItalicFontFile
              ? Platform.OS === 'ios'
                ? fontStyle
                : undefined
              : fontStyle,
          },
          ...(Array.isArray(style) ? style : style ? [style] : []),
        ]}
        {...rest}
      />
    );
  },
);

Text.displayName = 'TextVariant';
