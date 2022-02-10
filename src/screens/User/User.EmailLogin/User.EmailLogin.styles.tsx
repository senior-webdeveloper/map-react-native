import { View, Text, TextInput } from 'react-native';
import styled from 'styled-components';
import colors from '~/styles/colors';

export const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: -10px;
`;

export const HeaderText = styled(Text)`
  font-family: 'Montserrat-Bold';
  font-size: 28px;
  color: ${colors.blackGrey};
`;

export const LoginContainer = styled(View)`
  flex: 1;
  justify-content: space-between;
`;
export const LoginButtonContainer = styled(View)`
  /* background: #6e44ff; */
  border-radius: 100px;
  width: 115px;
  height: 115px;
  align-items: center;
  justify-content: center;
  border-color: ${colors.purple};
  border-width: 1px;
`;
export const GoBackButton = styled(Text)`
  font-family: 'Montserrat-Regular';
  font-size: 13px;
  line-height: 16px;
  color: ${colors.blackGrey};
`;
export const GoBackButtonBold = styled(Text)`
  font-family: 'Montserrat-Bold';
  font-size: 13px;
  line-height: 16px;
  color: ${colors.blackGrey};
`;
export const Wrapper = styled(View)`
  width: 5%;
`;
export const HeaderRecoveryEmailText = styled(Text)`
  font-family: 'Montserrat-Regular';
  font-size: 14px;
  align-items: center;
  text-align: center;
  color: ${colors.purple};
  margin-bottom: 17px;
`;
export const CustomInput = styled(TextInput)`
  color: ${colors.darkenBlue};
  font-family: 'Montserrat-Regular';
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  elevation: 1;
`;
export const ErrorText = styled(Text)`
  font-family: 'Montserrat-Regular';
  font-size: 13px;
  margin-top: 5px;
  color: ${colors.error};
`;
export const RecoverEmailText = styled(Text)`
  font-family: 'Montserrat-Regular';
  color: ${colors.purple};
  font-size: 13px;
  margin-top: 5px;
  align-items: center;
  text-align: right;
`;
