import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import MapBoxPolyline from '@mapbox/polyline';
import styled from 'styled-components/native';
import { lineString as makeLineString, Position } from '@turf/helpers';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { RouteProp, useNavigation } from '@react-navigation/native';
import CachedImage from 'react-native-image-cache-wrapper';
// eslint-disable-next-line import/no-duplicates
import { addMinutes, format, intervalToDuration } from 'date-fns';
import { PUBLIC_STORAGE } from '@env';
import ActionSheet from 'react-native-actionsheet';
import branch from 'react-native-branch';
import FastImage from 'react-native-fast-image';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RecyclerListView,
  DataProvider,
  BaseDataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import Toast from 'react-native-simple-toast';
import * as Sentry from '@sentry/react-native';
import { useUserInfo, useUserToken } from '~/hooks';
import { Icons, Text, TitleText, SmallText, SafeAreaView } from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  useGetActivityDetailLazyQuery,
  useGetActivityDetailQuery,
} from '~/graphql/autogenerate/hooks';
import { Activity } from '~/graphql/autogenerate/schemas';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import formatMinutesInHours from '~/helpers/formatMinutesInHours';
import formatNumbers from '~/helpers/formatNumbers';
import start from './start.png';
import finish from './finish.png';
import { useStoreState } from '~/store';
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
  'Challenge.ShowSpecificMap'
>;

type ShowSpecificAcitivityNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.ShowSpecificMap'
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

const ChallengeShowSpecificMap: React.FC<Props> = ({ route, navigation }) => {
  const { course } = route.params;
  const networkIsConnected = useStoreState(
    (state) => state.network.isConnected,
  );

  // useEffect(() => {
  //   if (polyline300) {
  //     const lat = polyline300.features.geometry.coordinates.map((location) =>
  //       parseFloat(location[1]),
  //     );
  //     const lng = polyline300.features.geometry.coordinates.map((location) =>
  //       parseFloat(location[0]),
  //     );
  //     const minCoords = [Math.min.apply(null, lng), Math.min.apply(null, lat)];
  //     const maxCoords = [Math.max.apply(null, lng), Math.max.apply(null, lat)];
  //     const formattedGeoData = [minCoords, maxCoords];
  //     console.log(
  //       '🚀 ~ file: Playground.screen.tsx ~ line 166 ~ useEffect ~ formattedGeoData',
  //       formattedGeoData,
  //     );
  //   }
  // }, [polyline300]);

  const mapCamera = useRef<MapboxGL.Camera>(null);
  // const { data: profile } = useUserInfo();

  const handleFitBounds = () => {
    const km70 = [
      [-49.653870000000005, -27.20513],
      [-49.49615000000001, -27.018900000000002],
    ];
    const km120 = [
      [-49.72818, -27.214570000000002],
      [-49.49615000000001, -27.018900000000002],
    ];
    const km200 = [
      [-49.88056, -27.30758],
      [-49.49615000000001, -27.018900000000002],
    ];
    const km300 = [
      [-49.94986, -27.637590000000003],
      [-49.49615000000001, -27.018900000000002],
    ];

    if (mapCamera.current) {
      switch (course) {
        case 70:
          mapCamera.current.fitBounds(km70[0], km70[1], [20, 20], 1500);
          break;
        case 120:
          mapCamera.current.fitBounds(km120[0], km120[1], [20, 20], 1500);
          break;
        case 200:
          mapCamera.current.fitBounds(km200[0], km200[1], [20, 20], 1500);
          break;
        case 300:
          mapCamera.current.fitBounds(km300[0], km300[1], [20, 20], 1500);
          break;

        default:
          break;
      }
    }
  };

  const handleBounds = (): [Position, Position] => {
    const km70 = [
      [-49.65387, -27.24695],
      [-49.47784, -27.10814],
    ];
    const km120 = [
      [-49.742180000000005, -27.28217],
      [-49.452630000000006, -27.10828],
    ];
    const km200 = [
      [-49.742140000000006, -27.53499],
      [-49.32455, -27.10828],
    ];
    const km300 = [
      [-49.742140000000006, -27.53499],
      [-49.32455, -27.10828],
    ];

    switch (course) {
      case 70:
        return km70 as [Position, Position];
      case 120:
        return km120 as [Position, Position];
      case 200:
        return km200 as [Position, Position];
      case 300:
        return km300 as [Position, Position];
      default:
        return km300 as [Position, Position];
    }
  };

  useEffect(() => {
    if (course) {
      switch (course) {
        case 70:
          handleFitBounds();
          break;
        case 120:
          handleFitBounds();
          break;
        case 200:
          handleFitBounds();
          break;
        case 300:
          handleFitBounds();
          break;

        default:
          break;
      }
    }
  }, []);

  const handleCoordinates = () => {
    switch (course) {
      default:
        break;
    }
  };

  const handleSaveOfflineMap = async () => {
    if (networkIsConnected) {
      const progressListener = (offlineRegion, status) =>
        Toast.show(
          `Atualizando mapa local: ${status.percentage.toFixed(0)}%`,
          Toast.LONG,
        );
      const errorListener = (offlineRegion, err) =>
        Sentry.captureMessage(err.message);

      await MapboxGL.offlineManager.createPack(
        {
          name: String(course),
          styleURL: MapboxGL.StyleURL.Outdoors,
          minZoom: 10,
          maxZoom: 15,
          bounds: handleBounds(),
        },
        progressListener,
        errorListener,
      );
    }
  };

  useEffect(() => {
    handleSaveOfflineMap();
  }, []);

  const featureCollectionStart = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
        properties: {
          icon: 'start',
        },
        geometry: {
          type: 'Point',
          coordinates: handleCoordinates()[0],
        },
      },
    ],
  };
  const featureCollectionFinish = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
        properties: {
          icon: 'finish',
        },
        geometry: {
          type: 'Point',
          coordinates: handleCoordinates()[handleCoordinates().length - 1],
        },
      },
    ],
  };

  return (
    <>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          zIndex: 9999,
          backgroundColor: '#FFF',
          borderRadius: 100,
          padding: 10,

          shadowOffset: {
            width: 0,
            height: -0,
          },
          shadowOpacity: 0.1,
          shadowRadius: 0,
        }}
        onPress={() => navigation.goBack()}
      >
        <Icons name="close" />
      </TouchableOpacity>
      <MapboxGL.MapView
        style={{
          flex: 1,
          height: heightPercentageToDP('100'),
          width: widthPercentageToDP('100'),
        }}
        styleURL={MapboxGL.StyleURL.Outdoors}
        onDidFinishLoadingMap={handleFitBounds}
      >
        <MapboxGL.Camera
          ref={mapCamera}
          centerCoordinate={handleCoordinates()[0]}
        />
        <MapboxGL.UserLocation
          visible
          showsUserHeadingIndicator
          animated
          // minDisplacement={15}
          androidRenderMode="compass"
          renderMode="native"
        />

        <MapboxGL.ShapeSource
          id="shapeSource"
          shape={makeLineString(handleCoordinates())}
        >
          <MapboxGL.LineLayer
            id="lineLayer"
            style={{ lineWidth: 5, lineJoin: 'bevel', lineColor: '#0564FF' }}
          />
        </MapboxGL.ShapeSource>

        <MapboxGL.Images
          // nativeAssetImages={['pin']}
          images={{
            start,
            finish,
          }}
        />

        <MapboxGL.ShapeSource
          id="exampleShapeSource2"
          minZoomLevel={10}
          shape={featureCollectionFinish}
          iconAllowOverlap
        >
          <MapboxGL.SymbolLayer
            id="exampleIconFinish"
            style={{
              iconImage: 'finish',
              iconSize: 0.05,
              iconAllowOverlap: true,
            }}
          />
        </MapboxGL.ShapeSource>

        <MapboxGL.ShapeSource
          id="exampleShapeSource"
          shape={featureCollectionStart}
          minZoomLevel={10}
          iconAllowOverlap
          // shape={{ coordinates: handleCoordinates()[0] }}
        >
          <MapboxGL.SymbolLayer
            id="exampleIconStart"
            style={{
              iconImage: 'start',
              iconSize: 0.2,
              iconAllowOverlap: true,
            }}
          />
        </MapboxGL.ShapeSource>
        {/* <MapboxGL.PointAnnotation coordinate={handleCoordinates()[0]}>
          <CachedImage
            source={require('./start.png')}
            style={{ width: 20, height: 20 }}
          />
        </MapboxGL.PointAnnotation>
        <MapboxGL.PointAnnotation
          coordinate={handleCoordinates()[handleCoordinates().length - 1]}
        >
          <CachedImage
            source={require('./finish.png')}
            style={{ width: 20, height: 25 }}
          />
        </MapboxGL.PointAnnotation> */}
      </MapboxGL.MapView>
    </>
  );
};

export default ChallengeShowSpecificMap;
