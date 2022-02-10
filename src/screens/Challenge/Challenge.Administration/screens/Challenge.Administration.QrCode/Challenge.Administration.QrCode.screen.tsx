import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  backgroundColor,
  layout,
  space,
  flexbox,
  textAlign,
  width,
} from 'styled-system';
import styled from 'styled-components/native';
import ModalComponent from 'react-native-modal';
import { ActivityIndicator, ProgressBar } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Box, Button, Icons, Text, TitleText } from '~/components';
import { ChallengeAdministrationRouteList } from '../../Challenge.Administration.routes';
import {
  useUpdateSubscriptionMutation,
  useMarkSubscriptionAsWithdrawnMutation,
} from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { UpdateSubscriptionResponse } from '~/generated/graphql';
import { lightTheme } from '~/global/themes';

type ChallengeDescriptionRouteProp = RouteProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.QrCode'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  ChallengeAdministrationRouteList,
  'Challenge.Administration.QrCode'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

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

export default function ChallengeAdministrationQrCode({
  route,
  navigation,
}: Props): JSX.Element {
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [modalJumpState, setModalJumpState] = useState(false);
  const [
    modalInformations,
    setModalInformations,
  ] = useState<UpdateSubscriptionResponse>();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(true);
  const scanner = useRef<QRCodeScanner>(null);
  const { userID } = useUserToken();
  const [
    markSubscriptionAsWithdrawnMutation,
  ] = useMarkSubscriptionAsWithdrawnMutation({
    onCompleted: (e) => {
      setMessage('Entrega realizada com sucesso!');
      setLoading(false);
    },
    onError: (e) => {
      setMessage('Houve um erro durante a entrega do kit!');
      setLoading(false);
    },
  });

  const updateUserSubscription = async () => {
    setLoading(true);
    setLoadingModal(true);
    await markSubscriptionAsWithdrawnMutation({
      variables: {
        data: {
          challenge_id: String(route.params.challenge_id),
          subscription_user_id: String(route.params.user_id),
          user_id_who_marked_the_withdraw: String(userID),
        },
      },
    });
  };

  const onSuccess = (e) => {
    if (route.params.type === 'Product') {
      navigation.navigate('Challenge.Administration.UserAssociation', {
        ...route.params,
        id_to_associate: e.data,
      });
      // Alert.alert(
      //   'Continuar?',
      //   `Deseja associar a identificação ${e.data} ao atleta?`,
      //   [
      //     {
      //       text: 'Sim, confirmar!',
      //       onPress: () => {
      //         updateUserSubscription(e.data);
      //       },
      //     },
      //     {
      //       text: 'Cancelar',
      //     },
      //   ],
      // );
    } else {
      navigation.navigate('Challenge.Administration.UserInformation', {
        ...route.params,
        subscription_id: e.data,
      });
    }
  };

  function shouldRenderBottom() {
    if (route.params.type === 'Product') {
      return (
        <View
          style={{ paddingBottom: 16, paddingHorizontal: 16, width: '100%' }}
        >
          <TouchableOpacity
            onPress={() => {
              setModalJumpState(true);
            }}
          >
            <Box
              borderColor={lightTheme.colors.semantic.red}
              borderWidth={1}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              py={2}
              borderRadius={8}
            >
              <Icons
                name="bag"
                color={lightTheme.colors.semantic.red}
                style={{ marginRight: 12 }}
              />

              <Text style={{ color: lightTheme.colors.semantic.red }}>
                Pular identificação
              </Text>
            </Box>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Box paddingBottom={3} px={3} width={1}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Challenge.Administration.ListUsers', {
              ...route.params,
              findUserSubscription: true,
            });
          }}
        >
          <Box
            flexDirection="row"
            alignItems="center"
            borderWidth="1"
            borderColor="#4595EC"
            borderRadius={8}
            alignItems="center"
            justifyContent="center"
            paddingVertical={14}
          >
            <Icons name="search" color="#4595EC" style={{ marginRight: 12 }} />
            <Text style={{ color: '#4595EC' }}>Buscar atleta manualmente</Text>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (scanner.current) {
        scanner.current.reactivate();
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <QRCodeScanner
        showMarker
        ref={scanner}
        cameraStyle={{
          height: heightPercentageToDP('80'),
          marginTop: -20,
          marginBottom: -40,
        }}
        topViewStyle={{
          maxHeight: 80,
          paddingTop: 20,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          zIndex: 2,
          elevation: 1,
        }}
        bottomViewStyle={{
          height: 100,
          position: 'absolute',
          bottom: 0,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          zIndex: 2,
          elevation: 1,
        }}
        onRead={(e) => onSuccess(e)}
        topContent={(
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            width={1}
            px={16}
          >
            <TouchableOpacity
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Icons name="arrow-left" />
            </TouchableOpacity>
            <TitleText style={{ fontSize: 20 }}>{route.params.title}</TitleText>
            <View style={{ width: 20 }} />
          </Box>
        )}
        bottomContent={shouldRenderBottom()}
      />

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
        {modalState && modalInformations ? (
          <ModalContentContainer>
            <Box mb={2} alignItems="flex-end" width="100%">
              <TouchableOpacity
                onPress={() => setModalState(false)}
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
              {modalInformations.status === 'failed'
                ? 'Tivemos um problema'
                : null}
            </Text>

            <Box marginVertical={20} alignItems="center">
              <Text style={{ textAlign: 'center' }}>
                {modalInformations.message}
              </Text>

              <Text style={{ marginTop: 10 }}>
                Atleta: {modalInformations.subscription.user.firstname}{' '}
                {modalInformations.subscription.user.lastname}
              </Text>
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
                  if (modalInformations.status === 'failed') {
                    setModalState(false);
                    scanner.current.reactivate();
                  } else {
                    navigation.navigate('Challenge.Administration.Menu');
                  }
                }}
              >
                <Icons
                  name="check"
                  color={lightTheme.colors.textWhite}
                  style={{ marginRight: 12 }}
                />
                <Text style={{ color: lightTheme.colors.textWhite }}>
                  Concluido
                </Text>
              </TouchableOpacity>
              {/* <Button
                name="Copiar"
                onPress={() => {
                  Clipboard.setString(String(lastPayment.payment.pix_qrcode));
                  Toast.show('Pix copiado com sucesso!', Toast.LONG);
                }}
              /> */}
            </Box>
          </ModalContentContainer>
        ) : null}
      </ModalComponent>

      <ModalComponent
        isVisible={modalJumpState}
        onBackdropPress={() => {
          setModalJumpState(false);
        }}
        // backdropColor="#FFF"
        useNativeDriver
        backdropTransitionOutTiming={0}
        useNativeDriverForBackdrop
        style={{ alignItems: 'center' }}
      >
        {modalJumpState ? (
          <ModalContentContainer
            style={{ paddingHorizontal: 24, width: widthPercentageToDP('80s') }}
          >
            <Box alignItems="flex-start" width="100%">
              <Text
                style={{
                  fontFamily: 'NeuzeitGro-Bol',
                  fontSize: 20,
                  lineHeight: 20,
                  textAlign: 'left',
                }}
              >
                Pular Identificação do Atleta?
              </Text>
            </Box>

            <Box marginVertical={20} alignItems="flex-start">
              <Text style={{ textAlign: 'left' }}>
                Se pular a identificação não teremos como identificar a passagem
                do atleta nos pontos de apoio.
              </Text>
            </Box>

            <Box
              width={1}
              flexDirection="row"
              width="100%"
              justifyContent="space-between"
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 13,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                }}
                onPress={() => {
                  setModalJumpState(false);
                }}
              >
                <Icons
                  name="close"
                  color={lightTheme.colors.text}
                  style={{ marginRight: 12 }}
                  height={8}
                  width={8}
                />
                <Text style={{ color: lightTheme.colors.text }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: lightTheme.colors.semantic.red,
                  paddingVertical: 13,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  marginLeft: 32,
                  width: 120,
                }}
                onPress={() => {
                  updateUserSubscription();
                  setModalJumpState(false);
                }}
              >
                <Text style={{ color: lightTheme.colors.textWhite }}>
                  Pular
                </Text>
              </TouchableOpacity>
            </Box>
          </ModalContentContainer>
        ) : null}
      </ModalComponent>

      <ModalComponent
        isVisible={loadingModal}
        onBackdropPress={() => {}}
        // backdropColor="#FFF"
        useNativeDriver
        backdropTransitionOutTiming={0}
        useNativeDriverForBackdrop
        style={{ alignItems: 'center' }}
      >
        {loadingModal && loading ? (
          <ModalContentContainer
            style={{
              paddingHorizontal: 24,
              paddingBottom: 14,
              width: widthPercentageToDP('80'),
            }}
          >
            <ActivityIndicator size="large" color="#0564FF" />
          </ModalContentContainer>
        ) : null}
        {loadingModal && !loading ? (
          <ModalContentContainer
            style={{
              paddingHorizontal: 24,
              paddingBottom: 14,
              width: widthPercentageToDP('80'),
            }}
          >
            <Box marginVertical={0} alignItems="center">
              <Text style={{ textAlign: 'center' }}>{message}</Text>
            </Box>

            <Box width={1} mt={32}>
              <TouchableOpacity
                style={{
                  backgroundColor: lightTheme.colors.accent.green,
                  paddingVertical: 12,
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
                onPress={() => {
                  if (modalState) {
                    setModalState(false);
                  }
                }}
              >
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icons
                    name="check"
                    color={lightTheme.colors.textWhite}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={{ color: lightTheme.colors.textWhite }}>
                    Concluido
                  </Text>
                </Box>

                <Animatable.View
                  onAnimationEnd={() => {
                    navigation.navigate('Challenge.Administration.QrCode', {
                      title: 'Inscrição Atleta',
                      type: 'Subscription',
                    });
                    // saveMonitorLocal(readInformation);
                    // scanner.current?.reactivate();
                  }}
                  animation={{
                    from: {
                      width: 0,
                    },
                    to: {
                      width: widthPercentageToDP('68'),
                    },
                  }}
                  duration={7000}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                  }}
                >
                  <ProgressBar
                    progress={1}
                    color={lightTheme.colors.accent.lightGreen}
                    style={{
                      width: widthPercentageToDP('68'),
                      height: 5,
                    }}
                  />
                </Animatable.View>
              </TouchableOpacity>
              {/* <Button
                name="Copiar"
                onPress={() => {
                  Clipboard.setString(String(lastPayment.payment.pix_qrcode));
                  Toast.show('Pix copiado com sucesso!', Toast.LONG);
                }}
              /> */}
            </Box>
          </ModalContentContainer>
        ) : null}
      </ModalComponent>
    </>
  );
}
