import React from 'react';
import styled from 'styled-components/native';
import {
  variant,
  color as styledSystemColor,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';

const colorVariants = {
  text: {
    color: 'text',
  },
  blue: {
    color: 'blue',
  },
  blue100: {
    color: 'blue100',
  },
  white: {
    color: 'white',
  },
  orange: {
    color: 'orange',
  },
  red: {
    color: 'red',
  },
};

const textVariants = {
  h1: {
    fontFamily: 'NeuzeitGro-Bol',
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: 'NeuzeitGro-Bol',
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'NeuzeitGro-Bol',
    fontSize: 20,
    lineHeight: 28,
  },
  h4: {
    fontFamily: 'NeuzeitGro-Bol',
    fontSize: 16,
    lineHeight: 24,
  },
  h5: {
    fontFamily: 'NeuzeitGro-Bol',
    fontSize: 17,
    lineHeight: 24,
  },
  button: {
    fontFamily: 'NeuzeitGro-Bol',
    fontSize: 16,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'NeuzeitGro-Reg',
    fontSize: 14,
    lineHeight: 18,
  },
  body: {
    fontFamily: 'NeuzeitGro-Reg',
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontFamily: 'NeuzeitGro-Lig',
    fontSize: 14,
    lineHeight: 24,
  },
  bigger: {
    fontFamily: 'NeuzeitGro-Bol',
    fontSize: 64,
    lineHeight: 72,
  },
  monitorLabel: {
    fontFamily: 'NeuzeitGro-Reg',
    fontSize: 24,
    lineHeight: 32,
  },
  awardCarouselLabel: {
    fontFamily: 'NeuzeitGro-Lig',
    fontSize: 12,
    lineHeight: 16,
  },
};

interface TextProps {
  color: keyof typeof colorVariants;
  type: keyof typeof textVariants;
}

const Text = styled.Text<TextProps>(
  styledSystemColor,
  space,
  typography,
  variant({
    prop: 'type',
    variants: textVariants,
  }),
  variant({
    scale: 'colors',
    prop: 'colors',
    variants: colorVariants,
  }),
);

export function Typography({
  children,
  type = 'body',
  color = 'text',
  ...rest
}: {
  type?: keyof typeof textVariants;
  color?: keyof typeof colorVariants;
  children: React.ReactNode;
} & SpaceProps &
  TypographyProps): JSX.Element {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Text type={type} {...rest} color={color} allowFontScaling={false}>
      {children}
    </Text>
  );
}
