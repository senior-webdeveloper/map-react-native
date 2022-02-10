import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { Picker } from '@react-native-community/picker';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import Modal from 'react-native-modal';
import {
  ScrollView,
  SafeAreaView,
  Text,
  View,
  StatusBar,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { PUBLIC_STORAGE, API } from '@env';
import * as Yup from 'yup';
import * as Sentry from '@sentry/react-native';
import Input from '~/components/Input';
import MaskedInput from '~/components/MaskedInput';
import {
  Company,
  Mutation,
  MutationUpdateProfileCompanyArgs,
  MutationUpdateProfilePersonalArgs,
  Query,
  QueryGetProfileArgs,
  QueryGetUserChallengeActivitiesArgs,
  UpdateProfileCompanyInput,
} from '~/generated/graphql';
import colors from '~/styles/colors';
import {
  ConfirmButtonContainer,
  ConfirmButtonText,
  GoBackButtonContainer,
  GoBackButtonText,
  ModalContainer,
  ModalDescriptionText,
} from './styles';
import { Avatar } from '../../Challenge/ChallengeCreation/ChallengeFinalization/styles';

const PROFILE = gql`
  query getProfile($data: GetProfileDetailInput!) {
    getProfile(data: $data) {
      id
      username
      profile_avatar
      profile_cover
      description
    }
  }
`;

interface GetProfilePayload {
  getProfile: Query['getProfile'];
}

const UPDATE_PROFILE = gql`
  mutation updateProfileCompany($data: UpdateProfileCompanyInput!) {
    updateProfileCompany(data: $data) {
      id
    }
  }
`;
interface UpdateProfilePayload {
  updateProfileCompany: Mutation['updateProfileCompany'];
}

const EditProfile: React.FC = ({ route }) => {
  const navigation = useNavigation();
  const [company, setCompany] = React.useState<Company>(route.params.company);
  const [cover, setCover] = React.useState();
  const [avatar, setAvatar] = React.useState();
  const [coverURL, setCoverURL] = React.useState();
  const [avatarURL, setAvatarURL] = React.useState();
  const [updateProfile] = useMutation<
    UpdateProfilePayload,
    MutationUpdateProfileCompanyArgs
  >(UPDATE_PROFILE);
  const { data, loading, refetch } = useQuery<
    GetProfilePayload,
    QueryGetProfileArgs
  >(PROFILE, {
    variables: {
      data: {
        profile_id_requesting: route.params.id,
        profile_id_accessed: route.params.id,
      },
    },
  });

  React.useEffect(() => {
    if (data?.getProfile.profile_avatar) {
      setAvatar(`${PUBLIC_STORAGE}/${data.getProfile.profile_avatar}`);
    }
    if (data?.getProfile.profile_cover) {
      setCover(`${PUBLIC_STORAGE}/${data.getProfile.profile_cover}`);
    }
  }, [data]);

  const handlePicture = async (pic) => {
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
      const { data } = await axios.patch(
        `${API}/upload/file/temporary`,
        formData,
      );
      return data;
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const formData = new FormData();
  const openGalleryPicture = (option: 'cover' | 'avatar'): Promise<void> =>
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
      compressImageMaxWidth: 2048,
      compressImageMaxHeight: 2048,
      compressImageQuality: 0.8,
      includeExif: true,
    }).then(async (selectedImage) => {
      if (selectedImage.size > 5000000) {
        Alert.alert('Error', 'As imagens devem ter no maximo 5mb.');
      } else {
        if (option === 'cover') {
          setCover(selectedImage.path);
          const response = await handlePicture(selectedImage);
          setCoverURL(response.path);
        }
        if (option === 'avatar') {
          setAvatar(selectedImage.path);
          const response = await handlePicture(selectedImage);
          setAvatarURL(response.path);
        }
      }
    });

  const schema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[A-Za-z0-9_-]*$/, 'Nao deve contar caracteres especiais')
      .required('Você deve informar um Nome de usuario!'),
    fantasy_name: Yup.string().required('Você deve informar um Nome Fantasia!'),
    business_name: Yup.string().required('Você deve informar a Razao social!'),
    site: Yup.string()
      .url('deve ser uma url valida eg: http://www.gogle.com')
      .required('Voce deve informar uma url'),
    register_number: Yup.string()
      .min(18, 'CNPJ devem ter pelo menos 14 digitos.')
      .required('Voce precisa informar um cnpj!'),
    address_one: Yup.string().required('Você deve informar um Endereco!'),
    address_two: Yup.string().required('Você deve informar um Complemento!'),
  });

  const handleSaveProfile = async (values: UpdateProfileCompanyInput) => {
    // const { data: response } = await updateProfile({
    //   variables: {
    //     data: {
    //       profile_avatar: avatarURL || company.profile.profile_avatar,
    //       profile_cover: coverURL || company.profile.profile_cover,
    //       description: values.description,
    //       company_id: company.id,
    //       fantasy_name: values.fantasy_name,
    //       business_name: values.business_name,
    //       site: values.site,
    //       username: values.username,
    //       register_number: String(values.register_number),
    //       address_one: values.address_one,
    //       address_two: values.address_two,
    //     },
    //   },
    // });
    // if (response?.updateProfileCompany) {
    //   Alert.alert('Sucesso!', 'Perfil Atualizado com Sucesso!');
    // }
  };
  const handleDate = (date: string) => {
    if (date) {
      const initDate = date.split('-');
      const finishedDate = initDate[2].split('T');
      return `${finishedDate[0]}${initDate[1]}${initDate[0]}`;
    }
  };
  return (
    <>
      <Modal isVisible={loading} onBackdropPress={() => {}}>
        <ModalContainer
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <ModalDescriptionText>
            Estamos carregando seus dados....
          </ModalDescriptionText>
          <ActivityIndicator size="large" />
        </ModalContainer>
      </Modal>

      <SafeAreaView
        style={{ flex: 1, marginTop: 40 }}
        testID="challenges-view"
        accessibilityLabel="challenges-view"
      >
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <GoBackButtonContainer onPress={() => navigation.goBack()}>
          <EntypoIcons
            name="chevron-small-left"
            color={colors.darkGrey}
            size={20}
          />
          <GoBackButtonText>voltar</GoBackButtonText>
        </GoBackButtonContainer>
        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontFamily: 'Montserrat-Black', fontSize: 28 }}>
            Editar Perfil Comercial
          </Text>
        </View>
        {!loading && (
          <Formik
            validationSchema={schema}
            initialValues={{
              fantasy_name: company.fantasy_name,
              username: data?.getProfile.username,
              business_name: company.business_name,
              register_number: String(company.register_number),
              site: company.site,
              description: data?.getProfile.description,
              address_one: company.address_one,
              address_two: company.address_two,
            }}
            onSubmit={handleSaveProfile}
          >
            {({ values, handleChange, errors, handleSubmit }) => (
              <ScrollView style={{ paddingHorizontal: 10, marginBottom: 30 }}>
                <View
                  style={{
                    marginTop: 10,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={() => openGalleryPicture('cover')}
                  >
                    <Image
                      source={{
                        uri:
                          cover ||
                          `${PUBLIC_STORAGE}/logos/Quadrada-branca-roxa.png`,
                      }}
                      style={{
                        width: '100%',
                        height: 150,
                        borderRadius: 8,
                        marginBottom: '-20%',
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => openGalleryPicture('avatar')}
                  >
                    <Image
                      source={{
                        uri:
                          avatar ||
                          `${PUBLIC_STORAGE}/logos/Quadrada-branca-roxa.png`,
                      }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: colors.white,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      textAlign: 'left',
                      marginBottom: 5,
                    }}
                  >
                    *Nome de usuário:
                  </Text>
                  <Input
                    placeholder="Digite seu Nome"
                    onChangeText={handleChange(`username`)}
                    accessibilityLabel="username-input"
                    testID="username-input"
                    value={values.username}
                    accessible
                    error={errors.username}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      textAlign: 'left',
                      marginBottom: 5,
                    }}
                  >
                    *Nome Fantasia:
                  </Text>
                  <Input
                    placeholder="Digite o Nome Fantasia"
                    onChangeText={handleChange(`fantasy_name`)}
                    accessibilityLabel="fantasyname-input"
                    testID="fantasyname-input"
                    value={values.fantasy_name}
                    accessible
                    error={errors.fantasy_name}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      textAlign: 'left',
                      marginBottom: 5,
                    }}
                  >
                    *Razão social:
                  </Text>
                  <Input
                    placeholder="Digite a Razão social"
                    onChangeText={handleChange(`business_name`)}
                    accessibilityLabel="businessname-input"
                    testID="businessname-input"
                    accessible
                    value={values.business_name}
                    error={errors.business_name}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      textAlign: 'left',
                      marginBottom: 5,
                    }}
                  >
                    *CNPJ:
                  </Text>
                  <MaskedInput
                    placeholder="Digite o CNPJ"
                    type="cnpj"
                    keyboardType="number-pad"
                    includeRawValueInChangeText
                    onChangeText={handleChange(`register_number`)}
                    accessibilityLabel="registernumber-input"
                    testID="registernumber-input"
                    accessible
                    value={values.register_number}
                    error={errors.register_number}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      textAlign: 'left',
                      marginBottom: 5,
                    }}
                  >
                    Sobre a {values.fantasy_name}:
                  </Text>
                  <Input
                    placeholder="Conte um pouco sobre sua empresa aqui."
                    onChangeText={handleChange(`description`)}
                    accessibilityLabel="description-input"
                    multiline
                    style={{ height: 100 }}
                    testID="description-input"
                    accessible
                    value={values.description}
                    error={errors.description}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      textAlign: 'left',
                      marginBottom: 5,
                    }}
                  >
                    *Site:
                  </Text>
                  <Input
                    placeholder="Digite seu Site"
                    onChangeText={handleChange(`site`)}
                    accessibilityLabel="site-input"
                    keyboardType="url"
                    testID="site-input"
                    value={values.site}
                    accessible
                    error={errors.site}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      textAlign: 'left',
                      marginBottom: 5,
                    }}
                  >
                    *Endereço 1:
                  </Text>
                  <Input
                    placeholder="Digite seu Endereco"
                    onChangeText={handleChange(`address_one`)}
                    accessibilityLabel="addressone-input"
                    testID="addressone-input"
                    value={values.address_one}
                    accessible
                    error={errors.address_one}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      textAlign: 'left',
                      marginBottom: 5,
                    }}
                  >
                    *Complemento:
                  </Text>
                  <Input
                    placeholder="Digite seu Nome"
                    onChangeText={handleChange(`address_two`)}
                    accessibilityLabel="addresstwo-input"
                    testID="addresstwo-input"
                    value={values.address_two}
                    accessible
                    error={errors.address_two}
                  />
                </View>
                <ConfirmButtonContainer
                  onPress={() => handleSubmit()}
                  accessibilityLabel="done-challenge-finalization-button"
                  testID="done-challenge-finalization-button"
                  accessible
                >
                  <ConfirmButtonText>Salvar!</ConfirmButtonText>
                </ConfirmButtonContainer>
              </ScrollView>
            )}
          </Formik>
        )}
      </SafeAreaView>
    </>
  );
};

export default EditProfile;
