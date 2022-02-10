/* eslint-disable @typescript-eslint/camelcase */
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  check,
  checkMultiple,
  PERMISSIONS,
  request,
} from 'react-native-permissions';
import { RouteProp, useNavigation } from '@react-navigation/native';
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
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Query,
  QueryGetActiveUserChallengesArgs,
  Mutation,
  MutationUpdateProfilePersonalArgs,
  QueryGetProfileArgs,
} from '~/generated/graphql';
import {
  useGetProfileLazyQuery,
  useFollowProfileMutation,
  useUnfollowProfileMutation,
} from '~/graphql/autogenerate/hooks';
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
import { RootStackParamList } from '~/routes';

export const SafeAreaView = styled(SafeView)`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
`;
export const UserName = styled(TitleText)`
  font-size: 32px;
`;
export const Description = styled(Text)``;
const Avatar = styled(ImageZoom)`
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
export const Cover = styled(ImageZoom)`
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
interface FollowButtonProps extends TouchableOpacity {
  isFollowing: boolean;
}
export const FollowButton = styled.TouchableOpacity<FollowButtonProps>`
  background-color: ${({ theme, isFollowing }) =>
    !isFollowing ? theme.colors.blue : theme.colors.accent.green};
  border-radius: 16px;
  align-items: center;
  padding: 8.5px 12px;
  flex-direction: row;
`;
export const FollowText = styled(Text)<FollowButtonProps>`
  color: white;
  margin-left: 5px;
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
    $user_id: String
  ) {
    getActiveUserChallenges(
      pagination: $pagination
      profile_id: $profile_id
      user_id: $user_id
    ) {
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
type VisitorProfileRouteProp = RouteProp<RootStackParamList, 'User.VisitorProfile'>;

type VisitorProfileNavigationProp = StackNavigationProp<
  RootStackParamList,
  'User.VisitorProfile'
>;

type Props = {
  route: VisitorProfileRouteProp;
  navigation: VisitorProfileNavigationProp;
};

const UserVisitorProfile: React.FC<Props> = ({ route, navigation }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>();
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [followProfileMutation] = useFollowProfileMutation({
    onCompleted: () => setDisableButton(false),
    onError: (e) => {
      setDisableButton(false);
      console.log(e);
    },
  });
  const [unfollowProfileMutation] = useUnfollowProfileMutation({
    onCompleted: () => setDisableButton(false),
    onError: () => setDisableButton(false),
  });
  const [cover, setCover] = useState('');
  const [avatar, setAvatar] = useState('');
  const { profileID } = useUserToken();

  const [getProfile, { data, loading, refetch }] = useGetProfileLazyQuery({
    variables: {
      data: {
        profile_id_requesting: profileID,
        profile_id_accessed: route.params.profile_id,
      },
    },
    onError: (e) => {
      Sentry.captureException(e);
      if (e.message === 'Too many request, please try again after moments') {
        refetch();
      }
    },
  });

  React.useEffect(() => {
    if (profileID.length > 0) {
      getProfile();
    }
  }, [profileID]);

  const {
    data: challenges,
    loading: loadingChallenges,
    refetch: refetchChallenge,
  } = useQuery<GetActiveUserChallengesProps, QueryGetActiveUserChallengesArgs>(
    GET_CHALLENGES,
    {
      fetchPolicy: 'no-cache',
      onError: (e) => Sentry.captureException(e),
      variables: {
        profile_id: route.params.profile_id,
        user_id: route.params.user_id,
        pagination: {
          offset: 30,
          page: 1,
        },
      },
    },
  );
  React.useEffect(() => {
    if (data?.getProfile.is_follower) {
      console.log(`IS FOLLLOWE? ${data.getProfile.is_follower}`);
      setIsFollowing(data?.getProfile.is_follower);
    }
  }, [data]);

  const handleFollow = async () => {
    setDisableButton(true);
    console.log({
      data: {
        profile_main_id: profileID,
        profile_following_id: route.params.profile_id,
      },
    });
    if (isFollowing) {
      const { data: followPayload } = await unfollowProfileMutation({
        variables: {
          data: {
            profile_main_id: profileID,
            profile_following_id: route.params.profile_id,
          },
        },
      });
      if (followPayload?.unfollowProfile) {
        setIsFollowing(false);
      }
    } else {
      const { data: followPayload } = await followProfileMutation({
        variables: {
          data: {
            profile_main_id: profileID,
            profile_following_id: route.params.profile_id,
          },
        },
      });
      if (followPayload?.followProfile) {
        setIsFollowing(true);
      }
    }
  };

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
      <StatusBar
        backgroundColor="transparent"
        animated
        barStyle="light-content"
        translucent
      />
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          <Cover
            progressiveRenderingEnabled
            uri={{
              uri:
                cover || `${PUBLIC_STORAGE}/${data?.getProfile.profile_cover}`,
            }}
          >
            <LinearGradient
              colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.5)', 'transparent']}
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
              </HeaderActionsContainer>
            </LinearGradient>
          </Cover>

          <Content>
            <View style={{ alignItems: 'center', marginTop: -80 }}>
              <View>
                <Avatar
                  uri={{
                    uri:
                      avatar ||
                      `${PUBLIC_STORAGE}/${data?.getProfile.profile_avatar}`,
                  }}
                />
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
          <Content>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isFollowing !== null && (
                <FollowButton
                  onPress={() => handleFollow()}
                  isFollowing={isFollowing}
                  disabled={disableButton}
                >
                  {!isFollowing && !disableButton && (
                    <Icons name="follow" color="#0564ff" />
                  )}
                  {isFollowing && !disableButton && (
                    <Icons name="done" color="#FFF" />
                  )}
                  {disableButton && <ActivityIndicator color="#fff" />}
                  {!disableButton && (
                    <FollowText isFollowing={isFollowing}>
                      {isFollowing ? 'Seguindo' : 'Seguir'}
                    </FollowText>
                  )}
                </FollowButton>
              )}
            </View>
          </Content>
          <Content
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />

          {challenges && challenges.getActiveUserChallenges.length > 0 && (
            <>
              <Content>
                <Title>Minhas inscrições</Title>
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
                        navigation.push('Challenge.Description', {
                          challenge_id: challenge.id,
                        })
                      }
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
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default UserVisitorProfile;
