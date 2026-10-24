import React, { memo, useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

import { Modal } from '../modal/modal';
import { TSheetProps } from './sheet-types';

const DRAG_DISMISS_THRESHOLD = 80;

const SheetComponent: React.FC<TSheetProps> = ({
  isVisible,
  onClose,
  children,
  closeOnBackdropPress = true,
  animation = 'slide',
  dismissOnDrag = true,
  bg = 'surface',
  roundedT = 'r-4',
  p = 's-4',
  backdropColor = 'overlay',
  testID,
}) => {
  const dragY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => dismissOnDrag && gesture.dy > 4,
      onPanResponderMove: (_evt, gesture) => {
        if (gesture.dy > 0) dragY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_evt, gesture) => {
        if (gesture.dy > DRAG_DISMISS_THRESHOLD) {
          onClose();
        }

        Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
  ).current;

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      closeOnBackdropPress={closeOnBackdropPress}
      animation={animation}
      contentAlign="bottom"
      bg={bg}
      roundedT={roundedT}
      p={p}
      backdropColor={backdropColor}
      testID={testID}
    >
      <Animated.View
        {...(dismissOnDrag ? panResponder.panHandlers : {})}
        style={{ transform: [{ translateY: dragY }] }}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};

export const Sheet = memo(SheetComponent);
Sheet.displayName = 'Sheet';
