import styled from 'styled-components/native';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

export const Container = styled(Styled.BoxContainer)`
  padding-horizontal: 16px;
  padding-vertical: 16px;
  margin-top: 16px;
`;

export const Title = styled(Styled.HighlightsCardTitle)`
  margin-bottom: 15px;
`;

export const Content = styled(Styled.BoxContainer)`
  align-items: center;
  flex-direction: row;
  border-radius: 18px;
  justify-content: space-between;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  padding-vertical: 11px;
  padding-horizontal: 12px;
`;

export const DistanceContentWrapper = styled(Styled.BoxContainer)`
  align-items: center;
  flex-direction: row;
  border-radius: 18px;
  justify-content: space-between;
  margin-top: 8px;
`;

export const ContentWrapper = styled(Styled.BoxContainer)`
  align-items: center;
  flex-direction: row;
  border-radius: 16px;
  border-color: #979797;
  border-width: 1px;
`;

export const ParagraphMargin = styled(Styled.ParagraphText)`
  margin-left: 12px;
`;

export const AltimetryContainer = styled(ContentWrapper)`
  justify-content: space-between;
  margin-top: 8px;
  border-width: 0;
`;

export const GoalContainer = styled.View`
  padding-vertical: 11px;
  padding-horizontal: 12px;
`;

export const GoalText = styled(Styled.ParagraphText)`
  margin-left: 12px;
`;

export const WrapperRow = styled(GoalContainer)`
  flex-direction: row;
`;
