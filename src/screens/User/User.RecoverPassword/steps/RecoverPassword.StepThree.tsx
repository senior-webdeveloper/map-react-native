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
import { RouteProp, useNavigation } from '@react-navigation/native';
import { PUBLIC_STORAGE } from '@env';
import { gql, useMutation } from '@apollo/client';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';
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
import { RootStackRecoverPasswordParamList } from '../User.RecoverPassword.screen';
import {
  Mutation,
  MutationChangeUserPasswordArgs,
  MutationLoginArgs,
} from '~/generated/graphql';
import { useLoginEmailLoginMutation } from '~/graphql/autogenerate/hooks';
import { useUpdateLastLogin } from '~/hooks';

const LOGIN_WITH_EMAIL = gql`
  mutation loginEmailLogin($data: LoginUserInput!) {
    login(data: $data) {
      user {
        id
        profile {
          id
        }
      }
      accessToken
      refreshToken
    }
  }
`;

interface ChangeUserPasswordProps {
  changeUserPassword: Mutation['changeUserPassword'];
}
const CHANGE_USER_PASSWORD = gql`
  mutation changeUserPassword($data: RecoverUserPasswordInput!) {
    changeUserPassword(data: $data) {
      id
    }
  }
`;

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
  width: 124px;
  height: 124px;
`;

type StepThreeNavigationProp = RouteProp<
  RootStackRecoverPasswordParamList,
  'RecoverPassword.StepThree'
>;
type Props = {
  route: StepThreeNavigationProp;
};
interface MutationLoginProps {
  login: Mutation['login'];
}
const RecoverEmail: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const [loginEmailLoginMutation] = useLoginEmailLoginMutation();
  const { handleUpdateLastLogin } = useUpdateLastLogin();

  const [changePassword] = useMutation<
    ChangeUserPasswordProps,
    MutationChangeUserPasswordArgs
  >(CHANGE_USER_PASSWORD, {
    onError: (e) => {
      Alert.alert('Houve um erro', e.message);
    },
  });
  const schema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'As senhas devem ter pelo menos 6 digitos')
      .required('Você deve informar uma senha'),
    repassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'A senhas devem ser iguais!')
      .required('Você deve informar uma senha'),
  });
  const handleLogin = async (values) => {
    const { data } = await changePassword({
      variables: {
        data: {
          email: String(route.params.email).toLowerCase(),
          password: values.password,
        },
      },
    });
    if (data?.changeUserPassword) {
      const { data: loginPayload } = await loginEmailLoginMutation({
        variables: {
          data: {
            email: String(route.params.email).toLowerCase(),
            password: values.password,
          },
        },
      });

      if (loginPayload) {
        console.log(loginPayload.login.user.profile.id);
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
                  navigation.goBack();
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
            <Formik
              initialValues={{ password: '', repassword: '' }}
              onSubmit={handleLogin}
              validationSchema={schema}
            >
              {({
                values,
                setFieldTouched,
                handleChange,
                errors,
                handleSubmit,
                isValid,
              }): JSX.Element => (
                <Wrapper>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    viewIsInsideTabBar
                    enableAutomaticScroll={false}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Avatar
                        source={{
                          uri: `${PUBLIC_STORAGE}/${route.params.avatar}`,
                        }}
                      />
                      <Title>{route.params.name}</Title>
                      <Divider />
                      <SmallText>
                        Você está redefinindo a senha do email
                      </SmallText>
                      <SmallText>{route.params.email}</SmallText>
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
                        onBlur={() => setFieldTouched('password')}
                        isValid={values.password.length > 0}
                        error={errors.password}
                      />
                    </View>
                    <View>
                      <Input
                        leftIcon="lock"
                        rightIcon="eye"
                        isPassword
                        placeholder="Digite novamente sua senha"
                        onChangeText={handleChange('repassword')}
                        autoCapitalize="none"
                        autoCompleteType="password"
                        onBlur={() => setFieldTouched('repassword')}
                        isValid={values.password.length > 0}
                        error={errors.repassword}
                      />
                    </View>
                  </ScrollView>
                  <Button
                    name="Entrar"
                    onPress={() => handleSubmit()}
                    disabled={!isValid}
                  />
                </Wrapper>
              )}
            </Formik>
          </Container>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default RecoverEmail;
