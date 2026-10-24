import React, { forwardRef } from 'react';

import { InputContainer } from '../../components/input-container/input-container';
import { InputError } from '../../components/input-error/input-error';
import { InputField } from '../../components/input-field/input-field';
import { InputHelper } from '../../components/input-helper/input-helper';
import { InputLabel } from '../../components/input-label/input-label';
import { InputRoot } from '../../components/input-root/input-root';
import { TInputProps } from '../../input-types';
import { useInputClearable } from '../../use-input-clearable';
import { TTextInputInstance } from '../../../../core/text-input/text-input-types';

const InputFilledComponent = forwardRef<TTextInputInstance, TInputProps>(
  (
    {
      label,
      helperText,
      errorText,
      isInvalid,
      isDisabled,
      isReadOnly,
      size,
      rounded,
      startElement,
      endElement,
      isClearable,
      clearIcon,
      value,
      onChangeText,
      ...fieldProps
    },
    ref,
  ) => {
    const resolvedEndElement = useInputClearable({
      isClearable,
      clearIcon,
      endElement,
      displayValue: value,
      onClear: () => onChangeText?.(''),
    });

    return (
      <InputRoot
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        errorText={errorText}
        size={size}
      >
        {label !== undefined && <InputLabel>{label}</InputLabel>}

        <InputContainer
          bg="surfaceSunken"
          borderColor="transparent"
          focusBorderColor="borderFocus"
          errorBorderColor="error"
          rounded={rounded ? 'r-full' : 'r-2'}
          px={rounded ? 's-5' : 's-3'}
          py="s-2"
        >
          {startElement}
          <InputField
            ref={ref}
            size={size}
            value={value}
            onChangeText={onChangeText}
            {...fieldProps}
          />
          {resolvedEndElement}
        </InputContainer>

        {errorText !== undefined && <InputError>{errorText}</InputError>}
        {helperText !== undefined && <InputHelper>{helperText}</InputHelper>}
      </InputRoot>
    );
  },
);

InputFilledComponent.displayName = 'Input.Filled';

export const InputFilled = InputFilledComponent;
