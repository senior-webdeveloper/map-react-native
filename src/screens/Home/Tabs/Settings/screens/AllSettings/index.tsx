import React from 'react';
import styled from 'styled-components/native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { APP_VERSION } from '@env';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icons, SafeAreaView, Text } from '~/components';
import { useApolloLink } from '~/hooks';

export const Container = styled.ScrollView`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  padding: 0 16px;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 54px;
  padding: 20px 24px 0 24px;
`;
export const Title = styled(Text)`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
  color: #161c25;
`;

export const Subtitle = styled(Text)`
  font-family: 'NeuzeitGro-Bol';
  font-size: 16px;
  line-height: 24px;
  margin-top: 25px;
`;
export const OptionContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #efefef;
`;
export const SelectedOptionText = styled(Text)`
  color: ${({ theme }) => theme.colors.gray};
  margin-right: 26px;
`;
export const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const FooterVersionContainer = styled.View`
  position: absolute;
  bottom: 15%;
  align-items: center;
  width: 100%;
  opacity: 0.56;
`;

export const FooterVersionText = styled(Text)`
  font-size: 14px;
  line-height: 16px;
`;
const Settings: React.FC = () => {
  const navigation = useNavigation();
  const { client } = useApolloLink();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FFF',
      }}
    >
      <Header>
        <Title>Configurações</Title>
      </Header>
      <Container
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <OptionContainer
          onPress={() => navigation.navigate('Settings.Notification')}
        >
          <Text>Configurar notificações</Text>
          <Icons name="chevron-right" />
        </OptionContainer>

        <OptionContainer
          onPress={() =>
            Linking.openURL(
              'whatsapp://send?text=Oi%2c+tenho+algo+a+falar+sobre+o+Riderize&phone=+5547988277410',
            )}
        >
          <Text>Informe um erro</Text>
          <Icons name="chevron-right" />
        </OptionContainer>

        <OptionContainer onPress={() => navigation.navigate('User.Welcome')}>
          <Text>Acessar Tutorial</Text>
          <Icons name="chevron-right" />
        </OptionContainer>

        <OptionContainer
          onPress={async () => {
            await AsyncStorage.setItem('@riderize::user_id', '');
            await client.clearStore();

            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }),
            );
          }}
        >
          <Subtitle style={{ color: 'red' }}>Sair</Subtitle>
        </OptionContainer>
      </Container>
      <FooterVersionContainer>
        <FooterVersionText>Versão: {APP_VERSION}</FooterVersionText>
      </FooterVersionContainer>
    </SafeAreaView>
  );
};

export default Settings;
