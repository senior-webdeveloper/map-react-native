import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  NativeModules,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';

import styled from 'styled-components/native';
import { Formik } from 'formik';

import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import colors from '~/styles/colors';
import { translate } from '~/locales';
import {
  TitleText,
  SafeAreaView,
  InputWithIcon,
  Button,
  SmallText,
  CodeField,
  Icons as CustomIcon,
  MaskedInputWithoutLabel,
  Picker,
  Input as InputWithFloatLabel,
  Text,
} from '~/components';
import {
  useRegisterAppleUserMutation,
  useSendMailMutation,
} from '~/graphql/autogenerate/hooks';
import {
  MutationVerifyEmailCodeArgs,
  MutationRegisterArgs,
  MutationVerifyPhoneNumberArgs,
  MutationCodeRecoveryArgs,
  MutationSendMailArgs,
  MutationLoginArgs,
} from '~/generated/graphql';
import { RootStackParamList } from '~/routes.types';

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

export const HeaderText = styled(Text)`
  font-size: 24px;
  line-height: 24px;
`;
export const DescriptionText = styled(SmallText)`
  font-size: 16px;
  line-height: 16px;
  margin-bottom: 66px;
`;
type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'User.AppleWelcomeEmail'
>;
type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'User.AppleWelcomeEmail'
>;
type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

const AppleWelcomeEmail: React.FC<Props> = ({ route, navigation }) => {
  const [emailError, setEmailError] = useState<string>();

  const [sendCodeEmail] = useSendMailMutation({
    onError: (e) => {
      setEmailError(e.message);
    },
  });

  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Você deve informar um e-mail válido')
      .required('Você deve informar um e-mail!'),
  });
  const handleEmail = async (values) => {
    const { data } = await sendCodeEmail({
      variables: {
        data: {
          email: String(values.email).toLowerCase(),
          isRegister: true,
        },
      },
    });
    if (data?.sendMail) {
      navigation.navigate('User.AppleWelcomeConfirmCode', {
        email: values.email,
        ...route.params,
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
            {route.params.hasPrevious && (
              <Header>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                >
                  <Icon name="arrow-left" width={20} height={30} />
                </TouchableOpacity>
                <Title>Cadastro</Title>
                <View style={{ width: 20 }} />
              </Header>
            )}

            <Formik
              initialValues={{ email: '' }}
              onSubmit={handleEmail}
              validationSchema={schema}
            >
              {({
                values,
                setFieldTouched,
                handleChange,
                errors,
                handleSubmit,
              }) => (
                <Wrapper>
                  <View>
                    <HeaderText>Nos informe um e-mail</HeaderText>
                    <DescriptionText>
                      Não se preocupe, nunca lhe enviaremos Spam.
                    </DescriptionText>
                    <Input
                      leftIcon="mail"
                      placeholder="Digite seu email"
                      keyboardType="email-address"
                      autoCompleteType="email"
                      autoCapitalize="none"
                      isRegister
                      onChangeText={handleChange('email')}
                      onBlur={() => {
                        setFieldTouched('email');
                      }}
                      customValue={values.email}
                      loginError={emailError}
                      error={errors.email}
                      isValid={values.email.length > 0}
                    />
                  </View>
                  <Button name="Próximo" onPress={handleSubmit} />
                </Wrapper>
              )}
            </Formik>
          </Container>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default AppleWelcomeEmail;
