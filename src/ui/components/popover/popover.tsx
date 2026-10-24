import React, { memo, useRef, useState } from 'react';
import {
  Dimensions,
  Modal as RNModal,
  Pressable as RNPressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { Box } from '../../core/box';
import { TPopoverProps } from './popover-types';

type TAnchorRect = { x: number; y: number; width: number; height: number };

const PopoverComponent: React.FC<TPopoverProps> = ({
  children,
  content,
  isVisible,
  onClose,
  placement = 'bottom',
  align = 'start',
  bg = 'surfaceRaised',
  rounded = 'r-2',
  closeOnOutsidePress = true,
  testID,
}) => {
  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<TAnchorRect | null>(null);

  const measure = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
    });
  };

  const positionStyle: ViewStyle | undefined = anchor
    ? {
        position: 'absolute',
        [placement === 'top' ? 'bottom' : 'top']:
          placement === 'top'
            ? Dimensions.get('window').height - anchor.y + 4
            : anchor.y + anchor.height + 4,
        [align === 'end' ? 'right' : 'left']:
          align === 'end' ? Dimensions.get('window').width - (anchor.x + anchor.width) : anchor.x,
      }
    : undefined;

  return (
    <>
      <View ref={triggerRef} collapsable={false} onLayout={measure}>
        {children}
      </View>

      <RNModal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
        <RNPressable
          style={StyleSheet.absoluteFill}
          onPress={closeOnOutsidePress ? onClose : undefined}
          accessibilityLabel="Close"
        />

        {anchor && (
          <Box
            bg={bg}
            rounded={rounded}
            p="s-2"
            testID={testID}
            style={[
              ...(positionStyle ? [positionStyle] : []),
              {
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
                minWidth: anchor.width,
              },
            ]}
          >
            {content}
          </Box>
        )}
      </RNModal>
    </>
  );
};

export const Popover = memo(PopoverComponent);
Popover.displayName = 'Popover';
