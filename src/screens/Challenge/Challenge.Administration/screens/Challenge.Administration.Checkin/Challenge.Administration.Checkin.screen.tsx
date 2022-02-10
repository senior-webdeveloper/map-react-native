/* eslint-disable react/jsx-props-no-spreading */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine-distance';
import styled from 'styled-components/native';
import ModalComponent from 'react-native-modal';
import { layout, space, flexbox } from 'styled-system';
import { ProgressBar, ActivityIndicator } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import * as Sentry from '@sentry/react-native';
import uuid from 'react-native-uuid';
import Toast from 'react-native-simple-toast';
import { Modalize } from 'react-native-modalize';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import LinearGradient from 'react-native-linear-gradient';
import { format } from 'date-fns';
import { Icons, Text, TitleText, Box } from '~/components';
import { ChallengeAdministrationRouteList } from '../../Challenge.Administration.routes';
import { useCreateUserPassageAtSupportPointMutation } from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks';
import { EventSupportPointType } from '~/graphql/autogenerate/schemas';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import {
  dbEventPoints,
  IEventPointSchema,
  dbEventPointsOffline,
  IEventPointsOfflineSchema,
  dbEventPointsAdminstrationOffline,
  IEventPointsAdminstrationOffline,
} from '~/db';
import { useStoreState } from '~/store';
import { lightTheme } from '~/global/themes';
import locale from '~/helpers/dateLocale';

type ChallengeDescriptionRouteProp = RouteProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.Checkin'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.Checkin'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

export const HeaderText = styled(TitleText)`
  font-size: 24px;
  line-height: 28px;
  margin-top: 6px;
`;
export const DescriptionText = styled(Text)`
  font-size: 20px;
  line-height: 23px;
  color: rgba(22, 28, 37, 0.56);
  margin-top: 40px;
`;
export const Container = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;
export const ImageContainer = styled.View`
  align-items: center;
  margin-top: 15px;
  margin-bottom: 45px;
`;
export const ArrowButtonContainer = styled.View`
  background-color: #0564ff;
  border-radius: 100px;
  width: 56px;
  height: 56px;
  align-items: center;
  justify-content: center;
`;
export const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const HeaderContainer = styled.View`
  flex-direction: row;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  justify-content: space-between;
  margin-top: ${heightPercentageToDP('3')};
  margin-bottom: 36px;
`;
export const JumpContainer = styled.TouchableOpacity`
  width: 64px;
  height: 24px;
  opacity: 0.3;
  border-width: 1px;
  border-color: #161c25;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
`;
export const Title = styled(TitleText)`
  color: ${({ theme }) => theme.colors.blue};
  font-size: 46px;
  line-height: 55px;
`;

export const AlertContainer = styled.View`
  background-color: #fff;
  padding-vertical: 24px;
  padding-horizontal: 24px;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
`;

export const BlueButton = styled.TouchableOpacity`
  margin-right: 8px;
  width: 120px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, loading }) =>
    loading ? theme.colors.backgroundGray : theme.colors.blue};
  border-radius: 24px;
`;
export const GrayButton = styled.TouchableOpacity`
  width: 120px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.text};
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

export default function ChallengeAdministrationCheckin({
  route,
  navigation,
}: Props): JSX.Element {
  const modalizeRef = useRef<Modalize>(null);
  const [data, setData] = useState<EventSupportPointType[]>(
    route.params.data?.getChallengeDetail.support_points,
  );
  const [checkins, setCheckins] = useState<
    Realm.Results<IEventPointSchema & Realm.Object>
  >();
  const [modalConfirmationState, setModalConfirmationState] = useState(false);
  const [readInformation, setReadInformation] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [canCheckUser, setCanCheckUser] = useState(true);
  const [nearPoint, setNearPoint] = useState<EventSupportPointType>();
  const [checkinsCount, setCheckinsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState(true);
  const [canSelectPoints, setCanSelectPoints] = useState(false);
  const scanner = useRef<QRCodeScanner>(null);
  const appState = useRef(AppState.currentState);
  const { userID } = useUserToken();
  const networkIsConnected = useStoreState(
    (state) => state.network.isConnected,
  );

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const [
    createUserPassageAtSupportPointMutation,
    { loading: loadingCreate },
  ] = useCreateUserPassageAtSupportPointMutation({
    onCompleted: (e) => {
      Sentry.captureMessage(JSON.stringify(e.createUserPassageAtSupportPoint));
      console.log('Completou: ', e.createUserPassageAtSupportPoint);
      setLoadingUpdate(false);
    },
  });

  const handleGetCheckins = async () => {
    const realm = await dbEventPoints();

    if (!realm.empty) {
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
        setCheckins(localPoints);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleGetCheckins();
    });

    return unsubscribe;
  }, [navigation]);

  const SelectOptions = () => (
    <>
      <RadioForm formHorizontal={false} animation style={{ width: '100%' }}>
        {/* To create radio buttons, loop through your array of options */}
        {data &&
          data.map((point, i) => (
            <RadioButton
              labelHorizontal
              key={i}
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              {/*  You can set RadioButtonLabel before RadioButtonInput */}
              <RadioButtonInput
                obj={point}
                index={i}
                initial={0}
                isSelected={nearPoint?.id === point.id}
                onPress={() => {
                  setNearPoint(point);
                }}
                borderWidth={0.5}
                buttonInnerColor={
                  nearPoint?.id === point.id ? '#0564FF' : '#000'
                }
                buttonOuterColor={
                  nearPoint?.id === point.id
                    ? '#0564FF'
                    : 'rgba(135, 149, 173, 0.64)'
                }
                buttonSize={14}
                buttonOuterSize={24}
                buttonStyle={{}}
              />

              <TouchableOpacity
                onPress={() => {
                  setNearPoint(point);
                }}
                style={{
                  paddingVertical: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="88%"
                  marginLeft={12}
                >
                  <Text>{point.name}</Text>
                  <Text style={{ color: '#4595EC' }}>
                    {haversine(
                      {
                        latitude: point.latitude,
                        longitude: point.longitude,
                      },
                      {
                        latitude: Number(coords.latitude),
                        longitude: Number(coords.longitude),
                      },
                    ) < 1000
                      ? `${haversine(
                          {
                            latitude: point.latitude,
                            longitude: point.longitude,
                          },
                          {
                            latitude: Number(coords.latitude),
                            longitude: Number(coords.longitude),
                          },
                        ).toFixed(0)} metros`
                      : `${Number(
                          haversine(
                            {
                              latitude: point.latitude,
                              longitude: point.longitude,
                            },
                            {
                              latitude: Number(coords.latitude),
                              longitude: Number(coords.longitude),
                            },
                          ) / 1000,
                        ).toFixed(0)} km`}
                  </Text>
                </Box>
                {nearPoint && nearPoint.id === point.id ? (
                  <Icons name="check" />
                ) : null}
              </TouchableOpacity>
            </RadioButton>
          ))}
      </RadioForm>
    </>
  );

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
        const {
          data: eventReturn,
        } = await createUserPassageAtSupportPointMutation({
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

  useEffect(() => {
    if (networkIsConnected) {
      handleSavePoints();
    }
  }, [networkIsConnected]);

  const getCheckinCount = async () => {
    const realm = await dbEventPointsAdminstrationOffline();

    const localMonitor = realm.objectForPrimaryKey<IEventPointsAdminstrationOffline>(
      'EventPointsAdminOffline',
      userID,
    );
    if (localMonitor) {
      setCheckinsCount(localMonitor.count);
    }
  };

  const saveCheckinCount = async () => {
    const realm = await dbEventPointsAdminstrationOffline();

    const localMonitor = realm.objectForPrimaryKey<IEventPointsAdminstrationOffline>(
      'EventPointsAdminOffline',
      userID,
    );
    if (localMonitor) {
      realm.write(() => {
        localMonitor.count += checkinsCount;
      });
    } else {
      realm.write(() => {
        realm.create<IEventPointsAdminstrationOffline>(
          'EventPointsAdminOffline',
          {
            id: userID,
            count: checkinsCount,
          },
        );
      });
    }
  };

  const getLocalEventPoints = async () => {
    const realm = await dbEventPointsOffline();

    const localMonitor = realm.objectForPrimaryKey<IEventPointsOfflineSchema>(
      'EventPointsOffline',
      route.params.challenge_id,
    );
    if (localMonitor) {
      setData(JSON.parse(localMonitor));
    }
  };

  const [coords, setCoords] = useState<{
    latitude: string;
    longitude: string;
  }>();

  const saveLocalEventPoints = async (data) => {
    const realm = await dbEventPointsOffline();

    const localMonitor = realm.objectForPrimaryKey<IEventPointsOfflineSchema>(
      'EventPointsOffline',
      route.params.challenge_id,
    );
    if (localMonitor) {
      realm.write(() => {
        localMonitor.content = JSON.stringify(data);
      });
    } else {
      realm.write(() => {
        realm.create<IEventPointsOfflineSchema>('EventPointsOffline', {
          id: route.params.challenge_id,
          content: JSON.stringify(data),
          updated_at: new Date().toISOString(),
        });
      });
    }
  };

  const handleLocalPoints = async () => {
    const realm = await dbEventPoints();

    const localMonitor = realm.objects<IEventPointSchema>('EventPoints');
    setCheckinsCount(localMonitor.length);
  };

  const saveMonitorLocal = async (id: string) => {
    setCheckinsCount((prevState) => prevState + 1);
    const realm = await dbEventPoints();

    realm.write(() => {
      realm.create<IEventPointSchema>('EventPoints', {
        id: String(uuid.v4()),
        challengeId: route.params.challenge_id,
        checkTime: new Date().toISOString(),
        latitude: Number(coords?.latitude),
        longitude: Number(coords?.longitude),
        userCheck: true,
        pointId: String(nearPoint?.id),
        userShortId: id,
      });
    });

    if (networkIsConnected) {
      handleSavePoints();
    }
  };

  function toggleModal() {
    setModalState(!modalState);
  }

  useEffect(() => {
    if (data?.findEventSupportPoints) {
      saveLocalEventPoints(data);
    }
  }, [data]);

  const width = {
    from: {
      width: 0,
    },
    to: {
      width: 130,
    },
  };

  useEffect(() => {
    if (route.params) {
      getCheckinCount();
      handleLocalPoints();
      Geolocation.getCurrentPosition(
        (position) => {
          setCoords(position.coords);
          console.log(position);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
      if (networkIsConnected) {
        fetch({
          variables: {
            challenge_id: route.params.challenge_id,
          },
        });
      } else {
        getLocalEventPoints();
      }
    }
  }, [route.params]);

  const hasPointNear = (points: EventSupportPointType[]) => {
    let lastHaversineDistance;
    for (const point in points) {
      if (Object.prototype.hasOwnProperty.call(points, point)) {
        const element = points[point];

        lastHaversineDistance = haversine(
          { latitude: element.latitude, longitude: element.longitude },
          {
            latitude: Number(coords.latitude),
            longitude: Number(coords.longitude),
          },
        );

        if (lastHaversineDistance <= 100) {
          setNearPoint(element);
          console.log('element: ', element);

          toggleModal();
          setLoading(false);
        }
      }
    }
    if (lastHaversineDistance > 100) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data && coords) {
      hasPointNear(data);
    }
  }, [data, coords]);

  const onSuccess = (e) => {
    setCanCheckUser(true);
    setReadInformation(e.data);
    handleGetCheckins();

    setTimeout(() => {
      setModalConfirmationState(true);
    }, 250);
  };

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (checkinsCount === 0) {
        getCheckinCount();
        if (networkIsConnected) {
          handleSavePoints();
        }
      }
    }

    if (nextAppState === 'background') {
      saveCheckinCount();
      if (networkIsConnected) {
        handleSavePoints();
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const TopContent = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
      }}
    >
      <TouchableOpacity
        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Icons name="arrow-left" />
      </TouchableOpacity>
      <Box alignItems="center">
        <TitleText>{nearPoint?.name}</TitleText>
      </Box>

      <TouchableOpacity
        onPress={() => setModalState(true)}
        hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
      >
        <Box>
          <Icons name="dots-horizontal" />
        </Box>
      </TouchableOpacity>
    </View>
  );

  const BottomContent = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
      }}
    >
      <BlueButton
        // disabled={loadingCreate}
        // loading={loadingCreate}
        onPress={() => {
          onOpen();
          // customSavePoints();
        }}
      >
        {loadingCreate ? (
          <ActivityIndicator color="#0564FF" />
        ) : (
          <Text style={{ color: 'white' }}>Enviar Checkins</Text>
        )}
      </BlueButton>
    </View>
  );

  const ModalizeComponent = () => {
    return (
      <Box paddingHorizontal={16} paddingVertical={32}>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row" alignItems="center">
            <Icons name="gps-marker" style={{ marginRight: 12 }} />
            <Text>{nearPoint?.name}</Text>
          </Box>
          <Text style={{ color: '#4595EC' }}>
            {Number(
              haversine(
                {
                  latitude: nearPoint.latitude,
                  longitude: nearPoint.longitude,
                },
                {
                  latitude: Number(coords.latitude),
                  longitude: Number(coords.longitude),
                },
              ) / 1000,
            ).toFixed(0)}{' '}
            metros
          </Text>
        </Box>

        <Box
          borderTopColor="rgba(22, 28, 37, 0.2)"
          borderTopWidth="0.5"
          mt={24}
          paddingTop={24}
        >
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text style={{ fontSize: 20, fontFamily: 'NeuzeitGro-Bol' }}>
              Atletas Registrados
            </Text>

            <TouchableOpacity
              disabled={loadingUpdate}
              onPress={() => handleSavePoints()}
            >
              {loadingUpdate ? (
                <ActivityIndicator color="#4595EC" />
              ) : (
                <Text style={{ fontSize: 14, color: '#4595EC' }}>
                  Enviar registros
                </Text>
              )}
            </TouchableOpacity>
          </Box>
        </Box>

        <FlatList
          style={{ width: '100%' }}
          data={checkins}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          ItemSeparatorComponent={() => (
            <Box
              marginVertical={8}
              borderBottomWidth={1}
              borderBottomColor="#161c252b"
            />
          )}
          ListEmptyComponent={() => (
            <Box width="100%" alignItems="center" marginTop={30}>
              <Text
                style={{
                  width: widthPercentageToDP('70'),
                  textAlign: 'center',
                }}
              >
                Parece que todos os atletas estão sincronizados.
              </Text>
            </Box>
          )}
          renderItem={({ item: element }) => (
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <Icons name="user-avatar" style={{ marginRight: 17 }} />
                <Box>
                  <Text>Nº {element.userShortId}</Text>
                  <Text
                    style={{
                      fontFamily: 'NeuzeitGro-Lig',
                      fontSize: 14,
                      lineHeight: 16,
                      color: 'rgba(22, 28, 37, 0.56)',
                      marginTop: -3,
                    }}
                  >
                    {format(new Date(element.checkTime), 'P', {
                      locale,
                    })}
                  </Text>
                </Box>
              </Box>
              <Text style={{ color: '#009D33', fontSize: 14, lineHeight: 16 }}>
                {format(new Date(element.checkTime), 'pp', {
                  locale,
                })}
              </Text>
            </Box>
          )}
        />
      </Box>
    );
  };

  return (
    <>
      {nearPoint ? (
        <>
          <QRCodeScanner
            showMarker
            ref={scanner}
            onRead={(e) => onSuccess(e)}
            topContent={<TopContent />}
            // bottomContent={<BottomContent />}
            cameraStyle={{
              height: heightPercentageToDP('80'),
              marginTop: -20,
              marginBottom: -40,
            }}
            topViewStyle={{
              maxHeight: 100,
              paddingTop: 40,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
              zIndex: 2,
              elevation: 1,
            }}
          />
          <LinearGradient
            colors={[
              'transparent',
              'transparent',
              'rgba(0, 0, 0, 0.5)',
              'rgba(0, 0, 0, 0.5)',
            ]}
            style={{
              height: heightPercentageToDP('60'),
              position: 'absolute',
              width: widthPercentageToDP('100'),
              bottom: 0,
              alignItems: 'center',
              paddingTop: heightPercentageToDP('30'),
            }}
          >
            <Text style={{ color: 'white' }}>Você Registrou</Text>
            <Text
              style={{
                color: 'white',
                fontSize: 24,
                fontFamily: 'NeuzeitGro-Bol',
              }}
            >
              {checkinsCount} Atletas
            </Text>
            {loadingUpdate ? (
              <Text style={{ color: 'white' }}>Enviando Registros ...</Text>
            ) : null}
          </LinearGradient>
          <Modalize ref={modalizeRef} alwaysOpen={100}>
            <ModalizeComponent />
          </Modalize>
        </>
      ) : null}

      <ModalComponent
        isVisible={modalState}
        onBackdropPress={() => {
          toggleModal();
          if (!nearPoint) {
            navigation.goBack();
          }
        }}
        // backdropColor="#FFF"
        useNativeDriver
        backdropTransitionOutTiming={0}
        useNativeDriverForBackdrop
      >
        {modalState ? (
          <ModalContentContainer
            {...(canSelectPoints
              ? {
                  height: heightPercentageToDP('80'),
                }
              : null)}
          >
            {loading && !nearPoint ? (
              <View>
                <ActivityIndicator size="large" color="#0564FF" />
                {/* <TouchableOpacity
                  onPress={() => {
                    setLoading(!loading);
                    // setNearPoint(point);
                    // toggleModal();
                  }}
                > */}
                <Text style={{ textAlign: 'center', marginTop: 30 }}>
                  Localizando pontos de apoios proximos.
                </Text>
                {/* </TouchableOpacity> */}
              </View>
            ) : (
              <>
                {canSelectPoints && data ? (
                  <Box
                    width="100%"
                    height={heightPercentageToDP('80')}
                    justifyContent="space-between"
                    paddingBottom={20}
                  >
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      paddingTop={22}
                    >
                      <Box>
                        <Text style={{ color: 'rgba(22, 28, 37, 0.4)' }}>
                          Selecione o seu
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
                          Ponto de Apoio
                        </TitleText>
                      </Box>

                      <TouchableOpacity
                        onPress={() => {
                          if (!nearPoint) {
                            navigation.goBack();
                          } else {
                            toggleModal();
                          }
                        }}
                      >
                        <Box marginTop={10}>
                          <Icons name="close" width={16} />
                        </Box>
                      </TouchableOpacity>
                    </Box>

                    <ScrollView style={{ marginTop: 30 }}>
                      <SelectOptions />
                    </ScrollView>

                    <TouchableOpacity
                      disabled={!nearPoint}
                      onPress={() => {
                        toggleModal();
                      }}
                    >
                      <Box
                        backgroundColor="#4595EC"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        paddingVertical={12}
                        borderRadius={4}
                      >
                        <Icons
                          name="gps-marker"
                          style={{ marginRight: 12 }}
                          color="white"
                        />
                        <Text style={{ color: 'white' }}>Fazer Check-in</Text>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                ) : (
                  <Box
                    width="100%"
                    // height={heightPercentageToDP('30')}
                    justifyContent="space-between"
                    paddingBottom={20}
                  >
                    <Box flexDirection="row" justifyContent="space-between">
                      <Box>
                        <Text style={{ color: 'rgba(22, 28, 37, 0.4)' }}>
                          Selecione o seu
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
                          Ponto de Apoio
                        </TitleText>
                      </Box>

                      <TouchableOpacity
                        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                        onPress={() => {
                          toggleModal();
                          if (!nearPoint) {
                            navigation.goBack();
                          }
                        }}
                      >
                        <Box marginTop={10}>
                          <Icons name="close" width={16} />
                        </Box>
                      </TouchableOpacity>
                    </Box>

                    <Box marginTop={50}>
                      <Text>
                        Parece que você não está próximo a nenhum ponto de apoio
                        cadastrado. Você poderá seguir com o Checkin, mas
                        lembre-se que não é o ideal.
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
                          color="#4595EC"
                          style={{ marginRight: 12 }}
                          width={16}
                        />
                        <Text style={{ color: '#4595EC' }}>Cancelar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          backgroundColor: lightTheme.colors.semantic.red,
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
                          setCanSelectPoints(true);
                        }}
                      >
                        <Text style={{ color: lightTheme.colors.textWhite }}>
                          Sim
                        </Text>
                      </TouchableOpacity>
                    </Box>
                  </Box>
                  // <Box>
                  //   <View
                  //     style={{
                  //       justifyContent: 'flex-end',
                  //       flexDirection: 'row',
                  //       marginBottom: 15,
                  //       width: '100%',
                  //     }}
                  //   >
                  //     <TouchableOpacity
                  //       onPress={() => {
                  //         toggleModal();
                  //         navigation.goBack();
                  //       }}
                  //       hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  //     >
                  //       <Icons name="close" />
                  //     </TouchableOpacity>
                  //   </View>
                  //   <Text
                  //     style={{
                  //       marginBottom: 8,
                  //       fontFamily: 'NeuzeitGro-Bol',
                  //     }}
                  //   >
                  //     Atenção
                  //   </Text>
                  //   <Text>
                  //     Parece que você não está próximo a nenhum ponto de apoio
                  //     cadastrado. Você poderá seguir com o Checkin, mas
                  //     lembre-se que não é o ideal.
                  //   </Text>
                  //   <View
                  //     style={{
                  //       flexDirection: 'row',
                  //       alignItems: 'center',
                  //       justifyContent: 'center',
                  //       marginTop: 24,
                  //     }}
                  //   >
                  //     <BlueButton
                  //       disabled={loading}
                  //       onPress={() => {
                  //         setCanSelectPoints(true);
                  //       }}
                  //     >
                  //       <Text style={{ color: 'white' }}>Continuar</Text>
                  //     </BlueButton>

                  //     <GrayButton
                  //       onPress={() => {
                  //         toggleModal();
                  //         navigation.goBack();
                  //       }}
                  //     >
                  //       <Text>Cancel</Text>
                  //     </GrayButton>
                  //   </View>
                  // </Box>
                )}
              </>
            )}
          </ModalContentContainer>
        ) : null}
      </ModalComponent>

      <ModalComponent
        isVisible={modalConfirmationState}
        onBackdropPress={() => {
          // if (!nearPoint) {
          //   navigation.goBack();
          // }
        }}
        // backdropColor="#FFF"
        useNativeDriver
        backdropTransitionOutTiming={0}
        useNativeDriverForBackdrop
      >
        {modalConfirmationState ? (
          <ModalContentContainer alignItems="center">
            <Box px={20}>
              <Text
                style={{
                  fontFamily: 'NeuzeitGro-Bol',
                  fontSize: 20,
                  lineHeight: 23,
                  textAlign: 'center',
                  marginBottom: 45,
                }}
              >
                ATENÇÃO
              </Text>
              <Text>Você deseja confirmar a passagem do atleta</Text>
              <Text
                style={{
                  marginBottom: 8,
                  fontFamily: 'NeuzeitGro-Bol',
                  fontSize: 20,
                  lineHeight: 23,
                  marginTop: 24,
                }}
              >
                {readInformation}
              </Text>

              <Box
                width={widthPercentageToDP('75')}
                flexDirection="row"
                justifyContent="space-between"
                marginTop={54}
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
                    setModalConfirmationState(false);
                    scanner.current?.reactivate();
                  }}
                >
                  <Icons
                    name="close"
                    color={lightTheme.colors.semantic.blue}
                    style={{ marginRight: 12 }}
                    width={16}
                  />
                  <Text style={{ color: lightTheme.colors.semantic.blue }}>
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
                    overflow: 'hidden',
                  }}
                  onPress={() => {
                    setModalConfirmationState(false);
                  }}
                >
                  <Text style={{ color: lightTheme.colors.textWhite }}>
                    Sim
                  </Text>

                  <Animatable.View
                    onAnimationEnd={() => {
                      if (modalConfirmationState) {
                        setModalConfirmationState(false);
                      }
                      saveMonitorLocal(readInformation);
                      scanner.current?.reactivate();
                    }}
                    animation={width}
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
                        width: 120,
                        height: 5,
                      }}
                    />
                  </Animatable.View>
                </TouchableOpacity>
              </Box>
            </Box>
          </ModalContentContainer>
        ) : null}
      </ModalComponent>
    </>
  );
}
