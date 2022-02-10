import styled from 'styled-components/native';
import { Text } from '~/components';

export const GoogleLoginButtonContainer = styled.View`
  background: #fff;
  width: 100%;
  height: 56px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: 26px;
  margin-bottom: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.text};
`;

export const GoogleLoginButtonText = styled(Text)`
  margin-left: 8px;
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;
export const ModalContainer = styled.View`
  background: ${({ theme }) => theme.colors.backgroundWhite};
  flex: 1;
  border-radius: 8px;
  max-height: 30%;
  align-items: center;
  padding: 8%;
  justify-content: space-between;
`;
export const ModalButton = styled.View`
  background: #0564ff;
  border-radius: 3px;
  padding: 10px 24px;
  justify-content: center;
  align-items: center;
`;
export const ModalHeaderText = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  text-align: center;
`;
export const ModalDescriptionText = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;
export const ModalButtonText = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  color: ${({ theme }) => theme.colors.textWhite};
  text-align: center;
`;
export const TermsOfUse = styled(Text)`
  color: #0564ff;
`;
