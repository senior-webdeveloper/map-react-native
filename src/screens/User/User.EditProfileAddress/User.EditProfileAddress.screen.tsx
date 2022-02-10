import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import * as Sentry from '@sentry/react-native';
import { RootStackParamList } from '~/routes.types';
import {
  Icons,
  NewProfileInput,
  NewProfileInputMasked,
  Picker,
  SafeAreaView,
  SnackBar,
  Text,
} from '~/components';
import { useUserToken } from '~/hooks';

import {
  GetProfileDocument,
  useGetAllStatesQuery,
  useGetCityQuery,
  useUpdateProfilePersonalMutation,
} from '~/graphql/autogenerate/hooks';
import { TypeSnackBar } from '~/components/Snackbar';
import { useStoreActions, useStoreState } from '~/store';

export const Container = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px 0 24px;
`;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
`;

export const TitleOthers = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 24px;
`;
export const HighlightsCard = styled.View`
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 16px;
`;

export const HighlightsCardTitle = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  margin-right: 9px;
  font-size: 16px;
  line-height: 20px;
  color: #161c25;
`;

export const CardOverlay = styled.View`
  width: 100%;
  background: #161c25;
  opacity: 0.9;
  padding: 10px;
  align-items: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;
export const ChallengeInfo = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;
export const InfoContainer = styled.View``;
export const AvatarContainer = styled.View`
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 64px;
  height: 64px;
  border: 0.5px solid #303030;
`;
export const InfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
export const OptionContainer = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 0px;
  border-bottom-width: 1px;
  border-bottom-color: #efefef;
`;

export const Content = styled(ScrollView)`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  padding-bottom: 40px;
`;

export const OptionTitle = styled(Text)`
  font-size: 20px;
`;

export const OptionDescription = styled(Text)`
  opacity: 0.56;
`;
export const ChangePhotoContainer = styled.TouchableOpacity`
  padding: 2px 16px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;
export const ChangePhotoText = styled(Text)`
  color: ${({ theme }) => theme.colors.blue};
  margin-left: 8px;
`;
interface ContainerProps {
  disabled?: boolean;
  loading?: boolean;
}
export const ButtonContainer = styled.TouchableOpacity<ContainerProps>`
  background: ${({ theme, disabled }) =>
    !disabled ? theme.colors.blue : theme.colors.gray};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 12px 32px;
  border-radius: 24px;
  margin-top: 32px;
`;
export const ButtonText = styled(Text)`
  color: ${({ theme }) => theme.colors.textWhite};
  margin-left: 10px;
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'User.EditProfileAndPhoto'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};
const UserEditProfileAddress: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const setUserProfile = useStoreActions(
    (actions) => actions.profile.saveUserInfo,
  );
  const [loadingRequest, setLoading] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const { profileID } = useUserToken();
  const [loadingCEP, setLoadingCEP] = useState<boolean>(false);
  const userProfile = useStoreState((state) => state.profile.payload);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
  const [searchedUF, setSearchedUF] = React.useState<string>('');
  const [searchedCity, setSearchedCity] = React.useState<string>('');
  const [stateSelected, setStateSelected] = useState<string>(
    route.params?.user?.city?.state.id
      ? route.params?.user?.city?.state.id
      : '',
  );
  const [citySelected, setCitySelected] = useState<string>(
    route.params?.user.city?.id ? route.params?.user.city?.id : '',
  );
  const { data: states } = useGetAllStatesQuery({
    variables: {
      pagination: {
        offset: 27,
        page: 1,
      },
    },
  });
  const { data: city } = useGetCityQuery({
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
  const [updateProfilePersonalMutation] = useUpdateProfilePersonalMutation({
    onCompleted: (e) => {
      setSnackBarMessage('Perfil Atualizado com sucesso!');
      setTypeSnack('success');
      setShowSnackBar(true);
      setTimeout(() => {
        navigation.goBack();
        setShowSnackBar(false);
        setLoading(false);
      }, 1000);
    },
    onError: (e) => {
      setSnackBarMessage(e.message);
      setTypeSnack('error');
      setShowSnackBar(true);
      setTimeout(() => {
        setShowSnackBar(false);
        setLoading(false);
      }, 1000);
    },
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GetProfileDocument,
        variables: {
          data: {
            profile_id_requesting: profileID,
            profile_id_accessed: profileID,
          },
        },
      },
    ],
  });

  const schema = Yup.object().shape({
    number: Yup.string()
      .min(1, '* Campo obrigatório')
      .required('* Campo obrigatório'),
    zip_code: Yup.string()
      .min(8, '* Campo obrigatório')
      .required('* Campo obrigatório'),
    street: Yup.string().required('* Campo obrigatório'),
  });
  const handleUpdateProfile = async (values): Promise<void> => {
    setLoading(true);
    const currentCity = city?.getCity.filter((cit) => cit.id === citySelected);
    const currentState = states?.getStates.filter(
      (state) => state.id === stateSelected,
    );
    setUserProfile({
      getProfile: {
        ...userProfile?.getProfile,
        user: {
          ...userProfile?.getProfile.user,
          zip_code: values.zip_code && values.zip_code.replace(/[.-]/g, ''),
          address_line_two: `${values.neighborhood.trim()}, ${values.addon.trim()}`,
          address_line_one: values.street.trim(),
          city_id: citySelected.length > 0 ? citySelected : null,
          street_number: values.number,
          city: {
            name: currentCity[0].name,
            state: {
              abbreviation: currentState[0].abbreviation,
            },
          },
        },
      },
    });

    await updateProfilePersonalMutation({
      variables: {
        data: {
          firstname: route.params.user.firstname,
          lastname: route.params.user.lastname,
          username: route.params.username,
          zip_code: values.zip_code && values.zip_code.replace(/[.-]/g, ''),
          address_line_two: `${values.neighborhood.trim()}, ${values.addon.trim()}`,
          address_line_one: values.street.trim(),
          city_id: citySelected.length > 0 ? citySelected : null,
          street_number: values.number,
        },
      },
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GetProfileDocument,
          variables: {
            data: {
              profile_id_requesting: profileID,
              profile_id_accessed: profileID,
            },
          },
        },
      ],
    });
  };

  const splitedAdressLineOne = route?.params?.user?.address_line_one
    ? route?.params?.user?.address_line_one?.split(',')
    : undefined;
  const splitedAdressLineTwo = route?.params?.user?.address_line_two
    ? route?.params?.user?.address_line_two?.split(',')
    : undefined;

  async function searchCEP(cep, setFieldValue): Promise<void> {
    try {
      setLoadingCEP(true);
      if (cep) {
        const { data } = await axios.get(
          `https://viacep.com.br/ws/${cep}/json`,
        );

        if (data) {
          setSearchedUF(data.logradouro.toLowerCase());
          setSearchedCity(data.localidade);

          if (data.logradouro) {
            if (setFieldValue) {
              setFieldValue('street', data.logradouro, false);
            }
          }

          if (data.bairro) {
            if (setFieldValue) {
              setFieldValue('neighborhood', data.bairro, false);
            }
          }

          if (states && states.getStates) {
            const filteredState = states?.getStates.filter(
              (state) => state.abbreviation.toUpperCase() === data.uf,
            );

            if (filteredState && filteredState.length > 0) {
              if (filteredState[0].id) {
                setStateSelected(filteredState[0].id);

                if (city && city.getCity) {
                  const filteredCity = city?.getCity.filter(
                    (cit) => cit.name === data.localidade,
                  );
                  if (filteredCity && filteredCity.length > 0) {
                    if (filteredCity[0].id) {
                      setCitySelected(filteredCity[0].id);
                    }
                    setLoadingCEP(false);
                  }
                }
              }
            }
          }
        } else {
          setLoadingCEP(false);
        }
      }
      setLoadingCEP(false);
    } catch (e) {
      Sentry.captureException(e);
    }
  }
  React.useEffect(() => {
    const filteredCity = city?.getCity.filter(
      (cit) => cit.name === searchedCity,
    );
    if (filteredCity && filteredCity.length > 0) {
      setCitySelected(filteredCity[0].id);
    }
    setLoadingCEP(false);
  }, [searchedUF, searchedCity, city]);
  return (
    <Formik
      initialValues={{
        zip_code: String(route.params.user.zip_code ?? '') ?? '',
        lastname: route.params.user.lastname ?? '',
        username: route.params.username ?? '',
        description: route.params.description ?? '',
        street:
          splitedAdressLineOne && splitedAdressLineOne.length > 0
            ? splitedAdressLineOne[0]
            : '',
        number: route.params.user.street_number
          ? route.params.user.street_number
          : '',
        addon:
          splitedAdressLineTwo && splitedAdressLineTwo.length > 1
            ? splitedAdressLineTwo[1]
            : '',
        neighborhood:
          splitedAdressLineTwo && splitedAdressLineTwo.length > 0
            ? splitedAdressLineTwo[0]
            : '',
      }}
      onSubmit={handleUpdateProfile}
      validateOnMount={false}
      initialErrors={{
        number: '',
      }}
      validateOnBlur
      validateOnChange
      validationSchema={schema}
    >
      {({
        handleChange,
        initialValues,
        setFieldTouched,
        handleSubmit,
        values,
        setFieldValue,
        isValid,
        errors,
      }) => (
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />
          <Header>
            <TouchableOpacity
              onPress={async () => {
                navigation.goBack();
              }}
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            >
              <Icons name="arrow-left" />
            </TouchableOpacity>
            <Title>Editar Perfil</Title>
            <View style={{ width: 20 }} />
          </Header>
          <Content>
            <View>
              <NewProfileInputMasked
                label="CEP"
                placeholder="Digite seu cep"
                initialValue={initialValues.zip_code}
                onChangeText={handleChange('zip_code')}
                onBlurFunc={() => setFieldTouched('zip_code')}
                type="zip-code"
                error={errors.zip_code}
              />
              {loadingCEP && (
                <ActivityIndicator
                  size="small"
                  color="#0564ff"
                  style={{
                    position: 'absolute',
                    right: 100,
                    top: 50,
                  }}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  if (values.zip_code && setFieldValue) {
                    Sentry.captureMessage(values.zip_code);
                    searchCEP(values.zip_code, setFieldValue);
                  }
                }}
                style={{ position: 'absolute', right: 10, top: 50 }}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                disabled={values.zip_code.length < 8}
              >
                <Text
                  style={{
                    color: '#0564ff',
                    opacity: values.zip_code.length < 8 ? 0.56 : 1,
                  }}
                >
                  Buscar e Preencher
                </Text>
              </TouchableOpacity>
            </View>

            <NewProfileInput
              label="Rua"
              placeholder="Digite aqui sua rua"
              initialValue={initialValues.street}
              onChangeText={handleChange('street')}
              onBlurFunc={() => setFieldTouched('street')}
              value={values.street}
            />
            <NewProfileInput
              label="Número"
              placeholder="Digite aqui o numero"
              keyboardType="number-pad"
              initialValue={initialValues.number}
              onChangeText={handleChange('number')}
              onBlurFunc={() => setFieldTouched('number')}
              error={errors.number}
            />

            <NewProfileInput
              label="Complemento"
              placeholder="Digite aqui o complemento"
              initialValue={initialValues.addon}
              onChangeText={handleChange('addon')}
              onBlurFunc={() => setFieldTouched('addon')}
            />
            <NewProfileInput
              label="Bairro"
              placeholder="Digite aqui o bairro"
              initialValue={initialValues.neighborhood}
              onChangeText={handleChange('neighborhood')}
              onBlurFunc={() => setFieldTouched('neighborhood')}
              value={values.neighborhood}
            />
            {states && states?.getStates && states?.getStates.length > 0 && (
              <OptionContainer>
                <OptionTitle>Estado:</OptionTitle>
                <Picker
                  data={states?.getStates.map((state) => {
                    return { label: state.name, value: state.id };
                  })}
                  value={stateSelected}
                  onChangeValue={(e) => {
                    setStateSelected(e);
                  }}
                />
              </OptionContainer>
            )}
            {city && city?.getCity && city?.getCity.length > 0 && (
              <OptionContainer>
                <OptionTitle>Cidade:</OptionTitle>
                <Picker
                  data={city?.getCity.map((city) => {
                    return { label: city.name, value: city.id };
                  })}
                  value={citySelected}
                  onChangeValue={(e) => setCitySelected(e)}
                />
              </OptionContainer>
            )}
          </Content>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 15,
            }}
          >
            <ButtonContainer
              onPress={handleSubmit}
              disabled={
                loadingRequest || !citySelected || !stateSelected || !isValid
              }
            >
              {!loadingRequest && (
                <>
                  <Icons name="check" color="#FFF" />
                  <ButtonText>Salvar</ButtonText>
                </>
              )}
              {loadingRequest && (
                <ActivityIndicator size="large" color="#FFF" />
              )}
            </ButtonContainer>
          </View>
          <SnackBar
            show={showSnackBar}
            setShow={(e) => setShowSnackBar(e)}
            message={snackBarMessage}
            type={typeSnack}
          />
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default UserEditProfileAddress;
