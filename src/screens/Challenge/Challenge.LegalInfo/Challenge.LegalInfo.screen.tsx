import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Icons, SafeAreaView } from '~/components';
import { RootStackParamList } from '~/routes.types';
import {
  HeaderContainer,
  HeaderText,
  HeaderWrapper,
  ParagraphText,
} from './Challenge.LegalInfo.styles';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';

import { useStoreState } from '~/store';

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.LegalInfo'
>;

type Props = {
  navigation: ChallengeDescriptionNavigationProp;
};

export default function ChallengeLegalInfo({ navigation }: Props): JSX.Element {
  // const { data: userProfile, refetch: getUserProfile } = useUserInfo();
  const userProfile = useStoreState((state) => state.profile.payload);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <HeaderContainer>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, top: 10, right: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>

        <HeaderText>Informações importantes</HeaderText>
        <HeaderWrapper />
      </HeaderContainer>

      <ScrollView>
        <Styled.AwardContainer style={{ marginBottom: 20 }}>
          <ParagraphText>
            Atividades cadastradas antes ou após o prazo de conclusão são
            desconsideradas.
          </ParagraphText>

          <ParagraphText>
            As atividades nos GPS ou Strava precisam estar cadastradas como
            &quot;Ciclismo&quot; ou semelhante para serem consideradas.
          </ParagraphText>

          <ParagraphText>
            As atividades e participação nos desafios podem ser denunciadas e
            nos reservamos ao direito de verificar casos de fraude que serão
            automaticamente desqualificadas.
          </ParagraphText>

          <ParagraphText>
            Fique atento ao mau funcionamento do seu GPS ou celular e confira o
            progresso do desafio.
          </ParagraphText>

          <ParagraphText>
            Cuide nos trajetos que fizer, pois é de inteira responsabilidade sua
            a segurança e integridade física.
          </ParagraphText>

          <ParagraphText>
            O sorteado precisa ter seu endereço de entrega cadastrado dentro do
            App para receber o prêmio.
            <TouchableOpacity
              onPress={() => {
                navigation.push('User.EditProfileAddress', {
                  ...userProfile?.getProfile,
                });
              }}
            >
              <Styled.TermsofUse> Você pode atualizar aqui.</Styled.TermsofUse>
            </TouchableOpacity>
          </ParagraphText>

          <ParagraphText style={{ marginBottom: 0 }}>
            Dúvidas podem ser enviadas para{' '}
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:contato@riderize.com')}
            >
              <Styled.TermsofUse>contato@riderize.com.</Styled.TermsofUse>
            </TouchableOpacity>
          </ParagraphText>

          <ParagraphText style={{ marginBottom: 0 }}>
            Ao se Inscrever neste Desafio você concorda com os{' '}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'https://riderize.com/TERMO_DE_RECONHECIMENTO_DE_RISCOS_E_LIBERTACAO_DE_INDENIZACAO_RIDERIZE.pdf',
                )}
            >
              <Styled.TermsofUse style={{ marginBottom: -6 }}>
                termos de participante.
              </Styled.TermsofUse>
            </TouchableOpacity>
          </ParagraphText>
        </Styled.AwardContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
