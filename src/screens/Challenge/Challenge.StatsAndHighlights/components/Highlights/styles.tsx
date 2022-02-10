import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { Text, TitleText } from '~/components';

export const TitleWrapper = styled.View`
  align-items: flex-end;
  width: 100%;
`;

export const CommentText = styled(Text)`
  opacity: 0.56;
  font-size: 14px;
  line-height: 16px;
`;

export const Avatar = styled(FastImage)`
  width: 40px;
  height: 40px;
  border-radius: 40px;
`;

export const ContentWrapper = styled.View`
  background-color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-bottom: 8px;
  padding: 21px 0px;

  elevation: 1;
`;

export const HighlightCard = styled.View`
  padding: 8px 13px 13px 13px;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 0px 7px rgba(21, 46, 88, 0.1);
  width: 125px;
  margin-left: 10px;
  elevation: 1;
`;

export const HighlightTitle = styled(TitleText)`
  font-size: 14px;
  line-height: 16.1px;
  opacity: 0.56;
  text-align: center;
`;

export const HighlightName = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  font-size: 12px;
`;

export const HighlightValue = styled(Text)`
  font-size: 16px;
`;

export const Title = styled(TitleText)`
  font-size: 20px;
`;
