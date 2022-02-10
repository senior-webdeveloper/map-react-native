import React from 'react';
import styled from 'styled-components/native';
import { PERMISSIONS, request } from 'react-native-permissions';
import { Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AssetImage from '../assets/write.svg';
import { Icons, SafeAreaView, TitleText, Text } from '~/components';
import { useStoreActions } from '~/store';

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

const PermissionWrite: React.FC = () => {
  const navigation = useNavigation();
  const changePermissionStore = useStoreActions(
    (actions) => actions.userInfoCompiled.changePermission,
  );
  const handlePermission = async () => {
    if (Platform.OS === 'android') {
      console.log('caiu aqui');
      const responseExternal = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      if (responseExternal) {
        changePermissionStore(true);
        setTimeout(() => {
          navigation.goBack();
        }, 300);
      }
    }
  };
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
          Permissão para salvar arquivos
        </TitleText>
        <Text style={{ textAlign: 'center', marginTop: 16 }}>
          Precisamos pedir sua permissão para baixar arquivos e poder salvar
          diretamente em seu celular.
        </Text>
      </Content>
      <Content>
        <ButtonGreen
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          activeOpacity={0.7}
          onPress={() => handlePermission()}
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

export default PermissionWrite;
