import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CommonActions,
  RouteProp,
  StackActions,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { captureException } from '@sentry/react-native';
import { compact } from 'lodash';
import { useRecoilValue } from 'recoil';
import { ApolloError } from '@apollo/client/errors';
import {
  BuyProductInput,
  ChallengeUserDataInput,
} from '~/graphql/autogenerate/schemas';
import { Icons, Text, TitleText } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { useBuyProductMutation } from '~/graphql/autogenerate/hooks';
import { useStoreActions, useStoreState } from '~/store';
import { useUserToken } from '~/hooks';
import { PaymentAwardRootParamList } from '~/screens/Challenge/Challenge.PaymentAward/PaymentAward.routes';
import { cartState } from '~/recoil/atoms';
import { cartStatus as _cartStatus } from '~/recoil/selectors';
import { PhysicalEventComponent } from '~/screens/Challenge/Challenge.PaymentAward/components/PhysicalEventComponent';

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
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const cart = useRecoilValue(cartState);
  const cartStatus = useRecoilValue(_cartStatus);
  const [productsList] = useState(compact(cart));
  const { data, payment_method, selected_card, award_index, installments } =
    route.params;
  const ERROR_PRODUCT_UNAVAILABLE =
    'A quantidade pedida não está mais disponível!';
  const { profileID: profile_id, userinfo, userID } = useUserToken();
  const userProfile = useStoreState(({ profile }) => profile.payload);

  const setIsOnPurchase = useStoreActions(
    (actions) => actions.chart.setIsOnPurchase,
  );

  const onError = (e: ApolloError) => {
    console.log('error: ', e.message);
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
              hasSubscribed: true,
              error_in_payment: true,
              challenge_id: route.params.data.getChallengeDetail.id,
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
    console.log('SUCESS');
    // route.params.rootNavigation.replace('Products.SuccessPayment', {
    //   error_in_payment: false,
    //   message: e.buyProduct.message,
    //   status: e.buyProduct.status,
    //   payment_id: e.buyProduct.payment_id,
    //   challenge_id: route.params.data.getChallengeDetail.id,
    // });

    // route.params.rootNavigation.dispatch(
    //   CommonActions.reset({
    //     index: 2,
    //     routeNames: [
    //       'Home',
    //       'Challenge.Description',
    //       'Products.SuccessPayment',
    //     ],
    //     routes: [
    //       { name: 'Home', params: { accepted_initial_screen: true } },
    //       {
    //         name: 'Challenge.Description',
    //         params: {
    //           challenge_id: route.params.data.getChallengeDetail.id,
    //         },
    //       },
    //       {
    //         name: 'Products.SuccessPayment',
    //         params: {
    //           error_in_payment: false,
    //           message: e.buyProduct.message,
    //           status: e.buyProduct.status,
    //           payment_id: e.buyProduct.payment_id,
    //           challenge_id: route.params.data.getChallengeDetail.id,
    //         },
    //       },
    //     ],
    //   }),
    // );

    // route.params.rootNavigation.pop();
    navigation.dispatch(
      StackActions.push('Products.SuccessPayment', {
        error_in_payment: false,
        message: e.buyProduct.message,
        status: e.buyProduct.status,
        payment_id: e.buyProduct.payment_id,
        challenge_id: route.params.data.getChallengeDetail.id,
      }),
    );
    // navigation.dispatch(StackActions.pop(state.routeNames.length + 1));
    // route.params.rootNavigation.replace();
  };

  const [buyProductMutation] = useBuyProductMutation();

  const paySubscription = async (award_id): Promise<void> => {
    setLoadingSubscription(true);
    const custom_data: ChallengeUserDataInput = {
      challenge_id: data?.getChallengeDetail.id,
      user_id: userID,
    };

    let payment_data = {};

    if (installments && installments.installments_quantity && selected_card) {
      payment_data = {
        ...payment_data,
        installments: String(installments.installments_quantity),
        value_without_fee: Number(
          Number(cartStatus.totalWithoutSub).toFixed(2),
        ),
        payment_method, // credit_card | boleto
        external_card_id: selected_card.external_id,
        value_paid: Number(Number(installments.total_amount).toFixed(2)),
      };
    } else if (selected_card) {
      payment_data = {
        ...payment_data,
        payment_method, // credit_card | boleto
        value_without_fee: Number(
          Number(cartStatus.totalWithoutSub).toFixed(2),
        ),
        external_card_id: selected_card.external_id,
        value_paid: Number(Number(installments.total_amount).toFixed(2)),
      };
    } else if (cartStatus.totalWithoutSub) {
      payment_data = {
        ...payment_data,
        payment_method, // credit_card | boleto
        value_without_fee: Number(
          Number(cartStatus.totalWithoutSub).toFixed(2),
        ),
        value_paid: data?.getChallengeDetail.physical_event
          ? Number(Number(cartStatus.totalWithoutSub).toFixed(2))
          : Number(
              Number(
                cartStatus.totalWithoutSub +
                  (route.params.withdrawAddresse
                    ? 0
                    : route.params.calculate_freight_quote_value
                  )?.toFixed(2),
              ),
            ),
      };
    }

    if (cart) {
      const cleanupSelectedProducts = compact(cart);
      const removedTotalPriceElements = cleanupSelectedProducts.map((el) => {
        return {
          product_id: el.product_id,
          product_variation_id: el.product_variation_id,
          quantity: el.quantity,
        };
      });
      console.log('variables: ', {
        user_data: custom_data,
        products_chosen: removedTotalPriceElements as BuyProductInput[],
        payment_data,
      });
      const { data: response, errors } = await buyProductMutation({
        variables: {
          user_data: custom_data,
          products_chosen: removedTotalPriceElements as BuyProductInput[],
          payment_data,
        },
      });
      if (response?.buyProduct) {
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
          <TitleText style={{ fontSize: 20 }}>Confirme sua compra</TitleText>
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
            {productsList && productsList.length > 0 && (
              <>
                <View
                  style={{
                    paddingTop: 24,
                  }}
                >
                  {productsList.map((addon) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        marginTop: 15,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          maxWidth: '100%',
                        }}
                      >
                        <View
                          style={{
                            maxWidth:
                              addon.price > 0
                                ? widthPercentageToDP('70')
                                : widthPercentageToDP('100'),
                          }}
                        >
                          <Text style={{ fontSize: 16 }} numberOfLines={1}>
                            {addon.quantity}x {addon.name}
                          </Text>
                          <Text
                            style={{
                              opacity: 0.56,
                              fontSize: 16,
                              lineHeight: 18,
                              marginTop: 8,
                            }}
                            numberOfLines={1}
                          >
                            {addon.response || addon.optionName}
                          </Text>
                        </View>
                      </View>
                      {addon.price > 0 ? (
                        <View
                          style={{
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 20 }}>
                            R${' '}
                            {!Number.isInteger(addon.price)
                              ? String(Number(addon.price).toFixed(2)).replace(
                                  '.',
                                  ',',
                                )
                              : addon.price}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
              </>
            )}

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
              {cartStatus.totalWithoutSub && (
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
                          {!Number.isInteger(cartStatus.totalWithoutSub)
                            ? String(
                                Number(cartStatus.totalWithoutSub).toFixed(2),
                              ).replace('.', ',')
                            : cartStatus.totalWithoutSub}
                        </TitleText>
                      ) : (
                        <TitleText style={{ fontSize: 24 }}>
                          {!Number.isInteger(
                            cartStatus.totalWithoutSub +
                              (route.params.withdrawAddresse
                                ? 0
                                : route.params.calculate_freight_quote_value),
                          )
                            ? String(
                                Number(
                                  cartStatus.totalWithoutSub +
                                    (route.params.withdrawAddresse
                                      ? 0
                                      : route.params
                                          .calculate_freight_quote_value),
                                ).toFixed(2),
                              ).replace('.', ',')
                            : cartStatus.totalWithoutSub +
                              (route.params.withdrawAddresse
                                ? 0
                                : route.params.calculate_freight_quote_value)}
                        </TitleText>
                      )}
                    </>
                  )}
                </Text>
              )}
            </View>

            <TouchableOpacity
              disabled={loadingSubscription}
              onPress={() => {
                paySubscription();
              }}
              style={{
                backgroundColor: '#0564FF',
                paddingVertical: 8,
                alignItems: 'center',
                borderRadius: 24,
                marginTop: 40,
              }}
            >
              {loadingSubscription ? (
                <ActivityIndicator color="#FFF" size="large" />
              ) : (
                <TitleText style={{ color: '#FFF', fontSize: 16 }}>
                  Confirmar compra
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

              {data.getChallengeDetail.physical_event ? (
                <Text>
                  Você pagará R${' '}
                  {installments ? (
                    <>
                      {installments.installments_quantity}x{' '}
                      {!Number.isInteger(installments.installment_value)
                        ? String(
                            Number(installments.installment_value).toFixed(2),
                          ).replace('.', ',')
                        : installments.installment_value}
                    </>
                  ) : (
                    <>
                      {!Number.isInteger(cartStatus.totalWithoutSub)
                        ? String(
                            Number(cartStatus.totalWithoutSub).toFixed(2),
                          ).replace('.', ',')
                        : cartStatus.totalWithoutSub}
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
                            Number(installments.installment_value).toFixed(2),
                          ).replace('.', ',')
                        : installments.installment_value}
                    </>
                  ) : (
                    <>
                      {!Number.isInteger(
                        cartStatus.totalWithoutSub +
                          (route.params.withdrawAddresse
                            ? 0
                            : route.params.calculate_freight_quote_value),
                      )
                        ? String(
                            Number(
                              cartStatus.totalWithoutSub +
                                (route.params.withdrawAddresse
                                  ? 0
                                  : route.params.calculate_freight_quote_value),
                            ).toFixed(2),
                          ).replace('.', ',')
                        : cartStatus.totalWithoutSub +
                          (route.params.withdrawAddresse
                            ? 0
                            : route.params.calculate_freight_quote_value)}
                    </>
                  )}
                </Text>
              )}

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
            </View>
          </View>
          <View style={{ paddingHorizontal: 32 }}>
            <TouchableOpacity
              disabled={loadingSubscription}
              onPress={() => {
                paySubscription();
              }}
              style={{
                backgroundColor: '#0564FF',
                paddingVertical: 8,
                alignItems: 'center',
                borderRadius: 24,
                marginTop: 30,
                marginBottom: 10,
              }}
            >
              {loadingSubscription ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <TitleText style={{ color: '#fff', fontSize: 16 }}>
                  Confirmar compra
                </TitleText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
