import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
  FlatList,
  ListRenderItem,
  Image,
} from 'react-native';
import MapBoxPolyline from '@mapbox/polyline';

import { ActivityIndicator } from 'react-native-paper';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { RouteProp, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
// eslint-disable-next-line import/no-duplicates
import { addHours, format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import locale from 'date-fns/locale/pt-BR';
import { PUBLIC_STORAGE } from '@env';
import FastImage from 'react-native-fast-image';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { lineString as makeLineString } from '@turf/helpers';
import { RootStackParamList } from '~/routes.types';
import { useGetUserActivitiesV2LazyQuery } from '~/graphql/autogenerate/hooks';
import {
  Icons,
  SafeAreaView,
  Text,
  ImageBackground,
  Typography,
  Box,
} from '~/components';
import { useStoreState } from '~/store';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { IMonitorSchema, dbMonitorQueue } from '~/db';
import { useActivityMonitorQueue } from '~/hooks/useActivityMonitorQueue';
import formatSecondsInHours from '~/helpers/formatSecondsInHours';
import { Activity, ChallengeActivity } from '~/generated/graphql';

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 16px 0 16px;
`;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
`;
export const UserName = styled(Text)`
  opacity: 0.5;
  line-height: 14px;
`;
export const Name = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  line-height: 20px;
`;
export const Avatar = styled(FastImage)`
  width: 44px;
  height: 44px;
  border-radius: 44px;
`;

export const MinAvatar = styled(FastImage)`
  width: 24px;
  height: 24px;
  border-radius: 24px;
`;
export const AvatarContainer = styled.TouchableOpacity`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'User.Activities'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
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
      dim.height = 446;
    },
  );

const UserActivities: React.FC<Props> = () => {
  const navigation = useNavigation();
  const { loading: loadingSyncMonitor, saveMonitorLocal } =
    useActivityMonitorQueue();

  const syncLoading = useStoreState((state) => state.monitor.syncLoading);
  // const { data: profile } = useUserInfo();
  const [activities, setActivities] = useState([]);
  const profile = useStoreState((state) => state.profile.payload);
  const [fetch, { data, loading, fetchMore }] = useGetUserActivitiesV2LazyQuery(
    {
      onError: (e) => Alert.alert('Erro: ', e.message),
    },
  );

  useEffect(() => {
    fetch({
      variables: {
        pagination: {
          page: 1,
          offset: 20,
        },
      },
    });
  }, []);

  useEffect(() => {
    fetch({
      variables: {
        pagination: {
          page: 1,
          offset: 20,
        },
      },
    });
  }, [loadingSyncMonitor]);

  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [localActivities, setLocalActivities] = useState([]);
  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;
  const layoutProviderQueue = useRef(layoutMaker()).current;
  const mapCamera = useRef<MapboxGL.Camera>(null);

  Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
  };

  const handleLocalActivities = async () => {
    const realm = await dbMonitorQueue();
    const localMonitor = realm.objects<IMonitorSchema>('ActivityQueue');

    if (localMonitor) {
      setLocalActivities(localMonitor);
    }
  };

  useEffect(() => {
    handleLocalActivities();
    saveMonitorLocal();
  }, []);

  useEffect(() => {
    if (
      activities &&
      activities.length > 0 &&
      data?.getUserActivitiesV2.activities
    ) {
      // eslint-disable-next-line prefer-const

      const teste = [...activities, ...data?.getUserActivitiesV2.activities];
      setActivities(teste);
    } else if (data?.getUserActivitiesV2.activities) {
      setActivities(data?.getUserActivitiesV2.activities);
    }
  }, [data]);

  useEffect(() => {
    if (activities && activities.length > 0) {
      setDataProvider(dataProviderMaker(activities));
    }
  }, [activities]);

  const LocalRenderItem = ({ type, item, index }) => {
    return (
      <AvatarContainer
        style={{ paddingHorizontal: 0 }}
        onPress={() => {
          if (profile) {
            navigation.navigate('Challenge.ShowSpecificActivity', {
              id: item.id,
              user: {
                ...profile?.getProfile.user,
                profile: profile?.getProfile,
              },
              profile: profile?.getProfile,
            });
          }
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
          <Icons name="r" width={15} height={15} />
        </View>

        <View
          style={{
            alignItems: 'flex-start',
            marginLeft: 10,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              alignItems: 'flex-start',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: widthPercentageToDP('54'),
            }}
          >
            <Name style={{ width: widthPercentageToDP('54') }}>
              {item.name ? item.name : 'Pedalada'}
            </Name>

            <UserName style={{ marginTop: 10 }}>
              {format(new Date(item.start_date), "PPP 'às' p", {
                locale,
              })}
            </UserName>
          </View>
          <View
            style={{
              width: widthPercentageToDP('20'),
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
            }}
          >
            <Name>{Number(item.distance / 1000).toFixed(2)} KM</Name>
            {item.total_elevation_gain > 0 && (
              <UserName style={{ marginTop: 10 }}>
                {Number(item.total_elevation_gain).toFixed(2)} M
              </UserName>
            )}
          </View>
        </View>
      </AvatarContainer>
    );
  };

  const RenderItem = (type, item: Activity, index) => {
    return (
      <Box
        as={TouchableOpacity}
        boxShadow="0px 0px 22px rgba(21, 46, 88, 0.15)"
        backgroundColor="#FFF"
        width={widthPercentageToDP('100')}
        onPress={() => {
          if (profile) {
            navigation.navigate('Challenge.ShowSpecificActivity', {
              id: item.id,
              user: {
                ...profile?.getProfile.user,
                profile: profile?.getProfile,
              },
              profile: profile?.getProfile,
            });
          }
        }}
      >
        <Box flexDirection="row" p={10}>
          <Avatar
            progressiveRenderingEnabled
            source={{
              uri: `${PUBLIC_STORAGE}/${profile?.getProfile?.profile_avatar}`,
            }}
          />
          <Box ml={2}>
            <Typography type="h4">
              {profile.getProfile.user.firstname}{' '}
              {profile.getProfile.user.lastname}
            </Typography>

            <Box alignItems="center" flexDirection="row">
              <Icons name="bike" color="#A1A8B1" width={16} />
              <Typography type="small" ml={1} color="#A1A8B1">
                {format(
                  addHours(new Date(item.start_date_local), 3),
                  "PPP 'às' p",
                  {
                    locale,
                  },
                )}
              </Typography>
            </Box>
          </Box>
        </Box>

        {item.processing ? (
          <Box
            px={3}
            py={3}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography type="h3">Processando Atividade</Typography>

            <ActivityIndicator color="#0564FF" />
          </Box>
        ) : (
          <>
            <Box px={3} paddingTop={3}>
              <Typography type="h3">{item.name}</Typography>
            </Box>

            <Box
              flexDirection="row"
              py={3}
              justifyContent="space-between"
              px={3}
            >
              <Box flexDirection="row">
                <Box>
                  <Typography type="small">Tempo</Typography>
                  <Typography type="h3">
                    {formatSecondsInHours(item.moving_time_seconds)}
                  </Typography>
                </Box>

                <Box ml={17}>
                  <Typography type="small">Distância</Typography>
                  <Typography type="h3">
                    {Number(item.distance / 1000).toFixed(2)} km
                  </Typography>
                </Box>

                <Box ml={17}>
                  <Typography type="small">Elevação</Typography>
                  <Typography type="h3">
                    {item.total_elevation_gain} m
                  </Typography>
                </Box>
              </Box>

              {false ? (
                <Box alignItems="flex-end">
                  <Typography type="small">Conquistas</Typography>

                  <Box flexDirection="row" alignItems="center">
                    <Icons
                      name="new-trophy"
                      color="#FDC746"
                      style={{ marginRight: 4 }}
                    />
                    <Icons
                      name="new-trophy"
                      color="#CCCCCC"
                      style={{ marginRight: 4 }}
                    />
                    <Typography type="h3">02</Typography>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </>
        )}

        <ImageBackground
          source={
            item.thumbnail
              ? { uri: `${PUBLIC_STORAGE}/${item.thumbnail}` }
              : require('./map.jpg')
          }
          style={{
            width: widthPercentageToDP('100'),
            height: widthPercentageToDP('100') / 1.78,
            alignItems: 'flex-end',
            padding: 8,
          }}
        >
          {false ? (
            <Box
              borderColor="#0564FF"
              borderWidth={1}
              backgroundColor="#FFF"
              borderRadius={100}
              width={94}
              flexDirection="row"
              p={1}
            >
              <Icons name="photo-library" color="#0564FF" />
              <Typography color="#0564FF" marginLeft={1}>
                6 Fotos
              </Typography>
            </Box>
          ) : null}
        </ImageBackground>

        {false ? (
          <Box
            flexDirection="row"
            width={1}
            justifyContent="space-between"
            py={3}
            px={3}
          >
            <Box flexDirection="row">
              <Box>
                <Icons name="claps" width={20.87} />
              </Box>
              <Box marginX={3}>
                <Icons name="chat" width={24} />
              </Box>
              <Box>
                <Icons name="share" width={24} />
              </Box>
            </Box>

            <Box flexDirection="row">
              <Typography type="small" mr={2}>
                Pedalaram com você
              </Typography>

              <MinAvatar
                progressiveRenderingEnabled
                source={{
                  uri: `${PUBLIC_STORAGE}/${profile?.getProfile?.profile_avatar}`,
                }}
              />
              <MinAvatar
                progressiveRenderingEnabled
                source={{
                  uri: `${PUBLIC_STORAGE}/${profile?.getProfile?.profile_avatar}`,
                }}
              />
              <MinAvatar
                progressiveRenderingEnabled
                source={{
                  uri: `${PUBLIC_STORAGE}/${profile?.getProfile?.profile_avatar}`,
                }}
              />
            </Box>
          </Box>
        ) : null}
      </Box>
    );

    // return (
    //   <AvatarContainer
    //     style={{ paddingHorizontal: 0 }}
    //     onPress={() => {
    //       if (profile) {
    //         navigation.navigate('Challenge.ShowSpecificActivity', {
    //           id: item.id,
    //           user: {
    //             ...profile?.getProfile.user,
    //             profile: profile?.getProfile,
    //           },
    //           profile: profile?.getProfile,
    //         });
    //       }
    //     }}
    //   >
    //     <View
    //       style={{
    //         width: 28,
    //         alignItems: 'center',
    //         marginRight: 5,
    //         marginTop: 5,
    //       }}
    //     >
    //       <Icons
    //         name={
    //           item.third_party_data_source_slug
    //             ? item.third_party_data_source_slug === 'riderize'
    //               ? 'r'
    //               : item.third_party_data_source_slug
    //             : 'strava-crawler'
    //         }
    //         width={item.third_party_data_source_slug === 'riderize' ? 15 : 15}
    //         height={item.third_party_data_source_slug === 'riderize' ? 15 : 30}
    //       />
    //     </View>
    //     <Avatar
    //       progressiveRenderingEnabled
    //       source={{
    //         uri: `${PUBLIC_STORAGE}/${profile?.getProfile?.profile_avatar}`,
    //       }}
    //     />
    //     <View
    //       style={{
    //         alignItems: 'flex-start',
    //         marginLeft: 10,
    //         flexDirection: 'row',
    //       }}
    //     >
    //       <View
    //         style={{
    //           alignItems: 'flex-start',
    //           flexDirection: 'column',
    //           justifyContent: 'space-between',
    //           width: widthPercentageToDP('60'),
    //         }}
    //       >
    //         <Name style={{ width: widthPercentageToDP('58') }}>
    //           {item.name ?? 'Pedalada'}
    //         </Name>
    //
    //         <UserName style={{ marginTop: 10 }}>
    //           {format(
    //             addHours(new Date(item.start_date_local), 3),
    //             "PPP 'às' p",
    //             {
    //               locale,
    //             },
    //           )}
    //         </UserName>
    //       </View>
    //       <View
    //         style={{
    //           width: widthPercentageToDP('20'),
    //           alignItems: 'flex-end',
    //           justifyContent: 'flex-start',
    //         }}
    //       >
    //         <Name>{Number(item.distance / 1000).toFixed(2)} KM</Name>
    //         {item.total_elevation_gain > 0 && (
    //           <UserName style={{ marginTop: 10 }}>
    //             {Number(item.total_elevation_gain).toFixed(2)} M
    //           </UserName>
    //         )}
    //       </View>
    //     </View>
    //   </AvatarContainer>
    // );
  };

  if (loading && !activities)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <Header>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <Title>Minhas Pedaladas</Title>
          <View style={{ width: 20 }} />
        </Header>
        <ActivityIndicator size="large" color="#0564FF" />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <Header>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Menu');
            }}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <Title>Minhas Pedaladas</Title>
          {loading ? (
            <ActivityIndicator size="small" color="#0564ff" />
          ) : (
            <View style={{ width: 20 }} />
          )}
        </Header>
        {syncLoading && localActivities.length > 0 && (
          <View
            style={{
              marginBottom: 20,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              borderColor: 'rgba(22, 28, 37, 0.4)',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text>SINCRONIZANDO ATIVIDADES</Text>
              <ActivityIndicator color="#0564FF" />
            </View>
            <FlatList data={localActivities} renderItem={LocalRenderItem} />
          </View>
        )}

        {/* <RecyclerListView
          layoutProvider={layoutProviderQueue}
          dataProvider={localActivities}
          rowRenderer={LocalRenderItem}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
          }}
          renderContentContainer={(props, element) => (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 10, lineHeight: 10 }}>
                  SINCRONIZANDO ATIVIDADES
                </Text>

                <ActivityIndicator />
              </View>

              <View style={{ marginTop: 0 }}>{element}</View>
            </View>
          )}
          style={{
            borderWidth: 1,
            borderColor: 'rgba(22, 28, 37, 0.3)',
            paddingVertical: 10,
            paddingHorizontal: 5,
            borderRadius: 10,
          }}
        /> */}

        <RecyclerListView
          // disableRecycling
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={RenderItem}
          extendedState={activities}
          canChangeSizes
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
            backgroundColor: '#FFF',
          }}
          onEndReached={() => {
            if (data?.getUserActivitiesV2.page_info.has_next_page && fetch) {
              fetch({
                variables: {
                  pagination: {
                    page: data?.getUserActivitiesV2.page_info.current_page + 1,
                    offset: 20,
                  },
                },
              });
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserActivities;
