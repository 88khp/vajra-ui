import { TVajraIconComponent } from '../icon-button/icon-button-types';

export type TMenuAction = {
  label: string;
  onPress: () => void;
  icon?: TVajraIconComponent;
  isDestructive?: boolean;
  isDisabled?: boolean;
};

export type TMenuProps = {
  isVisible: boolean;
  onClose: () => void;
  actions: TMenuAction[];
  title?: string;
  testID?: string;
};
