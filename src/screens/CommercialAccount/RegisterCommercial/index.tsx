/* eslint-disable @typescript-eslint/camelcase */
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
import { gql, useMutation, useQuery } from '@apollo/client';
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
  MutationCreateCompanyArgs,
  Query,
  QueryGetCityArgs,
  QueryGetStatesArgs,
} from '~/generated/graphql';
import { useUserToken } from '~/hooks';

const CREATE_COMPANY = gql`
  mutation createCompany($data: CreateCompanyInput!) {
    createCompany(data: $data) {
      business_name
    }
  }
`;
interface CreateCompanyProps {
  createCompany: Mutation['createCompany'];
}

const GET_ALL_STATES = gql`
  query getAllStates($pagination: PaginationInput!) {
    getStates(pagination: $pagination) {
      id
      name
    }
  }
`;
interface StatesProps {
  getStates: Query['getStates'];
}
const GET_ALL_CITY = gql`
  query getCity($data: CitiesInput!, $pagination: PaginationInput!) {
    getCity(data: $data, pagination: $pagination) {
      id
      name
    }
  }
`;
interface CitiesProps {
  getCity: Query['getCity'];
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
export const Input = styled(InputWithFloatLabel)``;
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
interface FormProps {
  fantasy_name: string;
  business_name: string;
  site: string;
  email: string;
  category: string;
  address_one: string;
  address_two: string;
  phone: string;
  city: string;
}
const RegisterCommercial: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [ddi, setDdi] = useState<string>();
  const [stateSelected, setStateSelected] = useState<string>('');
  const navigation = useNavigation();
  const [createCompany] = useMutation<
    CreateCompanyProps,
    MutationCreateCompanyArgs
  >(CREATE_COMPANY, {
    errorPolicy: 'all',
    onError: (err) => {
      Alert.alert(err.message);
    },
    onCompleted: (e) => {
      Alert.alert(
        'Sucesso!',
        `A conta da empresa ${e.createCompany.business_name} foi criada com sucesso!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
        { cancelable: false },
      );
    },
  });
  const {
    data: getAllCities,
    loading,
    refetch,
  } = useQuery<CitiesProps, QueryGetCityArgs>(GET_ALL_CITY, {
    onError: (e) => console.log(`Cities ::${e.message}`),
    onCompleted: (e) => console.log(`States ::${e.getCity}`),
    variables: {
      data: {
        state_id: stateSelected,
      },
      pagination: {
        offset: 900,
        page: 1,
      },
    },
  });
  const { data: statesPayload, loading: loadingStates } = useQuery<
    StatesProps,
    QueryGetStatesArgs
  >(GET_ALL_STATES, {
    variables: {
      pagination: {
        offset: 27,
        page: 1,
      },
    },
    onError: (e) => console.log(`States :: ${e.message}`),
    onCompleted: (e) => console.log(e.getStates),
  });
  const schema = Yup.object().shape({
    site: Yup.string()
      .url('Deve seguir o formato "http://site.com" ')
      .required('Campo obrigatório'),
    fantasy_name: Yup.string().required('Campo obrigatório'),
    business_name: Yup.string().required('Campo obrigatório'),
    email: Yup.string()
      .email('Campo obrigatório')
      .required('Campo obrigatório'),
    address_one: Yup.string().required('Campo obrigatório'),
    address_two: Yup.string().required('Campo obrigatório'),
    phone: Yup.string()
      .min(11, 'Você deve informar um número válido')
      .required('Campo obrigatório!'),
  });
  const handleLogin = async (values: FormProps): Promise<void> => {
    await createCompany({
      variables: {
        data: {
          business_name: values.business_name,
          fantasy_name: values.fantasy_name,
          phone_number: ddi + values.phone,
          email: values.email,
          address_one: values.address_one,
          address_two: values.address_two,
          city_id: values.city,
          site: values.site,
        },
      },
    });
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
              <Title>Cadastro comercial</Title>
              <TouchableOpacity
                onPress={() => {}}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              />
            </Header>
            <Formik
              initialValues={{
                fantasy_name: '',
                business_name: '',
                site: '',
                email: '',
                category: '',
                address_one: '',
                address_two: '',
                city: '',
                phone: '',
              }}
              onSubmit={handleLogin}
              validationSchema={schema}
            >
              {({
                values,
                setFieldTouched,
                handleChange,
                errors,
                handleSubmit,
                handleBlur,
                isValid,
              }) => (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    // flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Input
                      placeholder="Nome Fantasia"
                      onChangeText={handleChange('fantasy_name')}
                      onBlurFunc={() => setFieldTouched('fantasy_name')}
                      error={errors.fantasy_name}
                    />
                    <Input
                      placeholder="Razão Social"
                      onChangeText={handleChange('business_name')}
                      onBlurFunc={() => setFieldTouched('business_name')}
                      error={errors.business_name}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        paddingTop: 33,
                      }}
                    >
                      <Picker
                        data={[{ label: 'Brasil (+55)', value: '+55' }]}
                        onChangeValue={(e) => setDdi(e)}
                      />
                      <View>
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
                          onBlur={() => setFieldTouched('email')}
                          error={errors.phone}
                          onChangeText={handleChange('phone')}
                        />
                      </View>
                    </View>
                    <Input
                      placeholder="Site"
                      onChangeText={handleChange('site')}
                      autoCapitalize="none"
                      onBlurFunc={() => setFieldTouched('site')}
                      error={errors.site}
                    />
                    <Divider />
                    <SmallText>Categoria:</SmallText>
                    <Picker
                      onChangeValue={handleChange('category')}
                      data={[{ label: 'Loja Fisica', value: 'loja-fisica' }]}
                    />
                    <Input
                      placeholder="Digite seu email"
                      onChangeText={handleChange('email')}
                      autoCapitalize="none"
                      onBlurFunc={() => setFieldTouched('email')}
                      error={errors.email}
                    />
                    <Input
                      placeholder="Digite o endereço"
                      onChangeText={handleChange('address_one')}
                      onBlurFunc={() => setFieldTouched('address_one')}
                      error={errors.address_one}
                    />
                    <Input
                      placeholder="Complemento"
                      onChangeText={handleChange('address_two')}
                      onBlurFunc={() => setFieldTouched('address_two')}
                      error={errors.address_two}
                    />

                    <Divider />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ width: '45%' }}>
                        {statesPayload &&
                          statesPayload?.getStates &&
                          statesPayload?.getStates.length > 0 && (
                            <>
                              <SmallText>Estado:</SmallText>
                              <Picker
                                data={statesPayload?.getStates.map((state) => {
                                  return { label: state.name, value: state.id };
                                })}
                                onChangeValue={(e) => {
                                  setStateSelected(e);
                                }}
                              />
                            </>
                          )}
                      </View>
                      <View style={{ width: '100%' }}>
                        {getAllCities &&
                          getAllCities?.getCity &&
                          getAllCities?.getCity.length > 0 && (
                            <>
                              <SmallText>Cidade:</SmallText>
                              <Picker
                                data={getAllCities?.getCity.map((city) => {
                                  return { label: city.name, value: city.id };
                                })}
                                onChangeValue={handleChange('city')}
                              />
                            </>
                          )}
                      </View>
                    </View>
                  </View>
                  <Button
                    name="Próximo"
                    onPress={() => handleSubmit()}
                    disabled={!isValid}
                  />
                </ScrollView>
              )}
            </Formik>
          </Container>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default RegisterCommercial;
