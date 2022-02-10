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
import { Mutation, MutationVerifyPhoneNumberArgs } from '~/generated/graphql';

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

const RecoverEmail: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [ddi, setDdi] = useState<string>();
  const navigation = useNavigation();

  const [getRecoveryCode] = useMutation<
    PhoneNumberResponse,
    MutationVerifyPhoneNumberArgs
  >(SEND_CODE, {
    onError: (e) => {
      Alert.alert('Houve um erro', e.message);
    },
  });
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(11, 'Deve seguir no formato (xx)xxxx-xxxx')
      .required('Campo obrigatório!'),
  });
  const handlePhone = async (values) => {
    const { data } = await getRecoveryCode({
      variables: {
        data: {
          phone: ddi + values.phone,
          isRegister: false,
        },
      },
    });
    console.log(data);
    if (data) {
      navigation.navigate('RecoverEmail.StepTwo', {
        phone: ddi + values.phone,
        user: {
          email: data.verifyPhoneNumber.user?.email,
          firstname: data.verifyPhoneNumber.user?.firstname,
          lastname: data.verifyPhoneNumber.user?.lastname,
          avatar: data.verifyPhoneNumber.user?.profile.profile_avatar,
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
              <Title>Recuperar Email</Title>
              <TouchableOpacity
                onPress={() => {}}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              />
            </Header>
            <Formik
              initialValues={{ phone: '' }}
              onSubmit={handlePhone}
              validationSchema={schema}
            >
              {({
                values,
                setFieldTouched,
                handleChange,
                errors,
                handleSubmit,
                isValid,
              }) => (
                <Wrapper>
                  {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                  <View>
                    <SmallText>
                      Ok! Vamos tentar recuperar seu acesso,
                    </SmallText>
                    <SmallText> por favor informe seu celular:</SmallText>
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
                        onChangeValue={(e) => setDdi(e)}
                      />
                      <View style={{ marginTop: 13 }}>
                        <MaskedInputWithoutLabel
                          type="cel-phone"
                          options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(99) ',
                          }}
                          placeholder="Celular de contato"
                          keyboardType="numeric"
                          autoCompleteType="tel"
                          onBlur={() => setFieldTouched('phone')}
                          error={errors.phone}
                          onChangeText={handleChange('phone')}
                        />
                      </View>
                    </View>
                  </View>
                  {/* </ScrollView> */}
                  <Button
                    name="Próximo"
                    onPress={() => handleSubmit()}
                    disabled={!isValid || !ddi}
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
