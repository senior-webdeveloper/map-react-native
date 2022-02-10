import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import ModalComponent from 'react-native-modal';
import { TouchableOpacity } from 'react-native';
import { ModalContentContainer } from '~/screens/Challenge/Challenge.MyPayment/Styles';
import { Box, Icons, Text } from '~/components';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { lightTheme } from '~/global/themes';

export function ModalContainerComponent({
  onBackdropPress,
  onPress,
  params: { data },
  ref,
  visible,
  navigation,
}: {
  visible: boolean;
  onBackdropPress: () => void;
  onPress: () => void;
  params: Readonly<{
    user_challenge_id: string;
    challenge_id: string;
    physical_event: boolean;
    data: GetChallengeDetailQuery;
    last_payment_id?: string | null;
  }>;
  ref: React.MutableRefObject<QRCode>;
}) {
  return (
    <ModalComponent
      isVisible={visible}
      onBackdropPress={onBackdropPress}
      useNativeDriver
      backdropTransitionOutTiming={0}
      useNativeDriverForBackdrop
    >
      {visible ? (
        <ModalContentContainer>
          <Box mb={2} alignItems="flex-end" width="100%">
            <TouchableOpacity
              onPress={onPress}
              hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
            >
              <Icons name="close" style={{ marginRight: 12 }} />
            </TouchableOpacity>
          </Box>

          <Text
            style={{
              fontFamily: 'NeuzeitGro-Bol',
              fontSize: 20,
              lineHeight: 20,
            }}
          >
            Minha inscrição
          </Text>

          <Box marginVertical={20} alignItems="center">
            <Text
              style={{
                fontFamily: 'NeuzeitGro-Bol',
                color: 'rgba(22, 28, 37, 0.4)',
                lineHeight: 16,
              }}
            >
              {data.getChallengeDetail.user_challenges[0].short_id}
            </Text>
          </Box>

          <Box width={widthPercentageToDP('90')} alignItems="center">
            <Box
              borderColor={lightTheme.colors.text}
              borderWidth={3}
              borderRadius={4}
              p={21}
              alignItems="center"
            >
              <QRCode
                color={lightTheme.colors.text}
                ref={ref}
                value={data.getChallengeDetail.user_challenges[0].short_id}
                size={widthPercentageToDP('60')}
                logoBackgroundColor="#FFF"
              />
            </Box>
          </Box>

          <Box width={1} paddingHorizontal={20} mt={32}>
            <TouchableOpacity
              style={{
                backgroundColor: lightTheme.colors.blue100,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
              }}
              onPress={() => {
                onBackdropPress();
                navigation.navigate('Challenge.ShareSubscription', {
                  data,
                  short_id: data.getChallengeDetail.user_challenges[0].short_id,
                });
              }}
            >
              <Icons
                name="share"
                color={lightTheme.colors.textWhite}
                style={{ marginRight: 12 }}
              />
              <Text style={{ color: lightTheme.colors.textWhite }}>
                Compartilhar
              </Text>
            </TouchableOpacity>
          </Box>
        </ModalContentContainer>
      ) : null}
    </ModalComponent>
  );
}
