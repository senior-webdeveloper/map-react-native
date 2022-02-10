import React from 'react';
import { ScrollView, View } from 'react-native';
import { addHours } from 'date-fns';
import { Icons, TitleText } from '~/components';
import {
  CardTitle,
  Wrapper,
  CommentText,
  ContentWrapper,
  HighlightValue,
  InnerStatsContainer,
  StatsCard,
  Title,
} from './styles';
import formatterMinutes from '~/helpers/formatterMinutes';
import formatNumbers from '~/helpers/formatNumbers';
import formatNumber from '~/helpers/formatNumbers';

interface Props {
  total_distance: number;
  total_altimetry: number;
  total_time_ride: number;
  total_rides: number;
}

export default function Statistics({
  total_distance,
  total_altimetry,
  total_time_ride,
  total_rides,
}: Props): JSX.Element {
  return (
    <ContentWrapper>
      <View style={{ paddingHorizontal: 16 }}>
        <Title>Estatísticas</Title>
        <CommentText style={{ maxWidth: 207 }}>
          Os números de todos os Riders participantes do desafio.
        </CommentText>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ paddingVertical: 10, flexDirection: 'row' }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {total_distance !== null && total_distance !== undefined && (
          <StatsCard color="#0564FF">
            <InnerStatsContainer>
              <Wrapper>
                <CardTitle>Foram percorridos</CardTitle>
                <Icons name="distance" />
              </Wrapper>

              <HighlightValue>
                {formatNumbers(total_distance / 1000, { hasDot: true })}
                {/* {!Number.isInteger(total_distance / 1000) */}
                {/*  ? String(Number(total_distance / 1000).toFixed(2)).replace( */}
                {/*      '.', */}
                {/*      ',', */}
                {/*    ) */}
                {/*  : total_distance / 1000} */} km
              </HighlightValue>
            </InnerStatsContainer>
          </StatsCard>
        )}

        {total_altimetry !== null && total_altimetry !== undefined && (
          <StatsCard color="#D6800F">
            <InnerStatsContainer>
              <Wrapper>
                <CardTitle>Altimetria alcançada</CardTitle>
                <Icons name="mountain" />
              </Wrapper>

              <HighlightValue>
                {formatNumbers(total_altimetry, { hasDot: false })} m
              </HighlightValue>
            </InnerStatsContainer>
          </StatsCard>
        )}

        {total_time_ride !== null &&
          total_time_ride !== undefined &&
          total_time_ride !== 0 && (
            <StatsCard color="rgba(22, 28, 37, 0.56)">
              <InnerStatsContainer>
                <Wrapper>
                  <CardTitle>Tempo de pedal</CardTitle>
                  <Icons name="clock" />
                </Wrapper>

                <HighlightValue>
                  {Math.floor(total_time_ride / 60)}:{total_time_ride % 60}:00
                </HighlightValue>
              </InnerStatsContainer>
            </StatsCard>
          )}

        {total_rides !== null &&
          total_rides !== undefined &&
          total_rides !== 0 && (
            <StatsCard color="#FFC502">
              <InnerStatsContainer>
                <Wrapper>
                  <CardTitle>Total de pedaladas</CardTitle>
                  <Icons name="bike" height={12} />
                </Wrapper>

                <HighlightValue>
                  {formatNumbers(total_rides, { hasDot: false })}
                </HighlightValue>
              </InnerStatsContainer>
            </StatsCard>
          )}
      </ScrollView>
    </ContentWrapper>
  );
}
