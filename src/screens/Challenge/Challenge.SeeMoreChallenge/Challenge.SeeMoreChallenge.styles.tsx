import { View, Text } from 'react-native';
import styled from 'styled-components';
import colors from '~/styles/colors';

export const CenterButtonContainer = styled(View)`
  background-color: ${colors.purple};
  width: 38px;
  height: 38px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
`;
export const CenterTextButtonContainer = styled(Text)`
  font-family: 'Montserrat-Black';
  color: ${colors.white};
  font-size: 31px;
  line-height: 38px;
`;
