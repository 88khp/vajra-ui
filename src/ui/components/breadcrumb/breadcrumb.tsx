import React, { Fragment, memo } from 'react';
import { ScrollView } from 'react-native';

import { Pressable } from '../../core/pressable';
import { Row } from '../../core/row';
import { Text } from '../../core/text';
import { TBreadcrumbProps } from './breadcrumb-types';

const BreadcrumbComponent: React.FC<TBreadcrumbProps> = ({
  items,
  separator = '/',
  activeColor = 'text',
  inactiveColor = 'textMuted',
  separatorColor = 'textMuted',
  testID,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} testID={testID}>
      <Row align="center" gap="s-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const content = (
            <Text variant="label" color={isLast ? activeColor : inactiveColor}>
              {item.label}
            </Text>
          );

          return (
            <Fragment key={item.label}>
              {item.onPress ? (
                <Pressable onPress={item.onPress} accessibilityRole="link">
                  {content}
                </Pressable>
              ) : (
                content
              )}
              {!isLast && (
                <Text variant="label" color={separatorColor}>
                  {separator}
                </Text>
              )}
            </Fragment>
          );
        })}
      </Row>
    </ScrollView>
  );
};

export const Breadcrumb = memo(BreadcrumbComponent);
Breadcrumb.displayName = 'Breadcrumb';
