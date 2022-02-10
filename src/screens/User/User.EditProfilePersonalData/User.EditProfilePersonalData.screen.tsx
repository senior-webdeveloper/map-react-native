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
import Image from 'react-native-fast-image';
import * as Yup from 'yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addHours, format } from 'date-fns';
import { RootStackParamList } from '~/routes.types';
import {
  Icons,
  NewProfileInput,
  Picker,
  SafeAreaView,
  SnackBar,
  Text,
} from '~/components';
import { useUserToken } from '~/hooks';

import {
  GetProfileDocument,
  useUpdateProfilePersonalMutation,
} from '~/graphql/autogenerate/hooks';
import { TypeSnackBar } from '~/components/Snackbar';
import { UpdateProfilePersonalInput } from '~/graphql/autogenerate/schemas';

export const Container = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;
const Avatar = styled(Image)`
  border-radius: 500px;
  background-color: white;
  width: 108px;
  height: 108px;
  border-width: 4px;
  border-color: white;
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
const UserEditProfilePersonalData: React.FC<Props> = ({ route }) => {
  Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
  };
  const [loadingRequest, setLoading] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
  const [gender, setGender] = useState<string>(route.params.user.gender ?? '');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birthDate, setBirthDate] = useState(route.params.user.date_of_birth);
  const { profileID } = useUserToken();
  const [updateProfilePersonalMutation] = useUpdateProfilePersonalMutation({
    onCompleted: () => {
      setSnackBarMessage('Perfil Atualizado com sucesso!');
      setTypeSnack('success');
      setShowSnackBar(true);
      setTimeout(() => {
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

  const navigation = useNavigation();

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
  const handleUpdateProfile = async (values): Promise<void> => {
    setLoading(true);
    let data: UpdateProfilePersonalInput = {};
    if (route.params.user) {
      data = {
        firstname: route.params.user.firstname,
        lastname: route.params.user.lastname,
        username: route.params.username,
        date_of_birth: new Date(birthDate),
        gender,
      };
    }
    if (values.stature.length > 0) {
      data = { ...data, stature: values.stature && Number(values.stature) };
    }
    if (values.weight.length > 0) {
      data = { ...data, weight: values.weight && Number(values.weight) };
    }
    await updateProfilePersonalMutation({
      variables: {
        data,
      },
    });
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setBirthDate(new Date(date).toISOString());
    hideDatePicker();
  };
  return (
    <Formik
      initialValues={{
        stature: String(route.params.user.stature ?? '') ?? '',
        weight: String(route.params.user.weight ?? '') ?? '',
      }}
      onSubmit={handleUpdateProfile}
      validateOnMount={false}
      validateOnChange
      validateOnBlur
      isInitialValid
    >
      {({
        handleChange,
        initialValues,
        setFieldTouched,
        handleSubmit,
        isValid,
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
            {/* <NewProfileInputMasked */}
            {/*  label="Data de aniversário" */}
            {/*  placeholder="Digite seu aniversário" */}
            {/*  initialValue={initialValues.zip_code} */}
            {/*  onChangeText={handleChange('zip_code')} */}
            {/*  onBlurFunc={() => setFieldTouched('zip_code')} */}
            {/*  type="datetime" */}
            {/*  options={{ */}
            {/*    format: 'DD/MM/yyyy', */}
            {/*  }} */}
            {/* /> */}
            <TouchableOpacity onPress={() => showDatePicker()}>
              <OptionContainer>
                <OptionTitle>Data de aniversário:</OptionTitle>
                <OptionDescription>
                  {format(addHours(new Date(birthDate), 3), 'dd/MM/yyyy')}
                </OptionDescription>
              </OptionContainer>
            </TouchableOpacity>

            <OptionContainer>
              <OptionTitle>Gênero:</OptionTitle>
              <Picker
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
            </OptionContainer>

            <NewProfileInput
              keyboardType="number-pad"
              label="Altura (cm)"
              placeholder="eg: 153cm"
              initialValue={initialValues.stature}
              onChangeText={handleChange('stature')}
              onBlurFunc={() => setFieldTouched('stature')}
            />

            <NewProfileInput
              keyboardType="numeric"
              label="Peso (kg)"
              placeholder="e.g: 75kg"
              initialValue={initialValues.weight}
              onChangeText={handleChange('weight')}
              onBlurFunc={() => setFieldTouched('weight')}
            />
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
              disabled={loadingRequest || !gender}
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
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            date={addHours(new Date(birthDate), 3)}
            headerTextIOS="Selecione a data"
            confirmTextIOS="Confirmar"
            cancelTextIOS="Cancelar"
            locale="pt_BR"
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default UserEditProfilePersonalData;
