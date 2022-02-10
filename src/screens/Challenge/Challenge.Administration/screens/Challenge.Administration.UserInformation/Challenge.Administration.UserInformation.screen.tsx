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
import Buys from '../../components/Buys';
import Payments from '../../components/Payments';
import locale from '~/helpers/dateLocale.ts';
import { SubscriptionPayment } from '~/generated/graphql';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

type ChallengeDescriptionRouteProp = RouteProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.UserInformation'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.UserInformation'
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

export default function ChallengeAdministrationUserInformation({
  route,
  navigation,
}: Props): JSX.Element {
  const animationRef = useRef<Animatable>(null);
  const [fetch, { data, loading, error }] = useGetDetailedSubscriptionLazyQuery(
    {
      onCompleted: (e) => console.log(e),
      onError: (e) => console.error('error: ', e.message),
    },
  );

  useEffect(() => {
    if (route.params.subscription_id) {
      fetch({
        variables: {
          data: {
            short_id: route.params.subscription_id,
          },
        },
      });
    }
  }, [route.params]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator color="#0564FF" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {data ? (
        <RenderUserInformation
          data={data}
          navigation={navigation}
          subscriptionID={data.getDetailedSubscription.id}
          route={route}
        />
      ) : (
        <>
          {error && error.message ? (
            <Box flex={1} alignItems="center" justifyContent="center">
              <Icons
                name="bike-draw"
                width={widthPercentageToDP('40')}
                height={200}
              />
              <Typography type="h3">{error?.message}</Typography>

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
          ) : (
            <SafeAreaView
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator color="#0564FF" size="large" />
            </SafeAreaView>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

type RenderProps = {
  data: GetDetailedSubscriptionQuery;
  navigation: ChallengeDescriptionNavigationProp;
  route: ChallengeDescriptionRouteProp;
};
type Tabs = 'detailed' | 'payments' | 'buyed';
function RenderUserInformation({
  data,
  navigation,
  route,
  subscriptionID,
}: RenderProps) {
  const [lastPayment, setLastPayment] = useState<SubscriptionPayment>();

  const scrollView = useRef<ScrollView>(null);
  const [tab, setTab] = useState<Tabs>('detailed');
  const [getPayments, { data: payment }] =
    useGetPaymentsOfASubscriptionLazyQuery({
      onError: (e) => console.log('E AGORA? ', e.message),
      onCompleted: (payments) => console.log('completou: ', payments),
    });

  useEffect(() => {
    if (subscriptionID) {
      getPayments({
        variables: {
          data: {
            user_challenge_id: subscriptionID,
          },
        },
      });
    }
  }, [subscriptionID]);

  useEffect(() => {
    console.log('last_payment: ', data.getDetailedSubscription.last_payment_id);
    if (payment?.getPaymentsOfASubscription) {
      const filteredPayment =
        payment.getPaymentsOfASubscription[
          payment.getPaymentsOfASubscription.findIndex(
            (el) =>
              el.payment_id === data.getDetailedSubscription.last_payment_id,
          )
        ];

      if (filteredPayment) {
        setLastPayment(filteredPayment);
      }
    }
  }, [payment]);

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
          <TitleText style={{ fontSize: 20 }}>Atleta</TitleText>
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
                    uri: `${PUBLIC_STORAGE}/${data.getDetailedSubscription.user.profile?.profile_avatar}`,
                  }}
                  uri={{
                    uri: `${PUBLIC_STORAGE}/${data.getDetailedSubscription.user.profile?.profile_avatar}`,
                  }}
                  style={{ width: 80, height: 80, borderRadius: 80 }}
                />
              </Box>
            </TouchableOpacity>

            <Box alignSelf="stretch" justifyContent="center">
              <Text style={{ fontSize: 20, lineHeight: 20 }}>
                {data.getDetailedSubscription.user.firstname}{' '}
                {data.getDetailedSubscription.user.lastname}
              </Text>

              <Box
                flexDirection="row"
                alignSelf="stretch"
                justifyContent="space-between"
                mt={2}
              >
                <Box mr={40}>
                  <Text>Cod. Inscrição</Text>
                  <Text
                    style={{
                      fontFamily: 'NeuzeitGro-Bol',
                      color: 'rgba(22, 28, 37, 0.4)',
                      lineHeight: 16,
                    }}
                  >
                    {data.getDetailedSubscription.short_id}
                  </Text>
                </Box>

                <Box>
                  <Text>Status</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 16,
                      color: data.getDetailedSubscription.paid
                        ? '#009D33'
                        : lastPayment?.payment.status === 'waiting_payment'
                        ? '#FFC502'
                        : '#FF2525',
                    }}
                  >
                    {data?.getDetailedSubscription?.subscription_status ? (
                      <>
                        {data?.getDetailedSubscription?.subscription_status
                          .status_description.translations[0]
                          ? data?.getDetailedSubscription?.subscription_status
                              .status_description.translations[0].name
                          : null}
                      </>
                    ) : null}
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
                Detalhe da Inscrição
              </Text>
            </TouchableOpacity>

            {data.getDetailedSubscription.products_bought &&
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
                if (data.getDetailedSubscription.last_payment) {
                  scrollView.current.scrollTo(0, 200);
                  setTab('payments');
                }
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
                  {route.params.data.getChallengeDetail.name}
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
                      <Text>Categoria</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data.getDetailedSubscription.category?.name}
                      </Text>

                      {route.params.data.getChallengeDetail.has_categories &&
                      !isPast(
                        new Date(
                          route.params.data.getChallengeDetail.end_date_registration,
                        ),
                      ) &&
                      !isFuture(
                        new Date(
                          route.params.data.getChallengeDetail.start_date_registration,
                        ),
                      ) &&
                      !isPast(
                        new Date(
                          route.params.data.getChallengeDetail.configuration?.deadline_category_change,
                        ),
                      ) &&
                      route.params.data.getChallengeDetail.configuration
                        ?.allows_category_change ? (
                        <TouchableOpacity
                          style={{ marginLeft: 10 }}
                          hitSlop={{
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10,
                          }}
                          onPress={() => {
                            navigation.push('Challenge.ChangeCategory', {
                              user_challenge_id:
                                data.getDetailedSubscription.id,
                              data: route.params.data,
                            });
                          }}
                        >
                          <Icons name="dots-vertical" />
                        </TouchableOpacity>
                      ) : null}
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
                      <Text>Data do evento</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {format(
                          new Date(
                            route.params.data.getChallengeDetail.start_date,
                          ),
                          'P',
                          { locale },
                        )}
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
                      <Text>Data de Nascimento</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {format(
                          new Date(
                            data.getDetailedSubscription?.user.date_of_birth,
                          ),
                          'P',
                          {
                            locale,
                          },
                        )}
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
                        {data.getDetailedSubscription.user.legal_registry_number.replace(
                          /(\d{3})(\d{3})(\d{3})(\d{2})/,
                          '$1.$2.$3-$4',
                        )}
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
                        {data.getDetailedSubscription.user.gender === 'M'
                          ? 'Masculino'
                          : null}
                        {data.getDetailedSubscription.user.gender === 'F'
                          ? 'Feminino'
                          : null}
                        {data.getDetailedSubscription.user.gender === 'O'
                          ? 'Outro'
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
                        name="call-phone"
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text>Contato</Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      <Text style={{ color: lightTheme.colors.blue100 }}>
                        {data.getDetailedSubscription.user.phone.replace(
                          /(\d{2})(\d{2})(\d{1})(\d{4})(\d{3})/,
                          '$1 ($2) $3 $4-$5',
                        )}
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
                        {data.getDetailedSubscription.user.team_name}
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
                        {format(
                          new Date(data.getDetailedSubscription.created_at),
                          'P',
                          { locale },
                        )}
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
                    isAdmin: true,
                    lastPayment: data.getDetailedSubscription.last_payment,
                    data: route.params.data,
                    payment_id: data.getDetailedSubscription.last_payment.id,
                    payment_historic: payment?.getPaymentsOfASubscription,
                    award: data.getDetailedSubscription.last_payment?.award,
                    challenge_id: route.params.challenge_id,
                    interest_free_amount:
                      data.getDetailedSubscription.last_payment
                        .interest_free_amount,
                    value: data.getDetailedSubscription.last_payment.value,
                  },
                }}
              />
            </Box>
          ) : null}

          {tab === 'buyed' ? (
            <Box>
              <Buys
                route={{
                  params: {
                    physical_event:
                      route.params.data.getChallengeDetail.physical_event,
                    award: lastPayment?.award,
                    value: sumTwoNumber(
                      data.getDetailedSubscription.amount_paid,
                      data.getDetailedSubscription.amount_to_pay,
                    ),
                    products_bought:
                      data.getDetailedSubscription.products_bought,
                    data: route.params.data,
                    subscription_status: data,
                  },
                }}
              />
            </Box>
          ) : null}
        </PaymentStatusContainer>
      </ScrollView>

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
            if (data.getDetailedSubscription.paid) {
              navigation.navigate('Challenge.Administration.QrCode', {
                ...route.params,
                type: 'Product',
                title: 'Identificação Atleta',
                userData: data,
                user_id: String(data.getDetailedSubscription.user.id),
                user_subscribe_id: String(data.getDetailedSubscription.id),
              });
            } else {
              Alert.alert(
                'Usuario nao confirmado',
                'Este usuario ainda nao teve o pagamento confirmado, deseja proceder com a entrega mesmo assim?',
                [
                  {
                    text: 'Sim, continuar',
                    onPress: () => {
                      navigation.navigate('Challenge.Administration.QrCode', {
                        ...route.params,
                        type: 'Product',
                        title: 'Identificação Atleta',
                        userData: data,
                        user_id: String(data.getDetailedSubscription.user.id),
                        user_subscribe_id: String(
                          data.getDetailedSubscription.id,
                        ),
                      });
                    },
                  },
                  {
                    text: 'Nao, cancelar!',
                    onPress: () => {
                      navigation.navigate('Challenge.Administration.Menu', {
                        ...route.params,
                      });
                    },
                  },
                ],
              );
            }
          }}
        >
          <Box
            backgroundColor="#4595EC"
            borderRadius={8}
            alignItems="center"
            py={2}
          >
            <Text style={{ color: 'white' }}>Confirmar atleta</Text>
          </Box>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
