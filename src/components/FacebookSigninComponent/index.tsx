import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import OneSignal from 'react-native-onesignal';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
// import { getDeviceName } from 'react-native-device-info';
import Modal from 'react-native-modal';
import * as Sentry from '@sentry/react-native';
import { APP_VERSION } from '@env';
import FacebookIcon from '~/assets/LoginAssets/facebook-round.svg';
import {
  useRegisterFacebookUserMutation,
  useUpdateUserDataCompiledMutation,
} from '~/graphql/autogenerate/hooks';

import { translate } from '~/locales';
import {
  FacebookLoginButtonContainer,
  FacebookLoginButtonText,
  ModalButton,
  ModalButtonText,
  ModalContainer,
  ModalDescriptionText,
  ModalHeaderText,
  TermsOfUse,
} from './styles';
import { useDataCompiled, useUpdateLastLogin } from '~/hooks';

const FacebookSigninComponent: React.FC = () => {
  const { refetch } = useDataCompiled();
  const { handleUpdateLastLogin } = useUpdateLastLogin();
  const [modalState, setModalState] = React.useState(false);
  const [modalLoadingState, setModalLoadingState] = React.useState(false);
  const [registerFacebookUserMutation] = useRegisterFacebookUserMutation({
    onError(e) {
      setModalLoadingState(false);
      setModalState(false);
    },
  });
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalState(!modalState);
  };

  const storeData = async (value: any) => {
    try {
      const { email, first_name, last_name, id, picture } = value;

      const { data } = await registerFacebookUserMutation({
        variables: {
          data: {
            firstname: first_name,
            lastname: last_name,
            email,
            facebook_id: Number(id),
            profile_avatar: picture?.data?.url,
          },
        },
      });

      if (data && data.registerFacebookUser) {
        OneSignal.setExternalUserId(data.registerFacebookUser.user.id);
        await AsyncStorage.setItem(
          '@riderize::user_id',
          data.registerFacebookUser.user.id,
        );
        await AsyncStorage.setItem(
          `@riderize::${data.registerFacebookUser.user.id}:acesstoken:`,
          data.registerFacebookUser.accessToken,
        );

        await AsyncStorage.setItem(
          `@riderize::${data.registerFacebookUser.user.id}:refreshtoken:`,
          data.registerFacebookUser.refreshToken,
        );
        await AsyncStorage.setItem(
          `@riderize::${data.registerFacebookUser.user.id}:profileid:`,
          data.registerFacebookUser.profile.id,
        );
        await AsyncStorage.setItem(
          `@riderize::${data.registerFacebookUser.user.id}:userinfo:`,
          JSON.stringify(data.registerFacebookUser.user),
        );

        handleUpdateLastLogin();

        if (data) {
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }
      }
    } catch (e) {
      Sentry.captureException(e);
    }
  };

  const linking = 'https://riderize.com/legal/terms';

  const handleTerms = async () => {
    await Linking.openURL(linking);
  };

  const handleFacebookSignin = async () => {
    // const accessToken = await AccessToken.getCurrentAccessToken();
    setModalState(false);
    setTimeout(() => {
      // logOut(accessToken);
      LoginManager.logOut();
      setModalLoadingState(true);
      LoginManager.logInWithPermissions(['email', 'public_profile']).then(
        function onResult(result) {
          if (result.isCancelled) {
            setModalLoadingState(false);
            Alert.alert('Login cancelado!');
          } else if (result.grantedPermissions) {
            AccessToken.getCurrentAccessToken().then((data) => {
              const responseInfoCallback = (error, result) => {
                if (error) {
                  Alert.alert(`Erro em pegar os dados: ${error.toString()}`);
                  setModalLoadingState(false);
                } else {
                  setModalLoadingState(true);
                  storeData(result);
                }
              };
              const infoRequest = new GraphRequest(
                '/me?fields=id,first_name,last_name,picture,email',
                null,
                responseInfoCallback,
              );
              // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start();
            });
          }
        },
        function onError(error) {
          Sentry.captureException(error);
          setModalLoadingState(false);
          //
        },
      );
    }, 350);
  };

  return (
    <TouchableOpacity onPress={() => toggleModal()} activeOpacity={0.9}>
      <FacebookLoginButtonContainer>
        <FacebookIcon />
        <FacebookLoginButtonText>
          {translate('login_with_facebook')}
        </FacebookLoginButtonText>
      </FacebookLoginButtonContainer>
      <Modal
        isVisible={modalState}
        onBackdropPress={() => toggleModal()}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <ModalContainer>
          <ModalHeaderText>
            {translate('accept_our_terms_of_use')}
          </ModalHeaderText>
          <ModalDescriptionText>
            {translate('by_signing_up_you_agree_to_our')}
            <TermsOfUse onPress={() => handleTerms()}>
              {' '}
              {translate('terms_of_use')}
            </TermsOfUse>
          </ModalDescriptionText>
          <TouchableOpacity onPress={() => handleFacebookSignin()}>
            <ModalButton>
              <ModalButtonText>
                {translate('agree_and_continue')}
              </ModalButtonText>
            </ModalButton>
          </TouchableOpacity>
        </ModalContainer>
      </Modal>
      <Modal
        isVisible={modalLoadingState}
        onBackdropPress={() => {}}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <ModalContainer
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <ModalDescriptionText>
            Estamos carregando seus dados....
          </ModalDescriptionText>
          <ActivityIndicator size="large" />
        </ModalContainer>
      </Modal>
    </TouchableOpacity>
  );
};

export default FacebookSigninComponent;
