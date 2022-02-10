import { Animated, Text, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { ImageBackground, SmallText, TitleText } from '~/components';
import colors from '~/styles/colors';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from '~/helpers/convertPixelToDP';
const { View } = Animated;

const { width } = Dimensions.get('window');

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

export const Container = styled.View`
  /* padding: 0px 0px 20px; */
`;

interface HeaderProps {
  isHighlight: boolean;
}

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 16px;
  width: ${widthPercentageToDP('99')}px;
`;
export const Title = styled(TitleText)`
  font-size: 32px;
`;

export const TitleOthers = styled(TitleText)`
  font-size: 20px;
`;
export const HighlightsCard = styled.View`
  padding: 0px 16px;
`;
export const BigCard = styled.View`
  flex: 1;
  width: 100%;
  margin-top: 24px;
  margin-left: 16px;
`;
export const BigImage = styled(ImageBackground)`
  width: ${wp('92')}px;
  height: 172.8px;
  border-radius: 16px;
  margin-bottom: 14px;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 16px;
`;
export const HighlightImage = styled(ImageBackground)`
  width: 100%;
  height: 478px;
  border-radius: 16px;
  padding: 40px 0;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px 0px 16px 16px;
  background-color: #f2f2f2;
  margin-bottom: 24px;
`;
export const HighlightsCardHorizontal = styled.View`
  margin-top: 24px;
  margin-bottom: 20px;
  margin-left: 16px;
  width: 144px;
`;
export const HighlightImageHorizontal = styled(ImageBackground)`
  width: 100%;
  height: 172.8px;
  border-radius: 16px;
  margin-bottom: 14px;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px;
`;
export const RockyMountainHorizontal = styled(ImageBackground)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
`;

export const HighlightsCardTitle = styled(TitleText)`
  font-size: 14px;
  line-height: 20px;
  color: #161c25;
`;

export const RockyMountain = styled(ImageBackground)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
`;
export const SeeAllText = styled(Text)`
  text-transform: uppercase;
  font-size: 12px;
  line-height: 20px;
  text-align: right;
  color: rgba(22, 28, 37, 0.5);
`;

export const Carrousel = styled.ScrollView``;

export const SmallTitle = styled(SmallText)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  font-size: 16px;
  margin-top: 40px;
`;
export const MainHeader = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: -44px;
  padding: 20px 24px 25px 24px;
  background-color: #fff;
  elevation: 2;
`;
export const MainTitle = styled(TitleText)`
  font-size: 20px;
  margin-bottom: 20px;
`;

export const LabelContainerHighlight = styled.View`
  background-color: #81ce1f;
  padding: 3px 19px;
  align-items: center;
  border-radius: 16px;
`;
export const LabelContainer = styled.View`
  width: 144px;
  background-color: ${({ theme }) => theme.colors.accent.lightGreen};
  padding-vertical: 3px;
  align-items: center;
  border-radius: 16px;
  margin-vertical: 2px;
`;

export const LabelTextHighlight = styled(Text)`
  color: white;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;

export const LabelText = styled(Text)`
  color: white;
  font-size: 12px;
  line-height: 13.8px;
`;

export const Gradient = styled(LinearGradient)`
  flex: 1;
  width: ${width}px;
  flex-direction: row;
  justify-content: space-between;
  background-color: transparent;
  flex-direction: column;
  align-items: flex-start;
  padding-horizontal: 16px;
  padding-vertical: 30px;
  position: absolute;
  z-index: 4;
  bottom: 0;
`;
