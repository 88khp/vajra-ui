import React, { memo, useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

import { Modal } from '../modal/modal';
import { TDrawerProps } from './drawer-types';

const DRAG_DISMISS_THRESHOLD = 80;

const DrawerComponent: React.FC<TDrawerProps> = ({
  isVisible,
  onClose,
  children,
  edge = 'left',
  closeOnBackdropPress = true,
  animation = 'slide',
  dismissOnDrag = true,
  width = 300,
  bg = 'surface',
  rounded,
  p = 's-4',
  backdropColor = 'overlay',
  testID,
}) => {
  const dragX = useRef(new Animated.Value(0)).current;
  const isRight = edge === 'right';

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) =>
        dismissOnDrag && (isRight ? gesture.dx > 4 : gesture.dx < -4),
      onPanResponderMove: (_evt, gesture) => {
        if (isRight ? gesture.dx > 0 : gesture.dx < 0) dragX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_evt, gesture) => {
        const dragged = isRight ? gesture.dx : -gesture.dx;

        if (dragged > DRAG_DISMISS_THRESHOLD) {
          onClose();
        }

        Animated.spring(dragX, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
  ).current;

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      closeOnBackdropPress={closeOnBackdropPress}
      animation={animation}
      contentAlign={edge}
      bg={bg}
      roundedL={isRight ? rounded : undefined}
      roundedR={isRight ? undefined : rounded}
      p={p}
      backdropColor={backdropColor}
      testID={testID}
    >
      <Animated.View
        {...(dismissOnDrag ? panResponder.panHandlers : {})}
        style={{ width, height: '100%', transform: [{ translateX: dragX }] }}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};

export const Drawer = memo(DrawerComponent);
Drawer.displayName = 'Drawer';
