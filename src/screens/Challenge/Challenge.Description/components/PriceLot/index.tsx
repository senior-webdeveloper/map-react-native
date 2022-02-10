import React, { useState } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import closestIndexTo from 'date-fns/closestIndexTo/index';
import { format, isFuture, isPast } from 'date-fns';
import { compact, dropWhile } from 'lodash';
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
import {
  ChallengeCategories,
  EventSubscriptionPriceType,
} from '~/graphql/autogenerate/schemas';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import locale from '~/helpers/dateLocale';

interface Props {
  subscription_prices: EventSubscriptionPriceType[];
}

export default function PriceLot({ subscription_prices }: Props): JSX.Element {
  const RenderElement = (
    element: EventSubscriptionPriceType,
    index: number,
  ): JSX.Element => {
    const value = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(element.value);
    let itPast;
    let isActual;
    if (subscription_prices[index + 1]) {
      isActual =
        isPast(new Date(element.date_initial)) &&
        isFuture(new Date(subscription_prices[index + 1].date_initial));
      itPast = isPast(new Date(element.date_initial));
    } else {
      isActual = isPast(new Date(element.date_initial));
      itPast = isPast(new Date(element.date_initial));
    }

    return (
      <Box
        style={{ marginBottom: 8 }}
        key={element.id}
        flexDirection="row"
        justifyContent="space-between"
        px={16}
      >
        <Text
          style={{
            textDecorationLine: itPast
              ? !isActual
                ? 'line-through'
                : 'none'
              : 'none',
            textDecorationStyle: 'solid',
            fontFamily: itPast
              ? !isActual
                ? 'NeuzeitGro-Lig'
                : 'NeuzeitGro-Bol'
              : 'NeuzeitGro-Reg',
          }}
        >
          {value}
        </Text>
        <Text
          style={{
            textDecorationLine: itPast
              ? !isActual
                ? 'line-through'
                : 'none'
              : 'none',
            textDecorationStyle: 'solid',
            fontFamily: itPast
              ? !isActual
                ? 'NeuzeitGro-Lig'
                : 'NeuzeitGro-Bol'
              : 'NeuzeitGro-Reg',
          }}
        >
          {format(new Date(element.date_initial), 'P', { locale })}
        </Text>
      </Box>
    );
  };

  return (
    <Container>
      <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
        <Box>
          <TitleText style={{ color: '#4595EC' }}>Lotes de Inscrição</TitleText>
          <Text
            style={{
              color: 'rgba(22, 28, 37, 0.56)',
              fontFamily: 'NeuzeitGro-Lig',
              fontSize: 14,
              lineHeight: 16,
              width: '60%',
            }}
          >
            Conheça os valores de todos os lotes disponíveis no evento.
          </Text>
        </Box>
      </View>
      <View style={{ marginTop: 16, marginBottom: 10 }}>
        {subscription_prices.map(
          (category, index): JSX.Element => RenderElement(category, index),
        )}
      </View>
    </Container>
  );
}
