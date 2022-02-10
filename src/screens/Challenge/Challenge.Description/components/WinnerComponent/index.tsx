import { PUBLIC_STORAGE } from '@env';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Text, TitleText, Icons, Box } from '~/components';
import { UserChallenges } from '~/graphql/autogenerate/schemas';
import { RootStackParamList } from '~/routes.types';

interface BoxProps {
  color?: string;
}
export const Image = styled.Image`
  margin-top: 36px;
  margin-bottom: 24px;
`;
export const BoxContainer = styled(Box)<BoxProps>`
  background-color: ${({ theme, color }) => color || theme.colors.textWhite};
  elevation: 5;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
`;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

interface Props {
  challenge_name: string;
  winner: UserChallenges;
  award_image: string;
  navigation: ChallengeDescriptionNavigationProp;
}

function WinnerComponent({
  challenge_name,
  winner,
  award_image,
  navigation,
}: Props): JSX.Element {
  return (
    <Box pt={2} px={2}>
      <TouchableOpacity
        onPress={() =>
          navigation.push('Challenge.WinnerAwards', {
            challenge_name,
            winner,
          })
        }
      >
        <BoxContainer
          color="semantic.yellow"
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Image
            style={{
              width: 90,
              height: 90,
              borderRadius: 12,
              backgroundColor: 'white',
            }}
            source={{
              uri: `${PUBLIC_STORAGE}/${award_image}`,
            }}
          />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>Você foi</Text>
            <TitleText
              style={{ fontSize: 20, color: 'white', lineHeight: 18.4 }}
            >
              Sorteado!
            </TitleText>
          </View>
          <Icons
            name="chevron-right"
            color="#FFF"
            style={{ marginRight: 26 }}
          />
        </BoxContainer>
      </TouchableOpacity>
    </Box>
  );
}

export default WinnerComponent;
