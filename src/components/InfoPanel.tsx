import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
// import { Container } from './styles';
interface Props {
  showPanel: boolean;
  setPanelStatus: (e: boolean) => void;
  panelStatus: boolean;
  Content: () => JSX.Element;
}
const InfoPanel: React.FC<Props> = ({
  showPanel,
  setPanelStatus,
  panelStatus = false,
  Content,
}) => {
  return (
    <SafeAreaView>
      <Modal
        style={{ margin: 0 }}
        isVisible={panelStatus}
        onBackdropPress={() => setPanelStatus(false)}
        backdropTransitionOutTiming={0}
        propagateSwipe
      >
        <View
          style={{
            backgroundColor: '#FFF',
            height: '100%',
          }}
        >
          <SafeAreaView>
            <ScrollView>
              <Content setPanelStatus={setPanelStatus} />
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default InfoPanel;
