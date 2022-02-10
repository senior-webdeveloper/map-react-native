import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import { StackNavigationProp } from '@react-navigation/stack';
import { Box, Icons, Text, TitleText } from '~/components';
import { ChallengeAwards } from '~/graphql/autogenerate/schemas';
import { RootStackParamList } from '~/routes.types';
import {
  Wrapper,
  FooterText,
  AwardImage,
  AwardImageContainer,
  AwardInfoContainer,
  AwardName,
  AwardQuantity,
  ButtonContainer,
  Container,
  ContentWrapper,
  FooterContainer,
  HorizontalWrapper,
  ParagraphOpacity,
  Title,
} from './styles';

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

export default function DrawingShowcase({
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
      <HorizontalWrapper>
        <Box>
          <TitleText style={{ color: '#4595EC' }}>Sorteios</TitleText>
          <Text
            style={{
              color: 'rgba(22, 28, 37, 0.56)',
              fontFamily: 'NeuzeitGro-Lig',
              fontSize: 14,
              lineHeight: 16,
              width: '80%',
            }}
          >
            Estes itens serão sorteados entre os concluintes do Desafio
          </Text>
        </Box>
      </HorizontalWrapper>

      <ContentWrapper>
        {awards.slice(0, 3).map((award, index) => (
          <View key={award.id}>
            <ButtonContainer
              onPress={() =>
                navigation.navigate('Award.Description', {
                  award,
                  title: 'Sorteio',
                  subscribe,
                  showSubscribe,
                  hasClickedOnSubscribe,
                  isPaid,
                  award_index: index,
                })}
            >
              <Wrapper>
                <AwardImageContainer>
                  <AwardImage
                    source={{
                      uri: `${PUBLIC_STORAGE}/${award?.awardsImages[0]?.link}`,
                    }}
                  />
                </AwardImageContainer>

                <AwardInfoContainer>
                  <AwardName numberOfLines={1}>{award.name}</AwardName>
                  {award.quantity && award.quantity > 0 && (
                    <AwardQuantity>
                      {award.quantity}{' '}
                      {award.quantity > 1 ? 'unidades' : 'unidade'}
                    </AwardQuantity>
                  )}
                </AwardInfoContainer>
              </Wrapper>
              <Icons name="chevron-right" />
            </ButtonContainer>
          </View>
        ))}
      </ContentWrapper>

      <FooterContainer>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AwardsShowcase', {
              awards,
              title: awards.length > 1 ? 'Sorteios' : 'Sorteio',
              subscribe,
              showSubscribe,
              hasClickedOnSubscribe,
              isPaid,
            })}
        >
          <FooterText>
            Ver sorteios {awards.length > 3 ? `(${awards.length})` : null}
          </FooterText>
        </TouchableOpacity>
      </FooterContainer>
    </Container>
  );
}
