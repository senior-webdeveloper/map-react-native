import React from 'react';
import { ScrollView, View } from 'react-native';
import { PUBLIC_STORAGE } from '@env';
import { addMinutes, format } from 'date-fns';
import { Icons } from '~/components';
import ptbr from '~/helpers/dateLocale';

import { UserChallenges } from '~/graphql/autogenerate/schemas';
import {
  TitleWrapper,
  Avatar,
  CommentText,
  ContentWrapper,
  HighlightCard,
  HighlightName,
  HighlightTitle,
  Title,
  HighlightValue,
} from './styles';
import formatterMinutes from '~/helpers/formatterMinutes';
import formatNumbers from '~/helpers/formatNumbers';

interface Props {
  highlight_by_greater_distance: UserChallenges;
  highlight_by_greater_altimetry: UserChallenges;
  highlight_by_greater_ride: UserChallenges;
  highlight_by_greater_total_time: UserChallenges;
}

export default function Highlights({
  highlight_by_greater_distance,
  highlight_by_greater_altimetry,
  highlight_by_greater_ride,
  highlight_by_greater_total_time,
}: Props): JSX.Element {
  return (
    <ContentWrapper>
      <View style={{ paddingHorizontal: 16 }}>
        <Title>Destaques</Title>
        <CommentText style={{ maxWidth: 207 }}>
          Estes Riders destacaram-se pelo seu desempenho.
        </CommentText>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ paddingVertical: 10 }}
      >
        {highlight_by_greater_distance !== undefined &&
          highlight_by_greater_distance !== null &&
          highlight_by_greater_distance.user &&
          highlight_by_greater_distance.user.profile && (
            <HighlightCard>
              <TitleWrapper>
                <Icons name="distance" />
              </TitleWrapper>
              <HighlightTitle>Distância Acumulada</HighlightTitle>
              <Avatar
                style={{
                  marginTop: 15,
                  marginBottom: 8,
                }}
                source={{
                  uri: `${PUBLIC_STORAGE}/${highlight_by_greater_distance.user.profile.profile_avatar}`,
                  marginTop: 4,
                  marginBottom: 8,
                }}
              />
              <HighlightName numberOfLines={1}>
                {`${highlight_by_greater_distance?.user.firstname} ${highlight_by_greater_distance?.user.lastname}`}
              </HighlightName>
              {highlight_by_greater_distance?.total_distance && (
                <HighlightValue>
                  {formatNumbers(
                    highlight_by_greater_distance?.total_distance / 1000,
                    { hasDot: true },
                  )}{' '}
                  km
                </HighlightValue>
              )}
            </HighlightCard>
          )}

        {highlight_by_greater_altimetry !== undefined &&
          highlight_by_greater_altimetry !== null &&
          highlight_by_greater_altimetry.user &&
          highlight_by_greater_altimetry.user.profile && (
            <HighlightCard>
              <TitleWrapper>
                <Icons name="mountain" />
              </TitleWrapper>
              <HighlightTitle>Altimetria Acumulada</HighlightTitle>
              <Avatar
                style={{
                  marginTop: 15,
                  marginBottom: 8,
                }}
                source={{
                  uri: `${PUBLIC_STORAGE}/${highlight_by_greater_altimetry.user.profile?.profile_avatar}`,
                }}
              />
              <HighlightName numberOfLines={1}>
                {`${highlight_by_greater_altimetry?.user.firstname} ${highlight_by_greater_altimetry.user.lastname}`}
              </HighlightName>
              {highlight_by_greater_altimetry?.total_altimetry && (
                <HighlightValue>
                  {formatNumbers(
                    highlight_by_greater_altimetry?.total_altimetry,
                    { hasDot: false },
                  )}{' '}
                  m
                </HighlightValue>
              )}
            </HighlightCard>
          )}

        {highlight_by_greater_ride !== undefined &&
          highlight_by_greater_ride !== null &&
          highlight_by_greater_ride.user &&
          highlight_by_greater_ride.user.profile && (
            <HighlightCard>
              <TitleWrapper>
                <Icons name="bike" height={12} />
              </TitleWrapper>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <HighlightTitle>Maior</HighlightTitle>
                <HighlightTitle>Pedal</HighlightTitle>
              </View>

              <Avatar
                style={{
                  marginTop: 15,
                  marginBottom: 8,
                }}
                source={{
                  uri: `${PUBLIC_STORAGE}/${highlight_by_greater_ride.user.profile?.profile_avatar}`,
                  marginTop: 4,
                  marginBottom: 8,
                }}
              />
              <HighlightName numberOfLines={1}>
                {`${highlight_by_greater_ride.user.firstname} ${highlight_by_greater_ride.user.lastname}`}
              </HighlightName>
              <HighlightValue>
                {formatNumbers(
                  highlight_by_greater_ride.activities[0].activity.distance /
                    1000,
                  { hasDot: true },
                )}{' '}
                km
              </HighlightValue>
            </HighlightCard>
          )}

        {highlight_by_greater_total_time !== undefined &&
          highlight_by_greater_total_time !== null &&
          highlight_by_greater_total_time.user &&
          highlight_by_greater_total_time.user.profile &&
          highlight_by_greater_total_time.total_time !== 0 && (
            <HighlightCard>
              <View style={{ alignItems: 'flex-end', width: '100%' }}>
                <Icons name="clock" height={12} />
              </View>
              <HighlightTitle>Maior Tempo Acumulado</HighlightTitle>
              <Avatar
                style={{
                  marginTop: 15,
                  marginBottom: 8,
                }}
                source={{
                  uri: `${PUBLIC_STORAGE}/${highlight_by_greater_total_time.user.profile?.profile_avatar}`,
                  marginTop: 4,
                  marginBottom: 8,
                }}
              />
              <HighlightName numberOfLines={1}>
                {`${highlight_by_greater_total_time.user.firstname} ${highlight_by_greater_total_time.user.lastname}`}
              </HighlightName>
              <HighlightValue>
                {Math.floor(highlight_by_greater_total_time.total_time / 60)}:
                {highlight_by_greater_total_time.total_time % 60}:00
              </HighlightValue>
            </HighlightCard>
          )}
      </ScrollView>
    </ContentWrapper>
  );
}
