import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { Box, ImageBackground, Text, TitleText } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

export const SafeAreaView = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
`;

export const RefeshText = styled(Text)`
  margin-right: 9px;
  color: ${({ theme }) => theme.colors.blue};
`;

export const Container = styled.ScrollView`
  padding-bottom: 25px;
  margin-bottom: -20px;
  margin-top: -10%;
  z-index: 1;
`;

export const OptionContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 19px 0;
  border-bottom-width: 1px;
  border-bottom-color: 'rgba(22,28,37, 0.1)';
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const Title = styled(TitleText)`
  font-size: 20px;
`;

export const HighlightImage = styled(ImageBackground)`
  width: 100%;
  height: 478px;
  border-radius: 16px;
  padding: 40px 0;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0 0 16px 16px;
  background-color: #f2f2f2;
  position: relative;
`;

export const HighlightsCardTitle = styled(TitleText)`
  line-height: 32px;
  margin-right: 9px;
  font-size: 24px;
  color: #161c25;
`;

export const ChallengeAvatar = styled(ImageBackground)`
  width: 96px;
  height: 96px;
  border-radius: 8px;
`;
export const CompanyAvatar = styled(ImageBackground)`
  width: 70px;
  height: 70px;
  border-radius: 8px;
  border-width: 0px;
`;

export const ChallengeInfoHeader = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

export const InfoContainer = styled.View`
  width: ${widthPercentageToDP('75')};
  flex-direction: column;
`;

export const AvatarBrandContainer = styled.View`
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 70px;
  height: 70px;
  overflow: hidden;
`;

export const InfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const InfoText = styled(Text)`
  font-size: 16px;
  margin-top: 24px;
  line-height: 24px;
`;

export const ToggleHeader = styled.View`
  flex-direction: row;
  padding: 19px 0;
  align-items: center;
  width: 100%;
  border-bottom-width: 0.5px;
  border-bottom-color: rgba(22, 28, 37, 0.5);
`;

export const RightToggle = styled.View`
  flex-direction: row;
  width: 20%;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const DetailedChallengeContainer = styled.View`
  background: #f8fafb;
  padding-bottom: 50px;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;

export const Wrapper = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;

export const InformationsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

export const Avatar = styled(ImageBackground)`
  width: 32px;
  height: 32px;
  border-radius: 64px;
`;

export const DetailTitle = styled(TitleText)`
  font-size: 14px;
  line-height: 21px;
`;

export const TermsofUse = styled(Text)`
  color: ${({ theme }) => theme.colors.blue};
  margin-bottom: -4px;
`;

export const AwardContainer = styled.View`
  margin-top: 20px;
  background: #ffffff;
  border-width: 0.4px;
  border-color: #d9d9d9;
  border-radius: 16px;
  padding: 24px ${({ theme }) => theme.paddingHorizontal};
`;

export const AwardImageContainer = styled.View`
  margin-top: 20px;
  align-items: center;
  background: #ffffff;
  border-width: 0.4px;
  border-color: #d9d9d9;
  border-radius: 16px;
`;

export const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
`;

export const ActionWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ActionText = styled(Text)`
  font-size: 16px;
  margin-left: 8px;
  margin-right: 16px;
`;

export const Action = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const ActionButtonLeft = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-radius: 100px;
  padding: 14px;
`;

export const ActionButtonRight = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-radius: 100px;
  padding: 14px 10px;
`;

export const SubscribeContainer = styled.View`
  width: 100%;
  padding: 16px;
  justify-content: center;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  background-color: white;
  box-shadow: 10px -20px 40px rgba(5, 100, 255, 0.06);
  elevation: 1;
  z-index: 999;
`;

export const ProgressContainer = styled.View`
  padding: ${({ theme }) => theme.paddingHorizontal};
  background-color: #f8fafb;
  margin-bottom: 30px;
`;

export const UserAvatar = styled.Image`
  height: 34px;
  width: 34px;
  border-radius: 34px;
`;

export const BoxContainer = styled(Box)`
  background-color: ${({ theme, color }) => color || theme.colors.textWhite};
  elevation: 5;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  shadow-color: rgba(21, 46, 88, 0.3);
  shadow-offset: 2px 2px;
`;

export const BlueText = styled(Text)`
  color: ${({ theme }) => theme.colors.blue};
  font-size: 14px;
`;

interface ParagraphTextProps {
  color?: string;
}
export const ParagraphText = styled(Text)<ParagraphTextProps>`
  color: ${({ color, theme }) => color || theme.colors.text};
`;

export const BoxWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 16px;
`;

export const BoxAlignRight = styled.View`
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
`;

interface BottomOptionsProps {
  lastOption?: boolean;
}
export const BottomOptionsContainer = styled.TouchableOpacity<BottomOptionsProps>`
  padding-vertical: 15px;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;

  border-bottom-color: rgba(22, 28, 37, 0.2);
  border-bottom-width: ${({ lastOption }) => (lastOption ? '0px' : '0.5px')};
`;

interface ProgressPercentProps {
  isCompleted?: boolean;
}
export const ProgressPercentText = styled(TitleText)<ProgressPercentProps>`
  color: ${({ theme, isCompleted }) =>
    isCompleted ? theme.colors.accent.green : theme.colors.blue};
  font-size: 20px;
  line-height: 23px;
`;

export const LightParagraph = styled(Text)<ProgressPercentProps>`
  font-family: ${({ theme }) => theme.fontFamily.light};
  color: ${({ theme, isCompleted }) =>
    isCompleted ? theme.colors.accent.green : theme.colors.text};
  opacity: 0.56;
`;

export const Gradient = styled(LinearGradient)`
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  background-color: transparent;
  align-items: flex-start;
  padding-horizontal: 16px;
  padding-vertical: 45px;
  position: absolute;
  z-index: 99999999;
  top: 0;
`;
