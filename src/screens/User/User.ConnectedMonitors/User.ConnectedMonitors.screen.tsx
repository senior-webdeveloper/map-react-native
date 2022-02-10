import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  TouchableOpacity,
  AppState,
} from 'react-native';
import styled from 'styled-components/native';
import { API } from '@env';
import base64 from 'react-native-base64';
import branch from 'react-native-branch';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import * as Sentry from '@sentry/react-native';
import {
  Icons,
  SafeAreaView as View,
  Text,
  SmallText,
  SnackBar,
} from '~/components';
import {
  useAppleHealthPermissions,
  useDataCompiled,
  useUserToken,
} from '~/hooks';
import polarImage from '~/assets/monitorsLogo/polar.jpg';
import garminImage from '~/assets/monitorsLogo/garmin.jpg';
import appleHealthImage from '~/assets/monitorsLogo/health.jpg';
import {
  useChangeHealthConnectionsMutation,
  useGetUserDataCompiledLazyQuery,
  useUpdateUserDataCompiledMutation,
} from '~/graphql/autogenerate/hooks';
import { TypeSnackBar } from '~/components/Snackbar';
import { useStoreActions, useStoreState } from '~/store';

export const SafeAreaView = styled(View)`
  flex: 1;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 16px 0 16px;
`;
export const Title = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;
export const Container = styled.View`
  flex-direction: row;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  justify-content: space-between;
`;
export const MonitorImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 16px;
`;
export const MonitorImageContainer = styled.View`
  width: 80px;
  height: 80px;
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
export const MonitorName = styled(Text)``;
export const ConnectedText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.accent.lightGreen};
`;

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.DistanceCycling],
    write: [AppleHealthKit.Constants.Permissions.DistanceCycling],
  },
} as HealthKitPermissions;

const UserConnectedMonitors: React.FC = () => {
  const [fetch, { data, refetch: doRefetch, loading }] =
    useGetUserDataCompiledLazyQuery({
      fetchPolicy: 'network-only',
    });
  React.useEffect(() => {
    fetch();
  }, []);
  const refetch = useCallback(async () => {
    await doRefetch;
  }, []);
  const appState = useRef(AppState.currentState);
  const actualAction = useRef('');
  const { userID } = useUserToken();
  const navigation = useNavigation();
  const userinfo = useStoreState((state) => state.profile.payload);

  const [status, setStatus] = React.useState<
    'NotDetermined' | 'SharingDenied' | 'SharingAuthorized'
  >();
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
  const [changeHealthConnectionsMutation] =
    useChangeHealthConnectionsMutation();
  const saveData = useStoreActions(
    (actions) => actions.compiledData.saveDataCompiled,
  );
  const compiledData = useStoreState(
    (state) => state.compiledData.dataCompiled,
  );

  function handleAppleStatus(
    st: number,
  ): 'NotDetermined' | 'SharingDenied' | 'SharingAuthorized' | null {
    if (st === 0) return 'NotDetermined';
    if (st === 1) return 'SharingDenied';
    if (st === 2) return 'SharingAuthorized';
    return 'NotDetermined';
  }
  async function getHealthPermission(): Promise<void> {
    await refetch();

    AppleHealthKit.getAuthStatus(permissions, async (err, results) => {
      Sentry.captureException(err);
      Sentry.captureMessage(
        `Resultados das permissoes: ${results.permissions.read}`,
      );
      setStatus(handleAppleStatus(results.permissions.read[0]));
      if (handleAppleStatus(results.permissions.read[0]) === 'SharingDenied') {
        saveData({ ...compiledData, integrated_with_apple_health: false });
        await changeHealthConnectionsMutation({
          variables: {
            data: {
              integrated_with_apple_health: false,
            },
          },
        });
      } else if (
        handleAppleStatus(results.permissions.read[0]) === 'SharingAuthorized'
      ) {
        saveData({ ...compiledData, integrated_with_apple_health: true });

        await changeHealthConnectionsMutation({
          variables: {
            data: {
              integrated_with_apple_health: true,
            },
          },
        });
      }
    });
  }

  React.useEffect(() => {
    getHealthPermission();
  }, []);

  const [connectedWithGarmin, setConnectedWithGarmin] =
    React.useState<boolean>();
  const [connectedWithPolar, setConnectedWithPolar] = React.useState<boolean>();

  const info = {
    polar: {
      id: 'polar',
      name: 'Polar',
      image: polarImage,
      title: 'Lorem Ipsulum',
      last_upload: data?.getUserDataCompiled.data_compiled.last_upload_polar,
      descrition:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    garmin: {
      id: 'garmin',
      name: 'Garmin',
      image: garminImage,
      last_upload: data?.getUserDataCompiled.data_compiled.last_upload_garmin,
      title: 'Lorem Ipsulum',
      descrition:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    apple: {
      id: 'health',
      name: 'Apple Saúde',
      image: appleHealthImage,
      last_upload: compiledData?.last_upload_apple_health,
      title: 'Lorem Ipsulum',
      descrition:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  };
  React.useEffect(() => {
    refetch();
  });
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getHealthPermission();

      if (actualAction.current === 'apple') {
        actualAction.current = '';

        AppleHealthKit.getAuthStatus(permissions, async (err, results) => {
          Sentry.captureException(err);

          if (
            handleAppleStatus(results.permissions.read[0]) ===
            'SharingAuthorized'
          ) {
            navigation.navigate('User.SpecificMonitor', { ...info.apple });
          }
        });
      }
      refetch();
      if (doRefetch) {
        doRefetch();
      }
    });

    return unsubscribe;
  }, [navigation]);
  const handleAppStateChange = async (nextAppState) => {
    getHealthPermission();
    refetch();
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (actualAction.current === 'apple') {
        actualAction.current = '';
        AppleHealthKit.getAuthStatus(permissions, async (err, results) => {
          Sentry.captureException(err);
          Sentry.captureMessage(
            `Resultados das permissoes: ${results.permissions.read}`,
          );
          setStatus(handleAppleStatus(results.permissions.read[0]));
          if (
            handleAppleStatus(results.permissions.read[0]) ===
            'SharingAuthorized'
          ) {
            navigation.navigate('User.SpecificMonitor', { ...info.apple });
          }
        });
      }
    }

    appState.current = nextAppState;
  };

  React.useEffect(() => {
    refetch();
  }, [AppState.currentState]);

  useEffect(() => {
    refetch();
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      refetch();
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

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
              Alert.alert('DEU SUCESSO');
            } else if (removedPrefix[1] === 'strava/error') {
              Alert.alert('DEU ERRO');
            }
            if (removedPrefix[1] === 'garmin/success') {
              setSnackBarMessage('Conectado com sucesso!');
              setTypeSnack('success');
              setShowSnackBar(true);
              setConnectedWithGarmin(true);
            } else if (removedPrefix[1] === 'garmin/error') {
              setSnackBarMessage('Houve um erro na conexão, tente novamente!');
              setTypeSnack('error');
              setShowSnackBar(true);
            } else if (removedPrefix[1] === 'polar/error') {
              setSnackBarMessage('Houve um erro na conexão, tente novamente!');
              setTypeSnack('error');
              setShowSnackBar(true);
            } else if (removedPrefix[1] === 'polar/success') {
              setSnackBarMessage('Conectado com sucesso!');
              setTypeSnack('success');
              setShowSnackBar(true);
              setConnectedWithPolar(true);
            }
          }
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    });
  }, [appState, AppState.currentState]);

  const handleApplePermissions = () => {
    if (Platform.OS === 'ios') {
      if (status === 'SharingAuthorized') {
        navigation.navigate('User.SpecificMonitor', { ...info.apple });
      } else if (status === 'NotDetermined') {
        actualAction.current = 'apple';
        navigation.navigate('Permission.AppleHealth');
      } else if (status === 'SharingDenied') {
        Linking.openURL('App-Prefs:HealthKit');
      }
    }
  };

  return (
    <SafeAreaView>
      <Header>
        <TouchableOpacity
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <Title>Monitores conectados</Title>
        <View style={{ width: 20 }} />
      </Header>
      <Container>
        <MonitorContainer
          onPress={() => {
            console.log(
              'userID: ',
              `${API}/auth/strava?user_id=${base64.encode(userID)}`,
            );
            Linking.openURL(
              `${API}/auth/strava?user_id=${base64.encode(userID)}`,
            );
          }}
        >
          <MonitorImageContainer>
            <MonitorImage source={polarImage} />
          </MonitorImageContainer>
          <MonitorName>Strava</MonitorName>
          {(data?.getUserDataCompiled.data_compiled.integrated_with_polar ||
            connectedWithPolar) && <ConnectedText>Conectado</ConnectedText>}
        </MonitorContainer>

        <MonitorContainer
          onPress={() => {
            console.log(`${API}/auth/polar?user_id=${base64.encode(userID)}`);
            refetch();
            if (
              data?.getUserDataCompiled.data_compiled.integrated_with_polar ||
              connectedWithPolar
            ) {
              setConnectedWithPolar(false);
              navigation.navigate('User.SpecificMonitor', { ...info.polar });
            } else {
              Linking.openURL(
                `${API}/auth/polar?user_id=${base64.encode(userID)}`,
              );
            }
          }}
        >
          <MonitorImageContainer>
            <MonitorImage source={polarImage} />
          </MonitorImageContainer>
          <MonitorName>Polar</MonitorName>
          {(data?.getUserDataCompiled.data_compiled.integrated_with_polar ||
            connectedWithPolar) && <ConnectedText>Conectado</ConnectedText>}
        </MonitorContainer>
        <MonitorContainer
          onPress={() => {
            console.log(`${API}/auth/garmin?user_id=${base64.encode(userID)}`);
            // Linking.openURL(
            //   `${API}/auth/garmin?user_id=${base64.encode(userID)}`,
            // );
            if (
              data?.getUserDataCompiled.data_compiled.integrated_with_garmin ||
              connectedWithGarmin
            ) {
              setConnectedWithGarmin(false);
              navigation.navigate('User.SpecificMonitor', { ...info.garmin });
            } else {
              Linking.openURL(
                `${API}/auth/garmin?user_id=${base64.encode(userID)}`,
              );
            }
          }}
        >
          <MonitorImageContainer>
            <MonitorImage source={garminImage} />
          </MonitorImageContainer>
          <MonitorName>Garmin</MonitorName>
          {(data?.getUserDataCompiled.data_compiled.integrated_with_garmin ||
            connectedWithGarmin) && <ConnectedText>Conectado</ConnectedText>}
        </MonitorContainer>
        {Platform.OS === 'ios' && (
          <MonitorContainer
            onPress={async () => {
              handleApplePermissions();
              // if (
              //   data?.getUserDataCompiled.data_compiled
              //     .integrated_with_apple_health
              // ) {
              //   navigation.navigate('User.SpecificMonitor', { ...info.apple });
              // } else if (getPermission && status !== 'SharingDenied') {
              //   getPermission();
              // } else if (getPermission && status === 'SharingDenied') {
              //   // Linking.openURL('app-settings://healthkit/com.riderize');
              //
              //
              //   // Linking.openURL('x-apple-hsealth://');
              // }
            }}
          >
            <MonitorImageContainer>
              <MonitorImage source={appleHealthImage} />
            </MonitorImageContainer>
            <MonitorName>Apple Saude</MonitorName>
            {status === 'SharingAuthorized' && (
              <ConnectedText>Conectado</ConnectedText>
            )}
          </MonitorContainer>
        )}
      </Container>
      <SnackBar
        show={showSnackBar}
        setShow={(e) => setShowSnackBar(e)}
        message={snackBarMessage}
        type={typeSnack}
      />
    </SafeAreaView>
  );
};

export default UserConnectedMonitors;
