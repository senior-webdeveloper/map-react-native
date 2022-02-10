import { StackNavigationProp } from '@react-navigation/stack';
import { StringValueNode } from 'graphql';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { isFuture, isPast } from 'date-fns';
import { compact } from 'lodash';
import { useSubscribeUserChallengeMutation } from '~/graphql/autogenerate/hooks';
import {
  GetChallengeDetailQuery,
  GetUserDataCompiledQuery,
} from '~/graphql/autogenerate/operations';
import { RootStackParamList } from '~/routes.types';
import { useStoreActions } from '~/store';
import { UserEventExtraordinaryActionType } from '~/graphql/autogenerate/schemas';
import { useAddSubscriptionKit } from '~/hooks/index';

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

export function useSubscribeUserInChallenge(
  profileID: string,
  userData: GetUserDataCompiledQuery,
  navigation: ChallengeDescriptionNavigationProp,
  setHasSubscribed: React.Dispatch<React.SetStateAction<boolean>>,
  data: GetChallengeDetailQuery,
  setModalState: React.Dispatch<React.SetStateAction<boolean>>,
  modalizeRef?: any,
): {
  subscribe: (
    product_id?: string,
    selected_award_index?: string,
    extraordinaryActions?: UserEventExtraordinaryActionType,
  ) => Promise<void>;
  hasClickedOnSubscribe: boolean;
} {
  const addSubscriptionPrice = useAddSubscriptionKit();

  const setHasTouchedOnSubscribe = useStoreActions(
    (actions) => actions.challenge.setHasClickedOnSubscribe,
  );
  const setUserIsSubscribed = useStoreActions(
    (actions) => actions.challenge.setUserHasSubscribed,
  );

  const cleanChart = useStoreActions((actions) => actions.chart.cleanChart);
  const addProductToChart = useStoreActions(
    (actions) => actions.chart.addProduct,
  );
  const setFirstElementId = useStoreActions(
    (actions) => actions.chart.setFirstElementId,
  );

  const [hasClickedOnSubscribe, setHasClickedOnSubscribe] =
    useState<boolean>(false);
  const [subscribeUserChallengeMutation] = useSubscribeUserChallengeMutation({
    onError: (e) => {
      Alert.alert('Erro', e.message);
      setHasTouchedOnSubscribe(false);
      setHasClickedOnSubscribe(false);
      setHasSubscribed(false);
      setUserIsSubscribed(false);
    },
    onCompleted: () => {
      setUserIsSubscribed(true);
      setHasTouchedOnSubscribe(false);
      setHasClickedOnSubscribe(false);

      navigation.push('Challenge.SubscribedWithoutMonitors', {
        challenge_type: data?.getChallengeDetail.challenge_type,
        challenge_id: data.getChallengeDetail.id,
        end_date: data.getChallengeDetail.end_date,
        start_date: data.getChallengeDetail.start_date,
      });

      setHasSubscribed(true);
    },
  });

  const subscribe = useCallback(
    async (
      product_id?: string,
      selected_award_index?: string,
      extraordinaryActions?: UserEventExtraordinaryActionType,
    ): Promise<void> => {
      setFirstElementId(product_id);
      if (data?.getChallengeDetail.configuration?.is_paid) {
        if (data.getChallengeDetail.physical_event) {
          const teste = data.getChallengeDetail.subscription_prices.map(
            (el, index) => {
              if (isPast(new Date(el.date_initial))) {
                if (data.getChallengeDetail.subscription_prices[index + 1]) {
                  if (
                    isFuture(
                      new Date(
                        data.getChallengeDetail.subscription_prices[
                          index + 1
                        ].date_initial,
                      ),
                    )
                  ) {
                    return el.value;
                  }
                } else {
                  return el.value;
                }
              }
            },
          );
          const value = compact(teste)[0];

          if (extraordinaryActions) {
            if (selected_award_index) {
              addSubscriptionPrice({
                price: extraordinaryActions.bonus_subscription
                  ? 0
                  : value ||
                    data.getChallengeDetail.awards[selected_award_index].price,
                name: data?.getChallengeDetail.awards[selected_award_index]
                  .name,
                index: selected_award_index,
                product_id:
                  data?.getChallengeDetail.awards[selected_award_index].id,
              });
            } else {
              addSubscriptionPrice({
                price: extraordinaryActions.bonus_subscription
                  ? 0
                  : value || data.getChallengeDetail.awards[0].price,
                name: data?.getChallengeDetail.awards[0].name,
                index: 0,
                product_id: data?.getChallengeDetail.awards[0].id,
              });
            }
          } else if (selected_award_index) {
            addSubscriptionPrice({
              price:
                value ||
                data.getChallengeDetail.awards[selected_award_index].price,
              name: data?.getChallengeDetail.awards[selected_award_index].name,
              index: selected_award_index,
              product_id:
                data?.getChallengeDetail.awards[selected_award_index].id,
            });
          } else {
            addSubscriptionPrice({
              price: value || data.getChallengeDetail.awards[0].price,
              name: data?.getChallengeDetail.awards[0].name,
              index: 0,
              product_id: data?.getChallengeDetail.awards[0].id,
            });
          }

          setModalState((prevState) => !prevState);
        } else {
          const hasPaidKit = data.getChallengeDetail.awards?.findIndex(
            (el) => el.price && el.price > 0,
          );

          console.log('caiu aqui ein', hasPaidKit);

          if (hasPaidKit !== -1) {
            modalizeRef.current.open();
          }
          // do something
        }
      } else {
        const hasPaidKit = data.getChallengeDetail.awards?.findIndex(
          (el) => el.price && el.price > 0,
        );

        if (hasPaidKit !== -1) {
          modalizeRef.current.open();
        } else {
          setHasTouchedOnSubscribe(true);
          setHasClickedOnSubscribe(true);

          await subscribeUserChallengeMutation({
            variables: {
              data: {
                challenge_id: data?.getChallengeDetail.id,
                registration_date: new Date(),
                profile_id: profileID,
              },
            },
          });
          await analytics().logEvent('subscribe_free_challenge', {
            challenge_id: data?.getChallengeDetail.id,
            profile_id: profileID,
          });
        }
      }
    },
    [profileID, userData],
  );

  return {
    subscribe,
    hasClickedOnSubscribe,
  };
}
