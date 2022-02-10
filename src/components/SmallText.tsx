/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { TextProps } from 'react-native-svg';

import styled from 'styled-components/native';

export const NormalText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.light};
  font-size: ${({ theme }) => theme.textStyle.small['font-size']};
  line-height: ${({ theme }) => theme.textStyle.small['line-height']};
`;
const SmallText: React.FC<TextProps> = ({ children, ...rest }) => {
  return (
    <NormalText {...rest} allowFontScaling={false}>
      {children}
    </NormalText>
  );
};

export default SmallText;
