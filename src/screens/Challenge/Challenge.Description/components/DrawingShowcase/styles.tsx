import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { BoxShadow } from '~/components';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

export const Container = styled(BoxShadow)`
  padding-vertical: 16px;
  margin-top: 16px;
  margin-bottom: 24px;
`;

export const HorizontalWrapper = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;

export const Title = styled(Styled.HighlightsCardTitle)`
  line-height: 28px;
  margin-bottom: 4px;
`;

export const ParagraphOpacity = styled(Styled.ParagraphText)`
  font-size: 14px;
  line-height: 16px;
  opacity: 0.56;
`;

export const ContentWrapper = styled(Styled.BoxContainer)`
  margin-top: 16px;
  padding-horizontal: 16px;
`;

export const ButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding-vertical: 17px;
  align-items: center;
  justify-content: space-between;
  border-bottom-color: rgba(22, 28, 37, 0.2);
  border-bottom-width: 0.5px;
`;

export const Wrapper = styled.View`
  flex-direction: row;
  width: 80%;
`;

export const AwardImageContainer = styled(Styled.BoxContainer)`
  border-radius: 8px;
`;

export const AwardImage = styled(FastImage)`
  width: 60px;
  height: 60px;
  border-radius: 8px;
`;

export const AwardInfoContainer = styled.View`
  padding-vertical: 8px;
  padding-horizontal: 13px;
`;

export const AwardName = styled(Styled.ParagraphText)`
  font-size: 14px;
  line-height: 16.1px;
`;

export const AwardQuantity = styled(Styled.ParagraphText)`
  font-size: 12px;
  line-height: 14px;
  color: rgba(22, 28, 37, 0.56);
  margin-top: 8px;
`;

export const FooterContainer = styled.View`
  align-items: flex-end;
  padding-horizontal: 16px;
`;

export const FooterText = styled(Styled.BlueText)`
  margin-top: 14px;
`;
