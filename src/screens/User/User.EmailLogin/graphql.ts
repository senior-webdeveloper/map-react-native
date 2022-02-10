import { gql } from '@apollo/client';

export const LOGIN_WITH_EMAIL = gql`
  mutation loginWithEmail($input: LoginUserInput!) {
    login(data: $input) {
      user {
        id
      }
    }
  }
`;

export const RECOVER_EMAIL = gql`
  mutation recoverEmailLogin($input: PhoneInput!) {
    recoverEmail(data: $input) {
      user {
        id
        firstname
        email
      }
    }
  }
`;

export const CHECK_EMAIL = gql`
  mutation loginUsingEmail($input: String!) {
    checkEmail(email: $input) {
      id
    }
  }
`;
