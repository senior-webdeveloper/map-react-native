/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import styled from 'styled-components/native';
import { StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserToken } from '~/hooks';
import { Icons, SafeAreaView, Text, TitleText } from '~/components';
import LogoAzul from '~/assets/logoAzul.svg';
import { useStoreState } from '~/store';

export const Container = styled.ScrollView`
  /* padding: 20px 24px; */
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  background-color: transparent;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export const Title = styled(TitleText)``;
export const Subtitle = styled(TitleText)`
  font-size: 20px;
`;
export const SeeAllText = styled(Text)`
  text-transform: uppercase;
  font-size: 12px;
  line-height: 20px;
  text-align: right;
  color: rgba(22, 28, 37, 0.5);
`;
export const ContentWrapper = styled.View`
  border-top-width: 1px;
  border-top-color: #dfe8ed;
  padding: 25px -16px;
`;
export const MenuItemWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;
export const MenuItemBox = styled.View`
  background: #ffffff;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  width: 100px;
  height: 100px;
  box-shadow: -24px 8px 40px rgba(174, 174, 174, 0.08);
`;
export const MenuItem = styled.View`
  margin-top: 24px;
  align-items: center;
`;
export const MenuItemText = styled(Text)`
  font-size: 12px;
  margin-top: 12px;
`;
export const FeedHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const FeedItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 30px 10px;
  padding: 12px 10px;
  background: #ffffff;
  border-radius: 16px;

  box-shadow: -40px 20px 40px rgba(255, 255, 255, 0.235522);
`;
export const FeedItemName = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const FeedDescritionText = styled(Text)``;
export const FeedTimeText = styled(Text)`
  color: rgba(22, 28, 37, 0.6);
`;
export const FeedTextContainer = styled.View``;
export const FeedWrapper = styled.View`
  align-items: flex-start;
  flex-direction: row;
`;
export const Avatar = styled.Image`
  width: 34px;
  height: 34px;
  border-radius: 34px;
  margin-right: 10px;
`;
export const FeedChalengeImage = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 8px;
`;
export const EventsItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 30px;
  padding: 17px 24px 22px 24px;
  background: ${({ theme }) => theme.colors.backgroundWhite};
  border-radius: 16px;
  box-shadow: -24px 8px 40px rgba(174, 174, 174, 0.08);
`;

export const ModalContainer = styled.View`
  background: ${({ theme }) => theme.colors.backgroundWhite};
  flex: 1;
  border-radius: 8px;
  max-height: 40%;
  align-items: center;
  padding: 8%;
  justify-content: space-between;
`;
export const ModalButton = styled.View`
  background: #0564ff;
  border-radius: 3px;
  padding: 10px 24px;
  justify-content: center;
  align-items: center;
`;
export const ModalHeaderText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  text-align: center;
`;
export const ModalDescriptionText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;
export const ModalButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fontFamily.regular};
  color: ${({ theme }) => theme.colors.textWhite};
  text-align: center;
`;
export const CompanyButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;
export const CompanyAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 100px;
  margin-right: 15px;
`;

const Menu: React.FC = () => {
  const navigation = useNavigation();
  const userProfile = useStoreState((state) => state.profile.payload);
  const { userinfo } = useUserToken();

  return (
    <SafeAreaView style={{ backgroundColor: '#F8FAFB', flex: 1 }}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <Container
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <LogoAzul />
        </Header>

        <ContentWrapper>
          <Subtitle>Principais recursos</Subtitle>
          <MenuItemWrapper>
            <TouchableOpacity onPress={() => navigation.navigate('Challenges')}>
              <MenuItem>
                <MenuItemBox>
                  <Icons name="challenge" width={30} height={30} />
                </MenuItemBox>
                <MenuItemText>Desafios Virtuais</MenuItemText>
              </MenuItem>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Challenge.ManuallyProgress')}
            >
              <MenuItem>
                <MenuItemBox>
                  <Icons name="upload" width={30} height={30} />
                </MenuItemBox>
                <MenuItemText style={{ textAlign: 'center' }}>
                  Registrar Pedaladas
                </MenuItemText>
              </MenuItem>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('User.Activities')}
            >
              <MenuItem>
                <MenuItemBox>
                  <Icons name="bike" width={30} height={30} />
                </MenuItemBox>
                <MenuItemText style={{ textAlign: 'center' }}>
                  Minhas Pedaladas
                </MenuItemText>
              </MenuItem>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('User.ConnectedMonitors')}
            >
              <MenuItem>
                <MenuItemBox>
                  <Icons name="connections" width={30} height={30} />
                </MenuItemBox>
                <MenuItemText style={{ textAlign: 'center' }}>
                  Monitores conectados
                </MenuItemText>
              </MenuItem>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('User.Profile')}
            >
              <MenuItem>
                <MenuItemBox>
                  <Icons name="user" width={30} height={30} />
                </MenuItemBox>
                <MenuItemText>Perfil</MenuItemText>
              </MenuItem>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
            >
              <MenuItem>
                <MenuItemBox>
                  <Icons name="notification" width={30} height={30} />
                </MenuItemBox>
                <MenuItemText>Notificações</MenuItemText>
              </MenuItem>
            </TouchableOpacity>

            {userProfile && userProfile.getProfile.user?.staff && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Staff.SearchUsers')}
              >
                <MenuItem>
                  <MenuItemBox>
                    <Icons name="location" width={30} height={30} />
                  </MenuItemBox>
                  <MenuItemText>Buscar Usuários - Staff</MenuItemText>
                </MenuItem>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <MenuItem>
                <MenuItemBox>
                  <Icons name="settings" width={30} height={30} />
                </MenuItemBox>
                <MenuItemText>Configurações</MenuItemText>
              </MenuItem>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('User.ListCreditCards')}
            >
              <MenuItem>
                <MenuItemBox>
                  <Icons name="credit-card" width={31} />
                </MenuItemBox>
                <MenuItemText>Meus Cartões</MenuItemText>
              </MenuItem>
            </TouchableOpacity>
          </MenuItemWrapper>
        </ContentWrapper>

        <ContentWrapper style={{ marginBottom: 40 }} />
      </Container>
    </SafeAreaView>
  );
};

export default Menu;
