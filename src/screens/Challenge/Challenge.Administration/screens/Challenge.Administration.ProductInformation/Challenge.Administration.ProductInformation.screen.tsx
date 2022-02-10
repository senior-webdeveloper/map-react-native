import { PUBLIC_STORAGE } from '@env';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator, ProgressBar } from 'react-native-paper';
import { layout, space, flexbox } from 'styled-system';
import styled from 'styled-components/native';
import { isPast, isFuture, format } from 'date-fns';
import * as Animatable from 'react-native-animatable';
import {
  Box,
  Button,
  Icons,
  ImageZoom,
  SafeAreaView,
  Text,
  TitleText,
  Typography,
} from '~/components';
import {
  useGetDetailedSubscriptionLazyQuery,
  useGetPaymentsOfASubscriptionLazyQuery,
} from '~/graphql/autogenerate/hooks';
import { GetDetailedSubscriptionQuery } from '~/graphql/autogenerate/operations';
import { ChallengeAdministrationRouteList } from '../../Challenge.Administration.routes';
import { lightTheme } from '~/global/themes';
import { useStoreState } from '~/store';
import Payments from '../Challenge.Administration.ListProducts/components/Payments';
import locale from '~/helpers/dateLocale.ts';
import { ProductPurchasedType, SubscriptionPayment } from '~/generated/graphql';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

type ChallengeDescriptionRouteProp = RouteProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ProductInformation'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.ProductInformation'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export const SuccessTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.green};
`;

export const ErrorTitle = styled(TitleText)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.semantic.red};
`;

export const AwaitTitle = styled(TitleText)<StatsProps>`
  font-size: 16px;
  color: ${({ color }) => color};
`;

interface StatsProps {
  color: string;
}
export const PaymentStatusContainer = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  elevation: 10;
  /* Shadow try 1 */
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
`;
export const StatsCard = styled.View<StatsProps>`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  align-items: flex-end;
`;
export const InnerStatsContainer = styled.View`
  background-color: #ffffff;
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
  width: 97%;
  padding: 18px 19px;
`;

export const Description = styled(Text)`
  font-size: 20px;
  line-height: 23px;
`;

export const MinorDescription = styled(Text)`
  font-size: 14px;
  line-height: 16.1px;
  opacity: 0.56;
  margin-top: 16px;
`;

export const ModalContentContainer = styled(View)<layout>(
  {
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 25,
  },
  layout,
  space,
  flexbox,
);

function sumTwoNumber(a?: number, b?: number): number {
  console.log(
    '🚀 ~ file: Challenge.MyPayment.screen.tsx ~ line 186 ~ sumTwoNumber ~ b',
    b,
  );
  console.log(
    '🚀 ~ file: Challenge.MyPayment.screen.tsx ~ line 186 ~ sumTwoNumber ~ a',
    a,
  );
  let aInt = 0;
  let bInt = 0;
  if (a && !Number.isNaN(a)) {
    aInt = a;
  }
  if (b && !Number.isNaN(b)) {
    bInt = b;
  }

  return aInt + bInt;
}

export default function ChallengeAdministrationProductInformation({
  route,
  navigation,
}: Props): JSX.Element {
  const { product } = route.params;
  const animationRef = useRef<Animatable>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {product ? (
        <RenderProductInformation
          data={product}
          navigation={navigation}
          route={route}
        />
      ) : (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Icons
            name="bike-draw"
            width={widthPercentageToDP('40')}
            height={200}
          />
          <Typography type="h3">Ops, algo deu errado</Typography>

          <TouchableOpacity
            style={{
              width: '60%',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              marginTop: 20,
              backgroundColor: '#0565ff11',
              borderRadius: 24,
              overflow: 'hidden',
            }}
            onPress={() => {
              if (animationRef.current) {
                animationRef.current.stopAnimation();
              }
            }}
          >
            <Text style={{ color: '#0564ff' }}>Tentar novamente</Text>

            <Animatable.View
              ref={animationRef}
              onAnimationEnd={() => {
                navigation.goBack();
              }}
              animation={{
                from: {
                  width: 0,
                },
                to: {
                  width: widthPercentageToDP('60'),
                },
              }}
              duration={7000}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
              }}
            >
              <ProgressBar
                progress={1}
                color="#0564FF"
                style={{
                  width: widthPercentageToDP('60'),
                  height: 5,
                }}
              />
            </Animatable.View>
          </TouchableOpacity>
        </Box>
      )}
    </SafeAreaView>
  );
}

type RenderProps = {
  data: ProductPurchasedType;
  navigation: ChallengeDescriptionNavigationProp;
  route: ChallengeDescriptionRouteProp;
};
type Tabs = 'detailed' | 'payments' | 'buyed';
function RenderProductInformation({ data, navigation, route }: RenderProps) {
  const [lastPayment, setLastPayment] = useState<SubscriptionPayment>();

  const scrollView = useRef<ScrollView>(null);
  const [tab, setTab] = useState<Tabs>('detailed');
  // const [getPayments, { data: payment }] =
  //   useGetPaymentsOfASubscriptionLazyQuery({
  //     onError: (e) => console.log('E AGORA? ', e.message),
  //     onCompleted: (payments) => console.log('completou: ', payments),
  //   });
  //
  // useEffect(() => {
  //   if (subscriptionID) {
  //     getPayments({
  //       variables: {
  //         data: {
  //           user_challenge_id: subscriptionID,
  //         },
  //       },
  //     });
  //   }
  // }, [subscriptionID]);
  //
  // useEffect(() => {
  //   console.log('last_payment: ', data.getDetailedSubscription.last_payment_id);
  //   if (payment?.getPaymentsOfASubscription) {
  //     const filteredPayment =
  //       payment.getPaymentsOfASubscription[
  //         payment.getPaymentsOfASubscription.findIndex(
  //           (el) =>
  //             el.payment_id === data.getDetailedSubscription.last_payment_id,
  //         )
  //       ];
  //
  //     if (filteredPayment) {
  //       setLastPayment(filteredPayment);
  //     }
  //   }
  // }, [payment]);

  console.log('related_payment', data.related_payment?.payment);
  console.log('payment', data.subscription?.last_payment);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaymentStatusContainer
        color="#FFF"
        style={{
          paddingTop: Platform.OS === 'ios' ? 55 : 45,
          paddingHorizontal: 16,
          paddingBottom: 15,
          marginTop: -50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TitleText style={{ fontSize: 20 }}>Produto</TitleText>
        </View>

        <View style={{ width: 20 }} />
      </PaymentStatusContainer>

      <ScrollView>
        <PaymentStatusContainer
          color="#FFF"
          style={{ marginTop: 16, paddingVertical: 26 }}
        >
          <Box flexDirection="row" width={1} px={16} alignItems="center">
            <TouchableOpacity onPress={() => {}}>
              <Box p={2} mr={12}>
                <ImageZoom
                  source={{
                    uri: `${PUBLIC_STORAGE}/${data.product.images[0].link}`,
                  }}
                  uri={{
                    uri: `${PUBLIC_STORAGE}/${data.product.images[0].link}`,
                  }}
                  style={{ width: 80, height: 80, borderRadius: 80 }}
                />
              </Box>
            </TouchableOpacity>

            <Box alignSelf="stretch" justifyContent="center">
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 20,
                  width: widthPercentageToDP('60'),
                }}
              >
                {data.product.name}
              </Text>

              <Box
                flexDirection="row"
                alignSelf="stretch"
                justifyContent="space-between"
                mt={2}
              >
                <Box mr={40}>
                  {/* <Text>Cod. Inscrição</Text> */}
                  {/* <Text */}
                  {/*  style={{ */}
                  {/*    fontFamily: 'NeuzeitGro-Bol', */}
                  {/*    color: 'rgba(22, 28, 37, 0.4)', */}
                  {/*    lineHeight: 16, */}
                  {/*  }} */}
                  {/* > */}
                  {/*  /!* {data.getDetailedSubscription.short_id} *!/ */}
                  {/* </Text> */}
                </Box>

                <Box alignItems="flex-end">
                  <Text>Status</Text>

                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 16,
                      color: data.related_payment
                        ? data.related_payment.payment.is_paid
                          ? '#009D33'
                          : '#FFC502'
                        : data.subscription?.last_payment?.is_paid
                        ? '#009D33'
                        : '#FFC502',
                      // color: data.getDetailedSubscription.paid
                      //   ? '#009D33'
                      //   : lastPayment?.payment.status === 'waiting_payment'
                      //   ? '#FFC502'
                      //   : '#FF2525',
                    }}
                  >
                    {data.related_payment
                      ? data.related_payment.payment.is_paid
                        ? 'Pago'
                        : 'Aguardando Pagamento'
                      : data.subscription?.last_payment?.is_paid
                      ? 'Pago'
                      : 'Aguardando Pagamento'}
                    {/* {data?.getDetailedSubscription?.subscription_status ? ( */}
                    {/*  <> */}
                    {/*    {data?.getDetailedSubscription?.subscription_status */}
                    {/*      .status_description.translations[0] */}
                    {/*      ? data?.getDetailedSubscription?.subscription_status */}
                    {/*          .status_description.translations[0].name */}
                    {/*      : null} */}
                    {/*  </> */}
                    {/* ) : null} */}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box width={1} mt={32} px={3}>
            <Box borderColor="rgba(223, 232, 237, 0.6)" borderWidth="1" />
          </Box>

          <ScrollView
            ref={scrollView}
            horizontal
            contentContainerStyle={{ paddingVertical: 13 }}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => {
                scrollView.current.scrollTo(0, 0);
                setTab('detailed');
              }}
            >
              <Text
                style={{
                  marginLeft: 16,
                  marginRight: 32,
                  fontSize: tab === 'detailed' ? 20 : 16,
                  fontFamily:
                    tab === 'detailed' ? 'NeuzeitGro-Reg' : 'NeuzeitGro-Lig',
                  color:
                    tab === 'detailed'
                      ? lightTheme.colors.blue100
                      : 'rgba(22, 28, 37, 0.56)',
                }}
              >
                Detalhes
              </Text>
            </TouchableOpacity>

            {data.getDetailedSubscription &&
            data.getDetailedSubscription.products_bought &&
            data.getDetailedSubscription.products_bought.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  scrollView.current.scrollTo(0, 200);
                  setTab('buyed');
                }}
              >
                <Text
                  style={{
                    marginRight: 32,
                    fontSize: tab === 'buyed' ? 20 : 16,
                    fontFamily:
                      tab === 'buyed' ? 'NeuzeitGro-Reg' : 'NeuzeitGro-Lig',
                    color:
                      tab === 'buyed'
                        ? lightTheme.colors.blue100
                        : 'rgba(22, 28, 37, 0.56)',
                  }}
                >
                  Compra{' '}
                  {data.getDetailedSubscription.products_bought
                    ? `(${data.getDetailedSubscription.products_bought.length})`
                    : null}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                scrollView.current.scrollTo(0, 200);
                setTab('payments');
              }}
            >
              <Text
                style={{
                  marginRight: 32,
                  fontSize: tab === 'payments' ? 20 : 16,
                  fontFamily:
                    tab === 'payments' ? 'NeuzeitGro-Reg' : 'NeuzeitGro-Lig',
                  color:
                    tab === 'payments'
                      ? lightTheme.colors.blue100
                      : 'rgba(22, 28, 37, 0.56)',
                }}
              >
                Pagamento
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <Box width={1} px={3}>
            <Box borderColor="rgba(223, 232, 237, 0.6)" borderWidth="1" />
          </Box>

          {tab === 'detailed' ? (
            <Box width={1} px={16}>
              <Box mt={24}>
                <TitleText style={{ fontSize: 20 }}>
                  Informações da Compra
                  {/* {route.params.data.getChallengeDetail.name} */}
                </TitleText>

                <Box mt={2}>
                  <Box
                    borderBottomWidth={1}
                    borderBottomColor="rgba(223, 232, 237, 0.6)"
                    paddingVertical={16}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Icons
                        name="bike"
                        height={15}
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>Variação</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data.variation.text}
                        {/* {data.getDetailedSubscription.category?.name} */}
                      </Text>
                    </Box>
                  </Box>

                  <Box
                    borderBottomWidth={1}
                    borderBottomColor="rgba(223, 232, 237, 0.6)"
                    paddingVertical={16}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Icons
                        name="calendar"
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>Data da compra</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {format(new Date(data.created_at), 'P', { locale })}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box mt={48}>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <TitleText style={{ fontSize: 20 }}>
                    Dados do Atleta
                  </TitleText>
                </Box>

                <Box mt={2}>
                  <Box
                    borderBottomWidth={1}
                    borderBottomColor="rgba(223, 232, 237, 0.6)"
                    paddingVertical={16}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Icons
                        name="calendar"
                        height={15}
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>Nome</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data.user.firstname} {data.user.lastname}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    borderBottomWidth={1}
                    borderBottomColor="rgba(223, 232, 237, 0.6)"
                    paddingVertical={16}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Icons
                        name="calendar"
                        height={15}
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>Data de Nascimento</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data.user.date_of_birth
                          ? format(new Date(data.user.date_of_birth), 'P', {
                              locale,
                            })
                          : null}
                      </Text>
                    </Box>
                  </Box>

                  <Box
                    borderBottomWidth={1}
                    borderBottomColor="rgba(223, 232, 237, 0.6)"
                    paddingVertical={16}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Icons
                        name="identity"
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>CPF / CNPJ</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data.user.legal_registry_number
                          ? data.user.legal_registry_number.replace(
                              /(\d{3})(\d{3})(\d{3})(\d{2})/,
                              '$1.$2.$3-$4',
                            )
                          : null}
                      </Text>
                    </Box>
                  </Box>

                  <Box
                    borderBottomWidth={1}
                    borderBottomColor="rgba(223, 232, 237, 0.6)"
                    paddingVertical={16}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Icons
                        name="single-user"
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>Gênero</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data.user.gender === 'M' ? 'Masculino' : null}
                        {data.user.gender === 'F' ? 'Feminino' : null}
                        {data.user.gender === 'O' ? 'Outro' : null}
                      </Text>
                    </Box>
                  </Box>

                  <Box
                    borderBottomWidth={1}
                    borderBottomColor="rgba(223, 232, 237, 0.6)"
                    paddingVertical={16}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Icons
                        name="call-phone"
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>Contato</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data.user.phone
                          ? data.user.phone.replace(
                              /(\d{2})(\d{2})(\d{1})(\d{4})(\d{3})/,
                              '$1 ($2) $3 $4-$5',
                            )
                          : null}
                      </Text>
                    </Box>
                  </Box>

                  <Box
                    borderBottomWidth={1}
                    borderBottomColor="rgba(223, 232, 237, 0.6)"
                    paddingVertical={16}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Icons
                        name="team"
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>Equipe</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data.user.team_name ? data.user.team_name : null}
                      </Text>
                    </Box>
                  </Box>

                  <Box
                    borderBottomWidth={1}
                    borderBottomColor="rgba(223, 232, 237, 0.6)"
                    paddingVertical={16}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Icons
                        name="calendar"
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>Data de inscrição</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data?.subscription?.created_at
                          ? format(
                              new Date(data.subscription.created_at),
                              'P',
                              { locale },
                            )
                          : null}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : null}

          {tab === 'payments' ? (
            <Box>
              <Payments
                route={{
                  params: {
                    lastPayment:
                      data.related_payment?.payment ||
                      data.subscription?.last_payment,
                  },
                }}
              />
            </Box>
          ) : null}
        </PaymentStatusContainer>
      </ScrollView>

      {data.user_challenge_id ? (
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            marginTop: -15,
            backgroundColor: 'white',

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Challenge.Administration.UserInformation', {
                ...route.params,
                subscription_id: data.subscription?.short_id,
                user_id: data.user.id,
              });
            }}
          >
            <Box
              backgroundColor="#4595EC"
              borderRadius={8}
              alignItems="center"
              py={2}
            >
              <Text style={{ color: 'white' }}>Ver Inscrição</Text>
            </Box>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
