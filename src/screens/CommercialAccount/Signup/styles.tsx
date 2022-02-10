import { View, Text, Animated } from 'react-native';
import styled from 'styled-components';
import { RFPercentage } from 'react-native-responsive-fontsize';
import colors from '~/styles/colors';
import { widthPercentageToDP as wp } from '~/helpers/convertPixelToDP';

export const HeaderContainer = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: -10px;
`;

export const HeaderText = styled(Text)`
  font-family: 'Montserrat-Bold';
  font-size: 28px;
  color: ${colors.blackGrey};
  text-align: center;
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
  width: 0%;
`;

export const LoginOptionsContainer = styled(View)`
  align-items: center;
  /* justify-content: space-between; */
  /* flex: 1; */
  /* padding-top: 7%; */
`;

export const LoginOptionsWrapper = styled(View)`
  align-items: center;
  width: ${wp('100')};
  justify-content: center;
`;

export const SubHeaderText = styled(Text)`
  font-family: 'Montserrat-Regular';
  font-size: ${RFPercentage(2)};
  color: ${colors.blackGrey};
  margin-bottom: 30px;
`;

export const OtherOptionsLoginButton = styled(Text)`
  font-family: 'Montserrat-Regular';
  font-size: ${RFPercentage(2)};
  color: ${colors.darkGrey};
`;
export const OtherOptionsLoginContainer = styled(View)`
  margin: 10px 0 20px 0;
  padding: 2% 5%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;
