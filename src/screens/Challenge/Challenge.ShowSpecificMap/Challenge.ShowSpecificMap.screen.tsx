import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import MapBoxPolyline from '@mapbox/polyline';
import styled from 'styled-components/native';
import { lineString as makeLineString } from '@turf/helpers';
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
import {
  Geometry,
  Feature,
  GeoJsonProperties,
  FeatureCollection,
} from 'geojson';
import Polyline from './polyline';
import { useUserInfo, useUserToken } from '~/hooks';
import { Icons, Text, TitleText, SmallText, SafeAreaView } from '~/components';
import { RootStackParamList } from '~/routes';
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
  const { mappedPolyLine: mappedPolyline } = route.params;
  const [showAllInfo, setShowInfo] = useState(false);
  const { profileID } = useUserToken();
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const mapCamera = useRef<MapboxGL.Camera>(null);
  const layoutProvider = useRef(layoutMaker()).current;
  // const { data: profile } = useUserInfo();

  const handleFitBounds = () => {
    if (
      route.params.data?.getActivityDetail.bounds &&
      route.params.data?.getActivityDetail.bounds.length > 1
    ) {
      mapCamera?.current.fitBounds(
        route.params.data?.getActivityDetail.bounds[0],
        route.params.data?.getActivityDetail.bounds[1],
        [20, 20],
      );
    }
  };

  const [
    getActivityDetail,
    { data, loading },
  ] = useGetActivityDetailLazyQuery();

  const HandlePolyline = () => {};

  useEffect(() => {
    if (route.params.id) {
      getActivityDetail({
        variables: { id: route.params.id },
      });
    }
  }, []);
  const panel = useRef<ActionSheet>(null);

  function handleTime(time: number): number | string {
    const actualDate = new Date();
    const newDate = addMinutes(new Date(), time);
    const { hours, minutes, seconds } = intervalToDuration({
      start: actualDate,
      end: newDate,
    });
    // return format(newDate, "kk':'mm':'ss");
    if (hours || minutes || seconds) {
      return `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
    return '-';
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
            profile: JSON.stringify(route.params.profile),
            user: JSON.stringify(route.params.user),
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
          centerCoordinate={mappedPolyline.coordinates[0]}
        />
        <MapboxGL.ShapeSource
          id="shapeSource"
          shape={makeLineString(mappedPolyline.coordinates)}
        >
          <MapboxGL.LineLayer
            id="lineLayer"
            style={{ lineWidth: 5, lineJoin: 'bevel', lineColor: '#0564FF' }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    </>
  );
};

export default ChallengeShowSpecificMap;
