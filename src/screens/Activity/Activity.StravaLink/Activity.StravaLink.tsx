import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import { Formik } from 'formik';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import { PUBLIC_STORAGE } from '@env';
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';

import iframe from '@native-html/iframe-plugin';
import {
  useGetUserDataFromCrawledActivityLazyQuery,
  useCreateActivityFromCrawlerMutation,
} from '~/graphql/autogenerate/hooks';
import {
  TitleText,
  SafeAreaView,
  Icons,
  Text,
  Button,
  SnackBar,
} from '~/components';
import { TypeSnackBar } from '~/components/Snackbar';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { RootStackParamList } from '~/routes';

export const Container = styled(SafeAreaView)`
  flex: 1;
`;
export const HeaderContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  margin-top: 18px;
  margin-bottom: 24px;
  justify-content: space-between;
  width: 100%;
`;
export const HeaderButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const HeaderText = styled(TitleText)`
  margin-left: 12px;
`;
export const FooterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 25px;
  border-radius: 40px;
  background-color: #fff;
  shadow-color: rgba(5, 100, 255, 0.2);
  shadow-offset: 0px 3px;
  shadow-opacity: 0.58px;
  shadow-radius: 16px;
  margin-bottom: 60px;
`;
export const FooterContainer = styled.View`
  align-items: center;
  margin-top: 50px;
`;
export const FooterText = styled(Text)`
  color: ${({ theme }) => theme.colors.blue};
  margin-left: 8px;
`;
export const WrapperContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  margin-top: 100px;
`;
export const LinkContainer = styled.View``;
export const TitleContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
export const Input = styled.TextInput`
  padding: 21px 9px;
  border-width: 1px;
  border-color: rgba(216, 216, 216, 0.5);
  border-radius: 12px;
  margin-top: 10px;
  box-shadow: 0px 0px 56px rgba(0, 33, 88, 0.05);

  elevation: 1;
`;
export const ChallengeContainer = styled.View`
  margin-top: 26px;
  flex-direction: column;
  align-items: flex-start;
`;
export const UserAvatar = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 27px;
`;
export const UserName = styled(TitleText)`
  font-size: 18px;
  margin-left: 8px;
  line-height: 24px;
`;
export const UserActivity = styled(TitleText)`
  font-size: 14px;
  margin-left: 8px;
  line-height: 16.1px;
`;
export const UserInfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const InfoContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;
export const InfoElementContainer = styled.View`
  margin-left: 8px;
`;
export const TitleElement = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  font-size: 16px;
  line-height: 18.4px;
  margin-bottom: 2px;
`;
export const ParagraphElement = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  font-size: 16px;
  line-height: 18.4px;
`;
export const InfoWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-top: 40px;
`;
export const ActionContainer = styled.View`
  margin-top: 48px;
  align-items: center;
  width: 100%;
`;
export const CancelButton = styled.TouchableOpacity`
  padding: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.text};
  width: 120px;
  height: 48px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  margin-left: 8px;
`;
export const CancelText = styled(Text)``;
export const ActionContainerWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const ModalContainer = styled.View`
  background: ${({ theme }) => theme.colors.backgroundWhite};
  flex: 1;
  align-items: center;
  max-height: 77.6%;
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'Activity.StravaLink'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};

const ActivityStravaLink: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const [yesLoading, setYesLoading] = React.useState(false);
  const scrollView = useRef<ScrollView>();
  const [modalState, setModalState] = React.useState(false);
  const [cancel, setCancel] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [typeSnack, setTypeSnack] = React.useState<TypeSnackBar>('warning');
  const [snackBarMessage, setSnackBarMessage] = React.useState<string>('');
  const [showVideoOnAndroid, setShowVideoOnAndroid] = React.useState<boolean>(
    false,
  );
  const videoAndroidRef = useRef<Video>(null);
  const toggleModal = () => {
    setModalState(!modalState);
  };
  const [
    getActivityCrawled,
    { data, loading },
  ] = useGetUserDataFromCrawledActivityLazyQuery({
    onError: (e) => {
      setSnackBarMessage(e.message);
      setTypeSnack('error');
      setShowSnackBar(true);
      setTimeout(() => {
        setShowSnackBar(false);
      }, 4000);
    },
    onCompleted: () => {
      scrollView?.current?.scrollTo({ x: 0, y: 200, animated: true });
    },
    fetchPolicy: 'network-only',
  });
  const [
    createActivityFromCrawlerMutation,
  ] = useCreateActivityFromCrawlerMutation({
    onCompleted: (e) => {
      setSnackBarMessage(e.createActivityFromCrawler.message);
      setTypeSnack('success');
      setShowSnackBar(true);
      setTimeout(() => {
        setShowSnackBar(false);
      }, 4000);
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    },
    onError: (e) => {
      setYesLoading(false);
      setSnackBarMessage(e.message);
      setTypeSnack('error');
      setShowSnackBar(true);
      setTimeout(() => {
        setShowSnackBar(false);
      }, 4000);
    },
  });

  const fetchCopiedText = async (setFieldValue) => {
    const text = await Clipboard.getString();
    const matches = text.match(/\bhttps?:\/\/\S+/gi);
    if (matches) setFieldValue('url', matches[0]);
    // setValue(text);
  };

  const LoadingComponent = () => {
    const [canShow, setCanShow] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setCanShow(true);
      }, 1000);
    }, []);
    const LoadingLocal = () => (
      <Text style={{ textAlign: 'center', marginTop: 15 }}>
        Estamos com uma instabilidade na conexão com o Strava... Isso pode levar
        alguns minutos.
      </Text>
    );
    return (
      <View
        style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}
      >
        <ActivityIndicator size="large" color="#0564FF" />
        {canShow ? <LoadingLocal /> : null}
      </View>
    );
  };

  const handleSubmitUrl = async (values) => {
    const parsedURL = values.url.match(/\bhttps?:\/\/\S+/gi);
    if (parsedURL) {
      await getActivityCrawled({
        variables: {
          url: parsedURL[0],
        },
      });
      if (!loading) {
        setCancel(false);
      }
    }
  };
  function handleURL(URL) {
    const cleanURl = URL.match(/\bhttps?:\/\/\S+/gi);
    if (cleanURl) {
      return cleanURl[0];
    }
    return URL;
  }
  const createAcitivity = async (activityKey: string) => {
    setYesLoading(true);

    const { data: acitivityPayload } = await createActivityFromCrawlerMutation({
      variables: {
        activityKey,
      },
    });
    if (acitivityPayload?.createActivityFromCrawler) {
      setYesLoading(false);
    }
  };
  async function handleURI(uri: string): Promise<void> {
    await getActivityCrawled({
      variables: {
        url: uri,
      },
    });
    // if (!loading) {
    //   setCancel(false);
    //   // if (data?.getUserDataFromCrawledActivity) {
    //   //   scrollView?.current?.scrollTo({
    //   //     x: 0,
    //   //     y: 200,
    //   //     animated: true,
    //   //   });
    //   // }
    // }
  }
  React.useEffect(() => {
    if (route.params?.link) {
      handleURI(route.params.link);
    }
  }, [route]);

  return (
    <Container>
      <HeaderContainer>
        <HeaderButton onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" />
          <HeaderText>Importação manual</HeaderText>
          <View style={{ width: 20 }} />
        </HeaderButton>
      </HeaderContainer>
      <SnackBar
        show={showSnackBar}
        setShow={(e) => setShowSnackBar(e)}
        message={snackBarMessage}
        type={typeSnack}
      />
      <ScrollView
        ref={scrollView}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="never"
        contentContainerStyle={{
          paddingBottom: 67,
          justifyContent: 'space-between',
        }}
      >
        <Formik
          initialValues={{ url: route.params.link ?? '' }}
          onSubmit={handleSubmitUrl}
        >
          {({ handleChange, handleSubmit, values, setFieldValue }) => (
            <WrapperContainer>
              <LinkContainer>
                <TitleContainer onPress={() => fetchCopiedText(setFieldValue)}>
                  <Icons name="paste" />
                  <Text>Cole o link da sua atividade</Text>
                </TitleContainer>
                <Input
                  placeholder="Exemplo: https://www.strava.com/activities/4377374771"
                  value={values.url}
                  onChangeText={(e) => setFieldValue('url', handleURL(e))}
                  onSubmitEditing={() => handleSubmit()}
                  editable={!cancel}
                  returnKeyType="send"
                />
                <Text style={{ opacity: 0.5 }}>
                  ** Lembre-se de remover outros textos e deixar somente o link
                  do Strava.
                </Text>
                {loading && <LoadingComponent />}
                {((!loading && !data?.getUserDataFromCrawledActivity) ||
                  cancel) && (
                  <Button
                    style={{ marginTop: 50 }}
                    name="Enviar"
                    disabled={!values.url}
                    onPress={() => {
                      handleSubmit();
                      if (data?.getUserDataFromCrawledActivity) {
                        scrollView?.current?.scrollTo({
                          x: 0,
                          y: 200,
                          animated: true,
                        });
                      }
                    }}
                  />
                )}
                {!cancel && data?.getUserDataFromCrawledActivity && (
                  <ChallengeContainer>
                    <UserInfoContainer>
                      <UserAvatar
                        source={{
                          uri: data.getUserDataFromCrawledActivity.avatar,
                        }}
                      />
                      <View>
                        <UserName>
                          {data?.getUserDataFromCrawledActivity.person_name}
                        </UserName>
                      </View>
                    </UserInfoContainer>
                    <InfoWrapper style={{ alignItems: 'flex-start' }}>
                      <InfoContainer>
                        <Icons name="bike" width={20} />
                        <InfoElementContainer>
                          <TitleElement>Pedalada</TitleElement>
                          <ParagraphElement>
                            {data?.getUserDataFromCrawledActivity.name}
                          </ParagraphElement>
                        </InfoElementContainer>
                      </InfoContainer>
                    </InfoWrapper>
                    <InfoWrapper>
                      <InfoContainer>
                        <Icons name="distance" width={20} />
                        <InfoElementContainer>
                          <TitleElement>Distância</TitleElement>
                          <ParagraphElement>
                            {data?.getUserDataFromCrawledActivity.distance /
                              1000}{' '}
                            km
                          </ParagraphElement>
                        </InfoElementContainer>
                      </InfoContainer>
                      <InfoContainer>
                        <Icons name="time" width={20} />
                        <InfoElementContainer>
                          <TitleElement>Tempo</TitleElement>
                          <ParagraphElement>
                            {data?.getUserDataFromCrawledActivity.time}
                          </ParagraphElement>
                        </InfoElementContainer>
                      </InfoContainer>
                      <InfoContainer>
                        <Icons name="progress" width={20} />
                        <InfoElementContainer>
                          <TitleElement>Elevação</TitleElement>
                          <ParagraphElement>
                            {data?.getUserDataFromCrawledActivity.elevation} m
                          </ParagraphElement>
                        </InfoElementContainer>
                      </InfoContainer>
                    </InfoWrapper>
                    <InfoWrapper style={{ flexDirection: 'column' }}>
                      <InfoContainer style={{ marginBottom: 40 }}>
                        <Icons name="calendar" width={16} />
                        <InfoElementContainer>
                          <TitleElement>Data</TitleElement>
                          <ParagraphElement>
                            {data.getUserDataFromCrawledActivity.date}
                          </ParagraphElement>
                        </InfoElementContainer>
                      </InfoContainer>

                      <InfoContainer>
                        <Icons name="distance" width={20} />
                        <InfoElementContainer>
                          <TitleElement>Localização</TitleElement>
                          <ParagraphElement>
                            {data?.getUserDataFromCrawledActivity.address}
                          </ParagraphElement>
                        </InfoElementContainer>
                      </InfoContainer>
                    </InfoWrapper>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 20,
                        width: '100%',
                      }}
                    >
                      {yesLoading && <LoadingComponent />}
                    </View>

                    <ActionContainer>
                      <UserName>Esta é a sua atividade?</UserName>
                      <ActionContainerWrapper>
                        <Button
                          name="Sim"
                          style={{ width: 120 }}
                          onPress={() =>
                            createAcitivity(
                              data?.getUserDataFromCrawledActivity.key,
                            )
                          }
                        />
                        <CancelButton
                          onPress={() => {
                            setCancel(true);
                          }}
                        >
                          <CancelText>Cancelar</CancelText>
                        </CancelButton>
                      </ActionContainerWrapper>
                    </ActionContainer>
                  </ChallengeContainer>
                )}
              </LinkContainer>
            </WrapperContainer>
          )}
        </Formik>
        <FooterContainer>
          {(cancel || !data?.getUserDataFromCrawledActivity) && (
            <FooterButton
              onPress={() => toggleModal()}
              // onPress={() => navigation.navigate('StravaVideoInformation')}
            >
              <Icons name="ask" color="#0564FF" />
              <FooterText>Como encontrar este link</FooterText>
            </FooterButton>
          )}
        </FooterContainer>
      </ScrollView>
      <Modal
        isVisible={modalState}
        onBackdropPress={() => toggleModal()}
        useNativeDriver
        backdropTransitionOutTiming={0}
      >
        <ModalContainer>
          {Platform.OS === 'ios' && (
            <Video
              source={{
                uri: `${PUBLIC_STORAGE}/assets/videos/instructions_copy_link_strava_ios.mp4`,
              }} // Can be a URL or a local file.
              controls
              paused
              style={{ width: '100%', height: '100%' }}
            />
          )}
          {Platform.OS === 'android' && (
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
    </Container>
  );
};

export default ActivityStravaLink;
