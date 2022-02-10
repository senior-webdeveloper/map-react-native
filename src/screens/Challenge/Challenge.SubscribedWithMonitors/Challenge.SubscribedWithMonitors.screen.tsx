import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  AppState,
  AppStateStatus,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { API } from '@env';
import base64 from 'react-native-base64';
import branch from 'react-native-branch';
import {
  SafeAreaView as CustomSafe,
  TitleText,
  Text,
  Icons,
  SnackBar,
  SafeAreaView as View,
  Button,
} from '~/components';
import mainImage from '~/assets/ChallengeSubscribedAssets/main.jpg';
import stravaImage from '~/assets/ChallengeSubscribedAssets/strava.jpg';
import gpxImage from '~/assets/ChallengeSubscribedAssets/gpx.jpg';
import healthImage from '~/assets/ChallengeSubscribedAssets/health.jpg';
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
import { Content } from '~/screens/Challenge/CreateChallenge/steps/CreateChallenge.Finalization';

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
export const MethodName = styled(Text)``;
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

const ChallengeSubscribedWithMonitors: React.FC = (): JSX.Element => {
  const [clickedOnOK, setClickedOnOK] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    const time = setTimeout(() => {
      if (!clickedOnOK) {
        setDisableButton(true);

        navigation.goBack();
      } else {
        clearTimeout(time);
      }
    }, 4000);

    return () => clearTimeout(time);
  }, [clickedOnOK, navigation]);

  return (
    <SafeAreaView>
      <StatusBar translucent={false} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
      >
        <LottieView
          source={require('~/assets/animation/challengeFinalization.json')}
          autoPlay
          style={{
            flex: 1,
            width: '50%',
            marginTop: 20,
          }}
          loop
        />
        <RegularTitle>Inscrição realizada com</RegularTitle>
        <BoldedTitle>sucesso!</BoldedTitle>

        <Button
          name="OK!"
          disabled={disableButton}
          onPress={() => {
            setClickedOnOK(true);
            navigation.goBack();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengeSubscribedWithMonitors;
