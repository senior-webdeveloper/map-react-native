import React from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { TitleText, Text, SmallText } from '~/components';
import image70 from './70.png';
import image120 from './120.png';
import image200 from './200.png';
import image300 from './300.png';

interface BoxProps {
  color?: string;
}

export const BoxContainer = styled.View<BoxProps>`
  background-color: ${({ theme, color }) => color || theme.colors.textWhite};
  elevation: 5;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
  margin-top: 16px;
  padding-vertical: 24px;
`;

export const Title = styled(TitleText)`
  color: #4595ec;
  font-size: 24px;
  line-height: 28px;
`;

export const Subtitle = styled(SmallText)`
  font-size: 14px;
  line-height: 16px;
  color: rgba(22, 28, 37, 0.56);
`;

export const ItemTitle = styled(TitleText)`
  font-size: 16px;
  line-height: 18px;
  color: #161c25;
`;

export const BoxInfoContainer = styled.View<BoxProps>`
  background-color: ${({ theme, color }) => color || theme.colors.textWhite};
  elevation: 5;
  box-shadow: 0px 0px 22px rgba(21, 46, 88, 0.1);
  border-radius: 12px;
  padding-horizontal: 10px;
  padding-vertical: 4px;
`;

export const DistanceBackground = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #4595ec;
  border-radius: 12px;
  width: 145px;
  padding-right: 8px;
`;

export const InfoText = styled(TitleText)`
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
`;

export default function Courses({ navigation }): JSX.Element {
  return (
    <BoxContainer>
      <View style={{ paddingHorizontal: 16 }}>
        <Title>Percursos</Title>
        <Subtitle>Confira os percursos previstos neste evento.</Subtitle>
      </View>

      <ScrollView
        horizontal
        style={{ marginTop: 24 }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <TouchableOpacity
          style={{ marginLeft: 16, marginRight: 24 }}
          onPress={() => {
            navigation.navigate('Playground', { course: 70 });
          }}
        >
          <Image source={image70} style={{ marginBottom: 16 }} />
          <ItemTitle>Categoria 70</ItemTitle>

          <DistanceBackground style={{ marginTop: 8 }}>
            <BoxInfoContainer>
              <Text>Distância</Text>
            </BoxInfoContainer>

            <InfoText>84 KM</InfoText>
          </DistanceBackground>

          <DistanceBackground
            style={{ backgroundColor: '#FFC502', marginTop: 4 }}
          >
            <BoxInfoContainer>
              <Text>Altimetria</Text>
            </BoxInfoContainer>

            <InfoText>1.086 M</InfoText>
          </DistanceBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginRight: 24 }}
          onPress={() => {
            navigation.navigate('Playground', { course: 120 });
          }}
        >
          <Image source={image120} style={{ marginBottom: 16 }} />
          <ItemTitle>Categoria 120</ItemTitle>

          <DistanceBackground style={{ marginTop: 8 }}>
            <BoxInfoContainer>
              <Text>Distância</Text>
            </BoxInfoContainer>

            <InfoText>127 KM</InfoText>
          </DistanceBackground>

          <DistanceBackground
            style={{ backgroundColor: '#FFC502', marginTop: 4 }}
          >
            <BoxInfoContainer>
              <Text>Altimetria</Text>
            </BoxInfoContainer>

            <InfoText>2.030 M</InfoText>
          </DistanceBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginRight: 24 }}
          onPress={() => {
            navigation.navigate('Playground', { course: 200 });
          }}
        >
          <Image source={image200} style={{ marginBottom: 16 }} />
          <ItemTitle>Categoria 200</ItemTitle>

          <DistanceBackground style={{ marginTop: 8 }}>
            <BoxInfoContainer>
              <Text>Distância</Text>
            </BoxInfoContainer>

            <InfoText>204 KM</InfoText>
          </DistanceBackground>

          <DistanceBackground
            style={{ backgroundColor: '#FFC502', marginTop: 4 }}
          >
            <BoxInfoContainer>
              <Text>Altimetria</Text>
            </BoxInfoContainer>

            <InfoText>2.659 M</InfoText>
          </DistanceBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginRight: 24 }}
          onPress={() => {
            navigation.navigate('Playground', { course: 300 });
          }}
        >
          <Image source={image300} style={{ marginBottom: 16 }} />
          <ItemTitle>Categoria 300</ItemTitle>

          <DistanceBackground style={{ marginTop: 8 }}>
            <BoxInfoContainer>
              <Text>Distância</Text>
            </BoxInfoContainer>

            <InfoText>312 KM</InfoText>
          </DistanceBackground>

          <DistanceBackground
            style={{ backgroundColor: '#FFC502', marginTop: 4 }}
          >
            <BoxInfoContainer>
              <Text>Altimetria</Text>
            </BoxInfoContainer>

            <InfoText>4.290 M</InfoText>
          </DistanceBackground>
        </TouchableOpacity>
      </ScrollView>
    </BoxContainer>
  );
}
