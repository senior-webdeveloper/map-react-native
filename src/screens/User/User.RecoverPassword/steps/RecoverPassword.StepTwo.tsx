import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { RouteProp, useNavigation } from '@react-navigation/native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { gql, useMutation } from '@apollo/client';
import {
  TitleText,
  SafeAreaView,
  InputWithIcon,
  Button,
  SmallText,
  Icons as CustomIcon,
  Input as InputWithFloatLabel,
  Radio,
  Picker,
  MaskedInputWithoutLabel,
  Text,
} from '~/components';
import { RootStackRecoverPasswordParamList } from '../User.RecoverPassword.screen';
import {
  Mutation,
  MutationCodeRecoveryArgs,
  MutationSendMailArgs,
  MutationVerifyEmailCodeArgs,
  MutationVerifyPhoneNumberArgs,
} from '~/generated/graphql';
import { ErrorText } from '~/screens/User/User.EmailSignUp/steps/StepFour';

const RECOVERY_EMAIL_USING_CODE = gql`
  mutation codeRecovery($data: SmsCodeInput!) {
    codeRecovery(data: $data) {
      user {
        id
        firstname
        email
      }
    }
  }
`;
interface CodeVerificationProps {
  codeRecovery: Mutation['codeRecovery'];
}

export const SEND_CODE_EMAIL = gql`
  mutation sendMailEmailSignup($data: SendEmailInput!) {
    sendMail(data: $data)
  }
`;

export interface SendMailCodePayload {
  sendMail: Mutation['sendMail'];
}

const SEND_CODE = gql`
  mutation verifyPhoneNumber($data: PhoneInput!) {
    verifyPhoneNumber(data: $data) {
      codeStatus
      user {
        firstname
        lastname
        email
      }
    }
  }
`;
interface PhoneNumberResponse {
  verifyPhoneNumber: Mutation['verifyPhoneNumber'];
}

export const VERIFY_CODE_SMS = gql`
  mutation codeRecoveryEmailSignUp($data: SmsCodeInput!) {
    codeRecovery(data: $data) {
      codeStatus
    }
  }
`;

export interface VerifySmsCodePayload {
  codeRecovery: Mutation['codeRecovery'];
}

export const VERIFY_CODE_EMAIL = gql`
  mutation verifyEmailCodeEmailSignUp($data: VerifyEmailInput!) {
    verifyEmailCode(data: $data) {
      email
    }
  }
`;

export interface VerifyMailCodePayload {
  verifyEmailCode: Mutation['verifyEmailCode'];
}

export const Container = styled.ScrollView`
  padding: 23px;
  height: 100%;
`;
export const Divider = styled.View`
  margin-top: 30px;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0px 24px 0 0px;
`;
export const Title = styled(TitleText)`
  font-size: 20px;
  font-family: ${({ theme }) => theme.fontFamily.regular};
`;
export const Icon = styled(CustomIcon)`
  color: ${({ theme }) => theme.colors.text};
`;
export const Input = styled(InputWithIcon)``;
export const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
export const ForgotText = styled(SmallText)`
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
`;
interface ResendTextProps {
  disabled: boolean;
}
export const ResendText = styled(SmallText)<ResendTextProps>`
  margin-top: 11px;
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray : theme.colors.blue};
`;
export const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  padding-top: 43px;
`;
export const TouchHereText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.blue};
`;

const Avatar = styled.Image`
  border-radius: 500px;
`;

type StepTwoNavigationProp = RouteProp<
  RootStackRecoverPasswordParamList,
  'RecoverPassword.StepTwo'
>;
type Props = {
  route: StepTwoNavigationProp;
};

const CELL_COUNT = 4;
const RecoverEmail: React.FC<Props> = ({ route }) => {
  const [step, setStep] = useState<number>(0);
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setHasError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState('');

  const [verifyCodeEmail] = useMutation<
    VerifyMailCodePayload,
    MutationVerifyEmailCodeArgs
  >(VERIFY_CODE_EMAIL, {
    onError: (e) => {
      setLoading(false);
      setValue('');
      setHasError(true);
      setErrorText(e.message);
    },
    onCompleted: (e) => {
      setLoading(false);
    },
  });

  const [verifyCodeSms] = useMutation<
    VerifySmsCodePayload,
    MutationCodeRecoveryArgs
  >(VERIFY_CODE_SMS, {
    onError: (e) => {
      setLoading(false);
      setValue('');
      setHasError(true);
      setErrorText(e.message);
    },
    onCompleted: (e) => {
      setLoading(false);
    },
  });

  const [getRecoveryCodePhone] = useMutation<
    PhoneNumberResponse,
    MutationVerifyPhoneNumberArgs
  >(SEND_CODE, {
    onError: (e) => {
      setLoading(false);
      setValue('');
      setHasError(true);
      setErrorText(e.message);
    },
    onCompleted: (e) => {
      setLoading(false);
    },
  });
  const [sendCodeEmail] = useMutation<
    SendMailCodePayload,
    MutationSendMailArgs
  >(SEND_CODE_EMAIL, {
    onError: (e) => {
      setLoading(false);
      setValue('');
      setHasError(true);
      setErrorText(e.message);
    },
    onCompleted: (e) => {
      setLoading(false);
    },
  });

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    if (timer === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearInterval(interval);
      return;
    }
    const interval = setInterval(() => {
      setTimer((seconds) => seconds - 1);
      clearInterval(interval);
    }, 1000);
  }, [timer]);
  const navigation = useNavigation();

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    if (route.params.selectedMethod === 'phone') {
      const { data } = await verifyCodeSms({
        variables: {
          data: {
            code: value,
            phone: route.params.user.phone,
            isRegister: false,
          },
        },
      });
      if (data?.codeRecovery) {
        navigation.navigate('RecoverPassword.StepThree', {});
      }
    } else {
      const { data } = await verifyCodeEmail({
        variables: {
          data: {
            code: value,
            email: route.params.user.email,
            isRegister: false,
          },
        },
      });
      if (data?.verifyEmailCode) {
        navigation.navigate('RecoverPassword.StepThree');
      }
    }
  };

  const handleResend = async (): Promise<void> => {
    setLoading(true);
    if (route.params.selectedMethod === 'phone') {
      await getRecoveryCodePhone({
        variables: {
          data: {
            phone: route.params.user.phone,
            isRegister: false,
          },
        },
      });
    } else {
      await sendCodeEmail({
        variables: {
          data: {
            email: route.params.user.email,
            isRegister: false,
          },
        },
      });
    }
  };

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Container
            keyboardShouldPersistTaps="never"
            scrollEnabled={false}
            contentContainerStyle={{
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <Header>
              <TouchableOpacity
                onPress={() => {
                  if (step < 1) {
                    navigation.goBack();
                  }
                  setStep(step - 1);
                }}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              >
                <Icon name="arrow-left" width={20} height={30} />
              </TouchableOpacity>
              <Title>Recuperar Senha</Title>
              <TouchableOpacity
                onPress={() => {}}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              />
            </Header>
            <Wrapper>
              <ScrollView showsVerticalScrollIndicator={false}>
                <SmallText>Digite o c??digo recebido.</SmallText>
                <CodeField
                  ref={ref}
                  {...props}
                  value={value}
                  onChangeText={setValue}
                  cellCount={CELL_COUNT}
                  onBlur={() => handleLogin()}
                  rootStyle={{
                    marginTop: 20,
                    width: 280,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({ index, symbol, isFocused }) => (
                    <View
                      // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                      onLayout={getCellOnLayoutHandler(index)}
                      key={index}
                      style={[
                        {
                          width: 60,
                          height: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottomColor: '#ccc',
                          borderBottomWidth: 1,
                        },
                        isFocused && {
                          borderBottomColor: '#007AFF',
                          borderBottomWidth: 2,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 26,
                          textAlign: 'center',
                        }}
                      >
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  )}
                />
                {error && <ErrorText>{errorText}</ErrorText>}
                {route.params.selectedMethod === 'email' && (
                  <ResendText disabled style={{ fontSize: 15 }}>
                    * Lembre-se de consultar sua caixa de SPAM.
                  </ResendText>
                )}

                <TouchableOpacity
                  disabled={timer > 0}
                  onPress={() => {
                    setTimer(60);
                    handleResend();
                  }}
                >
                  <ResendText disabled={timer > 0}>
                    Reenviar (0:{timer < 10 && '0'}
                    {timer})
                  </ResendText>
                </TouchableOpacity>
              </ScrollView>
              {loading && <ActivityIndicator size="large" color="#0564FF" />}
              <Button name="Pr??ximo" onPress={() => handleLogin()} />
            </Wrapper>
          </Container>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default RecoverEmail;
