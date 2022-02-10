import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  Dimensions,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CachedImage from 'react-native-image-cache-wrapper';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { PUBLIC_STORAGE } from '@env';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { ActivityIndicator } from 'react-native-paper';
import { Icons, SafeAreaView, ImageBackground } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { useShowAllChallengesV2LazyQuery } from '~/graphql/autogenerate/hooks';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';

export const Container = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  margin-bottom: 60px;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px 0 24px;
`;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
`;

export const TitleOthers = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 24px;
`;
export const HighlightsCard = styled.View`
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 16px;
`;
export const HighlightImage = styled(ImageBackground)`
  width: 100%;
  height: 376.19px;
  border-radius: 16px;
  margin-bottom: 14px;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 15px;
  /* padding: 16px 16px 0 0; */
`;
export const HighlightsCardTitle = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  margin-right: 9px;
  font-size: 16px;
  line-height: 20px;
  color: #161c25;
`;
export const HighlightsCardNormal = styled.Text`
  font-family: 'NeuzeitGro-Reg';
  font-size: 16px;
  line-height: 20px;
  color: #161c25;
  margin-left: 11px;
`;
export const RockyMountain = styled(CachedImage)`
  width: 64px;
  height: 64px;
  border-radius: 8px;
`;

export const CardOverlay = styled.View`
  width: 100%;
  background: #161c25;
  opacity: 0.9;
  padding: 10px;
  align-items: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;
export const ChallengeInfo = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;
export const InfoContainer = styled.View``;
export const AvatarContainer = styled.View`
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 64px;
  height: 64px;
  border: 0.5px solid #303030;
`;
export const InfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'Challenge.SeeMoreChallenge'
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
    () => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      dim.width = width - 16;
      dim.height = 500;
    },
  );

const ChallengeSeeMoreChallenge: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { key, profile_id, title } = route.params;
  const actualPage = useRef(1);
  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);
  const [challenges, setChallenges] = useState([]);
  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;

  const [fetch, { data, loading }] = useShowAllChallengesV2LazyQuery();

  useEffect(() => {
    if (challenges && challenges.length > 0) {
      setDataProvider(dataProviderMaker(challenges));
    }
  }, [challenges]);

  useEffect(() => {
    if (
      data &&
      data.showAllChallengesV2 &&
      data.showAllChallengesV2.items &&
      data.showAllChallengesV2.items.length >= 1
    ) {
      if (challenges.length === 0) {
        setChallenges(data.showAllChallengesV2.items);
      } else {
        setChallenges((prevState) => [
          ...prevState,
          ...data.showAllChallengesV2.items.filter(
            (n) => !prevState.some((p) => p.id === n.id),
          ),
        ]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (!loading && profile_id && !data?.showAllChallengesV2) {
      fetch({
        variables: {
          data: {
            key,
            profile_id,
          },
          pagination: {
            page: 1,
            offset: 15,
          },
        },
      });
    }
  }, [profile_id]);

  const RenderCard = useCallback(
    (type, challenge, index) => (
      <Container>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('Challenge.Description', {
              challenge_id: challenge.id,
            });
          }}
        >
          <HighlightsCard>
            <HighlightImage
              imageStyle={{ borderRadius: 16 }}
              source={{
                uri: `${PUBLIC_STORAGE}/${challenge.image_cover}`,
              }}
            >
              <RockyMountain
                style={{ marginTop: 16, marginRight: 16 }}
                source={{
                  uri: `${PUBLIC_STORAGE}/${challenge.image_avatar}`,
                }}
              />
            </HighlightImage>
            <ChallengeInfo>
              <InfoContainer>
                <InfoWrapper>
                  <HighlightsCardTitle>{challenge.name}</HighlightsCardTitle>
                </InfoWrapper>
                {challenge.awards && (
                  <InfoWrapper>
                    <Icons name="award" width={23} height={21} />
                    <HighlightsCardNormal>
                      Prêmios:{' '}
                      {challenge.awards.map((award) => `${award.name},`)}
                    </HighlightsCardNormal>
                  </InfoWrapper>
                )}
              </InfoContainer>
            </ChallengeInfo>
          </HighlightsCard>
        </TouchableWithoutFeedback>
      </Container>
    ),
    [],
  );

  const handleFetchMore = useCallback(() => {
    if (profile_id && data?.showAllChallengesV2.page_info.has_next_page) {
      actualPage.current += 1;
      fetch({
        variables: {
          data: {
            key,
            profile_id,
          },
          pagination: {
            page: actualPage.current,
            offset: 15,
          },
        },
      });
    }
  }, [profile_id, data?.showAllChallengesV2]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Header>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <Title>{title}</Title>

        {loading ? (
          <ActivityIndicator color="#0564FF" size="small" />
        ) : (
          <View style={{ width: 20 }} />
        )}
      </Header>
      {loading && data?.showAllChallengesV2?.items?.length < 1 ? (
        <View
          style={{
            width: widthPercentageToDP('100'),
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <ActivityIndicator color="#0564FF" size="large" />
        </View>
      ) : null}
      <RecyclerListView
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={RenderCard}
        onEndReachedThreshold={heightPercentageToDP(`1`)}
        onEndReached={handleFetchMore}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          refreshControl: (
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                actualPage.current = 1;
                fetch({
                  variables: {
                    data: {
                      key,
                      profile_id,
                    },
                    pagination: {
                      page: actualPage.current,
                      offset: 15,
                    },
                  },
                });
                // refetch();
              }}
            />
          ),
        }}
      />
    </SafeAreaView>
  );
};

export default ChallengeSeeMoreChallenge;
