import styled from 'styled-components/native';
import { BoxShadow } from '~/components';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

export const Container = styled(BoxShadow)`
  align-items: center;
  padding-horizontal: 8px;
  padding-vertical: 10px;
`;

export const Wrapper = styled.View`
  margin-top: 13px;
`;

export const TextWrapper = styled.View`
  margin-top: 13px;
`;

export const Subtitle = styled(Styled.LightParagraph)`
  text-align: center;
`;

export const FooterWrapper = styled.View`
  margin-top: 31px;
  align-items: flex-end;
  width: 100%;
`;
