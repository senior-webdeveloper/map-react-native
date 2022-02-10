import React from 'react-native';
import styled from 'styled-components/native';
import {
  variant,
  color,
  space,
  flexbox,
  layout,
  border,
  shadow,
  position,
  PositionProps,
  SpaceProps,
  FlexboxProps,
  LayoutProps,
  BorderProps,
  ShadowProps,
  ColorProps,
} from 'styled-system';

const variants = {
  default: {},
  shadow: {
    elevation: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowColor: 'rgba(21, 46, 88, 0.3)',
    shadowOffset: {
      width: 2,
      height: 7,
    },
  },
};

interface VariantProps {
  variant?: keyof typeof variants;
}

export const Box = styled.View<
  SpaceProps &
    FlexboxProps &
    LayoutProps &
    BorderProps &
    ShadowProps &
    ColorProps &
    VariantProps &
    PositionProps
>(
  color,
  space,
  flexbox,
  layout,
  border,
  shadow,
  position,
  variant({ variants }),
);
