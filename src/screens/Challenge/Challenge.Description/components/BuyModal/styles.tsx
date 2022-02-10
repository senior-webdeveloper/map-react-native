import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { Text, TitleText } from '~/components';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

export const Container = styled.View`
  height: ${heightPercentageToDP('80')};
  background-color: #ffffff;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding-vertical: 19px;
  padding-horizontal: 16px;
`;

export const CloseButton = styled.TouchableOpacity`
  padding-horizontal: 16px;
`;

export const HeaderContainer = styled.View`
  padding-horizontal: 16px;
  padding-top: 16px;
  margin-bottom: 15px;
`;

export const RadioContainer = styled(RadioForm)`
  width: 100%;
`;

export const CustomRadioButton = styled(RadioButton)`
  width: 100%;
  align-items: center;
  border-bottom-color: rgba(22, 28, 37, 0.56);
  border-bottom-width: 0.5px;
  padding-vertical: 17px;
  justify-content: space-between;
`;

export const OptionButton = styled.TouchableOpacity`
  flex-direction: row;
  width: 85%;
  justify-content: space-between;
  margin-left: 12px;
`;

export const OptionWrapper = styled.View`
  flex-direction: row;
`;

export const ImageContainer = styled.View`
  height: 60px;
  width: 60px;
  border-radius: 8px;

  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  elevation: 5;
`;

export const AwardImage = styled(FastImage)`
  width: 60px;
  height: 60px;
  border-radius: 8px;
`;

export const AwardInformationContainer = styled.View`
  margin-left: 12px;
`;

export const AwardNameContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: ${widthPercentageToDP('55')};
  align-items: center;
`;

export const PriceText = styled(TitleText)`
  font-size: 16px;
`;

export const DescriptionText = styled(Text)`
  opacity: 0.56;
  font-size: 14px;
  line-height: 13.8px;
  width: ${widthPercentageToDP('50')};
`;

export const FooterContainer = styled(Styled.SubscribeContainer)`
  elevation: 10;
  margin-bottom: -16px;
  width: ${widthPercentageToDP('100')};
  padding-bottom: 21px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CurrencyText = styled(Text)`
  font-size: 12px;
`;

export const ValueText = styled(Text)`
  font-size: 24px;
`;

export const NextButton = styled.TouchableOpacity`
  width: 136px;
  background-color: ${({ disabled }) => (disabled ? '#A1A8B1' : '#0564ff')};
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  padding-vertical: 8px;
  padding-horizontal: 13px;
`;

export const NextButtonText = styled(Text)`
  color: white;
  font-size: 20px;
`;
