import React, { useRef, useState, useEffect } from 'react';
import OneSignal from 'react-native-onesignal';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import {
  NativeModules,
  LayoutAnimation,
  Vibration,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  Alert,
  ActivityIndicator,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Materialcons from 'react-native-vector-icons/MaterialIcons';
import { Formik } from 'formik';
import * as Sentry from '@sentry/react-native';
import * as Yup from 'yup';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';

import {
  TitleText,
  SafeAreaView,
  InputWithIcon,
  Button,
  SmallText,
} from '~/components';
import CustomIcon from '~/components/Icons';
import CheckBox from '~/components/Checkbox';
import {
  HeaderContainer,
  HeaderText,
  LoginContainer,
  LoginButtonContainer,
  GoBackButton,
  GoBackButtonBold,
  ErrorText,
  RecoverEmailText,
} from './User.EmailLogin.styles';
import colors from '~/styles/colors';
import { translate } from '~/locales';
import {
  Mutation,
  MutationLoginArgs,
  Query,
  QueryCheckEmailArgs,
} from '~/generated/graphql';
import { useUserCompaniesQuery } from '~/graphql/autogenerate/hooks';
import addDays from '~/helpers/addDays';
import { useUpdateLastLogin } from '~/hooks';

export const Container = styled.ScrollView`
  padding: 23px;
  height: 100%;
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

  position: absolute;
  bottom: 0;
  right: 0;
`;
export const ForgotText = styled(SmallText)`
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
`;
export const Wrapper = styled.View`
  flex-direction: row;
`;
export const TouchHereText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.blue};
`;
export const Divider = styled.View`
  margin-top: 30px;
`;

const LOGIN_WITH_EMAIL = gql`
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

const CHECK_EMAIL = gql`
  query checkEmail($email: String!) {
    checkEmail(email: $email) {
      id
      email
      phone
      firstname
      lastname
      profile {
        profile_avatar
      }
    }
  }
`;
interface ICheckEmailPayload {
  checkEmail: Query['checkEmail'];
}
interface ILoginPayload {
  login: Mutation['login'];
}
const UserEmailLogin: React.FC = ({ route }) => {
  const { handleUpdateLastLogin } = useUpdateLastLogin();
  const [loginErrorPassword, setLoginErrorPassword] = useState('');
  const [loginErrorEmail, setLoginErrorEmail] = useState('');
  const [hasErrorOnEmail, setHasErrorOnEmail] = useState(false);
  const { data: userCompany, refetch: getCompanies } = useUserCompaniesQuery();

  const [login] = useMutation<ILoginPayload, MutationLoginArgs>(
    LOGIN_WITH_EMAIL,
    {
      onError: (e) => {
        setLoginErrorPassword(e.message);
      },
    },
  );
  const [checkEmail, { loading, data: checkEmailResonse }] = useLazyQuery<
    ICheckEmailPayload,
    QueryCheckEmailArgs
  >(CHECK_EMAIL, {
    onError: (e) => {
      setLoginErrorEmail(e.message);
      setHasErrorOnEmail(true);
    },
  });
  const navigation = useNavigation();

  const schemaLogin = Yup.object().shape({
    email: Yup.string()
      .email('Você deve informar um e-mail válido')
      .required('Você deve informar um e-mail!'),
    password: Yup.string().when('isCheckEmail', {
      is: true,
      then: Yup.string()
        .min(6, 'As senhas devem ter pelo menos 6 digitos')
        .required('Você deve informar uma senha'),
    }),
  });

  const handleLogin = async (values) => {
    const { data: loginPayload } = await login({
      variables: {
        data: {
          email: String(values.email).toLowerCase(),
          password: values.password,
        },
      },
    });

    console.log(loginPayload);

    if (loginPayload) {
      OneSignal.setExternalUserId(loginPayload.login.user.id, (results) => {
        // The results will contain push and email success statuses
        console.log(`User id to onesignal: ${loginPayload.login.user.id}`);
        console.log('Results of setting external user id');
        console.log(results);
      });

      await AsyncStorage.setItem(
        '@riderize::user_id',
        loginPayload.login.user.id,
      );
      await AsyncStorage.setItem(
        `@riderize::${loginPayload.login.user.id}:acesstoken:`,
        loginPayload.login.accessToken,
      );

      await AsyncStorage.setItem(
        `@riderize::${loginPayload.login.user.id}:refreshtoken:`,
        loginPayload.login.refreshToken,
      );
      await AsyncStorage.setItem(
        `@riderize::${loginPayload.login.user.id}:profileid:`,
        loginPayload.login.user.profile.id,
      );
      await AsyncStorage.setItem(
        `@riderize::${loginPayload.login.user.id}:userinfo:`,
        JSON.stringify(loginPayload?.login.user),
      );

      handleUpdateLastLogin();

      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
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
        <Container
          keyboardShouldPersistTaps="never"
          scrollEnabled={false}
          contentContainerStyle={{
            justifyContent: 'space-between',
            flex: 1,
          }}
        >
          <View>
            <Header>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              >
                <Icon name="arrow-left" width={20} height={30} />
              </TouchableOpacity>
              <Title>Login</Title>
              <TouchableOpacity
                onPress={() => {}}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              />
            </Header>
            <Formik
              initialValues={{
                email: route.params.email ? route.params.email : '',
                password: '',
              }}
              onSubmit={handleLogin}
              validationSchema={schemaLogin}
            >
              {({
                values,
                setFieldTouched,
                handleChange,
                errors,
                handleSubmit,
                initialValues,
                isValid,
              }) => (
                <>
                  <Divider />
                  <View>
                    <Input
                      leftIcon="mail"
                      placeholder="Digite seu email"
                      keyboardType="email-address"
                      autoCompleteType="email"
                      autoCapitalize="none"
                      onChangeText={handleChange('email')}
                      onBlur={() => {
                        setHasErrorOnEmail(false);
                        setLoginErrorEmail('');
                        setFieldTouched('email');
                        checkEmail({
                          variables: {
                            email: String(values.email).toLowerCase(),
                          },
                        });
                      }}
                      error={errors.email}
                      isValid={values.email.length > 0}
                      loginError={loginErrorEmail}
                      defaultValue={initialValues.email}
                    />
                    <ActionsContainer>
                      <View />
                      {loginErrorEmail.length > 0 && (
                        <TouchableOpacity
                          onPress={() => navigation.navigate('User.RecoverEmail')}
                        >
                          <ForgotText>Esqueci o Email</ForgotText>
                        </TouchableOpacity>
                      )}
                    </ActionsContainer>
                  </View>
                  <Divider />
                  <View>
                    <Input
                      leftIcon="lock"
                      rightIcon="eye"
                      isPassword
                      placeholder="Digite sua senha"
                      onChangeText={handleChange('password')}
                      autoCapitalize="none"
                      autoCompleteType="password"
                      onBlur={() => {
                        setLoginErrorPassword('');
                        setFieldTouched('password');
                      }}
                      isValid={values.password.length > 0}
                      error={errors.password}
                      loginError={loginErrorPassword}
                    />
                    {loginErrorPassword.length > 0 && (
                      <ActionsContainer>
                        <View />
                        <TouchableOpacity
                          onPress={() => {
                            if (checkEmailResonse?.checkEmail.phone) {
                              navigation.navigate('User.RecoverPassword', {
                                email: checkEmailResonse?.checkEmail.email,
                                phone: checkEmailResonse?.checkEmail.phone,
                                name: `${checkEmailResonse?.checkEmail.firstname} ${checkEmailResonse?.checkEmail.lastname}`,
                                avatar:
                                  checkEmailResonse?.checkEmail.profile
                                    .profile_avatar,
                              });
                            } else {
                              Alert.alert(
                                'Conta Associada',
                                'Esta conta de email está associada a um login com terceiros (Facebook/Google).',
                              );
                            }
                          }}
                        >
                          <ForgotText>Esqueci a senha</ForgotText>
                        </TouchableOpacity>
                      </ActionsContainer>
                    )}
                  </View>
                  <Button
                    name="Entrar"
                    onPress={handleSubmit}
                    disabled={
                      !isValid ||
                      hasErrorOnEmail ||
                      values.email.length === 0 ||
                      values.password.length === 0
                    }
                  />
                </>
              )}
            </Formik>
          </View>
          <Wrapper>
            <SmallText>Novo usuário?</SmallText>
            <TouchableOpacity
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              onPress={() => navigation.navigate('User.EmailSignUp')}
            >
              <TouchHereText> Clique aqui</TouchHereText>
            </TouchableOpacity>
          </Wrapper>
        </Container>
      </SafeAreaView>
    </>
  );
};

export default UserEmailLogin;
