import React, { forwardRef } from 'react';

import { InputContainer } from '../../components/input-container/input-container';
import { InputError } from '../../components/input-error/input-error';
import { InputField } from '../../components/input-field/input-field';
import { InputHelper } from '../../components/input-helper/input-helper';
import { InputLabel } from '../../components/input-label/input-label';
import { InputRoot } from '../../components/input-root/input-root';
import { TInputProps } from '../../input-types';
import { TTextInputInstance } from '../../../../core/text-input/text-input-types';

const InputFlushedComponent = forwardRef<TTextInputInstance, TInputProps>(
  (
    {
      label,
      helperText,
      errorText,
      isInvalid,
      isDisabled,
      isReadOnly,
      size,
      startElement,
      endElement,
      ...fieldProps
    },
    ref,
  ) => (
    <InputRoot
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      errorText={errorText}
      size={size}
    >
      {label !== undefined && <InputLabel>{label}</InputLabel>}

      <InputContainer
        borderColor="transparent"
        borderWidth={0}
        focusBorderColor="borderFocus"
        errorBorderColor="error"
        style={{ borderBottomWidth: 1 }}
        px="s-3"
        py="s-2"
      >
        {startElement}
        <InputField ref={ref} size={size} {...fieldProps} />
        {endElement}
      </InputContainer>

      {errorText !== undefined && <InputError>{errorText}</InputError>}
      {helperText !== undefined && <InputHelper>{helperText}</InputHelper>}
    </InputRoot>
  ),
);

InputFlushedComponent.displayName = 'Input.Flushed';

export const InputFlushed = InputFlushedComponent;
