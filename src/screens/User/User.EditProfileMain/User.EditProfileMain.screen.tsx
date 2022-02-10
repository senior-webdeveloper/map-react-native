import React, { useCallback } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, View, StatusBar } from 'react-native';
import CachedImage from 'react-native-image-cache-wrapper';
import { RouteProp, useNavigation } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { Icons, SafeAreaView, Text } from '~/components';
import { RootStackParamList } from '~/routes';
import { useUserInfo, useUserToken } from '~/hooks';
import { useGetProfileLazyQuery } from '~/graphql/autogenerate/hooks';

export const Container = styled.View`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  margin-bottom: 60px;
`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px 0 24px;
`;
export const Title = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 20px;
`;

export const TitleOthers = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  font-size: 24px;
`;
export const HighlightsCard = styled.View`
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 16px;
`;
export const HighlightImage = styled(CachedImage)`
  width: 100%;
  height: 376.19px;
  border-radius: 16px;
  margin-bottom: 14px;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 15px;
  /* padding: 16px 16px 0 0; */
`;
export const HighlightsCardTitle = styled.Text`
  font-family: 'NeuzeitGro-Bol';
  margin-right: 9px;
  font-size: 16px;
  line-height: 20px;
  color: #161c25;
`;
export const HighlightsCardNormal = styled.Text`
  font-family: 'NeuzeitGro-Reg';
  font-size: 16px;
  line-height: 20px;
  color: #161c25;
  margin-left: 11px;
`;
export const RockyMountain = styled(CachedImage)`
  width: 64px;
  height: 64px;
  border-radius: 8px;
`;

export const CardOverlay = styled.View`
  width: 100%;
  background: #161c25;
  opacity: 0.9;
  padding: 10px;
  align-items: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;
export const ChallengeInfo = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;
export const InfoContainer = styled.View``;
export const AvatarContainer = styled.View`
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 64px;
  height: 64px;
  border: 0.5px solid #303030;
`;
export const InfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
export const OptionContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px 16px;
  border-bottom-width: 1px;
  border-bottom-color: #efefef;
`;

export const Content = styled.ScrollView``;

export const OptionTitle = styled(Text)`
  font-size: 20px;
`;
export const OptionDescription = styled(Text)`
  font-size: 14px;
  opacity: 0.56;
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'User.EditProfileMain'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};

const UserEditProfileMain: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { profileID } = useUserToken();

  const [getProfile, { data, loading }] = useGetProfileLazyQuery({
    onError: (e) => {
      Sentry.captureException(e);
    },
  });

  React.useEffect(() => {
    if (profileID.length > 0) {
      getProfile({
        variables: {
          data: {
            profile_id_requesting: profileID,
            profile_id_accessed: profileID,
          },
        },
      });
    }
  }, [profileID]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Header>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <Title>Editar Perfil</Title>
        <View style={{ width: 20 }} />
      </Header>
      <Content>
        <OptionContainer
          onPress={() => {
            navigation.navigate('User.EditProfileAndPhoto', {
              ...route.params,
              ...data?.getProfile,
            });
          }}
        >
          <View>
            <OptionTitle>Perfil e Contatos</OptionTitle>
            <OptionDescription>
              Dados do meu perfil e os contatos.
            </OptionDescription>
          </View>
          <Icons name="chevron-right" />
        </OptionContainer>

        <OptionContainer
          onPress={() => {
            navigation.navigate('User.EditProfileAddress', {
              ...route.params,
              ...data?.getProfile,
            });
          }}
        >
          <View>
            <OptionTitle>Endereço</OptionTitle>
            <OptionDescription>
              Informações para endereço de entregas.
            </OptionDescription>
          </View>
          <Icons name="chevron-right" />
        </OptionContainer>

        <OptionContainer
          onPress={() => {
            navigation.navigate('User.EditProfilePersonalData', {
              ...route.params,
              ...data?.getProfile,
            });
          }}
        >
          <View>
            <OptionTitle>Dados Pessoais</OptionTitle>
            <OptionDescription>
              Seus dados corporais e aniversário.
            </OptionDescription>
          </View>
          <Icons name="chevron-right" />
        </OptionContainer>
      </Content>
    </SafeAreaView>
  );
};

export default UserEditProfileMain;
