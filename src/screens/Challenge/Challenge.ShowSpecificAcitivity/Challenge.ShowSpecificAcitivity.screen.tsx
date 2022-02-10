import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import base64 from 'react-native-base64';

import Modal from 'react-native-modal';
import MapBoxPolyline from '@mapbox/polyline';
import styled from 'styled-components/native';
import { lineString as makeLineString } from '@turf/helpers';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { RouteProp } from '@react-navigation/native';
import CachedImage from 'react-native-image-cache-wrapper';
import * as Sentry from '@sentry/react-native';
// eslint-disable-next-line import/no-duplicates
import { addMinutes, format, intervalToDuration } from 'date-fns';
import { API, PUBLIC_STORAGE } from '@env';
import ActionSheet from 'react-native-actionsheet';
import branch from 'react-native-branch';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { GeoJsonProperties } from 'geojson';
import { useUserToken } from '~/hooks';
import {
  Icons,
  Text,
  TitleText,
  SmallText,
  Box,
  Typography,
} from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  useGetActivityDetailLazyQuery,
  useSendActivityToProviderMutation,
} from '~/graphql/autogenerate/hooks';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import formatMinutesInHours from '~/helpers/formatMinutesInHours';
import formatNumbers from '~/helpers/formatNumbers';
import formatSecondsInHours from '~/helpers/formatSecondsInHours';
import { useStoreActions, useStoreState } from '~/store';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ptBR = require('date-fns/locale/pt-BR');

const MAPBOX_KEY =
  'pk.eyJ1IjoicmlkZXJpemUiLCJhIjoiY2tjamJ5emZxMHo0MzMxcWl2MTE3bWR0aiJ9.ZTxTHUqcNRx4smuNTfPuXg';
MapboxGL.setAccessToken(MAPBOX_KEY);

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 50px 16px 18px 16px;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  elevation: 1;
`;
export const Title = styled(TitleText)`
  font-size: 20px;
`;
export const Container = styled.View`
  flex: 1;
  background-color: rgba(239, 250, 255, 0.5);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;
export const OptionContainer = styled.TouchableOpacity`
  flex-direction: row;
  background-color: white;
  justify-content: space-between;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;
export const ContentWrapper = styled.View`
  background-color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-bottom: 8px;
  /* padding: 21px 16px; */

  elevation: 1;
`;
export const ChallengeTitle = styled(TitleText)`
  font-size: 24px;
  text-align: left;
  width: ${widthPercentageToDP('80')};
`;

export const SubInfoTitle = styled(SmallText)`
  font-weight: 300;
  color: rgba(22, 28, 37, 0.56);
  font-size: 14px;
  margin-bottom: 7px;
`;
export const GoalInfo = styled(TitleText)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  text-align: center;
  font-size: 20px;
  text-transform: capitalize;
`;
export const SubInfoText = styled(TitleText)`
  text-align: center;
  font-size: 16px;
  text-transform: capitalize;
`;

type ShowSpecificAcitivityRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.ShowSpecificActivity'
>;

type ShowSpecificAcitivityNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.ShowSpecificActivity'
>;

type Props = {
  route: ShowSpecificAcitivityRouteProp;
  navigation: ShowSpecificAcitivityNavigationProp;
};

const { width } = Dimensions.get('window');
const ViewTypes = {
  FULL: 0,
};
const layoutMaker = () =>
  new LayoutProvider(
    (index) => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = width - 16;
      dim.height = 86;
    },
  );

const STRAVA_ID = '872447eb-1290-4fc7-9dfd-cfc053e57067';

const ChallengeShowSpecificActivity: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const compiledData = useStoreState(
    (state) => state.compiledData.dataCompiled,
  );
  const [sendedToStrava, setSendedToStrava] = useState(false);
  const { userID } = useUserToken();
  const [sendActivityToProviderMutation, { loading: loadingSend }] =
    useSendActivityToProviderMutation();
  const [modalState, setModalState] = React.useState(false);
  const [mappedPolyLine, setMappedPolyline] = useState<GeoJsonProperties>();
  const [polyline, setPolyline] = useState<string>();
  const [showAllInfo, setShowInfo] = useState(false);
  const { profileID } = useUserToken();
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const mapCamera = useRef<MapboxGL.Camera>(null);
  const layoutProvider = useRef(layoutMaker()).current;
  // const { data: profile } = useUserInfo();

  const [getActivityDetail, { data, loading }] = useGetActivityDetailLazyQuery({
    onCompleted: (e) => {
      console.log('distance: ', e.getActivityDetail.distance);
      if (e.getActivityDetail.summary_polyline) {
        setPolyline(e.getActivityDetail.summary_polyline);
        setMappedPolyline(
          MapBoxPolyline.toGeoJSON(e.getActivityDetail.summary_polyline),
        );
      }
    },
  });

  const HandlePolyline = () => {
    if (mappedPolyLine) {
      return (
        <MapboxGL.MapView
          style={{
            height: 246,
            width: widthPercentageToDP('100'),
            marginBottom: 16,
          }}
          zoomEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          compassEnabled={false}
          logoEnabled={false}
          onPress={() => {
            navigation.navigate('Challenge.ShowSpecificMap', {
              polyline: data?.getActivityDetail.polyline,
              mappedPolyLine: MapBoxPolyline.toGeoJSON(
                data?.getActivityDetail.polyline,
              ),
              data,
            });
          }}
          animated={false}
          styleURL={MapboxGL.StyleURL.Outdoors}
          onDidFinishRenderingMapFully={() => {
            // mapCamera.current?.flyTo([37.33134078979492, -122.03073120117188]);
            if (
              data?.getActivityDetail.bounds &&
              data?.getActivityDetail.bounds.length > 1
            ) {
              mapCamera.current.fitBounds(
                data?.getActivityDetail.bounds[0],
                data?.getActivityDetail.bounds[1],
                [20, 20],
              );
            }
          }}
        >
          <MapboxGL.Camera
            ref={mapCamera}
            animationDuration={0}
            // zoomLevel={13}
            centerCoordinate={mappedPolyLine.coordinates[0]}
          />
          <MapboxGL.ShapeSource
            id="shapeSource"
            shape={makeLineString(mappedPolyLine.coordinates)}
          >
            <MapboxGL.LineLayer
              id="lineLayer"
              style={{ lineWidth: 5, lineJoin: 'bevel', lineColor: '#0564FF' }}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      );
    }
    return null;
  };

  useEffect(() => {
    Sentry.captureMessage(`id: ${route.params.id}`);
    getActivityDetail({
      variables: {
        id: route.params.id,
      },
    });
  }, []);

  const panel = useRef<ActionSheet>(null);

  useEffect(() => {
    if (data?.getActivityDetail.challenges) {
      setDataProvider(dataProviderMaker(data?.getActivityDetail.challenges));
    }
  }, [data]);

  if (loading || !data) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0564ff" />
      </View>
    );
  }

  const shareChallenge = async () => {
    const branchUniversalObject = await branch.createBranchUniversalObject(
      `activity-${route.params.id}-dev`,
      {
        locallyIndex: true,
        title: data?.getActivityDetail.name,
        contentImageUrl: `${PUBLIC_STORAGE}/logos/Quadrada-branca-roxa.png`,
        contentMetadata: {
          customMetadata: {
            activity_id: route.params.id!,
          },
        },
      },
    );
    const shareOptions = {
      messageHeader: 'Olha minha atividade...',
      messageBody: `Olha minha atividade ${
        data?.getActivityDetail.name ?? 'Pedalada'
      }!`,
    };
    const linkProperties = {
      feature: 'share',
      channel: 'RNApp',
    };
    const controlParams = {
      $desktop_url: `https://www.riderize.com/`,
      $uri_redirect_mode: 2,
    };
    await branchUniversalObject.showShareSheet(
      shareOptions,
      linkProperties,
      controlParams,
    );
  };

  const toggleModal = () => {
    setModalState(!modalState);
  };

  console.log(
    'sended to strava',
    data.getActivityDetail.activity_sent_third_party,
  );

  const RenderCard = (type, challenge, index) => (
    <TouchableOpacity
      onPress={() => {
        navigation.push('Challenge.Description', {
          challenge_id: challenge.id,
        });
      }}
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
      }}
    >
      <View style={{ marginRight: 5 }}>
        <CachedImage
          source={{
            uri: `${PUBLIC_STORAGE}/${challenge.image_avatar}`,
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 16,
            marginRight: 5,
          }}
        />
      </View>
      <View style={{ alignItems: 'flex-start', width: '75%' }}>
        <SubInfoText>{challenge.name}</SubInfoText>
      </View>
      <View
        style={{
          width: 28,
          alignItems: 'center',
          marginRight: 5,
        }}
      >
        <Icons name="chevron-right" />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar
        backgroundColor="#FFFFFF"
        animated
        barStyle="dark-content"
        translucent
      />
      <Container>
        <Header>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <Title>Pedalada</Title>
          <TouchableOpacity
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            onPress={() => panel.current.show()}
          >
            <Icons name="dots-horizontal" />
          </TouchableOpacity>
        </Header>
        <ScrollView
          style={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* <CachedImage source={polyline} /> */}
          <ContentWrapper style={{ paddingHorizontal: 0 }}>
            {polyline && <HandlePolyline />}
            <View
              style={{
                alignItems: 'flex-start',
                flexDirection: 'row',
                paddingHorizontal: 16,
              }}
            >
              <View
                style={{
                  width: 28,
                  alignItems: 'center',
                  marginRight: 5,
                  marginTop: 5,
                }}
              >
                <Icons
                  name={
                    data?.getActivityDetail.third_party_data_source_slug ===
                    'riderize'
                      ? 'r'
                      : data?.getActivityDetail.third_party_data_source_slug
                  }
                  width={
                    data?.getActivityDetail.third_party_data_source_slug ===
                    'riderize'
                      ? 25
                      : 25
                  }
                  height={
                    data?.getActivityDetail.third_party_data_source_slug ===
                    'riderize'
                      ? 40
                      : 40
                  }
                />
              </View>
              <View style={{ alignItems: 'flex-start' }}>
                <ChallengeTitle>
                  {data?.getActivityDetail.name ?? 'Pedalada'}
                </ChallengeTitle>
                <SubInfoTitle>
                  <SubInfoTitle style={{ textTransform: 'capitalize' }}>
                    {data?.getActivityDetail.third_party_data_source_slug !==
                    'strava-crawler'
                      ? data?.getActivityDetail.third_party_data_source_slug.replace(
                          '-',
                          ' ',
                        )
                      : 'Strava'}
                  </SubInfoTitle>{' '}
                  -{' '}
                  {format(
                    new Date(data?.getActivityDetail.start_date),
                    "kk':'mm':'ss",
                  ) !== '24:00:00'
                    ? data?.getActivityDetail.start_date &&
                      format(
                        new Date(data?.getActivityDetail.start_date),
                        "dd 'de' MMMM 'de' u 'às' kk':'mm ",
                        { locale: ptBR },
                      )
                    : format(
                        new Date(data?.getActivityDetail.start_date),
                        "dd 'de' MMMM 'de' u",
                        { locale: ptBR },
                      )}
                </SubInfoTitle>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 8,
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}
            >
              {data?.getActivityDetail.duplicated && (
                <View
                  style={{
                    backgroundColor: '#FFC502',
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginRight: 10,
                  }}
                >
                  <Icons name="flagged" />
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 14,
                      color: 'white',
                      marginLeft: 5,
                    }}
                  >
                    Atividade duplicada
                  </Text>
                </View>
              )}

              {data?.getActivityDetail.suspicious && (
                <View
                  style={{
                    backgroundColor: '#FF2525',
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                  }}
                >
                  <Icons name="flagged" />
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 14,
                      color: 'white',
                      marginLeft: 5,
                    }}
                  >
                    Atividade suspeita
                  </Text>
                </View>
              )}
            </View>
          </ContentWrapper>
          <ContentWrapper
            style={{
              paddingHorizontal: 16,
              paddingVertical: 21,
            }}
          >
            <View>
              <View style={{ marginBottom: 16 }}>
                {!route.params.profile && (
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        profileID === data.getActivityDetail.user.profile.id
                      ) {
                        navigation.push('User.Profile');
                      } else {
                        navigation.push('User.VisitorProfile', {
                          profile_id: data.getActivityDetail.user.profile.id,
                        });
                      }
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <CachedImage
                        source={{
                          uri: `${PUBLIC_STORAGE}/${data.getActivityDetail.user.profile?.profile_avatar}`,
                        }}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 48,
                          marginRight: 10,
                        }}
                      />
                      <View>
                        <Title>
                          {data.getActivityDetail.user.firstname}{' '}
                          {data.getActivityDetail.user.lastname}
                        </Title>
                        <SubInfoTitle>
                          @{data.getActivityDetail.user.profile.username}
                        </SubInfoTitle>
                      </View>
                    </View>
                    {/* <Icons name="crown" /> */}
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '100%',
                marginVertical: 17,
              }}
            >
              <View style={{ paddingRight: 16 }}>
                <SubInfoTitle>Distância</SubInfoTitle>
                <GoalInfo>
                  {Number(data?.getActivityDetail.distance / 1000).toFixed(0)}{' '}
                  KM
                </GoalInfo>
              </View>
              <View
                style={{
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  borderLeftColor: '#161C25',
                  borderLeftWidth: 0.5,
                  borderRightColor: '#161C25',
                  borderRightWidth: 0.5,
                }}
              >
                <SubInfoTitle>Elevação</SubInfoTitle>
                <GoalInfo>
                  {data?.getActivityDetail.total_elevation_gain > 0
                    ? `${data?.getActivityDetail.total_elevation_gain} M`
                    : '-'}
                </GoalInfo>
              </View>
              <View style={{ paddingHorizontal: 16 }}>
                <SubInfoTitle>Tempo</SubInfoTitle>
                <GoalInfo>
                  {formatSecondsInHours(
                    data?.getActivityDetail.elapsed_time_seconds,
                  )}
                </GoalInfo>
              </View>
            </View>
            {data?.getActivityDetail.average_speed && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                  borderBottomWidth: 0.5,
                  paddingVertical: 16,
                }}
              >
                <Text>Velocidade média</Text>
                <SubInfoText>
                  {String(
                    data?.getActivityDetail.average_speed.toFixed(2),
                  ).replace('.', ',')}{' '}
                  KM/h
                </SubInfoText>
              </View>
            )}
            {data?.getActivityDetail.start_date && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                  borderBottomWidth: 0.5,
                  paddingVertical: 16,
                }}
              >
                <Text>Data da saída</Text>
                <SubInfoText>
                  {format(
                    new Date(data?.getActivityDetail.start_date),
                    'dd/MM/yyyy',
                  ) !== '00:00:00'
                    ? format(
                        new Date(data?.getActivityDetail.start_date),
                        'dd/MM/yyyy',
                      )
                    : '-'}
                </SubInfoText>
              </View>
            )}

            {data?.getActivityDetail.third_party_data_source_slug !==
              'strava-crawler' &&
              data?.getActivityDetail.start_date &&
              format(new Date(data?.getActivityDetail.start_date), 'pp', {
                locale: ptBR,
              }) !== '00:00:00' && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                    borderBottomWidth: 0.5,
                    paddingVertical: 16,
                  }}
                >
                  <Text>Horário do início</Text>
                  <SubInfoText>
                    {format(
                      new Date(data?.getActivityDetail.start_date),
                      'pp',
                      { locale: ptBR },
                    )}
                  </SubInfoText>
                </View>
              )}

            {data?.getActivityDetail.third_party_data_source_slug !==
              'strava-crawler' &&
              (format(new Date(data?.getActivityDetail.start_date), 'pp', {
                locale: ptBR,
              }) !== '00:00:00'
                ? showAllInfo
                : true) && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                    borderBottomWidth: 0.5,
                    paddingVertical: 16,
                  }}
                >
                  <Text>Horário do término</Text>
                  <SubInfoText>
                    {format(
                      addMinutes(
                        new Date(data?.getActivityDetail.start_date),
                        Number(data.getActivityDetail.elapsed_time_seconds),
                      ),
                      'pp',
                      { locale: ptBR },
                    )}
                  </SubInfoText>
                </View>
              )}
            {(data?.getActivityDetail.third_party_data_source_slug !==
            'strava-crawler'
              ? showAllInfo
              : true) &&
              data?.getActivityDetail.moving_time_seconds !== undefined && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                    borderBottomWidth: 0.5,
                    paddingVertical: 16,
                  }}
                >
                  <Text>Tempo em movimento</Text>
                  <SubInfoText>
                    {formatSecondsInHours(
                      data?.getActivityDetail.moving_time_seconds,
                    )}
                  </SubInfoText>
                </View>
              )}
            {data?.getActivityDetail.calories && showAllInfo && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottomColor: 'rgba(22, 28, 37, 0.19)',
                  borderBottomWidth: 0.5,
                  paddingVertical: 16,
                }}
              >
                <Text>Energia gasta</Text>
                <SubInfoText>
                  {formatNumbers(data?.getActivityDetail.calories, {
                    hasDot: false,
                  })}
                  Kcal
                </SubInfoText>
              </View>
            )}
            {showAllInfo && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 16,
                }}
              >
                <Text>Origem da atividade</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icons
                    name={
                      data?.getActivityDetail.third_party_data_source_slug ===
                      'riderize'
                        ? 'r'
                        : data?.getActivityDetail.third_party_data_source_slug
                    }
                    width={
                      data?.getActivityDetail.third_party_data_source_slug ===
                      'riderize'
                        ? 25
                        : 25
                    }
                    height={
                      data?.getActivityDetail.third_party_data_source_slug ===
                      'riderize'
                        ? 40
                        : 40
                    }
                  />
                  <SubInfoText style={{ marginLeft: 10 }}>
                    {data?.getActivityDetail.third_party_data_source_slug !==
                    'strava-crawler'
                      ? data?.getActivityDetail.third_party_data_source_slug.replace(
                          '-',
                          ' ',
                        )
                      : 'Strava'}
                  </SubInfoText>
                </View>
              </View>
            )}
            <View
              style={{
                alignItems: 'flex-end',
                marginTop: 10,
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <TouchableOpacity onPress={() => setShowInfo(!showAllInfo)}>
                <TitleText style={{ fontSize: 14, opacity: 0.56 }}>
                  Ver {showAllInfo ? 'menos' : 'mais'} detalhes
                </TitleText>
              </TouchableOpacity>
            </View>
          </ContentWrapper>
          {data?.getActivityDetail.challenges &&
            data?.getActivityDetail.challenges.length > 0 && (
              <ContentWrapper
                style={{
                  marginBottom: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 21,
                }}
              >
                <Title>Desafios</Title>
                <SubInfoTitle>
                  Todos os desafios que foram atualizados por esta pedalada.
                </SubInfoTitle>
                <View style={{ minHeight: 1, minWidth: 1 }}>
                  <RecyclerListView
                    canChangeSize
                    layoutProvider={layoutProvider}
                    dataProvider={dataProvider}
                    rowRenderer={RenderCard}
                    scrollViewProps={{
                      showsVerticalScrollIndicator: false,
                    }}
                  />
                </View>

                {data.getActivityDetail.user.profile.id === profileID && (
                  <View style={{ paddingVertical: 40 }}>
                    <Text style={{ paddingBottom: 5 }}>
                      Por que um Desafio não está aqui?
                    </Text>
                    <SubInfoTitle>
                      Para contar para um Desafio a sua pedalada precisa ser
                      feita e enviada ao Aplicativo depois da inscrição, assim
                      como acontece em um Desafio/Evento real.
                    </SubInfoTitle>
                    <View />
                    <SubInfoTitle>
                      Além disso nos casos de Desafio de Altimetria o dispostivo
                      que gravou a atividade precisa ter feito este registro
                      para que possamos validar o seu progresso.
                    </SubInfoTitle>
                  </View>
                )}
              </ContentWrapper>
            )}
        </ScrollView>
      </Container>

      <Modal
        isVisible={modalState}
        // isVisible
        onBackdropPress={() => toggleModal()}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <Box
          backgroundColor="white"
          borderRadius={8}
          alignItems="center"
          px={3}
          py={4}
        >
          <Icons name="share" height={48} width={48} />
          <Typography type="h3" textAlign="center" marginTop={2}>
            Enviar pedalada para Terceiro
          </Typography>
          <Typography textAlign="center" marginTop={2}>
            Escolha um terceiro{'\n'} para enviar a sua pedalada.
          </Typography>

          <Box marginTop={4} width={1}>
            <Box
              px={3}
              py={18}
              as={TouchableOpacity}
              flexDirection="row"
              disabled={
                data.getActivityDetail.activity_sent_third_party &&
                data.getActivityDetail.activity_sent_third_party.length > 0 &&
                data.getActivityDetail.activity_sent_third_party[0]
                  .third_party_data_source_id === STRAVA_ID
              }
              alignItems="center"
              justifyContent="space-between"
              borderBottomColor="#A1A8B1"
              borderBottomWidth={0.5}
              onPress={async () => {
                if (compiledData?.integrated_with_strava) {
                  const { data: payload } =
                    await sendActivityToProviderMutation({
                      variables: {
                        data: {
                          activity_id: data?.getActivityDetail.id,
                          provider_to_send_slug: 'strava',
                        },
                      },
                    });
                  console.log('data: ', payload);
                  if (payload?.sendActivityToProvider) {
                    setSendedToStrava(true);
                  }
                } else {
                  Linking.openURL(
                    `${API}/auth/strava?user_id=${base64.encode(userID)}`,
                  );
                }
              }}
            >
              <Box flexDirection="row" alignItems="center">
                <Icons name="strava-crawler" />
                <Typography marginLeft={16}>Strava</Typography>
              </Box>

              <Box flexDirection="row" alignItems="center">
                {!compiledData?.integrated_with_strava ? (
                  <Box>
                    <Image
                      source={require('../../../assets/btn_strava_connectwith_orange.svg')}
                      resizeMethod="scale"
                      resizeMode="contain"
                      style={{
                        width: widthPercentageToDP('30'),
                        height: 30,
                      }}
                    />
                  </Box>
                ) : (
                  <>
                    {loadingSend ? (
                      <Box>
                        <ActivityIndicator />
                      </Box>
                    ) : (
                      <>
                        {(data.getActivityDetail.activity_sent_third_party &&
                          data.getActivityDetail.activity_sent_third_party
                            .length > 0 &&
                          data.getActivityDetail.activity_sent_third_party[0]
                            .third_party_data_source_id === STRAVA_ID) ||
                        sendedToStrava ? (
                          <Box flexDirection="row" alignItems="center">
                            <Typography color="green" marginRight={2}>
                              Enviado
                            </Typography>
                            <Icons name="check" color="green" />
                          </Box>
                        ) : (
                          <Box>
                            <Icons name="arrow_forward" />
                          </Box>
                        )}
                      </>
                    )}
                  </>
                )}
              </Box>
            </Box>

            <Box
              px={3}
              py={18}
              flexDirection="row"
              alignItems="center"
              opacity={0.5}
            >
              <Icons name="strava-crawler" />

              <Typography marginLeft={16}>Relive - Em Breve</Typography>
            </Box>
          </Box>
        </Box>
      </Modal>

      <ActionSheet
        ref={panel}
        title="O que gostaria de fazer ?"
        options={[
          'Compartilhar Atividade',
          'Enviar pedalada para Terceiro',
          'Cancelar',
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            shareChallenge();
          }
          if (index === 1) {
            toggleModal();
          }
        }}
      />
    </>
  );
};

export default ChallengeShowSpecificActivity;
