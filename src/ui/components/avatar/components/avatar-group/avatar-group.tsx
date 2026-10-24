import React, { Children, cloneElement, isValidElement, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useVajraTheme } from '../../../../vajra-theme/use-vajra-theme';
import { AVATAR_DEFAULT_SIZE } from '../../avatar-constants';
import { TAvatarGroupProps } from './avatar-group-types';

const AvatarGroupComponent: React.FC<TAvatarGroupProps> = ({
  children,
  size = AVATAR_DEFAULT_SIZE,
  overlap = size * 0.3,
  max,
}) => {
  const { colors } = useVajraTheme();
  const items = Children.toArray(children).filter(isValidElement);
  const visible = max ? items.slice(0, max) : items;
  const hiddenCount = max ? Math.max(items.length - max, 0) : 0;

  return (
    <View style={styles.row}>
      {visible.map((child, index) => (
        <View
          key={child.key ?? index}
          style={{ marginLeft: index === 0 ? 0 : -overlap, zIndex: visible.length - index }}
        >
          {cloneElement(child as React.ReactElement<{ width?: number; height?: number }>, {
            width: size,
            height: size,
          })}
        </View>
      ))}

      {hiddenCount > 0 && (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: -overlap,
            zIndex: 0,
            backgroundColor: colors.surfaceRaised,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{ fontSize: Math.round(size * 0.32), fontWeight: '600', color: colors.text }}
          >
            +{hiddenCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const AvatarGroup = memo(AvatarGroupComponent);
AvatarGroup.displayName = 'AvatarGroup';
