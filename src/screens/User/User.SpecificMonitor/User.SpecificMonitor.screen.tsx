import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import {
  Linking,
  TouchableOpacity,
  AppState,
  Platform,
  View,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native-paper';
import base64 from 'react-native-base64';
import { isArray, isInteger } from 'lodash';
import Toast from 'react-native-simple-toast';
import {
  Icons,
  SafeAreaView as SafeView,
  Text,
  SmallText,
  Button,
  SnackBar,
} from '~/components';
import { useAppleHealthActivities, useDataCompiled } from '~/hooks';
import {
  GetUserDataCompiledDocument,
  useCreateActivityV2Mutation,
  useDisconnectGarminMutation,
  useDisconnectPolarMutation,
} from '~/graphql/autogenerate/hooks';
import { TypeSnackBar } from '~/components/Snackbar';
import { dbActivities, IAppleHealthActivitiesSchema } from '~/db';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { useStoreActions, useStoreState } from '~/store';
import compiledData from '~/store/model/compiledData';

export const SafeAreaView = styled(SafeView)`
  flex: 1;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 16px 0 16px;
`;

export const Container = styled.ScrollView`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;
export const MonitorImage = styled.Image`
  width: 112px;
  height: 112px;
  border-radius: 16px;
`;
export const MonitorImageContainer = styled.View`
  width: 112px;
  height: 112px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;

  shadow-color: rgba(5, 100, 255, 0.2);
  shadow-offset: 0px 3px;
  shadow-opacity: 0.58px;
  shadow-radius: 16px;

  elevation: 7;
`;
export const MonitorContainer = styled.TouchableOpacity`
  align-items: center;
`;
export const MonitorName = styled(Text)`
  font-size: 20px;
`;
export const ConnectedText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.accent.lightGreen};
  font-size: 12px;
`;
export const LastUploadTitle = styled(Text)`
  opacity: 0.56px;
  text-align: center;
  margin-top: 12px;
`;
export const LastUploadDate = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  text-align: center;
  margin-top: 8px;
`;
export const Title = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  font-size: 20px;
`;
export const Descrition = styled(Text)`
  /* font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 1px; */
`;
export const DisconnectContainer = styled.TouchableOpacity`
  shadow-color: rgba(5, 100, 255, 0.2);
  shadow-offset: 0px 3px;
  shadow-opacity: 0.58px;
  shadow-radius: 16px;
  elevation: 7;
  padding: 13px;
  background-color: #fff;
  border-radius: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const DisconnectText = styled(Text)`
  color: ${({ theme }) => theme.colors.semantic.red};
  margin-left: 14px;
`;
const UserSpecificMonitor: React.FC = ({ route }) => {
  const appState = useRef(AppState.currentState);
  const [loadingGetActivities, setLoadingGetActivities] = useState(false);
  const [currentIndexActive, setCurrentIndexActive] = useState<number>();
  const [loadingCreateActivity, setLoadingCreateActivity] = useState<boolean>(
    false,
  );
  const [activitiesHealth, setActivitiesHealth] = useState<
    IAppleHealthActivitiesSchema[]
  >([]);
  const { getActivities, loading, success } = useAppleHealthActivities();
  const [dataSource, setDataSource] = React.useState<string>();
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const navigation = useNavigation();
  const { data, refetch, payload, fetch } = useDataCompiled();
  const [callApple, setCallApple] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
  const [loadingRequest, setLoadingRequest] = useState(false);
  const compiledData = useStoreState(
    (state) => state.compiledData.dataCompiled,
  );
  const saveData = useStoreActions(
    (actions) => actions.compiledData.saveDataCompiled,
  );
  const [createActivityMutation] = useCreateActivityV2Mutation({
    onCompleted: () => console.log('completou'),
    notifyOnNetworkStatusChange: true,
    onError: (e) => console.log('Houve um Erro', e.message),
  });
  const [disconnectGarminMutation] = useDisconnectGarminMutation({
    onError: (e) => {
      setSnackBarMessage(e.message);
      setTypeSnack('error');
      setShowSnackBar(true);
      setTimeout(() => {
        setShowSnackBar(false);
        setCallApple(false);
      }, 1000);
    },
    onCompleted: (e) => {
      setSnackBarMessage('Sucesso!');
      setTypeSnack('success');
      setShowSnackBar(true);
      navigation.goBack();
      setTimeout(() => {
        setShowSnackBar(false);
        setCallApple(false);
      }, 1000);
    },
    refetchQueries: [
      {
        query: GetUserDataCompiledDocument,
      },
    ],
    awaitRefetchQueries: true,
  });
  const [disconnectPolarMutation] = useDisconnectPolarMutation({
    onError: (e) => {
      setSnackBarMessage(e.message);
      setTypeSnack('error');
      setShowSnackBar(true);
      setTimeout(() => {
        setShowSnackBar(false);
        setCallApple(false);
      }, 1000);
    },
    onCompleted: (e) => {
      setSnackBarMessage('Sucesso!');
      setTypeSnack('success');
      setShowSnackBar(true);
      navigation.goBack();
      setTimeout(() => {
        setShowSnackBar(false);
        setCallApple(false);
      }, 1000);
    },
    refetchQueries: [
      {
        query: GetUserDataCompiledDocument,
      },
    ],
    awaitRefetchQueries: true,
  });

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  // React.useEffect(() => {
  //   if (Platform.OS === 'ios') {
  //     if (!loading && success) {
  //       setSnackBarMessage('Pedaladas atualizadas com sucesso');
  //       setTypeSnack('success');
  //       setShowSnackBar(true);
  //       setTimeout(() => {
  //         setShowSnackBar(false);
  //         setCallApple(false);
  //       }, 1000);
  //     } else if (!loading && !success) {
  //       setSnackBarMessage('Suas pedaladas já estão atualizadas.');
  //       setTypeSnack('success');
  //       setShowSnackBar(true);
  //       setTimeout(() => {
  //         setShowSnackBar(false);
  //         setCallApple(false);
  //       }, 1000);
  //     }
  //   }
  // }, [loading, success, callApple]);

  async function handleSavedActivities() {
    const realm = await dbActivities();

    const elements = realm
      .objects<IAppleHealthActivitiesSchema>('AppleActivity')
      .sorted('startDate', true);
    setActivitiesHealth(elements);

    setTimeout(() => {
      setLoadingGetActivities(false);
    }, 500);
  }

  async function sendAllActivities() {
    const realm = await dbActivities();

    const elements = realm
      .objects<IAppleHealthActivitiesSchema>('AppleActivity')
      .filtered(`send = false`);

    if (elements && elements.length > 0) {
      elements.map((activity) => {
        setTimeout(() => {
          realm.write(() => {
            activity.send = true;
          });
        }, 50);
      });

      const replacedOptionsActivity = elements.map((activity) => ({
        distance: activity.distance,
        start_date: activity.startDate,
        end_date: activity.endDate,
        device_name: 'iPhone',
        type: 'Cycling',
        provider_id: 'apple-health',
      }));
      createActivityMutation({
        variables: {
          activities_data: replacedOptionsActivity,
        },
      });
      saveData({
        ...compiledData,
        last_upload_apple_health: new Date().toISOString(),
      });

      setTimeout(() => {
        setLoadingGetActivities(false);
      }, 500);
    } else {
      const elementstwo = realm
        .objects<IAppleHealthActivitiesSchema>('AppleActivity')
        .sorted('startDate', true);
      Alert.alert(
        'Sincronizar novamente?',
        'Deseja realizar o envio novamente?',
        [
          {
            text: 'Sim, enviar novamente',
            onPress: () => {
              const replacedOptionsActivity2 = elementstwo.map((activity) => ({
                distance: activity.distance,
                start_date: activity.startDate,
                end_date: activity.endDate,
                device_name: 'iPhone',
                type: 'Cycling',
                provider_id: 'apple-health',
              }));
              createActivityMutation({
                variables: {
                  activities_data: replacedOptionsActivity2,
                },
              });
              setLoadingGetActivities(false);
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => {
              setLoadingGetActivities(false);
              Toast.show(
                'Ops. Parece que todas as suas atividades ja foram importadas!',
                Toast.LONG,
              );
            },
          },
        ],
      );
    }
  }

  useEffect(() => {
    if (getActivities) {
      getActivities();
    }
    handleSavedActivities();
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (refetch) {
        refetch();
      }
      navigation.goBack();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  React.useEffect(() => {
    if (route.params.name === 'Garmin') {
      const garminId = payload?.getUserDataCompiled.third_party_data.filter(
        (el) => el.third_party_data_source.slug === 'garmin',
      );
      if (garminId && garminId.length > 0) {
        setDataSource(garminId[0].id_data_source);
      }
    }
    if (route.params.name === 'Polar') {
      const polarId = payload?.getUserDataCompiled.third_party_data.filter(
        (el) => el.third_party_data_source.slug === 'polar',
      );
      if (polarId && polarId.length > 0) {
        setDataSource(polarId[0].id_data_source);
      }
    }
  }, [payload]);

  async function handleUploadHealth(activity: IAppleHealthActivitiesSchema) {
    const encodedId = base64.encode(
      `${activity.startDate}-${activity.distance}`,
    );
    const realm = await dbActivities();

    if (activity.send) {
      Alert.alert(
        'Atenção',
        'Esse pedal já foi enviado, gostaria mesmo de envia-lo novamente?',
        [
          {
            text: 'Sim, enviar novamente',
            onPress: () => {
              setLoadingCreateActivity(true);

              createActivityMutation({
                variables: {
                  activities_data: [
                    {
                      distance: activity.distance,
                      start_date: activity.startDate,
                      end_date: activity.endDate,
                      device_name: 'iPhone',
                      type: 'Cycling',
                      provider_id: 'apple-health',
                    },
                  ],
                },
              });
              saveData({
                ...compiledData,
                last_upload_apple_health: new Date().toISOString(),
              });

              const currentActivitySaved = realm.objectForPrimaryKey<IAppleHealthActivitiesSchema>(
                'AppleActivity',
                encodedId,
              );

              if (currentActivitySaved) {
                realm.write(() => {
                  currentActivitySaved.send = true;
                });
                handleSavedActivities();
              } else {
                realm.write(() => {
                  activity.send = true;
                });
              }
              setLoadingCreateActivity(false);
            },
          },
          {
            text: 'Cancelar',
          },
        ],
      );
    } else {
      setLoadingCreateActivity(true);
      createActivityMutation({
        variables: {
          activities_data: [
            {
              distance: activity.distance,
              start_date: activity.startDate,
              end_date: activity.endDate,
              device_name: 'iPhone',
              type: 'Cycling',
              provider_id: 'apple-health',
            },
          ],
        },
      });
      saveData({
        ...compiledData,
        last_upload_apple_health: new Date().toISOString(),
      });
      const currentActivitySaved = realm.objectForPrimaryKey<IAppleHealthActivitiesSchema>(
        'AppleActivity',
        encodedId,
      );

      if (currentActivitySaved) {
        realm.write(() => {
          currentActivitySaved.send = true;
        });
        handleSavedActivities();
      } else {
        realm.write(() => {
          activity.send = true;
        });
      }
      setTimeout(() => {
        setLoadingCreateActivity(false);
      }, 500);
    }
  }

  return (
    <SafeAreaView>
      <SnackBar
        show={showSnackBar}
        setShow={(e) => setShowSnackBar(e)}
        message={snackBarMessage}
        type={typeSnack}
      />
      <Header>
        <TouchableOpacity
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
      </Header>
      <Container
        style={{ flex: 1 }}
        contentContainerStyle={{
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 40,
        }}
      >
        <View>
          <MonitorContainer>
            <MonitorImageContainer>
              <MonitorImage source={route.params.image} />
            </MonitorImageContainer>
            <MonitorName>{route.params.name}</MonitorName>
            <ConnectedText>Conectado</ConnectedText>
          </MonitorContainer>
          {route.params.id === 'health' ? (
            <View style={{ paddingHorizontal: 16 }}>
              <LastUploadTitle>
                O Apple Saúde nos envia a sua distância diária pedalada (somando
                todas as pedaladas que você fez no dia) dos últimos 30 dias,
                então a gente considera essa distância como uma pedalada única
                por dia. Toque nas pedaladas abaixo para importá-las para o
                Riderize.
              </LastUploadTitle>
            </View>
          ) : null}

          {route.params.id === 'polar' && (
            <>
              <Title>Upload de Pedaladas</Title>
              <Descrition>
                Depois que você conecta sua conta Polar Flow, recebemos suas
                pedaladas automaticamente assim que você sincroniza seu
                dispositivo com o App Polar Flow. Em seguida ela passará a
                contar para os Desafios que você está inscrito.
              </Descrition>
              <Title>Envio Manual</Title>
              <Descrition style={{ marginBottom: 15 }}>
                Se por algum motivo sua pedalada não subiu para o Riderize, você
                pode fazer a importação manual de forma muito simples:
              </Descrition>
              <Descrition style={{ marginBottom: 10 }}>
                1. Entre no Polar Flow no seu computador
                (https://flow.polar.com).
              </Descrition>
              <Descrition style={{ marginBottom: 10 }}>
                2. Clique no link "Training history"(histórico de treino) para
                ver a lista de todas as suas pedaladas.
              </Descrition>
              <Descrition style={{ marginBottom: 10 }}>
                3. Clique na pedalada que deseja usar no Desafio (desde que
                tenha sido realizada no período do Desafio).
              </Descrition>
              <Descrition style={{ marginBottom: 10 }}>
                4. Clique em "Export Session" (exportar sessão).
              </Descrition>
              <Descrition style={{ marginBottom: 10 }}>
                5. Selecione "Percurso (GPX)".
              </Descrition>
              <Descrition style={{ marginBottom: 30 }}>
                Envie o arquivo gerado no seu computador para o seu celular
                (Você pode usar o WhatsApp para isso ou outro programa).
              </Descrition>
            </>
          )}
          {route.params.id === 'garmin' && (
            <>
              <Title>Upload de Pedaladas</Title>
              <Descrition>
                Depois que você conecta sua conta do Connect, recebemos suas
                pedaladas automaticamente assim que você sincroniza seu
                dispositivo com o App Connect. Em seguida ela passará a contar
                para os Desafios que você está inscrito.
              </Descrition>
              <Title>Envio Manual</Title>
              <Descrition style={{ marginBottom: 15 }}>
                Se por algum motivo sua pedalada não subiu para o Riderize, você
                pode fazer a importação manual de forma muito simples:
              </Descrition>
              <Descrition style={{ marginBottom: 10 }}>
                Entre no Connect no seu computador
                (https://connect.garmin.com/).
              </Descrition>
              <Descrition style={{ marginBottom: 10 }}>
                2. Clique no menu "Atividades" para ver a lista de todas as suas
                pedaladas.
              </Descrition>
              <Descrition style={{ marginBottom: 10 }}>
                3. Clique na pedalada que deseja usar no Desafio (desde que
                tenha sido realizada no período do Desafio).
              </Descrition>
              <Descrition style={{ marginBottom: 10 }}>
                4. Clique na engrenagem no canto superior direito e em seguida
                em "Exportar para GPX"
              </Descrition>
              <Descrition style={{ marginBottom: 30 }}>
                Envie o arquivo gerado no seu computador para o seu celular
                (Você pode usar o WhatsApp para isso ou outro programa).
              </Descrition>
            </>
          )}
          {route.params.id === 'health' && (
            <View style={{ width: widthPercentageToDP('100'), marginTop: 64 }}>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Title>Upload de Pedaladas</Title>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    disabled={loadingGetActivities}
                    onPress={() => {
                      if (getActivities) {
                        setLoadingGetActivities(true);
                        // setCallApple(true);
                        getActivities();
                        handleSavedActivities();
                      }
                    }}
                  >
                    {!loadingGetActivities ? (
                      <>
                        <LastUploadTitle
                          style={{
                            textAlign: 'right',
                            marginTop: 0,
                            marginRight: 5,
                          }}
                        >
                          Atualizar
                        </LastUploadTitle>
                        <Icons name="refresh" />
                      </>
                    ) : (
                      <ActivityIndicator size="small" color="#0564FF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {activitiesHealth.map((el, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setCurrentIndexActive(index);
                    setTimeout(() => {
                      handleUploadHealth(el);
                    }, 100);
                  }}
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.18,
                    shadowRadius: 1.0,

                    elevation: 1,
                    marginBottom: 5,
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Icons name="bike" style={{ marginRight: 10 }} />
                    <Text style={{ marginRight: 10 }}>
                      {format(
                        new Date(el.startDate),
                        "dd 'de' MMM'.' 'de' yyyy",
                      )}{' '}
                      <Text style={{ opacity: 0.56 }}>
                        {isInteger(el.distance)
                          ? el.distance
                          : el.distance.toFixed(2)}{' '}
                        km
                      </Text>
                    </Text>
                  </View>
                  {el.send ? <Icons name="check" /> : null}
                  {currentIndexActive === index && loadingCreateActivity ? (
                    <ActivityIndicator color="#0564ff" size="small" />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {route.params.id === 'health' && (
          <Button
            name="Importar Tudo"
            loading={loading || loadingGetActivities}
            style={{ marginBottom: 30, width: widthPercentageToDP('90') }}
            onPress={() => {
              setLoadingGetActivities(true);
              if (getActivities) {
                getActivities();
                sendAllActivities();
              }
            }}
          />
        )}
        <DisconnectContainer
          disabled={loadingRequest}
          onPress={async () => {
            setLoadingRequest(true);
            if (route.params.name === 'Garmin') {
              const { data: garminData } = await disconnectGarminMutation({
                variables: {
                  data: {
                    id_data_source: dataSource,
                  },
                },
              });
              if (garminData) {
                setLoadingRequest(false);
              }
            }
            if (route.params.name === 'Polar') {
              const { data: polarData } = await disconnectPolarMutation({
                variables: {
                  data: {
                    id_data_source: dataSource,
                  },
                },
              });
              if (polarData) {
                setLoadingRequest(false);
              }
            }
            if (route.params.id === 'health') {
              Linking.openURL('App-Prefs:HealthKit');
            }
          }}
        >
          {loadingRequest ? (
            <ActivityIndicator color="#0564FF" />
          ) : (
            <>
              <Icons name="close" color="#FF2525" />
              <DisconnectText>Desvincular</DisconnectText>
            </>
          )}
        </DisconnectContainer>
      </Container>
    </SafeAreaView>
  );
};

export default UserSpecificMonitor;
