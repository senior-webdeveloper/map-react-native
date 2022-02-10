import { isFuture, isPast } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ChallengeAwards,
  Maybe,
  UserChallenges,
  UserEventExtraordinaryActionType,
} from '~/graphql/autogenerate/schemas';
import * as Styled from '~/screens/Challenge/Challenge.Description/components/MainScreen/styles';
import { Box, Icons } from '~/components';
import {
  Challenge,
  ChallengeCategories,
  EventSubscriptionPriceType,
  EventSupportPointType,
  ProductImageType,
  ProductPriceType,
  ProductType,
  ProductVariationType,
} from '~/generated/graphql';
import { RootStackParamList } from '~/routes.types';
import { useUserToken } from '~/hooks';
import {
  GetChallengeDetailQuery,
  GetSubscriptionProgressQuery,
  ListCompanyUsersQuery,
} from '~/graphql/autogenerate/operations';

export function BottomOptionsComponent({
  challengeDetail,
  hasSubscribed,
  userChallenges,
  userinfo,
  navigation,
  saveWithdraw,
  subscribe,
  categorySelected,
  companyUsers,
}: {
  challengeDetail: GetChallengeDetailQuery;
  hasSubscribed: boolean;
  userChallenges: GetSubscriptionProgressQuery;
  userinfo: any;
  categorySelected: string;
  companyUsers: ListCompanyUsersQuery | undefined;
  navigation: StackNavigationProp<RootStackParamList, 'Challenge.Description'>;
  saveWithdraw: any;
}) {
  const [isMemberOfThisCompany, setIsMemberOfThisCompany] = useState(false);
  const { profileID, userID } = useUserToken();

  useEffect(() => {
    const element = companyUsers?.listCompanyUsers.find(
      (el) => el.user_id === userID,
    );

    if (element) {
      setIsMemberOfThisCompany(true);
    }
  }, [companyUsers]);

  return (
    <Styled.BoxContainer style={{ paddingHorizontal: 16, marginTop: 16 }}>
      <Styled.BottomOptionsContainer
        onPress={() => {
          navigation.navigate('Challenge.DescriptionInfo', {
            description: `<div>${challengeDetail.getChallengeDetail.description}</div>`,
          });
        }}
      >
        <Box flexDirection="row" alignItems="center">
          <Icons
            name="description"
            width={21}
            color="#4595EC"
            style={{ marginRight: 18 }}
          />
          <Styled.ParagraphText>
            Descrição completa do{' '}
            {challengeDetail.getChallengeDetail.physical_event
              ? 'Evento'
              : 'Desafio'}
          </Styled.ParagraphText>
        </Box>
        <Icons name="chevron-right" />
      </Styled.BottomOptionsContainer>
      {hasSubscribed && (
        <>
          {!isPast(new Date(challengeDetail.getChallengeDetail.end_date)) &&
            !isFuture(
              new Date(challengeDetail.getChallengeDetail.start_date),
            ) && (
              <Styled.BottomOptionsContainer
                onPress={() => {
                  navigation.push('Challenge.ManuallyProgress', {
                    challenge_type:
                      challengeDetail.getChallengeDetail.challenge_type,
                  });
                }}
              >
                <Box flexDirection="row" alignItems="center">
                  <Icons
                    name="upload"
                    width={21}
                    color="#4595EC"
                    style={{ marginRight: 18 }}
                  />
                  <Styled.ParagraphText>
                    Atualizar pedaladas manualmente
                  </Styled.ParagraphText>
                </Box>
                <Icons name="chevron-right" />
              </Styled.BottomOptionsContainer>
            )}

          {userChallenges?.getSubscriptionProgress.activities &&
            userChallenges.getSubscriptionProgress.activities.length > 0 && (
              <Styled.BottomOptionsContainer
                onPress={() => {
                  if (userChallenges?.getSubscriptionProgress) {
                    navigation.navigate('Challenge.UserActivities', {
                      challenge_id: challengeDetail.getChallengeDetail.id,
                      user_id: userID,
                      user_challenges: userChallenges,
                      subscriptionID: userChallenges.getSubscriptionProgress.id,
                      data: challengeDetail,
                      goal_max_altimetry: challengeDetail.getChallengeDetail
                        .has_categories
                        ? challengeDetail.getChallengeDetail.user_challenges
                          ? challengeDetail.getChallengeDetail
                              .user_challenges[0].category
                              ?.category_configuration?.max_altimetry_goal_value
                          : 0
                        : challengeDetail.getChallengeDetail.configuration
                            ?.max_altimetry_goal_value,

                      goal_altimetry: challengeDetail.getChallengeDetail
                        .has_categories
                        ? challengeDetail.getChallengeDetail.user_challenges
                          ? challengeDetail.getChallengeDetail
                              .user_challenges[0].category
                              ?.category_configuration?.altimetry_goal_value
                          : 0
                        : challengeDetail.getChallengeDetail.configuration
                            ?.altimetry_goal_value,

                      goal_max_distance: challengeDetail.getChallengeDetail
                        .has_categories
                        ? challengeDetail.getChallengeDetail.user_challenges[0]
                            .category?.category_configuration
                            ?.max_distance_goal_value
                        : challengeDetail.getChallengeDetail.configuration
                            ?.max_distance_goal_value,
                      goal_distance: challengeDetail.getChallengeDetail
                        .has_categories
                        ? challengeDetail.getChallengeDetail.user_challenges[0]
                            .category?.category_configuration
                            ?.distance_goal_value
                        : challengeDetail.getChallengeDetail.configuration
                            ?.distance_goal_value,

                      goal_max_time: challengeDetail.getChallengeDetail
                        .has_categories
                        ? challengeDetail.getChallengeDetail.user_challenges[0]
                            .category?.category_configuration
                            ?.maximum_time_goal_value
                        : challengeDetail.getChallengeDetail.configuration
                            ?.max_time_goal_value,
                      goal_min_time: challengeDetail.getChallengeDetail
                        .has_categories
                        ? challengeDetail.getChallengeDetail.user_challenges[0]
                            .category?.category_configuration
                            ?.minimum_time_goal_value
                        : challengeDetail.getChallengeDetail.configuration
                            ?.min_time_goal_value,
                    });
                  }
                }}
              >
                <Box flexDirection="row" alignItems="center">
                  <Icons
                    name="information"
                    width={21}
                    style={{ marginRight: 18 }}
                  />
                  <Styled.ParagraphText>
                    Histórico de pedaladas
                  </Styled.ParagraphText>
                </Box>
                <Icons name="chevron-right" />
              </Styled.BottomOptionsContainer>
            )}
        </>
      )}
      {challengeDetail.getChallengeDetail.challenges_attached_files &&
        challengeDetail.getChallengeDetail.challenges_attached_files.length >
          0 && (
          <Styled.BottomOptionsContainer
            onPress={() =>
              navigation.navigate('Challenge.Downloads', {
                challenge_id: challengeDetail.getChallengeDetail.id,
                files:
                  challengeDetail.getChallengeDetail.challenges_attached_files,
              })
            }
          >
            <Box flexDirection="row" alignItems="center">
              <Icons
                name="information"
                width={21}
                style={{ marginRight: 18 }}
              />
              <Styled.ParagraphText>Downloads</Styled.ParagraphText>
            </Box>
            <Icons name="chevron-right" />
          </Styled.BottomOptionsContainer>
        )}

      {challengeDetail.getChallengeDetail.challenges_external_links_attached &&
        challengeDetail.getChallengeDetail.challenges_external_links_attached
          .length > 0 && (
          <Styled.BottomOptionsContainer
            onPress={() =>
              navigation.navigate('Challenge.Links', {
                links:
                  challengeDetail.getChallengeDetail
                    .challenges_external_links_attached,
              })
            }
          >
            <Box flexDirection="row" alignItems="center">
              <Icons
                name="information"
                width={21}
                style={{ marginRight: 18 }}
              />
              <Styled.ParagraphText>Links</Styled.ParagraphText>
            </Box>
            <Icons name="chevron-right" />
          </Styled.BottomOptionsContainer>
        )}

      {challengeDetail.getChallengeDetail.configuration?.is_paid &&
      challengeDetail.getChallengeDetail
        .products_purchased_without_subscription &&
      challengeDetail.getChallengeDetail.products_purchased_without_subscription
        .length > 0 ? (
        <Styled.BottomOptionsContainer
          onPress={() => {
            navigation.push('Products.BuyedProduct', {
              physical_event: challengeDetail.getChallengeDetail.physical_event,
              data: challengeDetail,
              last_payment_id: '',
            });
          }}
        >
          <Box flexDirection="row" alignItems="center">
            <Icons name="information" width={21} style={{ marginRight: 18 }} />
            <Styled.ParagraphText>Minhas compras</Styled.ParagraphText>
          </Box>
          <Icons name="chevron-right" />
        </Styled.BottomOptionsContainer>
      ) : null}

      {challengeDetail.getChallengeDetail.configuration?.is_paid &&
        hasSubscribed && (
          <Styled.BottomOptionsContainer
            onPress={() => {
              saveWithdraw(
                challengeDetail.getChallengeDetail.user_challenges[0]
                  .withdrawal_address,
              );
              navigation.push('Challenge.MyPayment', {
                categorySelected,
                user_challenge_id:
                  challengeDetail.getChallengeDetail.user_challenges[0].id,
                challenge_id: challengeDetail.getChallengeDetail.id,
                physical_event:
                  challengeDetail.getChallengeDetail.physical_event,
                data: challengeDetail,
                subscribe,
                last_payment_id:
                  challengeDetail.getChallengeDetail.user_challenges[0]
                    .last_payment_id,
              });
            }}
          >
            <Box flexDirection="row" alignItems="center">
              <Icons name="ticket" width={21} style={{ marginRight: 18 }} />
              <Styled.ParagraphText>
                Minha inscrição{' '}
                {challengeDetail &&
                challengeDetail?.getChallengeDetail &&
                challengeDetail?.getChallengeDetail?.user_challenges &&
                challengeDetail?.getChallengeDetail?.user_challenges[0]
                  ?.subscription_status?.status_description?.translations[0]
                  .name
                  ? `(${challengeDetail.getChallengeDetail.user_challenges[0].subscription_status?.status_description.translations[0].name})`
                  : null}{' '}
              </Styled.ParagraphText>
            </Box>

            <Icons name="chevron-right" />
          </Styled.BottomOptionsContainer>
        )}

      {challengeDetail.getChallengeDetail.winners &&
        challengeDetail.getChallengeDetail.winners.length > 0 && (
          <Styled.BottomOptionsContainer
            onPress={() => {
              navigation.push('Challenge.Winners', {
                challenge_id: challengeDetail.getChallengeDetail.id,
                isCreator:
                  challengeDetail?.getChallengeDetail.creator_id === userID,
              });
            }}
          >
            <Box flexDirection="row" alignItems="center">
              <Icons
                name="information"
                width={21}
                style={{ marginRight: 18 }}
              />
              <Styled.ParagraphText>Prêmiação</Styled.ParagraphText>
            </Box>
            <Icons name="chevron-right" />
          </Styled.BottomOptionsContainer>
        )}
      {userinfo?.getProfile.user.staff || isMemberOfThisCompany ? (
        <Styled.BottomOptionsContainer
          onPress={() => {
            navigation.push('Challenge.Administration', {
              challenge_id: challengeDetail.getChallengeDetail.id,
              data: challengeDetail,
            });
          }}
        >
          <Box flexDirection="row" alignItems="center">
            <Icons name="information" width={21} style={{ marginRight: 18 }} />
            <Styled.ParagraphText>Area do Organizador</Styled.ParagraphText>
          </Box>
          <Icons name="chevron-right" />
        </Styled.BottomOptionsContainer>
      ) : null}

      {userinfo?.getProfile.user.staff ||
      (hasSubscribed &&
        challengeDetail.getChallengeDetail.has_categories &&
        !isPast(
          new Date(challengeDetail.getChallengeDetail.end_date_registration),
        ) &&
        !isFuture(
          new Date(challengeDetail.getChallengeDetail.start_date_registration),
        ) &&
        !isPast(
          new Date(
            challengeDetail.getChallengeDetail.configuration?.deadline_category_change,
          ),
        ) &&
        challengeDetail.getChallengeDetail.configuration
          ?.allows_category_change) ? (
        <Styled.BottomOptionsContainer
          onPress={() => {
            navigation.push('Challenge.ChangeCategory', {
              user_challenge_id:
                challengeDetail.getChallengeDetail.user_challenges[0].id,
              data: challengeDetail,
            });
          }}
        >
          <Box flexDirection="row" alignItems="center">
            <Icons name="information" width={21} style={{ marginRight: 18 }} />
            <Styled.ParagraphText>Trocar Categoria</Styled.ParagraphText>
          </Box>
          <Icons name="chevron-right" />
        </Styled.BottomOptionsContainer>
      ) : null}

      <Styled.BottomOptionsContainer
        lastOption
        onPress={() => navigation.navigate('Challenge.LegalInfo')}
      >
        <Box flexDirection="row" alignItems="center">
          <Icons
            name="information"
            width={20}
            height={20}
            style={{ marginRight: 18 }}
          />
          <Styled.ParagraphText>Informações importantes</Styled.ParagraphText>
        </Box>

        <Icons name="chevron-right" />
      </Styled.BottomOptionsContainer>
    </Styled.BoxContainer>
  );
}
