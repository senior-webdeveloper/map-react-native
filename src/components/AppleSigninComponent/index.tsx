import React from 'react';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import Modal from 'react-native-modal';
import { ActivityIndicator, Linking, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';
import * as Sentry from '@sentry/react-native';
import { useRegisterAppleUserMutation } from '~/graphql/autogenerate/hooks';
import {
  EmailLoginButtonContainer,
  ModalButton,
  ModalButtonText,
  ModalContainer,
  ModalDescriptionText,
  ModalHeaderText,
  TermsOfUse,
} from '~/components/EmailSigninComponent/styles';
import { translate } from '~/locales';
import addDays from '~/helpers/addDays';
import { useUpdateLastLogin } from '~/hooks';

const AppleSigninComponent: React.FC = (props) => {
  const { handleUpdateLastLogin } = useUpdateLastLogin();
  const [modalState, setModalState] = React.useState(false);
  const navigation = useNavigation();
  const [registerAppleUserMutation] = useRegisterAppleUserMutation();
  const [modalLoadingState, setModalLoadingState] = React.useState(false);
  const toggleModal = () => {
    setModalState(!modalState);
  };
  const onAppleButtonPress = async () => {
    setTimeout(() => {
      setModalLoadingState(true);
    }, 350);

    // performs login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {
        authorizationCode,
        authorizedScopes,
        email,
        fullName,
        identityToken,
        nonce,
        realUserStatus,
        state,
        user,
      } = appleAuthRequestResponse;

      const { data } = await registerAppleUserMutation({
        variables: {
          data: {
            apple_id: user,
            email,
            firstname: fullName?.givenName,
            lastname: fullName?.familyName,
          },
        },
      });
      if (data?.registerAppleUser) {
        OneSignal.setExternalUserId(data.registerAppleUser.user.id);
        await AsyncStorage.setItem(
          '@riderize::user_id',
          data.registerAppleUser.user.id,
        );
        await AsyncStorage.setItem(
          `@riderize::${data.registerAppleUser.user.id}:acesstoken:`,
          data.registerAppleUser.accessToken,
        );
        await AsyncStorage.setItem(
          `@riderize::${data.registerAppleUser.user.id}:refreshtoken:`,
          data.registerAppleUser.refreshToken,
        );
        await AsyncStorage.setItem(
          `@riderize::${data.registerAppleUser.user.id}:profileid:`,
          data.registerAppleUser.profile?.id ?? '',
        );
        await AsyncStorage.setItem(
          `@riderize::${data.registerAppleUser.user.id}:userinfo:`,
          JSON.stringify(data.registerAppleUser.user),
        );
        setModalLoadingState(false);
        handleUpdateLastLogin();
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
              params: {
                apple_id: user,
              },
            },
          ],
        });
      }
    } catch (err) {
      setModalLoadingState(false);
      Sentry.captureException(err);
    }

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    // const credentialState = await appleAuth.getCredentialStateForUser(
    //   appleAuthRequestResponse.user,
    // );
    // console.log(credentialState);
    // // use credentialState response to ensure the user is authenticated
    // if (credentialState === appleAuth.State.AUTHORIZED) {
    //   // user is authenticated
    // }
  };
  const linking = 'https://riderize.com/legal/terms';

  const handleTerms = async () => {
    await Linking.openURL(linking);
  };
  return (
    <>
      <AppleButton
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          borderRadius: 26,
          borderWidth: 1,
          borderColor: '#161C25',
          width: '100%',
          height: 56, // You must specify a height
        }}
        onPress={() => toggleModal()}
      />
      <Modal
        isVisible={modalState}
        onBackdropPress={() => toggleModal()}
        accessibilityLabel="email-login-modal"
        testID="email-login-modal"
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
          <TouchableHighlight
            onPress={() => {
              toggleModal();
              setTimeout(() => {
                onAppleButtonPress();
              }, 10);
            }}
            accessibilityLabel="email-login-modal-button"
            testID="email-login-modal-button"
            accessible
          >
            <ModalButton>
              <ModalButtonText>
                {translate('agree_and_continue')}
              </ModalButtonText>
            </ModalButton>
          </TouchableHighlight>
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

export default AppleSigninComponent;
