/* eslint-disable @typescript-eslint/camelcase */
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {
  check,
  checkMultiple,
  PERMISSIONS,
  request,
} from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import Image from 'react-native-fast-image';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { PUBLIC_STORAGE, API } from '@env';
import styled from 'styled-components/native';
import * as Sentry from '@sentry/react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImageZoomPan from 'react-native-image-pan-zoom';
import FastImage from 'react-native-fast-image';
import {
  Query,
  QueryGetActiveUserChallengesArgs,
  Mutation,
  MutationUpdateProfilePersonalArgs,
  QueryGetProfileArgs,
} from '~/generated/graphql';
import { useGetProfileLazyQuery } from '~/graphql/autogenerate/hooks';
import {
  SafeAreaView as SafeView,
  TitleText,
  Text,
  Icons,
  ImageBackground,
  ImageZoom,
} from '~/components';

import { useUserToken } from '~/hooks';
import { useStoreActions, useStoreState } from '~/store';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { Container } from '~/components/ImageZoom';

export const SafeAreaView = styled(SafeView)`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
`;
export const UserName = styled(TitleText)`
  font-size: 32px;
`;
export const Description = styled(Text)``;
const Avatar = styled(FastImage)`
  border-radius: 500px;
  background-color: white;
  width: 108px;
  height: 108px;
  border-width: 4px;
  border-color: white;
`;
export const Content = styled.View`
  padding: 24px 16px 0 16px;
`;
export const Title = styled(TitleText)`
  font-size: 24px;
`;
export const Paragraph = styled(Text)``;
export const InfoTitle = styled(Text)`
  opacity: 0.56;
`;

export const Carrousel = styled.ScrollView`
  background-color: red;
  flex-direction: column;
`;
export const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const OptionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 9px 24px;
  border-bottom-width: 1px;
  border-color: #efefef;
  margin-top: 22px;
`;
export const HighlightsCardHorizontal = styled.View`
  margin-top: 24px;
  width: ${widthPercentageToDP('44')};
`;
export const HighlightImageHorizontal = styled(ImageBackground)`
  width: 100%;
  height: ${widthPercentageToDP('54')};
  border-radius: 16px;
  margin-bottom: 14px;
  align-items: center;
  justify-content: flex-end;
`;
export const SeeMoreBox = styled.View`
  background-color: white;
  padding: 4px 18px 0px 18px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;
export const HighlightBrandImageHorizontal = styled(ImageBackground)`
  width: 100%;
  height: 112px;
  border-radius: 16px;
  margin-bottom: 14px;
  align-items: flex-end;
  padding: 12px;
`;
export const RockyMountainHorizontal = styled(ImageBackground)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
`;
export const HighlightsCardTitle = styled(TitleText)`
  font-size: 14px;
  line-height: 20px;
  color: #161c25;
`;
export const Cover = styled(ImageBackground)`
  height: 200px;
  background-color: ${({ theme }) => theme.colors.gray};
`;
export const HeaderActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 16px;
`;
export const ActionButtonLeft = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-radius: 24px;
  padding: 11px 10px;
`;
export const ActionButtonRight = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  border-radius: 24px;
  padding: 10px 19px;
`;
export const ShowImage = styled(ImageBackground)`
  width: 100%;
  height: 200px;
`;
export const EditButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.blue};
  flex-direction: row;
  align-items: center;
  padding: 4px 16px;
  border-radius: 16px;
`;
export const EditButtonText = styled(Text)`
  color: ${({ theme }) => theme.colors.blue};
  margin-left: 5px;
`;

const UPDATE_PROFILE = gql`
  mutation updateProfilePersonal($data: UpdateProfilePersonalInput!) {
    updateProfilePersonal(data: $data) {
      id
    }
  }
`;
interface UpdateProfilePayload {
  updateProfilePersonal: Mutation['updateProfilePersonal'];
}

const GET_CHALLENGES = gql`
  query GetActiveUserChallenges(
    $pagination: PaginationInput!
    $profile_id: String!
  ) {
    getActiveUserChallenges(pagination: $pagination, profile_id: $profile_id) {
      id
      name
      challenge_type
      id
      creator_id
      image_avatar
      image_cover
      isFavorite
      creator {
        profile {
          profile_avatar
        }
      }
    }
  }
`;

interface GetActiveUserChallengesProps {
  getActiveUserChallenges: Query['getActiveUserChallenges'];
}

type ImageModeProps = 'avatar' | 'cover' | undefined;

const UserProfile: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [modalState, setModalState] = useState<boolean>(false);
  const [imageMode, setImageMode] = useState<ImageModeProps>();
  const userDataCompiled = useStoreState(
    (state) => state.userInfoCompiled.payload.goToPhotoPermission,
  );
  const changePermissionStore = useStoreActions(
    (actions) => actions.userInfoCompiled.changePermission,
  );
  const [cover, setCover] = useState('');
  const [avatar, setAvatar] = useState('');
  const panel = useRef<ActionSheet>();
  const navigation = useNavigation();
  const { profileID } = useUserToken();
  const [getProfile, { data, loading }] = useGetProfileLazyQuery({
    onError: (e) => {
      Sentry.captureException(e);
    },
  });

  const [fetchChallenges, { data: challenges }] = useLazyQuery<
    GetActiveUserChallengesProps,
    QueryGetActiveUserChallengesArgs
  >(GET_CHALLENGES, {
    onError: (e) => Sentry.captureException(e),
  });

  React.useEffect(() => {
    if (profileID.length > 0) {
      getProfile({
        variables: {
          data: {
            profile_id_requesting: profileID,
            profile_id_accessed: profileID,
          },
        },
      });

      fetchChallenges({
        variables: {
          profile_id: profileID,
          pagination: {
            offset: 30,
            page: 1,
          },
        },
      });
    }
  }, [profileID]);

  const [updateProfile] = useMutation<
    UpdateProfilePayload,
    MutationUpdateProfilePersonalArgs
  >(UPDATE_PROFILE, { onError: (e) => Sentry.captureException(e) });

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
  const openGalleryPicture = async (): Promise<void> => {
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
      width: imageMode === 'avatar' ? 1000 : 2000,
      height: imageMode === 'avatar' ? 1000 : 1000,
    }).then(async (selectedImage) => {
      if (selectedImage.size > 5000000) {
        Alert.alert('Error', 'As imagens devem ter no maximo 5mb.');
      } else {
        if (imageMode === 'cover') {
          setCover(selectedImage.path);
          const response = await handlePicture(selectedImage);
          const { data: payloadResponse } = await updateProfile({
            variables: {
              data: {
                profile_cover: response.path,
                firstname: data?.getProfile.user.firstname,
                lastname: data?.getProfile.user.lastname,
                username: data?.getProfile.username,
              },
            },
          });
        }
        if (imageMode === 'avatar') {
          setAvatar(selectedImage.path);
          const response = await handlePicture(selectedImage);
          const { data: payloadResponse } = await updateProfile({
            variables: {
              data: {
                profile_avatar: response.path,
                firstname: data?.getProfile.user.firstname,
                lastname: data?.getProfile.user.lastname,
                username: data?.getProfile.username,
              },
            },
          });
        }
      }
    });
  };
  const checkPermission = async () => {
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
        openGalleryPicture();
      }
    } else if (Platform.OS === 'ios') {
      const responseIOS = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (responseIOS === 'denied') {
        changePermissionStore(true);
        setTimeout(() => {
          navigation.navigate('Permission.Camera');
        }, 300);
      } else if (responseIOS === 'granted') {
        openGalleryPicture();
      }
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (userDataCompiled) {
        openGalleryPicture();
      }

      // openGalleryPicture();
      // await refetch();
    });

    return unsubscribe;
  }, [navigation, userDataCompiled]);

  if (loading || data === undefined) {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Cover>
          <HeaderActionsContainer>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ActionButtonLeft>
                <Icons name="arrow-left" />
              </ActionButtonLeft>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {}}
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            >
              <ActionButtonLeft>
                <Icons name="settings" color="#161C25" width={20} height={20} />
              </ActionButtonLeft>
            </TouchableOpacity>
          </HeaderActionsContainer>
        </Cover>

        <Content>
          <View style={{ alignItems: 'center', marginTop: -80 }}>
            <Avatar />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              marginTop: 50,
            }}
          >
            <ActivityIndicator size="large" color="#0564FF" />
          </View>
        </Content>
      </ScrollView>
    );
  }
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: 'white',
            paddingBottom: 40,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setImageMode('cover');
              setTimeout(() => {
                panel.current.show();
              }, 250);
            }}
          >
            <Cover
              progressiveRenderingEnabled
              source={{
                uri:
                  cover ||
                  `${PUBLIC_STORAGE}/${data?.getProfile.profile_cover}`,
              }}
            >
              <LinearGradient
                colors={[
                  'rgba(0, 0, 0, 1)',
                  'rgba(0, 0, 0, 0.5)',
                  'transparent',
                ]}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 45,
                  width: '100%',
                }}
              >
                <HeaderActionsContainer>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  >
                    <ActionButtonLeft>
                      <Icons name="arrow-left" />
                    </ActionButtonLeft>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (data && data.getProfile) {
                        navigation.navigate('User.EditProfileMain', {
                          ...data?.getProfile,
                        });
                      }
                    }}
                    hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  >
                    <ActionButtonLeft>
                      <Icons
                        name="settings"
                        color="#161C25"
                        width={20}
                        height={20}
                      />
                    </ActionButtonLeft>
                  </TouchableOpacity>
                </HeaderActionsContainer>
              </LinearGradient>
            </Cover>
          </TouchableOpacity>

          <Content>
            <View style={{ alignItems: 'center', marginTop: -80 }}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setImageMode('avatar');
                    setTimeout(() => {
                      panel.current.show();
                    }, 250);
                  }}
                >
                  <Avatar
                    source={{
                      uri:
                        avatar ||
                        `${PUBLIC_STORAGE}/${data?.getProfile.profile_avatar}`,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <UserName>
                {`${data?.getProfile.user.firstname} ${data?.getProfile.user.lastname}`}
              </UserName>
              <Description>{data.getProfile.description}</Description>
            </View>
          </Content>

          <Content
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <InfoTitle>Pedaladas</InfoTitle>
              <Text>{data.getProfile.user.activities_count}</Text>
            </View>
            <View>
              <InfoTitle>Seguidores</InfoTitle>
              <Text>{data.getProfile.followers_count}</Text>
            </View>
            <View>
              <InfoTitle>Seguindo</InfoTitle>
              <Text>{data.getProfile.following_count}</Text>
            </View>
          </Content>
          <Content
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EditButton
              onPress={() => {
                if (data && data.getProfile) {
                  navigation.navigate('User.EditProfileMain', {
                    ...data?.getProfile,
                  });
                }
              }}
            >
              <Icons name="pen" color="#0564FF" />
              <EditButtonText>Editar Perfil</EditButtonText>
            </EditButton>
          </Content>
          <Content>
            <Title>Minhas Inscrições Ativas</Title>
          </Content>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              paddingHorizontal: 16,
            }}
          >
            {challenges &&
              challenges.getActiveUserChallenges.length > 0 &&
              challenges.getActiveUserChallenges.map((challenge) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('Challenge.Description', {
                      challenge_id: challenge.id,
                    })}
                >
                  <HighlightsCardHorizontal>
                    <HighlightImageHorizontal
                      source={{
                        uri: `${PUBLIC_STORAGE}/${challenge.image_cover}`,
                      }}
                      imageStyle={{ borderRadius: 16 }}
                    >
                      <SeeMoreBox>
                        <InfoTitle>Ver mais</InfoTitle>
                      </SeeMoreBox>
                    </HighlightImageHorizontal>
                  </HighlightsCardHorizontal>
                </TouchableWithoutFeedback>
              ))}
          </View>
        </ScrollView>
      </View>
      <ActionSheet
        ref={panel}
        title="O que gostaria de fazer ?"
        options={['Ver Foto', 'Trocar na Galeria', 'Cancelar']}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            setModalState(true);
          } else if (index === 1) {
            checkPermission();
          }
        }}
      />
      <Modal
        isVisible={modalState}
        onBackdropPress={() => setModalState((prev) => !prev)}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <Container>
          <ImageZoomPan
            cropWidth={width}
            cropHeight={height}
            imageWidth={width}
            imageHeight={width}
            onClick={() => setModalState((prev) => !prev)}
          >
            <FastImage
              style={{
                width,
                height: width,
              }}
              source={{
                uri:
                  imageMode === 'avatar'
                    ? avatar ||
                      `${PUBLIC_STORAGE}/${data?.getProfile.profile_avatar}`
                    : cover ||
                      `${PUBLIC_STORAGE}/${data?.getProfile.profile_cover}`,
              }}
            />
          </ImageZoomPan>
        </Container>
      </Modal>
    </>
  );
};

export default UserProfile;
