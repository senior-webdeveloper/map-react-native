import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { ViewProps } from 'react-native';

interface BoxProps {
  color?: string;
}

interface Props {
  children: ReactNode;
}

export const BoxContainer = styled.View<BoxProps>`
  background-color: ${({ theme, color }) => color || theme.colors.textWhite};
  elevation: 10;
  border-radius: 12px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  shadow-color: rgba(21, 46, 88, 0.3);
  shadow-offset: 0px 2px;
`;

export default function BoxShadow({
  children,
  ...rest
}: Props & ViewProps): JSX.Element {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <BoxContainer {...rest}>{children}</BoxContainer>;
}
