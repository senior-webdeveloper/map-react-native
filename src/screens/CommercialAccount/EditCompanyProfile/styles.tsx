import {
  Animated,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components';
import colors from '~/styles/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '~/helpers/convertPixelToDP';

const { View } = Animated;

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.white};
`;
export const HeaderContainer = styled(View)`
  margin-bottom: 20px;
`;
export const HeaderText = styled(Text)`
  font-family: 'Montserrat-Bold';
  color: ${colors.darkenBlue};
  font-size: 28px;
  text-align: left;
`;
export const SubHeader = styled(Text)`
  font-family: 'Montserrat-Regular';
  color: ${colors.darkenBlue};
  font-size: 17px;
  text-align: left;
  margin: 30px 0;
`;
export const BodyContainer = styled(View)`
  padding: 0 20px;
`;
export const ChooseContainer = styled(TouchableOpacity)`
  border-color: ${colors.white};
  border-width: 1px;
  border-radius: 15px;
  align-items: center;
  margin-top: 10px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.08);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  padding: 0 0 0 10px;
`;

export const OptionHeaderText = styled(Text)`
  font-family: 'Montserrat-Bold';
  color: ${colors.darkenBlue};
  font-size: 14px;
  text-align: left;
`;
export const OptionInfoText = styled(Text)`
  font-family: 'Montserrat-Regular';
  color: ${colors.darkWhite};
  font-size: 14px;
  text-align: center;
  margin-right: 10px;
`;
export const GoBackButtonContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
  margin-bottom: 20px;
`;
export const GoBackButtonText = styled(Text)`
  font-family: 'Montserrat-Regular';
  color: ${colors.darkGrey};
  font-size: 17px;
  text-align: left;
  margin-bottom: 5px;
`;
export const ModalContainer = styled(View)`
  background: ${colors.white};
  flex: 1;
  border-radius: 8px;
  max-height: ${hp('30')};
  align-items: center;
  padding: 8%;
  justify-content: space-between;
`;
export const ModalDescriptionText = styled(Text)`
  font-family: 'Montserrat-Regular';
  font-size: ${RFPercentage(2.2)};
  color: ${colors.darkGrey};
  text-align: center;
`;
export const ConfirmButtonContainer = styled(TouchableOpacity)`
  margin-top: 20px;
  background-color: #6e44ff;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;
export const ConfirmButtonText = styled(Text)`
  color: ${colors.white};
`;
