/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { TextProps } from 'react-native';

import styled from 'styled-components/native';

export const NormalText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: ${({ theme }) => theme.textStyle.normal['font-size']};
  line-height: ${({ theme }) => theme.textStyle.normal['line-height']};
`;

const Text: React.FC<TextProps> = ({ children, ...rest }) => {
  return (
    <NormalText {...rest} allowFontScaling={false}>
      {children}
    </NormalText>
  );
};

export default Text;
