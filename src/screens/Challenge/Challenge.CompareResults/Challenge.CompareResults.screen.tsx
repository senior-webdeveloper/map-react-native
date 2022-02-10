import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import CachedImage from 'react-native-image-cache-wrapper';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import { addHours, addMinutes, format, intervalToDuration } from 'date-fns';
import * as Sentry from '@sentry/react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import ActionSheet from 'react-native-actionsheet';
import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { Icons, SmallText, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import {
  useGetProfileLazyQuery,
  useGetUserChallengeProgressLazyQuery,
  useGetUserChallengeProgressQuery,
  useGetSubscriptionProgressQuery,
  useRemoveActivityFromAllChallengeProgressMutation,
  useDeleteChallengeProgressActivityV2Mutation,
  GetSubscriptionProgressDocument,
  useGetSubscriptionProgressLazyQuery,
} from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks';
import { Activity } from '~/graphql/autogenerate/schemas';
import formatterMinutes from '~/helpers/formatterMinutes';
import formatMinutesInHours from '~/helpers/formatMinutesInHours';
import formatNumber from '~/helpers/formatNumbers';
import { useStoreState } from '~/store';
import formatSecondsInHours from '~/helpers/formatSecondsInHours';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ptBR = require('date-fns/locale/pt-BR');

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 50px 16px 18px 16px;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  elevation: 1;
`;
export const Title = styled(TitleText)`
  font-size: 20px;
`;
export const Container = styled.View`
  flex: 1;
  background-color: rgba(239, 250, 255, 0.5);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;
export const OptionContainer = styled.TouchableOpacity`
  flex-direction: row;
  background-color: white;
  justify-content: space-between;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;
export const ContentWrapper = styled.View`
  background-color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-bottom: 8px;
  elevation: 1;
  padding-left: 16px;
`;
export const ChallengeTitle = styled(TitleText)`
  font-size: 24px;
  text-align: left;
  width: ${widthPercentageToDP(70)};
`;
export const InformationTitle = styled(SmallText)`
  font-weight: 300;
  color: rgba(22, 28, 37, 0.56);
  line-height: 14px;
`;
export const SubscriptionText = styled(TitleText)`
  /* font-weight: 300; */
  color: rgba(22, 28, 37, 0.56);
  line-height: 14px;
  font-size: 14px;
`;
export const SubInfoTitle = styled(SmallText)`
  font-weight: 300;
  color: rgba(22, 28, 37, 0.56);
  font-size: 14px;
`;

export const SubInfoText = styled(SmallText)`
  text-align: center;
  font-size: 20px;
`;
type CompareResultsRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.CompareResults'
>;

type CompareResultsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.CompareResults'
>;

type Props = {
  route: CompareResultsRouteProp;
  navigation: CompareResultsNavigationProp;
};

const { width } = Dimensions.get('window');
const ViewTypes = {
  FULL: 0,
};
const layoutMaker = () =>
  new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = width - 16;
      dim.height = 76;
    },
  );

const ChallengeCompareResults: React.FC<Props> = ({ route, navigation }) => {
  const userinfo = useStoreState((state) => state.profile.payload);
  const [selectedActivity, setSelectedActivity] = useState<string>();
  const panel = useRef<ActionSheet>();
  const { profileID, userID } = useUserToken();
  const profile = useStoreState((state) => state.profile.payload);
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;

  const [fetchProgress, { data }] = useGetSubscriptionProgressLazyQuery({
    fetchPolicy: 'no-cache',
  });

  const [deleteAllActivities] =
    useRemoveActivityFromAllChallengeProgressMutation({
      onError: (e) =>
        Alert.alert(
          'Erro ao excluir uma atividade de todos os desafios',
          e.message,
        ),
      onCompleted: () => {
        Alert.alert('Sucesso!', 'atividade removida com sucesso!');
        if (fetchProgress) {
          fetchProgress({
            variables: {
              data: {
                challenge_id: route.params.challenge.id,
                user_id: route.params.user.id,
                user_challenge_id: route.params.subscription_id,
              },
            },
          });
        } else {
          console.log('Opa, tamo sem o refetch aqui.');
        }
      },
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GetSubscriptionProgressDocument,
          variables: {
            data: {
              challenge_id: route.params.challenge.id,
              user_id: route.params.user.id,
              user_challenge_id: route.params.subscription_id,
            },
          },
        },
      ],
    });

  const [fetchMyData, { data: myData, loading: loadingMyData }] =
    useGetUserChallengeProgressLazyQuery({
      fetchPolicy: 'no-cache',
    });

  useEffect(() => {
    fetchProgress({
      variables: {
        data: {
          challenge_id: route.params.challenge.id,
          user_id: route.params.user.id,
          user_challenge_id: route.params.subscription_id,
        },
      },
    });
  }, [route.params]);

  useEffect(() => {
    if (userID) {
      fetchMyData({
        variables: {
          data: {
            challenge_id: route.params.challenge.id,
            user_id: userID,
          },
        },
      });
    }
  }, [userID]);

  type ChallengeType = 'altimetric' | 'distance' | 'mixed-distance-altimetric';
  const handleType = (type: ChallengeType) => {
    if (type === 'altimetric') {
      return 'Altimetria';
    }
    if (type === 'distance') {
      return 'Distância';
    }
    return 'Misto';
  };
  function handleProgress(
    type: ChallengeType,
    userActivities?: Activity[],
  ): string | number | undefined {
    if (type === 'altimetric') {
      return userActivities?.reduce(
        (acc, rec) => acc + rec?.activity?.total_elevation_gain,
        0,
      );
    }
    if (type === 'distance') {
      const reduceDistance = userActivities?.reduce((acc, rec) => {
        return acc + rec?.activity?.distance;
      }, 0);
      if (reduceDistance) {
        return formatNumber(reduceDistance / 1000, { hasDot: true });
      }
    }
    return 0;
  }
  function handleProgressPercentage(
    type: ChallengeType,
    userActivities?: Activity[],
  ): string | number | undefined {
    const result = handleProgress(type, userActivities);
    if (type === 'altimetric') {
      const goal = route.params.challenge.configuration?.altimetry_goal_value;
      if (result) {
        const test = (Number(result) * 100) / goal;
        return test / 100;
      }
    }
    if (type === 'distance') {
      const goal = route.params.challenge.configuration?.distance_goal_value;
      const goalInKm = goal / 1000;
      if (result) {
        const test = (Number(result) * 100) / goalInKm;
        return test / 100;
      }
    }
    return 0;
  }

  const handleProgressNumber = (value: number, goalValue: number): number => {
    const result = (value * 100) / goalValue / 100;
    return result;
  };

  useEffect(() => {
    if (data?.getSubscriptionProgress.activities) {
      setDataProvider(
        dataProviderMaker(data?.getSubscriptionProgress.activities),
      );
    }
  }, [data]);

  const RenderCard = (type, activity, index) => {
    // const { activity } = item;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push('Challenge.ShowSpecificActivity', {
            id: activity.activity.id,
            user: route.params.user,
            registration_date:
              route.params.selected_user_info.registration_date,
          })
        }
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingVertical: 15,
          borderBottomColor: 'rgba(22, 28, 37, 0.19)',
          borderBottomWidth: 0.5,
        }}
      >
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          {activity.activity.third_party_data_source_slug && (
            <View
              style={{
                width: 28,
                alignItems: 'center',
                marginRight: 5,
                marginTop: 0,
              }}
            >
              <Icons
                name={
                  activity.activity.third_party_data_source_slug ??
                  'strava-crawler'
                }
              />
            </View>
          )}

          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
              maxWidth: userinfo?.getProfile.user.staff
                ? widthPercentageToDP('80')
                : widthPercentageToDP('100'),
            }}
          >
            <SubInfoText numberOfLines={1}>
              {activity.activity.name ?? 'Pedalada'}
            </SubInfoText>
            <SubInfoTitle>
              <SubInfoTitle style={{ textTransform: 'capitalize' }}>
                {' '}
                {activity.activity.third_party_data_source_slug !==
                'strava-crawler'
                  ? activity.activity.third_party_data_source_slug.replace(
                      '-',
                      ' ',
                    )
                  : 'Strava'}
              </SubInfoTitle>{' '}
              -{' '}
              {format(
                new Date(activity.activity.start_date_local),
                "kk':'mm':'ss",
              ) !== '24:00:00'
                ? activity.activity.start_date_local &&
                  format(
                    addHours(new Date(activity.activity.start_date_local), 3),
                    "dd 'de' MMMM 'de' u 'às' kk':'mm ",
                    { locale: ptBR },
                  )
                : format(
                    addHours(new Date(activity.activity.start_date_local), 3),
                    "dd 'de' MMMM 'de' u",
                    { locale: ptBR },
                  )}
            </SubInfoTitle>
          </View>
        </View>
        {userinfo?.getProfile.user.staff ? (
          <TouchableOpacity
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            onPress={() => {
              setSelectedActivity(activity.activity.id);
              setTimeout(() => {
                panel.current.show();
              }, 350);
            }}
          >
            <Icons name="dots-horizontal" />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  };

  const handleProgressCalc = (value: number, goalValue: number): number => {
    const result = (value * 100) / goalValue / 100;
    return result > 1 ? 1 : result;
  };

  console.log(
    'teste: ',
    // Number(
    // Number(
    data?.getSubscriptionProgress.total_altimetry,
    // * 100,
    // )
    // /
    //   route.params.challenge.configuration
    //     ?.altimetry_goal_value,
    // ) / 100
  );

  return (
    <>
      <StatusBar
        backgroundColor="#FFFFFF"
        animated
        barStyle="dark-content"
        translucent
      />
      <Container>
        <Header>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <Title>Resultados</Title>
          <TouchableOpacity>
            <Icons name="dots-horizontal" />
          </TouchableOpacity>
        </Header>
        {data?.getSubscriptionProgress ? (
          <ScrollView
            style={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          >
            <ContentWrapper
              style={{ paddingVertical: 16, paddingHorizontal: 16 }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.push('Challenge.Description', {
                    challenge_id: route.params.challenge.id,
                  });
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <FastImage
                    style={{ width: 56, height: 56 }}
                    source={{
                      uri: `${PUBLIC_STORAGE}/${route.params.challenge.image_avatar}`,
                    }}
                  />
                  <View style={{ marginHorizontal: 10 }}>
                    <ChallengeTitle numberOfLines={1}>
                      {route.params.challenge.name}
                    </ChallengeTitle>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 17,
                      }}
                    >
                      <View>
                        <InformationTitle>Modalidade</InformationTitle>
                        <Text>
                          {handleType(route.params.challenge.challenge_type)}
                        </Text>
                      </View>
                      {route.params.challenge.has_categories &&
                        data?.getSubscriptionProgress.category
                          ?.category_configuration?.distance_goal_value > 0 && (
                          <View style={{ alignItems: 'center' }}>
                            <InformationTitle>Distância</InformationTitle>
                            <Text>
                              {data?.getSubscriptionProgress.category
                                ?.category_configuration?.distance_goal_value /
                                1000}{' '}
                              km
                            </Text>
                          </View>
                        )}

                      {route.params.challenge.has_categories &&
                        data?.getSubscriptionProgress.category
                          ?.category_configuration?.altimetry_goal_value >
                          0 && (
                          <View style={{ alignItems: 'flex-end' }}>
                            <InformationTitle>Altimetria</InformationTitle>
                            <Text>
                              {
                                data?.getSubscriptionProgress.category
                                  ?.category_configuration?.altimetry_goal_value
                              }
                              m
                            </Text>
                          </View>
                        )}

                      {!route.params.challenge.has_categories &&
                        route.params.challenge.configuration
                          ?.distance_goal_value > 0 && (
                          <View style={{ alignItems: 'center' }}>
                            <InformationTitle>Distância</InformationTitle>
                            {route.params.challenge.configuration
                              ?.distance_goal_value &&
                            !route.params.challenge.configuration
                              ?.max_distance_goal_value ? (
                              <Text>
                                {route.params.challenge.configuration
                                  ?.distance_goal_value / 1000}{' '}
                                km
                              </Text>
                            ) : null}

                            {route.params.challenge.configuration
                              ?.distance_goal_value &&
                            route.params.challenge.configuration
                              ?.max_distance_goal_value ? (
                              <Text>
                                {route.params.challenge.configuration
                                  ?.distance_goal_value / 1000}{' '}
                                a{' '}
                                {route.params.challenge.configuration
                                  ?.max_distance_goal_value / 1000}{' '}
                                km
                              </Text>
                            ) : null}
                          </View>
                        )}

                      {!route.params.challenge.has_categories &&
                        route.params.challenge.configuration
                          ?.altimetry_goal_value > 0 && (
                          <View style={{ alignItems: 'flex-end' }}>
                            <InformationTitle>Altimetria</InformationTitle>
                            <Text>
                              {
                                route.params.challenge.configuration
                                  ?.altimetry_goal_value
                              }
                              m
                            </Text>
                          </View>
                        )}
                    </View>
                  </View>
                </View>
                <View style={{ width: 20 }}>
                  <Icons name="chevron-right" style={{ marginTop: 10 }} />
                </View>
              </TouchableOpacity>
            </ContentWrapper>
            <ContentWrapper
              style={{ paddingVertical: 16, paddingHorizontal: 16 }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (profileID === route.params.user.profile.id) {
                    navigation.push('User.Profile');
                  } else {
                    navigation.push('User.VisitorProfile', {
                      profile_id: route.params.user.profile.id,
                      user_id: route.params.user.id,
                    });
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <CachedImage
                    source={{
                      uri: `${PUBLIC_STORAGE}/${route.params.user.profile.profile_avatar}`,
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 48,
                      marginRight: 10,
                    }}
                  />
                  <View>
                    <Title>
                      {`${route.params.selected_user_info.user.firstname} ${route.params.selected_user_info.user.lastname}`}
                    </Title>
                    <InformationTitle>
                      @{route.params.selected_user_info.user.profile.username}
                    </InformationTitle>
                  </View>
                </View>
                {route.params.selected_user_info.classification === 1 && (
                  <Icons name="crown" />
                )}
              </TouchableOpacity>
              {route.params?.challenge?.configuration?.is_paid ? (
                <>
                  {data?.getSubscriptionProgress?.paid ? (
                    <View
                      style={{
                        paddingTop: 10,
                        marginBottom: -10,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <SubscriptionText>Inscrição: </SubscriptionText>
                      <InformationTitle style={{ color: '#009D33' }}>
                        Confirmada
                      </InformationTitle>
                      <Icons name="check" color="#009D33" height={8} />
                    </View>
                  ) : (
                    <View
                      style={{
                        paddingTop: 10,
                        marginBottom: -10,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <SubscriptionText>Inscrição: </SubscriptionText>
                      <InformationTitle
                        style={{
                          color: '#FFC502',
                          textTransform: 'capitalize',
                        }}
                      >
                        Não confirmada
                      </InformationTitle>
                    </View>
                  )}
                </>
              ) : null}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  width: '100%',
                  marginTop: 17,
                }}
              >
                <View style={{ paddingRight: 15 }}>
                  <SubInfoTitle>Pedais</SubInfoTitle>
                  <SubInfoText>
                    {data?.getSubscriptionProgress.total_rides}
                  </SubInfoText>
                </View>
                <View
                  style={{
                    paddingHorizontal: 16,
                    alignItems: 'center',
                    borderLeftColor: '#161C25',
                    borderLeftWidth: 0.5,
                    borderRightColor: '#161C25',
                    borderRightWidth: 0.5,
                  }}
                >
                  <SubInfoTitle>Tempo</SubInfoTitle>
                  <SubInfoText>
                    {formatSecondsInHours(
                      data?.getSubscriptionProgress?.total_time_seconds,
                    )}
                  </SubInfoText>
                </View>
                <View style={{ paddingHorizontal: 21 }}>
                  <SubInfoTitle>Posição</SubInfoTitle>
                  <SubInfoText>
                    {data?.getSubscriptionProgress.classification}
                  </SubInfoText>
                </View>
              </View>
              {route.params.challenge.challenge_type ===
                'mixed-distance-altimetric' && (
                <>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 14,
                    }}
                  >
                    <View
                      style={{
                        width: widthPercentageToDP('20'),
                      }}
                    >
                      <Text>Distância</Text>
                    </View>

                    <ProgressBar
                      progress={handleProgressCalc(
                        data?.getSubscriptionProgress.total_distance,
                        route.params.challenge.configuration
                          ?.distance_goal_value,
                      )}
                      color={
                        handleProgressCalc(
                          data?.getSubscriptionProgress.total_distance,
                          route.params.challenge.configuration
                            ?.distance_goal_value,
                        ) >= 1
                          ? '#009D33'
                          : '#0564FF'
                      }
                      style={{
                        height: 11,
                        width: widthPercentageToDP('50'),
                        borderRadius: 24,
                        backgroundColor: '#D8D8D8',
                      }}
                    />
                    <View
                      style={{
                        width: widthPercentageToDP('20'),
                        marginLeft: 10,
                      }}
                    >
                      <Text>
                        {data?.getSubscriptionProgress.total_distance
                          ? formatNumber(
                              data?.getSubscriptionProgress.total_distance /
                                1000,
                              { hasDot: true },
                            )
                          : null}{' '}
                        km
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 14,
                    }}
                  >
                    <View
                      style={{
                        width: widthPercentageToDP('20'),
                      }}
                    >
                      <Text>Altimetria</Text>
                    </View>
                    <ProgressBar
                      progress={handleProgressCalc(
                        data?.getSubscriptionProgress.total_altimetry,
                        route.params.challenge.configuration
                          ?.altimetry_goal_value,
                      )}
                      color={
                        handleProgressCalc(
                          data?.getSubscriptionProgress.total_altimetry,
                          route.params.challenge.configuration
                            ?.altimetry_goal_value,
                        ) >= 1
                          ? '#009D33'
                          : '#0564FF'
                      }
                      style={{
                        height: 11,
                        width: widthPercentageToDP('50'),
                        borderRadius: 24,
                        backgroundColor: '#D8D8D8',
                      }}
                    />
                    <View
                      style={{
                        width: widthPercentageToDP('20'),
                        marginLeft: 10,
                      }}
                    >
                      <Text>
                        {data?.getSubscriptionProgress.total_altimetry
                          ? formatNumber(
                              data?.getSubscriptionProgress.total_altimetry,
                              { hasDot: false },
                            )
                          : null}{' '}
                        m
                      </Text>
                    </View>
                  </View>
                </>
              )}
              {route.params.challenge.challenge_type === 'distance' && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 14,
                  }}
                >
                  <View
                    style={{
                      width: widthPercentageToDP('20'),
                    }}
                  >
                    <Text>Distância </Text>
                  </View>
                  <ProgressBar
                    progress={
                      Number(
                        Number(
                          data?.getSubscriptionProgress.total_distance * 100,
                        ) /
                          route.params.challenge.configuration
                            ?.distance_goal_value,
                      ) / 100
                    }
                    color={
                      Number(
                        Number(
                          data?.getSubscriptionProgress.total_distance * 100,
                        ) /
                          route.params.challenge.configuration
                            ?.distance_goal_value,
                      ) /
                        100 >=
                      1
                        ? '#009D33'
                        : '#0564FF'
                    }
                    style={{
                      height: 11,
                      width: widthPercentageToDP('50'),
                      borderRadius: 24,
                      backgroundColor: '#D8D8D8',
                    }}
                  />
                  <View
                    style={{
                      width: widthPercentageToDP('20'),
                      marginLeft: 10,
                    }}
                  >
                    <Text>
                      {route.params.challenge_type === 'altimetric'
                        ? `${formatNumber(
                            data?.getSubscriptionProgress.total_altimetry ?? 0,
                            { hasDot: false },
                          )} m`
                        : `${formatNumber(
                            Number(
                              data?.getSubscriptionProgress.total_distance /
                                1000,
                            ),
                            { hasDot: true },
                          )} km`}
                    </Text>
                  </View>
                </View>
              )}
              {route.params.challenge.challenge_type === 'altimetric' && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 14,
                  }}
                >
                  <View
                    style={{
                      width: widthPercentageToDP('20'),
                    }}
                  >
                    <Text>Altimetria</Text>
                  </View>
                  <ProgressBar
                    progress={
                      Number(
                        Number(
                          data?.getSubscriptionProgress.total_altimetry * 100,
                        ) /
                          route.params.challenge.configuration
                            ?.altimetry_goal_value,
                      ) / 100
                    }
                    color={
                      Number(
                        Number(
                          data?.getSubscriptionProgress.total_altimetry * 100,
                        ) /
                          route.params.challenge.configuration
                            ?.altimetry_goal_value,
                      ) /
                        100 >=
                      1
                        ? '#009D33'
                        : '#0564FF'
                    }
                    style={{
                      height: 11,
                      width: widthPercentageToDP('50'),
                      borderRadius: 24,
                      backgroundColor: '#D8D8D8',
                    }}
                  />
                  <View
                    style={{
                      width: widthPercentageToDP('20'),
                      marginLeft: 10,
                    }}
                  >
                    <Text>
                      {formatNumber(
                        data?.getSubscriptionProgress.total_altimetry,
                        { hasDot: false },
                      )}{' '}
                      m
                    </Text>
                  </View>
                </View>
              )}
            </ContentWrapper>
            {myData && route.params.user.id !== userID && !loadingMyData && (
              <ContentWrapper
                style={{ paddingVertical: 16, paddingHorizontal: 16 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('User.Profile');
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <CachedImage
                      source={{
                        uri: `${PUBLIC_STORAGE}/${myData.getUserChallengeProgress.user.profile?.profile_avatar}`,
                      }}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 48,
                        marginRight: 10,
                      }}
                    />
                    <View>
                      <Title>
                        {`${myData.getUserChallengeProgress.user.firstname} ${myData.getUserChallengeProgress.user.lastname}`}
                      </Title>
                      <InformationTitle>
                        @{myData.getUserChallengeProgress.user.profile.username}
                      </InformationTitle>
                    </View>
                  </View>
                  {myData.getUserChallengeProgress.classification === 1 && (
                    <Icons name="crown" />
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                    marginTop: 17,
                  }}
                >
                  <View style={{ paddingRight: 15 }}>
                    <SubInfoTitle>Pedais</SubInfoTitle>
                    <SubInfoText>
                      {myData.getUserChallengeProgress.activities.length ?? 0}
                    </SubInfoText>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 16,
                      alignItems: 'center',
                      borderLeftColor: '#161C25',
                      borderLeftWidth: 0.5,
                      borderRightColor: '#161C25',
                      borderRightWidth: 0.5,
                    }}
                  >
                    <SubInfoTitle>Tempo</SubInfoTitle>
                    <SubInfoText>
                      {formatSecondsInHours(
                        myData.getUserChallengeProgress.total_time_seconds,
                      )}
                    </SubInfoText>
                  </View>
                  <View style={{ paddingHorizontal: 21 }}>
                    <SubInfoTitle>Posição</SubInfoTitle>
                    <SubInfoText>
                      {myData.getUserChallengeProgress.classification}
                    </SubInfoText>
                  </View>
                </View>
                {/* COMMON */}
                {route.params.challenge.challenge_type ===
                  'mixed-distance-altimetric' &&
                  myData &&
                  myData.getUserChallengeProgress && (
                    <>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 14,
                        }}
                      >
                        <View
                          style={{
                            width: widthPercentageToDP('20'),
                          }}
                        >
                          <Text>Distância</Text>
                        </View>
                        <ProgressBar
                          progress={handleProgressCalc(
                            myData?.getUserChallengeProgress.total_distance,
                            route.params.challenge.configuration
                              ?.distance_goal_value,
                          )}
                          color={
                            handleProgressCalc(
                              myData?.getUserChallengeProgress.total_distance,
                              route.params.challenge.configuration
                                ?.distance_goal_value,
                            ) >= 1
                              ? '#009D33'
                              : '#0564FF'
                          }
                          style={{
                            height: 11,
                            width: widthPercentageToDP('50'),
                            borderRadius: 24,
                            backgroundColor: '#D8D8D8',
                          }}
                        />
                        <View
                          style={{
                            width: widthPercentageToDP('20'),
                            marginLeft: 10,
                          }}
                        >
                          <Text>
                            {formatNumber(
                              Number(
                                myData?.getUserChallengeProgress.total_distance
                                  ? myData?.getUserChallengeProgress
                                      .total_distance / 1000
                                  : 0,
                              ),
                              { hasDot: true },
                            )}{' '}
                            km
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 14,
                        }}
                      >
                        <View
                          style={{
                            width: widthPercentageToDP('20'),
                          }}
                        >
                          <Text>Altimetria</Text>
                        </View>
                        <ProgressBar
                          progress={handleProgressCalc(
                            myData?.getUserChallengeProgress.total_altimetry,
                            route.params.challenge.configuration
                              ?.altimetry_goal_value,
                          )}
                          color={
                            handleProgressCalc(
                              myData?.getUserChallengeProgress.total_altimetry,
                              route.params.challenge.configuration
                                ?.altimetry_goal_value,
                            ) >= 1
                              ? '#009D33'
                              : '#0564FF'
                          }
                          style={{
                            height: 11,
                            width: widthPercentageToDP('50'),
                            borderRadius: 24,
                            backgroundColor: '#D8D8D8',
                          }}
                        />
                        <View
                          style={{
                            width: widthPercentageToDP('20'),
                            marginLeft: 10,
                          }}
                        >
                          <Text>
                            {formatNumber(
                              myData?.getUserChallengeProgress.total_altimetry,
                              { hasDot: false },
                            )}{' '}
                            m
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                {route.params.challenge.challenge_type === 'distance' &&
                  myData &&
                  myData?.getUserChallengeProgress && (
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 14,
                      }}
                    >
                      <View
                        style={{
                          width: widthPercentageToDP('20'),
                        }}
                      >
                        <Text>Distância</Text>
                      </View>
                      <ProgressBar
                        progress={
                          Number(
                            Number(
                              myData?.getUserChallengeProgress.total_distance
                                ? myData?.getUserChallengeProgress
                                    .total_distance * 100
                                : 0,
                            ) /
                              route.params.challenge.configuration
                                ?.distance_goal_value,
                          ) / 100
                        }
                        color={
                          Number(
                            Number(
                              myData?.getUserChallengeProgress.total_distance
                                ? myData?.getUserChallengeProgress
                                    .total_distance * 100
                                : 0,
                            ) /
                              route.params.challenge.configuration
                                ?.distance_goal_value,
                          ) /
                            100 >=
                          1
                            ? '#009D33'
                            : '#0564FF'
                        }
                        style={{
                          height: 11,
                          width: widthPercentageToDP('50'),
                          borderRadius: 24,
                          backgroundColor: '#D8D8D8',
                        }}
                      />
                      <View
                        style={{
                          width: widthPercentageToDP('20'),
                          marginLeft: 10,
                        }}
                      >
                        <Text>
                          {handleProgress(
                            'distance',
                            myData?.getUserChallengeProgress.activities,
                          )}{' '}
                          km
                        </Text>
                      </View>
                    </View>
                  )}
                {route.params.challenge.challenge_type === 'altimetric' &&
                  myData.getUserChallengeProgress &&
                  myData.getUserChallengeProgress.activities && (
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 14,
                      }}
                    >
                      <View
                        style={{
                          width: widthPercentageToDP('20'),
                        }}
                      >
                        <Text>Altimetria</Text>
                      </View>
                      <ProgressBar
                        progress={handleProgressPercentage(
                          route.params.challenge.challenge_type,
                          myData?.getUserChallengeProgress.activities,
                        )}
                        color={
                          handleProgressPercentage(
                            route.params.challenge.challenge_type,
                            myData?.getUserChallengeProgress.activities,
                          ) > 1
                            ? '#009D33'
                            : '#0564FF'
                        }
                        style={{
                          height: 11,
                          width: widthPercentageToDP('50'),
                          borderRadius: 24,
                          backgroundColor: '#D8D8D8',
                        }}
                      />
                      <View
                        style={{
                          width: widthPercentageToDP('20'),
                          marginLeft: 10,
                        }}
                      >
                        <Text>
                          {handleProgress(
                            'altimetric',
                            myData?.getUserChallengeProgress.activities,
                          )}{' '}
                          m
                        </Text>
                      </View>
                    </View>
                  )}
              </ContentWrapper>
            )}
            {data?.getSubscriptionProgress.activities.length > 0 && (
              <ContentWrapper
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  marginBottom: 20,
                }}
              >
                <Title>Pedaladas de {route.params.user.firstname}</Title>
                <SubInfoTitle>
                  Todos as pedaladas que foram levadas em conta para este
                  desafio.
                </SubInfoTitle>
                <View style={{ minHeight: 1, minWidth: 1 }}>
                  <RecyclerListView
                    layoutProvider={layoutProvider}
                    dataProvider={dataProvider}
                    rowRenderer={RenderCard}
                    canChangeSize
                    scrollViewProps={{
                      showsVerticalScrollIndicator: false,
                    }}
                  />
                </View>

                {/* <FlatList
                data={data?.getSubscriptionProgress.activities}
                style={{ marginTop: 12 }}
                renderItem={}
              /> */}
              </ContentWrapper>
            )}
          </ScrollView>
        ) : null}

        <ActionSheet
          ref={panel}
          title="O que fazer com a pedalada?"
          options={[
            'Remover do Desafio',
            'Remover de TODOS os Desafios',
            'Cancelar',
          ]}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={async (index) => {
            if (index === 0) {
              Alert.alert(
                'Atenção',
                'Esta pedalada não poderá mais ser usada neste desafio, mesmo enviando novamente. A ação é irreversível.',
                [
                  {
                    text: 'Sim, tenho certeza',
                    onPress: async () => {
                      await deleteAllActivities({
                        variables: {
                          data: {
                            activity_id: selectedActivity,
                            challenge_id:
                              data?.getSubscriptionProgress.challenge_id,
                            user_id: userID,
                          },
                        },
                      });
                    },
                  },
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                ],
              );
            } else if (index === 1) {
              Alert.alert(
                'Atenção',
                'Essa acao removera esse pedal de todos os desafios que ela esta relacionada.',
                [
                  {
                    text: 'Sim, tenho certeza ',
                    onPress: async () => {
                      await deleteAllActivities({
                        variables: {
                          data: {
                            activity_id: selectedActivity,
                          },
                        },
                      });
                    },
                  },
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                ],
              );
            }
          }}
        />
      </Container>
    </>
  );
};

export default ChallengeCompareResults;
