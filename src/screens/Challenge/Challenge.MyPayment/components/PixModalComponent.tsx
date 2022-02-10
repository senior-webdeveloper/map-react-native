import ModalComponent from 'react-native-modal';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import React from 'react';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import {
  ChallengeAwards,
  SubscriptionPayment,
} from '~/graphql/autogenerate/schemas';
import { Button, Text } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import {
  Box,
  ModalContentContainer,
} from '~/screens/Challenge/Challenge.MyPayment/components/Styles';

export function PixModalComponent({
  onBackdropPress,
  onPress,
  params: { lastPayment },
  visible,
}: {
  visible: boolean;
  onBackdropPress: () => void;
  params: Readonly<{
    data: GetChallengeDetailQuery;
    challenge_id: string;
    award: ChallengeAwards;
    payment_id: string;
    payment_historic: SubscriptionPayment[];
    value: number;
    last_payment?: SubscriptionPayment;
    interest_free_amount?: number;
  }>;
  onPress: () => void;
}) {
  return (
    <ModalComponent
      isVisible={visible}
      onBackdropPress={onBackdropPress}
      // backdropColor="#FFF"
      useNativeDriver
      backdropTransitionOutTiming={0}
      useNativeDriverForBackdrop
    >
      {visible ? (
        <ModalContentContainer>
          <Text
            style={{
              fontFamily: 'NeuzeitGro-Bol',
              fontSize: 20,
              lineHeight: 20,
            }}
          >
            Pagamento em Pix
          </Text>

          <Box marginVertical={20} alignItems="center">
            <Text>Escaneie o QrCode</Text>
            <Text>para efetuar o pagamento:</Text>
          </Box>

          {lastPayment.pix_qrcode ? (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <QRCode
                value={lastPayment.pix_qrcode}
                size={widthPercentageToDP('70')}
                logoBackgroundColor="#FFF"
              />
            </View>
          ) : null}
          <Box marginTop={20} alignItems="center">
            <Text>
              Ou use o{' '}
              <Text style={{ fontFamily: 'NeuzeitGro-Bol' }}>
                Pix Copia e Cola
              </Text>
            </Text>
            <Text>para efetuar o pagamento</Text>
          </Box>

          <Box width={1} paddingHorizontal={20}>
            <Button name="Copiar" onPress={onPress} />
          </Box>
        </ModalContentContainer>
      ) : null}
    </ModalComponent>
  );
}
