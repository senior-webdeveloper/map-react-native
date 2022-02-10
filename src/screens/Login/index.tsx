import React, { useEffect, useState } from 'react';
import { StatusBar, NativeModules, View, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_VERSION } from '@env';
import OneSignal from 'react-native-onesignal';
import uuid from 'react-native-uuid';
import GoogleSigninComponent from '~/components/GoogleSigninComponent';
import FacebookSigninComponent from '~/components/FacebookSigninComponent';
import EmailSigninComponent from '~/components/EmailSigninComponent';
import Logo from '~/assets/logo.svg';
import backgroundImage from '~/assets/LoginAssets/photoBackground.jpg';
import {
  LogoContainer,
  LoginOptionsContainer,
  HeaderText,
  SubHeaderText,
  Background,
  FooterVersionContainer,
  FooterVersionText,
} from './styles';
import { AppleSigninComponent } from '~/components';

const { UIManager } = NativeModules;
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const Login: React.FC = () => {
  const [hasAccount, setHasAccount] = useState();
  const handleLoggedUser = async () => {
    const hasAccount = await AsyncStorage.getItem('hasAccount');
    if (hasAccount === 'true') {
      setHasAccount(true);
    }
  };
  useEffect(() => {
    OneSignal.setExternalUserId(String(uuid.v4()));
    OneSignal.sendTag('anonimo', 'true');
  }, []);
  return (
    <>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <View style={{ flex: 1 }} testID="app-root" accessibilityLabel="app-root">
        <Background
          source={backgroundImage}
          style={{
            flex: 1,
            justifyContent: 'center',
            marginBottom: '-60%',
          }}
        >
          <LogoContainer style={{ marginBottom: '90%' }}>
            <Logo width={169} height={23} />
          </LogoContainer>
        </Background>
        <LoginOptionsContainer
          style={{ marginTop: Platform.OS === 'ios' ? '25%' : '40%' }}
        >
          <HeaderText>Vamos lá!</HeaderText>
          <SubHeaderText>Escolha uma conta para entrar no app.</SubHeaderText>
          <FacebookSigninComponent />
          <GoogleSigninComponent />
          <EmailSigninComponent />
          {Platform.OS === 'ios' && <AppleSigninComponent />}
          <FooterVersionContainer>
            <FooterVersionText>v{APP_VERSION}</FooterVersionText>
          </FooterVersionContainer>
        </LoginOptionsContainer>
      </View>
    </>
  );
};

export default Login;
