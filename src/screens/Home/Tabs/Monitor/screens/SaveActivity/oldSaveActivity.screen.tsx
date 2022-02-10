import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  AppState,
  Linking,
  Image,
} from 'react-native';
import uuid from 'react-native-uuid';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { Formik } from 'formik';
import base64 from 'react-native-base64';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import * as Sentry from '@sentry/react-native';
import branch from 'react-native-branch';
import { API } from '@env';
import { dbMonitor, IMonitorSchema, dbMonitorQueue } from '~/db';
import {
  Checkbox,
  Icons,
  Picker,
  SafeAreaView,
  Text,
  Typography,
} from '~/components';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { useStoreActions, useStoreState } from '~/store';
import { useUserToken } from '~/hooks';

const MAPBOX_KEY =
  'pk.eyJ1IjoicmlkZXJpemUiLCJhIjoiY2tjamJ5emZxMHo0MzMxcWl2MTE3bWR0aiJ9.ZTxTHUqcNRx4smuNTfPuXg';
MapboxGL.setAccessToken(MAPBOX_KEY);

interface InitialValuesProps {
  activity_name?: string;
  description?: string;
  type: string;
  visibility: string;
}

export default function SaveActivity({ route, navigation }): JSX.Element {
  const { userID } = useUserToken();
  const [sendToStrava, setSendToStrava] = useState(true);
  const [images, setImages] = useState<Image[]>();
  const compiledData = useStoreState(
    (state) => state.compiledData.dataCompiled,
  );
  const saveCompiledData = useStoreActions(
    (actions) => actions.compiledData.saveDataCompiled,
  );
  const setMonitorStatus = useStoreActions(
    (actions) => actions.monitor.setStates,
  );

  const openGalleryPicture = async (): Promise<void> => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      compressImageMaxWidth: 2048,
      compressImageMaxHeight: 2048,
      compressImageQuality: 0.8,
      smartAlbums: [
        'PhotoStream',
        'Generic',
        'Panoramas',
        'Favorites',
        'Timelapses',
        'AllHidden',
        'RecentlyAdded',
        'Bursts',
        'UserLibrary',
        'SelfPortraits',
        'Screenshots',
        'DepthEffect',
        'LivePhotos',
        'Animated',
        'LongExposure',
      ],
      loadingLabelText: 'Carregando foto...',
      includeExif: false,
      cropping: true,
      width: 2000,
      height: 2000,
    }).then((selectedImage) => {
      setImages(selectedImage);
    });
  };

  const initialValues: InitialValuesProps = {
    activity_name: undefined,
    description: undefined,
    type: 'Montain Bike',
    visibility: 'all',
  };

  const deleteActivity = async () => {
    const realm = await dbMonitor();
    realm.write(() => {
      realm.deleteAll();
    });

    setMonitorStatus('stopped');
    navigation.goBack();
    route.params.routeNavigation.navigate('Menu');
  };

  React.useEffect(() => {
    branch.subscribe(({ error, params, uri }) => {
      try {
        if (params['+non_branch_link']) {
          const nonBranchUrl = params['+non_branch_link'];
          Sentry.captureMessage(nonBranchUrl);
          // Route non-Branch URL if appropriate.
          const removedPrefix = nonBranchUrl.split('com.riderize://');
          if (removedPrefix && removedPrefix.length > 1) {
            if (removedPrefix[1] === 'strava/success') {
              saveCompiledData({
                ...compiledData,
                integrated_with_strava: true,
              });
            } else if (removedPrefix[1] === 'strava/error') {
              saveCompiledData({
                ...compiledData,
                integrated_with_strava: false,
              });
            }
          }
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    });
  }, [AppState.currentState]);

  const saveMonitorLocal = async (values: InitialValuesProps) => {
    const realm = await dbMonitor();
    const monitorQueue = await dbMonitorQueue();

    const localMonitor = realm.objectForPrimaryKey<IMonitorSchema>(
      'Activity',
      '1',
    );
    if (localMonitor) {
      realm.write(() => {
        localMonitor.name = values.activity_name ? values.activity_name : '';
        localMonitor.description = values.description ? values.description : '';
        localMonitor.visibility = values.visibility;
        localMonitor.device_name =
          Platform.OS === 'ios'
            ? 'Riderize iPhone App'
            : 'Riderize Android App';
      });
    }

    Sentry.captureMessage(
      `moving time: ${localMonitor?.moving_time}, elapsed_time: ${localMonitor?.elapsed_time}`,
    );

    monitorQueue.write(() => {
      const teste = monitorQueue.create('ActivityQueue', {
        id: uuid.v4(),
        coordinates: localMonitor?.coordinates,
        polyline: localMonitor?.polyline,
        distance: Math.floor(localMonitor?.distance),
        elapsed_time: localMonitor?.elapsed_time
          ? localMonitor.elapsed_time
          : 0,
        moving_time: localMonitor?.moving_time ? localMonitor?.moving_time : 0,
        start_date: localMonitor?.start_date,
        total_elevation_gain: 0,
        total_ascent: 0,
        total_descent: 0,
        name: localMonitor?.name,
        description: localMonitor?.description,
        device_name: localMonitor?.device_name,
        visibility: localMonitor?.visibility,
        is_private: localMonitor?.is_private,
        end_date: new Date(),
        send_to_strava: compiledData?.integrated_with_strava
          ? sendToStrava
          : false,
      });

      if (teste) {
        realm.write(() => {
          realm.deleteAll();
        });
        setMonitorStatus('stopped');

        route.params.routeNavigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        route.params.routeNavigation.navigate('Menu');
        route.params.routeNavigation.navigate('User.Activities');
      }
    });
  };
  return (
    <SafeAreaView>
      <Formik onSubmit={saveMonitorLocal} initialValues={initialValues}>
        {({ values, handleChange, handleSubmit }) => (
          <>
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
                  navigation.goBack();
                }}
              >
                <Icons name="arrow-left" height={13} width={18} />
              </TouchableOpacity>

              <Text style={{ fontFamily: 'NeuzeitGro-Bol', fontSize: 18 }}>
                Salvar atividade
              </Text>

              <View style={{ width: 20 }} />

              <TouchableOpacity
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                onPress={handleSubmit}
              >
                <Text style={{ fontSize: 14 }}>SALVAR</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ height: heightPercentageToDP('90') }}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <>
                <View
                  style={{
                    paddingHorizontal: 16,
                    backgroundColor: '#F2F2F2',
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ fontSize: 12, fontFamily: 'NeuzeitGro-Bol' }}>
                    GERAL
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 16 }}>
                  <TextInput
                    placeholder="Dê um título para sua pedalada"
                    style={{
                      marginTop: 10,
                      paddingVertical: 10,
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#161C25',
                      color: '#161C25',
                      fontFamily: 'NeuzeitGro-Reg',
                      fontSize: 18,
                    }}
                    placeholderTextColor="#161C25"
                    onChangeText={handleChange('activity_name')}
                  />

                  <View style={{ paddingVertical: 10, marginTop: 10 }}>
                    <Picker
                      onChangeValue={handleChange('type')}
                      placeholder={{
                        label: 'Selecione Tipo de Bike',
                        value: null,
                      }}
                      value="Montain Bike"
                      style={{
                        placeholder: {
                          fontFamily: 'NeuzeitGro-Reg',
                          fontSize: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          color: 'rgba(22, 28, 37, 0.7);',
                        },
                      }}
                      data={[
                        { label: 'Montain Bike', value: 'Montain Bike' },
                        { label: 'E-MTB', value: 'E-MTB' },
                        { label: 'Road', value: 'Road' },
                        { label: 'E-Road', value: 'E-Road' },
                        { label: 'Gravel', value: 'Gravel' },
                      ]}
                    />
                  </View>

                  <TextInput
                    placeholder="Adicione uma descricao"
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#161C25',
                      color: '#161C25',
                      fontFamily: 'NeuzeitGro-Reg',
                      fontSize: 18,
                    }}
                    placeholderTextColor="#161C25"
                    onChangeText={handleChange('description')}
                  />
                </View>

                <View
                  style={{
                    marginTop: 40,
                    paddingHorizontal: 16,
                    backgroundColor: '#F2F2F2',
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ fontSize: 12, fontFamily: 'NeuzeitGro-Bol' }}>
                    FOTOS
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 20,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      openGalleryPicture();
                    }}
                  >
                    <Icons name="picture" height={40} width={40} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#161C25',
                      color: '#161C25',
                      fontFamily: 'NeuzeitGro-Reg',
                      fontSize: 18,
                      marginLeft: 10,
                    }}
                  >
                    Adicionar Fotos
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    marginTop: 10,
                  }}
                >
                  {images &&
                    images.length > 0 &&
                    images.map((image) => (
                      <FastImage
                        key={image.path}
                        source={image.sourceURL}
                        style={{ width: 50, height: 50, marginRight: 10 }}
                      />
                    ))}
                </View>

                <View
                  style={{
                    marginTop: 40,
                    paddingHorizontal: 16,
                    backgroundColor: '#F2F2F2',
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ fontSize: 12, fontFamily: 'NeuzeitGro-Bol' }}>
                    CONTROLES DE PRIVACIDADE
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 20,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                  }}
                >
                  <Text
                    style={{
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#161C25',
                      color: '#161C25',
                      fontFamily: 'NeuzeitGro-Reg',
                      fontSize: 18,
                      marginLeft: 10,
                    }}
                  >
                    Quem pode ver:
                  </Text>
                  <View style={{ marginLeft: 10, marginTop: -4.5 }}>
                    <Picker
                      onChangeValue={(e) => console.log(e)}
                      placeholder={{ label: 'Selecione um', value: null }}
                      value="all"
                      style={{
                        placeholder: {
                          fontFamily: 'NeuzeitGro-Reg',
                          fontSize: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          color: 'rgba(22, 28, 37, 0.7);',
                        },
                      }}
                      data={[
                        { label: 'Todos (Publica)', value: 'all' },
                        { label: 'Seguidores', value: 'friends' },
                        { label: 'Somente Eu (Privado)', value: 'me' },
                      ]}
                    />
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 20,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#161C25',
                      color: '#161C25',
                      fontFamily: 'NeuzeitGro-Reg',
                      fontSize: 18,
                      marginLeft: 10,
                    }}
                  >
                    Enviar atividade ao Strava
                  </Text>
                  <View style={{ marginLeft: 10 }}>
                    {compiledData?.integrated_with_strava ? (
                      <Checkbox
                        value={sendToStrava}
                        onChange={(e) => setSendToStrava(e)}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(
                            `${API}/auth/strava?user_id=${base64.encode(
                              userID,
                            )}`,
                          );
                        }}
                      >
                        <Image
                          source={require('../../assets/strava.png')}
                          resizeMethod="scale"
                          resizeMode="contain"
                          style={{
                            width: widthPercentageToDP('30'),
                            height: 30,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    borderTopColor: 'rgba(22, 28, 37, 0.7)',
                    borderTopWidth: 0.5,
                    paddingHorizontal: 16,
                    marginTop: 10,
                    paddingTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      borderColor: 'rgba(22, 28, 37, 0.7)',
                      borderWidth: 1,
                      padding: 3,
                    }}
                    onPress={() => {
                      Alert.alert(
                        'Você tem certeza disso?',
                        'Essa ação e irreversível e excluirá todo o seu progresso atual.',
                        [
                          {
                            text: 'Sim, tenho certeza',
                            onPress: () => deleteActivity(),
                          },
                          {
                            text: 'Cancelar',
                            style: 'cancel',
                          },
                        ],
                      );
                    }}
                  >
                    <Icons name="trash" height={20} width={20} />
                  </TouchableOpacity>
                </View>
              </>
            </ScrollView>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
}
