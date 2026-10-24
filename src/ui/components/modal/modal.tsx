import React, { memo, useEffect, useRef } from 'react';
import { Animated, Modal as RNModal, Pressable as RNPressable, StyleSheet } from 'react-native';

import { Box } from '../../core/box';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TModalProps } from './modal-types';

const ModalComponent: React.FC<TModalProps> = ({
  isVisible,
  onClose,
  children,
  closeOnBackdropPress = true,
  animation = 'fade',
  contentAlign = 'center',
  bg = 'surface',
  rounded = 'r-4',
  roundedT,
  roundedL,
  roundedR,
  p = 's-4',
  backdropColor = 'overlay',
  testID,
}) => {
  const { colors } = useVajraTheme();
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(animation === 'scale' ? 0.9 : 1)).current;

  useEffect(() => {
    Animated.timing(backdropOpacity, {
      toValue: isVisible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();

    if (animation === 'scale') {
      Animated.spring(contentScale, {
        toValue: isVisible ? 1 : 0.9,
        useNativeDriver: true,
        bounciness: 6,
      }).start();
    }
  }, [isVisible, backdropOpacity, contentScale, animation]);

  // RN's native animationType handles 'fade' and 'slide'; 'scale' rides on 'fade'
  // and layers its own Animated.View scale transform on the content.
  const nativeAnimationType = animation === 'scale' ? 'fade' : animation;

  return (
    <RNModal
      visible={isVisible}
      transparent
      animationType={nativeAnimationType}
      onRequestClose={onClose}
      testID={testID}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: colors[backdropColor],
          opacity: backdropOpacity,
          alignItems:
            contentAlign === 'left'
              ? 'flex-start'
              : contentAlign === 'right'
                ? 'flex-end'
                : 'center',
          justifyContent: contentAlign === 'bottom' ? 'flex-end' : 'center',
        }}
      >
        <RNPressable
          style={StyleSheet.absoluteFill}
          onPress={closeOnBackdropPress ? onClose : undefined}
          accessibilityLabel="Close"
          testID={testID ? `${testID}-backdrop` : undefined}
        />
        <Animated.View
          style={[
            contentAlign === 'bottom'
              ? { width: '100%' }
              : contentAlign === 'left' || contentAlign === 'right'
                ? { height: '100%' }
                : {},
            animation === 'scale' ? { transform: [{ scale: contentScale }] } : {},
          ]}
        >
          <Box
            bg={bg}
            rounded={
              roundedT === undefined && roundedL === undefined && roundedR === undefined
                ? rounded
                : undefined
            }
            roundedT={roundedT}
            roundedL={roundedL}
            roundedR={roundedR}
            p={p}
            style={contentAlign === 'left' || contentAlign === 'right' ? { flex: 1 } : undefined}
            testID={testID ? `${testID}-content` : undefined}
          >
            {children}
          </Box>
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
};

export const Modal = memo(ModalComponent);
Modal.displayName = 'Modal';
