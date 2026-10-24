import React, { memo, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { TVajraColors } from '../../../../vajra-theme/colors';
import { useVajraTheme } from '../../../../vajra-theme';
import { SWITCH_SIZE_STYLES } from '../../switch-constants';
import { TSwitchSize } from '../../switch-types';

type TSwitchIndicatorProps = {
  isSelected: boolean;
  isDisabled: boolean;
  color?: TVajraColors;
  size?: TSwitchSize;
};

const SwitchIndicatorComponent: React.FC<TSwitchIndicatorProps> = ({
  isSelected,
  isDisabled,
  color = 'primary',
  size = 'md',
}) => {
  const { colors } = useVajraTheme();
  const { trackW, trackH, thumb, thumbOffset } = SWITCH_SIZE_STYLES[size];
  const thumbOn = trackW - thumb - thumbOffset;
  const anim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isSelected ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isSelected, anim]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [thumbOffset, thumbOn] });
  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors[color]],
  });

  return (
    <Animated.View
      style={{
        width: trackW,
        height: trackH,
        borderRadius: trackH / 2,
        backgroundColor: trackColor,
        justifyContent: 'center',
        opacity: isDisabled ? 0.4 : 1,
      }}
    >
      <Animated.View
        style={{
          width: thumb,
          height: thumb,
          borderRadius: thumb / 2,
          backgroundColor: colors.surface,
          transform: [{ translateX }],
        }}
      />
    </Animated.View>
  );
};

export const SwitchIndicator = memo(SwitchIndicatorComponent);
SwitchIndicator.displayName = 'SwitchIndicator';
