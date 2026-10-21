import { StyleProp, ViewStyle } from 'react-native';
import { Edge } from 'react-native-safe-area-context';

import { TVajraColors } from '../../vajra-theme/colors';

type TLoaderProps = {
  isLoading?: boolean;
  loader?: React.ReactNode;
  loaderText?: React.ReactNode;
};

export type TSafeAreaScreenWrapperProps = {
  style?: StyleProp<ViewStyle>;
  bg?: TVajraColors;
  edges?: Edge[];
  loader?: TLoaderProps;
  children: React.ReactNode;
};
