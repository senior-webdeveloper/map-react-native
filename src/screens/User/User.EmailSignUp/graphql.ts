import { gql } from '@apollo/client';
import { Mutation } from '~/generated/graphql';

export const SEND_CODE_EMAIL = gql`
  mutation sendMailEmailSignup($data: SendEmailInput!) {
    sendMail(data: $data)
  }
`;

export interface ISendMailCodePayload {
  sendMail: Mutation['sendMail'];
}

export const VERIFY_CODE_EMAIL = gql`
  mutation verifyEmailCodeEmailSignUp($data: VerifyEmailInput!) {
    verifyEmailCode(data: $data) {
      email
    }
  }
`;

export interface IVerifyMailCodePayload {
  verifyEmailCode: Mutation['verifyEmailCode'];
}

export const SEND_CODE_SMS = gql`
  mutation recoverEmailSignUp($data: PhoneInput!) {
    verifyPhoneNumber(data: $data) {
      codeStatus
    }
  }
`;

export interface ISendCodeToNumberPayload {
  verifyPhoneNumber: Mutation['verifyPhoneNumber'];
}

export const VERIFY_CODE_SMS = gql`
  mutation codeRecoveryEmailSignUp($data: SmsCodeInput!) {
    codeRecovery(data: $data) {
      codeStatus
    }
  }
`;

export interface IVerifySmsCodePayload {
  codeRecovery: Mutation['codeRecovery'];
}

export const REGISTER_USER = gql`
  mutation RegisterUserFirstTime($data: RegisterUserInput!) {
    Register(data: $data) {
      id
    }
  }
`;

export interface IRegisterPayload {
  Register: Mutation['Register'];
}

export const LOGIN_WITH_EMAIL = gql`
  mutation loginEmailLogin($data: LoginUserInput!) {
    login(data: $data) {
      user {
        id
        staff
        profile {
          id
        }
      }
      accessToken
      refreshToken
    }
  }
`;

export interface ILoginPayload {
  login: Mutation['login'];
}
