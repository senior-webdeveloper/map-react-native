import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import * as Sentry from '@sentry/react-native';
import styled from 'styled-components/native';
import { PUBLIC_STORAGE } from '@env';
import { layout, space, flexbox } from 'styled-system';
import ModalComponent from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import {
  Icons,
  SafeAreaView,
  Text,
  TitleText,
  Box,
  ImageZoom,
} from '~/components';
import {
  useCreateUserPassageAtSupportPointMutation,
  useGetChallengeProductsPurchasedLazyQuery,
  useGetSubscriptionsOfAChallengeLazyQuery,
} from '~/graphql/autogenerate/hooks';
import { UserChallenges } from '~/graphql/autogenerate/schemas';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { lightTheme } from '~/global/themes';
import { useStoreState } from '~/store';
import { ChallengeAdministrationRouteList } from '../../Challenge.Administration.routes';
import { dbEventPoints, IEventPointSchema } from '~/db';

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

const ChallengeMyPayment: React.FC<Props> = ({ route, navigation }) => {
  const isConnected = useStoreState((state) => state.network.isConnected);
  const [modalState, setModalState] = useState(false);
  const [networkIsConnected, setNetworkIsConnected] = useState(isConnected);
  const [subscriptions, setSubscriptions] = useState<UserChallenges[]>();
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [checkins, setCheckins] =
    useState<Realm.Results<IEventPointSchema & Realm.Object>>();

  useEffect(() => {
    setNetworkIsConnected(isConnected);
  }, [isConnected]);

  const [createUserPassageAtSupportPointMutation, { loading: loadingCreate }] =
    useCreateUserPassageAtSupportPointMutation({
      onCompleted: (e) => {
        Sentry.captureMessage(
          JSON.stringify(e.createUserPassageAtSupportPoint),
        );
        setLoadingUpdate(false);
        setModalState(false);
      },
    });

  const [fetch, { data, loading, error }] =
    useGetSubscriptionsOfAChallengeLazyQuery({
      onCompleted: (e) => {
        const splicedElements =
          e.getSubscriptionsOfAChallenge.subscriptions.slice(0, 7);
        setSubscriptions(splicedElements);
      },
    });

  function toggleModal() {
    setModalState(!modalState);
  }

  const handleSavePoints = async () => {
    if (networkIsConnected) {
      setLoadingUpdate(true);
      const realm = await dbEventPoints();

      const localPoints = realm.objects<IEventPointSchema>('EventPoints');

      const elements = localPoints.map((element) => ({
        athlete_identification: element.userShortId,
        challenge_id: element.challengeId,
        event_support_point_id: element.pointId,
        check_time: new Date(element.checkTime),
        latitude: element.latitude,
        longitude: element.longitude,
        user_check: element.userCheck,
      }));
      Sentry.captureMessage(JSON.stringify(elements));

      console.log(
        '🚀 ~ file: Challenge.Administration.Checkin.screen.tsx ~ line 356 ~ elements ~ elements',
        elements,
      );

      if (localPoints.length > 0 && elements.length > 0) {
        const { data: eventReturn } =
          await createUserPassageAtSupportPointMutation({
            variables: {
              passages_registered: elements,
            },
          });

        if (eventReturn) {
          realm.write(() => {
            realm.deleteAll();
          });
        }
      } else {
        setLoadingUpdate(false);
      }
    }
  };

  const handleGetCheckins = async () => {
    const realm = await dbEventPoints();

    const localPoints = realm.objects<IEventPointSchema>('EventPoints');

    const elements = localPoints.map((element) => ({
      athlete_identification: element.userShortId,
      challenge_id: element.challengeId,
      event_support_point_id: element.pointId,
      check_time: new Date(element.checkTime),
      latitude: element.latitude,
      longitude: element.longitude,
      user_check: element.userCheck,
    }));

    if (localPoints.length > 0 && elements.length > 0) {
      if (networkIsConnected) {
        setLoadingUpdate(true);
        setModalState(true);
        handleSavePoints();
      }
      setCheckins(localPoints);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleGetCheckins();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params.challenge_id) {
      fetch({
        variables: {
          pagination: {
            page: 1,
            offset: 20,
          },
          data: {
            challenge_id: route.params.challenge_id,
            search_text: '',
          },
        },
      });
    }
  }, [route.params]);

  const RenderItemCall = ({
    item: el,
  }: {
    type: string;
    item: UserChallenges;
    index: number;
  }) => {
    return (
      <Box paddingHorizontal={16}>
        <TouchableOpacity
          onPress={() => {
            console.log(
              '🚀 ~ file: Challenge.Administration.Menu.screen.tsx ~ line 179 ~ el.short_id',
              el.short_id,
            );
            navigation.navigate('Challenge.Administration.UserInformation', {
              ...route.params,
              subscription_id: String(el.short_id),
              user_subscribe_id: el.id,
            });
          }}
          activeOpacity={1}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Box>
            <ImageZoom
              source={{
                uri: `${PUBLIC_STORAGE}/${el.user.profile?.profile_avatar}`,
              }}
              uri={{
                uri: `${PUBLIC_STORAGE}/${el.user.profile?.profile_avatar}`,
              }}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          </Box>
          <Box
            ml={15}
            flexDirection="row"
            justifyContent="space-between"
            width={widthPercentageToDP(75)}
          >
            <Text>
              {el.user.firstname} {el.user.lastname}
            </Text>
            <Box flexDirection="row" alignItems="center">
              <Box mr={12}>
                <Text
                  style={{
                    color: el.paid ? '#009D33' : '#FFC502',
                  }}
                >
                  {el.paid ? 'Pago' : 'Pendente'}
                </Text>
              </Box>
              <Icons name="chevron-right" />
            </Box>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <PaymentStatusContainer
        color="#FFF"
        style={{
          paddingTop: 45,
          paddingHorizontal: 16,
          paddingBottom: 15,
          marginTop: -40,
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
          <TitleText style={{ fontSize: 20 }}>Gerenciador</TitleText>
        </View>

        <View style={{ width: 20 }} />
      </PaymentStatusContainer>
      <ScrollView>
        <PaymentStatusContainer
          color="#FFF"
          style={{ marginTop: 16, paddingVertical: 26 }}
        >
          <Box flexDirection="row" width={1} px={16}>
            <FastImage
              source={{
                uri: `${PUBLIC_STORAGE}/${route.params.data.getChallengeDetail.image_avatar}`,
              }}
              style={{
                width: 100,
                height: 120,
                borderRadius: 8,
                marginRight: 16,
              }}
            />

            <Box alignSelf="stretch" paddingTop={3}>
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 20,
                  fontFamily: 'NeuzeitGro-Bol',
                }}
              >
                {route.params.data.getChallengeDetail.name}
              </Text>
            </Box>
          </Box>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              width: widthPercentageToDP('100'),
              marginTop: 25,
              borderRadius: 8,
              backgroundColor: '#F8FAFB',
            }}
            contentContainerStyle={{
              paddingVertical: 25,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Challenge.Administration.QrCode', {
                  ...route.params,
                  title: 'Inscrição Atleta',
                  type: 'Subscription',
                });
              }}
            >
              <PaymentStatusContainer
                color="#FFF"
                style={{
                  width: 128,
                  height: 104,
                  marginLeft: 16,
                }}
                justifyContent="center"
                alignItems="center"
              >
                <Icons name="qr-code" color="#4595EC" />
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 16,
                    marginTop: 12,
                    width: 80,
                  }}
                >
                  Retirada de Kit
                </Text>
              </PaymentStatusContainer>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate(
                  'Challenge.Administration.ListUsersInEventPoints',
                  {
                    ...route.params,
                  },
                );
              }}
            >
              <PaymentStatusContainer
                color="#FFF"
                style={{
                  width: 128,
                  height: 104,
                  marginLeft: 16,
                }}
                justifyContent="center"
                alignItems="center"
              >
                <Icons name="real-time" color="#4595EC" />
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 16,
                    marginTop: 12,
                    width: 100,
                  }}
                >
                  Ver atletas em tempo real
                </Text>
              </PaymentStatusContainer>
            </TouchableOpacity>

            <PaymentStatusContainer
              color="#FFF"
              style={{
                width: 128,
                height: 104,
                marginLeft: 16,
              }}
              justifyContent="center"
              alignItems="center"
            >
              <Icons name="user-checked2" color="#4595EC" />
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  lineHeight: 16,
                  width: 80,
                  marginTop: 12,
                }}
              >
                Kits Entregues
              </Text>
            </PaymentStatusContainer>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Challenge.Administration.Checkin', {
                  ...route.params,
                })
              }
            >
              <PaymentStatusContainer
                color="#FFF"
                style={{
                  width: 128,
                  height: 104,
                  marginLeft: 16,
                }}
                justifyContent="center"
                alignItems="center"
              >
                <Icons name="gps-marker" color="#4595EC" />
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 16,
                    marginTop: 12,
                    width: 100,
                  }}
                >
                  Check-in em ponto de apoio
                </Text>
              </PaymentStatusContainer>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Challenge.Administration.ListProducts', {
                  ...route.params,
                });
              }}
            >
              <PaymentStatusContainer
                color="#FFF"
                style={{
                  width: 128,
                  height: 104,
                  marginLeft: 16,
                }}
                justifyContent="center"
                alignItems="center"
              >
                <Icons name="settings" color="#4595EC" />
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 16,
                    marginTop: 12,
                    width: 80,
                  }}
                >
                  Produtos Comprados
                </Text>
              </PaymentStatusContainer>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate(
                  'Challenge.Administration.ListUsersForStaff',
                  {
                    ...route.params,
                    title: 'Inscrição Atleta',
                    type: 'Subscription',
                  },
                );
              }}
            >
              <PaymentStatusContainer
                color="#FFF"
                style={{
                  width: 128,
                  height: 104,
                  marginLeft: 16,
                }}
                justifyContent="center"
                alignItems="center"
              >
                <Icons name="settings" color="#4595EC" />
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 16,
                    marginTop: 12,
                    width: 80,
                  }}
                >
                  Gestão de equipe
                </Text>
              </PaymentStatusContainer>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (networkIsConnected && checkins && checkins?.length > 0) {
                  console.log(
                    '🚀 ~ file: Challenge.Administration.Menu.screen.tsx ~ line 535 ~ networkIsConnected',
                    networkIsConnected,
                  );
                  setModalState(true);
                }
              }}
              disabled={!networkIsConnected || !checkins}
            >
              <PaymentStatusContainer
                color="#FFF"
                style={{
                  width: 128,
                  height: 104,
                  marginLeft: 16,
                  marginRight: 16,
                }}
                justifyContent="center"
                alignItems="center"
              >
                {checkins ? (
                  <Box
                    style={{ position: 'absolute', top: -5, right: -5 }}
                    backgroundColor="#FF2525"
                    paddingVertical={2}
                    paddingHorizontal={6}
                    borderRadius={4}
                  >
                    <Text
                      style={{
                        fontFamily: 'NeuzeitGro-Bol',
                        fontSize: 12,
                        lineHeight: 14,
                        color: '#FFF',
                      }}
                    >
                      {checkins?.length}
                    </Text>
                  </Box>
                ) : null}

                <Icons name="upload-generic" color="#4595EC" />
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 16,
                    marginTop: 12,
                    width: 100,
                  }}
                >
                  Enviar atletas registrados
                </Text>
              </PaymentStatusContainer>
            </TouchableOpacity>
          </ScrollView>

          <Box mt={30} width={1}>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingHorizontal={16}
            >
              <Box flexDirection="row" alignItems="center">
                <Icons name="subscription" style={{ marginRight: 12 }} />
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 20,
                    fontFamily: 'NeuzeitGro-Bol',
                  }}
                >
                  Lista de inscrições
                </Text>
              </Box>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Challenge.Administration.ListUsers', {
                    ...route.params,
                  });
                }}
              >
                <Icons name="search" color="#4595EC" />
              </TouchableOpacity>
            </Box>

            <FlatList
              data={subscriptions}
              renderItem={RenderItemCall}
              style={{ marginTop: 29 }}
              loading={loading}
              ItemSeparatorComponent={() => <Box mb={16} />}
              ListFooterComponent={() => (
                <Box
                  mt={19}
                  backgroundColor="#F8FAFB"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  py={16}
                  px={16}
                >
                  <Text
                    style={{
                      color: 'rgba(22, 28, 37, 0.4)',
                      fontFamily: 'NeuzeitGro-Bol',
                    }}
                  >
                    Total{' '}
                    {data?.getSubscriptionsOfAChallenge.page_info
                      .total_item_count || 0}{' '}
                    inscritos
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(
                        'Challenge.Administration.ListUsers',
                        { ...route.params },
                      );
                    }}
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Text
                        style={{
                          marginRight: 8,
                          color: '#4595EC',
                          fontFamily: 'NeuzeitGro-Lig',
                        }}
                      >
                        Ver lista completa
                      </Text>

                      <Icons name="chevron-right" color="#4595EC" />
                    </Box>
                  </TouchableOpacity>
                </Box>
              )}
            />
          </Box>
        </PaymentStatusContainer>
      </ScrollView>

      <ModalComponent
        isVisible={modalState}
        onBackdropPress={() => {
          if (!loadingUpdate) {
            toggleModal();
          }
        }}
        // backdropColor="#FFF"
        useNativeDriver
        backdropTransitionOutTiming={0}
        useNativeDriverForBackdrop
      >
        {modalState ? (
          <ModalContentContainer style={{ paddingHorizontal: 23 }}>
            {loadingUpdate ? (
              <Box>
                <ActivityIndicator size="large" color="#0564FF" />
                <Text>Sincronizando checkins...</Text>
              </Box>
            ) : (
              <Box
                width="100%"
                // height={heightPercentageToDP('30')}
                justifyContent="space-between"
                paddingBottom={20}
              >
                <Box
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box alignItems="center">
                    <Icons name="user" height={32} width={24} />
                    <Text style={{ color: 'rgba(22, 28, 37, 0.4)' }}>
                      Você Registrou
                    </Text>
                    <TitleText
                      style={{
                        marginBottom: 8,
                        fontFamily: 'NeuzeitGro-Bol',
                        fontSize: 20,
                        lineHeight: 20,
                        marginTop: -5,
                      }}
                    >
                      {checkins?.length} Atletas
                    </TitleText>
                  </Box>
                </Box>

                <Box marginTop={50}>
                  <Text>
                    Você deseja fazer o subir os check-ins dos atletas
                    registrados?
                  </Text>
                </Box>

                <Box
                  width={1}
                  flexDirection="row"
                  width="100%"
                  justifyContent="space-between"
                  marginTop={54}
                  paddingHorizontal={20}
                >
                  <TouchableOpacity
                    style={{
                      paddingVertical: 13,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                    }}
                    onPress={() => {
                      toggleModal();
                      navigation.goBack();
                    }}
                  >
                    <Icons
                      name="close"
                      color={lightTheme.colors.semantic.red}
                      style={{ marginRight: 12 }}
                      width={16}
                    />
                    <Text style={{ color: lightTheme.colors.semantic.red }}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: '#4595EC',
                      paddingVertical: 13,
                      paddingHorizontal: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      marginLeft: 32,
                      width: 120,
                    }}
                    onPress={() => {
                      handleSavePoints();
                      // setCanSelectPoints(true);
                    }}
                  >
                    <Text style={{ color: lightTheme.colors.textWhite }}>
                      Sim
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Box>
            )}
          </ModalContentContainer>
        ) : null}
      </ModalComponent>
    </SafeAreaView>
  );
};

export default ChallengeMyPayment;
