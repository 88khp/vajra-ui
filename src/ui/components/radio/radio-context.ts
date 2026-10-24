import { createContext, useContext } from 'react';

import { TVajraColors } from '../../vajra-theme/colors';
import { TRadioSize } from './radio-types';

type TRadioContext = {
  selectedValue: string;
  onChange: (value: string) => void;
  color?: TVajraColors;
  isDisabled: boolean;
  size: TRadioSize;
};

const RadioContext = createContext<TRadioContext | null>(null);

export const RadioContextProvider = RadioContext.Provider;

export const useRadioContext = (): TRadioContext => {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('Radio must be used inside RadioRoot');

  return ctx;
};
