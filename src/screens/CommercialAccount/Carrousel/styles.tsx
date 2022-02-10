import { View, Text } from 'react-native';
import styled from 'styled-components';

import colors from '~/styles/colors';

export const Container = styled(View)`
  flex: 1;
  justify-content: space-between;
`;
export const HeaderText = styled(Text)`
  font-family: 'Montserrat-Bold';
  font-size: 28px;
  align-items: center;
  text-align: center;
  color: ${colors.darkenWhite};
  justify-content: center;
`;
export const SubHeaderText = styled(Text)`
  font-family: 'Montserrat';
  font-size: 16px;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: ${colors.darkenWhite};
`;
export const HeaderContainer = styled(View)`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 10% 0;
  width: 100%;
`;
export const HeaderTextContainer = styled(View)`
  width: 70%;
  margin-top: 5%;
`;
export const Wrapper = styled(View)`
  width: 15%;
`;
export const FooterView = styled(View)`
  align-items: center;
  margin-bottom: 20px;
`;
export const ButtonContainer = styled(View)`
  width: 330px;
  height: 50px;
  border-color: ${colors.darkenWhite};
  border-width: 0.5px;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
`;
export const ButtonText = styled(Text)`
  font-family: 'Montserrat-Regular';
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: -0.3px;
  color: ${colors.darkenWhite};
`;
