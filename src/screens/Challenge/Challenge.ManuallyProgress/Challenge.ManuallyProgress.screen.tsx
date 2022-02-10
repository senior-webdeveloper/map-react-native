import React, { useRef, useState } from 'react';
import styled from 'styled-components/native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Sentry from '@sentry/react-native';
import axios from 'axios';
import { API } from '@env';
import DocumentPicker from 'react-native-document-picker';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import appleHealthImage from '~/assets/monitorsLogo/health.jpg';
import { Icons, SafeAreaView, SnackBar, Text, TitleText } from '~/components';
import { useAppleHealthActivities, useUserToken } from '~/hooks';
import stravaImage from '~/assets/ChallengeSubscribedAssets/strava.jpg';
import gpxImage from '~/assets/ChallengeSubscribedAssets/gpx.jpg';
import healthImage from '~/assets/ChallengeSubscribedAssets/health.png';
import healthGray from '~/assets/ChallengeSubscribedAssets/healthgray.png';
import { TypeSnackBar } from '~/components/Snackbar';
import { RootStackParamList } from '~/routes.types';
import {
  useChangeHealthConnectionsMutation,
  useGetUserDataCompiledLazyQuery,
} from '~/graphql/autogenerate/hooks';

export const Container = styled(SafeAreaView)`
  flex: 1;
`;
export const HeaderContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  margin-top: 18px;
  margin-bottom: 24px;
`;
export const HeaderButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const HeaderText = styled(TitleText)`
  margin-left: 12px;
`;
const RefeshText = styled(Text)`
  margin-right: 9px;
  color: ${({ theme }) => theme.colors.blue};
`;
const RefeshContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 25px;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;
export const MethodContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  padding: 20px 16px;
  background-color: #f8fafb;
  border-bottom-width: 0.5px;
  border-bottom-color: rgba(22, 28, 37, 0.2);
`;
export const MethodImage = styled.Image`
  margin-right: 13px;
  max-width: 24px;
  max-height: 34px;
`;
interface MethodNameProps {
  type?: boolean;
}
export const MethodName = styled(Text)<MethodNameProps>`
  opacity: ${({ type }) => (type ? '0.5' : '1')};
`;
export const MethodNameBold = styled(Text)<MethodNameProps>`
  opacity: ${({ type }) => (type ? '0.5' : '1')};
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const MethodWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'Challenge.ManuallyProgress'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.DistanceCycling],
    write: [AppleHealthKit.Constants.Permissions.DistanceCycling],
  },
} as HealthKitPermissions;

function handleAppleStatus(
  st: number,
): 'NotDetermined' | 'SharingDenied' | 'SharingAuthorized' | null {
  if (st === 0) return 'NotDetermined';
  if (st === 1) return 'SharingDenied';
  if (st === 2) return 'SharingAuthorized';
  return null;
}

const ChallengeManuallyProgress: React.FC<Props> = ({ route }) => {
  const { getActivities, loading, success } = useAppleHealthActivities();
  const { userID } = useUserToken();
  const navigation = useNavigation();
  const executeAnAction = useRef(false);
  const [callApple, setCallApple] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
  const [changeHealthConnectionsMutation] =
    useChangeHealthConnectionsMutation();

  const handleApplePermissions = async () => {
    AppleHealthKit.getAuthStatus(permissions, async (err, results) => {
      if (
        handleAppleStatus(results.permissions.read[0]) === 'SharingAuthorized'
      ) {
        if (getActivities) {
          getActivities();
          navigation.navigate('User.SpecificMonitor', {
            id: 'health',
            name: 'Apple Saúde',
            image: appleHealthImage,
            last_upload: '',
            title: 'Lorem Ipsulum',
            descrition:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          });
        }
      } else if (
        handleAppleStatus(results.permissions.read[0]) === 'NotDetermined'
      ) {
        navigation.navigate('Permission.AppleHealth');
      } else if (
        handleAppleStatus(results.permissions.read[0]) === 'SharingDenied'
      ) {
        await changeHealthConnectionsMutation({
          variables: {
            data: {
              integrated_with_apple_health: false,
            },
          },
        });
      }
    });
  };
  // TODO: Adicionar validacao quando o usuario retornar no apple health.
  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      if (!loading && success) {
        setSnackBarMessage('Pedaladas atualizadas com sucesso');
        setTypeSnack('success');
        setShowSnackBar(true);
        setTimeout(() => {
          executeAnAction.current = false;
          setShowSnackBar(false);
          setCallApple(false);
        }, 1000);
      } else if (!loading && !success) {
        if (executeAnAction.current === true) {
          setSnackBarMessage('Suas pedaladas já estão atualizadas.');
          setTypeSnack('success');
          setShowSnackBar(true);
          setTimeout(() => {
            executeAnAction.current = false;
            setShowSnackBar(false);
            setCallApple(false);
          }, 1000);
        }
      }
    }
  }, [loading, success, callApple]);

  const documentPicker = async () => {
    try {
      const gpxFile = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('gpxFile: ', gpxFile);
      const extension = gpxFile[0].name.split('.');
      if (extension[1] !== 'gpx') {
        console.log('Erro no filename');
        setSnackBarMessage('Houve um erro no envio! Tente novamente');
        setTypeSnack('error');
        setShowSnackBar(true);
        setTimeout(() => {
          setShowSnackBar(false);
        }, 1000);
        return;
      }
      const formDataSend = new FormData();
      formDataSend.append('activity', gpxFile[0]);
      formDataSend.append('user_id', userID);
      const response = await axios.post(
        `${API}/import/activity/file`,
        formDataSend,
        {
          headers: { 'content-type': 'multipart/form-data' },
        },
      );
      Sentry.captureMessage(JSON.stringify(response));
      if (response.status === 201) {
        setSnackBarMessage('Pedaladas atualizadas com sucesso');
        setTypeSnack('success');
        setShowSnackBar(true);
        setTimeout(() => {
          setShowSnackBar(false);
        }, 1000);
      }
      if (response.status === 400) {
        console.log('erro 400');
        setSnackBarMessage('Houve um erro no envio! Tente novamente');
        setTypeSnack('error');
        setShowSnackBar(true);
        setTimeout(() => {
          setShowSnackBar(false);
        }, 1000);
      }
    } catch (err) {
      console.log('erro generico', err);
      setSnackBarMessage('Houve um erro no envio! Tente novamente');
      setTypeSnack('error');
      setShowSnackBar(true);
      setTimeout(() => {
        setShowSnackBar(false);
      }, 1000);
      Sentry.captureException(err);
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <HeaderContainer>
        <HeaderButton onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" />
          <HeaderText>Importação manual</HeaderText>
          <View style={{ width: 20 }} />
        </HeaderButton>
      </HeaderContainer>

      {Platform.OS === 'ios' && (
        <MethodContainer
          disabled={route.params.challenge_type !== 'distance'}
          onPress={() => {
            // Linking.openURL('App-Prefs:HealthKit');
            handleApplePermissions();
            // if (getActivities) {
            //   setCallApple(true);
            //   getActivities();
            // }
          }}
        >
          <MethodWrapper>
            <MethodImage
              source={
                route.params.challenge_type === 'distance'
                  ? healthImage
                  : healthGray
              }
            />
            <View style={{ backgroundColor: 'transparent' }}>
              <MethodName type={route.params.challenge_type === 'altimetric'}>
                Buscar atividade do{' '}
                <MethodNameBold>Apple Health</MethodNameBold>
              </MethodName>
              {route.params.challenge_type === 'altimetric' && (
                <MethodName type={route.params.challenge_type === 'altimetric'}>
                  *O Apple Saúde não nos envia Altimetria
                </MethodName>
              )}
            </View>
          </MethodWrapper>
          <Icons name="chevron-right" />
        </MethodContainer>
      )}

      <MethodContainer
        onPress={() => navigation.navigate('Activity.StravaLink')}
      >
        <MethodWrapper>
          <MethodImage source={stravaImage} />
          <MethodName>
            Colar link do <MethodNameBold>Strava</MethodNameBold>
          </MethodName>
        </MethodWrapper>
        <Icons name="chevron-right" />
      </MethodContainer>

      <MethodContainer onPress={() => documentPicker()}>
        <MethodWrapper>
          <MethodImage source={gpxImage} />
          <MethodName>
            Enviar arquivo <MethodNameBold>GPX</MethodNameBold>
          </MethodName>
        </MethodWrapper>

        <Icons name="chevron-right" />
      </MethodContainer>

      <RefeshContainer
        onPress={() => navigation.navigate('User.ConnectedMonitors')}
      >
        <RefeshText>Gerenciar integrações</RefeshText>
        <Icons name="arrow-right" color="#0564FF" />
      </RefeshContainer>
      <SnackBar
        show={showSnackBar}
        setShow={(e) => setShowSnackBar(e)}
        message={snackBarMessage}
        type={typeSnack}
      />
    </Container>
  );
};

export default ChallengeManuallyProgress;
