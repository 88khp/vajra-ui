import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, ScrollView, TouchableOpacity, View } from 'react-native';

import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { resolveSpacing } from '../../utils/spacing-props';
import { Text } from '../../core/text';
import { TTabBarProps } from './tab-bar-types';

const TabBarComponent: React.FC<TTabBarProps> = ({
  tabs,
  value,
  onChange,
  variant = 'pills',
  trackBg,
  trackRounded,
  trackPadding = 's-1',
  indicatorBg,
  indicatorRounded,
  underlineHeight = 2,
  activeColor = 'text',
  inactiveColor = 'textMuted',
  labelProps,
  scrollable = false,
}) => {
  const isUnderline = variant === 'underline';
  const isSegmented = variant === 'segmented';
  const resolvedTrackBg = trackBg ?? (isUnderline ? 'transparent' : 'surfaceRaised');
  const resolvedTrackRounded =
    trackRounded ?? (isSegmented ? 'r-2' : isUnderline ? 'r-0' : 'r-full');
  const resolvedIndicatorBg = indicatorBg ?? (isUnderline ? 'primary' : 'surface');
  const resolvedIndicatorRounded = indicatorRounded ?? (isSegmented ? 'r-2' : 'r-full');

  const { colors, rounded: r, spacing: spacingTokens } = useVajraTheme();
  const { p: pad } = resolveSpacing({ p: isUnderline ? undefined : trackPadding }, spacingTokens);
  const padding = pad ?? 0;

  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(0)).current;
  const prevValue = useRef<string | null>(null);

  const handleLayout = useCallback((tabValue: string, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;

    // onLayout can fire while a sibling/ancestor is still committing (e.g. two
    // TabBar instances mounting close together), which trips React's
    // "setState while rendering a different component" warning. Deferring to
    // the next frame guarantees this update always lands after commit.
    requestAnimationFrame(() => {
      setTabLayouts(prev => ({ ...prev, [tabValue]: { x, width } }));
    });
  }, []);

  useEffect(() => {
    const layout = tabLayouts[value];

    if (!layout) {
      return;
    }

    if (prevValue.current === null) {
      indicatorX.setValue(layout.x);
      indicatorW.setValue(layout.width);
      prevValue.current = value;

      return;
    }

    Animated.parallel([
      Animated.spring(indicatorX, { toValue: layout.x, useNativeDriver: false, bounciness: 0 }),
      Animated.spring(indicatorW, { toValue: layout.width, useNativeDriver: false, bounciness: 0 }),
    ]).start();

    prevValue.current = value;
  }, [value, tabLayouts, indicatorX, indicatorW]);

  const track = (
    <View
      style={{
        flex: 1,
        backgroundColor: colors[resolvedTrackBg],
        borderRadius: r[resolvedTrackRounded],
        padding,
        flexDirection: 'row',
        position: 'relative',
      }}
    >
      {/* Sliding indicator */}
      <Animated.View
        style={
          isUnderline
            ? {
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: underlineHeight,
                width: indicatorW,
                transform: [{ translateX: indicatorX }],
                backgroundColor: colors[resolvedIndicatorBg],
                borderRadius: r[resolvedIndicatorRounded],
              }
            : {
                position: 'absolute',
                top: padding,
                left: 0,
                bottom: padding,
                width: indicatorW,
                transform: [{ translateX: indicatorX }],
                backgroundColor: colors[resolvedIndicatorBg],
                borderRadius: r[resolvedIndicatorRounded],
              }
        }
      />

      {tabs.map(tab => {
        const isActive = tab.value === value;

        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onChange(tab.value)}
            onLayout={e => handleLayout(tab.value, e)}
            style={{
              flex: scrollable ? undefined : 1,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 12,
              zIndex: 1,
            }}
            activeOpacity={0.8}
          >
            <Text variant="label" color={isActive ? activeColor : inactiveColor} {...labelProps}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
        {track}
      </ScrollView>
    );
  }

  return track;
};

export const TabBar = memo(TabBarComponent);
TabBar.displayName = 'TabBar';
