import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Linking, TouchableOpacity, TouchableHighlight } from 'react-native';

import Modal from 'react-native-modal';
import {
  EmailLoginButtonContainer,
  EmailLoginButtonText,
  ModalContainer,
  ModalButton,
  ModalHeaderText,
  ModalDescriptionText,
  ModalButtonText,
  TermsOfUse,
} from './styles';
import EmailIcon from '~/assets/LoginAssets/email.svg';
import { translate } from '~/locales';

function EmailSigninComponent(): JSX.Element {
  const [modalState, setModalState] = React.useState(false);
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalState(!modalState);
  };
  const handleLoginEmail = () => {
    navigation.navigate('User.EmailLogin', { registerCompany: false });

    setModalState(false);
  };

  const linking = 'https://riderize.com/legal/terms';

  const handleTerms = async () => {
    await Linking.openURL(linking);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => toggleModal()}
      accessibilityLabel="email-login"
      testID="email-login"
    >
      <EmailLoginButtonContainer>
        <EmailIcon />
        <EmailLoginButtonText>
          {translate('login_with_email')}
        </EmailLoginButtonText>
      </EmailLoginButtonContainer>
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
            onPress={() => handleLoginEmail()}
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
    </TouchableOpacity>
  );
}

export default EmailSigninComponent;
