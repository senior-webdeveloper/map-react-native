import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin } from '@react-native-community/google-signin';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import * as Sentry from '@sentry/react-native';
import OneSignal from 'react-native-onesignal';
import GoogleIcon from '~/assets/LoginAssets/googleLogo.svg';
import {
  useRegisterGoogleUserMutation,
  useUserCompaniesQuery,
} from '~/graphql/autogenerate/hooks';
import { translate } from '~/locales';
import {
  GoogleLoginButtonContainer,
  GoogleLoginButtonText,
  ModalButton,
  ModalButtonText,
  ModalContainer,
  ModalDescriptionText,
  ModalHeaderText,
  TermsOfUse,
} from './styles';
import addDays from '~/helpers/addDays';
import { useUpdateLastLogin } from '~/hooks';

const GoogleSigninComponent: React.FC = () => {
  const { handleUpdateLastLogin } = useUpdateLastLogin();
  const [modalState, setModalState] = React.useState(false);
  const [modalLoadingState, setModalLoadingState] = React.useState(false);
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalState(!modalState);
  };
  const [registerGoogleUserMutation] = useRegisterGoogleUserMutation();
  const storeData = async (value: any) => {
    try {
      const { email, familyName, givenName, id, photo } = value?.user;

      const { data } = await registerGoogleUserMutation({
        variables: {
          data: {
            firstname: givenName,
            lastname: familyName,
            email,
            google_id: id,
            profile_avatar: photo,
          },
        },
      });

      if (data?.registerGoogleUser) {
        OneSignal.setExternalUserId(data?.registerGoogleUser.user.id);
        await AsyncStorage.setItem(
          '@riderize::user_id',
          data?.registerGoogleUser.user.id,
        );
        await AsyncStorage.setItem(
          `@riderize::${data?.registerGoogleUser.user.id}:acesstoken:`,
          data?.registerGoogleUser.accessToken,
        );

        await AsyncStorage.setItem(
          `@riderize::${data?.registerGoogleUser.user.id}:refreshtoken:`,
          data?.registerGoogleUser.refreshToken,
        );
        await AsyncStorage.setItem(
          `@riderize::${data?.registerGoogleUser.user.id}:profileid:`,
          data?.registerGoogleUser.profile.id,
        );
        await AsyncStorage.setItem(
          `@riderize::${data?.registerGoogleUser.user.id}:userinfo:`,
          JSON.stringify(data.registerGoogleUser.user),
        );

        setModalLoadingState(false);
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
  GoogleSignin.configure({
    scopes: ['email', 'profile'],
    webClientId:
      '83042139125-71esq9323rsggi1jgaooaelc392a5rne.apps.googleusercontent.com',
    offlineAccess: true,
    iosClientId:
      '83042139125-4jhm9elcdtu3b8hia549b497r831fp4s.apps.googleusercontent.com',
    forceCodeForRefreshToken: false,
  });

  const handleGoogleSignin = async () => {
    setModalState(false);
    setTimeout(async () => {
      setModalLoadingState(true);
      try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        console.log(
          '🚀 ~ file: index.tsx ~ line 112 ~ setTimeout ~ response',
          response,
        );

        storeData(response);
      } catch (error) {
        setModalLoadingState(false);
      }
    }, 350);
  };

  return (
    <>
      <TouchableOpacity onPress={() => toggleModal()} activeOpacity={0.7}>
        <GoogleLoginButtonContainer>
          <GoogleIcon />
          <GoogleLoginButtonText>
            {translate('login_with_google')}
          </GoogleLoginButtonText>
        </GoogleLoginButtonContainer>
      </TouchableOpacity>
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
          <TouchableOpacity onPress={() => handleGoogleSignin()}>
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
    </>
  );
};

export default GoogleSigninComponent;
