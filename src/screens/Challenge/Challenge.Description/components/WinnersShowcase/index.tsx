import React from 'react';
import { TouchableOpacity } from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { UserChallenges } from '~/graphql/autogenerate/schemas';
import { RootStackParamList } from '~/routes.types';
import {
  AwardImage,
  BoxShadow,
  CustomScroll,
  FooterContainer,
  HeaderContainer,
  ImagesContainer,
  NameContainer,
  Subtitle,
  Title,
  UserAvatar,
  Username,
  WinnerContainer,
} from './styles';

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

interface Props {
  winners: UserChallenges[];
  challenge_id: string;
  isCreator: boolean;
  navigation: ChallengeDescriptionNavigationProp;
}
export default function WinnersShowcase({
  winners,
  navigation,
  challenge_id,
  isCreator,
}: Props): JSX.Element {
  return (
    <BoxShadow>
      <HeaderContainer>
        <Title>Sorteados</Title>

        <Subtitle>
          Estes Riders completaram o desafio e foram sorteados
        </Subtitle>
      </HeaderContainer>

      <CustomScroll horizontal showsHorizontalScrollIndicator={false}>
        {winners.map((winner) => (
          <WinnerContainer>
            <ImagesContainer>
              <UserAvatar
                source={{
                  uri: `${PUBLIC_STORAGE}/${winner.user.profile?.profile_avatar}`,
                }}
              />
              <AwardImage
                source={{
                  uri: `${PUBLIC_STORAGE}/${winner.award?.awardsImages[0].link}`,
                }}
              />
            </ImagesContainer>

            <NameContainer>
              <Username numberOfLines={1}>
                {`${winner.user.firstname} ${winner.user.lastname}`}
              </Username>
            </NameContainer>
          </WinnerContainer>
        ))}
      </CustomScroll>

      <FooterContainer>
        <TouchableOpacity
          onPress={() =>
            navigation.push('Challenge.Winners', {
              challenge_id,
              isCreator,
            })
          }
        >
          <Styled.BlueText>Ver mais detalhes</Styled.BlueText>
        </TouchableOpacity>
      </FooterContainer>
    </BoxShadow>
  );
}
