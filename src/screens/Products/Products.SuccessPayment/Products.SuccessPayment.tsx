import React, { useEffect, useRef, useState } from 'react';
import {
  RouteProp,
  CommonActions,
  useNavigationState,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import analytics from '@react-native-firebase/analytics';

import {
  ActivityIndicator,
  Alert,
  Linking,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Sentry from '@sentry/react-native';
import Clipboard from '@react-native-community/clipboard';
import QRCode from 'react-native-qrcode-svg';
import styled from 'styled-components/native';
import { layout, space, flexbox } from 'styled-system';
import ModalComponent from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import { Button, Icons, SafeAreaView, Text, TitleText } from '~/components';
import { RootStackParamList } from '~/routes.types';
import { useFindPaymentLazyQuery } from '~/graphql/autogenerate/hooks';
import { useStoreActions } from '~/store';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
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

const ChallengeSuccessPayment: React.FC<Props> = ({ route }) => {
  const navigator = useNavigation<ChallengeDescriptionNavigationProp>();
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState<boolean>(
    !route.params.error_in_payment,
  );
  const [getPayment, { data }] = useFindPaymentLazyQuery({
    variables: {
      id: route.params.payment_id,
    },
    onError: (e) => {
      Sentry.captureException(e);
      Alert.alert('Erro no Find Payment:', e.message);
      setLoading(false);
    },
    onCompleted: (e) => {
      setLoading(false);
      if (e.findPayment.pix_qrcode) {
        setModalState(true);
      }
    },
  });

  const handleAnalitics = async () => {
    await analytics().logEvent('subscribe_paid_challenge', {
      challenge_id: route.params.challenge_id,
      profile_id: data?.findPayment.profile_id,
    });
  };

  function navigateToChallenge() {
    try {
      navigator.reset({
        index: 1,
        routes: [
          { name: 'Home' },
          {
            name: 'Challenge.Description',
            params: { challenge_id: route.params.challenge_id },
          },
        ],
      });
      // clearCart();
    } catch (e) {
      console.log(e);
    }

    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 1,
    //     routes: [
    //       { name: 'Home' },
    //       {
    //         name: 'Challenge.Description',
    //         params: { challenge_id: route.params.challenge_id },
    //       },
    //     ],
    //   }),
    // );
  }

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

  if (loading) {
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
            navigateToChallenge();
            setIsOnPurchase(false);
          }}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="close" />
        </TouchableOpacity>
      </View>
      {route.params.error_in_payment ? (
        <>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
            }}
          >
            <FastImage
              style={{ width: 149, height: 149 }}
              source={require('./images/out-of-stock.png')}
            />
            <TitleText style={{ textAlign: 'center' }}>
              Produto sem estoque
            </TitleText>
            <Text style={{ textAlign: 'center' }}>
              Parece que um item da sua compra ficou sem estoque.
            </Text>
            <Text style={{ textAlign: 'center' }}>
              Mas fique tranquilo, pois nenhum débito foi realizado e você
              poderá tentar comprar a inscrição novamente.
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 32,
              paddingBottom: 20,
            }}
          >
            <Button
              name="Ir para o desafio"
              onPress={() => {
                if (!route.params.hasSubscribed) {
                  setIsOnPurchase(false);
                }
                navigateToChallenge();
              }}
            />
          </View>
        </>
      ) : null}
      {data ? (
        <>
          {(data?.findPayment.is_paid ||
            data?.findPayment.status === 'waiting_payment') &&
          !data.findPayment.bill_link &&
          !data?.findPayment.pix_qrcode ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 16,
              }}
            >
              <FastImage
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
          ) : null}

          {data.findPayment.pix_qrcode ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 16,
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  backgroundColor: '#FFC502',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                }}
              >
                <Icons name="clock" color="#FFF" height={40} width={40} />
              </View>

              <TitleText style={{ textAlign: 'center' }}>
                Aguardando PIX
              </TitleText>
              <Text style={{ textAlign: 'center' }}>
                A chave PIX ficará disponível por 30 minutos e depois será
                automaticamente cancelada. O banco poderá levar até 1 dia útil
                para confirmar o pagamento.
              </Text>
            </View>
          ) : null}

          {data?.findPayment.bill_link ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 16,
              }}
            >
              <FastImage
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

              <View style={{ marginTop: 20 }}>
                <Text style={{ textAlign: 'center' }}>
                  {data?.findPayment.bill_barcode}
                </Text>

                <TouchableOpacity
                  style={{
                    marginBottom: 12,
                    backgroundColor: '#0564ff',
                    borderRadius: 32,
                    paddingVertical: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    Clipboard.setString(data?.findPayment.bill_barcode);
                  }}
                >
                  <Text style={{ color: '#FFF' }}>Copiar linha digitável</Text>
                </TouchableOpacity>

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
                    setIsOnPurchase(false);
                    Linking.openURL(data?.findPayment.bill_link);
                  }}
                >
                  <Text>Visualizar Boleto</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {data?.findPayment.declined ||
          data?.findPayment.status === 'refused' ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 16,
              }}
            >
              <FastImage
                style={{ width: 149, height: 149 }}
                source={require('./images/error.png')}
              />
              <TitleText style={{ textAlign: 'center' }}>
                Não foi possivel realizar o pagamento da inscrição
              </TitleText>
              <Text style={{ textAlign: 'center' }}>
                {data.findPayment.humanized_message}
              </Text>
            </View>
          ) : null}
          {data?.findPayment.bill_link ? (
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
                  navigateToChallenge();
                }}
              >
                <Text>Ir para o desafio</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {data.findPayment.pix_qrcode ? (
            <View
              style={{
                paddingHorizontal: 32,
                paddingBottom: 20,
              }}
            >
              <Button
                name="Ver chave PIX novamente"
                onPress={() => {
                  setIsOnPurchase(false);

                  setModalState(true);
                  // navigation.navigate('Challenge.Description', {
                  //   challenge_id: route.params.challenge_id,
                  // });
                }}
              />

              <TouchableOpacity
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  marginTop: 20,
                  backgroundColor: '#0565ff11',
                  borderRadius: 24,
                }}
                onPress={() => {
                  setIsOnPurchase(false);

                  navigateToChallenge();
                }}
              >
                <Text style={{ color: '#0564ff' }}>Ir para o desafio</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {(data?.findPayment.is_paid ||
            (data?.findPayment.status === 'waiting_payment' &&
              !data.findPayment.bill_link)) &&
          !data.findPayment.pix_qrcode ? (
            <View
              style={{
                paddingHorizontal: 32,
                paddingBottom: 20,
              }}
            >
              <Button
                name="Ir para o desafio"
                onPress={() => {
                  setIsOnPurchase(false);

                  navigateToChallenge();
                }}
              />
            </View>
          ) : null}
        </>
      ) : null}

      <ModalComponent
        isVisible={modalState}
        onBackdropPress={() => {
          setModalState(false);
        }}
        // backdropColor="#FFF"
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
