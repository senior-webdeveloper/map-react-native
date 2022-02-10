import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import {
  checkMultiple,
  PERMISSIONS,
  checkNotifications,
} from 'react-native-permissions';
import Carousel from 'react-native-snap-carousel';
import PaginationDot from 'react-native-animated-pagination-dot';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { NetworkStatus } from '@apollo/client';
import { ActivityIndicator } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Box, TitleText, Text, Icons } from '~/components';
import { useExploreChallengesV2LazyQuery } from '~/graphql/autogenerate/hooks';
import { useUpdateLastLogin, useUserToken, useOfflineDashboard } from '~/hooks';
import { useStoreState } from '~/store';
import {
  Container,
  Header,
  TitleOthers,
  BigCard,
  BigImage,
  HighlightImage,
  HighlightsCardHorizontal,
  HighlightImageHorizontal,
  HighlightsCardTitle,
  RockyMountain,
  RockyMountainHorizontal,
  SeeAllText,
  Carrousel,
  Gradient,
  LabelContainer,
  LabelText,
  LabelContainerHighlight,
  LabelTextHighlight,
} from './styles';

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';

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
      dim.height = 450;
    },
  );

type DataTypes = 'local' | 'online';

const ChallengesMain: React.FC = ({
  // profileID,
  data,
  offlineData,
  loading,
  fetchMore,
  route,
  networkStatus,
}) => {
  const compiledDataLocal = useStoreState(
    (state) => state.compiledData.dataCompiled,
  );
  const networkIsConnected = useStoreState(
    (state) => state.network.isConnected,
  );
  const { profileID } = useUserToken();
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const actualPage = useRef(1);
  const isOnFetchMore = useRef(false);
  const layoutProvider = useRef(layoutMaker()).current;
  const userProfile = useStoreState((state) => state.profile.payload);
  const previousLength = useRef(0);
  const canFetchMore = useRef(false);
  const usingData = useRef<DataTypes>('local');
  const [canShowData, setCanShowData] = useState(false);

  useEffect(() => {
    if (
      data &&
      data.exploreChallengesV2.items &&
      data.exploreChallengesV2.items.length > 0 &&
      networkIsConnected
    ) {
      setTimeout(() => {
        canFetchMore.current = true;
      }, 2000);

      setTimeout(() => {
        setCanShowData(true);
      }, 2000);
    }
  }, [data, networkIsConnected]);

  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));

  useEffect(() => {
    if (offlineData && offlineData.items && !data && !isOnFetchMore.current) {
      console.log('caiu aqui 1');
      usingData.current = 'local';
      actualPage.current = offlineData.page_info.current_page;
      setDataProvider(dataProviderMaker(offlineData.items));
    }
    if (offlineData && offlineData.items && !data && !networkIsConnected) {
      console.log('caiu aqui 2');
      usingData.current = 'local';
      actualPage.current = offlineData.page_info.current_page;
      setDataProvider(dataProviderMaker(offlineData.items));
    } else if (data && data.exploreChallengesV2.items && networkIsConnected) {
      console.log('caiu aqui 3');
      usingData.current = 'online';
      actualPage.current = data.exploreChallengesV2.page_info.current_page;
      console.log(
        '🚀 ~ file: index.tsx ~ line 141 ~ useEffect ~ data.exploreChallengesV2',
        data.exploreChallengesV2.page_info,
      );
      setDataProvider(dataProviderMaker(data.exploreChallengesV2.items));
    }
  }, [offlineData, data, networkIsConnected]);

  const [contentHeight, setContentHeight] = useState(0);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const result = await checkMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);
      if (result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'denied') {
        navigation.push('Permission.Location');
      }
    } else {
      const result = await checkMultiple([
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        PERMISSIONS.IOS.LOCATION_ALWAYS,
      ]);
      if (result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === 'denied') {
        navigation.push('Permission.Location');
      }
      const { status } = await checkNotifications();
      if (status === 'denied' || status === 'unavailable') {
        // TODO: REMOVE THE SECOND VALIDATION
        navigation.navigate('Permission.Notifications');
      }
    }
  };

  useEffect(() => {
    if (
      compiledDataLocal?.view_welcome_screen === false &&
      !route.params.accepted_initial_screen
    ) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'User.Welcome',
              params: { name: userProfile?.getProfile?.user?.firstname },
            },
          ],
        }),
      );
    }
  }, [compiledDataLocal, navigation, userProfile]);

  React.useEffect(() => {
    checkPermissions();
  }, []);

  const CarouselRenderItem = useCallback(({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.push('Challenge.Description', {
            challenge_id: item.id,
          })
        }
        style={{ alignItems: 'center' }}
      >
        <HighlightImage
          key={index}
          source={{
            uri: `${PUBLIC_STORAGE}/${item.image_cover}`,
          }}
          resizeMethod="scale"
          progressiveRenderingEnabled
          loadingIndicatorSource={{
            uri: item,
          }}
          imageStyle={{ borderRadius: 16 }}
        >
          <Gradient
            style={{
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
            colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)']}
          >
            {item.configuration && !item.configuration.is_paid ? (
              <LabelContainerHighlight>
                <LabelTextHighlight>Gratuito</LabelTextHighlight>
              </LabelContainerHighlight>
            ) : null}
            {item.physical_event ? (
              <LabelContainerHighlight style={{ backgroundColor: '#FF5500' }}>
                <LabelTextHighlight>Presencial</LabelTextHighlight>
              </LabelContainerHighlight>
            ) : null}
            <TitleText style={{ color: '#fff', marginTop: 12, width: '80%' }}>
              {item.name}
            </TitleText>
          </Gradient>
        </HighlightImage>
      </TouchableOpacity>
    );
  }, []);
  const RenderItemCall = (type, el) => {
    return (
      <Container>
        {el.type === 'highlights' && (
          <>
            <Carousel
              autoplay
              lockScrollWhileSnapping
              autoplayDelay={1000}
              autoplayInterval={4000}
              loop
              loopClonesPerSide={el.content.length}
              enableSnap
              firstItem={el.content.length}
              bounces={el.content.length > 1}
              onSnapToItem={(index) => {
                setActiveSlide(index);
              }}
              data={el.content}
              horizontal
              renderItem={({ item, index }) => (
                <CarouselRenderItem item={item} index={index} />
              )}
              sliderWidth={width}
              itemWidth={width}
            />
            {el.content.length > 1 ? (
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <PaginationDot
                  activeDotColor="#0564FF"
                  curPage={activeSlide}
                  maxPage={el.content.length}
                  sizeRatio={0.9}
                />
              </View>
            ) : null}

            {/* */}
          </>
        )}
        <Header isHighlight={el.type === 'highlights'}>
          {el.type === 'highlights' ? null : (
            <TitleOthers>{el.name}</TitleOthers>
          )}
          {el.type !== 'highlights' && (
            <TouchableOpacity
              onPress={() => {
                navigation.push('Challenge.SeeMoreChallenge', {
                  key: el.key,
                  profile_id: profileID,
                  title: el.name,
                });
              }}
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            >
              <SeeAllText>Ver todos</SeeAllText>
            </TouchableOpacity>
          )}
        </Header>
        {el.type === 'smallCarousel' && (
          <Carrousel horizontal showsHorizontalScrollIndicator={false}>
            {el.content.map((smallChallenge, index) => (
              <TouchableWithoutFeedback
                key={smallChallenge.id + index}
                onPress={() =>
                  navigation.push('Challenge.Description', {
                    challenge_id: smallChallenge.id,
                  })
                }
              >
                <HighlightsCardHorizontal>
                  <HighlightImageHorizontal
                    imageStyle={{ borderRadius: 16 }}
                    progressiveRenderingEnabled
                    source={{
                      uri: `${PUBLIC_STORAGE}/${smallChallenge.image_cover}`,
                    }}
                  >
                    <RockyMountainHorizontal
                      progressiveRenderingEnabled
                      source={{
                        uri: `${PUBLIC_STORAGE}/${smallChallenge.image_avatar}`,
                      }}
                    />
                  </HighlightImageHorizontal>
                  <HighlightsCardTitle>
                    {smallChallenge.name}
                  </HighlightsCardTitle>
                  {smallChallenge.configuration &&
                  !smallChallenge.configuration.is_paid ? (
                    <LabelContainer>
                      <LabelText>Gratuito</LabelText>
                    </LabelContainer>
                  ) : null}
                  {smallChallenge.physical_event ? (
                    <LabelContainer style={{ backgroundColor: '#FF5500' }}>
                      <LabelText>Presencial</LabelText>
                    </LabelContainer>
                  ) : null}
                </HighlightsCardHorizontal>
              </TouchableWithoutFeedback>
            ))}
          </Carrousel>
        )}

        {el.type === 'bigCarousel' && (
          <Carrousel horizontal showsHorizontalScrollIndicator={false}>
            {el.content.map((bigChallenge) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.push('Challenge.Description', {
                    challenge_id: bigChallenge.id,
                  });
                }}
              >
                <BigCard>
                  <BigImage
                    progressiveRenderingEnabled
                    imageStyle={{ borderRadius: 16 }}
                    source={{
                      uri: `${PUBLIC_STORAGE}/${bigChallenge.image_cover}`,
                    }}
                  >
                    <RockyMountain
                      progressiveRenderingEnabled
                      style={{ marginTop: 16, marginRight: 16 }}
                      source={{
                        uri: `${PUBLIC_STORAGE}/${bigChallenge.image_avatar}`,
                      }}
                    />
                  </BigImage>
                  <HighlightsCardTitle>{bigChallenge.name}</HighlightsCardTitle>
                </BigCard>
              </TouchableWithoutFeedback>
            ))}
          </Carrousel>
        )}
      </Container>
    );
  };

  useEffect(() => {
    if (data?.exploreChallengesV2) {
      // setForceRender((prevState) => !prevState);
      setDataProvider(dataProviderMaker(data?.exploreChallengesV2.items));
    }
  }, [data?.exploreChallengesV2, actualPage.current]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      {!canShowData ? (
        <SkeletonPlaceholder position="absolute" top={0}>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              width={widthPercentageToDP('100')}
              height={478}
              borderRadius={16}
            />
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="flex-start"
              marginTop={16}
            >
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  width={widthPercentageToDP('100')}
                  paddingHorizontal={16}
                >
                  <SkeletonPlaceholder.Item
                    width={150}
                    height={26}
                    borderRadius={4}
                  />
                  <SkeletonPlaceholder.Item
                    width={90}
                    height={26}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder.Item>

                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="flex-start"
                  marginTop={24}
                  paddingHorizontal={16}
                >
                  <SkeletonPlaceholder.Item
                    width={148}
                    height={188}
                    borderRadius={16}
                  />
                  <SkeletonPlaceholder.Item
                    width={148}
                    height={188}
                    marginLeft={16}
                    borderRadius={16}
                  />
                  <SkeletonPlaceholder.Item
                    width={148}
                    height={188}
                    marginLeft={16}
                    borderRadius={16}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="flex-start"
              marginTop={16}
              paddingHorizontal={16}
            >
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  width={widthPercentageToDP('100')}
                >
                  <SkeletonPlaceholder.Item
                    width={150}
                    height={26}
                    borderRadius={4}
                  />
                  <SkeletonPlaceholder.Item
                    width={90}
                    height={26}
                    borderRadius={4}
                  />
                </SkeletonPlaceholder.Item>

                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="flex-start"
                  marginTop={24}
                >
                  <SkeletonPlaceholder.Item
                    width={148}
                    height={188}
                    borderRadius={16}
                  />
                  <SkeletonPlaceholder.Item
                    width={148}
                    height={188}
                    marginLeft={16}
                    borderRadius={16}
                  />
                  <SkeletonPlaceholder.Item
                    width={148}
                    height={188}
                    marginLeft={16}
                    borderRadius={16}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ) : null}

      <Gradient
        style={{
          position: 'absolute',
          top: 0,
          flex: 0,
          height: 30,
          borderRadius: 0,
        }}
        colors={[
          'rgba(0, 0, 0, 0.7)',
          'rgba(0, 0, 0, 0.6)',
          'rgba(0, 0, 0, 0.4)',
          'rgba(0, 0, 0, 0.2)',
          'transparent',
        ]}
      />

      <RecyclerListView
        onScroll={(e) => {
          setContentHeight(e.nativeEvent.layoutMeasurement?.height);
        }}
        forceNonDeterministicRendering
        disableRecycling
        optimizeForInsertDeleteAnimations
        extendedState={{
          activeSlide,
          data,
          actualPage,
          offlineData,
        }}
        style={{
          minHeight: heightPercentageToDP('100'),
          minWidth: widthPercentageToDP('100'),
        }}
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={RenderItemCall}
        initialOffset={40}
        renderAheadOffset={40}
        onEndReachedThreshold={heightPercentageToDP(`10`)}
        renderFooter={() => (
          <Box>
            {networkStatus === NetworkStatus.loading ? (
              <Box alignItems="center" justifyContent="center">
                <ActivityIndicator size="small" color="#4595EC" />
                <Text style={{ fontSize: 12, color: '#4595EC' }}>
                  CARREGANDO
                </Text>
              </Box>
            ) : null}
            {data?.exploreChallengesV2 &&
            !data?.exploreChallengesV2.page_info.has_next_page &&
            networkStatus !== NetworkStatus.loading ? (
              <Box alignItems="center" justifyContent="center">
                <Icons name="finish-line" width={150} height={150} />
                <Text style={{ fontSize: 12, color: '#4595EC' }}>
                  Você viu todos os Desafios
                </Text>
              </Box>
            ) : null}
          </Box>
        )}
        onEndReached={() => {
          if (
            profileID &&
            data &&
            data.exploreChallengesV2 &&
            data.exploreChallengesV2.page_info.has_next_page &&
            fetchMore
          ) {
            isOnFetchMore.current = true;
            actualPage.current += 1;
            fetchMore({
              variables: {
                page: data.exploreChallengesV2.page_info.current_page + 1,
                profile_id: profileID,
              },
            });
          }
        }}
        scrollViewProps={{
          removeClippedSubviews: true,
          nestedScrollEnabled: true,
          refreshControl: (
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                if (networkIsConnected) {
                  actualPage.current = 1;
                  previousLength.current = 0;
                  fetchMore({
                    variables: {
                      page: 1,
                      profile_id: profileID,
                    },
                  });
                } else {
                  Toast.show(
                    'Você precisa estar online para isso.',
                    Toast.LONG,
                  );
                }
              }}
            />
          ),
          contentContainerStyle: {
            paddingBottom: 80,
          },
        }}
      />
    </View>
  );
};

const Challenges = ({ route }): JSX.Element => {
  const profile = useStoreState((state) => state.profile.payload);
  const { handleUpdateLastLogin } = useUpdateLastLogin();
  const { exploreChallenges, handleRealmSaveDashboard, localLoading } =
    useOfflineDashboard();

  const hasUpdated = useRef(false);
  const fetchedData = useRef(false);
  const networkIsConnected = useStoreState(
    (state) => state.network.isConnected,
  );

  const [fetchExploreChallenges, { data, fetchMore, networkStatus }] =
    useExploreChallengesV2LazyQuery({
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    if (data) {
      handleRealmSaveDashboard(data);
    }
  }, [data]);

  useEffect(() => {
    if (
      !data?.exploreChallengesV2 &&
      fetchedData.current === false &&
      profile?.getProfile.id &&
      networkIsConnected
    ) {
      console.log('entrou aqui', {
        variables: {
          page: 1,
          profile_id: profile?.getProfile.id,
        },
      });
      fetchExploreChallenges({
        variables: {
          page: 1,
          profile_id: profile?.getProfile.id,
        },
      });
      fetchedData.current = true;
    }
  }, [
    data?.exploreChallengesV2,
    fetchExploreChallenges,
    profile,
    networkIsConnected,
  ]);

  useEffect(() => {
    if (hasUpdated.current === false) {
      hasUpdated.current = true;
      handleUpdateLastLogin();
    }
  }, []);

  return (
    <ChallengesMain
      data={data}
      route={route}
      networkStatus={networkStatus}
      offlineData={exploreChallenges}
      loading={localLoading}
      fetchMore={fetchExploreChallenges}
      // fetchMore={fetchExploreChallenges}
      profileID={profile?.getProfile.id}
    />
  );
};

export default Challenges;
