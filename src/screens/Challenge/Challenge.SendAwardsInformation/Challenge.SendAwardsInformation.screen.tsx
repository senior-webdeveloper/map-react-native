import React from 'react';
import { View, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { RootStackParamList } from '~/routes';

import { Icons, SafeAreaView, Text } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

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
export const UserName = styled(Text)`
  margin-left: 10px;
`;
export const AwardName = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  color: ${({ theme }) => theme.colors.blue};
  margin-left: 10px;
  margin-top: 35px;
  margin-bottom: 15px;
  text-align: center;
`;
export const Name = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  margin-left: 10px;
`;
export const Avatar = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 32px;
`;
export const InputName = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
`;
export const InputContainer = styled.View`
  margin-top: 20px;
`;
export const InputText = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  opacity: 0.56;
`;
export const InputView = styled.View`
  background-color: #f8fafb;
  box-shadow: 0px 10px 5px rgba(5, 100, 255, 0.06);
  padding: 5px 13px;
  border-radius: 12px;
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
type ChallengeDescriptionNavigationProp = RouteProp<
  RootStackParamList,
  'Challenge.SendAwardsInformation'
>;
type Props = {
  route: ChallengeDescriptionNavigationProp;
};

const ChallengeSendAwardsInformation: React.FC<Props> = ({ route }) => {
  const { user, award } = route.params.userChallenges;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Header>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <Title>Envio do prêmio</Title>
        <View style={{ width: 20 }} />
      </Header>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        <AwardName>Informações do destinatário</AwardName>
        <InputContainer>
          <InputName>Nome</InputName>
          <InputView>
            <InputText>{`${user.firstname} ${user.lastname}`}</InputText>
          </InputView>
        </InputContainer>
        {user.legal_registry_number && (
          <InputContainer>
            <InputName>CPF</InputName>
            <InputView>
              <InputText>{user.legal_registry_number}</InputText>
            </InputView>
          </InputContainer>
        )}
        <AwardName>Endereço de envio</AwardName>
        {user.zip_code && (
          <InputContainer>
            <InputName>CEP</InputName>
            <InputView>
              <InputText>{user.zip_code}</InputText>
            </InputView>
          </InputContainer>
        )}
        {user.city?.name && user.city.state.abbreviation && (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <InputContainer>
              <InputName>Cidade</InputName>
              <InputView>
                <InputText>{user.city?.name}</InputText>
              </InputView>
            </InputContainer>
            <InputContainer>
              <InputName>UF</InputName>
              <InputView style={{ width: '100%' }}>
                <InputText>{user.city?.state.abbreviation}</InputText>
              </InputView>
            </InputContainer>
          </View>
        )}
        {user.address_line_one?.length > 0 && (
          <InputContainer>
            <InputName>Endereço</InputName>
            <InputView>
              <InputText>{user.address_line_one}</InputText>
            </InputView>
          </InputContainer>
        )}
        {user.address_line_two?.length > 0 && (
          <InputContainer>
            <InputName>Complemento</InputName>
            <InputView>
              <InputText>{user.address_line_two}</InputText>
            </InputView>
          </InputContainer>
        )}
        <AwardName>Informações de contato</AwardName>
        {user.email && (
          <InputContainer>
            <InputName>E-mail</InputName>
            <InputView>
              <InputText>{user.email}</InputText>
            </InputView>
          </InputContainer>
        )}
        {user.phone && (
          <InputContainer>
            <InputName>Telefone</InputName>
            <InputView>
              <InputText>{user.phone}</InputText>
            </InputView>
          </InputContainer>
        )}
        <AwardName>Prêmio</AwardName>
        <InputName style={{ textAlign: 'center' }}>{award.name}</InputName>
        <AwardImageContainer>
          <AwardImage
            resizeMethod="scale"
            resizeMode="center"
            source={{
              uri: `${PUBLIC_STORAGE}/${award.awardsImages[0].link}`,
            }}
          />
        </AwardImageContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengeSendAwardsInformation;
