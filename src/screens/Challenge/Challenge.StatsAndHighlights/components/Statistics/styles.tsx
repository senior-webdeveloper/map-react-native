import styled from 'styled-components/native';
import { Text, TitleText } from '~/components';

export const CommentText = styled(Text)`
  opacity: 0.56;
  font-size: 14px;
  line-height: 16px;
`;
export const Wrapper = styled.View`
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const CardTitle = styled(CommentText)`
  max-width: 80px;
  margin-bottom: 8px;
`;

export const ContentWrapper = styled.View`
  background-color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-bottom: 8px;
  padding: 21px 0px;

  elevation: 1;
`;

export const HighlightValue = styled(Text)`
  font-size: 16px;
`;

export const InnerStatsContainer = styled.View`
  background-color: #ffffff;
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
  margin-left: 8px;
  width: 145px;
  padding: 8px 8px 16px 8px;
`;

interface StatsProps {
  color: string;
}

export const StatsCard = styled.View<StatsProps>`
  align-items: flex-end;
  background-color: ${({ color }) => color};
  border-radius: 12px;
  box-shadow: 0px 0px 7px rgba(21, 46, 88, 0.1);
  margin-left: 10px;
  elevation: 1;
`;

export const Title = styled(TitleText)`
  font-size: 20px;
`;
