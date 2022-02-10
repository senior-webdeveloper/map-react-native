import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  AppState,
  AppStateStatus,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { API } from '@env';
import base64 from 'react-native-base64';
import branch from 'react-native-branch';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import { format, isPast, isToday } from 'date-fns';
import {
  SafeAreaView as CustomSafe,
  TitleText,
  Text,
  Icons,
  SnackBar,
  SmallText,
  Button,
} from '~/components';
import mainImage from '~/assets/ChallengeSubscribedAssets/main.jpg';
import stravaImage from '~/assets/ChallengeSubscribedAssets/strava.jpg';
import gpxImage from '~/assets/ChallengeSubscribedAssets/gpx.jpg';
import healthImage from '~/assets/ChallengeSubscribedAssets/health.png';
import healthGray from '~/assets/ChallengeSubscribedAssets/healthgray.png';
import stravaImageBig from '~/assets/monitorsLogo/strava.jpg';
import gpxImageBig from '~/assets/monitorsLogo/gpx.jpg';
import garminImage from '~/assets/monitorsLogo/garmin.jpg';
import polarImage from '~/assets/monitorsLogo/polar.jpg';
import {
  useAppleHealthPermissions,
  useDataCompiled,
  useUserToken,
} from '~/hooks';
import appleHealthImage from '~/assets/monitorsLogo/health.jpg';
import { TypeSnackBar } from '~/components/Snackbar';
import { RootStackParamList } from '~/routes.types';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';

export const Container = styled.View``;

export const BoxContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.textWhite};
  elevation: 5;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
`;
export const SafeAreaView = styled(CustomSafe)`
  flex: 1;
`;
export const Image = styled.Image`
  margin-top: 36px;
  margin-bottom: 24px;
`;
export const RegularTitle = styled(TitleText)`
  font-family: ${({ theme }) => theme.fontFamily.regular};
`;
export const BoldedTitle = styled(TitleText)`
  font-size: 32px;
`;
export const DescriptionText = styled(Text)`
  text-align: center;
  margin-top: 16px;
  margin-bottom: 40px;
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
  opacity: ${({ type }) => (type ? '0.4' : '1')};
  background-color: transparent;
`;
export const MethodNameBold = styled(Text)<MethodNameProps>`
  opacity: ${({ type }) => (type ? '0.4' : '1')};
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const MethodWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const LaterContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  padding: 16px;
`;
export const LaterText = styled(Text)`
  margin-right: 8px;
  color: ${({ theme }) => theme.colors.blue};
`;
export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-horizontal: 16px;
  padding-top: 24px;
`;

export const SubscribeContainer = styled.View`
  width: 100%;
  padding: 16px;
  justify-content: center;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  background-color: white;
  box-shadow: 10px -20px 40px rgba(5, 100, 255, 0.06);
  elevation: 1;
  z-index: 999;
`;

type options = 'garmin' | 'polar' | 'health' | undefined;

const info = {
  strava: {
    id: 'strava',
    name: 'Atividade do Strava',
    image: stravaImageBig,
  },
  gpx: {
    id: 'gpx',
    name: 'Arquivo GPX',
    image: gpxImageBig,
  },
  apple: {
    id: 'health',
    name: 'Apple Saúde',
    image: appleHealthImage,
  },
};

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'Challenge.SubscribedWithoutMonitors'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};

const ChallengeSubscribedWihoutMonitors: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { data, refetch } = useDataCompiled();
  const appState = useRef(AppState.currentState);
  const { getPermission, status } = useAppleHealthPermissions();
  const { userID } = useUserToken();
  const [selectedOption, setSelectedOption] = useState<options>();

  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (refetch) {
        refetch();
      }
    }

    appState.current = nextAppState;
  };

  React.useEffect(() => {
    branch.subscribe(({ error, params, uri }) => {
      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link'];
        // Route non-Branch URL if appropriate.
        const removedPrefix = nonBranchUrl.split('com.riderize://');
        if (removedPrefix[1] === 'garmin/success') {
          setSnackBarMessage('Conectado com sucesso!');
          setTypeSnack('success');
          setShowSnackBar(true);
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        } else if (removedPrefix[1] === 'garmin/error') {
          setSnackBarMessage('Houve um erro na conexão, tente novamente!');
          setTypeSnack('error');
          setShowSnackBar(true);
          setTimeout(() => {
            setShowSnackBar(false);
          }, 1000);
        } else if (removedPrefix[1] === 'polar/error') {
          setSnackBarMessage('Houve um erro na conexão, tente novamente!');
          setTypeSnack('error');
          setShowSnackBar(true);
          setTimeout(() => {
            setShowSnackBar(false);
          }, 1000);
        } else if (removedPrefix[1] === 'polar/success') {
          setSnackBarMessage('Conectado com sucesso!');
          setTypeSnack('success');
          setShowSnackBar(true);
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        }
      }
    });
  }, [appState]);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return (
    <SafeAreaView>
      <StatusBar
        translucent
        animated
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <BoxContainer
        style={{
          marginTop: -25,
          paddingTop: 50,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 24,
        }}
      >
        <View
          style={{
            width: widthPercentageToDP('100'),
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            style={{ marginLeft: 16 }}
          >
            <Icons name="close" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginRight: 24 }}>
            <LottieView
              source={require('~/assets/animation/challengeFinalization.json')}
              autoPlay
              style={{
                width: 76,
                height: 76,
              }}
              loop
            />
          </View>
          <View
            style={{
              borderLeftColor: '#009D33',
              borderLeftWidth: 2,
            }}
          >
            <RegularTitle
              style={{ width: 120, marginLeft: 12, color: '#009D33' }}
            >
              Inscrição confirmada
            </RegularTitle>
          </View>
        </View>
      </BoxContainer>

      <ScrollView
        style={{ height: heightPercentageToDP('65') }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <BoxContainer
          style={{
            marginTop: 24,
          }}
        >
          <View
            style={{
              paddingVertical: 24,
              paddingHorizontal: 16,
            }}
          >
            <TitleText style={{ fontSize: 20, color: '#4595EC' }}>
              {route.params.start_date
                ? isToday(new Date(route.params.start_date)) ||
                  isPast(new Date(route.params.start_date))
                  ? 'Você já pode ir pedalar'
                  : 'Período de atividades'
                : null}
            </TitleText>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 12,
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Icons
                  name="calendar"
                  color="#009D33"
                  style={{ marginRight: 12 }}
                />

                <View>
                  <Text>A partir de:</Text>
                  <TitleText>
                    {route.params.start_date
                      ? isToday(new Date(route.params.start_date)) ||
                        isPast(new Date(route.params.start_date))
                        ? 'Hoje'
                        : format(
                            new Date(route.params.start_date),
                            "dd'/'MM'/'yy",
                          )
                      : null}
                  </TitleText>
                </View>
              </View>

              <View
                style={{
                  height: 21.5,
                  borderLeftColor: 'rgba(0,0,0,0.4)',
                  borderLeftWidth: 1,
                  width: 1,
                  marginHorizontal: 32,
                }}
              />

              <View style={{ flexDirection: 'row' }}>
                <Icons
                  name="calendar"
                  color="#FF2525"
                  style={{ marginRight: 12 }}
                />

                <View>
                  <Text>Até:</Text>
                  <TitleText>
                    {route.params.end_date
                      ? format(new Date(route.params.end_date), "dd'/'MM'/'yy")
                      : null}
                  </TitleText>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: '#F8F8F8',
              paddingVertical: 16,
              paddingHorizontal: 16,
              flexDirection: 'row',
            }}
          >
            <Icons name="alert" color="#FFC502" />
            <View style={{ marginLeft: 16, backgroundColor: '#F8F8F8' }}>
              {route.params.start_date ? (
                isToday(new Date(route.params.start_date)) ||
                isPast(new Date(route.params.start_date)) ? (
                  <SmallText
                    style={{
                      fontSize: 14,
                      lineHeight: 16,
                      color: 'rgba(22, 28, 37, 0.56)',
                      width: widthPercentageToDP('75'),
                    }}
                  >
                    Lembre-se: só pedaladas realizadas à partir da inscrição
                    (Hoje) são válidas para o desafio.
                  </SmallText>
                ) : (
                  <SmallText
                    style={{
                      fontSize: 14,
                      lineHeight: 16,
                      color: 'rgba(22, 28, 37, 0.56)',
                      width: widthPercentageToDP('75'),
                    }}
                  >
                    Você poderá enviar pedaladas realizadas à partir de{' '}
                    <TitleText
                      style={{
                        fontSize: 14,
                        lineHeight: 16,

                        color: 'rgba(22, 28, 37, 0.56)',
                      }}
                    >
                      {route.params.start_date
                        ? format(new Date(route.params.start_date), "dd'/'MM")
                        : null}
                    </TitleText>{' '}
                    para progredir neste desafio.
                  </SmallText>
                )
              ) : null}
            </View>
          </View>
        </BoxContainer>

        <BoxContainer style={{ marginTop: 24 }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
            <TitleText style={{ fontSize: 20, color: '#4595EC' }}>
              Use uma integração
            </TitleText>
            <SmallText
              style={{
                fontSize: 14,
                lineHeight: 16,
                color: 'rgba(22, 28, 37, 0.56)',
              }}
            >
              Você vai precisar nos enviar as pedaladas. Utilize alguma das
              integrações abaixo disponíveis:
            </SmallText>
          </View>
          <View>
            {Platform.OS === 'ios' && (
              <MethodContainer
                disabled={route.params.challenge_type !== 'distance'}
                onPress={() => {
                  setSelectedOption('health');
                  navigation.navigate('User.SpecificMonitorHelp', {
                    ...info.apple,
                    challenge_id: route.params.challenge_id,
                  });
                  // if (getPermission && status !== 'SharingDenied') {
                  //   getPermission();
                  // } else {
                  //   Linking.openURL('App-Prefs:HealthKit');
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
                    <MethodName
                      type={route.params.challenge_type !== 'distance'}
                    >
                      Buscar atividade do{' '}
                      <MethodNameBold>Apple Health</MethodNameBold>
                    </MethodName>
                    {route.params.challenge_type !== 'distance' && (
                      <MethodName
                        type={route.params.challenge_type === 'altimetric'}
                      >
                        *O Apple Saúde não envia Altimetria
                      </MethodName>
                    )}
                  </View>
                </MethodWrapper>
                <Icons name="chevron-right" />
              </MethodContainer>
            )}
            <MethodContainer
              onPress={() => {
                setSelectedOption('garmin');
                Linking.openURL(
                  `${API}/auth/garmin?user_id=${base64.encode(userID)}`,
                );
              }}
            >
              <MethodWrapper>
                <MethodImage source={garminImage} />
                <MethodNameBold>Garmin</MethodNameBold>
              </MethodWrapper>
              <Icons name="chevron-right" />
            </MethodContainer>

            <MethodContainer
              onPress={() => {
                setSelectedOption('polar');
                Linking.openURL(
                  `${API}/auth/polar?user_id=${base64.encode(userID)}`,
                );
              }}
            >
              <MethodWrapper>
                <MethodImage source={polarImage} />
                <MethodNameBold>Polar</MethodNameBold>
              </MethodWrapper>
              <Icons name="chevron-right" />
            </MethodContainer>

            <MethodContainer
              onPress={() => {
                setSelectedOption('strava');
                navigation.navigate('User.SpecificMonitorHelp', {
                  ...info.strava,
                  challenge_id: route.params.challenge_id,
                });
              }}
            >
              <MethodWrapper>
                <MethodImage source={stravaImage} />
                <MethodName>
                  Vou usar minha atividade do{' '}
                  <MethodNameBold>Strava</MethodNameBold>
                </MethodName>
              </MethodWrapper>

              <Icons name="chevron-right" />
            </MethodContainer>

            <MethodContainer
              onPress={() => {
                setSelectedOption('gpx');
                navigation.navigate('User.SpecificMonitorHelp', {
                  ...info.gpx,
                  challenge_id: route.params.challenge_id,
                });
              }}
            >
              <MethodWrapper>
                <MethodImage source={gpxImage} />
                <MethodName>
                  Vou enviar um arquivo <MethodNameBold>GPX</MethodNameBold>
                </MethodName>
              </MethodWrapper>

              <Icons name="chevron-right" />
            </MethodContainer>

            {/* <LaterContainer onPress={() => navigation.goBack()}>
            <LaterText>Deixar para mais tarde</LaterText>
            <Icons name="arrow-right" color="#0564FF" />
          </LaterContainer> */}
          </View>
        </BoxContainer>
      </ScrollView>
      <SubscribeContainer>
        <Button
          name="Entendi"
          // loading={hasClickedOnSubscribe}
          style={{ marginTop: 0 }}
          onPress={() => navigation.goBack()}
        />
      </SubscribeContainer>
      <SnackBar
        show={showSnackBar}
        setShow={(e) => setShowSnackBar(e)}
        message={snackBarMessage}
        type={typeSnack}
      />
    </SafeAreaView>
  );
};

export default ChallengeSubscribedWihoutMonitors;
