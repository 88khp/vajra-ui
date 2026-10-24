import { createContext, useContext } from 'react';

import { TVajraColors } from '../../vajra-theme/colors';
import { TSwitchSize } from './switch-types';

type TSwitchContext = {
  selectedValue: string;
  onChange: (value: string) => void;
  color?: TVajraColors;
  isDisabled: boolean;
  size: TSwitchSize;
};

const SwitchContext = createContext<TSwitchContext | null>(null);

export const SwitchContextProvider = SwitchContext.Provider;

export const useSwitchContext = (): TSwitchContext => {
  const ctx = useContext(SwitchContext);
  if (!ctx) throw new Error('Switch must be used inside Switch.Root');

  return ctx;
};
