import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { BoxShadow as CustomBoxShadow } from '~/components';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

export const BoxShadow = styled(CustomBoxShadow)`
  justify-content: space-between;
  padding-bottom: 20px;
  padding-top: 16px;
  padding-horizontal: 16px;
  margin-top: 24px;
  shadow-opacity: 0.41;
  shadow-radius: 9.11px;
  shadow-color: rgba(21, 46, 88, 0.3);
  shadow-offset: 0px 7px;
`;

export const AlignCrown = styled(Styled.BoxAlignRight)`
  padding-top: 8px;
  padding-right: 8px;
`;

export const Wrapper = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 35px;
`;

export const Avatar = styled(FastImage)`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;

export const ClassificationText = styled(Styled.HighlightsCardTitle)`
  margin-top: 16px;
  margin-right: 0;
`;

export const FooterWrapper = styled(Styled.BoxAlignRight)`
  margin-top: 38px;
  align-items: flex-end;
  padding-horizontal: 8px;
`;

export const ParagraphMargin = styled(Styled.ParagraphText)`
  margin-top: 16px;
`;
