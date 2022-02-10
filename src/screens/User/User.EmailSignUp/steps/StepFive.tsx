/* eslint-disable react/jsx-props-no-spreading */
import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  NativeModules,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';

import styled from 'styled-components/native';
import { Formik } from 'formik';

import OneSignal from 'react-native-onesignal';
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
} from '~/components';
import {
  REGISTER_USER,
  SEND_CODE_EMAIL,
  SEND_CODE_SMS,
  VERIFY_CODE_EMAIL,
  VERIFY_CODE_SMS,
  LOGIN_WITH_EMAIL,
  ISendMailCodePayload,
  IRegisterPayload,
  IVerifyMailCodePayload,
  ISendCodeToNumberPayload,
  IVerifySmsCodePayload,
  ILoginPayload,
} from '../graphql';
import {
  MutationVerifyEmailCodeArgs,
  MutationRegisterArgs,
  MutationVerifyPhoneNumberArgs,
  MutationCodeRecoveryArgs,
  MutationSendMailArgs,
  MutationLoginArgs,
} from '~/generated/graphql';
import { RootStackEmailSignupParamList } from '../User.EmailSignUp.screen';
import addDays from '~/helpers/addDays';
import { useDataCompiled, useUpdateLastLogin } from '~/hooks';

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

const { UIManager } = NativeModules;
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface LoginData {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
}
type StepTwoNavigationProp = RouteProp<
  RootStackEmailSignupParamList,
  'StepFive'
>;
type Props = {
  route: StepTwoNavigationProp;
};
const StepFive: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const [step, setStep] = useState<number>(1);
  const { handleUpdateLastLogin } = useUpdateLastLogin();
  const { fetch, payload, loading: loadingDataCompiled } = useDataCompiled();
  const [loading, setLoading] = useState(false);
  const [registerUser] = useMutation<IRegisterPayload, MutationRegisterArgs>(
    REGISTER_USER,
    {
      onError: (e) => {
        Alert.alert('Houve um erro', e.message);
      },
    },
  );

  const [login] = useMutation<ILoginPayload, MutationLoginArgs>(
    LOGIN_WITH_EMAIL,
    {
      onError: (e) => {
        Alert.alert('Houve um erro', e.message);
      },
    },
  );

  const schema = Yup.object().shape({
    name: Yup.string().required('Você deve informar seu nome!'),
    lastname: Yup.string().required('Você deve informar seu sobrenome!'),
    password: Yup.string()
      .min(6, 'As senhas devem ter pelo menos 6 digitos')
      .required('Você deve informar uma senha'),
    repassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'A senhas devem ser iguais!')
      .required('Você deve informar uma senha'),
  });
  const handleCreateUser = async (values): Promise<void> => {
    setLoading(true);
    console.log({
      firstname: values.name,
      lastname: values.lastname,
      password: values.password,
      phone: route.params.phone,
      email: route.params.email,
    });
    const { data } = await registerUser({
      variables: {
        data: {
          firstname: values.name,
          lastname: values.lastname,
          password: values.password,
          phone: route.params.phone,
          email: route.params.email,
          // username: values.firstname + values.lastname,
        },
      },
    });
    if (data?.Register) {
      const { data: loginPayload } = await login({
        variables: {
          data: {
            email: route.params.email,
            password: values.password,
          },
        },
      });
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
        fetch();
        navigation.reset({
          index: 0,
          routes: [
            { name: 'Home', params: { accepted_initial_screen: false } },
          ],
        });
        setLoading(false);
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
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
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
                <Title>Cadastro</Title>
                <TouchableOpacity
                  onPress={() => {}}
                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                />
              </Header>
              <Formik
                initialValues={{
                  name: '',
                  lastname: '',
                  password: '',
                  repassword: '',
                }}
                onSubmit={handleCreateUser}
                validateOnMount={false}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={schema}
              >
                {({
                  values,
                  setFieldTouched,
                  handleChange,
                  errors,
                  handleSubmit,
                  isValid,
                  handleBlur,
                }): JSX.Element => (
                  <Wrapper>
                    <InputWithFloatLabel
                      placeholder="Nome"
                      onChangeText={handleChange('name')}
                      onBlurFunc={() => setFieldTouched('name')}
                      error={errors.name}
                    />
                    <Divider />
                    <InputWithFloatLabel
                      placeholder="Sobrenome"
                      onChangeText={handleChange('lastname')}
                      onBlurFunc={() => setFieldTouched('name')}
                      error={errors.lastname}
                    />
                    <Divider />
                    <Input
                      leftIcon="lock"
                      rightIcon="eye"
                      isPassword
                      placeholder="Digite sua senha"
                      onChangeText={handleChange('password')}
                      autoCapitalize="none"
                      textContentType="newPassword"
                      onBlur={handleBlur('password')}
                      isValid={values.password.length > 0}
                      error={errors.password}
                      blurOnSubmit={false}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <Divider />
                    <Input
                      leftIcon="lock"
                      rightIcon="eye"
                      isPassword
                      placeholder="Digite novamente sua senha"
                      onChangeText={handleChange('repassword')}
                      autoCapitalize="none"
                      textContentType="password"
                      onBlur={handleBlur('repassword')}
                      // onBlur={() => setFieldTouched('repassword')}
                      isValid={values.repassword.length > 0}
                      error={errors.repassword}
                      blurOnSubmit={false}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    {loading && (
                      <ActivityIndicator color="#0564FF" size="large" />
                    )}
                    <Button
                      name="Próximo"
                      onPress={() => handleSubmit()}
                      disabled={loading}
                    />
                  </Wrapper>
                )}
              </Formik>
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default StepFive;
