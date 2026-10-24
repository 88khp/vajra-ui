import React, { memo } from 'react';

import { Separator } from '../../core/separator';
import { Row } from '../../core/row';
import { Text } from '../../core/text';
import { TDividerProps } from './divider-types';

const DividerComponent: React.FC<TDividerProps> = ({
  orientation = 'horizontal',
  thickness,
  color,
  variant,
  inset,
  label,
}) => {
  if (orientation === 'horizontal' && label) {
    return (
      <Row align="center" gap="s-3" mx={inset}>
        <Row style={{ flex: 1 }}>
          <Separator
            orientation={orientation}
            thickness={thickness}
            color={color}
            variant={variant}
          />
        </Row>
        <Text variant="label" color="textMuted">
          {label}
        </Text>
        <Row style={{ flex: 1 }}>
          <Separator
            orientation={orientation}
            thickness={thickness}
            color={color}
            variant={variant}
          />
        </Row>
      </Row>
    );
  }

  if (orientation === 'horizontal' && inset) {
    return (
      <Row mx={inset} style={{ flex: 1 }}>
        <Separator
          orientation={orientation}
          thickness={thickness}
          color={color}
          variant={variant}
        />
      </Row>
    );
  }

  return (
    <Separator orientation={orientation} thickness={thickness} color={color} variant={variant} />
  );
};

export const Divider = memo(DividerComponent);
Divider.displayName = 'Divider';
