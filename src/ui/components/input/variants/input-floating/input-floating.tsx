import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import { useVajraTheme } from '../../../../vajra-theme/use-vajra-theme';
import { fontVariants, TFontVariant } from '../../../../vajra-theme/tokens/font-tokens';
import { Row } from '../../../../core/row';
import { TextInput } from '../../../../core/text-input';
import { InputError } from '../../components/input-error/input-error';
import { InputHelper } from '../../components/input-helper/input-helper';
import { InputRoot } from '../../components/input-root/input-root';
import { useInputContext } from '../../input-context';
import { getInputSizeStyle } from '../../input-utils';
import { TInputFloatingProps } from './input-floating-types';
import { TTextInputInstance } from '../../../../core/text-input/text-input-types';

const FLOATED_TOP = 8;

type TFloatingFieldProps = Omit<
  TInputFloatingProps,
  'label' | 'helperText' | 'errorText' | 'isInvalid' | 'isDisabled' | 'isReadOnly'
> & {
  label: string;
  inputRef: React.RefObject<TTextInputInstance>;
};

const FloatingLabelField = ({
  label,
  variant = 'outline',
  rounded,
  size = 'md',
  value,
  defaultValue,
  onChangeText,
  inputRef,
  startElement,
  endElement,
  ...fieldProps
}: TFloatingFieldProps) => {
  const { colors, rounded: roundedTokens } = useVajraTheme();
  const { isFocused, hasError, isDisabled, setIsFocused } = useInputContext();

  const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '');
  const displayValue = value ?? internalValue;
  const isFloating = isFocused || (typeof displayValue === 'string' && displayValue.length > 0);

  const sizeStyle = getInputSizeStyle(size);
  const labelVariant = sizeStyle.labelText.variant ?? 'label';
  const labelFontProps = fontVariants[labelVariant as TFontVariant];
  const inputVariant = sizeStyle.inputText.variant ?? 'body';
  const inputFontProps = fontVariants[inputVariant as TFontVariant];

  const containerHeight = FLOATED_TOP + labelFontProps.lineHeight + 4 + sizeStyle.height;
  const inputTop = FLOATED_TOP + labelFontProps.lineHeight + 4;
  const idleLabelTop = (containerHeight - inputFontProps.lineHeight - 4) / 2;

  const anim = useRef(new Animated.Value(isFloating ? 1 : 0)).current;

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFloating ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFloating]);

  const labelTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [idleLabelTop, FLOATED_TOP],
  });
  const labelFontSize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [inputFontProps.fontSize, labelFontProps.fontSize],
  });
  const labelLineHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [inputFontProps.lineHeight, labelFontProps.lineHeight],
  });

  const activeBorderColor = hasError
    ? colors.error
    : isFocused
      ? colors.borderFocus
      : colors.border;
  const labelColor = hasError ? colors.error : isFocused ? colors.borderFocus : colors.textMuted;
  const borderRadius = rounded ? roundedTokens['r-full'] : roundedTokens['r-2'];
  const paddingHorizontal = rounded ? 20 : 12;

  const containerStyle =
    variant === 'flushed'
      ? {
          height: containerHeight,
          borderBottomWidth: 1,
          borderBottomColor: activeBorderColor,
          opacity: isDisabled ? 0.4 : 1,
        }
      : {
          height: containerHeight,
          borderWidth: 1,
          borderColor: activeBorderColor,
          borderRadius,
          backgroundColor: variant === 'filled' ? colors.surfaceSunken : colors.background,
          opacity: isDisabled ? 0.4 : 1,
        };

  return (
    <View style={containerStyle} pointerEvents="box-none">
      <Animated.Text
        style={{
          position: 'absolute',
          left: paddingHorizontal,
          top: labelTop,
          fontSize: labelFontSize,
          lineHeight: labelLineHeight,
          fontWeight: inputFontProps.fontWeight,
          color: labelColor,
        }}
        pointerEvents="none"
      >
        {label}
      </Animated.Text>

      {/* TextInput covers the full container so taps land on it directly */}
      <Row
        align="center"
        gap="s-2"
        style={{
          position: 'absolute',
          left: paddingHorizontal,
          right: paddingHorizontal,
          top: 0,
          bottom: 0,
          paddingTop: inputTop,
        }}
      >
        {startElement}
        <TextInput
          ref={inputRef}
          style={{
            flex: 1,
            fontSize: inputFontProps.fontSize,
            lineHeight: inputFontProps.lineHeight,
          }}
          color="text"
          placeholderColor="textMuted"
          editable={!isDisabled}
          value={value}
          defaultValue={defaultValue}
          onChangeText={(text: string) => {
            setInternalValue(text);
            onChangeText?.(text);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...fieldProps}
        />
        {endElement}
      </Row>
    </View>
  );
};

const InputFloatingComponent = forwardRef<TTextInputInstance, TInputFloatingProps>(
  (
    { label = '', helperText, errorText, isInvalid, isDisabled, isReadOnly, size, ...rest },
    ref,
  ) => (
    <InputRoot
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      errorText={errorText}
      size={size}
    >
      <FloatingLabelField
        label={label}
        inputRef={ref as React.RefObject<TTextInputInstance>}
        {...rest}
      />
      {errorText !== undefined && <InputError>{errorText}</InputError>}
      {helperText !== undefined && <InputHelper>{helperText}</InputHelper>}
    </InputRoot>
  ),
);

InputFloatingComponent.displayName = 'Input.Floating';

export const InputFloating = InputFloatingComponent;
