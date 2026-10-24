import { createContext, useContext } from 'react';

import { TVajraIconComponent } from '../icon-button/icon-button-types';
import { TVajraColors } from '../../vajra-theme/colors';
import { TCheckboxSize } from './checkbox-types';

type TCheckboxContext = {
  selectedValues: string[];
  onChange: (value: string) => void;
  color?: TVajraColors;
  isDisabled: boolean;
  size: TCheckboxSize;
  icon?: TVajraIconComponent;
};

const CheckboxContext = createContext<TCheckboxContext | null>(null);

export const CheckboxContextProvider = CheckboxContext.Provider;

export const useCheckboxContext = (): TCheckboxContext => {
  const ctx = useContext(CheckboxContext);
  if (!ctx) throw new Error('Checkbox must be used inside Checkbox.Root');

  return ctx;
};
