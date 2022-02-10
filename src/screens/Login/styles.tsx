import styled from 'styled-components/native';
import { Text } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

export const LogoContainer = styled.View`
  align-items: center;
  margin-top: 30%;
  margin-bottom: 30%;
  justify-content: center;
`;
export const LoginOptionsContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding: 34px 24px 0 24px;
  flex: 1;
`;
export const HeaderText = styled(Text)`
  font-weight: 400;
  font-size: 24;
  color: #333e3f;
`;
export const SubHeaderText = styled(Text)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 30px;
`;

export const LoginOptionsWrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundGray};
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  align-items: flex-start;
  padding: 24px;
  width: 100%;
`;

export const Background = styled.ImageBackground``;

export const FooterVersionContainer = styled.View`
  position: absolute;
  bottom: 5;
  align-items: center;
  width: ${widthPercentageToDP('100')}px;
  opacity: 0.56;
`;

export const FooterVersionText = styled(Text)`
  font-size: 14px;
  line-height: 16px;
`;
