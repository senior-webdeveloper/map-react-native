import styled from 'styled-components/native';
import { BoxShadow as CustomBoxShadow } from '~/components';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

interface BoxShadowProps {
  isActivities: boolean;
}
export const BoxShadow = styled(CustomBoxShadow)<BoxShadowProps>`
  align-items: center;
  flex-direction: row;
  border-radius: 18px;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: ${({ isActivities }) => (isActivities ? '16px' : '0')};
`;

export const PaddingWrapper = styled.View`
  padding-vertical: 11px;
  padding-horizontal: 16px;
`;

export const Title = styled(Styled.HighlightsCardTitle)`
  font-size: 16px;
`;

export const DateInformationTextOpacity = styled(Styled.ParagraphText)`
  font-size: 14px;
  opacity: 0.56;
  line-height: 16px;
`;

export const InfoBoxShadow = styled(Styled.BoxContainer)`
  align-items: center;
  flex-direction: row;
  border-radius: 16px;
  border-color: #979797;
  border-width: 1px;
`;

export const InfoWrapper = styled.View`
  width: 155px;
  padding-vertical: 27px;
  padding-horizontal: 12px;
  align-items: center;
`;

interface CommonViewProps {
  color: string;
}
export const CommomView = styled.View<CommonViewProps>`
  align-items: center;
  flex-direction: row;
  border-radius: 16px;
  background-color: ${({ color }) => color};
`;

interface TextProps {
  color: string;
}
export const CommonText = styled(Styled.ParagraphText)<TextProps>`
  color: ${({ color }) => color || '#FFF'};
  font-size: 14px;
  line-height: 16px;
`;

export const SmallText = styled(Styled.ParagraphText)<TextProps>`
  color: ${({ color }) => color || '#FFF'};
  font-size: 12px;
  line-height: 14px;
  text-align: center;
`;
