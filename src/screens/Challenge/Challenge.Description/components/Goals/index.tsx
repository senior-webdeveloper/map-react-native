import React from 'react';
import { View } from 'react-native';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import { Box, Icons, Text, TitleText } from '~/components';
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

interface Props {
  isAccumulation?: boolean;
  distanceGoalValue: number | null | undefined;
  altimetryGoalValue: number | null | undefined;
  maxAltimetryGoalValue: number | null | undefined;
  maxDistanceGoalValue: number | null | undefined;
  maxTimeGoalValue: number | null | undefined;
  minTimeGoalValue: number | null | undefined;
}

export default function Goals({
  isAccumulation,
  distanceGoalValue,
  altimetryGoalValue,
  maxAltimetryGoalValue,
  maxDistanceGoalValue,
  maxTimeGoalValue,
  minTimeGoalValue,
}: Props): JSX.Element {
  function formatMinutesInHours(minutes: number): string {
    return `${
      Math.floor(minutes / 60) < 10
        ? `0${Math.floor(minutes / 60)}`
        : Math.floor(minutes / 60)
    }h ${
      Number(minutes % 60) < 10
        ? `0${Number(minutes % 60)}`
        : Number(minutes % 60)
    }min`;
  }

  const handleDistance = () => {
    if (distanceGoalValue && maxDistanceGoalValue) {
      return (
        <DistanceContentWrapper>
          <WrapperRow>
            <Icons name="distance" width={20} />
            <ParagraphMargin>Distância entre</ParagraphMargin>
          </WrapperRow>

          <ContentWrapper color="#FFF">
            <GoalContainer>
              <Styled.ParagraphText>
                {distanceGoalValue / 1000} a {maxDistanceGoalValue / 1000} km
              </Styled.ParagraphText>
            </GoalContainer>
          </ContentWrapper>
        </DistanceContentWrapper>
      );
    }
    if (distanceGoalValue && !maxDistanceGoalValue) {
      return (
        <DistanceContentWrapper>
          <WrapperRow>
            <Icons name="distance" width={20} />
            <ParagraphMargin>Distância Total mínima de</ParagraphMargin>
          </WrapperRow>

          <ContentWrapper color="#FFF">
            <GoalContainer>
              <Styled.ParagraphText>
                {distanceGoalValue / 1000} km
              </Styled.ParagraphText>
            </GoalContainer>
          </ContentWrapper>
        </DistanceContentWrapper>
      );
    }
    if (maxDistanceGoalValue && !distanceGoalValue) {
      return (
        <DistanceContentWrapper>
          <WrapperRow>
            <Icons name="distance" width={20} />
            <ParagraphMargin>Distância Máxima de até</ParagraphMargin>
          </WrapperRow>

          <ContentWrapper color="#FFF">
            <GoalContainer>
              <Styled.ParagraphText>
                {maxDistanceGoalValue / 1000} km
              </Styled.ParagraphText>
            </GoalContainer>
          </ContentWrapper>
        </DistanceContentWrapper>
      );
    }
  };

  const handleAltimetry = () => {
    if (altimetryGoalValue && maxAltimetryGoalValue) {
      return (
        <AltimetryContainer>
          <WrapperRow>
            <Icons name="mountain" width={20} />
            <ParagraphMargin>Altimetria entre</ParagraphMargin>
          </WrapperRow>

          <ContentWrapper color="#FFF">
            <GoalContainer>
              <Styled.ParagraphText>
                {altimetryGoalValue} a {maxAltimetryGoalValue}m
              </Styled.ParagraphText>
            </GoalContainer>
          </ContentWrapper>
        </AltimetryContainer>
      );
    }
    if (altimetryGoalValue && !maxAltimetryGoalValue) {
      return (
        <AltimetryContainer>
          <WrapperRow>
            <Icons name="mountain" width={20} />
            <ParagraphMargin>Altimetria mínima de</ParagraphMargin>
          </WrapperRow>

          <ContentWrapper color="#FFF">
            <GoalContainer>
              <Styled.ParagraphText>
                {altimetryGoalValue} m
              </Styled.ParagraphText>
            </GoalContainer>
          </ContentWrapper>
        </AltimetryContainer>
      );
    }
    if (maxAltimetryGoalValue && !altimetryGoalValue) {
      return (
        <AltimetryContainer>
          <WrapperRow>
            <Icons name="mountain" width={20} />
            <ParagraphMargin>Altimetria Máxima de até</ParagraphMargin>
          </WrapperRow>

          <ContentWrapper color="#FFF">
            <GoalContainer>
              <Styled.ParagraphText>
                {altimetryGoalValue} m
              </Styled.ParagraphText>
            </GoalContainer>
          </ContentWrapper>
        </AltimetryContainer>
      );
    }
  };

  const handleTime = () => {
    if (!minTimeGoalValue && maxTimeGoalValue) {
      return (
        <AltimetryContainer>
          <WrapperRow>
            <Icons name="clock" width={20} />
            <ParagraphMargin>Tempo máximo de:</ParagraphMargin>
          </WrapperRow>

          <ContentWrapper color="#FFF">
            <GoalContainer>
              <Styled.ParagraphText>
                {formatMinutesInHours(maxTimeGoalValue)}
              </Styled.ParagraphText>
            </GoalContainer>
          </ContentWrapper>
        </AltimetryContainer>
      );
    }
    if (minTimeGoalValue && !maxTimeGoalValue) {
      return (
        <AltimetryContainer>
          <WrapperRow>
            <Icons name="clock" width={20} />
            <ParagraphMargin>Tempo mínima de:</ParagraphMargin>
          </WrapperRow>

          <ContentWrapper color="#FFF">
            <GoalContainer>
              <Styled.ParagraphText>
                {formatMinutesInHours(minTimeGoalValue)}
              </Styled.ParagraphText>
            </GoalContainer>
          </ContentWrapper>
        </AltimetryContainer>
      );
    }
  };

  return (
    <Container>
      <Box>
        <TitleText style={{ color: '#4595EC' }}>Objetivos</TitleText>
        <Text
          style={{
            color: 'rgba(22, 28, 37, 0.56)',
            fontFamily: 'NeuzeitGro-Lig',
            fontSize: 14,
            lineHeight: 16,
            width: '80%',
          }}
        >
          Aqui estão os objetivos deste desafio. Fique atento as regras e
          lembre-se que elas passam a contar do dia que você se inscreveu em
          diante.
        </Text>
      </Box>

      <View style={{ marginTop: 15 }}>
        <Content color="#E8861C">
          <HeaderContainer>
            <Icons name="gears" color="#FFF" width={20} />
            <GoalText color="#FFF">Faça este desafio em</GoalText>
          </HeaderContainer>

          <ContentWrapper color="#FFF">
            <GoalContainer>
              <Styled.ParagraphText>
                {isAccumulation ? 'Vários pedais' : 'Único pedal'}
              </Styled.ParagraphText>
            </GoalContainer>
          </ContentWrapper>
        </Content>

        {handleDistance()}

        {handleAltimetry()}

        {handleTime()}
      </View>
    </Container>
  );
}
