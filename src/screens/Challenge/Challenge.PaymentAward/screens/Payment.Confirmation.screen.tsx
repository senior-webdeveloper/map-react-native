import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHTML from 'react-native-render-html';
import {
  CommonActions,
  RouteProp,
  useNavigationState,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import styled from 'styled-components/native';
import { captureException } from '@sentry/react-native';
import { compact } from 'lodash';
import { useRecoilValue } from 'recoil';
import { ApolloError } from '@apollo/client/errors';
import { ChallengeAwardAdditionalRequestInput } from '~/graphql/autogenerate/schemas';
import { Icons, Text, TitleText } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import {
  useSubscribeUserChallengeMutation,
  useBuyAwardUserAlreadySubscribedMutation,
} from '~/graphql/autogenerate/hooks';
import { useStoreActions, useStoreState } from '~/store';
import { useUserToken } from '~/hooks';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import CheckBox from '~/components/Checkbox';
import { CurrencyText } from '~/screens/Challenge/Challenge.Description/components/BuyModal/styles';
import { cartStatus as _cartStatus } from '~/recoil/selectors';
import { cartState, subscriptionPrice } from '~/recoil/atoms';
import { userIsSubscribed } from '~/screens/Challenge/Challenge.Description/components/MainScreen';
import { PhysicalEventComponent } from '~/screens/Challenge/Challenge.PaymentAward/components/PhysicalEventComponent';
import { selectedAwardAtom } from '~/screens/Challenge/Challenge.Description/components/ModalizeComponent';
import { isBuyingAfterCompleted } from '~/screens/Challenge/Challenge.Description/components/MainScreen/components/FreemiumCallModal';

export const OptionImage = styled(FastImage)``;
export const Link = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  color: ${({ theme }) => theme.colors.blue};
  font-size: 16px;
  line-height: 20px;
`;

type ChallengeDescriptionRouteProp = RouteProp<
  PaymentAwardRootParamList,
  'confirmation'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  PaymentAwardRootParamList,
  'confirmation'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export default function Confirmation({
  route,
  navigation,
}: Props): JSX.Element {
  const awardSelected = useRecoilValue(selectedAwardAtom);
  const userIsBuiyngAfterCompleted = useRecoilValue(isBuyingAfterCompleted);
  const state = useNavigationState((state) => state);
  const userHasSubscribed = useRecoilValue(userIsSubscribed);
  const cart = useRecoilValue(cartState);
  const cartStatus = useRecoilValue(_cartStatus);
  const [productsList] = useState(compact(cart));
  const subPrice = useRecoilValue(subscriptionPrice);
  const { data, payment_method, selected_card, award_index, installments } =
    route.params;
  const ERROR_PRODUCT_UNAVAILABLE =
    'A quantidade pedida não está mais disponível!';
  const [hasAccepted, setHasAccepted] = useState(
    !data.getChallengeDetail.physical_event,
  );
  const { profileID: profile_id, userinfo } = useUserToken();
  const userProfile = useStoreState(({ profile }) => profile.payload);
  const totalAddonPrice = useStoreState(
    (actions) => actions.chart.totalAddonPrice,
  );
  const chart = useStoreState((state) => state.chart.payload);

  const selectedAwards = useStoreState((state) => state.chart.selectedAwards);
  const storeAditionalRequests = useStoreState(
    (actions) => actions.chart.aditionalRequests,
  );
  const setIsOnPurchase = useStoreActions(
    (actions) => actions.chart.setIsOnPurchase,
  );
  const selectedProducts = useStoreState(
    (state) => state.chart.selectedProducts,
  );

  const onError = (e: ApolloError) => {
    console.log('|ERROR| ', e);
    if (e.message === ERROR_PRODUCT_UNAVAILABLE) {
      route.params.rootNavigation.reset({
        index: 2,
        routes: [
          {
            name: 'Home',
            params: { accepted_initial_screen: true },
          },
          {
            name: 'Challenge.Description',
            params: {
              challenge_id: route.params.data.getChallengeDetail.id,
            },
          },
          {
            name: 'Challenge.SuccessPayment',
            params: {
              error_in_payment: true,
              challenge_id: route.params.data.getChallengeDetail.id,
              award: data?.getChallengeDetail.awards[award_index],
            },
          },
        ],
      });
    }

    captureException(e);
    if (userinfo && userinfo.staff && e.message !== ERROR_PRODUCT_UNAVAILABLE) {
      Alert.alert('Erro', e.message);
    }
  };

  const onCompleteSucess = (e) => {
    console.log('|SUCCESS| ', e);
    setIsOnPurchase(false);
    // route.params.rootNavigation.replace('Challenge.SuccessPayment', {
    //   error_in_payment: false,
    //   payment_id: e.subscribeUserChallenge.payment_id,
    //   challenge_id: route.params.data.getChallengeDetail.id,
    //   award: data?.getChallengeDetail.awards[award_index],
    // });

    if (e.subscribeUserChallenge) {
      route.params.rootNavigation.navigate('Challenge.SuccessPayment', {
        error_in_payment: false,
        payment_id: e.subscribeUserChallenge.payment_id,
        challenge_id: route.params.data.getChallengeDetail.id,
      });
      route.params.rootNavigation.dispatch(
        CommonActions.reset({
          index: 2,
          routeNames: [
            'Home',
            'Challenge.Description',
            'Challenge.SuccessPayment',
          ],
          routes: [
            { name: 'Home', params: { accepted_initial_screen: true } },
            {
              name: 'Challenge.Description',
              params: {
                challenge_id: route.params.data.getChallengeDetail.id,
              },
            },
            {
              name: 'Challenge.SuccessPayment',
              params: {
                error_in_payment: false,
                payment_id: e.subscribeUserChallenge.payment_id,
                challenge_id: route.params.data.getChallengeDetail.id,
              },
            },
          ],
        }),
      );
    } else {
      route.params.rootNavigation.navigate('Challenge.SuccessPayment', {
        error_in_payment: false,
        payment_id: e.buyAwardUserAlreadySubscribed.payment_id,
        challenge_id: route.params.data.getChallengeDetail.id,
      });
      route.params.rootNavigation.dispatch(
        CommonActions.reset({
          index: 2,
          routeNames: [
            'Home',
            'Challenge.Description',
            'Challenge.SuccessPayment',
          ],
          routes: [
            { name: 'Home', params: { accepted_initial_screen: true } },
            {
              name: 'Challenge.Description',
              params: {
                challenge_id: route.params.data.getChallengeDetail.id,
              },
            },
            {
              name: 'Challenge.SuccessPayment',
              params: {
                error_in_payment: false,
                payment_id: e.buyAwardUserAlreadySubscribed.payment_id,
                challenge_id: route.params.data.getChallengeDetail.id,
              },
            },
          ],
        }),
      );
    }

    // navigation.dispatch(
    //   StackActions.push('Challenge.SuccessPayment', {
    //     error_in_payment: false,
    //     payment_id: e.subscribeUserChallenge.payment_id,
    //     challenge_id: route.params.data.getChallengeDetail.id,
    //     award: route.params.data?.getChallengeDetail.awards[award_index],
    //   }),
    // );

    // navigation.dispatch(StackActions.pop(state.routeNames.length + 1));
    // route.params.rootNavigation.replace();
    // route.params.rootNavigation.pop();
  };

  const [loading, setLoading] = useState<boolean>();

  const [subscribeUserChallengeMutation, { loading: loading1 }] =
    useSubscribeUserChallengeMutation();

  const [buyAwardUserAlreadySubscribedMutation, { loading: loading2 }] =
    useBuyAwardUserAlreadySubscribedMutation();

  useEffect(() => {
    if (userIsBuiyngAfterCompleted) {
      setLoading(loading2);
    } else {
      setLoading(loading1);
    }
  }, [loading1, loading2]);

  const paySubscription = async (award_id): Promise<void> => {
    let custom_data = {};
    let challenge_award_requests:
      | undefined
      | ChallengeAwardAdditionalRequestInput[];
    let payment_data = {};

    if (data.getChallengeDetail.id) {
      custom_data = {
        ...custom_data,
        challenge_id: data.getChallengeDetail.id,
        registration_date: new Date(),
        profile_id,
      };
    }
    if (selectedAwards) {
      const challenge_award_requests_filter = selectedAwards.filter(
        (x) => x !== undefined,
      );
      if (challenge_award_requests_filter) {
        challenge_award_requests = challenge_award_requests_filter;
      }
    }
    if (installments && installments.installments_quantity && selected_card) {
      payment_data = {
        ...payment_data,
        installments: String(installments.installments_quantity),
        payment_method, // credit_card | boleto
        external_card_id: selected_card.external_id,
        value_paid: Number(Number(installments.total_amount).toFixed(2)),
        value_without_fee: Number(Number(cartStatus.totalPrice).toFixed(2)),
      };
    } else if (selected_card) {
      payment_data = {
        ...payment_data,
        payment_method, // credit_card | boleto
        external_card_id: selected_card.external_id,
        value_paid: Number(Number(installments.total_amount).toFixed(2)),
        value_without_fee: Number(Number(cartStatus.totalPrice).toFixed(2)),
      };
    } else {
      payment_data = {
        ...payment_data,
        payment_method, // credit_card | boleto
        value_without_fee: Number(Number(cartStatus.totalPrice).toFixed(2)),
        value_paid: Number(Number(cartStatus.totalPrice).toFixed(2)),
      };
    }
    if (
      route.params.data.getChallengeDetail.user_challenges &&
      route.params.data.getChallengeDetail.user_challenges.length > 0 &&
      userHasSubscribed
    ) {
      custom_data = {
        ...custom_data,
        cancel_previous_subscription: true,
      };
    }
    if (route.params.category_id) {
      custom_data = {
        ...custom_data,
        challenge_category_id: route.params.category_id,
      };
    }

    if (route.params.challenge_withdrawal_address_id) {
      custom_data = {
        ...custom_data,
        challenge_withdrawal_address_id:
          route.params.challenge_withdrawal_address_id,
      };
    }

    if (route.params.has_subscription) {
      custom_data = {
        ...custom_data,
        cancel_previous_subscription: route.params.has_subscription,
      };
    }
    if (route.params.extraordinaryActions) {
      if (route.params.extraordinaryActions.bonus_subscription) {
        custom_data = {
          ...custom_data,
          bonus_subscription:
            route.params.extraordinaryActions.bonus_subscription,
        };
      }
    }

    if (productsList) {
      const removedtotalpriceelements = productsList.map((el) => {
        if (award_id) {
          return {
            product_id: el.product_id,
            product_variation_id: el.product_variation_id,
            award_id,
            quantity: el.quantity,
          };
        }
        return {
          product_id: el.product_id,
          product_variation_id: el.product_variation_id,
          quantity: el.quantity,
        };
      });

      if (removedtotalpriceelements.length > 0) {
        if (payment_data.payment_method) {
          console.log('variables: ', {
            data: custom_data,
            award_data: {
              chosen_award_id: award_id,
            },
            payment_data,
            products_purchased: removedtotalpriceelements,
          });
          if (userIsBuiyngAfterCompleted) {
            const { data: response, errors } =
              await buyAwardUserAlreadySubscribedMutation({
                variables: {
                  data: custom_data,
                  award_data: {
                    chosen_award_id: award_id,
                  },
                  payment_data,
                  products_purchased: removedtotalpriceelements,
                },
              });
            if (response?.buyAwardUserAlreadySubscribed) {
              onCompleteSucess(response);
            } else if (errors && errors.length > 0) {
              errors.map((error) => onError(error));
            }
          } else {
            const { data: response, errors } =
              await subscribeUserChallengeMutation({
                variables: {
                  data: custom_data,
                  award_data: {
                    chosen_award_id: award_id,
                  },
                  payment_data,
                  products_purchased: removedtotalpriceelements,
                },
              });
            if (response?.subscribeUserChallenge) {
              onCompleteSucess(response);
            } else if (errors && errors.length > 0) {
              errors.map((error) => onError(error));
            }
          }
        } else {
          console.log('variables: ', {
            data: custom_data,
            award_data: {
              chosen_award_id: award_id,
            },
            products_purchased: removedtotalpriceelements,
          });
          if (userIsBuiyngAfterCompleted) {
            const { data: response, errors } =
              await buyAwardUserAlreadySubscribedMutation({
                variables: {
                  data: custom_data,
                  award_data: {
                    chosen_award_id: award_id,
                  },
                  products_purchased: removedtotalpriceelements,
                },
              });
            if (response?.buyAwardUserAlreadySubscribed) {
              onCompleteSucess(response);
            } else if (errors && errors.length > 0) {
              errors.map((error) => onError(error));
            }
          } else {
            const { data: response, errors } =
              await subscribeUserChallengeMutation({
                variables: {
                  data: custom_data,
                  award_data: {
                    chosen_award_id: award_id,
                  },
                  products_purchased: removedtotalpriceelements,
                },
              });
            if (response?.subscribeUserChallenge) {
              onCompleteSucess(response);
            } else if (errors && errors.length > 0) {
              errors.map((error) => onError(error));
            }
          }
        }
      } else if (payment_data.payment_method) {
        if (userIsBuiyngAfterCompleted) {
          const { data: response, errors } =
            await buyAwardUserAlreadySubscribedMutation({
              variables: {
                data: custom_data,
                award_data: {
                  chosen_award_id: award_id,
                },
                payment_data,
              },
            });
          if (response?.buyAwardUserAlreadySubscribed) {
            onCompleteSucess(response);
          } else if (errors && errors.length > 0) {
            errors.map((error) => onError(error));
          }
        } else {
          const { data: response, errors } =
            await subscribeUserChallengeMutation({
              variables: {
                data: custom_data,
                award_data: {
                  chosen_award_id: award_id,
                },
                payment_data,
              },
            });
          if (response?.subscribeUserChallenge) {
            onCompleteSucess(response);
          } else if (errors && errors.length > 0) {
            errors.map((error) => onError(error));
          }
        }
      } else {
        console.log('variables: ', {
          data: custom_data,
          award_data: {
            chosen_award_id: award_id,
          },
        });
        if (userIsBuiyngAfterCompleted) {
          const { data: response, errors } =
            await buyAwardUserAlreadySubscribedMutation({
              variables: {
                data: custom_data,
                award_data: {
                  chosen_award_id: award_id,
                },
              },
            });
          if (response?.buyAwardUserAlreadySubscribed) {
            onCompleteSucess(response);
          } else if (errors && errors.length > 0) {
            errors.map((error) => onError(error));
          }
        } else {
          const { data: response, errors } =
            await subscribeUserChallengeMutation({
              variables: {
                data: custom_data,
                award_data: {
                  chosen_award_id: award_id,
                },
              },
            });
          if (response?.subscribeUserChallenge) {
            onCompleteSucess(response);
          } else if (errors && errors.length > 0) {
            errors.map((error) => onError(error));
          }
        }
      }
    } else if (payment_data.payment_method) {
      if (userIsBuiyngAfterCompleted) {
        const { data: response, errors } =
          await buyAwardUserAlreadySubscribedMutation({
            variables: {
              data: custom_data,
              award_data: {
                chosen_award_id: award_id,
              },
              payment_data,
            },
          });
        if (response?.buyAwardUserAlreadySubscribed) {
          onCompleteSucess(response);
        } else if (errors && errors.length > 0) {
          errors.map((error) => onError(error));
        }
      } else {
        const { data: response, errors } = await subscribeUserChallengeMutation(
          {
            variables: {
              data: custom_data,
              award_data: {
                chosen_award_id: award_id,
              },
              payment_data,
            },
          },
        );
        if (response?.subscribeUserChallenge) {
          onCompleteSucess(response);
        } else if (errors && errors.length > 0) {
          errors.map((error) => onError(error));
        }
      }
    } else if (userIsBuiyngAfterCompleted) {
      const { data: response, errors } =
        await buyAwardUserAlreadySubscribedMutation({
          variables: {
            data: custom_data,
            award_data: {
              chosen_award_id: award_id,
            },
          },
        });
      if (response?.buyAwardUserAlreadySubscribed) {
        onCompleteSucess(response);
      } else if (errors && errors.length > 0) {
        errors.map((error) => onError(error));
      }
    } else {
      const { data: response, errors } = await subscribeUserChallengeMutation({
        variables: {
          data: custom_data,
          award_data: {
            chosen_award_id: award_id,
          },
        },
      });
      if (response?.subscribeUserChallenge) {
        onCompleteSucess(response);
      } else if (errors && errors.length > 0) {
        errors.map((error) => onError(error));
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFF',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <TitleText style={{ fontSize: 20 }}>Confirme sua inscrição</TitleText>
          <View style={{ width: 20 }} />
        </View>
        <View>
          <View
            style={{
              marginTop: 16,
              backgroundColor: 'rgba(5, 100, 255, 0.03)',
              paddingHorizontal: 16,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              paddingBottom: 50,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                paddingVertical: 24,
                borderBottomWidth: 0.5,
                borderBottomColor: '#161C25',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 16 }}>
                    {
                      data?.getChallengeDetail.awards[
                        data.getChallengeDetail.awards.findIndex(
                          (el) => el.id === awardSelected?.id,
                        )
                      ].name
                    }
                  </Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                }}
              >
                {route.params.extraordinaryActions &&
                route.params.extraordinaryActions.bonus_subscription ? (
                  <CurrencyText>
                    <Text style={{ color: '#009D33' }}>Bonificado</Text>
                  </CurrencyText>
                ) : (
                  <Text style={{ fontSize: 20 }}>
                    R${' '}
                    {!Number.isInteger(
                      data?.getChallengeDetail.awards[
                        data.getChallengeDetail.awards.findIndex(
                          (el) => el.id === awardSelected?.id,
                        )
                      ].price,
                    )
                      ? String(
                          Number(
                            data?.getChallengeDetail.awards[
                              data.getChallengeDetail.awards.findIndex(
                                (el) => el.id === awardSelected.id,
                              )
                            ].price,
                          ).toFixed(2),
                        ).replace('.', ',')
                      : data?.getChallengeDetail.awards[
                          data.getChallengeDetail.awards.findIndex(
                            (el) => el.id === awardSelected.id,
                          )
                        ].price}
                  </Text>
                )}
              </View>
            </View>
            {!route.params.data.getChallengeDetail.physical_event ? (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      width: '75%',
                    }}
                  >
                    <Text style={{ fontSize: 16 }} numberOfLines={1}>
                      Método de envio
                    </Text>
                    {route.params.withdrawAddresse ? (
                      <Text
                        style={{ fontSize: 16, fontFamily: 'NeuzeitGro-Lig' }}
                        numberOfLines={1}
                      >
                        Retirada no local
                      </Text>
                    ) : (
                      <Text
                        style={{ fontSize: 16, fontFamily: 'NeuzeitGro-Lig' }}
                        numberOfLines={1}
                      >
                        Entrega em casa
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                  }}
                >
                  {route.params.withdrawAddresse ? (
                    <Text style={{ fontSize: 20, color: '#009D33' }}>
                      Grátis
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 20 }}>
                      R$ {route.params.calculate_freight_quote_value}
                    </Text>
                  )}
                </View>
              </View>
            ) : null}

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 37,
              }}
            >
              <Text>Você pagará</Text>
              <Text style={{ fontSize: 12 }}>
                {installments && payment_method === 'credit_card' && (
                  <TitleText style={{ fontSize: 24 }}>
                    {installments.installments_quantity}x{' '}
                  </TitleText>
                )}
                R${' '}
                {installments && payment_method === 'credit_card' ? (
                  <TitleText style={{ fontSize: 24 }}>
                    {!Number.isInteger(installments.installment_value)
                      ? String(
                          Number(installments.installment_value).toFixed(2),
                        ).replace('.', ',')
                      : installments.installment_value}
                  </TitleText>
                ) : (
                  <>
                    {data.getChallengeDetail.physical_event ? (
                      <TitleText style={{ fontSize: 24 }}>
                        {!Number.isInteger(cartStatus.totalPrice)
                          ? String(
                              Number(cartStatus.totalPrice).toFixed(2),
                            ).replace('.', ',')
                          : cartStatus.totalPrice}
                      </TitleText>
                    ) : (
                      <TitleText style={{ fontSize: 24 }}>
                        {!Number.isInteger(cartStatus.totalPrice)
                          ? String(Number(cartStatus.totalPrice)).replace(
                              '.',
                              ',',
                            )
                          : cartStatus.totalPrice}
                      </TitleText>
                    )}
                  </>
                )}
              </Text>
            </View>

            {data.getChallengeDetail.physical_event ? (
              <View
                style={{
                  marginTop: 40,
                  marginBottom: 5,
                  paddingHorizontal: 16,
                }}
              >
                <CheckBox
                  value={hasAccepted}
                  onChange={(e) => setHasAccepted(e)}
                  EndButtonText="aqui."
                  EndButtonAction={() =>
                    Linking.openURL(
                      'https://cdn.riderize.com/challenges/05e43675-e7cb-4361-934a-9712e31405cd/attached/TERMO-DE-RESPONSABILID-DE2021.docx',
                    )
                  }
                  title="Concordo com os termos do evento disponível"
                />
              </View>
            ) : null}

            <TouchableOpacity
              disabled={loading}
              onPress={() => {
                if (!hasAccepted) {
                  Alert.alert(
                    'ATENÇÃO',
                    'Você precisa concordar e marcar o campo acima do botão de confirmação.',
                  );
                } else {
                  paySubscription(
                    data?.getChallengeDetail.awards[
                      data.getChallengeDetail.awards.findIndex(
                        (el) => el.id === awardSelected.id,
                      )
                    ].id,
                  );
                }
              }}
              style={{
                backgroundColor: hasAccepted ? '#0564FF' : '#A1A8B1',
                paddingVertical: 8,
                alignItems: 'center',
                borderRadius: 24,
                marginTop: data.getChallengeDetail.physical_event ? 0 : 15,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="large" />
              ) : (
                <TitleText style={{ color: '#FFF', fontSize: 16 }}>
                  Confirmar inscrição
                </TitleText>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: '#FFF',
              marginTop: -12,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
                marginTop: 40,
              }}
            >
              {data?.getChallengeDetail.awards[
                data.getChallengeDetail.awards.findIndex(
                  (el) => el.id === awardSelected.id,
                )
              ].awardsImages &&
                data?.getChallengeDetail.awards[
                  data.getChallengeDetail.awards.findIndex(
                    (el) => el.id === awardSelected.id,
                  )
                ].awardsImages.length > 0 && (
                  <View
                    style={{
                      height: 97,
                      width: 97,
                      borderRadius: 8,
                      shadowColor: '#C4C4C4',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,
                    }}
                  >
                    <FastImage
                      style={{
                        height: 96,
                        width: 96,
                        borderRadius: 8,
                      }}
                      source={{
                        uri: `${PUBLIC_STORAGE}/${
                          data?.getChallengeDetail.awards[
                            data.getChallengeDetail.awards.findIndex(
                              (el) => el.id === awardSelected.id,
                            )
                          ].awardsImages[0].link
                        }`,
                      }}
                    />
                  </View>
                )}
              <Text style={{ fontSize: 24, marginTop: 16 }}>
                {
                  data?.getChallengeDetail.awards[
                    data.getChallengeDetail.awards.findIndex(
                      (el) => el.id === awardSelected.id,
                    )
                  ].name
                }
              </Text>
              <View style={{ paddingHorizontal: 16 }}>
                {data?.getChallengeDetail.awards[
                  data.getChallengeDetail.awards.findIndex(
                    (el) => el.id === awardSelected.id,
                  )
                ].description.length > 0 &&
                data?.getChallengeDetail.awards[
                  data.getChallengeDetail.awards.findIndex(
                    (el) => el.id === awardSelected.id,
                  )
                ].description[0] === '<' ? (
                  <CustomHTML
                    key="html"
                    source={{
                      html: `<div>${
                        data?.getChallengeDetail.awards[
                          data.getChallengeDetail.awards.findIndex(
                            (el) => el.id === awardSelected.id,
                          )
                        ].description
                      }</div>`,
                    }}
                    // source={{ html: seeMore ? description : `<div>${description}</div>` }}
                    ignoredStyles={['font-family']}
                    containerStyle={{ marginTop: 16 }}
                    onLinkPress={(evt, href) => {
                      Linking.openURL(href);
                    }}
                    renderers={{
                      p: (htmlAttribs, children) => (
                        <Text style={{ opacity: 0.56, marginTop: 16 }}>
                          {children}
                        </Text>
                      ),
                      div: (htmlAttribs, children) => (
                        <View>
                          <Text style={{ opacity: 0.56, marginTop: 16 }}>
                            {children}
                          </Text>
                        </View>
                      ),
                      b: (htmlAttribs, children) => (
                        <TitleText>{children}</TitleText>
                      ),
                    }}
                    tagsStyles={{
                      div: {
                        marginTop: 5,
                      },
                      p: {
                        fontFamily: 'NeuzeitGro-Reg',
                        fontWeight: null,
                      },
                      img: {
                        marginTop: 5,
                      },
                      b: {
                        fontFamily: 'NeuzeitGro-Bol',
                        fontWeight: null,
                      },
                    }}
                  />
                ) : (
                  <Text style={{ opacity: 0.56, marginTop: 16 }}>
                    {
                      data?.getChallengeDetail.awards[
                        data.getChallengeDetail.awards.findIndex(
                          (el) => el.id === awardSelected.id,
                        )
                      ].description
                    }
                  </Text>
                )}
              </View>
            </View>

            {route.params?.category_index >= 0 &&
              typeof route.params.category_index === 'number' && (
                <>
                  <View style={{ alignItems: 'center', marginVertical: 37 }}>
                    <View
                      style={{
                        width: 170,
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#161C25',
                        opacity: 0.2,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 24, marginTop: 16 }}>
                      {
                        data.getChallengeDetail.challenge_categories[
                          route.params.category_index
                        ].name
                      }
                    </Text>
                    <Text style={{ opacity: 0.56, marginTop: 16 }}>
                      Minha categoria
                    </Text>
                  </View>
                </>
              )}

            {!data.getChallengeDetail.physical_event && (
              <PhysicalEventComponent
                params={route.params}
                userProfile={userProfile}
                onPress={() => {
                  navigation.navigate('selectAddress');
                }}
              />
            )}

            <View style={{ alignItems: 'center', marginVertical: 37 }}>
              <View
                style={{
                  width: 170,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#161C25',
                  opacity: 0.2,
                }}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                width: widthPercentageToDP('100'),
              }}
            >
              {route.params.extraordinaryActions &&
              route.params.extraordinaryActions.bonus_subscription &&
              totalAddonPrice <= 0 ? null : (
                <Icons
                  name={
                    payment_method === 'credit_card'
                      ? 'credit-card'
                      : payment_method === 'boleto'
                      ? 'bar-code'
                      : 'pix'
                  }
                  color="#32BCAD"
                  height={70}
                />
              )}

              {payment_method === 'credit_card' ? (
                <Text style={{ fontSize: 14, opacity: 0.56 }}>
                  {selected_card.name} **** {selected_card.last_digits}
                </Text>
              ) : null}

              {payment_method === 'boleto' ? (
                <Text style={{ fontSize: 14, opacity: 0.56 }}>Via boleto</Text>
              ) : null}

              {payment_method === 'pix' ? (
                <Text style={{ fontSize: 14, opacity: 0.56 }}>Via Pix</Text>
              ) : null}

              {route.params.extraordinaryActions &&
              route.params.extraordinaryActions.bonus_subscription &&
              totalAddonPrice <= 0 ? null : (
                <>
                  {data.getChallengeDetail.physical_event ? (
                    <Text>
                      Você pagará R${' '}
                      {installments ? (
                        <>
                          {installments.installments_quantity}x{' '}
                          {!Number.isInteger(installments.installment_value)
                            ? String(
                                Number(installments.installment_value).toFixed(
                                  2,
                                ),
                              ).replace('.', ',')
                            : installments.installment_value}
                        </>
                      ) : (
                        <>
                          {!Number.isInteger(cartStatus.totalPrice)
                            ? String(
                                Number(cartStatus.totalPrice).toFixed(2),
                              ).replace('.', ',')
                            : cartStatus.totalPrice}
                        </>
                      )}
                    </Text>
                  ) : (
                    <Text>
                      Você pagará R${' '}
                      {installments && payment_method === 'credit_card' ? (
                        <>
                          {installments.installments_quantity}x{' '}
                          {!Number.isInteger(installments.installment_value)
                            ? String(
                                Number(installments.installment_value).toFixed(
                                  2,
                                ),
                              ).replace('.', ',')
                            : installments.installment_value}
                        </>
                      ) : (
                        <>
                          {!Number.isInteger(cartStatus.totalPrice)
                            ? String(
                                Number(cartStatus.totalPrice).toFixed(2),
                              ).replace('.', ',')
                            : cartStatus.totalPrice}
                        </>
                      )}
                    </Text>
                  )}
                </>
              )}
              {route.params.extraordinaryActions &&
              route.params.extraordinaryActions.bonus_subscription &&
              totalAddonPrice <= 0 ? null : (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 12,
                  }}
                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  onPress={() => {
                    navigation.navigate('selectMethod');
                  }}
                >
                  <Text style={{ color: '#0564ff', fontSize: 18 }}>
                    Modificar
                  </Text>
                  <Icons name="arrow-right" height={9} color="#0564ff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{ paddingHorizontal: 32 }}>
            {data.getChallengeDetail.physical_event ? (
              <View style={{ marginTop: 30, marginBottom: 10 }}>
                <CheckBox
                  value={hasAccepted}
                  onChange={(e) => setHasAccepted(e)}
                  title="Concordo com os termos do evento disponível"
                  EndButtonText="aqui."
                  EndButtonAction={() =>
                    Linking.openURL(
                      'https://cdn.riderize.com/challenges/05e43675-e7cb-4361-934a-9712e31405cd/attached/TERMO-DE-RESPONSABILID-DE2021.docx',
                    )
                  }
                />
              </View>
            ) : null}

            <TouchableOpacity
              disabled={loading}
              onPress={() => {
                if (!hasAccepted) {
                  Alert.alert(
                    'ATENÇÃO',
                    'Você precisa concordar e marcar o campo acima do botão de confirmação.',
                  );
                } else {
                  paySubscription(
                    data?.getChallengeDetail.awards[
                      data.getChallengeDetail.awards.findIndex(
                        (el) => el.id === awardSelected.id,
                      )
                    ].id,
                  );
                }
              }}
              style={{
                backgroundColor: hasAccepted ? '#0564FF' : '#A1A8B1',
                paddingVertical: 8,
                alignItems: 'center',
                borderRadius: 24,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <TitleText style={{ color: '#fff', fontSize: 16 }}>
                  Confirmar inscrição
                </TitleText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
