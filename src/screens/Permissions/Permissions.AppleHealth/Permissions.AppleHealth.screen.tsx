import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppleHealthKit from 'rn-apple-healthkit';
import AssetImage from '../assets/health.svg';
import { Icons, SafeAreaView, TitleText, Text } from '~/components';
import { useAppleHealthActivities } from '~/hooks';

export const HeaderContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  flex-direction: row;
  margin-top: 10px;
`;
export const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
export const HeaderText = styled(TitleText)`
  font-size: 20px;
  margin-left: 12px;
`;

export const Content = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  align-items: center;
`;

export const ButtonGreen = styled.TouchableOpacity`
  background-color: #a9cb00;
  flex-direction: row;
  align-items: center;
  padding: 13px 33px;
  border-radius: 40px;
  margin-bottom: 16px;
`;
export const ButtonGreenText = styled(TitleText)`
  color: ${({ theme }) => theme.colors.textWhite};
  margin-left: 12px;
`;

export const WhiteButton = styled.TouchableOpacity`
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  padding: 13px 33px;
  border-radius: 40px;
  box-shadow: 0px 0px 56px rgba(0, 33, 88, 0.05);
  elevation: 1;
  margin-bottom: 40px;
`;
export const WhiteButtonText = styled(Text)`
  color: ${({ theme }) => theme.colors.blue};
`;

const PermissionAppleHealth: React.FC = () => {
  const {
    getActivities,
    loading,
    success,
    connected,
  } = useAppleHealthActivities();
  const navigation = useNavigation();
  const calledGoBack = useRef(false);
  const handlePermission = async () => {
    if (getActivities) {
      getActivities();
    }
  };
  React.useEffect(() => {
    // handlePermission();
    console.log(`connected : ${connected}`);
    if (connected && calledGoBack.current === false) {
      calledGoBack.current = true;
      navigation.goBack();
    }
  }, [connected, success, loading]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <HeaderContainer>
        {/* <BackButton
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Icons name="arrow-left" />
          <HeaderText style={{ fontSize: 20 }}>Voltar</HeaderText>
        </BackButton> */}
      </HeaderContainer>
      <Content>
        <AssetImage />
        <TitleText style={{ marginTop: 31 }}>
          Permissão do Apple Saúde
        </TitleText>
        <Text style={{ textAlign: 'center', marginTop: 16 }}>
          Se você já usa o Apple Health, podemos buscar suas atividades,
          facilitando ainda mais a sua vida, mas para isso, precisamos da sua
          permissão.
        </Text>
      </Content>
      <Content>
        <ButtonGreen
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          activeOpacity={0.7}
          onPress={() => {
            handlePermission();
            // setTimeout(() => {
            //   navigation.goBack();
            // }, 1000);
          }}
        >
          <Icons name="done" color="#FFF" />
          <ButtonGreenText>Continuar</ButtonGreenText>
        </ButtonGreen>
        {/* <WhiteButton
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <WhiteButtonText>Deixar para depois</WhiteButtonText>
        </WhiteButton> */}
      </Content>
    </SafeAreaView>
  );
};

export default PermissionAppleHealth;
