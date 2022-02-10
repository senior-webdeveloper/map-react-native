/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { TextProps } from 'react-native';

import styled from 'styled-components/native';

export const NormalText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  font-size: ${({ theme }) => theme.textStyle.heading['font-size']};
  line-height: ${({ theme }) => theme.textStyle.heading['line-height']};
`;
const TitleText: React.FC<TextProps> = ({ children, ...rest }) => {
  return (
    <NormalText {...rest} allowFontScaling={false}>
      {children}
    </NormalText>
  );
};

export default TitleText;
