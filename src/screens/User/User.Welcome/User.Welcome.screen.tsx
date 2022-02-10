import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ModalComponent from 'react-native-modal';
import { CommonActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Text, TitleText, SafeAreaView, Icons } from '~/components';
import { dbCLient, IDataCompiledSchema } from '~/db';
import Logo from './assets/riderize.svg';
import Step01 from './assets/step01.svg';
import Step02 from './assets/step02.svg';
import Step03 from './assets/step03.svg';
import Step04 from './assets/step04.svg';
import {
  GetUserDataCompiledDocument,
  useUpdateUserDataCompiledMutation,
} from '~/graphql/autogenerate/hooks';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import { useStoreActions, useStoreState } from '~/store';

export const HeaderText = styled(TitleText)`
  font-size: 24px;
  line-height: 28px;
  margin-top: 6px;
`;
export const DescriptionText = styled(Text)`
  font-size: 20px;
  line-height: 23px;
  color: rgba(22, 28, 37, 0.56);
  margin-top: 40px;
`;
export const Container = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;
export const ImageContainer = styled.View`
  align-items: center;
  margin-top: 15px;
  margin-bottom: 45px;
`;
export const ArrowButtonContainer = styled.View`
  background-color: #0564ff;
  border-radius: 100px;
  width: 56px;
  height: 56px;
  align-items: center;
  justify-content: center;
`;
export const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const HeaderContainer = styled.View`
  flex-direction: row;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  justify-content: space-between;
  margin-top: ${heightPercentageToDP('3')};
  margin-bottom: 36px;
`;
export const JumpContainer = styled.TouchableOpacity`
  width: 64px;
  height: 24px;
  opacity: 0.3;
  border-width: 1px;
  border-color: #161c25;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
`;
export const Title = styled(TitleText)`
  color: ${({ theme }) => theme.colors.blue};
  font-size: 46px;
  line-height: 55px;
`;

export const AlertContainer = styled.View`
  background-color: #fff;
  padding-vertical: 24px;
  padding-horizontal: 24px;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
`;

export const BlueButton = styled.TouchableOpacity`
  margin-right: 8px;
  width: 120px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 24px;
`;
export const GrayButton = styled.TouchableOpacity`
  width: 120px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.text};
`;

export default function UserWelcome({ route, navigation }): JSX.Element {
  const [step, setStep] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState(false);
  const saveDataCompiled = useStoreActions(
    (state) => state.compiledData.saveDataCompiled,
  );
  const compiledData = useStoreState(
    (state) => state.compiledData.dataCompiled,
  );
  const handleLocalData = async (_id: string) => {
    const realm = await dbCLient();
    saveDataCompiled({ ...compiledData, view_welcome_screen: true });
    const userLocal = realm.objectForPrimaryKey<IDataCompiledSchema>(
      'CompiledData',
      _id,
    );
    console.log(
      '🚀 ~ file: User.Welcome.screen.tsx ~ line 124 ~ handleLocalData ~ userLocal',
      userLocal,
    );
    if (userLocal) {
      realm.write(() => {
        userLocal.viewWelcomeScreen = true;
      });
    }
    // realm.close();
  };

  const [updateUserDataCompiledMutation] = useUpdateUserDataCompiledMutation({
    onError: (e) => console.log('Error in update', e.message),
    onCompleted: (e) => {
      handleLocalData(e.updateUserDataCompiled._id);
      setModalState(false);
    },
  });

  function toggleModal() {
    setModalState(!modalState);
  }

  function Header() {
    return (
      <HeaderContainer>
        {step > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setStep((prevState) => prevState - 1);
            }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 20 }} />
        )}
        <JumpContainer
          onPress={() => toggleModal()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Text>Pular</Text>
        </JumpContainer>
      </HeaderContainer>
    );
  }
  const ArrowButton = useCallback(() => {
    return (
      <ButtonContainer>
        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            if (step === 5) {
            } else {
              setStep((prevStep) => prevStep + 1);
            }
          }}
        >
          <AnimatedCircularProgress
            size={73}
            width={4}
            fill={25 * (step + 1)}
            tintColor="#0564FF"
            backgroundColor="rgba(5, 100, 255, 0.2)"
            rotation={360}
            duration={1000}
          >
            {() => (
              <ArrowButtonContainer>
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Icons name="arrow-right" color="white" />
                )}
              </ArrowButtonContainer>
            )}
          </AnimatedCircularProgress>
        </TouchableOpacity>
      </ButtonContainer>
    );
  }, [step]);

  function FirstStep() {
    return (
      <Container>
        <HeaderText>
          {`${route.params.name ? `${route.params.name}, ` : ''}`} bem-vindo ao
        </HeaderText>
        <Logo style={{ marginTop: 15 }} />
        <DescriptionText>
          Este é um app destinado para aqueles ciclistas que buscam superar
          desafios pedalando em qualquer lugar do Brasil.
        </DescriptionText>
        <ImageContainer>
          <Step01 />
        </ImageContainer>
      </Container>
    );
  }

  function SecondStep() {
    return (
      <Container>
        <HeaderText>Participe de desafios virtuais</HeaderText>
        <Title>GRATUITOS</Title>
        <DescriptionText>
          Participe de vários desafios gratuitos e ao concluí-los, tenha a
          chance de concorrer à prêmios de marcas que você curte.
        </DescriptionText>
        <ImageContainer>
          <Step02 />
        </ImageContainer>
      </Container>
    );
  }

  function ThirdStep() {
    return (
      <Container>
        <HeaderText>E também de eventos</HeaderText>
        <Title>PRESENCIAIS</Title>
        <DescriptionText>
          Você poderá sentir todas as emoções de participar de uma prova local.
          Faça tudo dentro do app, desde inscrição à consulta de rotas.
        </DescriptionText>
        <ImageContainer>
          <Step03 />
        </ImageContainer>
      </Container>
    );
  }

  function FourtyStep() {
    return (
      <Container>
        <HeaderText>Pedale e concorra a </HeaderText>
        <Title>PRÊMIOS</Title>
        <DescriptionText>
          Ao concluir os desafios gratuitos, você ganha a chance de ser sorteado
          e levar prêmios incríveis para casa.
        </DescriptionText>
        <ImageContainer>
          <Step04 />
        </ImageContainer>
      </Container>
    );
  }

  function LastAnimation() {
    return (
      <LottieView
        source={require('./assets/tutorial.json')}
        autoPlay
        onAnimationFinish={() => {
          setLoading(true);
          updateUserDataCompiledMutation({
            variables: {
              data: {
                view_welcome_screen: true,
              },
            },
            awaitRefetchQueries: true,
            refetchQueries: [
              {
                query: GetUserDataCompiledDocument,
              },
            ],
          });
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'Home', params: { accepted_initial_screen: true } },
              ],
            }),
          );
        }}
        loop={false}
        style={{
          width: widthPercentageToDP('100'),
          minHeight: heightPercentageToDP('100'),
        }}
      />
    );
  }

  function handlerSteps() {
    switch (step) {
      case 0:
        return <FirstStep />;
      case 1:
        return <SecondStep />;
      case 2:
        return <ThirdStep />;
      case 3:
        return <FourtyStep />;
      default:
        return null;
    }
  }

  if (step <= 3) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {step <= 3 && <Header />}
        {handlerSteps()}
        {step <= 3 && <ArrowButton />}

        <ModalComponent
          isVisible={modalState}
          onBackdropPress={() => toggleModal()}
          backdropColor="#FFF"
          useNativeDriver
          backdropTransitionOutTiming={0}
        >
          <View style={{ paddingHorizontal: 24 }}>
            <AlertContainer>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginBottom: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => toggleModal()}
                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                >
                  <Icons name="close" />
                </TouchableOpacity>
              </View>
              <Text style={{ marginBottom: 8, fontFamily: 'NeuzeitGro-Bol' }}>
                Pular Tutorial?
              </Text>
              <Text>Você pode vê-lo novamente acessando as configurações.</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 24,
                }}
              >
                <BlueButton
                  disabled={loading}
                  onPress={() => {
                    setStep(4);
                  }}
                >
                  <Text style={{ color: 'white' }}>Sim, pular</Text>
                </BlueButton>

                <GrayButton onPress={() => toggleModal()}>
                  <Text>Cancel</Text>
                </GrayButton>
              </View>
            </AlertContainer>
          </View>
        </ModalComponent>
      </SafeAreaView>
    );
  }
  return <LastAnimation />;
}
