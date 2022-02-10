import React, { useEffect, useState } from 'react';
import { isPast } from 'date-fns';
import styled from 'styled-components/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { TouchableOpacity } from 'react-native';
import * as Styled from '~/screens/Challenge/Challenge.Description/Challenge.Description.styles';
import {
  Box,
  BoxShadow as CustomBoxShadow,
  Icons,
  Text,
  TitleText,
} from '~/components';

import {
  GetChallengeDetailQuery,
  GetSubscriptionProgressQuery,
} from '~/graphql/autogenerate/operations';
import formatNumbers from '~/helpers/formatNumbers';
import formatMinutesInHours from '~/helpers/formatMinutesInHours';
import { Wrapper } from '~/screens/Challenge/Challenge.Description/components/MyClassification/styles';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

export const BoxShadow = styled(CustomBoxShadow)`
  justify-content: space-between;
  padding-bottom: 20px;
  padding-top: 16px;
  padding-horizontal: 16px;
  margin-top: 24px;
`;

interface ProgressPercentProps {
  isCompleted?: boolean;
  color?: string;
}
export const ProgressPercentText = styled(TitleText)<ProgressPercentProps>`
  color: ${({ theme, isCompleted, color }) =>
    isCompleted ? theme.colors.accent.green : color || theme.colors.blue};
  font-size: 16px;
  line-height: 18px;
`;

type ChallengeTypes =
  | 'altimetric'
  | 'distance'
  | 'mixed-distance-altimetric'
  | 'min_time_goal_value'
  | 'max_time_goal_value'
  | 'maximum_time_goal_value'
  | 'minimum_time_goal_value';

interface Props {
  goal_distance?: number | null;
  goal_altimetry?: number | null;
  goal_max_time?: number | null;
  goal_min_time?: number | null;
  goal_max_altimetry?: number | null;
  goal_max_distance?: number | null;
  type: string | ChallengeTypes;
  navigation: any;
  endDate: string;
  challenge_id: string;
  userChallenges: GetSubscriptionProgressQuery | undefined;
  subscriptionID: string;
  has_categories: boolean | null | undefined;
  data: GetChallengeDetailQuery;
}

export default function ProgressBar({
  goal_distance,
  goal_max_altimetry,
  goal_max_distance,
  goal_altimetry,
  goal_max_time,
  subscriptionID,
  goal_min_time,
  type,
  navigation,
  endDate,
  challenge_id,
  userChallenges,
  data,
}: Props): JSX.Element {
  const [progressDistanceGoal, setProgressDistanceGoal] = useState<number>(0);
  const [progressTimeGoal, setProgressTimeGoal] = useState<number>(0);
  const [progressAltimetricGoal, setProgressAltimetricGoal] = useState<number>(
    0,
  );
  const challenge_type = type as ChallengeTypes;

  const handleProgess = (): void => {
    switch (challenge_type) {
      case 'altimetric': {
        if (
          (goal_altimetry && goal_max_altimetry) ||
          (goal_altimetry && !goal_max_altimetry)
        ) {
          setProgressAltimetricGoal(
            Number(
              ((userChallenges?.getSubscriptionProgress.total_altimetry
                ? userChallenges?.getSubscriptionProgress.total_altimetry
                : 0) *
                100) /
                Number(goal_altimetry),
            ),
          );
        } else if (!goal_altimetry && goal_max_altimetry) {
          if (userChallenges?.getSubscriptionProgress.total_altimetry) {
            setProgressAltimetricGoal(
              Number(
                ((userChallenges?.getSubscriptionProgress.total_altimetry
                  ? userChallenges?.getSubscriptionProgress.total_altimetry
                  : 0) *
                  100) /
                  Number(
                    userChallenges?.getSubscriptionProgress.total_altimetry
                      ? userChallenges?.getSubscriptionProgress.total_altimetry
                      : 0,
                  ),
              ),
            );
          } else {
            setProgressAltimetricGoal(0);
          }
        }

        break;
      }

      case 'mixed-distance-altimetric' || 'distance': {
        if (
          (goal_altimetry && goal_max_altimetry) ||
          (goal_altimetry && !goal_max_altimetry)
        ) {
          setProgressAltimetricGoal(
            Number(
              ((userChallenges?.getSubscriptionProgress.total_altimetry
                ? userChallenges?.getSubscriptionProgress.total_altimetry
                : 0) *
                100) /
                Number(goal_altimetry),
            ),
          );
        } else if (!goal_altimetry && goal_max_altimetry) {
          if (userChallenges?.getSubscriptionProgress.total_altimetry) {
            setProgressAltimetricGoal(
              Number(
                ((userChallenges?.getSubscriptionProgress.total_altimetry
                  ? userChallenges?.getSubscriptionProgress.total_altimetry
                  : 0) *
                  100) /
                  Number(
                    userChallenges?.getSubscriptionProgress.total_altimetry
                      ? userChallenges?.getSubscriptionProgress.total_altimetry
                      : 0,
                  ),
              ),
            );
          } else {
            setProgressAltimetricGoal(0);
          }
        }

        if (
          (goal_distance && goal_max_distance) ||
          (goal_distance && !goal_max_distance)
        ) {
          setProgressDistanceGoal(
            Number(
              ((userChallenges?.getSubscriptionProgress.total_distance
                ? userChallenges?.getSubscriptionProgress.total_distance
                : 0) *
                100) /
                Number(goal_distance),
            ),
          );
        } else if (!goal_distance && goal_max_distance) {
          if (userChallenges?.getSubscriptionProgress.total_distance) {
            setProgressDistanceGoal(
              Number(
                ((userChallenges?.getSubscriptionProgress.total_distance
                  ? userChallenges?.getSubscriptionProgress.total_distance
                  : 0) *
                  100) /
                  Number(
                    userChallenges?.getSubscriptionProgress.total_distance
                      ? userChallenges?.getSubscriptionProgress.total_distance
                      : 0,
                  ),
              ),
            );
          } else {
            setProgressDistanceGoal(0);
          }
        }

        break;
      }

      case 'maximum_time_goal_value' || 'max_time_goal_value':
        setProgressTimeGoal(
          Number(
            (userChallenges?.getSubscriptionProgress.total_time_seconds
              ? userChallenges?.getSubscriptionProgress.total_time_seconds
              : 0 * 100) / Number(goal_max_time),
          ),
        );
        break;

      case 'minimum_time_goal_value' || 'min_time_goal_value':
        setProgressTimeGoal(
          Number(
            ((userChallenges?.getSubscriptionProgress.total_time_seconds
              ? userChallenges?.getSubscriptionProgress.total_time_seconds
              : 0) *
              100) /
              Number(goal_min_time),
          ),
        );
        break;

      default:
        setProgressDistanceGoal(
          Number(
            ((userChallenges?.getSubscriptionProgress.total_distance
              ? userChallenges?.getSubscriptionProgress.total_distance
              : 0) *
              100) /
              Number(goal_distance),
          ),
        );
        break;
    }
  };

  useEffect(() => {
    handleProgess();
  });

  const Fill = (fill: number, color: string) => {
    return (
      <>
        <ProgressPercentText
          color={color}
          isCompleted={Number(fill.toFixed(0)) >= 100}
        >
          {fill.toFixed(0)}%
        </ProgressPercentText>
      </>
    );
  };

  return (
    <BoxShadow>
      <Box>
        <TitleText style={{ color: '#4595EC' }}>Meu progresso</TitleText>
        <Text
          style={{
            color: 'rgba(22, 28, 37, 0.56)',
            fontFamily: 'NeuzeitGro-Lig',
            fontSize: 14,
            lineHeight: 16,
            width: '60%',
          }}
        >
          Acompanhe o progresso do seu desempenho neste desafio.
        </Text>
      </Box>

      <Box flexDirection="row" alignItems="center">
        <Box width="100%">
          {challenge_type === 'distance' ||
          challenge_type === 'mixed-distance-altimetric' ? (
            <Box flexDirection="row" mt={32}>
              <AnimatedCircularProgress
                size={70}
                width={4}
                fill={Number(progressDistanceGoal.toFixed(0))}
                tintColor={
                  Number(progressDistanceGoal.toFixed(0)) >= 100
                    ? '#009D33'
                    : '#0564FF'
                }
                backgroundColor="rgba(5, 100, 255, 0.2)"
                rotation={360}
                duration={1000}
              >
                {(fill) => Fill(fill)}
              </AnimatedCircularProgress>

              <Box ml={32}>
                <Box flexDirection="row" alignItems="center" mb={12}>
                  <Icons
                    name="distance"
                    height={20}
                    width={12}
                    color="#4595EC"
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{ color: '#4595EC', fontSize: 20, lineHeight: 21 }}
                  >
                    Distância
                  </Text>
                </Box>

                <Box flexDirection="row" alignItems="flex-end">
                  <TitleText
                    style={{
                      marginRight: 5,
                      fontSize: 14,
                      lineHeight: 16,
                      color: 'rgba(22, 28, 37, 0.4)',
                    }}
                  >
                    Percorrido:
                  </TitleText>
                  <Text style={{ lineHeight: 16 }}>
                    {Number(
                      userChallenges?.getSubscriptionProgress.total_distance /
                        1000,
                    ).toFixed(0)}{' '}
                    km
                  </Text>
                </Box>
                <Box flexDirection="row" alignItems="flex-end">
                  <TitleText
                    style={{
                      marginRight: 5,
                      fontSize: 14,
                      lineHeight: 16,
                      color: 'rgba(22, 28, 37, 0.4)',
                    }}
                  >
                    Restante:
                  </TitleText>
                  <Text style={{ lineHeight: 16 }}>
                    {goal_max_distance
                      ? `até ${Number(goal_max_distance / 1000).toFixed(0)} km`
                      : `${Number(goal_distance / 1000).toFixed(0)} km`}
                  </Text>
                </Box>
              </Box>
            </Box>
          ) : null}

          {challenge_type === 'altimetric' ||
          challenge_type === 'mixed-distance-altimetric' ? (
            <Box
              flexDirection="row"
              borderTopWidth={0.5}
              borderTopColor="rgba(22, 28, 37, 0.2)"
              mt={17}
              paddingTop={17}
            >
              <AnimatedCircularProgress
                size={70}
                width={4}
                fill={Number(progressAltimetricGoal.toFixed(0))}
                tintColor={
                  Number(progressAltimetricGoal.toFixed(0)) >= 100
                    ? '#009D33'
                    : '#F9A000'
                }
                backgroundColor="rgba(249, 160, 0, 0.2)"
                rotation={360}
                duration={1000}
              >
                {(fill) => Fill(fill, '#F9A000')}
              </AnimatedCircularProgress>

              <Box ml={32}>
                <Box flexDirection="row" alignItems="center" mb={12}>
                  <Icons
                    name="mountain"
                    height={20}
                    width={18}
                    color="#F9A000"
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{ color: '#F9A000', fontSize: 20, lineHeight: 21 }}
                  >
                    Altimetria
                  </Text>
                </Box>

                <Box flexDirection="row" alignItems="flex-end">
                  <TitleText
                    style={{
                      marginRight: 5,
                      fontSize: 14,
                      lineHeight: 16,
                      color: 'rgba(22, 28, 37, 0.4)',
                    }}
                  >
                    Escalado:
                  </TitleText>
                  <Text style={{ lineHeight: 16 }}>
                    {Number(
                      userChallenges?.getSubscriptionProgress.total_altimetry,
                    ).toFixed(0)}{' '}
                    m
                  </Text>
                </Box>

                {goal_altimetry || goal_max_altimetry ? (
                  <Box flexDirection="row" alignItems="flex-end">
                    <TitleText
                      style={{
                        marginRight: 5,
                        fontSize: 14,
                        lineHeight: 16,
                        color: 'rgba(22, 28, 37, 0.4)',
                      }}
                    >
                      Restante:
                    </TitleText>
                    <Text style={{ lineHeight: 16 }}>
                      {goal_max_altimetry
                        ? `até ${Number(goal_max_altimetry).toFixed(0)} m`
                        : `${Number(goal_altimetry).toFixed(0)} m`}
                    </Text>
                  </Box>
                ) : null}
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </BoxShadow>
  );

  // return (
  //   <TouchableOpacity
  //     disabled={!userChallenges}
  //     onPress={() => {
  //       if (userChallenges) {
  //         navigation.navigate('Challenge.UserActivities', {
  //           challenge_id,
  //           user_id: userChallenges.getSubscriptionProgress.user.id,
  //           goal_distance,
  //           goal_altimetry,
  //           goal_max_time,
  //           goal_min_time,
  //           goal_max_altimetry,
  //           goal_max_distance,
  //           type,
  //           navigation,
  //           endDate,
  //           subscriptionID,
  //           user_challenges: userChallenges,
  //           data,
  //         });
  //       }
  //     }}
  //   >
  //     <Container>
  //       <Styled.BoxAlignRight>
  //         <View style={{ width: 10 }} />
  //         <Styled.LightParagraph>
  //           {data.getChallengeDetail.configuration?.unique_ride
  //             ? 'Tentativa atual'
  //             : 'Meu progresso'}
  //         </Styled.LightParagraph>
  //         <Icons
  //           name={challenge_type === 'altimetric' ? 'mountain' : 'distance'}
  //           color="#0564FF"
  //         />
  //       </Styled.BoxAlignRight>
  //
  //       <Wrapper>
  //         <AnimatedCircularProgress
  //           size={140}
  //           width={10}
  //           fill={Number(progress.toFixed(0))}
  //           tintColor={
  //             Number(progress.toFixed(0)) >= 100 ? '#009D33' : '#0564FF'
  //           }
  //           backgroundColor="rgba(5, 100, 255, 0.2)"
  //           rotation={360}
  //           duration={1000}
  //         >
  //           {(fill) => Fill(fill)}
  //         </AnimatedCircularProgress>
  //       </Wrapper>
  //
  //       <TextWrapper>
  //         <Styled.ParagraphText>
  //           {challenge_type === 'altimetric' ? 'Altimetria' : 'Distância'}
  //         </Styled.ParagraphText>
  //       </TextWrapper>
  //
  //       {progress >= 100 ? (
  //         <Styled.LightParagraph>Completo</Styled.LightParagraph>
  //       ) : (
  //         <BottomInformations />
  //       )}
  //       {isPast(new Date(endDate)) && (
  //         <Subtitle>Este desafio não receberá mais atividades</Subtitle>
  //       )}
  //       {isPast(new Date(endDate)) && (
  //         <FooterWrapper>
  //           <TouchableOpacity>
  //             <Styled.BlueText />
  //           </TouchableOpacity>
  //         </FooterWrapper>
  //       )}
  //
  //       {!isPast(new Date(endDate)) ? (
  //         <FooterWrapper>
  //           <TouchableOpacity
  //             onPress={() => {
  //               if (userChallenges) {
  //                 navigation.navigate('Challenge.UserActivities', {
  //                   challenge_id,
  //                   user_id: userChallenges.getSubscriptionProgress.user.id,
  //                   goal_distance,
  //                   goal_altimetry,
  //                   goal_max_time,
  //                   goal_min_time,
  //                   goal_max_altimetry,
  //                   goal_max_distance,
  //                   type,
  //                   navigation,
  //                   endDate,
  //                   user_challenges: userChallenges,
  //                   data,
  //                 });
  //               }
  //             }}
  //           >
  //             <Styled.BlueText>Ver meu progresso</Styled.BlueText>
  //           </TouchableOpacity>
  //         </FooterWrapper>
  //       ) : null}
  //     </Container>
  //   </TouchableOpacity>
  // );
}
