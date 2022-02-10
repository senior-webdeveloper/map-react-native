import React, { useEffect, useRef, useState } from 'react';
import {
  CommonActions,
  RouteProp,
  useNavigationState,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import analytics from '@react-native-firebase/analytics';

import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  Linking,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Sentry from '@sentry/react-native';
import Clipboard from '@react-native-community/clipboard';
import QRCode from 'react-native-qrcode-svg';
import styled from 'styled-components/native';
import { flexbox, layout, space } from 'styled-system';
import ModalComponent from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import { Button, Icons, SafeAreaView, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { useFindPaymentLazyQuery } from '~/graphql/autogenerate/hooks';
import { useStoreActions } from '~/store';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { ErrorComponent } from '~/screens/Challenge/Challenge.SuccessPayment/components/ErrorComponent';
import { DataComponent } from '~/screens/Challenge/Challenge.SuccessPayment/components/DataComponent';
import { useCleanCart } from '~/hooks';

export const Box = styled(View)(layout);

export const ModalContentContainer = styled(View)<layout>(
  {
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 25,
  },
  layout,
  space,
  flexbox,
);

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.SuccessPayment'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.SuccessPayment'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

const ChallengeSuccessPayment: React.FC<Props> = ({ route, navigation }) => {
  console.log('route.params: ', route.params);
  const clearCart = useCleanCart();
  const state = useNavigationState((state) => state);
  const [modalState, setModalState] = useState(false);
  const modalhasOpenned = useRef(false);
  const [getPayment, { data, loading }] = useFindPaymentLazyQuery({
    variables: {
      id: route.params.payment_id,
    },
    onError: (e) => {
      Sentry.captureException(e);
      Alert.alert('Erro no Find Payment:', e.message);
    },
  });

  useEffect(() => {
    if (
      data?.findPayment.pix_qrcode &&
      !modalState &&
      !modalhasOpenned.current
    ) {
      modalhasOpenned.current = true;
      setModalState(true);
    }
  }, [data, modalhasOpenned.current]);

  const handleAnalitics = async () => {
    await analytics().logEvent('subscribe_paid_challenge', {
      challenge_id: route.params.challenge_id,
      profile_id: data?.findPayment.profile_id,
    });
  };

  const setIsOnPurchase = useStoreActions(
    (actions) => actions.chart.setIsOnPurchase,
  );

  useEffect(() => {
    if (route.params.payment_id) {
      handleAnalitics();
      getPayment({
        variables: {
          id: route.params.payment_id,
        },
      });
    }
  }, []);

  function navigateToChallenge() {
    try {
      clearCart();

      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Home' },
            {
              name: 'Challenge.Description',
              params: { challenge_id: route.params.challenge_id },
            },
          ],
        }),
      );
    } catch (e) {
      console.log('Erro ao navegar');
      Sentry.captureException(e);
    }
  }

  React.useEffect(() => {
    const onBackPress = () => {
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
  }, []);

  if (loading && route.params.payment_id) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 14,
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: '90%',
          }}
        >
          <ActivityIndicator size="large" color="#0564FF" />
          <Text style={{ textAlign: 'center', marginTop: 14 }}>
            Carregando informacoes de pagamento...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}
    >
      <StatusBar barStyle="dark-content" />
      <View
        style={{ paddingHorizontal: 16, marginTop: 14, flexDirection: 'row' }}
      >
        <TouchableOpacity
          onPress={() => {
            clearCart();
            navigateToChallenge();
            setIsOnPurchase(false);
          }}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="close" />
        </TouchableOpacity>
      </View>
      {route.params.error_in_payment ? (
        <ErrorComponent
          onPress={() => {
            clearCart();
            if (!route.params.hasSubscribed) {
              setIsOnPurchase(false);
            }
            navigateToChallenge();
          }}
        />
      ) : null}
      {!route.params.payment_id ? (
        <>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
            }}
          >
            <Image
              style={{ width: 149, height: 149 }}
              source={require('./images/success.png')}
            />
            <TitleText style={{ textAlign: 'center' }}>
              Inscrição realizada com sucesso
            </TitleText>
            <Text style={{ textAlign: 'center' }}>
              Sua inscrição foi confirmada com sucesso.
            </Text>
            <Text style={{ textAlign: 'center' }}>
              Fique atento a data de liberação de atividades e detone neste
              desafio.
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 32,
              paddingBottom: 20,
            }}
          >
            <TouchableOpacity
              style={{
                borderColor: '#0564ff',
                borderWidth: 1,
                borderRadius: 32,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                clearCart();
                setIsOnPurchase(false);
                navigateToChallenge();
              }}
            >
              <Text>Ir para o desafio</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
      {data ? (
        <DataComponent
          data={data}
          onPress={() => {
            Clipboard.setString(data?.findPayment.bill_barcode);
          }}
          onPress1={() => {
            clearCart();
            setIsOnPurchase(false);
            Linking.openURL(data?.findPayment.bill_link);
          }}
          onPress2={() => {
            clearCart();
            setIsOnPurchase(false);
            navigateToChallenge();
          }}
          onPress3={() => {
            setModalState(true);
          }}
        />
      ) : null}

      <ModalComponent
        isVisible={modalState}
        onBackdropPress={() => {
          setModalState(false);
        }}
        useNativeDriver
        backdropTransitionOutTiming={0}
        useNativeDriverForBackdrop
      >
        {modalState ? (
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

            {data?.findPayment.pix_qrcode ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <QRCode
                  value={data?.findPayment.pix_qrcode}
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
              <Button
                name="Copiar"
                onPress={() => {
                  Clipboard.setString(String(data?.findPayment.pix_qrcode));
                  Toast.show('Pix copiado com sucesso!', Toast.LONG);
                }}
              />
            </Box>
          </ModalContentContainer>
        ) : null}
      </ModalComponent>
    </SafeAreaView>
  );
};

export default ChallengeSuccessPayment;
