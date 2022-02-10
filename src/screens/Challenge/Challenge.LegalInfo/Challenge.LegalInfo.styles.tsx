import styled from 'styled-components/native';
import { Text, TitleText } from '~/components';

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 20px;
`;

export const HeaderText = styled(TitleText)`
  font-size: 20px;
`;

export const HeaderWrapper = styled.View`
  width: 20px;
`;

export const ParagraphText = styled(Text)`
  font-size: 14px;
`;
