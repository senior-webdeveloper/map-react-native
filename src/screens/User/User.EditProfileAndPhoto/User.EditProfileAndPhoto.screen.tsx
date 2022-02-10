import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StatusBar,
  Linking,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { PUBLIC_STORAGE, API } from '@env';
import { Formik } from 'formik';
import Image from 'react-native-fast-image';
import axios from 'axios';
import * as Sentry from '@sentry/react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS } from 'react-native-permissions';
import ActionSheet from 'react-native-actionsheet';
import * as Yup from 'yup';
import { RootStackParamList } from '~/routes';
import {
  Button,
  Icons,
  ImageBackground,
  NewProfileInput,
  NewProfileInputMasked,
  SafeAreaView,
  SnackBar,
  Text,
} from '~/components';
import { useStoreActions, useStoreState } from '~/store';
import { useUserToken } from '~/hooks';

import {
  GetProfileDocument,
  useGetProfileLazyQuery,
  useUpdateProfilePersonalMutation,
} from '~/graphql/autogenerate/hooks';
import {
  MutationUpdateProfilePersonalArgs,
  QueryGetActiveUserChallengesArgs,
} from '~/generated/graphql';
import { TypeSnackBar } from '~/components/Snackbar';
import validateCpf from '~/helpers/validateCpf';

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
  margin-bottom: -40px;
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0px;
  border-bottom-width: 1px;
  border-bottom-color: #efefef;
`;
export const Cover = styled(ImageBackground)`
  height: 200px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray};
  align-items: center;
  justify-content: flex-end;
`;
export const Content = styled.ScrollView`
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
type ImageModeProps = 'avatar' | 'cover' | undefined;
const UserEditProfileAndPhoto: React.FC<Props> = ({ route }) => {
  console.log(
    '🚀 ~ file: User.EditProfileAndPhoto.screen.tsx ~ line 187 ~ route',
    route,
  );
  const { log } = console;
  const [loadingRequest, setLoading] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
  const [imageMode, setImageMode] = useState<ImageModeProps>();
  const { profileID } = useUserToken();
  const [updateProfilePersonalMutation, { client }] =
    useUpdateProfilePersonalMutation({
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
    });

  const userDataCompiled = useStoreState(
    (state) => state.userInfoCompiled.payload.goToPhotoPermission,
  );
  const changePermissionStore = useStoreActions(
    (actions) => actions.userInfoCompiled.changePermission,
  );
  const [avatar, setAvatar] = useState(
    `${PUBLIC_STORAGE}/${route.params.profile_avatar}`,
  );
  const [cover, setCover] = useState(
    `${PUBLIC_STORAGE}/${route.params.profile_cover}`,
  );
  const [originalAvatar, setOriginalAvatar] = useState(
    route.params.profile_avatar,
  );
  const [originalCover, setOriginalCover] = useState(
    route.params.profile_cover,
  );
  const navigation = useNavigation();

  const handlePicture = async (pic) => {
    try {
      const formData = new FormData();
      const fileName = pic.path.split('/').pop();
      const format = fileName.split('.')[1];

      const source = {
        uri: pic.path,
        type: pic.mime,
        name: `picture.${format}`,
        // filename: fileName,
      };
      formData.append('file', source);
      try {
        const { data: payload } = await axios.patch(
          `${API}/upload/file/temporary`,
          formData,
        );
        return payload;
      } catch (error) {
        Sentry.captureException(error);
      }
    } catch (e) {
      Sentry.captureException(e);
    }
  };
  const openGalleryPicture = async (type: ImageModeProps): Promise<void> => {
    changePermissionStore(false);
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
      compressImageMaxWidth: 2048,
      compressImageMaxHeight: 2048,
      compressImageQuality: 0.8,
      smartAlbums: [
        'PhotoStream',
        'Generic',
        'Panoramas',
        'Favorites',
        'Timelapses',
        'AllHidden',
        'RecentlyAdded',
        'Bursts',
        'UserLibrary',
        'SelfPortraits',
        'Screenshots',
        'DepthEffect',
        'LivePhotos',
        'Animated',
        'LongExposure',
      ],
      loadingLabelText: 'Carregando foto...',
      includeExif: false,
      cropping: true,
      width: type === 'avatar' ? 1000 : 2000,
      height: type === 'avatar' ? 1000 : 1000,
    }).then(async (selectedImage) => {
      if (selectedImage.size > 5000000) {
        Alert.alert('Error', 'As imagens devem ter no maximo 5mb.');
      } else {
        if (type === 'cover') {
          setCover(selectedImage.path);
          const response = await handlePicture(selectedImage);
          setOriginalCover(response.path);
        }
        if (type === 'avatar') {
          setAvatar(selectedImage.path);
          const response = await handlePicture(selectedImage);
          setOriginalAvatar(response.path);
        }
      }
    });
  };
  const checkPermission = async (type: ImageModeProps) => {
    setLoading(true);
    if (Platform.OS === 'android') {
      const responseAndroid = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (responseAndroid === 'denied') {
        changePermissionStore(true);
        setTimeout(() => {
          navigation.navigate('Permission.Camera');
        }, 300);
      } else if (responseAndroid === 'granted') {
        await openGalleryPicture(type);
      }
      setLoading(false);
    } else if (Platform.OS === 'ios') {
      const responseIOS = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (responseIOS === 'denied') {
        changePermissionStore(true);
        setTimeout(() => {
          navigation.navigate('Permission.Camera');
        }, 300);
      } else if (responseIOS === 'granted') {
        await openGalleryPicture(type);
      }
      setLoading(false);
    }
  };
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
    legal_registry_number: Yup.string()
      .test('cpf valido', 'cpf invalido', (value) =>
        validateCpf(value?.replace(/[.-]/g, '')),
      )
      .required('* obrigatório'),
  });
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (userDataCompiled) {
        await openGalleryPicture(imageMode);
      }

      // openGalleryPicture();
      // await refetch();
    });

    return unsubscribe;
  }, [navigation, userDataCompiled]);

  const handleUpdateProfile = async (values): Promise<void> => {
    setLoading(true);
    log('Chamou aqui ein, taok?');
    const { data: response } = await updateProfilePersonalMutation({
      variables: {
        data: {
          description: values.description.trim(),
          firstname: values.firstname.trim(),
          lastname: values.lastname.trim(),
          username: values.username.trim(),
          team_name: values.team_name ? values.team_name.trim() : '',
          profile_avatar: originalAvatar,
          profile_cover: originalCover,
          legal_registry_number: values.legal_registry_number?.replace(
            /[.-]/g,
            '',
          ),
        },
      },

      // TODO: abrir issue no Apollo client.
      // awaitRefetchQueries: false,
      // refetchQueries: [
      //   {
      //     query: GetProfileDocument,
      //     variables: {
      //       data: {
      //         profile_id_requesting: profileID,
      //         profile_id_accessed: profileID,
      //       },
      //     },
      //   },
      // ],
    });
    client.query({
      query: GetProfileDocument,
      variables: {
        data: {
          profile_id_requesting: profileID,
          profile_id_accessed: profileID,
        },
      },
    });
  };

  return (
    <Formik
      initialValues={{
        firstname: route.params?.user?.firstname
          ? route.params.user.firstname
          : '',
        lastname: route.params.user.lastname ? route.params.user.lastname : '',
        username: route.params.username ? route.params.username : '',
        description: route.params.description ? route.params.description : '',
        legal_registry_number: route.params.user?.legal_registry_number
          ? route.params.user?.legal_registry_number
          : '',
        team_name: route.params.user.team_name
          ? route.params.user.team_name
          : '',
      }}
      validationSchema={schema}
      onSubmit={handleUpdateProfile}
      isInitialValid={!!route.params.user.legal_registry_number}
      validateOnMount={false}
    >
      {({
        handleChange,
        initialValues,
        setFieldTouched,
        handleSubmit,
        isValid,
        errors,
        values,
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
            <View style={{ alignItems: 'center' }}>
              <Cover
                progressiveRenderingEnabled
                source={{
                  uri: cover,
                }}
              >
                <Avatar
                  source={{
                    uri: avatar,
                  }}
                />
              </Cover>
              <ChangePhotoContainer
                onPress={() => {
                  setImageMode('avatar');
                  checkPermission('avatar');
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#0564ff',
                  marginTop: 45,
                }}
              >
                <Icons name="camera-outline" color="#0564FF" />
                <ChangePhotoText>Trocar foto de perfil</ChangePhotoText>
              </ChangePhotoContainer>

              <ChangePhotoContainer
                onPress={() => {
                  setImageMode('cover');
                  checkPermission('cover');
                }}
              >
                <Icons name="picture-outline" color="#0564FF" />
                <ChangePhotoText>Trocar imagem de capa</ChangePhotoText>
              </ChangePhotoContainer>
            </View>
            <NewProfileInput
              label="Nome"
              placeholder="Digite seu nome"
              initialValue={initialValues.firstname}
              onChangeText={handleChange('firstname')}
              onBlurFunc={() => setFieldTouched('firstname')}
            />

            <NewProfileInput
              label="Sobrenome"
              placeholder="Digite seu sobrenome"
              initialValue={initialValues.lastname}
              onChangeText={handleChange('lastname')}
              onBlurFunc={() => setFieldTouched('lastname')}
            />

            <NewProfileInputMasked
              type="cpf"
              label="CPF"
              placeholder="digite seu CPF"
              error={
                errors.legal_registry_number || !values.legal_registry_number
                  ? '*obrigatorio'
                  : null
              }
              initialValue={initialValues.legal_registry_number}
              onChangeText={handleChange('legal_registry_number')}
              onBlurFunc={() => setFieldTouched('legal_registry_number')}
            />

            <NewProfileInput
              label="Nome de Equipe"
              placeholder="Digite o nome da sua equipe "
              initialValue={initialValues.team_name}
              onChangeText={handleChange('team_name')}
              onBlurFunc={() => setFieldTouched('team_name')}
            />

            <NewProfileInput
              label="Nome de usuário"
              placeholder="Digite seu nome de usuário"
              initialValue={initialValues.username}
              onChangeText={handleChange('username')}
              onBlurFunc={() => setFieldTouched('username')}
            />

            <NewProfileInput
              label="Biografia"
              placeholder="Conte-nos um pouco sobre você"
              initialValue={initialValues.description}
              isMultiline
              onChangeText={handleChange('description')}
              onBlurFunc={() => setFieldTouched('description')}
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
              disabled={loadingRequest || !isValid}
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

export default UserEditProfileAndPhoto;
