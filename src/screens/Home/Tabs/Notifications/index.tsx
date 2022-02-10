/* eslint-disable import/no-duplicates */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  StatusBar,
  TouchableOpacity,
  Platform,
  Dimensions,
  RefreshControl,
  View,
} from 'react-native';
import { setBadgeCount } from 'react-native-notification-badge';
import { PUBLIC_STORAGE, BUNDLE_NAME } from '@env';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { formatDistanceToNow } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import StickyContainer from 'recyclerlistview/sticky';
import { widthPercentageToDP as wp } from '~/helpers/convertPixelToDP';
import { Notification } from '~/generated/graphql';
import { useStoreActions } from '~/store';
import { SafeAreaView, Text, TitleText } from '~/components';
import {
  GetUserNotificationsDocument,
  useGetUserNotificationsLazyQuery,
  useMarkNotificationsAsReadMutation,
} from '~/graphql/autogenerate/hooks';
import { useUserInfo, useUserToken } from '~/hooks';

export const Container = styled.ScrollView`
  /* padding: 0px 24px; */
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  margin-bottom: 60px;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px 0 24px;
`;
export const Title = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

export const SubtitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  padding-vertical: ${({ theme }) => theme.paddingVertical};
  background-color: ${({ theme }) => theme.colors.backgroundWhite}
  border-bottom-width: 0.5px;
  border-bottom-color: rgba(22, 28, 37, 0.0939958);
`;
export const Subtitle = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  font-size: 18px;
  line-height: 24px;
`;
export const BadgeContainer = styled.View`
  width: 24px;
  height: 24px;
  background: #ff2577;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;
export const BadgeText = styled(TitleText)`
  font-size: 18px;
  color: #fff;
`;
export const FeedItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  padding-vertical: 15px;
  width: ${wp('100')};
`;
export const FeedItemName = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  width: ${wp('65')};
`;
export const FeedDescritionText = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 15px;
  color: #161c25;
  width: ${wp('58')};
`;
export const FeedTimeText = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 14px;
  line-height: 20px;
  color: rgba(22, 28, 37, 0.6);
`;
export const FeedTextContainer = styled.View`
  /* justify-content: space-between; */
`;
export const FeedWrapper = styled.View`
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
`;
export const Avatar = styled.Image`
  width: 34px;
  height: 34px;
  border-radius: 34px;
  margin-right: 14px;
  margin-top: 5px;
`;
export const FeedChalengeImage = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 8px;
`;

const { width } = Dimensions.get('window');
const OFFSET = 20;
const Notifications: React.FC = () => {
  const navigation = useNavigation();
  const { data: profile } = useUserInfo();
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>();
  const [timestamp, setTimeStamp] = useState<number>(new Date().getTime());
  const { profileID } = useUserToken();
  const [
    getNotifications,
    { data, loading, refetch, fetchMore },
  ] = useGetUserNotificationsLazyQuery({
    // partialRefetch: true,
    // returnPartialData: true,
    nextFetchPolicy: 'network-only',
    onError: (e) => console.log('Error notification: ', e.message),
    onCompleted: (e) =>
      console.log('Length >> ', e.getUserNotifications.notifications.length),
  });

  const ViewTypes = {
    NEW: 0,
    OLD: 1,
  };
  const layoutMaker = () =>
    new LayoutProvider(
      (index) => {
        if (
          data?.getUserNotifications.unread_notifications_count &&
          index <= data?.getUserNotifications.unread_notifications_count - 1
        ) {
          return ViewTypes.NEW;
        }
        return ViewTypes.OLD;
      },
      (type, dim) => {
        dim.width = width - 16;
        dim.height = 96;
      },
    );
  const [unreadNotifications, setUnreadNotifications] = React.useState<
    Notification[] | undefined
  >([]);
  const [readNotifications, setReadNotifications] = React.useState<
    Notification[] | undefined
  >([]);

  const setNotificationsCount = useStoreActions(
    (actions) => actions.userInfoModel.saveUserInfo,
  );

  const setBadgeCountFunction = async (count) => {
    if (setBadgeCount && Platform.OS === 'ios') {
      await setBadgeCount(count);
    }
  };

  const dataProviderMaker = (el) =>
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(el);

  const [dataProvider, setDataProvider] = useState(dataProviderMaker([]));
  const layoutProvider = useRef(layoutMaker()).current;

  const [markNotificationsAsReadMutation] = useMarkNotificationsAsReadMutation({
    onCompleted: (e) => {
      setBadgeCountFunction(0);
      setNotificationsCount(undefined);
    },
    // onCompleted: (e) => console.log(e),
    // awaitRefetchQueries: true,
    // refetchQueries: [
    //   {
    //     query: GetUserNotificationsDocument,
    //     variables: {
    //       data: {
    //         profile_id: profileID,
    //         timestamp,
    //       },
    //       pagination: {
    //         page: 1,
    //         offset: OFFSET,
    //       },
    //     },
    //   },
    // ],
  });

  const doRefetch = React.useCallback(async () => {
    if (refetch !== undefined) {
      await refetch();
    }
  }, [refetch]);

  React.useEffect(() => {
    getNotifications({
      variables: {
        data: {
          profile_id: profileID,
          timestamp,
        },
        pagination: {
          page: 1,
          offset: OFFSET,
        },
      },
    });
  }, [getNotifications, profileID, timestamp]);

  const markAsRead = useCallback(async () => {
    if (profileID.length > 0) {
      const variables = {
        data: {
          profile_id: profileID,
          timestamp: new Date().getTime(),
        },
      };
      await markNotificationsAsReadMutation({
        variables,
      });
      setBadgeCountFunction(0);
    }
  }, [profileID]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      markAsRead();
    });

    return unsubscribe;
  }, [doRefetch, getNotifications, markAsRead, navigation, profileID]);

  useEffect(() => {
    markAsRead();
  }, [markAsRead, profileID]);

  useEffect(() => {
    if (data?.getUserNotifications) {
      setNotifications(data?.getUserNotifications.notifications);
    }
  }, [data, page]);

  React.useEffect(() => {
    if (notifications && notifications.length > 0) {
      const unread = notifications.filter(
        (notifications) => !notifications.read,
      );
      if (unread) {
        setUnreadNotifications(unread);
      }

      const read = notifications.filter((notifications) => notifications.read);

      setReadNotifications(read);

      if (read) {
        if (unread.length > 0) {
          setDataProvider(dataProviderMaker([...unread, ...read]));
        } else {
          setDataProvider(dataProviderMaker([...read]));
        }
      }
    }
  }, [notifications]);

  const handleRouteNotification = useCallback((link?: string) => {
    if (link) {
      const removedPrefix = link.split(`${BUNDLE_NAME}://`);
      if (removedPrefix && removedPrefix.length > 0) {
        const linkSplited = removedPrefix[1].split('/');
        if (linkSplited && linkSplited.length > 0) {
          const type = linkSplited[0];
          const id = linkSplited[1];
          if (type === 'challenges' || type === 'challenge') {
            navigation.navigate('Challenge.Description', { challenge_id: id });
          } else if (type === 'profile' || type === 'profiles') {
            if (profileID !== id) {
              navigation.navigate('User.VisitorProfile', {
                profile_id: id,
              });
            } else {
              navigation.navigate('User.Profile');
            }
          } else if (type === 'activity') {
            if (id && profile) {
              navigation.navigate('Challenge.ShowSpecificActivity', {
                id,
                profile: profile?.getProfile,
              });
            }
          }
        }
      }
    }
  }, []);

  const renderElement = (type, item, index) => (
    <TouchableOpacity
      key={item._id}
      onPress={() => handleRouteNotification(item?.deep_linking)}
    >
      <FeedItemContainer key={index}>
        <FeedWrapper>
          <Avatar
            source={{
              uri:
                item?.sender_profile_avatar &&
                item?.sender_profile_avatar.length > 0
                  ? `${PUBLIC_STORAGE}/${item?.sender_profile_avatar}`
                  : `${PUBLIC_STORAGE}/logos/Quadrada-branca-roxa.png`,
            }}
          />
          <FeedTextContainer>
            <FeedDescritionText>
              <FeedItemName>
                {item.sender_username && `${item.sender_username} `}
              </FeedItemName>
              {item.notification_content}
            </FeedDescritionText>
            {item?.created_at && (
              <FeedTimeText>
                {formatDistanceToNow(new Date(item?.created_at), {
                  locale: ptbr,
                  addSuffix: true,
                })}
              </FeedTimeText>
            )}
          </FeedTextContainer>
        </FeedWrapper>
        <FeedChalengeImage
          source={{ uri: `${PUBLIC_STORAGE}/${item.media_url}` }}
        />
      </FeedItemContainer>
    </TouchableOpacity>
  );

  const headerRender = ({ section }) =>
    section.data.length > 0 ? (
      <SubtitleContainer>
        <Subtitle>{section.title}</Subtitle>
        {section.title === 'Novo' &&
          unreadNotifications &&
          unreadNotifications?.length > 0 && (
            <BadgeContainer>
              <BadgeText>{unreadNotifications?.length}</BadgeText>
            </BadgeContainer>
          )}
      </SubtitleContainer>
    ) : null;

  const onEndReachedThreshold = useMemo(() => {
    if (readNotifications) {
      return (readNotifications.length - readNotifications.length * 0.8) / 8;
    }
  }, [readNotifications]);

  const onEndReached = useCallback(async () => {
    if (fetchMore && notifications?.length >= OFFSET * page) {
      setPage((prevState) => prevState + 1);

      fetchMore({
        variables: {
          data: {
            profile_id: profileID,
            timestamp: new Date().getTime(),
          },
          pagination: {
            page: page + 1,
            offset: OFFSET,
          },
        },
      });
    }
  }, [fetchMore, page, profileID, notifications]);

  const overrideRowRenderer = (type, item, index) => {
    if (
      data?.getUserNotifications.unread_notifications_count !== undefined &&
      data?.getUserNotifications.unread_notifications_count > 0
    ) {
      if (index + 1 <= data?.getUserNotifications.unread_notifications_count) {
        return (
          <>
            {unreadNotifications && unreadNotifications?.length > 0 ? (
              <SubtitleContainer>
                <Subtitle>Novo</Subtitle>
                {unreadNotifications && unreadNotifications?.length > 0 && (
                  <BadgeContainer>
                    <BadgeText>{unreadNotifications?.length}</BadgeText>
                  </BadgeContainer>
                )}
              </SubtitleContainer>
            ) : null}
          </>
        );
      }
    } else {
      return (
        <SubtitleContainer>
          <Subtitle>Anterior</Subtitle>
        </SubtitleContainer>
      );
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <Header>
        <Title>Notificações</Title>
      </Header>
      <StickyContainer
        stickyHeaderIndices={[
          data?.getUserNotifications.unread_notifications_count - 1 ?? 0,
        ]}
        // stickyFooterIndices={[3, 7, 10]}
        overrideRowRenderer={overrideRowRenderer}
      >
        <RecyclerListView
          canChangeSize
          forceNonDeterministicRendering
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={renderElement}
          onEndReachedThreshold={onEndReachedThreshold} // CONTA
          onEndReached={onEndReached}
          style={{ marginTop: 80, marginBottom: 40 }}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={loading}
                onRefresh={() => {
                  doRefetch();
                }}
              />
            ),
            contentContainerStyle: {
              paddingHorizontal: 8,
            },
          }}
        />
      </StickyContainer>
      {/* <SectionList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
        stickySectionHeadersEnabled
        sections={[
          { title: 'Novo', data: unreadNotifications! },
          { title: 'Anteriores', data: readNotifications! },
        ]}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onEndReachedThreshold={onEndReachedThreshold}
        initialNumToRender={10}
        onEndReached={onEndReached}
        onRefresh={() => {
          if (data) {
            doRefetch();
          } else {
            getNotifications();
          }
        }}
        renderSectionHeader={headerRender}
        renderItem={renderElement}
      /> */}
    </SafeAreaView>
  );
};

export default Notifications;
