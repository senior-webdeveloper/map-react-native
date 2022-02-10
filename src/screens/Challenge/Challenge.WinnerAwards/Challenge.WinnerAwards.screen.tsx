import React from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Linking,
} from 'react-native';
import styled from 'styled-components/native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { PUBLIC_STORAGE } from '@env';
import {
  Icons,
  SafeAreaView,
  TitleText,
  Text as CustomText,
} from '~/components';
import { RootStackParamList } from '~/routes.types';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { useUserInfo } from '~/hooks';
import { useStoreState } from '~/store';

export const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
  padding-top: 40px;
`;
export const Image = styled.Image``;
export const Title = styled(TitleText)`
  color: ${({ theme }) => theme.colors.blue};
  font-size: 32px;
  text-align: center;
`;
export const Content = styled.View`
  margin-top: 20px;
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal};
`;
export const YellowBox = styled.View`
  background: rgba(255, 197, 2, 0.05);
  border-color: #ffc502;
  border-width: 1px;
  padding: 11px 13px;
  margin-top: 15px;
  margin-bottom: 25px;
`;
export const Text = styled(CustomText)`
  text-align: center;
`;
export const BoldText = styled(CustomText)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const Carrousel = styled.ScrollView`
  padding-top: 40px;
  padding-bottom: 35px;
`;
export const AwardImageContainer = styled.View`
  margin-horizontal: 16px;
  background-color: #ffffff;
  box-shadow: 0px 20px 56px rgba(0, 33, 88, 0.1);
  border-radius: 16px;
  height: 185px;
  overflow: hidden;
`;
export const AwardImage = styled.Image`
  width: ${widthPercentageToDP('90')};
  height: 185px;
`;
const RefeshText = styled(Text)`
  margin-right: 9px;
  color: ${({ theme }) => theme.colors.blue};
`;
export const FooterView = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 25px;
`;

type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'Challenge.WinnerAwards'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};

const ChallengeWinnerAwards: React.FC<Props> = ({ route }) => {
  const userProfile = useStoreState((state) => state.profile.payload);
  const { challenge_name, winner } = route.params;
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Header>
          <TouchableOpacity
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            onPress={() => navigation.goBack()}
          >
            <Icons name="close" />
          </TouchableOpacity>
          <Image source={require('./Assets/winner.png')} />
          <View style={{ width: 20 }} />
        </Header>
        <Content>
          <Title>Parabéns Rider!</Title>
          <YellowBox>
            <Text>
              Você concluiu o desafio <BoldText>{challenge_name}</BoldText> e
              receberá um prêmio. Veja o que você ganhou!
            </Text>
          </YellowBox>
          <View
            style={{ paddingVertical: 20, width: '100%', alignItems: 'center' }}
          >
            <TouchableOpacity
              hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                Linking.openURL(
                  `whatsapp://send?text=Oi%2c+sou+o+ganhador+do+desafio+${challenge_name.replace(
                    ' ',
                    '+',
                  )}+&phone=+5547988277410`,
                );
              }}
            >
              <RefeshText>Entrar em contato </RefeshText>
              <Icons name="arrow-right" width={12} color="#0564ff" />
            </TouchableOpacity>
          </View>
          <BoldText>{winner?.award?.name}</BoldText>
        </Content>
        <Carrousel horizontal showsHorizontalScrollIndicator={false}>
          {winner?.award?.awardsImages &&
            winner?.award?.awardsImages?.map((award) => (
              <AwardImageContainer>
                <AwardImage
                  resizeMethod="scale"
                  resizeMode="contain"
                  source={{
                    uri: `${PUBLIC_STORAGE}/${award.link}`,
                  }}
                />
              </AwardImageContainer>
            ))}
        </Carrousel>
        <FooterView>
          <TouchableOpacity
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              if (userProfile && userProfile?.getProfile) {
                navigation.navigate('User.EditProfileInfo', {
                  user: userProfile?.getProfile,
                });
              }
            }}
          >
            <RefeshText>Editar informações de envio</RefeshText>
            <Icons name="arrow-right" width={12} color="#0564ff" />
          </TouchableOpacity>
        </FooterView>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ChallengeWinnerAwards;
