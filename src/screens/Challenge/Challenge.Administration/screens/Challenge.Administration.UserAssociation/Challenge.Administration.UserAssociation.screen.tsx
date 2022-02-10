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
import { layout, space, flexbox, textAlign } from 'styled-system';
import styled from 'styled-components/native';
import { isPast, isFuture, format } from 'date-fns';
import ModalComponent from 'react-native-modal';
import * as Animatable from 'react-native-animatable';

import {
  Box,
  Button,
  Icons,
  ImageZoom,
  SafeAreaView,
  Text,
  TitleText,
} from '~/components';
import {
  useGetDetailedSubscriptionLazyQuery,
  useGetPaymentsOfASubscriptionLazyQuery,
  useMarkSubscriptionAsWithdrawnMutation,
  useUpdateSubscriptionMutation,
} from '~/graphql/autogenerate/hooks';
import { GetDetailedSubscriptionQuery } from '~/graphql/autogenerate/operations';
import { ChallengeAdministrationRouteList } from '../../Challenge.Administration.routes';
import { lightTheme } from '~/global/themes';
import { useStoreState } from '~/store';
import Buys from '../../components/Buys';
import Payments from '../../components/Payments';
import locale from '~/helpers/dateLocale.ts';
import {
  SubscriptionPayment,
  UpdateSubscriptionResponse,
} from '~/generated/graphql';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { useUserToken } from '~/hooks';

type ChallengeDescriptionRouteProp = RouteProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.UserAssociation'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.UserAssociation'
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

export default function ChallengeAdministrationUserAssociation({
  route,
  navigation,
}: Props): JSX.Element {
  const [fetch, { data, loading }] = useGetDetailedSubscriptionLazyQuery();

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

  if (loading && !data) {
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
        <ActivityIndicator color="#0564FF" size="large" />
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
  const { userID } = useUserToken();
  const [
    modalInformations,
    setModalInformations,
  ] = useState<UpdateSubscriptionResponse>({
    message: 'Associação realizada com sucesso!',
  });
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [lastPayment, setLastPayment] = useState<SubscriptionPayment>();

  const scrollView = useRef<ScrollView>(null);
  const [tab, setTab] = useState<Tabs>('detailed');
  const [
    markSubscriptionAsWithdrawnMutation,
  ] = useMarkSubscriptionAsWithdrawnMutation({
    onCompleted: (e) => {
      console.log('message: ', e);
      // Alert.alert(
      //   'Sucesso!',
      //   'Associamos a identificação ao atleta.',
      //   [
      //     {
      //       text: 'Ok, continuar',
      //       onPress: () => navigation.navigate('Challenge.Administration.Menu'),
      //     },
      //   ],
      //   {
      //     cancelable: false,
      //   },
      // );
    },
  });
  const [updateSubscriptionMutation] = useUpdateSubscriptionMutation({
    onCompleted: (e) => {
      console.log('message: ', e);
      setModalInformations(e.updateSubscription);
      setModalState(true);
      setLoading(false);
      // Alert.alert(
      //   'Sucesso!',
      //   'Associamos a identificação ao atleta.',
      //   [
      //     {
      //       text: 'Ok, continuar',
      //       onPress: () => navigation.navigate('Challenge.Administration.Menu'),
      //     },
      //   ],
      //   {
      //     cancelable: false,
      //   },
      // );
    },
    onError: (e) => {
      console.log('Error: ', e.message);
    },
  });
  const [
    getPayments,
    { data: payment },
  ] = useGetPaymentsOfASubscriptionLazyQuery({
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

  const updateUserSubscription = async (id: string) => {
    setLoading(true);
    await markSubscriptionAsWithdrawnMutation({
      variables: {
        data: {
          challenge_id: String(route.params.challenge_id),
          subscription_user_id: String(route.params.user_id),
          user_id_who_marked_the_withdraw: String(userID),
        },
      },
    });
    await updateSubscriptionMutation({
      variables: {
        data: {
          id: String(route.params.user_subscribe_id),
          athlete_identification: id,
        },
      },
    });
  };

  useEffect(() => {
    if (payment?.getPaymentsOfASubscription) {
      const filteredPayment = payment.getPaymentsOfASubscription.filter(
        (el) => el.payment_id === data.getDetailedSubscription.last_payment?.id,
      );

      if (filteredPayment && filteredPayment.length > 0) {
        setLastPayment(filteredPayment[0]);
      }
    }
  }, [payment]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaymentStatusContainer
        color="#FFF"
        style={{
          paddingTop: Platform.OS === 'ios' ? 65 : 45,
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
          <TitleText style={{ fontSize: 20 }}>Confirma Identificação</TitleText>
        </View>

        <View style={{ width: 20 }} />
      </PaymentStatusContainer>

      <ScrollView>
        <PaymentStatusContainer color="#FFF" style={{ marginTop: 16 }}>
          <Box
            flexDirection="column"
            width={1}
            px={16}
            alignItems="center"
            backgroundColor="rgba(69, 149, 236, 0.1)"
            borderRadius={12}
            py={24}
          >
            <Box
              flexDirection="row"
              justifyContent="space-between"
              width="100%"
            >
              <Box width={widthPercentageToDP('20')} />
              <ImageZoom
                source={{
                  uri: `${PUBLIC_STORAGE}/${data.getDetailedSubscription.user.profile?.profile_avatar}`,
                }}
                uri={{
                  uri: `${PUBLIC_STORAGE}/${data.getDetailedSubscription.user.profile?.profile_avatar}`,
                }}
                style={{ width: 92, height: 92, borderRadius: 92 }}
              />
              <Box alignItems="flex-end">
                <Text>Inscrição</Text>
                <Text
                  style={{
                    fontFamily: 'NeuzeitGro-Bol',
                    color: 'rgba(22, 28, 37, 0.4)',
                    lineHeight: 16,
                    fontSize: 14,
                  }}
                >
                  {data.getDetailedSubscription.short_id}
                </Text>
              </Box>
            </Box>

            <Box
              alignSelf="stretch"
              justifyContent="center"
              alignItems="center"
              mt={12}
            >
              <Text style={{ fontSize: 20, lineHeight: 20 }}>
                {data.getDetailedSubscription.user.firstname}{' '}
                {data.getDetailedSubscription.user.lastname}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 20,
                  color: 'rgba(22, 28, 37, 0.56)',
                  fontFamily: 'NeuzeitGro-Lig',
                }}
              >
                {data.getDetailedSubscription.user.city?.name} -{' '}
                {data.getDetailedSubscription.user.city?.state.name}
              </Text>
            </Box>
          </Box>

          <Box
            backgroundColor="#F8FAFB"
            mt={16}
            borderRadius={12}
            alignItems="center"
            py={50}
          >
            <Text
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: 'rgba(22, 28, 37, 0.56)',
                fontFamily: 'NeuzeitGro-Lig',
              }}
            >
              Nº do kit
            </Text>
            <Text
              style={{
                fontFamily: 'NeuzeitGro-Bol',
                fontSize: 24,
                lineHeight: 27,
                textAlign: 'center',
              }}
            >
              {route.params.id_to_associate}
            </Text>
          </Box>

          <Box alignSelf="stretch" alignItems="center" mt={25}>
            <Icons name="information" />

            <Text
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: 'rgba(22, 28, 37, 0.56)',
                fontFamily: 'NeuzeitGro-Lig',
                width: 214,
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              Você está prestes a associar o atleta a este número de
              identificação.
            </Text>
          </Box>
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
            updateUserSubscription(route.params.id_to_associate);
          }}
          disabled={loading}
        >
          <Box
            backgroundColor="#4595EC"
            borderRadius={8}
            alignItems="center"
            py={11}
            flexDirection="row"
            justifyContent="center"
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Icons name="flag-finalization" style={{ marginRight: 12 }} />
                <Text style={{ color: 'white' }}>Finalizar</Text>
              </>
            )}
          </Box>
        </TouchableOpacity>
      </View>

      <ModalComponent
        isVisible={modalState}
        onBackdropPress={() => {}}
        // backdropColor="#FFF"
        useNativeDriver
        backdropTransitionOutTiming={0}
        useNativeDriverForBackdrop
        style={{ alignItems: 'center' }}
      >
        {modalState && modalInformations ? (
          <ModalContentContainer
            style={{
              paddingHorizontal: 24,
              paddingBottom: 14,
              width: widthPercentageToDP('80'),
            }}
          >
            <Text
              style={{
                fontFamily: 'NeuzeitGro-Bol',
                fontSize: 20,
                lineHeight: 20,
              }}
            >
              {modalInformations.status === 'failed'
                ? 'Tivemos um problema'
                : null}
            </Text>

            <Box
              marginVertical={modalInformations.status === 'failed' ? 20 : 0}
              alignItems="center"
            >
              <Text style={{ textAlign: 'center' }}>
                {modalInformations.message}
              </Text>

              {modalInformations?.subscription ? (
                <Text style={{ marginTop: 10 }}>
                  Atleta: {modalInformations?.subscription.user.firstname}{' '}
                  {modalInformations?.subscription.user.lastname}
                </Text>
              ) : null}
            </Box>

            {modalInformations.status === 'failed' ? (
              <Box width={1} flexDirection="row" width="100%">
                <TouchableOpacity
                  style={{
                    paddingVertical: 13,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                  }}
                  onPress={() => {
                    setModalState(false);
                    navigation.navigate('Challenge.Administration.QrCode', {
                      ...route.params,
                      title: 'Inscrição Atleta',
                      type: 'Subscription',
                    });
                  }}
                >
                  <Icons
                    name="close"
                    color={lightTheme.colors.text}
                    style={{ marginRight: 12 }}
                    height={8}
                    width={8}
                  />
                  <Text style={{ color: lightTheme.colors.text }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: lightTheme.colors.accent.green,
                    paddingVertical: 13,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    marginLeft: 32,
                  }}
                  onPress={() => {
                    navigation.navigate('Challenge.Administration.QrCode', {
                      ...route.params,
                      type: 'Product',
                      title: 'Identificação Atleta',
                    });
                    setModalState(false);
                  }}
                >
                  <Text style={{ color: lightTheme.colors.textWhite }}>
                    Ler novamente
                  </Text>
                </TouchableOpacity>
              </Box>
            ) : (
              <Box width={1} mt={32}>
                <TouchableOpacity
                  style={{
                    backgroundColor: lightTheme.colors.accent.green,
                    paddingVertical: 12,
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                  onPress={() => {
                    if (modalState) {
                      setModalState(false);
                    }
                  }}
                >
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icons
                      name="check"
                      color={lightTheme.colors.textWhite}
                      style={{ marginRight: 12 }}
                    />
                    <Text style={{ color: lightTheme.colors.textWhite }}>
                      Concluido
                    </Text>
                  </Box>

                  <Animatable.View
                    onAnimationEnd={() => {
                      if (modalInformations.status === 'failed') {
                        setModalState(false);
                      } else {
                        navigation.navigate('Challenge.Administration.QrCode', {
                          ...route.params,
                          title: 'Inscrição Atleta',
                          type: 'Subscription',
                        });
                      }
                      // saveMonitorLocal(readInformation);
                      // scanner.current?.reactivate();
                    }}
                    animation={{
                      from: {
                        width: 0,
                      },
                      to: {
                        width: widthPercentageToDP('68'),
                      },
                    }}
                    duration={7000}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                    }}
                  >
                    <ProgressBar
                      progress={1}
                      color={lightTheme.colors.accent.lightGreen}
                      style={{
                        width: widthPercentageToDP('68'),
                        height: 5,
                      }}
                    />
                  </Animatable.View>
                </TouchableOpacity>
                {/* <Button
                name="Copiar"
                onPress={() => {
                  Clipboard.setString(String(lastPayment.payment.pix_qrcode));
                  Toast.show('Pix copiado com sucesso!', Toast.LONG);
                }}
              /> */}
              </Box>
            )}
          </ModalContentContainer>
        ) : null}
      </ModalComponent>
    </SafeAreaView>
  );
}
