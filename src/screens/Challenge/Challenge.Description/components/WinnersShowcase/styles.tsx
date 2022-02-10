import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { BoxShadow as CustomBoxShadow } from '~/components';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

export const BoxShadow = styled(CustomBoxShadow)`
  padding-vertical: 16px;
  margin-top: 16px;
`;

export const HeaderContainer = styled.View`
  padding-horizontal: 16px;
`;

export const Title = styled(Styled.HighlightsCardTitle)`
  line-height: 28px;
  margin-bottom: 4px;
`;

export const Subtitle = styled(Styled.ParagraphText)`
  font-size: 14px;
  line-height: 16px;
  opacity: 0.56;
`;

export const CustomScroll = styled.ScrollView`
  padding-vertical: 20px;
  padding-horizontal: 16px;
`;

export const WinnerContainer = styled.View`
  margin-right: 10px;
  align-items: center;
`;

export const ImagesContainer = styled.View`
  flex-direction: row;
  margin-bottom: -5px;
  z-index: 10;
`;

export const UserAvatar = styled(FastImage)`
  width: 48px;
  height: 48px;
  border-radius: 48px;
`;

export const AwardImage = styled(FastImage)`
  width: 48px;
  height: 48px;
  border-radius: 48px;
  margin-left: -10px;
  background-color: white;
`;

export const NameContainer = styled.View`
  padding-vertical: 8px;
  padding-horizontal: 13px;
  background-color: #ffc502;
  width: 104px;
  align-items: center;
  border-radius: 8px;
`;

export const Username = styled(Styled.ParagraphText)`
  font-size: 14px;
  line-height: 16.1px;
  color: white;
`;

export const FooterContainer = styled.View`
  align-items: flex-end;
  padding-horizontal: 16px;
  padding-top: 14px;
`;
