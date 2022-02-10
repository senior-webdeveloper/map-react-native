import React, { useState } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import closestIndexTo from 'date-fns/closestIndexTo/index';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { Box, BoxShadow, Icons, Text, TitleText } from '~/components';
import {
  Title,
  ContentWrapper,
  Container,
  ParagraphMargin,
  HeaderContainer,
  Content,
  AltimetryContainer,
  DistanceContentWrapper,
  GoalContainer,
  GoalText,
  WrapperRow,
} from './styles';
import { ChallengeCategories } from '~/graphql/autogenerate/schemas';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

interface Props {
  categories: ChallengeCategories[];
  selected_category?: string;
  isAccumulation: boolean;
}

export default function Categories({
  categories,
  selected_category,
  isAccumulation,
  navigation,
  data,
  canViewChangeButton,
}: Props): JSX.Element {
  const RenderElement = (
    category: ChallengeCategories,
    index: number,
  ): JSX.Element => {
    const [show, setShow] = useState(false);
    const isLast = index === categories.length - 1;
    return (
      <View
        style={{ marginBottom: isLast ? -10 : show ? 0 : 8 }}
        key={category.id}
      >
        <TouchableOpacity onPress={() => setShow(!show)} activeOpacity={0.7}>
          <BoxShadow
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#6DC9FF',
                  width: 16,
                  height: 50,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                  marginRight: 17,
                }}
              />
              <Text>{category.name}</Text>
            </View>

            <View
              style={{
                paddingHorizontal: 17.5,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {/* {category.configuration.distance_goal_value &&
                category.configuration.distance_goal_value > 0 && (
                  <Icons name="custom-distance" height={16} width={16} />
                )}
              {category.configuration.altimetry_goal_value &&
                category.configuration.altimetry_goal_value > 0 && (
                  <Icons
                    name="mountain"
                    height={12.9}
                    width={20}
                    style={{ marginLeft: 12 }}
                  />
                )} */}
              {selected_category && selected_category === category.id ? (
                <View
                  style={{
                    backgroundColor: '#FFC502',
                    paddingVertical: 5,
                    paddingHorizontal: 12,
                    borderRadius: 137,
                  }}
                >
                  <Text style={{ fontFamily: 'NeuzeitGro-Lig', color: '#FFF' }}>
                    Minha categoria
                  </Text>
                </View>
              ) : null}

              <Icons
                name={show ? 'chevron-up' : 'chevron-down'}
                style={{ marginLeft: 29.5 }}
              />
            </View>
          </BoxShadow>
        </TouchableOpacity>

        {show ? (
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 16,
              backgroundColor: 'rgba(110, 202, 255, 0.2)',
            }}
          >
            <Content color="#FFF">
              <HeaderContainer>
                <Icons name="gears" width={20} />
                <GoalText>Faça este desafio em</GoalText>
              </HeaderContainer>

              <ContentWrapper color="#FFF">
                <GoalContainer>
                  <Styled.ParagraphText>
                    {isAccumulation ? 'Vários pedais' : 'Único pedal'}
                  </Styled.ParagraphText>
                </GoalContainer>
              </ContentWrapper>
            </Content>

            {category.category_configuration.distance_goal_value ? (
              <DistanceContentWrapper>
                <WrapperRow>
                  <Icons name="distance" width={20} />
                  <ParagraphMargin>Percorra a distância de</ParagraphMargin>
                </WrapperRow>

                <ContentWrapper color="#FFF">
                  <GoalContainer>
                    <Styled.ParagraphText>
                      {category.category_configuration.distance_goal_value /
                        1000}{' '}
                      km
                    </Styled.ParagraphText>
                  </GoalContainer>
                </ContentWrapper>
              </DistanceContentWrapper>
            ) : null}

            {category.category_configuration.altimetry_goal_value ? (
              <AltimetryContainer>
                <WrapperRow>
                  <Icons name="mountain" width={20} />
                  <ParagraphMargin>Faça uma escalada de</ParagraphMargin>
                </WrapperRow>

                <ContentWrapper color="#FFF">
                  <GoalContainer>
                    <Styled.ParagraphText>
                      {category.category_configuration.altimetry_goal_value} m
                    </Styled.ParagraphText>
                  </GoalContainer>
                </ContentWrapper>
              </AltimetryContainer>
            ) : null}

            {selected_category &&
            selected_category === category.id &&
            canViewChangeButton ? (
              <TouchableOpacity
                style={{
                  backgroundColor: '#0564FF',
                  // borderWidth: 1,
                  paddingVertical: 5,
                  paddingHorizontal: 12,
                  borderRadius: 137,
                  marginTop: 10,
                  alignItems: 'center',
                  width: widthPercentageToDP('40'),
                }}
                onPress={() => {
                  navigation.push('Challenge.ChangeCategory', {
                    user_challenge_id:
                      data.getChallengeDetail.user_challenges[0].id,
                    data,
                  });
                }}
              >
                <Text style={{ fontFamily: 'NeuzeitGro-Lig', color: '#FFF' }}>
                  Trocar Categoria
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <Container>
      <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
        <Box>
          <TitleText style={{ color: '#4595EC' }}>Categorias</TitleText>
          <Text
            style={{
              color: 'rgba(22, 28, 37, 0.56)',
              fontFamily: 'NeuzeitGro-Lig',
              fontSize: 14,
              lineHeight: 16,
              width: '60%',
            }}
          >
            {data.getChallengeDetail.physical_event
              ? 'Veja todas as categorias disponíveis neste evento.'
              : 'Veja todas as categorias disponiveis neste desafio.'}
          </Text>
        </Box>
      </View>
      <View style={{ marginTop: 16 }}>
        {categories.map(
          (category, index): JSX.Element => RenderElement(category, index),
        )}
      </View>
    </Container>
  );
}
