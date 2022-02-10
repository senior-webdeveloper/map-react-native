import { addHours, formatDistance, isFuture, isPast } from 'date-fns';
import React from 'react';
import {
  ChallengeAwards,
  UserChallenges,
  UserEventExtraordinaryActionType,
} from '~/graphql/autogenerate/schemas';
import * as Styled from '~/screens/Challenge/Challenge.Description/components/MainScreen/styles';
import ptbr from '~/helpers/dateLocale';

export function ContainerDates(
  data: { __typename?: 'Query' } & {
    getChallengeDetail: { __typename?: 'Challenge' } & Pick<
      Challenge,
      | 'id'
      | 'name'
      | 'creator_id'
      | 'start_date_registration'
      | 'end_date_registration'
      | 'temporarily_unavailable'
      | 'start_date'
      | 'end_date'
      | 'description'
      | 'challenge_type'
      | 'image_avatar'
      | 'image_cover'
      | 'claps_count'
      | 'count_comments'
      | 'count_subscribe'
      | 'count_view'
      | 'physical_event'
      | 'date_for_drawn'
      | 'has_categories'
      | 'isFavorite'
    > & {
        user_extraordinary_actions?: Maybe<
          Array<
            { __typename?: 'UserEventExtraordinaryActionType' } & Pick<
              UserEventExtraordinaryActionType,
              | 'id'
              | 'user_id'
              | 'bonus_subscription'
              | 'buy_after_registration_closes'
            >
          >
        >;
        subscription_prices: Array<
          { __typename?: 'EventSubscriptionPriceType' } & Pick<
            EventSubscriptionPriceType,
            | 'id'
            | 'challenge_id'
            | 'value'
            | 'date_initial'
            | 'active'
            | 'created_at'
            | 'updated_at'
          >
        >;
        support_points?: Maybe<
          Array<
            { __typename?: 'EventSupportPointType' } & Pick<
              EventSupportPointType,
              'id' | 'name' | 'latitude' | 'longitude'
            >
          >
        >;
        products?: Maybe<
          Array<
            { __typename?: 'ProductType' } & Pick<
              ProductType,
              | 'id'
              | 'name'
              | 'description'
              | 'date_initial'
              | 'date_end'
              | 'available'
              | 'order'
              | 'has_cost'
              | 'allow_buy_without_subscription'
              | 'free_field'
              | 'active'
              | 'challenge_id'
            > & {
                prices?: Maybe<
                  Array<
                    { __typename?: 'ProductPriceType' } & Pick<
                      ProductPriceType,
                      'value' | 'date_initial' | 'active'
                    >
                  >
                >;
                images?: Maybe<
                  Array<
                    { __typename?: 'ProductImageType' } & Pick<
                      ProductImageType,
                      'link' | 'order' | 'active'
                    >
                  >
                >;
                variations?: Maybe<
                  Array<
                    { __typename?: 'ProductVariationType' } & Pick<
                      ProductVariationType,
                      | 'id'
                      | 'product_id'
                      | 'text'
                      | 'description'
                      | 'available_quantity'
                      | 'available'
                      | 'order'
                      | 'active'
                    > & {
                        prices?: Maybe<
                          Array<
                            { __typename?: 'ProductVariationPriceType' } & Pick<
                              ProductVariationPriceType,
                              'value' | 'date_initial' | 'active'
                            >
                          >
                        >;
                        images?: Maybe<
                          Array<
                            { __typename?: 'ProductVariationImageType' } & Pick<
                              ProductVariationImageType,
                              'link' | 'order' | 'active'
                            >
                          >
                        >;
                      }
                  >
                >;
              }
          >
        >;
        challenge_images: Array<
          { __typename?: 'ChallengeImages' } & Pick<
            ChallengeImages,
            'id' | 'link' | 'order'
          >
        >;
        challenge_categories: Array<
          { __typename?: 'ChallengeCategories' } & Pick<
            ChallengeCategories,
            'id' | 'name' | 'description'
          > & {
              category_configuration?: Maybe<
                { __typename?: 'CategoryConfiguration' } & Pick<
                  CategoryConfiguration,
                  | 'max_altimetry_goal_value'
                  | 'altimetry_goal_value'
                  | 'max_distance_goal_value'
                  | 'distance_goal_value'
                >
              >;
            }
        >;
        company: { __typename?: 'Company' } & Pick<
          Company,
          'fantasy_name' | 'zip_code'
        > & {
            profile: { __typename?: 'Profile' } & Pick<
              Profile,
              'profile_avatar'
            >;
          };
        configuration?: Maybe<
          { __typename?: 'ChallengeConfiguration' } & Pick<
            ChallengeConfiguration,
            | 'altimetry_goal_value'
            | 'max_altimetry_goal_value'
            | 'distance_goal_value'
            | 'max_distance_goal_value'
            | 'unique_ride'
            | 'accumulation'
            | 'is_paid'
            | 'classification_by_award'
            | 'max_time_goal_value'
            | 'min_time_goal_value'
            | 'allows_category_change'
            | 'deadline_category_change'
          >
        >;
        claps?: Maybe<
          Array<{ __typename?: 'Clap' } & Pick<Clap, 'profile_id' | 'count'>>
        >;
        user_challenges: Array<
          { __typename?: 'UserChallenges' } & Pick<
            UserChallenges,
            | 'id'
            | 'user_id'
            | 'completed'
            | 'registration_date'
            | 'classification'
            | 'paid'
            | 'amount_paid'
            | 'amount_to_pay'
            | 'ready_to_withdraw'
            | 'withdrawal_date'
            | 'short_id'
            | 'created_at'
            | 'last_payment_id'
          > & {
              subscription_status?: Maybe<
                { __typename?: 'SubscriptionStatus' } & {
                  status_description: {
                    __typename?: 'SubscriptionStatusDescription';
                  } & Pick<
                    SubscriptionStatusDescription,
                    'id' | 'code' | 'name' | 'description'
                  > & {
                      translations: Array<
                        { __typename?: 'SubscriptionStatusTranslation' } & Pick<
                          SubscriptionStatusTranslation,
                          'language_code' | 'name' | 'description'
                        >
                      >;
                    };
                }
              >;
              products_bought: Array<
                { __typename?: 'ProductPurchasedType' } & Pick<
                  ProductPurchasedType,
                  'id' | 'value' | 'quantity' | 'free_value'
                > & {
                    product: { __typename?: 'ProductType' } & Pick<
                      ProductType,
                      'id' | 'name'
                    >;
                    variation: { __typename?: 'ProductVariationType' } & Pick<
                      ProductVariationType,
                      'id' | 'text' | 'description'
                    > & {
                        images?: Maybe<
                          Array<
                            { __typename?: 'ProductVariationImageType' } & Pick<
                              ProductVariationImageType,
                              'id' | 'link' | 'active'
                            >
                          >
                        >;
                      };
                  }
              >;
              withdrawal_address?: Maybe<
                { __typename?: 'WithdrawalAddress' } & Pick<
                  WithdrawalAddress,
                  | 'id'
                  | 'name'
                  | 'challenge_id'
                  | 'zip_code'
                  | 'address_line_one'
                  | 'address_line_two'
                  | 'reference_point'
                >
              >;
              category?: Maybe<
                { __typename?: 'ChallengeCategories' } & Pick<
                  ChallengeCategories,
                  'id' | 'name' | 'description'
                > & {
                    category_configuration?: Maybe<
                      { __typename?: 'CategoryConfiguration' } & Pick<
                        CategoryConfiguration,
                        | 'max_altimetry_goal_value'
                        | 'altimetry_goal_value'
                        | 'max_distance_goal_value'
                        | 'distance_goal_value'
                        | 'maximum_time_goal_value'
                        | 'minimum_time_goal_value'
                      >
                    >;
                  }
              >;
            }
        >;
        awards?: Maybe<
          Array<
            { __typename?: 'ChallengeAwards' } & Pick<
              ChallengeAwards,
              | 'id'
              | 'position'
              | 'name'
              | 'description'
              | 'price'
              | 'quantity'
              | 'only_for_draw'
            > & {
                awardAdditionalRequest: Array<
                  { __typename?: 'AwardAdditionalRequests' } & Pick<
                    AwardAdditionalRequests,
                    'additional_request_id'
                  > & {
                      additional_request?: Maybe<
                        { __typename?: 'AdditionalRequest' } & Pick<
                          AdditionalRequest,
                          | 'has_cost'
                          | 'request'
                          | 'image_reference'
                          | 'free_field'
                          | 'price_request'
                        > & {
                            possible_request_response: Array<
                              {
                                __typename?: 'PossiblelRequestResponse';
                              } & Pick<
                                PossiblelRequestResponse,
                                | 'id'
                                | 'price'
                                | 'response'
                                | 'image_reference'
                                | 'additional_request_id'
                              >
                            >;
                          }
                      >;
                    }
                >;
                awardsImages: Array<
                  { __typename?: 'ChallengeAwardsImages' } & Pick<
                    ChallengeAwardsImages,
                    'order' | 'link'
                  >
                >;
              }
          >
        >;
        winners?: Maybe<
          Array<
            { __typename?: 'UserChallenges' } & {
              award?: Maybe<
                { __typename?: 'ChallengeAwards' } & Pick<
                  ChallengeAwards,
                  'name'
                > & {
                    awardsImages: Array<
                      { __typename?: 'ChallengeAwardsImages' } & Pick<
                        ChallengeAwardsImages,
                        'link'
                      >
                    >;
                  }
              >;
              user: { __typename?: 'User' } & Pick<
                User,
                'firstname' | 'lastname' | 'id'
              > & {
                  profile?: Maybe<
                    { __typename?: 'Profile' } & Pick<Profile, 'profile_avatar'>
                  >;
                };
            }
          >
        >;
        challenges_attached_files: Array<
          { __typename?: 'ChallengeAttachedFiles' } & Pick<
            ChallengeAttachedFiles,
            'id' | 'name' | 'description' | 'extension' | 'link'
          >
        >;
        challenges_external_links_attached: Array<
          { __typename?: 'ChallengeExternalLinksAttached' } & Pick<
            ChallengeExternalLinksAttached,
            'id' | 'name' | 'description' | 'favicon_image_link' | 'link'
          >
        >;
        summary: { __typename?: 'ChallengeSummary' } & Pick<
          ChallengeSummary,
          'count_subscribe' | 'count_claps' | 'count_comments'
        >;
        products_purchased_without_subscription: Array<
          { __typename?: 'ProductPurchasedType' } & Pick<
            ProductPurchasedType,
            | 'id'
            | 'product_id'
            | 'value'
            | 'free_value'
            | 'product_variation_id'
            | 'canceled'
            | 'quantity'
          > & {
              related_payment?: Maybe<
                { __typename?: 'ProductPurchasedUserPaymentType' } & {
                  payment: { __typename?: 'Payment' } & Pick<
                    Payment,
                    | 'id'
                    | 'created_at'
                    | 'resource_payment_id'
                    | 'origin_payment_id'
                    | 'payment_processor_id'
                    | 'country_id'
                    | 'bill_expiration_date'
                    | 'value'
                    | 'is_paid'
                    | 'declined'
                    | 'pix_qrcode'
                    | 'pix_expiration_date'
                    | 'returned'
                    | 'entrance'
                    | 'processed'
                    | 'profile_id'
                    | 'user_id'
                    | 'bill_barcode'
                    | 'bill_link'
                    | 'status'
                    | 'updated_at'
                    | 'humanized_message'
                    | 'installments'
                  > & {
                      card?: Maybe<
                        { __typename?: 'Card' } & Pick<
                          Card,
                          'last_digits' | 'brand'
                        >
                      >;
                    };
                }
              >;
              product: { __typename?: 'ProductType' } & Pick<
                ProductType,
                'name' | 'description'
              >;
              variation: { __typename?: 'ProductVariationType' } & Pick<
                ProductVariationType,
                'id' | 'text' | 'description'
              > & {
                  images?: Maybe<
                    Array<
                      { __typename?: 'ProductVariationImageType' } & Pick<
                        ProductVariationImageType,
                        'id' | 'link' | 'order'
                      >
                    >
                  >;
                };
            }
        >;
      };
  },
) {
  return (
    <>
      {(isPast(new Date(data?.getChallengeDetail.start_date)) &&
        isFuture(new Date(data?.getChallengeDetail.end_date))) ||
        (isFuture(new Date(data?.getChallengeDetail.start_date)) &&
          !isPast(new Date(data?.getChallengeDetail.end_date)) && (
            <Styled.BoxWrapper style={{ paddingTop: 10 }}>
              <Styled.BoxContainer
                style={{
                  alignItems: 'center',
                  paddingVertical: 17,
                  width: '100%',
                }}
              >
                {data?.getChallengeDetail.end_date && (
                  <Styled.LightParagraph isCompleted={false}>
                    {isPast(
                      addHours(
                        new Date(data?.getChallengeDetail.start_date),
                        0,
                      ),
                    ) &&
                      isFuture(
                        addHours(
                          new Date(data?.getChallengeDetail.end_date),
                          0,
                        ),
                      ) &&
                      'Este desafio termina em'}
                    {isFuture(
                      addHours(
                        new Date(data?.getChallengeDetail.start_date),
                        0,
                      ),
                    ) &&
                      !isPast(
                        addHours(
                          new Date(data?.getChallengeDetail.end_date),
                          0,
                        ),
                      ) &&
                      (data.getChallengeDetail.physical_event
                        ? 'Este evento acontece em'
                        : 'Este desafio inicia em')}
                  </Styled.LightParagraph>
                )}

                {data?.getChallengeDetail.end_date && (
                  <Styled.ParagraphText>
                    {isFuture(
                      addHours(
                        new Date(data?.getChallengeDetail.start_date),
                        0,
                      ),
                    ) &&
                      `${formatDistance(
                        addHours(
                          new Date(data?.getChallengeDetail.start_date),
                          0,
                        ),
                        new Date(),
                        { locale: ptbr, addSuffix: true },
                      )}`}
                    {isFuture(
                      addHours(new Date(data?.getChallengeDetail.end_date), 0),
                    ) &&
                      isPast(
                        addHours(
                          new Date(data?.getChallengeDetail.start_date),
                          0,
                        ),
                      ) &&
                      `${formatDistance(
                        addHours(
                          new Date(data?.getChallengeDetail.end_date),
                          0,
                        ),
                        new Date(),
                        { locale: ptbr, addSuffix: true },
                      )}`}
                  </Styled.ParagraphText>
                )}
              </Styled.BoxContainer>
            </Styled.BoxWrapper>
          ))}
    </>
  );
}
