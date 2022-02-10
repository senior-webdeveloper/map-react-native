import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { BoxShadow } from '~/components';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

export const Container = styled(BoxShadow)`
  margin-top: 24px;
  padding-vertical: 16px;
  margin-bottom: 24px;
`;

export const HeaderContainer = styled.View`
  padding-horizontal: 16px;
`;

export const HeaderTitle = styled(Styled.HighlightsCardTitle)`
  line-height: 28px;
  margin-bottom: 4px;
`;

export const SubtitleOpacity = styled(Styled.ParagraphText)`
  font-size: 14px;
  line-height: 16px;
  opacity: 0.56;
`;

export const AwardContainer = styled.View`
  padding-vertical: 20px;
  padding-top: 20px;
`;

interface AwardWrapperProps {
  index: number;
  length: number;
}
export const AwardWrapper = styled(Styled.BoxContainer)<AwardWrapperProps>`
  width: 258px;
  margin-left: ${({ index }) => (index === 0 ? '16px' : '12px')};
  height: 310px;
  border-radius: 12px;
  margin-right: ${({ index, length }) => (index + 1 === length ? '16px' : '0')};
`;

export const AwardImage = styled(FastImage)`
  width: 258px;
  height: 253px;
  border-radius: 12px;
`;

export const AwardNameContainer = styled.View`
  padding-vertical: 8px;
  padding-horizontal: 13px;
`;

export const FooterContainer = styled.View`
  align-items: flex-end;
  padding-horizontal: 16px;
`;

export const FooterText = styled(Styled.BlueText)`
  margin-top: 14px;
`;
