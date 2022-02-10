import React, { useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, ScrollView, View } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import { useUserToken } from '~/hooks';
import { RootStackParamList } from '~/routes.types';
import { SafeAreaView, TitleText } from '~/components';
import BuyModal from '~/screens/Challenge/Challenge.Description/components/BuyModal';
import { PixModalComponent } from '~/screens/Challenge/Challenge.MyPayment/components/PixModalComponent';
import { HistoricComponent } from '~/screens/Challenge/Challenge.MyPayment/components/HistoricComponent';
import { BillLinkPaymentComponent } from '~/screens/Challenge/Challenge.MyPayment/components/BillLinkPaymentComponent';
import { Box } from '~/screens/Challenge/Challenge.MyPayment/components/Styles';
import { OtherPaymentsComponent } from '~/screens/Challenge/Challenge.MyPayment/components/OtherPaymentsComponent';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.PaymentHistoric'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.PaymentHistoric'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

const ChallengePaymentHistoric: React.FC<Props> = ({ route, navigation }) => {
  const [modalState, setModalState] = useState(false);
  const [buyModalState, setBuyModalState] = useState(false);
  const { userinfo } = useUserToken();

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ marginTop: 10 }}>
          {route.params.lastPayment ? (
            <>
              {route.params.lastPayment.bill_link ? (
                <BillLinkPaymentComponent
                  params={route.params}
                  onPress={() => {
                    Linking.openURL(
                      route.params.payment_historic[0].payment.bill_link,
                    );
                  }}
                  userinfo={userinfo}
                  onPress1={() => {
                    setBuyModalState((prevState) => !prevState);
                  }}
                  onPress2={() => {
                    setBuyModalState((prevState) => !prevState);
                  }}
                />
              ) : (
                <OtherPaymentsComponent
                  params={route.params}
                  onPress={() => {
                    setModalState(true);
                  }}
                  onPress1={() => {
                    setBuyModalState(true);
                  }}
                />
              )}
            </>
          ) : null}
        </View>
        <Box
          style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 24 }}
        >
          <TitleText style={{ fontSize: 20 }}>Histórico de compra</TitleText>
          {route.params.payment_historic &&
            route.params.payment_historic.map(({ payment }) => (
              <HistoricComponent payment={payment} />
            ))}
        </Box>
      </ScrollView>
      <View />
      <PixModalComponent
        visible={modalState}
        onBackdropPress={() => {
          setModalState(false);
        }}
        params={route.params}
        onPress={() => {
          Clipboard.setString(String(route.params.lastPayment.pix_qrcode));
          Toast.show('Pix copiado com sucesso!', Toast.LONG);
        }}
      />
      <BuyModal
        setModalState={setBuyModalState}
        modalState={buyModalState}
        navigation={navigation}
        hasSubscription
        data={route.params.data}
      />
    </SafeAreaView>
  );
};
export default ChallengePaymentHistoric;
