import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  UIManager,
} from 'react-native';
import { throttle } from 'lodash';
import { addHours, format, isFuture, isPast } from 'date-fns';
import { StackNavigationProp } from '@react-navigation/stack';
import { atom, useRecoilState } from 'recoil';
import { Modalize } from 'react-native-modalize';
import { Box, Button, Icons, Text } from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  useCleanCart,
  useOfflineSubscription,
  useSubscribeUserInChallenge,
  useUserToken,
} from '~/hooks';
import {
  useAddFavoriteChallegeMutation,
  useDeleteFavoriteChallengeMutation,
  useGetSubscriptionProgressLazyQuery,
  useListCompanyUsersLazyQuery,
  useUnsubscribeUserChallengeMutation,
} from '~/graphql/autogenerate/hooks';
import {
  ChallengeAwards,
  UserChallenges,
  UserEventExtraordinaryActionType,
} from '~/graphql/autogenerate/schemas';
import { useStoreActions, useStoreState } from '~/store';
import * as Styled from './styles';
import { BoxContainer } from './styles';
import ProgressBar from '../ProgressBar';
import ChallengeDates from '~/screens/Challenge/Challenge.Description/components/ChallengeDates';
import KitsShowcase from '~/screens/Challenge/Challenge.Description/components/KitsShowcase';
import DrawingShowcase from '~/screens/Challenge/Challenge.Description/components/DrawingShowcase';
import Goals from '~/screens/Challenge/Challenge.Description/components/Goals';
import MyClassification from '~/screens/Challenge/Challenge.Description/components/MyClassification';
import WinnersShowcase from '~/screens/Challenge/Challenge.Description/components/WinnersShowcase';
import BuyModal from '~/screens/Challenge/Challenge.Description/components/BuyModal';
import LoadingChallenge from '~/screens/Challenge/Challenge.Description/components/LoadingChallenge';
import WinnerComponent from '~/screens/Challenge/Challenge.Description/components/WinnerComponent';
import ProductsShowcase from '~/screens/Challenge/Challenge.Description/components/ProductsShowcase';
import {
  GetChallengeDetailQuery,
  GetSubscriptionProgressQuery,
} from '~/graphql/autogenerate/operations';
import Categories from '../Categories';
import Courses from '../Courses';
import PriceLot from '~/screens/Challenge/Challenge.Description/components/PriceLot';
import { BottomOptionsComponent } from '~/screens/Challenge/Challenge.Description/components/MainScreen/components/BottomOptionsComponent';
import { ChallengeNameComponent } from '~/screens/Challenge/Challenge.Description/components/MainScreen/components/ChallengeNameComponent';
import { getOnPressClassification } from '~/screens/Challenge/Challenge.Description/components/MainScreen/helpers/getOnPressClassification';
import { ContainerDates } from '~/screens/Challenge/Challenge.Description/components/MainScreen/components/ContainerDates';
import { HeaderComponent } from '~/screens/Challenge/Challenge.Description/components/MainScreen/components/HeaderComponent';
import { handleShareChallenge } from '~/screens/Challenge/Challenge.Description/components/MainScreen/helpers/handleShareChallenge';
import { getOnPressChallengeName } from '~/screens/Challenge/Challenge.Description/components/MainScreen/helpers/getOnPressChallengeName';
import { MySubscriptionInformation } from '~/screens/Challenge/Challenge.Description/components/MainScreen/components/MySubscriptionInformation';
import { ModalizeComponent } from '~/screens/Challenge/Challenge.Description/components/ModalizeComponent';
import { FreemiumCall } from '~/screens/Challenge/Challenge.Description/components/MainScreen/components/FreemiumCall';
import { FreemiumCallModal } from '~/screens/Challenge/Challenge.Description/components/MainScreen/components/FreemiumCallModal';

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

type Props = {
  challenge_id: string;
  data: GetChallengeDetailQuery;
  navigation: ChallengeDescriptionNavigationProp;
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const userIsSubscribed = atom<boolean>({
  key: 'userIsSubscribed',
  default: undefined,
});

function Detailed({ challenge_id, data, navigation }: Props): JSX.Element {
  const modalizeRef = useRef<Modalize>(null);
  const {
    handleGetLocalSubscription,
    handleRealmSaveSubscription,
    subscription,
  } = useOfflineSubscription();
  const [fetchCompanyUsers, { data: companyUsers }] =
    useListCompanyUsersLazyQuery();

  useEffect(() => {
    if (!companyUsers) {
      fetchCompanyUsers({
        variables: {
          company_id: data.getChallengeDetail.company.id,
        },
      });
    }
  }, [data]);

  const clearCart = useCleanCart();

  const networkIsConnected = useStoreState(
    (state) => state.network.isConnected,
  );
  const saveWithdraw = useStoreActions(
    (actions) => actions.withdrawalAddress.createWithdraw,
  );
  const resetWithdraw = useStoreActions(
    (actions) => actions.withdrawalAddress.reset,
  );
  const setWithdrawAward = useStoreActions(
    (actions) => actions.challenge.setWithdrawAward,
  );
  const setCategorySelected = useStoreActions(
    (actions) => actions.challenge.setCategorySelected,
  );
  const categorySelected = useStoreState(
    (actions) => actions.challenge.categorySelected,
  );
  const scrollView = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(true);
  const paidAwards = useRef<ChallengeAwards[]>();
  const freeAwards = useRef<ChallengeAwards[]>();

  const subscribedDate = useRef('');
  const userWinner = useRef<UserChallenges>();
  const user_challenge_id = useRef('');
  const [myInitialClaps, setMyInitialClaps] = useState(0);
  const [modalState, setModalState] = useState<boolean>(false);
  const [userHasSubscribed, setUserHasSubscribed] =
    useRecoilState<boolean>(userIsSubscribed);
  const [subscriptionID, setSubscriptionID] = useState<string>();
  const [hasFavorite, setHasFavorite] = useState<boolean>(false);
  const [extraordinaryActions, setExtraordinaryActions] =
    useState<UserEventExtraordinaryActionType>();
  const [activeSlide, setActiveSlide] = useState(0);

  const userData = useStoreState((state) => state.userInfoCompiled.payload);
  const userinfo = useStoreState((state) => state.profile.payload);
  const { profileID, userID } = useUserToken();
  const setUserIsSubscribed = useStoreActions(
    (actions) => actions.challenge.setUserHasSubscribed,
  );

  function handleWithSubscribedState(state: boolean) {
    setUserHasSubscribed(state);
  }

  const { hasClickedOnSubscribe, subscribe } = useSubscribeUserInChallenge(
    profileID,
    userData,
    navigation,
    handleWithSubscribedState,
    data,
    setModalState,
    modalizeRef,
  );

  const setWithdrawDate = useStoreActions(
    (actions) => actions.challenge.setWithdrawDate,
  );
  const [userChallenges, setUserChallenges] =
    useState<GetSubscriptionProgressQuery>();
  const [fetchProgress, { loading: loadingActivities }] =
    useGetSubscriptionProgressLazyQuery({
      onCompleted: (e) => {
        handleRealmSaveSubscription(e);
        if (!userChallenges) {
          setUserChallenges(e);
          setLoading(false);
        }
      },
      onError: (e) => {
        console.log('error: ', e);
        setLoading(false);
      },
    });

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    if (subscription) {
      setUserChallenges(subscription);
      setLoading(false);
    }
  }, [subscription]);

  useEffect(() => {
    if (
      userHasSubscribed !== undefined &&
      userHasSubscribed &&
      networkIsConnected &&
      subscriptionID
    ) {
      fetchProgress({
        variables: {
          data: {
            user_id: userID,
            challenge_id,
            user_challenge_id: subscriptionID,
          },
        },
      });
    } else if (
      !loadingActivities &&
      userHasSubscribed !== undefined &&
      networkIsConnected
    ) {
      setLoading(false);
    }
    if (!networkIsConnected && userHasSubscribed !== undefined) {
      setLoading(false);
    }
  }, [userHasSubscribed]);

  function handleNavigation(props) {
    navigation.push('Challenge.StatsAndHighlights', {
      ...props,
    });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleNavigationDebounce = useCallback(
    throttle(handleNavigation, 1000, { trailing: false }),
    [],
  );

  const [unsubscribeUserChallengeMutation] =
    useUnsubscribeUserChallengeMutation();
  const [addFavoriteChallegeMutation] = useAddFavoriteChallegeMutation();
  const [deleteFavoriteChallengeMutation] =
    useDeleteFavoriteChallengeMutation();

  useEffect(() => {
    if (
      data?.getChallengeDetail.claps &&
      data?.getChallengeDetail.claps?.length > 0
    ) {
      const filteredClaps = data?.getChallengeDetail.claps.filter(
        (claps) => claps.profile_id === profileID,
      );
      if (filteredClaps && filteredClaps.length > 0) {
        setMyInitialClaps(filteredClaps[0].count);
      }
    }
  }, [data, profileID]);

  const handleUnsubscribeUser = useCallback(() => {
    Alert.alert(
      'Desinscrever-se',
      `Tem certeza que deseja sair do desafio ${data?.getChallengeDetail.name}`,
      [
        {
          text: 'Sim, tenho certeza!',
          onPress: async () => {
            setUserIsSubscribed(false);
            setUserHasSubscribed(false);
            await unsubscribeUserChallengeMutation({
              variables: {
                challenge_id: data?.getChallengeDetail.id,
                profile_id: profileID,
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
  }, [
    data?.getChallengeDetail.id,
    data?.getChallengeDetail.name,
    profileID,
    unsubscribeUserChallengeMutation,
  ]);

  const shareChallenge = useCallback(async () => {
    await handleShareChallenge(data);
  }, [data]);

  useEffect(() => {
    if (data?.getChallengeDetail && userID.length > 0) {
      const userExtraordinaryActions =
        data?.getChallengeDetail.user_extraordinary_actions?.filter(
          (el) => el.user_id === userID,
        );
      if (userExtraordinaryActions && userExtraordinaryActions.length > 0) {
        setExtraordinaryActions(userExtraordinaryActions[0]);
      }
      const userSubscribed = data?.getChallengeDetail.user_challenges.filter(
        (user) => user.user_id === userID,
      );

      const userWinnerFiltered = data?.getChallengeDetail.winners?.filter(
        (winner) => winner.user.id === userID,
      );
      if (userWinnerFiltered.length > 0) {
        userWinner.current = userWinnerFiltered[0];
      }
      if (userSubscribed.length < 1) {
        setUserIsSubscribed(false);
        setUserIsSubscribed(false);
        setUserHasSubscribed(false);
      } else {
        user_challenge_id.current = userSubscribed[0].id;
        handleGetLocalSubscription(userSubscribed[0].id);
        subscribedDate.current = userSubscribed[0].registration_date; // TODO: change this;
        setSubscriptionID(userSubscribed[0].id);
        setUserHasSubscribed(true);
        setUserIsSubscribed(true);
      }
      setHasFavorite(data?.getChallengeDetail.isFavorite);
    }
  }, [data, userID]);

  useEffect(() => {
    if (data?.getChallengeDetail.awards) {
      const freeAwardsFiltered = data.getChallengeDetail.awards.filter(
        (el) => el.only_for_draw,
      );
      if (freeAwardsFiltered) {
        freeAwards.current = freeAwardsFiltered;
      }

      const paidAwardsFiltered = data.getChallengeDetail.awards.filter(
        (el) => !el.only_for_draw && !el.only_award,
      );
      if (paidAwardsFiltered) {
        paidAwards.current = paidAwardsFiltered;
      }
    }
    if (
      data.getChallengeDetail.user_challenges &&
      data.getChallengeDetail.user_challenges.length > 0
    ) {
      // data.getChallengeDetail.challenge_categories.filter((category) => category.id === )
      if (data.getChallengeDetail.user_challenges[0].withdrawal_date) {
        setWithdrawDate(
          format(
            new Date(
              data.getChallengeDetail.user_challenges[0].withdrawal_date,
            ),
            "dd'/'MM'/'yyyy",
          ),
        );
      }

      setCategorySelected(
        data.getChallengeDetail.user_challenges[0].category?.id,
      );
    }
  }, [data]);

  const handleFavorite = async () => {
    if (!hasFavorite) {
      setHasFavorite(true);
      await addFavoriteChallegeMutation({
        variables: {
          data: {
            challenge_id: data?.getChallengeDetail.id!,
            profile_id: profileID,
          },
        },
      });
    } else {
      setHasFavorite(false);
      await deleteFavoriteChallengeMutation({
        variables: {
          data: {
            challenge_id: data?.getChallengeDetail.id!,
            profile_id: profileID,
          },
        },
      });
    }
  };

  if (loading) {
    return <LoadingChallenge navigation={navigation} />;
  }

  return (
    <>
      <Styled.SafeAreaView>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <Styled.Gradient
          colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.5)', 'transparent']}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              resetWithdraw();
              setWithdrawAward(false);
              setUserIsSubscribed(false);
              setCategorySelected();
            }}
          >
            <Styled.ActionButtonLeft>
              <Icons name="arrow-left" width={18} />
            </Styled.ActionButtonLeft>
          </TouchableOpacity>

          <Styled.Title />

          <TouchableOpacity onPress={() => shareChallenge()}>
            <Styled.ActionButtonRight>
              <Icons name="share" height={18} />
            </Styled.ActionButtonRight>
          </TouchableOpacity>
        </Styled.Gradient>

        <Styled.Container
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          ref={scrollView}
        >
          <HeaderComponent
            data={data}
            navigation={navigation}
            onSnapToItem={(index) => setActiveSlide(index)}
            activeSlide={activeSlide}
            shareChallenge={shareChallenge}
            challengeDetail={data?.getChallengeDetail}
            myInitialClaps={myInitialClaps}
            handleFavorite={handleFavorite}
            onPress={() =>
              navigation.push('Challenge.Comments', {
                challenge_id,
              })
            }
            onPress1={() => handleFavorite()}
            hasFavorite={hasFavorite}
          />

          {data.getChallengeDetail.physical_event &&
          data.getChallengeDetail.user_challenges &&
          data.getChallengeDetail.user_challenges.length > 0 ? (
            <MySubscriptionInformation
              user_challenges={data.getChallengeDetail.user_challenges[0]}
              navigation={navigation}
              data={data}
              hasSubscribed={userHasSubscribed}
              saveWithdraw={saveWithdraw}
              subscribe={subscribe}
              userinfo={userinfo}
              categorySelected={categorySelected}
            />
          ) : null}

          {/* {(data.getChallengeDetail.physical_event && */}
          {/*  isFuture(new Date(data.getChallengeDetail.end_date)) && */}
          {/*  isPast(new Date(data.getChallengeDetail.start_date))) || */}
          {/* userinfo?.getProfile.user.staff ? ( */}
          {/*  <TouchableOpacity */}
          {/*    onPress={() => { */}
          {/*      navigation.navigate('Challenge.Administration', { */}
          {/*        screen: 'Challenge.Administration.ListUsersInEventPoints', */}
          {/*        params: { */}
          {/*          challenge_id: data.getChallengeDetail.id, */}
          {/*          rootNavigation: navigation, */}
          {/*          data, */}
          {/*        }, */}
          {/*      }); */}
          {/*    }} */}
          {/*  > */}
          {/*    <BoxContainer */}
          {/*      mt={15} */}
          {/*      flexDirection="row" */}
          {/*      alignItems="center" */}
          {/*      justifyContent="space-between" */}
          {/*      paddingRight={15} */}
          {/*    > */}
          {/*      <Box flexDirection="row" alignItems="center"> */}
          {/*        <LottieView */}
          {/*          source={require('~/assets/animation/live.json')} */}
          {/*          autoPlay */}
          {/*          loop */}
          {/*          style={{ height: 48 }} */}
          {/*        /> */}
          {/*        <Box */}
          {/*          style={{ */}
          {/*            flexDirection: 'row', */}
          {/*            alignItems: 'center', */}
          {/*            justifyContent: 'space-between', */}
          {/*          }} */}
          {/*        > */}
          {/*          <Typography>Acompanhar evento em tempo real</Typography> */}
          {/*        </Box> */}
          {/*      </Box> */}
          {/*      <Icons name="chevron-right" /> */}
          {/*    </BoxContainer> */}
          {/*  </TouchableOpacity> */}
          {/* ) : null} */}

          <ChallengeNameComponent
            challengeDetail={data?.getChallengeDetail}
            onPress={getOnPressChallengeName(
              data,
              handleNavigationDebounce,
              challenge_id,
              userChallenges,
              subscribedDate,
            )}
            scrollView={scrollView}
            navigation={navigation}
          />

          <FreemiumCall data={data} modalizeRef={modalizeRef} />

          {userWinner.current && (
            <WinnerComponent
              key="winner"
              award_image={userWinner.current.award?.awardsImages[0].link}
              challenge_name={data?.getChallengeDetail.name}
              winner={userWinner.current}
              navigation={navigation}
            />
          )}

          {userHasSubscribed &&
            isPast(new Date(data?.getChallengeDetail.end_date)) && (
              <Box pt={2} px={3}>
                <BoxContainer
                  py={3}
                  alignItems="center"
                  color="rgba(255, 37, 37, 0.56)"
                >
                  <Text style={{ color: 'white' }}>Este desafio está</Text>
                  <Text style={{ fontSize: 20, color: 'white' }}>
                    Encerrado
                  </Text>
                </BoxContainer>
              </Box>
            )}

          {userHasSubscribed && (
            <>
              {data?.getChallengeDetail.summary.count_subscribe >= 0 && (
                <MyClassification
                  count_subscribe={
                    data?.getChallengeDetail.summary.count_subscribe ?? 0
                  }
                  classification={
                    userChallenges?.getSubscriptionProgress.classification
                  }
                  isCompleted={isPast(
                    new Date(data.getChallengeDetail.end_date),
                  )}
                  onPress={getOnPressClassification(
                    data,
                    handleNavigationDebounce,
                    challenge_id,
                    userChallenges,
                    subscribedDate,
                  )}
                />
              )}

              <ProgressBar
                data={data}
                subscriptionID={subscriptionID}
                userChallenges={userChallenges}
                challenge_id={data.getChallengeDetail.id}
                endDate={data?.getChallengeDetail.end_date}
                navigation={navigation}
                type={data?.getChallengeDetail.challenge_type}
                has_categories={data.getChallengeDetail.has_categories}
                goal_max_altimetry={
                  data.getChallengeDetail.has_categories
                    ? data.getChallengeDetail.challenge_categories[
                        data.getChallengeDetail.challenge_categories.findIndex(
                          (el) => el.id === categorySelected,
                        )
                      ]
                      ? data.getChallengeDetail.challenge_categories[
                          data.getChallengeDetail.challenge_categories.findIndex(
                            (el) => el.id === categorySelected,
                          )
                        ]?.category_configuration?.max_altimetry_goal_value
                      : 0
                    : data.getChallengeDetail.configuration
                        ?.max_altimetry_goal_value
                }
                goal_altimetry={
                  data.getChallengeDetail.has_categories
                    ? data.getChallengeDetail.challenge_categories[
                        data.getChallengeDetail.challenge_categories.findIndex(
                          (el) => el.id === categorySelected,
                        )
                      ]
                      ? data.getChallengeDetail.challenge_categories[
                          data.getChallengeDetail.challenge_categories.findIndex(
                            (el) => el.id === categorySelected,
                          )
                        ]?.category_configuration?.altimetry_goal_value
                      : 0
                    : data.getChallengeDetail.configuration
                        ?.altimetry_goal_value
                }
                goal_max_distance={
                  data.getChallengeDetail.has_categories
                    ? data.getChallengeDetail.challenge_categories[
                        data.getChallengeDetail.challenge_categories.findIndex(
                          (el) => el.id === categorySelected,
                        )
                      ]?.category_configuration?.max_distance_goal_value
                    : data.getChallengeDetail.configuration
                        ?.max_distance_goal_value
                }
                goal_distance={
                  data.getChallengeDetail.has_categories
                    ? data.getChallengeDetail.challenge_categories[
                        data.getChallengeDetail.challenge_categories.findIndex(
                          (el) => el.id === categorySelected,
                        )
                      ]?.category_configuration?.distance_goal_value
                    : data.getChallengeDetail.configuration?.distance_goal_value
                }
                goal_max_time={
                  data.getChallengeDetail.has_categories
                    ? data.getChallengeDetail.challenge_categories[
                        data.getChallengeDetail.challenge_categories.findIndex(
                          (el) => el.id === categorySelected,
                        )
                      ]?.category_configuration?.maximum_time_goal_value
                    : data.getChallengeDetail.configuration?.max_time_goal_value
                }
                goal_min_time={
                  data.getChallengeDetail.has_categories
                    ? data.getChallengeDetail.challenge_categories[
                        data.getChallengeDetail.challenge_categories.findIndex(
                          (el) => el.id === categorySelected,
                        )
                      ]?.category_configuration?.minimum_time_goal_value
                    : data.getChallengeDetail.configuration?.min_time_goal_value
                }
              />
            </>
          )}

          {data?.getChallengeDetail.winners &&
            data?.getChallengeDetail.winners.length > 0 && (
              <WinnersShowcase
                navigation={navigation}
                winners={data?.getChallengeDetail.winners}
                challenge_id={data.getChallengeDetail.id}
                isCreator={data.getChallengeDetail.creator_id === userID}
              />
            )}

          {!data?.getChallengeDetail.physical_event &&
            !data.getChallengeDetail.has_categories && (
              <Goals
                maxTimeGoalValue={
                  data?.getChallengeDetail.configuration?.max_time_goal_value
                }
                minTimeGoalValue={
                  data?.getChallengeDetail.configuration?.min_time_goal_value
                }
                altimetryGoalValue={
                  data?.getChallengeDetail.configuration?.altimetry_goal_value
                }
                maxAltimetryGoalValue={
                  data?.getChallengeDetail.configuration
                    ?.max_altimetry_goal_value
                }
                maxDistanceGoalValue={
                  data?.getChallengeDetail.configuration
                    ?.max_distance_goal_value
                }
                distanceGoalValue={
                  data?.getChallengeDetail.configuration?.distance_goal_value
                }
                isAccumulation={
                  data?.getChallengeDetail.configuration?.accumulation
                }
              />
            )}

          {ContainerDates(data)}

          {data?.getChallengeDetail.end_date_registration &&
            data?.getChallengeDetail.start_date_registration && (
              <ChallengeDates
                title="Inscrição"
                endDate={data?.getChallengeDetail.end_date_registration}
                startDate={data?.getChallengeDetail.start_date_registration}
                isDrawn={false}
                dateForDrawn={data.getChallengeDetail.date_for_drawn}
              />
            )}

          {data?.getChallengeDetail.end_date &&
            data?.getChallengeDetail.start_date && (
              <ChallengeDates
                title="Atividades"
                isActivities
                endDate={data?.getChallengeDetail.end_date}
                startDate={data?.getChallengeDetail.start_date}
                isDrawn={false}
                dateForDrawn={data.getChallengeDetail.date_for_drawn}
              />
            )}

          {data?.getChallengeDetail.date_for_drawn && (
            <ChallengeDates
              title="Sorteio"
              isActivities={false}
              dateForDrawn={data.getChallengeDetail.date_for_drawn}
              endDate={data?.getChallengeDetail.end_date}
              startDate={data?.getChallengeDetail.start_date}
              isDrawn
              style={{ marginTop: 0 }}
            />
          )}

          {data.getChallengeDetail.subscription_prices &&
          data.getChallengeDetail.subscription_prices.length > 0 ? (
            <PriceLot
              data={data}
              subscription_prices={data.getChallengeDetail.subscription_prices}
            />
          ) : null}

          {data.getChallengeDetail.id ===
          '05e43675-e7cb-4361-934a-9712e31405cd' ? (
            <Courses navigation={navigation} />
          ) : null}

          {data.getChallengeDetail.has_categories &&
            data.getChallengeDetail.challenge_categories && (
              <Categories
                navigation={navigation}
                categories={data.getChallengeDetail.challenge_categories}
                selected_category={categorySelected}
                isAccumulation={
                  data.getChallengeDetail.configuration?.accumulation
                }
                data={data}
                canViewChangeButton={
                  userinfo?.getProfile.user.staff ||
                  (userHasSubscribed &&
                    data.getChallengeDetail.has_categories &&
                    !isPast(
                      new Date(data.getChallengeDetail.end_date_registration),
                    ) &&
                    !isFuture(
                      new Date(data.getChallengeDetail.start_date_registration),
                    ) &&
                    !isPast(
                      new Date(
                        data.getChallengeDetail.configuration?.deadline_category_change,
                      ),
                    ) &&
                    data.getChallengeDetail.configuration
                      ?.allows_category_change)
                }
              />
            )}

          {paidAwards.current &&
          paidAwards.current.length > 0 &&
          data.getChallengeDetail.id !==
            'dfaa0412-9877-4bfa-9b02-f8259e3a5797' ? (
            <KitsShowcase
              navigation={navigation}
              awards={paidAwards.current}
              isPhysical={data?.getChallengeDetail.physical_event}
              subscribe={subscribe}
              hasClickedOnSubscribe={hasClickedOnSubscribe}
              isPaid={data?.getChallengeDetail!.configuration!.is_paid}
              showSubscribe={
                !userHasSubscribed &&
                !isFuture(
                  addHours(
                    new Date(data?.getChallengeDetail.start_date_registration),
                    0,
                  ),
                ) &&
                !isPast(
                  addHours(
                    new Date(data?.getChallengeDetail.end_date_registration),
                    0,
                  ),
                )
              }
            />
          ) : null}

          {data.getChallengeDetail.products &&
          data.getChallengeDetail.products.filter((el) => !el.only_award)
            .length > 0 ? (
            <ProductsShowcase
              products={data.getChallengeDetail.products.filter(
                (el) => !el.only_award,
              )}
              navigation={navigation}
              isPhysical={data?.getChallengeDetail.physical_event}
              subscribe={subscribe}
              hasClickedOnSubscribe={hasClickedOnSubscribe}
              extraordinaryActions={extraordinaryActions}
              data={data}
              isPaid={data?.getChallengeDetail!.configuration!.is_paid}
              showBuyMore={
                userHasSubscribed &&
                !isFuture(
                  addHours(
                    new Date(data?.getChallengeDetail.start_date_registration),
                    0,
                  ),
                ) &&
                !isPast(
                  addHours(
                    new Date(data?.getChallengeDetail.end_date_registration),
                    0,
                  ),
                )
              }
              showSubscribe={
                !userHasSubscribed &&
                !isFuture(
                  addHours(
                    new Date(data?.getChallengeDetail.start_date_registration),
                    0,
                  ),
                ) &&
                !isPast(
                  addHours(
                    new Date(data?.getChallengeDetail.end_date_registration),
                    0,
                  ),
                )
              }
            />
          ) : null}

          {freeAwards.current && freeAwards.current.length > 0 && (
            <DrawingShowcase
              isPhysical={data?.getChallengeDetail.physical_event}
              navigation={navigation}
              awards={freeAwards.current}
              subscribe={subscribe}
              hasClickedOnSubscribe={hasClickedOnSubscribe}
              isPaid={data?.getChallengeDetail!.configuration!.is_paid}
              showSubscribe={
                !userHasSubscribed &&
                !isFuture(
                  addHours(
                    new Date(data?.getChallengeDetail.start_date_registration),
                    0,
                  ),
                ) &&
                !isPast(
                  addHours(
                    new Date(data?.getChallengeDetail.end_date_registration),
                    0,
                  ),
                )
              }
            />
          )}

          <BottomOptionsComponent
            navigation={navigation}
            challengeDetail={data}
            hasSubscribed={userHasSubscribed}
            userChallenges={userChallenges}
            companyUsers={companyUsers}
            saveWithdraw={saveWithdraw}
            subscribe={subscribe}
            userinfo={userinfo}
            categorySelected={categorySelected}
          />

          <Styled.BoxContainer
            style={{ paddingHorizontal: 16, marginTop: 33, marginBottom: 53 }}
          >
            {((userinfo && userinfo.getProfile.user.staff) ||
              (!data?.getChallengeDetail.physical_event &&
                userHasSubscribed &&
                !isPast(new Date(data?.getChallengeDetail.end_date)))) && (
              <Styled.BottomOptionsContainer
                lastOption
                style={{ justifyContent: 'flex-start' }}
                onPress={() => handleUnsubscribeUser()}
              >
                <Icons name="logout" color="#FF2525" />
                <Styled.ParagraphText
                  color="#FF2525"
                  style={{ marginLeft: 12 }}
                >
                  Desinscrever-se
                  {userinfo?.getProfile.user?.staff && ' (STAFF)'}
                </Styled.ParagraphText>
              </Styled.BottomOptionsContainer>
            )}
          </Styled.BoxContainer>
        </Styled.Container>

        {((userinfo?.getProfile.user?.staff && !userHasSubscribed) ||
          (!userHasSubscribed &&
            !isFuture(
              addHours(
                new Date(data?.getChallengeDetail.start_date_registration),
                0,
              ),
            ) &&
            !isPast(
              addHours(
                new Date(data?.getChallengeDetail.end_date_registration),
                0,
              ),
            )) ||
          (!userHasSubscribed &&
            extraordinaryActions?.buy_after_registration_closes &&
            isFuture(new Date(data.getChallengeDetail.end_date)))) && (
          <Styled.SubscribeContainer>
            <Button
              isFreeSub={extraordinaryActions?.bonus_subscription}
              disabled={hasClickedOnSubscribe}
              name={
                data?.getChallengeDetail.configuration &&
                data?.getChallengeDetail.configuration.is_paid
                  ? extraordinaryActions?.bonus_subscription
                    ? 'Inscrever-se (Bonificado)'
                    : 'Inscrever-se'
                  : 'Inscrever-se Gratuitamente'
              }
              loading={hasClickedOnSubscribe}
              style={{ marginTop: 0 }}
              onPress={() =>
                subscribe(undefined, undefined, extraordinaryActions)
              }
            />
          </Styled.SubscribeContainer>
        )}

        <FreemiumCallModal
          canShowModal={
            !data.getChallengeDetail.configuration?.is_paid &&
            data.getChallengeDetail.user_challenges &&
            data.getChallengeDetail.user_challenges.length > 0 &&
            data.getChallengeDetail.user_challenges[0].completed &&
            !data.getChallengeDetail.user_challenges[0].paid
          }
          data={data}
          navigation={navigation}
        />
      </Styled.SafeAreaView>

      {data && (
        <BuyModal
          setModalState={setModalState}
          modalState={modalState}
          navigation={navigation}
          data={data}
          extraordinaryActions={extraordinaryActions}
        />
      )}

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        // alwaysOpen={heightPercentageToDP('80')}
        modalStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          backgroundColor: 'transparent',
        }}
        rootStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <ModalizeComponent
          data={data}
          navigation={navigation}
          modalizeRef={modalizeRef}
          extraordinaryActions={extraordinaryActions}
        />
      </Modalize>
    </>
  );
}

export default Detailed;
