import { RouteProp, useNavigation, useNavigationState } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from 'react';
import { Linking, TouchableOpacity, AppState, Platform, Image, TouchableHighlight } from "react-native";
import styled from 'styled-components/native';
import { Icons, SafeAreaView as View, Text, SmallText, SnackBar } from "~/components";
import { useAppleHealthPermissions, useDataCompiled, useUserInfo } from "~/hooks";
import { StackActions } from '@react-navigation/native';
import { RootStackParamList } from '~/routes.types';
import healthImage from '~/assets/ChallengeSubscribedAssets/health.png';
import { TypeSnackBar } from "~/components/Snackbar";
import branch from "react-native-branch";
import Video from 'react-native-video';
import stravaVideoImage from '~/assets/SpecificMonitorHelp/strava-import.jpg'
import Modal from "react-native-modal";
import { PUBLIC_STORAGE } from '@env';
import { heightPercentageToDP, widthPercentageToDP } from "~/helpers/convertPixelToDP";
import { Content, WhiteButton, WhiteButtonText } from "~/screens/Permissions/Permissions.Notifications";
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';

import iframe from '@native-html/iframe-plugin'

export const SafeAreaView = styled(View)`
  flex: 1;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 16px 0 16px;
`;

export const Container = styled.ScrollView`

`;
export const MonitorImage = styled.Image`
  width: 112px;
  height: 112px;
  border-radius: 16px;
`;
export const MonitorImageContainer = styled.View`
  width: 112px;
  height: 112px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;

  shadow-color: rgba(5, 100, 255, 0.2);
  shadow-offset: 0px 3px;
  shadow-opacity: 0.58px;
  shadow-radius: 16px;

  elevation: 7;
`;
export const MonitorContainer = styled.TouchableOpacity`
  align-items: center;
`;
export const MonitorName = styled(Text)`
  font-size: 20px;
`;
export const ConnectedText = styled(SmallText)`
  color: ${({ theme }) => theme.colors.accent.lightGreen};
  font-size: 12px;
`;
export const LastUploadTitle = styled(Text)`
  opacity: 0.56px;
  text-align: center;
  font-size: 16px;
  margin-top: 33px;
  font-size: 20px;
`;
export const LastUploadDate = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  text-align: center;
  font-size: 20px;
`;
export const Title = styled(Text)`
  margin-top: 64px;
  font-family: ${({ theme }) => theme.fontFamily.bold};
  font-size: 20px;
`;
export const Descrition = styled(Text)`
  margin-vertical: 10px;
`;
export const DescritionBold = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const DisconnectContainer = styled.TouchableOpacity`
  shadow-color: rgba(5, 100, 255, 0.2);
  shadow-offset: 0px 3px;
  shadow-opacity: 0.58px;
  shadow-radius: 16px;
  elevation: 7;
  padding: 13px;
  background-color: #fff;
  border-radius: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 147px;
  margin-top: 40px;
`;
export const DisconnectText = styled(Text)`
  color: ${({ theme }) => theme.colors.semantic.green};
  margin-left: 14px;
`;
export const DescriptionContainer = styled.View`
  margin-top: 33px;
`;
export const ConnectButton = styled.TouchableOpacity`
  padding: 11px 25px;
  border-width: 0.5px;
  border-color: ${({ theme }) => theme.colors.text};
  margin-vertical: 20px;
  border-radius:22px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const ConnectButtonImage = styled.Image`
  width: 25px;
  height: 25px;
  border-radius: 16px;
`;
export const ConnectImageContainer = styled.View`
  width: 25px;
  height: 25px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;

  shadow-color: rgba(5, 100, 255, 0.2);
  shadow-offset: 0px 3px;
  shadow-opacity: 0.58px;
  shadow-radius: 16px;

  elevation: 7;
`;
export const ConnectText = styled(Text)`
  margin-left: 15px;
  margin-bottom: -5px;
`;
export const ModalContainer = styled.View`
  background: ${({ theme }) => theme.colors.backgroundWhite};
  flex: 1;
  align-items: center;
  max-height: 77.6%;
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'User.SpecificMonitorHelp'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};

const UserSpecificMonitorHelp: React.FC<Props> = ({ route }) => {
  const appState = useRef(AppState.currentState);
  const videoPlayer = useRef<Video>();
  const [modalState, setModalState] = React.useState(false);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const navigation = useNavigation();
  const { data, refetch } = useDataCompiled();
  const { getPermission, status } = useAppleHealthPermissions();
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
  const navigationState = useNavigationState(state => state);


  const toggleModal = () => {
    setModalState(!modalState);
  };

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      refetch();


    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };



  React.useEffect(() => {
    if (status === "SharingAuthorized" && route.params.id === "health") {
      setSnackBarMessage('Conectado com sucesso!');
      setTypeSnack('success');
      setShowSnackBar(true);
      // setTimeout(() => {
      //   navigation.goBack();
      // }, 2000)

    }
  }, [status])

  React.useEffect(() => {
    branch.subscribe(({ error, params, uri }) => {
      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link'];
        // Route non-Branch URL if appropriate.
        const removedPrefix = nonBranchUrl.split('com.riderize://');
        if (removedPrefix[1] === 'garmin/success') {
          setSnackBarMessage('Conectado com sucesso!');
          setTypeSnack('success');
          setShowSnackBar(true);
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        } else if (removedPrefix[1] === 'garmin/error') {
          setSnackBarMessage('Houve um erro na conexão, tente novamente!');
          setTypeSnack('error');
          setShowSnackBar(true);
          setTimeout(() => {
            setShowSnackBar(false);
          }, 1000);
        } else if (removedPrefix[1] === 'polar/error') {
          setSnackBarMessage('Houve um erro na conexão, tente novamente!');
          setTypeSnack('error');
          setShowSnackBar(true);
          setTimeout(() => {
            setShowSnackBar(false);
          }, 1000);
        } else if (removedPrefix[1] === 'garmin/success') {
          setSnackBarMessage('Conectado com sucesso!');
          setTypeSnack('success');
          setShowSnackBar(true);
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        }
        if (removedPrefix === '') console.log(`non Branch >>>${nonBranchUrl}`);
      }
    });
  }, [appState]);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
  return (
    <SafeAreaView>
      <Header>
        <TouchableOpacity
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
      </Header>
      <SnackBar
        show={showSnackBar}
        setShow={(e) => setShowSnackBar(e)}
        message={snackBarMessage}
        type={typeSnack}
      />
      <Container
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 40,
        }}>
        <MonitorContainer>
          <MonitorImageContainer>
            <MonitorImage source={route.params.image} resizeMethod="scale" resizeMode="contain" />
          </MonitorImageContainer>
          <MonitorName>{route.params.name}</MonitorName>
        </MonitorContainer>
        {route.params.id === "health" && (
          <DescriptionContainer>
            <Descrition>
              Se conectar via o Apple Saúde é uma ótima forma de enviar suas
              pedaladas automaticamente. Você só precisa autorizar o Riderize em
              seu iPhone:
              </Descrition>
            <ConnectButton onPress={() => {
              if (status === "SharingAuthorized") {
                setSnackBarMessage('Conectado com sucesso!');
                setTypeSnack('success');
                setShowSnackBar(true);
              } else if (status === "SharingDenied") {
                Linking.openURL('App-Prefs:HealthKit');
              }
              if (getPermission && status) {
                console.log(status)
                getPermission()
              }
            }}>
              <ConnectButtonImage source={healthImage} />
              <ConnectText>Conectar com o Apple Saúde</ConnectText>
            </ConnectButton>
            <Descrition>
              <DescritionBold>Importante:</DescritionBold> Se você usa o Strava pode conectar ele ao Apple Saúde, que nos envia automaticamente suas atividades. Siga estes passos para conectar o Strava ao Apple Saúde:
              </Descrition>
            <Descrition>
              1. Abra o Strava e vá em Perfil > Configurações > Aplicativos, Serviços e Dispositivos > Saúde (Conectar com o Saúde)
              </Descrition>
            <Descrition>
              2. Dê as permissões e pronto, suas atividades serão enviadas ao Apple Saúde, que depois nos enviará as novas atividades automaticamente.
              </Descrition>
          </DescriptionContainer>

        )}
        {route.params.id === "strava" && Platform.OS === "ios" && (
          <>
            <DescriptionContainer>
              <Descrition>
                É possível usar sua atividade do Strava para participar dos Desafios. Para fazer isso temos que validar sua atividade através do Link Público que está disponível na internet. Os passos são simples:
                </Descrition>

              <Descrition>
                1. No iOS entre no Strava, encontre sua Atividade (Pedalada) e toque no botão de compartilhar.
                </Descrition>
              <Descrition>
                2. Procure o botão de “Copiar”. (Essa opção irá copiar o Link Público da sua atividade)
                Agora abra o Riderize e encontre o Desafio que está participando.
                </Descrition>
              <Descrition>3. Agora abra o Riderize e encontre o Desafio que está participando.</Descrition>
              <Descrition>
                4. Vá em “Enviar manualmente uma atividade”.
                </Descrition>
              <Descrition>
                5. Escolha a opção de “Enviar um Link do Strava” e cole o link copiado.
                </Descrition>
              <Descrition>
                <DescritionBold>Importante:</DescritionBold> Sua atividade precisa estar como Pública para que possamos avaliar e considerar para os Desafios.
                </Descrition>
            </DescriptionContainer>
            <TouchableOpacity onPress={() => toggleModal()}>
              <Image source={stravaVideoImage} resizeMethod="scale" resizeMode={"stretch"} />
            </TouchableOpacity>



          </>
        )}
        {route.params.id === "strava" && Platform.OS === "android" && (
          <>
            <DescriptionContainer>
              <Descrition>
                É possível usar sua atividade do Strava para participar dos Desafios. Para fazer isso temos que validar sua atividade através do Link Público que está disponível na internet. Os passos são simples:
                </Descrition>

              <Descrition>
                1. No Android entre no Strava, encontre sua Atividade (Pedalada) e toque no botão de compartilhar.
                </Descrition>
              <Descrition>
                2. Toque no botão “Mais” e depois em “Copiar para a área de transferência”. (Essa opção irá copiar o Link Público da sua atividade). Em seguida abra o Riderize e encontre o Desafio que está participando.
                </Descrition>
              <Descrition>
                3. Vá em “Enviar manualmente uma atividade”.
                </Descrition>
              <Descrition>
                4. Escolha a opção de “Enviar um Link do Strava” e cole o link copiado.
                </Descrition>
              <Descrition>
                <DescritionBold>Importante:</DescritionBold> Sua atividade precisa estar como Pública para que possamos avaliar e considerar para os Desafios.
                </Descrition>
            </DescriptionContainer>
            <TouchableOpacity onPress={() => toggleModal()}>
              <Image source={stravaVideoImage} resizeMethod="scale" resizeMode={"stretch"} />
            </TouchableOpacity>
          </>
        )}
        {route.params.id === "gpx" && (
          <DescriptionContainer>
            <Descrition>
              Você pode usar um Arquivo GPX para participar dos Desafios. Depois de fazer sua pedalada enviar ele é muito simples:
              </Descrition>

            <Descrition>
              1. Baixe o arquivo do aplicativo ou dispositivo que usa para gravar suas pedaladas..
              </Descrition>
            <Descrition>
              2. Entre no Desafio que você está inscrito aqui no App.
              </Descrition>
            <Descrition>3. Vá em "Atualizar pedaladas manualmente".</Descrition>
            <Descrition>
              4. Procure o arquivo GPX e envie para nós.
              </Descrition>
          </DescriptionContainer>
        )}
        {route.params.id !== "health" && (
          <View style={{ alignItems: 'center' }}>
            <DisconnectContainer
              onPress={() => {
                if (navigationState.index > 2) {
                  navigation.dispatch(StackActions.pop(2))
                } else {
                  navigation.dispatch(StackActions.pop(1))
                }

                // navigation.reset({ index: 0, routes: [{ name: 'Home' }, {name: 'Challenge.Description', params: {challenge_id: route.params.challenge_id}}] });
              }}
            >
              <Icons name="done" color="#A9CB00" />
              <DisconnectText>Entendi</DisconnectText>
            </DisconnectContainer>
          </View>
        )}
        {route.params.id === "health" && (
          <View style={{ alignItems: 'center' }}>
            <WhiteButton
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              onPress={() => {
                if (navigationState.index > 2) {
                  navigation.dispatch(StackActions.pop(2))
                } else {
                  navigation.dispatch(StackActions.pop(1))
                }

                // navigation.reset({ index: 0, routes: [{ name: 'Home' }, {name: 'Challenge.Description', params: {challenge_id: route.params.challenge_id}}] });
              }}
              activeOpacity={0.7}
            >
              <WhiteButtonText>Farei isso depois</WhiteButtonText>
            </WhiteButton>
          </View>
        )}

      </Container>
      <Modal
        isVisible={modalState}
        onBackdropPress={() => toggleModal()}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <ModalContainer>
          {route.params.id === "strava" && Platform.OS === "ios" && (
            <Video
              source={{ uri: PUBLIC_STORAGE + "/assets/videos/instructions_copy_link_strava_ios.mp4" }}   // Can be a URL or a local file.
              onLoadStart={(e) => console.log(e)}
              controls
              paused
              style={{ width: "100%", height: "100%" }}
              onBuffer={(e => console.log(e))}
              onError={(e) => console.log(e)}
            />
          )}
          {route.params.id === "strava" && Platform.OS === "android" && (
            <HTML
              renderers={{ iframe }}
              WebView={WebView}
              source={{
                html: `<iframe width="${widthPercentageToDP(
                  '100',
                )}" height="${heightPercentageToDP(
                  '77.7',
                )}" src="https://www.youtube.com/embed/mcYivPkdMNM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`,
              }}
            // staticContentMaxWidth={widthPercentageToDP('100')}
            />
          )}

        </ModalContainer>
      </Modal>
    </SafeAreaView>
  );
};

export default UserSpecificMonitorHelp;
