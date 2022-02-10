/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import ImagePicker from 'react-native-image-crop-picker';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { RouteProp, useNavigation } from '@react-navigation/native';
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
  Icons,
} from '~/components';
import {
  Mutation,
  MutationUpdateProfilePersonalArgs,
} from '~/generated/graphql';
import {
  useGetAllStatesQuery,
  useGetCityQuery,
} from '~/graphql/autogenerate/hooks';
import { RootStackParamList } from '~/routes.types';

const UPDATE_PROFILE = gql`
  mutation updateProfilePersonal($data: UpdateProfilePersonalInput!) {
    updateProfilePersonal(data: $data) {
      id
      username
      description
    }
  }
`;
interface UpdateProfilePayload {
  updateProfilePersonal: Mutation['updateProfilePersonal'];
}
export const Container = styled.ScrollView`
  padding: 23px;
  padding-bottom: 50px;
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

export const EditableButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  padding: 2px 5px;
  border-radius: 12px;
`;
type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'User.EditProfileInfo'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};
const UserEditProfileInfo: React.FC<Props> = ({ route }) => {
  const [step, setStep] = useState<number>(0);
  const [edit, setEdit] = useState<boolean>(false);
  const [stateSelected, setStateSelected] = useState<string>(
    route.params.user.user.city?.state.id
      ? route.params.user.user.city?.state.id
      : '',
  );
  const [citySelected, setCitySelected] = useState<string>(
    route.params.user.user.city?.id ? route.params.user.user.city?.id : '',
  );
  const [gender, setGender] = useState<string>(
    route.params.user.user.gender ? route.params.user.user.gender : '',
  );
  const navigation = useNavigation();
  const handleDate = (date: string) => {
    if (date) {
      const initDate = date.split('-');
      const finishedDate = initDate[2].split('T');
      return `${initDate[1]}/${finishedDate[0]}/${initDate[0]}`;
    }
  };
  const [updateProfile] = useMutation<
    UpdateProfilePayload,
    MutationUpdateProfilePersonalArgs
  >(UPDATE_PROFILE, {
    onError: (e) => console.log(e),
    onCompleted: (e) =>
      Alert.alert('Sucesso!', 'Perfil Atualizado com Sucesso!'),
  });
  const { data: states, loading: statesLoading } = useGetAllStatesQuery({
    variables: {
      pagination: {
        offset: 27,
        page: 1,
      },
    },
  });
  const { data: city, loading: cityLoading } = useGetCityQuery({
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

  const schema = Yup.object().shape({
    firstname: Yup.string().required('Você deve informar um Nome!'),
    lastname: Yup.string().required('Você deve informar um Sobrenome!'),
    gender: Yup.string().matches(/[M>Fm>f]/, 'Somente M ou F'),
    dateOfBirth: Yup.string().matches(
      /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
      'Deve seguir o formato DD/MM/AAAA',
    ),
    username: Yup.string()
      .matches(/^[A-Za-z0-9_-]*$/, 'Não deve conter caracteres especiais')
      .required('Você deve informar um Nome de usuario!'),
  });
  const handleLogin = async (values): Promise<void> => {
    console.log({
      description: values.description,
      firstname: values.firstname,
      lastname: values.lastname,
      date_of_birth: values.dateOfBirth ? new Date(values.dateOfBirth) : null,
      username: values.username,
      stature: Number(values.stature),
      weight: Number(values.weight),
      gender,
      address_line_one: values.addressOne,
      address_line_two: values.addressTwo,
      // legal_registry_number: values.legalRegistryNumber,
      city_id: citySelected.length > 0 ? citySelected : null,
    });
    const { data } = await updateProfile({
      variables: {
        data: {
          description: values.description,
          firstname: values.firstname,
          lastname: values.lastname,
          date_of_birth: values.dateOfBirth
            ? new Date(values.dateOfBirth)
            : null,
          username: values.username,
          stature: Number(values.stature),
          weight: Number(values.weight),
          gender: values.gender,
          address_line_one: values.addressOne,
          address_line_two: values.addressTwo,
          // legal_registry_number: values.legalRegistryNumber,
          city_id: citySelected.length > 0 ? citySelected : null,
        },
      },
    });
    if (data?.updateProfilePersonal) {
      setEdit(false);
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
        {/* <KeyboardAvoidingView */}
        {/*  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} */}
        {/* > */}
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
              style={{ width: 50 }}
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            >
              <Icon name="arrow-left" width={20} height={30} />
            </TouchableOpacity>
            <Title>Meus Dados</Title>
            <EditableButton
              onPress={() => setEdit(!edit)}
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            >
              <SmallText>Editar</SmallText>
              <Icons name="pen" />
            </EditableButton>
          </Header>
          <Formik
            validateOnChange={false}
            validateOnMount={false}
            initialValues={{
              firstname: route.params.user.user.firstname || '',
              lastname: route.params.user.user.lastname || '',
              username: route.params.user.username || '',
              legalRegistryNumber: '',
              weight: String(
                route.params.user.user.weight !== null
                  ? route.params.user.user.weight
                  : '',
              ),
              stature: String(
                route.params.user.user.stature !== null
                  ? route.params.user.user.stature
                  : '',
              ),
              gender: route.params.user.user.gender || '',
              description: route.params.user.description || '',
              dateOfBirth:
                handleDate(route.params.user.user.date_of_birth) || '',
              addressOne: route.params.user.user.address_line_one || '',
              addressTwo: route.params.user.user.address_line_two || '',
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
              isValid,
              initialValues,
            }) => (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  // flex: 1,
                  justifyContent: 'space-between',
                  // marginBottom: 50,
                }}
              >
                <View>
                  <Input
                    placeholder="Nome"
                    onChangeText={handleChange('firstname')}
                    onBlurFunc={() => setFieldTouched('firstname')}
                    initialValue={initialValues.firstname}
                    error={errors.firstname}
                    editable={edit}
                    isEditable={edit}
                  />
                  <Input
                    placeholder="Sobrenome"
                    onChangeText={handleChange('lastname')}
                    onBlurFunc={() => setFieldTouched('lastname')}
                    initialValue={initialValues.lastname}
                    editable={edit}
                    error={errors.lastname}
                    isEditable={edit}
                  />
                  <Input
                    placeholder="Nome de usuário"
                    onChangeText={handleChange('username')}
                    onBlurFunc={() => {
                      setFieldTouched('username');
                    }}
                    initialValue={initialValues.username}
                    autoCapitalize="none"
                    editable={edit}
                    error={errors.username}
                    isEditable={edit}
                  />
                  <Input
                    placeholder="Sobre"
                    isMultiline
                    editable={edit}
                    initialValue={initialValues.description}
                    onChangeText={handleChange('description')}
                    onBlurFunc={() => setFieldTouched('description')}
                    error={errors.description}
                    isEditable={edit}
                  />
                  <MaskedInputWithoutLabel
                    type="datetime"
                    options={{
                      format: 'DD/MM/yyyy',
                    }}
                    placeholder="Data de Aniversário"
                    onBlur={() => setFieldTouched('dateOfBirth')}
                    value={values.dateOfBirth}
                    initialValue={initialValues.dateOfBirth}
                    error={errors.dateOfBirth}
                    isDate
                    editable={edit}
                    isEditable={edit}
                    onChangeText={handleChange('dateOfBirth')}
                  />
                  {/* <MaskedInputWithoutLabel */}
                  {/*  type="cpf" */}
                  {/*  placeholder="CPF" */}
                  {/*  onBlur={() => setFieldTouched('legalRegistryNumber')} */}
                  {/*  value={values.legalRegistryNumber} */}
                  {/*  initialValue={initialValues.legalRegistryNumber} */}
                  {/*  error={errors.legalRegistryNumber} */}
                  {/*  editable={edit} */}
                  {/*  onChangeText={handleChange('legalRegistryNumber')} */}
                  {/* /> */}
                  <Input
                    placeholder="Endereço"
                    editable={edit}
                    initialValue={initialValues.addressOne}
                    onChangeText={handleChange('addressOne')}
                    onBlurFunc={() => setFieldTouched('addressOne')}
                    error={errors.addressOne}
                    autoCapitalize="none"
                    isEditable={edit}
                  />
                  <Input
                    placeholder="Complemento"
                    editable={edit}
                    initialValue={initialValues.addressTwo}
                    onChangeText={handleChange('addressTwo')}
                    onBlurFunc={() => setFieldTouched('addressTwo')}
                    error={errors.addressTwo}
                    autoCapitalize="none"
                    isEditable={edit}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ width: '30%' }}>
                      <Input
                        placeholder="Peso"
                        onChangeText={handleChange('weight')}
                        onBlurFunc={() => setFieldTouched('weight')}
                        initialValue={initialValues.weight}
                        error={errors.weight}
                        editable={edit}
                        isEditable={edit}
                      />
                    </View>

                    <View style={{ width: '20%' }}>
                      <Input
                        placeholder="Altura"
                        onChangeText={handleChange('stature')}
                        onBlurFunc={() => setFieldTouched('stature')}
                        initialValue={initialValues.stature}
                        editable={edit}
                        error={errors.stature}
                        isEditable={edit}
                      />
                    </View>

                    <View style={{ width: '32%' }}>
                      <SmallText>Sexo:</SmallText>
                      <Picker
                        disabled={!edit}
                        data={[
                          {
                            label: 'Masculino',
                            value: 'M',
                          },
                          {
                            label: 'Feminino',
                            value: 'F',
                          },
                          {
                            label: 'Outro',
                            value: 'O',
                          },
                        ]}
                        value={gender}
                        onChangeValue={(e) => setGender(e)}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ width: '45%' }}>
                      {states &&
                        states?.getStates &&
                        states?.getStates.length > 0 && (
                          <>
                            <SmallText>Estado:</SmallText>
                            <Picker
                              disabled={!edit}
                              data={states?.getStates.map((state) => {
                                return { label: state.name, value: state.id };
                              })}
                              value={stateSelected}
                              onChangeValue={(e) => {
                                setStateSelected(e);
                              }}
                            />
                          </>
                        )}
                    </View>
                    <View style={{ width: '100%' }}>
                      {city && city?.getCity && city?.getCity.length > 0 && (
                        <>
                          <SmallText>Cidade:</SmallText>
                          <Picker
                            disabled={!edit}
                            data={city?.getCity.map((city) => {
                              return { label: city.name, value: city.id };
                            })}
                            value={citySelected}
                            onChangeValue={(e) => setCitySelected(e)}
                          />
                        </>
                      )}
                    </View>
                  </View>
                </View>
                {edit && (
                  <Button
                    name="Salvar"
                    onPress={() => handleSubmit()}
                    disabled={!isValid}
                  />
                )}
              </ScrollView>
            )}
          </Formik>
        </Container>
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    </>
  );
};

export default UserEditProfileInfo;
