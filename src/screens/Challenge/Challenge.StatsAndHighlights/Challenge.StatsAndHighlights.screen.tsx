import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import { RootStackParamList } from '~/routes.types';
import { useGetChallengeRankInformationQuery } from '~/graphql/autogenerate/hooks';
import { Icons, SafeAreaView, Text, TitleText } from '~/components';
import Highlights from '~/screens/Challenge/Challenge.StatsAndHighlights/components/Highlights';
import Statistics from '~/screens/Challenge/Challenge.StatsAndHighlights/components/Statistics';
import formatNumbers from '~/helpers/formatNumbers';

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 50px 16px 18px 16px;
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  elevation: 1;
  margin-bottom: 8px;
`;
export const Title = styled(TitleText)`
  font-size: 20px;
`;
export const UserName = styled(Text)`
  margin-left: 10px;
  opacity: 0.5;
  line-height: 14px;
`;
export const Name = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.bold};
  margin-left: 10px;
`;

export const AvatarContainer = styled.TouchableOpacity`
  padding-horizontal: ${({ theme }) => theme.paddingHorizontal}
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const ContentWrapper = styled.View`
  background-color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-bottom: 8px;
  padding: 21px 16px;

  elevation: 1;
`;
export const Container = styled.View`
  flex: 1;
  background-color: rgba(239, 250, 255, 0.5);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;
export const OptionContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: #efefef;
`;
export const OptionText = styled(Text)`
  font-size: 16px;
`;
export const Wrapper = styled.View`
  margin-bottom: 14px;
`;
export const CommentText = styled(Text)`
  opacity: 0.56;
  font-size: 14px;
  line-height: 16px;
`;
export const Avatar = styled(FastImage)`
  width: 40px;
  height: 40px;
  border-radius: 40px;
`;
export const HighlightCard = styled.View`
  padding: 8px 13px 13px 13px;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 0px 7px rgba(21, 46, 88, 0.1);
  width: 125px;
  margin-right: 10px;
  elevation: 1;
`;
export const HighlightTitle = styled(TitleText)`
  font-size: 14px;
  opacity: 0.56;
`;
export const HighlightName = styled(Text)`
  font-family: ${({ theme }) => theme.fontFamily.light};
  font-size: 12px;
`;
export const HighlightValue = styled(Text)`
  font-size: 16px;
`;

interface StatsProps {
  color: string;
}
export const StatsCard = styled.View<StatsProps>`
  align-items: flex-end;
  background-color: ${({ color }) => color};
  border-radius: 12px;
  box-shadow: 0px 0px 7px rgba(21, 46, 88, 0.1);
  margin-right: 10px;
  elevation: 1;
`;
export const InnerStatsContainer = styled.View`
  background-color: #ffffff;
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
  margin-left: 8px;
  width: 145px;
  padding: 8px 8px 16px 8px;
`;
type ChallengeRegisteredUsersRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.StatsAndHighlights'
>;

type ChallengeRegisteredUsersNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

type Props = {
  route: ChallengeRegisteredUsersRouteProp;
  navigation: ChallengeRegisteredUsersNavigationProp;
};

const ChallengeStatsAndHighlights: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { challenge } = route.params;

  const { data, loading } = useGetChallengeRankInformationQuery({
    variables: { challenge_id: route.params.challenge_id },
  });

  if (loading)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <Header>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
          >
            <Icons name="arrow-left" />
          </TouchableOpacity>
          <Title>Classificações</Title>
          <View style={{ width: 20 }} />
        </Header>
        <ActivityIndicator size="large" color="#0564FF" />
      </SafeAreaView>
    );

  return (
    <Container>
      <StatusBar
        backgroundColor="#FFFFFF"
        animated
        barStyle="dark-content"
        translucent
      />
      <Header>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Icons name="arrow-left" />
        </TouchableOpacity>
        <Title>Classificações</Title>
        <View style={{ width: 20 }} />
      </Header>
      <ScrollView>
        {data &&
          data?.getChallengeRankInformation.subscribed_highlights
            .highlight_by_greater_total_time?.total_time_seconds !== 0 &&
          data?.getChallengeRankInformation.subscribed_highlights
            .highlight_by_greater_ride?.activities.length > 0 &&
          data?.getChallengeRankInformation.subscribed_highlights
            .highlight_by_greater_ride?.activities[0].activity.distance !==
            0 && (
            <Highlights
              highlight_by_greater_altimetry={
                data?.getChallengeRankInformation.subscribed_highlights
                  .highlight_by_greater_altimetry
              }
              highlight_by_greater_distance={
                data?.getChallengeRankInformation.subscribed_highlights
                  .highlight_by_greater_distance
              }
              highlight_by_greater_total_time={
                data?.getChallengeRankInformation.subscribed_highlights
                  .highlight_by_greater_total_time
              }
              highlight_by_greater_ride={
                data?.getChallengeRankInformation.subscribed_highlights
                  .highlight_by_greater_ride
              }
            />
          )}

        {data &&
          data?.getChallengeRankInformation.challenge_statistics.total_rides !==
            0 &&
          data?.getChallengeRankInformation.challenge_statistics
            .total_time_ride !== 0 &&
          (data?.getChallengeRankInformation.challenge_statistics
            .total_altimetry ||
            data?.getChallengeRankInformation.challenge_statistics
              .total_distance) && (
            <Statistics
                total_altimetry={
                data?.getChallengeRankInformation.challenge_statistics
                  .total_altimetry
              }
                total_distance={
                data?.getChallengeRankInformation.challenge_statistics
                  .total_distance
              }
                total_rides={
                data?.getChallengeRankInformation.challenge_statistics
                  .total_rides
              }
                total_time_ride={
                data?.getChallengeRankInformation.challenge_statistics
                  .total_time_ride
              }
              />
          )}

        <ContentWrapper>
          <Wrapper>
            <Title>Participantes</Title>
          </Wrapper>

          <OptionContainer
            onPress={() =>
              navigation.push('Challenge.Classification', {
                has_classification: false,
                challenge_id: route.params.challenge_id,
                filterName: 'Todos inscritos',
                challenge_type: route.params.challenge_type,
                my_subscribed_date: route.params.my_subscribed_date,
                user_challenges: route.params.user_activities,
                challenge: route.params.challenge,
                goal_distance: route.params.goal_distance,
                goal_altimetric: route.params.goal_altimetric,
                key: [
                  'generalRankOrderedByDistance',
                  'generalRankOrderedByAltimetry',
                  'generalRankOrderedByTime',
                ],
              })}
          >
            <OptionText>Todos inscritos</OptionText>
            <View style={{ flexDirection: 'row' }}>
              <CommentText style={{ marginRight: 20 }}>
                {formatNumbers(
                  data?.getChallengeRankInformation.participants_statistics
                    .count_subscribers,
                  { hasDot: false },
                )}
              </CommentText>
              <Icons name="chevron-right" />
            </View>
          </OptionContainer>

          <OptionContainer
            onPress={() =>
              navigation.push('Challenge.Classification', {
                has_classification: false,
                challenge_id: route.params.challenge_id,
                filterName: 'Você segue',
                challenge_type: route.params.challenge_type,
                my_subscribed_date: route.params.my_subscribed_date,
                user_challenges: route.params.user_activities,
                challenge: route.params.challenge,
                goal_distance: route.params.goal_distance,
                goal_altimetric: route.params.goal_altimetric,
                key: [
                  'subscriptionsFollowedByMeOrderedByDistance',
                  'subscriptionsFollowedByMeOrderedByAltimetry',
                  'subscriptionsFollowedByMeOrderedByTime',
                ],
              })}
          >
            <OptionText>Você segue</OptionText>
            <View style={{ flexDirection: 'row' }}>
              <Icons name="chevron-right" />
            </View>
          </OptionContainer>

          <OptionContainer
            onPress={() =>
              navigation.push('Challenge.Classification', {
                has_classification: false,
                challenge_id: route.params.challenge_id,
                filterName: 'Seus seguidores',
                challenge_type: route.params.challenge_type,
                my_subscribed_date: route.params.my_subscribed_date,
                user_challenges: route.params.user_activities,
                challenge: route.params.challenge,
                goal_distance: route.params.goal_distance,
                goal_altimetric: route.params.goal_altimetric,
                key: [
                  'subscriptionsWhoFollowsMeOrderedByDistance',
                  'subscriptionsWhoFollowsMeOrderedByAltimetry',
                  'subscriptionsWhoFollowsMeOrderedByTime',
                ],
              })}
          >
            <OptionText>Seus seguidores</OptionText>
            <View style={{ flexDirection: 'row' }}>
              <Icons name="chevron-right" />
            </View>
          </OptionContainer>

          <OptionContainer
            onPress={() =>
              navigation.push('Challenge.Classification', {
                has_classification: false,
                challenge_id: route.params.challenge_id,
                filterName: 'Masculino',
                challenge_type: route.params.challenge_type,
                my_subscribed_date: route.params.my_subscribed_date,
                user_challenges: route.params.user_activities,
                challenge: route.params.challenge,
                goal_distance: route.params.goal_distance,
                goal_altimetric: route.params.goal_altimetric,
                key: [
                  'maleRankOrderedByDistance',
                  'maleRankOrderedByAltimetry',
                  'maleRankOrderedByTime',
                ],
              })}
          >
            <OptionText>Masculino</OptionText>
            <View style={{ flexDirection: 'row' }}>
              <CommentText style={{ marginRight: 20 }}>
                {formatNumbers(
                  data?.getChallengeRankInformation.participants_statistics
                    .count_gender_male,
                  { hasDot: false },
                )}
              </CommentText>
              <Icons name="chevron-right" />
            </View>
          </OptionContainer>

          <OptionContainer
            onPress={() =>
              navigation.push('Challenge.Classification', {
                has_classification: false,
                challenge_id: route.params.challenge_id,
                filterName: 'Feminino',
                challenge_type: route.params.challenge_type,
                my_subscribed_date: route.params.my_subscribed_date,
                user_challenges: route.params.user_activities,
                challenge: route.params.challenge,
                goal_distance: route.params.goal_distance,
                goal_altimetric: route.params.goal_altimetric,
                key: [
                  'femaleRankOrderedByDistance',
                  'femaleRankOrderedByAltimetry',
                  'femaleRankOrderedByTime',
                ],
              })}
          >
            <OptionText>Feminino</OptionText>
            <View style={{ flexDirection: 'row' }}>
              <CommentText style={{ marginRight: 20 }}>
                {formatNumbers(
                  data?.getChallengeRankInformation.participants_statistics
                    .count_gender_female,
                  { hasDot: false },
                )}
              </CommentText>
              <Icons name="chevron-right" />
            </View>
          </OptionContainer>

          {challenge.has_categories &&
            challenge.challenge_categories.length > 0 &&
            challenge.challenge_categories.map((category) => (
              <OptionContainer
                key={category.id}
                onPress={() =>
                  navigation.push('Challenge.Classification', {
                    challenge_id: route.params.challenge_id,
                    filterName: category.name,
                    challenge_type: route.params.challenge_type,
                    my_subscribed_date: route.params.my_subscribed_date,
                    user_challenges: route.params.user_activities,
                    challenge: route.params.challenge,
                    goal_distance: route.params.goal_distance,
                    goal_altimetric: route.params.goal_altimetric,
                    key: [
                      `${category.id}-distance`,
                      `${category.id}-altimetry`,
                      `${category.id}-time`,
                    ],
                    has_classification: true,
                  })}
              >
                <OptionText>{category.name}</OptionText>
                <Icons name="chevron-right" />
              </OptionContainer>
            ))}
          {/* {route.params.award &&
            route.params.award.length > 0 &&
            route.params.award.map((category) => (
              <>
                {!category.only_for_draw &&
                  route.params.challenge.physical_event && (
                    <OptionContainer
                      key={category.id}
                      onPress={() =>
                        navigation.push('Challenge.Classification', {
                          challenge_id: route.params.challenge_id,
                          filterName: category.name,
                          challenge_type: route.params.challenge_type,
                          my_subscribed_date: route.params.my_subscribed_date,
                          user_challenges: route.params.user_activities,
                          challenge: route.params.challenge,
                          goal_distance: route.params.goal_distance,
                          goal_altimetric: route.params.goal_altimetric,
                          key: [category.id, category.id],
                          has_classification: true,
                        })}
                    >
                      <OptionText>{category.name}</OptionText>
                      <Icons name="chevron-right" />
                    </OptionContainer>
                  )}
              </>
            ))} */}
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default ChallengeStatsAndHighlights;
