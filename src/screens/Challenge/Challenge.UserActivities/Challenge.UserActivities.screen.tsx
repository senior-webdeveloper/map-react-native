import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import { RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { addHours, format } from 'date-fns';
import FastImage from 'react-native-fast-image';
import { StackNavigationProp } from '@react-navigation/stack';
import ActionSheet from 'react-native-actionsheet';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import ptBR from '~/helpers/dateLocale';
import { RootStackParamList } from '~/routes.types';
import {
  useDeleteChallengeProgressActivityV2Mutation,
  GetSubscriptionProgressDocument,
} from '~/graphql/autogenerate/hooks';
import {
  Icons,
  Text,
  TitleText,
  SmallText,
  BoxShadow as CustomBoxShadow,
  Box,
} from '~/components';
import ProgressBar from './components/ProgressBar';
import { SubInfoText } from '~/screens/Challenge/Challenge.ShowSpecificAcitivity/Challenge.ShowSpecificAcitivity.screen';
import { ChallengeActivity } from '~/graphql/autogenerate/schemas';
import {
  ContentWrapper,
  SubInfoTitle,
} from '~/screens/Challenge/Challenge.CompareResults/Challenge.CompareResults.screen';
import formatNumbers from '~/helpers/formatNumbers';
import handleTime from '~/helpers/formatMinutesInHours';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import formatSecondsInHours from '~/helpers/formatSecondsInHours';

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
`;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
`;
export const ChallengeName = styled(Text)`
  opacity: 0.5;
  font-size: 16px;
  font-family: NeuzeitGro-Lig;
  line-height: 32px;
`;
export const UserName = styled(Text)`
  line-height: 32px;
`;
export const Avatar = styled(FastImage)`
  width: 58px;
  height: 58px;
  border-radius: 58px;
`;
export const AvatarChallenge = styled(FastImage)`
  width: 58px;
  height: 58px;
`;
export const AvatarContainer = styled.TouchableOpacity`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal}
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 20px;
  width: 100%;
`;
export const ActivityName = styled(SmallText)`
  font-size: 18px;
  line-height: 20.7px;
`;

export const SmallDescription = styled(SmallText)`
  font-size: 14px;
  line-height: 16.1px;
  color: rgba(22, 28, 37, 0.56);
`;

export const SeeMoreText = styled(TitleText)`
  font-size: 12px;
  line-height: 13.8px;
  color: rgba(22, 28, 37, 0.4);
`;

export const BoxShadow = styled(CustomBoxShadow)`
  justify-content: space-between;
  padding-top: 16px;
  margin-top: 24px;
`;

export const ArrowUp = styled.View`
  width: 0;
  height: 0;
  border-left-width: 15px;
  border-left-color: transparent;

  border-right-width: 32px;
  border-right-color: transparent;

  border-bottom-width: 32px;
  border-bottom-color: ${({ color }) => color || 'black'};
  margin-right: -32px;
`;

export const ArrowDown = styled.View`
  width: 0;
  height: 0;
  border-left-width: 32px;
  border-left-color: transparent;

  border-right-width: 15px;
  border-right-color: transparent;

  border-top-width: 32px;
  border-top-color: ${({ color }) => color || 'black'};

  margin-left: -32px;
`;

interface ProgressPercentProps {
  isCompleted?: boolean;
  color?: string;
}
export const ProgressPercentText = styled(TitleText)<ProgressPercentProps>`
  color: ${({ theme, isCompleted, color }) =>
    isCompleted ? theme.colors.accent.green : color || theme.colors.blue};
  font-size: 16px;
  line-height: 18px;
`;

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.UserActivities'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
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
      dim.height = 86;
    },
  );

const ChallengeUserActivities: React.FC<Props> = ({ route, navigation }) => {
  const {
    user_id,
    goal_distance,
    goal_altimetry,
    goal_max_time,
    goal_max_distance,
    goal_max_altimetry,
    goal_min_time,
    challenge_id,
    subscriptionID,
    data,
    user_challenges,
  } = route.params;
  // const [
  //   fetch,
  //   { data: user_challenges, loading, error },
  // ] = useGetSubscriptionProgressLazyQuery({
  //   variables: {
  //     data: {
  //       challenge_id: route.params.data.getChallengeDetail.id,
  //       user_id,
  //       user_challenge_id: subscriptionID,
  //     },
  //   },
  //   fetchPolicy: 'no-cache',
  // });

  // useEffect(() => {
  //   if (route.params.data.getChallengeDetail.id && subscriptionID && user_id) {
  //     fetch({
  //       variables: {
  //         data: {
  //           challenge_id: route.params.data.getChallengeDetail.id,
  //           user_id,
  //           user_challenge_id: subscriptionID,
  //         },
  //       },
  //     });
  //   }
  // }, [fetch, route.params, subscriptionID, user_id]);

  const [calories, setCalories] = useState<number>(0);
  const [selectedActivity, setSelectedActivity] = useState<string>();
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);
  const [showMorePedal, setShowMorePedal] = useState<boolean>(false);
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProviderSmall, setDataProviderSmall] = useState(
    dataProviderMaker([]),
  );
  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const panel = useRef<ActionSheet>();
  const [
    deleteChallengeProgressActivityMutation,
  ] = useDeleteChallengeProgressActivityV2Mutation({
    onCompleted: () => Alert.alert('Atividade excluida!'),
    onError: (e) => Alert.alert('Error', e.message),
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GetSubscriptionProgressDocument,
        variables: {
          data: {
            user_id,
            challenge_id,
          },
        },
      },
    ],
  });

  function handleCalories(activities: ChallengeActivity[]) {
    if (activities && activities.length > 0) {
      const newCalories = activities.reduce(
        (accumulator, currentValue) => {
          if (accumulator.activity) {
            return (
              accumulator.activity.calories + currentValue.activity.calories
            );
          }
          return accumulator + currentValue.activity.calories;
        },
        { activity: { calories: 0 } },
      );
      if (newCalories) {
        setCalories(newCalories);
      }
    }
  }

  useEffect(() => {
    if (user_challenges?.getSubscriptionProgress.activities) {
      handleCalories(user_challenges?.getSubscriptionProgress.activities);
    }
  }, [user_challenges]);

  useEffect(() => {
    if (user_challenges?.getSubscriptionProgress.activities) {
      setDataProviderSmall(
        dataProviderMaker(
          user_challenges?.getSubscriptionProgress.activities.slice(0, 5),
        ),
      );
      setDataProvider(
        dataProviderMaker(user_challenges?.getSubscriptionProgress.activities),
      );
    }
  }, [user_challenges]);

  const RenderItem = (type, activity, index) => (
    <TouchableOpacity
      onPress={() =>
        navigation.push('Challenge.ShowSpecificActivity', {
          id: activity.activity.id,
          user: user_challenges?.getSubscriptionProgress.user,
          // registration_date:
          //   route.params.selected_user_info.registration_date,
        })}
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
        {activity.activity.third_party_data_source_slug ? (
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
        ) : null}

        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: widthPercentageToDP('75'),
          }}
        >
          <ActivityName numberOfLines={1}>
            {activity.activity.name ?? 'Pedalada'}
          </ActivityName>
          <SmallDescription>
            <SmallDescription style={{ textTransform: 'capitalize' }}>
              {activity.activity.third_party_data_source_slug !==
              'strava-crawler'
                ? activity.activity.third_party_data_source_slug.replace(
                    '-',
                    ' ',
                  )
                : 'Strava'}
            </SmallDescription>{' '}
            -{' '}
            {formatNumbers(Number(activity.activity.distance / 1000), {
              hasDot: false,
            })}
            km -{' '}
            {format(
              addHours(new Date(activity.activity.start_date_local), 3),
              "dd 'de' MMMM 'de' u",
              { locale: ptBR },
            )}
          </SmallDescription>
        </View>
      </View>
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
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar barStyle="dark-content" />
      <BoxShadow
        style={{
          paddingTop: 60,
          paddingBottom: 16,
          marginTop: -45,
          paddingHorizontal: 16,
        }}
      >
        <Header>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <Title>Meu progresso</Title>
          <View style={{ width: 20 }} />
        </Header>
      </BoxShadow>

      <ScrollView>
        {!user_challenges ? (
          <ActivityIndicator size="large" color="#0564FF" />
        ) : (
          <>
            <BoxShadow>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                }}
              >
                <Avatar
                  source={{
                    uri: `${PUBLIC_STORAGE}/${user_challenges?.getSubscriptionProgress?.user.profile?.profile_avatar}`,
                  }}
                />

                <View style={{ alignItems: 'center' }}>
                  <Box flexDirection="row" alignItems="center">
                    <ArrowUp color="#4595EC" />
                    <Box backgroundColor="#4595EC" paddingHorizontal={15}>
                      <UserName
                        style={{
                          width: widthPercentageToDP('30'),
                          textAlign: 'center',
                          color: '#FFF',
                        }}
                        numberOfLines={1}
                      >
                        {`${user_challenges?.getSubscriptionProgress?.user.firstname} ${user_challenges?.getSubscriptionProgress?.user.lastname}`}
                      </UserName>
                    </Box>
                    <ArrowDown color="#4595EC" />
                  </Box>

                  <Box flexDirection="row" alignItems="center" marginTop={-1}>
                    <ArrowUp color="#E8ECEF" />
                    <Box backgroundColor="#E8ECEF" paddingHorizontal={15}>
                      <ChallengeName
                        style={{
                          width: widthPercentageToDP('30'),
                          textAlign: 'center',
                        }}
                        numberOfLines={1}
                      >
                        {data?.getChallengeDetail.name}
                      </ChallengeName>
                    </Box>
                    <ArrowDown color="#E8ECEF" />
                  </Box>
                </View>

                <AvatarChallenge
                  source={{
                    uri: `${PUBLIC_STORAGE}/${data?.getChallengeDetail.image_avatar}`,
                  }}
                />
              </View>

              <View style={{ marginTop: 24 }}>
                <BoxShadow style={{ marginTop: 16, paddingHorizontal: 16 }}>
                  <View>
                    <TitleText style={{ color: '#4595EC' }}>
                      Desempenho
                    </TitleText>
                    <Text
                      style={{
                        color: 'rgba(22, 28, 37, 0.56)',
                        fontFamily: 'NeuzeitGro-Lig',
                        fontSize: 14,
                        lineHeight: 16,
                        width: '60%',
                      }}
                    >
                      {user_challenges?.getSubscriptionProgress.completed &&
                      route.params.data?.getChallengeDetail.configuration
                        ?.unique_ride
                        ? 'Seu desempenho neste Desafio.'
                        : null}
                      {!user_challenges?.getSubscriptionProgress.completed &&
                      route.params.data?.getChallengeDetail.configuration
                        ?.unique_ride
                        ? 'O desempenho da sua tentativa atual.'
                        : null}
                      {!route.params.data?.getChallengeDetail.configuration
                        ?.unique_ride
                        ? 'Seu desempenho acumulado neste desafio.'
                        : null}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                      borderBottomWidth: 0.5,
                      paddingVertical: 16,
                    }}
                  >
                    <Text>Distância percorrida</Text>
                    <SubInfoText>
                      {formatNumbers(
                        user_challenges?.getSubscriptionProgress
                          .total_distance / 1000,
                        { hasDot: true },
                      )}{' '}
                      KM
                    </SubInfoText>
                  </View>

                  {user_challenges?.getSubscriptionProgress.total_altimetry >
                    0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                        borderBottomWidth: 0.5,
                        paddingVertical: 16,
                      }}
                    >
                      <Text>Altimetria alcançada</Text>
                      <SubInfoText style={{ textTransform: 'none' }}>
                        {formatNumbers(
                          user_challenges?.getSubscriptionProgress
                            .total_altimetry,
                          { hasDot: false },
                        )}{' '}
                        m
                      </SubInfoText>
                    </View>
                  )}

                  {user_challenges?.getSubscriptionProgress.total_distance &&
                  user_challenges?.getSubscriptionProgress
                    .total_time_seconds ? (
                    <View
                        style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                        borderBottomWidth: 0.5,
                        paddingVertical: 16,
                      }}
                      >
                        <Text>Velocidade Média</Text>
                        <SubInfoText>
                        {formatNumbers(
                          Number(
                            user_challenges?.getSubscriptionProgress
                              .total_distance / 1000,
                          ) /
                            Number(
                              user_challenges?.getSubscriptionProgress
                                .total_time_seconds / 60,
                            ),
                          { hasDot: true },
                        )}{' '}
                        km/h
                      </SubInfoText>
                      </View>
                  ) : null}

                  {showMoreInfo ? (
                    <>
                      {user_challenges?.getSubscriptionProgress
                        .total_time_seconds > 0 ? (
                        <View
                            style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                            borderBottomWidth: 0.5,
                            paddingVertical: 16,
                          }}
                          >
                            <Text>Tempo em movimento</Text>
                            <SubInfoText>
                            {formatSecondsInHours(
                              user_challenges?.getSubscriptionProgress
                                .total_time_seconds,
                            )}
                          </SubInfoText>
                          </View>
                      ) : null}

                      {calories > 0 ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                            borderBottomWidth: 0.5,
                            paddingVertical: 16,
                          }}
                        >
                          <Text>Calorias gastas</Text>
                          <SubInfoText>
                            {formatNumbers(calories, { hasDot: false })} kcal
                          </SubInfoText>
                        </View>
                      ) : null}
                    </>
                  ) : null}
                  <View
                    style={{
                      marginTop: 16,
                      marginBottom: 15,
                      alignItems: 'flex-end',
                    }}
                  >
                    <TouchableOpacity
                      hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                      onPress={() => {
                        setShowMoreInfo((prevState) => !prevState);
                      }}
                    >
                      <SeeMoreText style={{ color: '#4595EC' }}>
                        {showMoreInfo ? 'Ver menos' : 'Ver mais'}
                      </SeeMoreText>
                    </TouchableOpacity>
                  </View>
                </BoxShadow>
              </View>
            </BoxShadow>
          </>
        )}

        {user_challenges?.getSubscriptionProgress.activities.length > 0 ? (
          <BoxShadow style={{ marginTop: 16 }}>
            <ContentWrapper style={{ paddingRight: 16 }}>
              <Box>
                <TitleText style={{ color: '#4595EC' }}>
                  Minhas pedaladas
                </TitleText>
                <Text
                  style={{
                    color: 'rgba(22, 28, 37, 0.56)',
                    fontFamily: 'NeuzeitGro-Lig',
                    fontSize: 14,
                    lineHeight: 16,
                    width: '80%',
                  }}
                >
                  Todos as pedaladas que foram levadas em conta para este
                  desafio.
                </Text>
              </Box>

              <View style={{ minHeight: 1, minWidth: 1 }}>
                <RecyclerListView
                  layoutProvider={layoutProvider}
                  dataProvider={
                    showMorePedal ? dataProvider : dataProviderSmall
                  }
                  canChangeSize
                  disableRecycling
                  rowRenderer={RenderItem}
                  scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                  }}
                />
              </View>

              {user_challenges?.getSubscriptionProgress.activities?.length >
              5 ? (
                <View
                  style={{
                    marginTop: 16,
                    alignItems: 'flex-end',
                    marginBottom: 20,
                  }}
                >
                  <TouchableOpacity
                    hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    onPress={() => {
                      setShowMorePedal((prevState) => !prevState);
                    }}
                  >
                    <SeeMoreText style={{ color: '#4595EC' }}>
                      {showMorePedal ? 'Ver menos' : 'Ver mais'}
                    </SeeMoreText>
                  </TouchableOpacity>
                </View>
              ) : null}
            </ContentWrapper>
          </BoxShadow>
        ) : null}

        <ProgressBar
          userChallenges={user_challenges}
          challenge_id={user_challenges?.getSubscriptionProgress.challenge_id}
          endDate={user_challenges?.getSubscriptionProgress.challenge.end_date}
          navigation={navigation}
          type={data?.getChallengeDetail.challenge_type}
          has_categories={
            user_challenges?.getSubscriptionProgress.challenge.has_categories
          }
          goal_altimetry={goal_altimetry}
          goal_distance={goal_distance}
          goal_max_time={goal_max_time}
          goal_min_time={goal_min_time}
          goal_max_distance={goal_max_distance}
          goal_max_altimetry={goal_max_altimetry}
        />

        <BoxShadow
          style={{
            paddingHorizontal: 16,
            paddingVertical: 23,
            marginTop: 16,
            marginBottom: 40,
          }}
        >
          <Box flexDirection="row" alignItems="flex-start">
            <Icons name="question" />
            <ActivityName
              style={{
                fontSize: 20,
                lineHeight: 22,
                width: '70%',
                marginLeft: 10,
                color: '#4595EC',
              }}
            >
              Por que uma Pedalada não está aqui?
            </ActivityName>
          </Box>

          <SmallDescription style={{ marginTop: 9 }}>
            Para contar para um Desafio a sua pedalada precisa ser feita e
            enviada ao Aplicativo depois da inscrição, assim como acontece em um
            Desafio/Evento real.
          </SmallDescription>
          <SmallDescription style={{ marginTop: 3 }}>
            Além disso nos casos de Desafio de Altimetria o dispostivo que
            gravou a atividade precisa ter feito este registro para que possamos
            validar o seu progresso.
          </SmallDescription>
        </BoxShadow>
      </ScrollView>
      <ActionSheet
        ref={panel}
        title="O que fazer com a pedalada?"
        options={['Remover do Desafio', 'Cancelar']}
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
                    console.log('error', {
                      data: {
                        activity_id: selectedActivity,
                        challenge_id,
                        user_id,
                      },
                    });
                    await deleteChallengeProgressActivityMutation({
                      variables: {
                        data: {
                          activity_id: selectedActivity,
                          challenge_id,
                          user_id,
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
    </View>
  );
};

export default ChallengeUserActivities;
