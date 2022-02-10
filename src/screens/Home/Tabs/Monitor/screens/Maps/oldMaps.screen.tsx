import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  StatusBar,
  Animated,
  AppState,
  Easing,
  Image,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import Geolocation, {
  clearWatch,
  PositionError,
} from 'react-native-geolocation-service';
import haversine from 'haversine-distance';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { lineString as makeLineString } from '@turf/helpers';
import { checkMultiple, PERMISSIONS } from 'react-native-permissions';
import styled from 'styled-components/native';
import { id } from 'date-fns/locale';
import { dbMonitor, ICoodinateSchema, IMonitorSchema } from '~/db';
import formatSecondsInHours from '~/helpers/formatSecondsInHours';
import {
  Icons,
  Picker,
  SafeAreaView,
  SmallText,
  Switch,
  Text,
  TitleText,
} from '~/components';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { PaymentStatusContainer } from '~/screens/Challenge/Challenge.ChangeAddressToReceive/Challenge.ChangeAddressToReceive.screen';
import { useStoreActions } from '~/store';
import SaveActivity from '../SaveActivity/SaveActivity.screen';

const MAPBOX_KEY =
  'pk.eyJ1IjoicmlkZXJpemUiLCJhIjoiY2tjamJ5emZxMHo0MzMxcWl2MTE3bWR0aiJ9.ZTxTHUqcNRx4smuNTfPuXg';

MapboxGL.setAccessToken(MAPBOX_KEY);

const MAX_VIEW_HEIGHT = heightPercentageToDP('72');

function SmallRideInfo({
  distance = 0,
  timer = 0,
  speed = 0,
}: {
  distance?: number;
  timer?: number;
  speed?: number;
}) {
  const CommonTitle = styled(SmallText)`
    font-size: 14px;
  `;
  const CommonDescription = styled(TitleText)`
    font-size: 36px;
    line-height: 36px;
  `;
  const HourDescription = styled(TitleText)`
    font-size: 48px;
    line-height: 48px;
  `;
  const BoxView = styled.View`
    padding-vertical: 24px;
    align-items: center;
    border-bottom-width: 0.5px;
    border-color: rgba(22, 28, 37, 0.2);
  `;
  interface HalfBoxViewProps {
    isLeft: boolean;
  }
  const HalftBoxView = styled.View<HalfBoxViewProps>`
    padding-vertical: 24px;
    align-items: center;
    width: ${widthPercentageToDP(50)}px;
    border-right-width: ${({ isLeft }) => (isLeft ? '0.5px' : '0px')};
    border-color: rgba(22, 28, 37, 0.2);
  `;
  const BoxWrapper = styled.View`
    flex-direction: row;
    justify-content: space-between;
  `;
  return (
    <View
      style={{
        justifyContent: 'space-between',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
      }}
    >
      <BoxView>
        <CommonTitle>TEMPO</CommonTitle>
        <HourDescription>{formatSecondsInHours(timer)}</HourDescription>
      </BoxView>

      <BoxWrapper>
        <HalftBoxView isLeft>
          <CommonTitle>DISTANCIA (km)</CommonTitle>
          <CommonDescription>
            {distance < 1000
              ? Number(distance / 1000).toFixed(2)
              : Number(distance / 1000).toFixed(2)}
          </CommonDescription>
        </HalftBoxView>

        <HalftBoxView>
          <CommonTitle>VELOCIDADE ATUAL (km/h)</CommonTitle>
          <CommonDescription>
            {!Number.isInteger(speed * 3.6)
              ? Number(speed > 0 ? speed * 3.6 : 0).toFixed(1)
              : Number(speed > 0 ? speed * 3.6 : 0).toFixed(0)}
            {/* {Number(speed > 0 ? speed * 3.6 : 0).toFixed(1)} */}
          </CommonDescription>
        </HalftBoxView>
      </BoxWrapper>
    </View>
  );
}

function SmallOtherRideInfo({
  distance = 0,
  timer = 0,
  totalElevationGain = 0,
  totalElevationPerch = 0,
}: {
  totalElevationGain: number;
  totalElevationPerch: number;
  distance: number;
  timer: number;
}) {
  const CommonTitle = styled(SmallText)`
    font-size: 14px;
  `;
  const CommonDescription = styled(TitleText)`
    font-size: 36px;
    line-height: 36px;
  `;
  const HourDescription = styled(TitleText)`
    font-size: 48px;
    line-height: 48px;
  `;
  const BoxView = styled.View`
    padding-vertical: 24px;
    align-items: center;
    border-bottom-width: 0.5px;
    border-color: rgba(22, 28, 37, 0.2);
  `;
  interface HalfBoxViewProps {
    isLeft: boolean;
  }
  const HalftBoxView = styled.View<HalfBoxViewProps>`
    padding-vertical: 24px;
    align-items: center;
    width: ${widthPercentageToDP(50)}px;
    border-right-width: ${({ isLeft }) => (isLeft ? '0.5px' : '0px')};
    border-color: rgba(22, 28, 37, 0.2);
  `;
  const BoxWrapper = styled.View`
    flex-direction: row;
    justify-content: space-between;
  `;
  return (
    <View
      style={{
        justifyContent: 'space-between',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
      }}
    >
      <BoxView>
        <CommonTitle>VELOCIDADE MEDIA (km/h)</CommonTitle>
        <HourDescription>
          {Number((distance / timer) * 3.6).toFixed(0)}
        </HourDescription>
      </BoxView>

      <BoxWrapper>
        <HalftBoxView isLeft>
          <CommonTitle>Ganho de Elevacao (m)</CommonTitle>
          <CommonDescription>
            {Number(totalElevationGain).toFixed(0)}
          </CommonDescription>
        </HalftBoxView>

        <HalftBoxView>
          <CommonTitle>Perca de Elevacao (m)</CommonTitle>
          <CommonDescription>
            {Number(totalElevationPerch).toFixed(0)}
          </CommonDescription>
        </HalftBoxView>
      </BoxWrapper>
    </View>
  );
}

function Settings({ show }) {
  const [keepScreenOn, setKeepScreenOn] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const OptionContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom-width: 1px;
    border-bottom-color: #efefef;
  `;
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          alignItems: 'center',
          paddingVertical: 14,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            show((prevState) => !prevState);
          }}
        >
          <Icons name="arrow-left" height={13} width={18} />
        </TouchableOpacity>

        <Text>CONFIGURACOES</Text>

        <View style={{ width: 20 }} />
        {/* <TouchableOpacity onPress={() => {}}>
          <Icons name="settings" height={18} width={18} />
        </TouchableOpacity> */}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <OptionContainer>
          <Text>Manter a Tela Ligada</Text>
          <Switch
            active={keepScreenOn}
            setActive={() => {
              setKeepScreenOn((prevState) => !prevState);
            }}
          />
        </OptionContainer>

        <OptionContainer>
          <Text>Permitir Voz com Estatísticas</Text>
          <Switch
            active={voiceOn}
            setActive={() => {
              setVoiceOn((prevState) => !prevState);
            }}
          />
        </OptionContainer>
        {voiceOn && (
          <>
            <OptionContainer>
              <Text>Tipo da voz</Text>
              <Picker
                onChangeValue={(e) => console.log(e)}
                placeholder={{ label: 'Voz Feminina', value: 'fem' }}
                data={[
                  { label: 'Voz Masculina', value: 'masc' },
                  { label: 'Voz Customizada', value: 'cust' },
                ]}
              />
            </OptionContainer>

            <OptionContainer>
              <Text>Periodo do Alerta (KM)</Text>
              <Picker
                onChangeValue={(e) => console.log(e)}
                placeholder={{ label: '5km em 5km', value: '5' }}
                data={[
                  { label: '10km em 10km', value: '10' },
                  { label: '15km em 15km', value: '15' },
                ]}
              />
            </OptionContainer>

            <OptionContainer>
              <Text>Periodo do Alerta (Minutos)</Text>
              <Picker
                onChangeValue={(e) => console.log(e)}
                placeholder={{ label: '5min em 5min', value: '5' }}
                data={[
                  { label: '10min em 10min', value: '10' },
                  { label: '15min em 15min', value: '15' },
                ]}
              />
            </OptionContainer>
          </>
        )}
      </View>
    </View>
  );
}

export default function Monitor({ navigation }): JSX.Element {
  const setMonitorStatus = useStoreActions(
    (actions) => actions.monitor.setStates,
  );
  const [previousCoords, setPreviousCoords] = useState<MapboxGL.Location>();
  const [startActivity, setStartActivity] = useState(false);
  const [showSmallInfo, setShowSmallInfo] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [shapeLine, setShapeLine] = useState();
  const [showPreciseInfo, setShowPreciseInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasGPSPermission, setHasGPSPermission] = useState(false);
  const [showSaveActivity, setShowSaveActivity] = useState(false);
  const [coords, setCoords] = useState<number[][]>();
  const [errorCode, setErrorCode] = useState<PositionError>();
  const [showSucessMessage, setShowSucessMessage] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [start, setStart] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>();

  const [automaticPause, setAutomaticPause] = useState<boolean>();
  const [pauseTimer, setPauseTimer] = useState<number>(0);
  const [startAutomaticPauseTimer, setStartAutomaticPauseTimer] =
    useState<boolean>(false);

  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef(0);
  const [movingTime, setMovingTime] = useState<number>(0);
  const movingTimeRef = useRef(0);
  const [actualLocations, setLocation] = useState();
  const [speed, setSpeed] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [totalElevationGain, setTotalElevationGain] = useState(0);
  const [totalElevationPerch, setTotalElevationPerch] = useState(0);
  const watchId = useRef(null);

  const handleAutomaticPauseStart = () => {
    setStartAutomaticPauseTimer(true);
  };

  useEffect(() => {
    console.log('chamou', startAutomaticPauseTimer);
    if (startAutomaticPauseTimer) {
      if (pauseTimer > 7) {
        setAutomaticPause(true);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        clearInterval(this.intervalPause);
        return;
      }
      const intervalPause = setInterval(() => {
        setPauseTimer((prevState) => prevState + 1);
        clearInterval(intervalPause);
      }, 980);
    } else {
      setAutomaticPause(false);
      setPauseTimer(0);
      clearInterval(this.intervalPause);
    }
  }, [startAutomaticPauseTimer, pauseTimer]);

  const handleAutomaticPauseStop = () => {
    setStartAutomaticPauseTimer(false);
  };

  const handleLocationUpdates = (props) => {
    if (props.coords.speed && props.coords.speed > 1) {
      if (
        props.coords.speed > 5 &&
        previousCoords &&
        props.coords.heading !== previousCoords?.coords.heading
      ) {
        handleAutomaticPauseStop();
      }
      if (coords !== undefined && coords.length >= 1) {
        setElevation(props.coords.altitude);
        if (
          previousCoords &&
          previousCoords.coords.altitude > props.coords.altitude
        ) {
          setTotalElevationGain(
            (prevState) =>
              prevState +
              (previousCoords.coords.altitude - props.coords.altitude),
          );
        } else if (
          previousCoords &&
          previousCoords.coords.altitude < props.coords.altitude
        ) {
          setTotalElevationPerch(
            (prevState) =>
              prevState +
              (props.coords.altitude - previousCoords.coords.altitude),
          );
        }
        setPreviousCoords(props);
        if (!pause || !automaticPause) {
          setCoords([
            ...coords,
            [props.coords.longitude, props.coords.latitude],
          ]);
        }
        setSpeed(props.coords.speed);
        if (coords.length >= 2) {
          setShapeLine(makeLineString(coords));
        }
        saveMonitorLocal(props);
        if (previousCoords) {
          const a = {
            latitude: previousCoords.coords.latitude,
            longitude: previousCoords.coords.longitude,
          };
          const b = {
            latitude: props.coords.latitude,
            longitude: props.coords.longitude,
          };
          const distanceInHaversine = haversine(a, b);
          if (distanceInHaversine) {
            setTotalDistance((prevState) => prevState + distanceInHaversine);
          }
        }
      } else {
        console.log('caiu aqui, sem coords', [
          props.coords.longitude,
          props.coords.latitude,
        ]);
        setCoords([[props.coords.longitude, props.coords.latitude]]);
      }
    } else {
      handleAutomaticPauseStart();
    }
  };

  const startLocationCapture = () => {
    watchId.current = Geolocation.watchPosition(
      (props) => {
        setLocation(props);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        // useSignificantChanges: true,
        showsBackgroundLocationIndicator: true,
        accuracy: {
          android: 'high',
          ios: 'bestForNavigation',
        },
      },
    );
  };
  const removeLocationUpdates = useCallback(() => {
    if (watchId.current !== null) {
      // stopForegroundService();
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      // setObserving(false);
    }
  }, []);

  useEffect(() => {
    if (actualLocations) {
      handleLocationUpdates(actualLocations);
    }
  }, [actualLocations]);

  useEffect(() => {
    return () => Geolocation.clearWatch(id);
  }, [coords]);

  useEffect(() => {
    return () => {
      removeLocationUpdates();
    };
  }, [removeLocationUpdates]);

  const saveMonitorLocal = async (customCoords: MapboxGL.Location) => {
    const realm = await dbMonitor();

    const localMonitor = realm.objectForPrimaryKey<IMonitorSchema>(
      'Activity',
      '1',
    );
    if (localMonitor) {
      realm.write(() => {
        const newCoords = realm.create<ICoodinateSchema>('Coordinates', {
          coordinates: [
            customCoords.coords.latitude,
            customCoords.coords.longitude,
          ],
          time: new Date().toISOString(),
          speed: customCoords.coords.speed ? customCoords.coords.speed : 0,
        });

        if (!pause) {
          localMonitor.coordinates = [...localMonitor.coordinates, newCoords];
        }

        localMonitor.distance = totalDistance;
        localMonitor.moving_time = movingTimeRef.current;
        localMonitor.elapsed_time = timerRef.current;
        localMonitor.total_elevation_gain = totalElevationGain;
        localMonitor.total_descent = totalElevationPerch;
        localMonitor.total_ascent = totalElevationGain;
      });
    } else if (coords) {
      console.log('nao tem nada inicial');
      realm.write(() => {
        realm.create<IMonitorSchema>('Activity', {
          last_date_updated: new Date(),
          last_moving_time: movingTimeRef.current,
          distance: totalDistance,
          elapsed_time: 0,
          device_name: 'Iphone',
          id: '1',
          is_private: false,
          moving_time: 0,
          name: 'Pedal',
          polyline: 'teste',
          start_date: new Date().toISOString(),
        });
      });
    }
  };

  useEffect(() => {
    if (!start || AppState.currentState !== 'active') {
      clearInterval(interval);
      return;
    }
    const interval = setInterval(() => {
      timerRef.current += 1;
      setTimer(timerRef.current);
      clearInterval(interval);
    }, 1000);
  }, [start, timer, AppState.currentState]);

  useEffect(() => {
    if (start) {
      if (pause || automaticPause || AppState.currentState !== 'active') {
        console.log('caiu no pause');
        clearInterval(movingInterval);
        return;
      }
      const movingInterval = setInterval(() => {
        movingTimeRef.current += 1;
        setMovingTime(movingTimeRef.current);
        clearInterval(movingInterval);
      }, 1000);
    }
  }, [start, pause, movingTime, automaticPause, AppState.currentState]);

  useEffect(() => {
    if (start && !pause) {
      setMonitorStatus('running');
    } else if (pause || automaticPause) {
      setMonitorStatus('paused');
    } else if (!start && !pause) {
      setMonitorStatus('stopped');
    }
  }, [start, pause, automaticPause]);

  useEffect(() => {
    setTimeout(() => {
      setShowSucessMessage(false);
    }, 5000);
  }, [showSucessMessage]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const result = await checkMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);
      if (result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'denied') {
        setHasGPSPermission(false);
        setShowSucessMessage(false);
        return false;
      }
      setHasGPSPermission(true);

      return true;
    }
    const result = await checkMultiple([
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      PERMISSIONS.IOS.LOCATION_ALWAYS,
    ]);
    if (result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === 'denied') {
      setHasGPSPermission(false);
      setShowSucessMessage(false);
      return false;
    }
    setHasGPSPermission(true);

    return true;
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const handleEndDate = async () => {
    const realm = await dbMonitor();

    const localMonitor = realm.objectForPrimaryKey<IMonitorSchema>(
      'Activity',
      '1',
    );
    if (localMonitor) {
      const elapsedTime = Math.floor(
        Math.abs(
          (new Date(localMonitor.start_date).getTime() - new Date().getTime()) /
            1000,
        ),
      );

      realm.write(() => {
        localMonitor.elapsed_time = elapsedTime;
      });
    }
  };

  const handleProgressTime = async () => {
    const realm = await dbMonitor();

    const localMonitor = realm.objectForPrimaryKey<IMonitorSchema>(
      'Activity',
      '1',
    );
    if (localMonitor) {
      const movingTimeInBackground = Math.floor(
        Math.abs(
          (new Date(localMonitor.last_date_updated).getTime() -
            new Date().getTime()) /
            1000,
        ),
      );

      movingTimeRef.current =
        movingTimeInBackground + localMonitor.last_moving_time;
    }
  };

  const setLastUpdated = async () => {
    console.log('entrou aqui');
    const realm = await dbMonitor();

    const localMonitor = realm.objectForPrimaryKey<IMonitorSchema>(
      'Activity',
      '1',
    );
    if (localMonitor) {
      realm.write(() => {
        localMonitor.last_date_updated = new Date();
        localMonitor.last_moving_time = movingTimeRef.current;
      });
    }
  };

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      handleProgressTime();
      checkPermissions();
    }

    if (nextAppState === 'background') {
      console.log('FOi pra background?', nextAppState);
      setLastUpdated();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    checkPermissions();
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('caiu aqui');
      checkPermissions();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#0564FF"
        translucent={false}
      />

      <View
        style={{
          height: showSaveActivity
            ? heightPercentageToDP('100')
            : heightPercentageToDP('75'),
        }}
      >
        {!startActivity && !showPreciseInfo && !showSaveActivity && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              alignItems: 'center',
              paddingVertical: 14,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Menu');
              }}
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            >
              <Icons name="close" height={13} width={18} />
            </TouchableOpacity>

            <Text>PEDALADA</Text>

            <TouchableOpacity
              onPress={() => {
                setShowSettings((prevState) => !prevState);
              }}
            >
              <Icons name="settings" height={18} width={18} />
            </TouchableOpacity>
          </View>
        )}
        {automaticPause ? (
          <Animated.View
            style={{
              marginBottom: -50,
              backgroundColor: '#FFC502',
              opacity: fadeAnim,
              zIndex: 1000,
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              paddingHorizontal: 16,
              alignItems: 'center',
              paddingVertical: 14,
            }}
          >
            <Text style={{ color: 'white' }}>PAUSADO AUTOMATICAMENTE</Text>
          </Animated.View>
        ) : null}
        {errorCode !== 1 && errorCode !== undefined && !showSucessMessage && (
          <Animated.View
            style={{
              marginBottom: -50,
              backgroundColor: '#FFC502',
              opacity: fadeAnim,
              zIndex: 1000,
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              paddingHorizontal: 16,
              alignItems: 'center',
              paddingVertical: 14,
            }}
          >
            {errorCode === (3 || -1) && (
              <Text style={{ color: 'white' }}>SINAL GPS PERDIDO</Text>
            )}
            {errorCode === 2 && (
              <Text style={{ color: 'white' }}>PROCURANDO SINAL GPS</Text>
            )}
            {errorCode && <Text style={{ color: 'white' }}>{errorCode}</Text>}
          </Animated.View>
        )}

        {showSucessMessage && (
          <Animated.View
            style={{
              marginBottom: -50,
              backgroundColor: '#009D33',
              opacity: 1,
              zIndex: 1000,
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              paddingHorizontal: 16,
              alignItems: 'center',
              paddingVertical: 14,
            }}
          >
            <Text style={{ color: 'white' }}>SINAL GPS OBTIDO</Text>
          </Animated.View>
        )}

        {!hasGPSPermission || errorCode === 1 ? (
          <TouchableOpacity
            onPress={() => {
              navigation.push('Permission.Location');
            }}
          >
            <View
              style={{
                height: MAX_VIEW_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}
            >
              <Icons name="gps" width={100} height={100} />
              <TitleText style={{ marginTop: 20 }}>Permitir GPS</TitleText>
              <Text style={{ textAlign: 'center' }}>
                Você precisa permitir acessarmos os dados de GPS do seu celular
                para poder usar o monitor de pedaladas.
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            {!showSaveActivity ? (
              <View
                style={{
                  width: widthPercentageToDP('100'),
                  height:
                    start || pause
                      ? heightPercentageToDP('40')
                      : heightPercentageToDP('75'),
                }}
              >
                <MapboxGL.MapView
                  style={{
                    flex: 1,
                  }}
                  styleURL={MapboxGL.StyleURL.Outdoors}
                >
                  <MapboxGL.Camera
                    zoomLevel={19}
                    followUserLocation
                    followUserMode={MapboxGL.UserTrackingModes.Follow}
                  />
                  <MapboxGL.UserLocation
                    visible
                    showsUserHeadingIndicator
                    animated
                    androidRenderMode="compass"
                    renderMode="native"
                  />
                  {coords && coords.length >= 2 && start && (
                    <MapboxGL.ShapeSource
                      id="shapeSource"
                      shape={makeLineString(coords)}
                    >
                      <MapboxGL.LineLayer
                        id="lineLayer"
                        style={{
                          lineWidth: 5,
                          lineJoin: 'bevel',
                          lineColor: '#0564FF',
                        }}
                      />
                    </MapboxGL.ShapeSource>
                  )}
                </MapboxGL.MapView>
              </View>
            ) : (
              <SaveActivity show={setShowSaveActivity} />
            )}
          </>
        )}
        {start && (
          <>
            {showPreciseInfo ? (
              <SmallOtherRideInfo
                distance={totalDistance}
                timer={movingTime}
                totalElevationGain={totalElevationGain}
                totalElevationPerch={totalElevationPerch}
              />
            ) : (
              <SmallRideInfo
                distance={totalDistance}
                timer={movingTime}
                speed={previousCoords?.coords.speed}
              />
            )}
          </>
        )}
      </View>
      {!showSaveActivity && (
        <View
          style={{
            backgroundColor: 'white',
            bottom: 15,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              borderBottomColor: 'rgba(22, 28, 37, 0.7)',
              borderTopColor: 'rgba(22, 28, 37, 0.7)',
              borderTopWidth: 0.5,
              borderBottomWidth: 0.5,
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              paddingVertical: 10,
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setStartActivity((prevState) => !prevState);
                setShowSmallInfo(() => startActivity);
                setShowPreciseInfo(false);
              }}
              disabled={!hasGPSPermission || errorCode === 1}
              style={{
                borderRightColor: 'rgba(22, 28, 37, 0.7)',
                borderRightWidth: 0.5,
                paddingHorizontal: 20,
              }}
            >
              <Icons name="distance" height={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowPreciseInfo((prevState) => !prevState);
              }}
              disabled={!start}
              style={{
                paddingHorizontal: 20,
              }}
            >
              <Icons name="bullet-list" height={20} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              width: '100%',
              paddingVertical: 5,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            {start && (
              <TouchableOpacity
                onPress={() => {
                  if (pause) {
                    setAutomaticPause(false);
                  }
                  if (automaticPause) {
                    setAutomaticPause(false);
                  } else {
                    setPause((prevState) => !prevState);
                  }
                }}
                style={{
                  borderRadius: 100,
                  borderColor: '#0564FF',
                  borderWidth: 1,
                  height: 80,
                  width: 80,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                {pause ? (
                  <Text style={{ color: '#0564FF', fontSize: 14 }}>
                    CONTINUAR
                  </Text>
                ) : (
                  <Text style={{ color: '#0564FF', fontSize: 14 }}>PAUSAR</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                if (start) {
                  setPause(true);
                  removeLocationUpdates();
                  handleEndDate();
                  navigation.navigate('SaveActivity');
                } else {
                  setStart(true);
                  setPause(false);
                  setTimeout(() => {
                    console.log('start', start);
                    startLocationCapture();
                  }, 1000);
                }
              }}
              style={{
                backgroundColor: hasGPSPermission
                  ? '#0564FF'
                  : 'rgba(22, 28, 37, 0.56)',
                borderRadius: 100,
                height: 80,
                width: 80,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>
                {start ? 'PARAR' : 'INICIAR'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
