import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';
import {
  TitleText,
  SafeAreaView,
  InputWithIcon,
  Button,
  SmallText,
  CodeField,
  Icons as CustomIcon,
  Input as InputWithFloatLabel,
  Radio,
  Picker,
  MaskedInputWithoutLabel,
} from '~/components';
import {
  Mutation,
  MutationSendMailArgs,
  MutationVerifyPhoneNumberArgs,
} from '~/generated/graphql';
import { RootStackRecoverPasswordParamList } from '../User.RecoverPassword.screen';

const SEND_CODE = gql`
  mutation verifyPhoneNumber($data: PhoneInput!) {
    verifyPhoneNumber(data: $data) {
      codeStatus
      user {
        firstname
        lastname
        email
        profile {
          profile_avatar
        }
      }
    }
  }
`;
interface PhoneNumberResponse {
  verifyPhoneNumber: Mutation['verifyPhoneNumber'];
}

export const SEND_CODE_EMAIL = gql`
  mutation sendMailEmailSignup($data: SendEmailInput!) {
    sendMail(data: $data)
  }
`;

export interface SendMailCodePayload {
  sendMail: Mutation['sendMail'];
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

type StepOneNavigationProp = RouteProp<
  RootStackRecoverPasswordParamList,
  'RecoverPassword.StepOne'
>;
type Props = {
  route: StepOneNavigationProp;
};
const RecoverEmail: React.FC<Props> = ({ route }) => {
  const [step, setStep] = useState<number>(0);
  const [value, setValue] = useState<number>(0);
  const navigation = useNavigation();
  const finalNumber = route.params.phone.slice(10, 14);
  const [getRecoveryCodePhone] = useMutation<
    PhoneNumberResponse,
    MutationVerifyPhoneNumberArgs
  >(SEND_CODE, {
    onError: (e) => {
      Alert.alert('Houve um erro', e.message);
    },
  });

  const [sendCodeEmail] = useMutation<
    SendMailCodePayload,
    MutationSendMailArgs
  >(SEND_CODE_EMAIL, {
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (e) => {
      console.log(e);
    },
  });

  const handlePhone = async () => {
    if (value === '0') {
      const { data } = await getRecoveryCodePhone({
        variables: {
          data: {
            phone: route.params.phone,
            isRegister: false,
          },
        },
      });
      console.log(data);
      if (data) {
        navigation.navigate('RecoverPassword.StepTwo', {
          selectedMethod: 'phone',
        });
      }
    } else if (value === '1') {
      const { data } = await sendCodeEmail({
        variables: {
          data: {
            email: route.params.email,
            isRegister: false,
          },
        },
      });
      console.log(data);
      if (data) {
        navigation.navigate('RecoverPassword.StepTwo', {
          selectedMethod: 'email',
        });
      }
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
              <View>
                <SmallText>Ok! Vamos tentar recuperar seu acesso,</SmallText>
                <SmallText>
                  por favor selecione por qual meio devemos enviar o código:
                </SmallText>
                <View
                  style={{
                    paddingTop: 33,
                  }}
                >
                  <Radio
                    item={[
                      {
                        label: `(**) ***** - ${finalNumber}`,
                        value: 0,
                      },
                      { label: route.params.email, value: 1 },
                    ]}
                    onChangeValue={(e) => setValue(e)}
                  />
                </View>
              </View>
              <Button name="Próximo" onPress={() => handlePhone()} />
            </Wrapper>
          </Container>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default RecoverEmail;
