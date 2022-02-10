import React, { memo, useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { setBadgeCount } from 'react-native-notification-badge';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import branch from 'react-native-branch';
import styled from 'styled-components/native';
import OneSignal from 'react-native-onesignal';
import Analytics from 'appcenter-analytics';
import { BUNDLE_NAME } from '@env';
import { checkNotifications } from 'react-native-permissions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Icons, SafeAreaView, TitleText } from '~/components';
import Settings from './Tabs/Settings';
import Notifications from './Tabs/Notifications';
import Challenges from './Tabs/Challenges';
import Menu from './Tabs/Menu';
import Monitor from './Tabs/Monitor/Monitor.routes';
import { useUserToken, useLocalDataCompiled } from '~/hooks';
import { useStoreActions, useStoreState } from '~/store';
import { useGetUserNotificationsLazyQuery } from '~/graphql/autogenerate/hooks';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

export const Container = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
`;
export const Header = styled.View``;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 23px;
`;
export const Filter = styled.View``;

const Home: React.FC = ({ route }) => {
  const Tab = createBottomTabNavigator();

  const navigation = useNavigation();
  const { profileID, userID } = useUserToken();
  const hasFetched = useRef(false);
  const [
    fetchNotifications,
    { data, loading },
  ] = useGetUserNotificationsLazyQuery();
  const compiledDataLocal = useStoreState(
    (state) => state.compiledData.dataCompiled,
  );
  const setNetworkStatesetUserProfile = useStoreActions(
    (actions) => actions.network.setStatus,
  );
  const networkIsConnected = useStoreState(
    (state) => state.network.isConnected,
  );
  const { localLoading, profileData } = useLocalDataCompiled();
  const monitorStatus = useStoreState((state) => state.monitor.status);
  const userNotifications = useStoreState(
    (state) => state.userInfoModel.payload,
  );
  const setNotifications = useStoreActions(
    (actions) => actions.userInfoModel.saveUserInfo,
  );

  const userProfile = useStoreState((state) => state.profile.payload);

  const handleLoggedUser = async () => {
    await AsyncStorage.setItem('hasAccount', 'true');
  };

  useEffect(() => {
    handleLoggedUser();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected !== (null || undefined)) {
        setNetworkStatesetUserProfile(state.isConnected);
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);

        if (!state.isConnected) {
          Toast.show(
            'Você está offline. Alguns dados podem estar desatualizados.',
            Toast.LONG,
          );
        }
      }
    });

    // Unsubscribe
    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    if (
      profileData &&
      profileData.getProfile &&
      !localLoading &&
      !route.params.hasUserEmail
    ) {
      hasFetched.current = true;
      if (
        !profileData.getProfile.user.firstname ||
        profileData.getProfile.user.firstname === null
      ) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'User.AppleWelcomeName', params: { ...route.params } },
            ],
          }),
        );
      } else if (
        !profileData.getProfile.user.email ||
        profileData.getProfile.user.email === null
      ) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'User.AppleWelcomeEmail',
                params: {
                  hasPrevious: false,
                  ...route.params,
                },
              },
            ],
          }),
        );
      } else if (compiledDataLocal && !compiledDataLocal?.view_welcome_screen) {
        if (!route.params.accepted_initial_screen) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'User.Welcome',
                  params: { name: profileData.getProfile.user.firstname },
                },
              ],
            }),
          );
        }
      }
    }
  }, [userProfile, localLoading]);

  useEffect(() => {
    if (profileID.length > 0 && !data?.getUserNotifications) {
      fetchNotifications({
        variables: {
          data: {
            profile_id: profileID,
            timestamp: new Date().getTime(),
          },
          pagination: {
            page: 1,
            offset: 500,
          },
        },
      });
    }
  }, [profileID]);

  // useEffect(() => {
  //   if (compiledDataLocal?.view_welcome_screen === false) {
  //     console.log(
  //       '🚀 ~ file: index.tsx ~ line 137 ~ useEffect ~ compiledDataLocal?.view_welcome_screen',
  //       compiledDataLocal?.view_welcome_screen,
  //     );
  //     if (!route.params.accepted_initial_screen) {
  //       console.log(
  //         '🚀 ~ file: index.tsx ~ line 139 ~ useEffect ~ route.params.accepted_initial_screen',
  //         route.params.accepted_initial_screen,
  //       );
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [
  //             {
  //               name: 'User.Welcome',
  //               params: { name: userProfile.getProfile.user.firstname },
  //             },
  //           ],
  //         }),
  //       );
  //     }
  //   }
  // }, [compiledDataLocal]);

  const doTrack = async () => {
    await Analytics.trackEvent('User in home', { userID });
  };

  useEffect(() => {
    OneSignal.sendOutcome('user_in_home');
    doTrack();
  }, []);

  useEffect(() => {
    if (userID.length > 0) {
      OneSignal.setExternalUserId(userID);
      OneSignal.sendTag('anonimo', 'false');
    }
  }, [userID]);

  // useEffect(() => {
  //   // To get All Recived Urls
  //   if (AppState.currentState === 'active') {
  //     ReceiveSharingIntent.getReceivedFiles(
  //       (files) => {
  //         // files returns as JSON Array example
  //         console.log(files);
  //         if (files[0].weblink) {
  //           const split = files[0].weblink.split('?');
  //           if (split && split.length > 0) {
  //             const link = split[0];
  //             // navigation.navigate('Activity.StravaLink', { link: split[0] });
  //             if (link) {
  //               if (!modalOpened) {
  //                 setModalOpened(true);
  //                 Alert.alert(
  //                   'Link de pedalada',
  //                   'Identificamos um link de uma pedalada, o que deseja fazer?',
  //                   [
  //                     {
  //                       text: 'Cancelar',
  //                       onPress: () =>
  //                         ReceiveSharingIntent.clearReceivedFiles(),
  //                       style: 'cancel',
  //                     },
  //                     {
  //                       text: 'Enviar Pedalada',
  //                       onPress: () => {
  //                         navigation.navigate('Activity.StravaLink', { link });
  //                         ReceiveSharingIntent.clearReceivedFiles();
  //                       },
  //                     },
  //                   ],
  //                   { cancelable: true },
  //                 );
  //               }
  //             }
  //           } else if (files[0].weblink) {
  //             console.log('executou');
  //             if (!modalOpened) {
  //               setModalOpened(true);
  //               Alert.alert(
  //                 'Link de pedalada',
  //                 'Identificamos um link de uma pedalada, o que deseja fazer?',
  //                 [
  //                   {
  //                     text: 'Cancelar',
  //                     onPress: () => ReceiveSharingIntent.clearReceivedFiles(),
  //                     style: 'cancel',
  //                   },
  //                   {
  //                     text: 'Enviar Pedalada',
  //                     onPress: () => {
  //                       navigation.navigate('Activity.StravaLink', {
  //                         link: files[0].weblink,
  //                       });
  //                       ReceiveSharingIntent.clearReceivedFiles();
  //                     },
  //                   },
  //                 ],
  //                 { cancelable: true },
  //               );
  //               setModalOpened(true);
  //             }
  //           }
  //         }
  //         // [{ filePath: null, text: null, weblink: null, mimeType: null, contentUri: null, fileName: null, extension: null }]
  //       },
  //       (error) => {
  //         console.log(error);
  //       },
  //     );
  //   }

  //   // To clear Intents
  //   return () => ReceiveSharingIntent.clearReceivedFiles();
  // }, [AppState.currentState]);

  useEffect(() => {
    const unsubscribe = branch.subscribe(({ params }) => {
      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link'];
        // Route non-Branch URL if appropriate.
        const removedPrefix = nonBranchUrl.split(`${BUNDLE_NAME}://`);
        if (removedPrefix && removedPrefix.length > 1) {
          const linkSplited = removedPrefix[1].split('/');
          if (linkSplited) {
            const type = linkSplited[0];
            const id = linkSplited[1];
            if (type === 'challenge') {
              setTimeout(() => {
                navigation.navigate('Challenge.Description', {
                  challenge_id: id,
                });
              }, 300);
            }
          }
        }
      }
      if (params.challenge_id) {
        navigation.navigate('Challenge.Description', {
          challenge_id: params.challenge_id,
        });
      } else if (params.activity_id) {
        navigation.navigate('Challenge.ShowSpecificActivity', {
          id: params.activity_id,
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  // const checkNotificationPermissions = async () => {
  //   if (Platform.OS === 'ios') {
  //     const { status } = await checkNotifications();
  //     if (status === 'denied' || status === 'unavailable') {
  //       // TODO: REMOVE THE SECOND VALIDATION
  //       navigation.navigate('Permission.Notifications');
  //     }
  //   }
  // };

  // useEffect(() => {
  //   checkNotificationPermissions();
  // }, [navigation]);

  const setBadgeCountAsync = async (count: number) => {
    const { status } = await checkNotifications();
    if (status === 'denied' || status === 'unavailable') {
      // TODO: REMOVE THE SECOND VALIDATION
      // navigation.navigate('Permission.Notifications');
    } else if (setBadgeCount && count && !loading && Platform.OS === 'ios')
      await setBadgeCount(count);
  };

  useEffect(() => {
    setNotifications(data?.getUserNotifications.unread_notifications_count);
    setBadgeCountAsync(data?.getUserNotifications.unread_notifications_count);
  }, [data, setNotifications]);

  function badgeTest():
    | {
        tabBarBadge: number | undefined;
        tabBarAccessibilityLabel: string;
        tabBarTestID: string;
      }
    | {
        tabBarAccessibilityLabel: string;
        tabBarTestID: string;
        tabBarBadge?: undefined;
      } {
    if (userNotifications && userNotifications.notificationsCount! > 0) {
      return {
        tabBarBadge:
          userNotifications.notificationsCount > 99
            ? '99+'
            : userNotifications.notificationsCount,
        tabBarAccessibilityLabel: 'tab-bar-notification',
        tabBarTestID: 'tab-bar-notification',
      };
    }
    return {
      tabBarAccessibilityLabel: 'tab-bar-notification',
      tabBarTestID: 'tab-bar-notification',
    };
  }

  if (localLoading || (networkIsConnected && localLoading && !profileData)) {
    return (
      <SkeletonPlaceholder>
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
    );
  }

  function screenOptions({ route }): BottomTabNavigationOptions {
    return {
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        height: '9%',
        paddingHorizontal: 28,
        position: 'absolute',
      },
      tabBarIcon: ({ focused, color, size }) => {
        if (route.name === 'Challenges') {
          return (
            <View
              style={{
                borderColor: focused ? '#0564FF' : 'transparent',
                borderTopWidth: 1,
                height: '100%',
                width: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons name="home" color={color} />
            </View>
          );
        }
        if (route.name === 'Calendar') {
          return (
            <View
              style={{
                borderColor: focused ? '#0564FF' : 'transparent',
                borderTopWidth: 1,
                height: '100%',
                width: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons name="calendar" color={color} height={19} />
            </View>
          );
        }

        if (route.name === 'Menu') {
          return (
            <View
              style={{
                borderColor: focused ? '#0564FF' : 'transparent',
                borderTopWidth: 1,
                height: '100%',
                width: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons name="r" height={19} />
            </View>
          );
        }
        if (route.name === 'Monitor') {
          return (
            <View
              style={{
                borderColor: focused ? '#0564FF' : 'transparent',
                borderTopWidth: 1,
                height: '100%',
                width: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  borderColor:
                    monitorStatus === 'stopped' ? '#8E8E8F' : '#e65649',
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {monitorStatus === 'stopped' ? (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 18,
                      // borderWidth: 2,
                      backgroundColor: '#8E8E8F',
                    }}
                  />
                ) : (
                  <LottieView
                    source={require('./animations/recording.json')}
                    autoPlay
                    loop
                    style={{
                      width: 18,
                      height: 18,
                    }}
                  />
                )}
              </View>
              {monitorStatus !== 'stopped' && (
                <TitleText
                  style={{
                    fontSize: 9,
                    color: '#e65649',
                    lineHeight: 10,
                    position: 'absolute',
                    bottom: 2,
                  }}
                >
                  GRAVANDO
                </TitleText>
              )}
            </View>
          );
        }
        if (route.name === 'Notification') {
          return (
            <View
              style={{
                borderColor: focused ? '#0564FF' : 'transparent',
                borderTopWidth: 1,
                height: '100%',
                width: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons name="notification" color={color} height={25} />
            </View>
          );
        }
        if (route.name === 'Settings') {
          return (
            <View
              style={{
                borderColor: focused ? '#0564FF' : 'transparent',
                borderTopWidth: 1,
                height: '100%',
                width: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons name="settings" color={color} height={25} />
            </View>
          );
        }
      },
    };
  }

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Challenges"
        component={Challenges}
        initialParams={{ ...route.params }}
      />

      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarAccessibilityLabel: 'tab-bar-riderize',
          tabBarTestID: 'tab-bar-riderize',
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Monitor"
        component={Monitor}
        options={{
          tabBarAccessibilityLabel: 'tab-bar-monitor',
          tabBarTestID: 'tab-bar-monitor',
          tabBarVisible: false,
          unmountOnBlur: monitorStatus === 'stopped',
        }}
      />

      <Tab.Screen
        name="Notification"
        component={Notifications}
        options={badgeTest()}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarAccessibilityLabel: 'tab-bar-settings',
          tabBarTestID: 'tab-bar-settings',
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
