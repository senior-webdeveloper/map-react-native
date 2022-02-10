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
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';

import styled from 'styled-components/native';
import { Formik } from 'formik';

import RNPickerSelect from 'react-native-picker-select';
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
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

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
type StepThreeNavigationProp = RouteProp<
  RootStackEmailSignupParamList,
  'StepThree'
>;
type Props = {
  route: StepThreeNavigationProp;
};
const StepThree: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const [step, setStep] = useState<number>(1);
  const [ddi, setDdi] = useState<string>('+55');
  const [errorOnNumber, setErrorOnNumber] = useState<string>();
  const [sendCodeSms] = useMutation<
    ISendCodeToNumberPayload,
    MutationVerifyPhoneNumberArgs
  >(SEND_CODE_SMS, {
    onError: (e) => {
      setErrorOnNumber(e.message);
    },
    onCompleted: (e) => {
      console.log(e.verifyPhoneNumber);
    },
  });
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(11, 'Você deve informar um número válido')
      .required('Você deve informar um número!'),
  });
  const handleLogin = async (values) => {
    const { data } = await sendCodeSms({
      variables: {
        data: {
          phone: ddi + values.phone,
          isRegister: true,
        },
      },
    });

    if (data?.verifyPhoneNumber) {
      navigation.navigate('StepFour', {
        email: route.params.email,
        phone: ddi + values.phone,
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
              <Title>Cadastro</Title>
              <TouchableOpacity
                onPress={() => {}}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              />
            </Header>
            <Formik
              initialValues={{ phone: '' }}
              onSubmit={handleLogin}
              validationSchema={schema}
              validateOnBlur={false}
              validateOnMount={false}
              validateOnChange={false}
            >
              {({
                values,
                handleChange,
                errors,
                handleSubmit,
              }): JSX.Element => (
                <Wrapper>
                  <View>
                    <SmallText>Digite o celular de contato.</SmallText>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 33,
                      }}
                    >
                      <Picker
                        data={[{ label: 'Brasil (+55)', value: '+55' }]}
                        value="+55"
                        // disabled
                        onChangeValue={(e) => setDdi(e)}
                      />

                      <View style={{ marginTop: -5 }}>
                        <MaskedInputWithoutLabel
                          type="cel-phone"
                          options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(99) ',
                          }}
                          placeholder="Celular de contato"
                          keyboardType="numeric"
                          style={{ width: widthPercentageToDP('60') }}
                          autoCompleteType="tel"
                          error={errors.phone ? errors.phone : errorOnNumber}
                          onChangeText={handleChange('phone')}
                        />
                      </View>
                    </View>
                  </View>
                  <Button
                    name="Próximo"
                    onPress={() => handleSubmit()}
                    disabled={values.phone.length < 1}
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

export default StepThree;
