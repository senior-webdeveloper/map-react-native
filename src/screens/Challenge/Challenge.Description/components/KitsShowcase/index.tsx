import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { ChallengeAwards } from '~/graphql/autogenerate/schemas';
import { RootStackParamList } from '~/routes.types';
import {
  HeaderContainer,
  Container,
  FooterContainer,
  AwardImage,
  FooterText,
  AwardContainer,
  AwardNameContainer,
  AwardWrapper,
  HeaderTitle,
  SubtitleOpacity,
} from './styles';
import { Box, Text, TitleText } from '~/components';

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

interface Props {
  awards: ChallengeAwards[];
  navigation: ChallengeDescriptionNavigationProp;
  isPhysical: boolean;
  subscribe: () => Promise<void>;
  showSubscribe: boolean;
  hasClickedOnSubscribe: boolean;
  isPaid: boolean;
}

export default function KitsShowcase({
  awards,

  navigation,
  isPhysical,
  subscribe,
  showSubscribe,
  hasClickedOnSubscribe,
  isPaid,
}: Props): JSX.Element {
  return (
    <Container>
      <HeaderContainer>
        <Box>
          <TitleText style={{ color: '#4595EC' }}>Kit Atleta</TitleText>
          <Text
            style={{
              color: 'rgba(22, 28, 37, 0.56)',
              fontFamily: 'NeuzeitGro-Lig',
              fontSize: 14,
              lineHeight: 16,
              width: '60%',
            }}
          >
            {isPhysical
              ? `Veja o(s) Kit Atleta disponíveis para este evento.`
              : 'Conheça os Kits disponíveis para este Desafio Virtual'}
          </Text>
        </Box>
      </HeaderContainer>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {awards &&
          awards.length > 0 &&
          awards.slice(0, 3).map((award, index) => (
            <AwardContainer key={award.id.toString()}>
              {award.price && award.price > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Award.Description', {
                      award,
                      title: 'Kits',
                      subscribe,
                      showSubscribe,
                      hasClickedOnSubscribe,
                      isPaid,
                      award_index: index,
                    })
                  }
                >
                  <AwardWrapper index={index} length={awards.length}>
                    <AwardImage
                      source={{
                        uri: `${PUBLIC_STORAGE}/${award.awardsImages[0].link}`,
                      }}
                    />

                    <AwardNameContainer>
                      <Styled.ParagraphText>{award.name}</Styled.ParagraphText>
                    </AwardNameContainer>
                  </AwardWrapper>
                </TouchableOpacity>
              )}
            </AwardContainer>
          ))}
      </ScrollView>

      <FooterContainer>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AwardsShowcase', {
              awards,
              title: 'Kit Atleta',
              subscribe,
              showSubscribe,
              hasClickedOnSubscribe,
              isPaid,
            })
          }
        >
          <FooterText>Ver {`todos (${awards.length})`}</FooterText>
        </TouchableOpacity>
      </FooterContainer>
    </Container>
  );
}
