import React from 'react';
import Modal from 'react-native-modal';
import { TouchableOpacity, Linking } from 'react-native';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { translate } from '~/locales';
import {
  ModalContainer,
  ModalButton,
  ModalHeaderText,
  ModalDescriptionText,
  ModalButtonText,
  TermsOfUse,
} from './styles';

function TermsOfUseModal({ handleLogin }: { handleLogin: Function }) {
  const toggleModalState = useStoreActions(
    (actions) => actions.modalState.toggle,
  );
  const modalState = useStoreState((state) => state.modalState.payload);

  const toggleModal = () => {
    toggleModalState(false);
  };

  const linking = 'https://riderize.com/legal/terms';

  const handleTerms = async () => {
    await Linking.openURL(linking);
  };

  return (
    <Modal isVisible={modalState} onBackdropPress={() => toggleModal()}>
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
        <TouchableOpacity onPress={() => handleLogin()}>
          <ModalButton>
            <ModalButtonText>{translate('agree_and_continue')}</ModalButtonText>
          </ModalButton>
        </TouchableOpacity>
      </ModalContainer>
    </Modal>
  );
}

export default TermsOfUseModal;
