import { TVajraIconComponent } from '../../../icon-button/icon-button-types';

export type TMenuItemProps = {
  label: string;
  onPress: () => void;
  icon?: TVajraIconComponent;
  isDestructive?: boolean;
  isDisabled?: boolean;
  testID?: string;
};
