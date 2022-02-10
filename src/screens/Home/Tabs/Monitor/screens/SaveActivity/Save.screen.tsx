import React from 'react';

import { AppState, TouchableOpacity } from 'react-native';

import branch from 'react-native-branch';
import { captureException } from '@sentry/react-native';
import { Box, Icons, SafeAreaView, Typography } from '~/components';

import { MapController } from '~/screens/Home/Tabs/Monitor/screens/SaveActivity/components/MapController';
import { MapControls } from '~/screens/Home/Tabs/Monitor/screens/SaveActivity/components/MapControls';
import compiledData from '~/store/model/compiledData';
import { useStoreActions } from '~/store';

interface InitialValuesProps {
  activity_name?: string;
  description?: string;
  type: string;
  visibility: string;
  send_to_strava: boolean;
}

const initialValues: InitialValuesProps = {
  activity_name: undefined,
  description: undefined,
  type: 'Montain Bike',
  visibility: 'all',
  send_to_strava: true,
};

export function SaveMonitorActivity({ route, navigation }): JSX.Element {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Typography type="bigger">BAANAA</Typography>
    </Box>
  );
  // const modalizeRefSelect = useRef<Modalize>(null);
  // const { userID } = useUserToken();

  // const { isActive, isPaused, handleStart, handlePause, handleResume } =
  //   useTimer(0);
  // const [modalState, setModalState] = React.useState(false);
  // const saveCompiledData = useStoreActions(
  //   (actions) => actions.compiledData.saveDataCompiled,
  // );
  // const [modalPosition, setModalPosition] = useState<'initial' | 'top'>(
  //   'initial',
  // );
  // const [modalPosition2, setModalPosition2] = useState<'initial' | 'top'>(
  //   'initial',
  // );
  // const coordsRef = useRef<number[[]]>();
  // const [previousCoords, setPreviousCoords] = useState<MapboxGL.Location>();
  //
  // const [actualLocations, setLocation] = useState();
  // const [distance, setDistance] = useState(0);
  // const [speed, setSpeed] = useState(0);
  // const [activityStatus, setActivityStatus] = useState<
  //   'started' | 'stopped' | 'not-started' | 'save'
  // >('not-started');

  // const toggleModal = () => {
  //   setModalState(!modalState);
  // };

  // React.useEffect(() => {
  //   const branchUnsubscribe = branch.subscribe(({ error, params, uri }) => {
  //     try {
  //       if (params['+non_branch_link']) {
  //         const nonBranchUrl = params['+non_branch_link'];
  //         captureMessage(nonBranchUrl);
  //         // Route non-Branch URL if appropriate.
  //         const removedPrefix = nonBranchUrl.split('com.riderize://');
  //         if (removedPrefix && removedPrefix.length > 1) {
  //           if (removedPrefix[1] === 'strava/success') {
  //             saveCompiledData({
  //               ...compiledData,
  //               integrated_with_strava: true,
  //             });
  //           } else if (removedPrefix[1] === 'strava/error') {
  //             saveCompiledData({
  //               ...compiledData,
  //               integrated_with_strava: false,
  //             });
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       captureException(error);
  //     }
  //   });
  //
  //   return branchUnsubscribe;
  // }, [AppState.currentState]);

  // const sendActivityToQueue = useCallback(
  //   async (values: InitialValuesProps) => {
  //     const realm = await dbMonitor();
  //     const monitorQueue = await dbMonitorQueue();
  //
  //     const localMonitor = realm.objectForPrimaryKey<IMonitorSchema>(
  //       'Activity',
  //       '1',
  //     );
  //     if (localMonitor) {
  //       realm.write(() => {
  //         localMonitor.name = values.activity_name ? values.activity_name : '';
  //         localMonitor.description = values.description
  //           ? values.description
  //           : '';
  //         localMonitor.visibility = values.visibility;
  //         localMonitor.device_name =
  //           Platform.OS === 'ios'
  //             ? 'Riderize iPhone App'
  //             : 'Riderize Android App';
  //       });
  //     }
  //
  //     Sentry.captureMessage(
  //       `moving time: ${localMonitor?.moving_time}, elapsed_time: ${localMonitor?.elapsed_time}`,
  //     );
  //
  //     monitorQueue.write(() => {
  //       const teste = monitorQueue.create('ActivityQueue', {
  //         id: uuid.v4(),
  //         coordinates: localMonitor?.coordinates,
  //         polyline: localMonitor?.polyline,
  //         distance: Math.floor(localMonitor?.distance),
  //         elapsed_time: localMonitor?.elapsed_time
  //           ? localMonitor.elapsed_time
  //           : 0,
  //         moving_time: localMonitor?.moving_time
  //           ? localMonitor?.moving_time
  //           : 0,
  //         start_date: localMonitor?.start_date,
  //         total_elevation_gain: 0,
  //         total_ascent: 0,
  //         total_descent: 0,
  //         name: localMonitor?.name,
  //         description: localMonitor?.description,
  //         device_name: localMonitor?.device_name,
  //         visibility: localMonitor?.visibility,
  //         is_private: localMonitor?.is_private,
  //         end_date: new Date(),
  //         send_to_strava: compiledData?.integrated_with_strava
  //           ? values.send_to_strava
  //           : false,
  //       });
  //
  //       if (teste) {
  //         realm.write(() => {
  //           realm.deleteAll();
  //         });
  //
  //         route.params.routeNavigation.reset({
  //           index: 0,
  //           routes: [{ name: 'Home' }],
  //         });
  //         route.params.routeNavigation.navigate('Menu');
  //         route.params.routeNavigation.navigate('User.Activities');
  //       }
  //     });
  //   },
  //   [compiledData, route.params.routeNavigation],
  // );

  // const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
  //   initialValues,
  //
  //   onSubmit: sendActivityToQueue,
  // });

  // const modalizeRef2 = useRef<Modalize>(null);
  // const compiledData = useStoreState(
  //   (state) => state.compiledData.dataCompiled,
  // );

  // const saveMonitorLocal = useCallback(
  //   async (customCoords: MapboxGL.Location) => {
  //     const realm = await dbMonitor();
  //
  //     const localMonitor = realm.objectForPrimaryKey<IMonitorSchema>(
  //       'Activity',
  //       '1',
  //     );
  //     if (localMonitor) {
  //       realm.write(() => {
  //         const newCoords = realm.create<ICoodinateSchema>('Coordinates', {
  //           coordinates: [
  //             customCoords.coords.latitude,
  //             customCoords.coords.longitude,
  //           ],
  //           time: new Date().toISOString(),
  //           speed: customCoords.coords.speed ? customCoords.coords.speed : 0,
  //         });
  //
  //         localMonitor.coordinates = [...localMonitor.coordinates, newCoords];
  //
  //         localMonitor.distance = distance;
  //         localMonitor.moving_time = timer;
  //         localMonitor.elapsed_time = timer;
  //         localMonitor.last_date_updated = new Date();
  //       });
  //     } else if (coords) {
  //       realm.write(() => {
  //         realm.create<IMonitorSchema>('Activity', {
  //           last_date_updated: new Date(),
  //           last_moving_time: timer,
  //           distance,
  //           elapsed_time: 0,
  //           device_name: 'Iphone',
  //           id: '1',
  //           is_private: false,
  //           moving_time: 0,
  //           name: 'Pedal',
  //           polyline: 'teste',
  //           start_date: new Date().toISOString(),
  //         });
  //       });
  //     }
  //   },
  //   [],
  // );

  // const handleEndDate = async () => {
  //   const realm = await dbMonitor();
  //
  //   const localMonitor = realm.objectForPrimaryKey<IMonitorSchema>(
  //     'Activity',
  //     '1',
  //   );
  //   if (localMonitor) {
  //     const elapsedTime = Math.floor(
  //       Math.abs(
  //         (new Date(localMonitor.start_date).getTime() - new Date().getTime()) /
  //           1000,
  //       ),
  //     );
  //
  //     const newDistance = Math.floor(localMonitor.distance);
  //
  //     realm.write(() => {
  //       localMonitor.elapsed_time = elapsedTime;
  //       localMonitor.distance = newDistance;
  //     });
  //   }
  // };

  // const handleDeleteActivity = async () => {
  //   const realm = await dbMonitor();
  //
  //   realm.write(() => {
  //     realm.deleteAll();
  //   });
  //
  //   route.params.routeNavigation.reset({
  //     index: 0,
  //     routes: [{ name: 'Home' }],
  //   });
  //   route.params.routeNavigation.navigate('Menu');
  // };

  // return (
  //   <Box as={SafeAreaView} flex={1}>
  //     <Box
  //       flexDirection="row"
  //       alignItems="center"
  //       justifyContent="space-between"
  //       padding={18}
  //     >
  //       <Box as={TouchableOpacity} onPress={() => navigation.goBack()}>
  //         <Icons name="arrow_back" />
  //       </Box>
  //
  //       <Typography type="h3">Salvar Atividade</Typography>
  //
  //       <Box as={TouchableOpacity}>
  //         <Icons name="settings" width={24} height={24} />
  //       </Box>
  //     </Box>
  //
  //     {/* <MapController /> */}
  //     {/* <MapControls /> */}
  //
  //     {/* <Modalize ref={modalizeRefSelect} adjustToContentHeight> */}
  //     {/*  <Box flex={1} justifyContent="space-between" paddingX={3} paddingY={4}> */}
  //     {/*    <Typography type="h3">Integrações disponíveis</Typography> */}
  //     {/*  </Box> */}
  //
  //     {/*  <Box> */}
  //     {/*    <Box */}
  //     {/*      px={3} */}
  //     {/*      py={18} */}
  //     {/*      as={TouchableOpacity} */}
  //     {/*      flexDirection="row" */}
  //     {/*      alignItems="center" */}
  //     {/*      justifyContent="space-between" */}
  //     {/*      borderBottomColor="#A1A8B1" */}
  //     {/*      borderBottomWidth={0.5} */}
  //     {/*      onPress={() => { */}
  //     {/*        if (compiledData?.integrated_with_strava) { */}
  //     {/*          setFieldValue('send_to_strava', !values.send_to_strava); */}
  //     {/*        } else { */}
  //     {/*          Linking.openURL( */}
  //     {/*            `${API}/auth/strava?user_id=${base64.encode(userID)}`, */}
  //     {/*          ); */}
  //     {/*        } */}
  //     {/*      }} */}
  //     {/*    > */}
  //     {/*      <Box flexDirection="row" alignItems="center"> */}
  //     {/*        <Icons name="strava-crawler" /> */}
  //     {/*        <Typography marginLeft={16}>Strava</Typography> */}
  //     {/*      </Box> */}
  //
  //     {/*      <Box flexDirection="row" alignItems="center"> */}
  //     {/*        {compiledData?.integrated_with_strava ? ( */}
  //     {/*          <> */}
  //     {/*            {values.send_to_strava ? ( */}
  //     {/*              <Icons name="check" color="#0564FF" /> */}
  //     {/*            ) : null} */}
  //     {/*          </> */}
  //     {/*        ) : ( */}
  //     {/*          <Box> */}
  //     {/*            <Image */}
  //     {/*              source={require('../../assets/strava.png')} */}
  //     {/*              resizeMethod="scale" */}
  //     {/*              resizeMode="contain" */}
  //     {/*              style={{ */}
  //     {/*                width: widthPercentageToDP('30'), */}
  //     {/*                height: 30, */}
  //     {/*              }} */}
  //     {/*            /> */}
  //     {/*          </Box> */}
  //     {/*        )} */}
  //     {/*      </Box> */}
  //     {/*    </Box> */}
  //
  //     {/*    <Box */}
  //     {/*      px={3} */}
  //     {/*      py={18} */}
  //     {/*      flexDirection="row" */}
  //     {/*      alignItems="center" */}
  //     {/*      borderBottomColor="#A1A8B1" */}
  //     {/*      borderBottomWidth={0.5} */}
  //     {/*    > */}
  //     {/*      <Icons name="strava-crawler" /> */}
  //
  //     {/*      <Typography marginLeft={16}>Relive - Em Breve</Typography> */}
  //     {/*    </Box> */}
  //     {/*  </Box> */}
  //     {/*  <Box */}
  //     {/*    backgroundColor="#0564FF" */}
  //     {/*    px={24} */}
  //     {/*    py={14} */}
  //     {/*    flexDirection="row" */}
  //     {/*    justifyContent="space-between" */}
  //     {/*    as={TouchableOpacity} */}
  //     {/*    onPress={() => modalizeRefSelect.current.close()} */}
  //     {/*  > */}
  //     {/*    <Typography color="white">Salvar</Typography> */}
  //
  //     {/*    <Icons name="arrow_forward" color="white" /> */}
  //     {/*  </Box> */}
  //     {/* </Modalize> */}
  //
  //     {/* <Modal */}
  //     {/*  isVisible={modalState} */}
  //     {/*  onBackdropPress={() => toggleModal()} */}
  //     {/*  useNativeDriver */}
  //     {/*  backdropTransitionOutTiming={0} */}
  //     {/* > */}
  //     {/*  <Box */}
  //     {/*    backgroundColor="white" */}
  //     {/*    borderRadius={8} */}
  //     {/*    alignItems="center" */}
  //     {/*    px={3} */}
  //     {/*    py={4} */}
  //     {/*  > */}
  //     {/*    <Icons name="trash" height={48} width={48} /> */}
  //     {/*    <Typography type="h3" textAlign="center" marginTop={2}> */}
  //     {/*      Você deseja excluir esta{'\n'}atividade? */}
  //     {/*    </Typography> */}
  //     {/*    <Typography textAlign="center" marginTop={2}> */}
  //     {/*      Ao excluir a atividade não será possível recuperar dados e */}
  //     {/*      informações como{'\n'}distância percorrida, velocidade,{'\n'}{' '} */}
  //     {/*      localização, etc.. */}
  //     {/*    </Typography> */}
  //
  //     {/*    <Box flexDirection="row" justifyContent="space-between" marginTop={4}> */}
  //     {/*      <Box */}
  //     {/*        as={TouchableOpacity} */}
  //     {/*        borderWidth={1} */}
  //     {/*        borderColor="red" */}
  //     {/*        borderRadius={100} */}
  //     {/*        width="40%" */}
  //     {/*        height={48} */}
  //     {/*        alignItems="center" */}
  //     {/*        justifyContent="center" */}
  //     {/*        marginRight={2} */}
  //     {/*        onPress={() => handleDeleteActivity()} */}
  //     {/*      > */}
  //     {/*        <Typography color="red">Excluir</Typography> */}
  //     {/*      </Box> */}
  //
  //     {/*      <Box */}
  //     {/*        as={TouchableOpacity} */}
  //     {/*        backgroundColor="#0564FF" */}
  //     {/*        borderRadius={100} */}
  //     {/*        width="40%" */}
  //     {/*        height={48} */}
  //     {/*        alignItems="center" */}
  //     {/*        justifyContent="center" */}
  //     {/*        onPress={() => toggleModal()} */}
  //     {/*      > */}
  //     {/*        <Typography color="white">Voltar</Typography> */}
  //     {/*      </Box> */}
  //     {/*    </Box> */}
  //     {/*  </Box> */}
  //     {/* </Modal> */}
  //   </Box>
  // );
}
