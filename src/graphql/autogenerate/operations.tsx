import * as Types from './schemas';

export type CreateMonitorActivityMutationVariables = Types.Exact<{
  data: Types.CreateMonitorActivityInput;
}>;


export type CreateMonitorActivityMutation = (
  { __typename?: 'Mutation' }
  & { createMonitorActivity: (
    { __typename?: 'Activity' }
    & Pick<Types.Activity, 'id' | 'name'>
  ) }
);

export type SendActivityToProviderMutationVariables = Types.Exact<{
  data: Types.SendActivityToProviderInput;
}>;


export type SendActivityToProviderMutation = (
  { __typename?: 'Mutation' }
  & { sendActivityToProvider: (
    { __typename?: 'SendActivityToProviderResponse' }
    & Pick<Types.SendActivityToProviderResponse, 'status' | 'message'>
  ) }
);

export type BuyAwardUserAlreadySubscribedMutationVariables = Types.Exact<{
  shipping_address_id?: Types.Maybe<Types.Scalars['String']>;
  products_purchased?: Types.Maybe<Array<Types.ProductPurchasedInput> | Types.ProductPurchasedInput>;
  award_data?: Types.Maybe<Types.ChallengePaymentInput>;
  payment_data?: Types.Maybe<Types.PaymentInput>;
  data: Types.SubscribeUserChallengeInput;
}>;


export type BuyAwardUserAlreadySubscribedMutation = (
  { __typename?: 'Mutation' }
  & { buyAwardUserAlreadySubscribed: (
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'id' | 'challenge_id' | 'user_id' | 'payment_id'>
  ) }
);

export type ListChallengeAwardWinnersQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type ListChallengeAwardWinnersQuery = (
  { __typename?: 'Query' }
  & { listChallengeAwardWinners: Array<(
    { __typename?: 'UserChallenges' }
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstname' | 'lastname' | 'legal_registry_number' | 'zip_code' | 'address_line_one' | 'address_line_two' | 'email' | 'phone'>
      & { city?: Types.Maybe<(
        { __typename?: 'City' }
        & Pick<Types.City, 'name'>
        & { state: (
          { __typename?: 'State' }
          & Pick<Types.State, 'abbreviation'>
        ) }
      )>, profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'id' | 'username' | 'profile_avatar'>
      )> }
    ), award?: Types.Maybe<(
      { __typename?: 'ChallengeAwards' }
      & Pick<Types.ChallengeAwards, 'name'>
      & { awardsImages: Array<(
        { __typename?: 'ChallengeAwardsImages' }
        & Pick<Types.ChallengeAwardsImages, 'link'>
      )> }
    )> }
  )> }
);

export type AddFavoriteChallegeMutationVariables = Types.Exact<{
  data: Types.FavoriteUserChallengeInput;
}>;


export type AddFavoriteChallegeMutation = (
  { __typename?: 'Mutation' }
  & { addfavoriteChallenge: (
    { __typename?: 'FavoriteUserChallenge' }
    & Pick<Types.FavoriteUserChallenge, 'challenge_id'>
  ) }
);

export type ChangeSubscriptionCategoryMutationVariables = Types.Exact<{
  data: Types.ChangeSubscriptionCategoryInput;
}>;


export type ChangeSubscriptionCategoryMutation = (
  { __typename?: 'Mutation' }
  & { changeSubscriptionCategory: (
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'id'>
  ) }
);

export type CreateClapMutationVariables = Types.Exact<{
  data: Types.CreateClapInput;
}>;


export type CreateClapMutation = (
  { __typename?: 'Mutation' }
  & { createClap: (
    { __typename?: 'Clap' }
    & Pick<Types.Clap, 'count'>
  ) }
);

export type CreateCommentClapMutationVariables = Types.Exact<{
  data: Types.CreateCommentClapInput;
}>;


export type CreateCommentClapMutation = (
  { __typename?: 'Mutation' }
  & { createCommentClap: (
    { __typename?: 'CommentClap' }
    & Pick<Types.CommentClap, 'challenge_comment_id' | 'profile_id' | 'count'>
  ) }
);

export type CreateUserPassageAtSupportPointMutationVariables = Types.Exact<{
  passages_registered: Array<Types.CreateUserEventSupportPointInput> | Types.CreateUserEventSupportPointInput;
}>;


export type CreateUserPassageAtSupportPointMutation = (
  { __typename?: 'Mutation' }
  & { createUserPassageAtSupportPoint: (
    { __typename?: 'PointsPassageResponse' }
    & Pick<Types.PointsPassageResponse, 'status' | 'message'>
  ) }
);

export type DeleteChallengeProgressActivityV2MutationVariables = Types.Exact<{
  data: Types.DeleteUserChallengeActivityInput;
}>;


export type DeleteChallengeProgressActivityV2Mutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'deleteChallengeProgressActivityV2'>
);

export type DeleteCommentMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteCommentMutation = (
  { __typename?: 'Mutation' }
  & { deleteComment: (
    { __typename?: 'Comment' }
    & Pick<Types.Comment, 'id'>
  ) }
);

export type DeleteFavoriteChallengeMutationVariables = Types.Exact<{
  data: Types.FavoriteUserChallengeInput;
}>;


export type DeleteFavoriteChallengeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'deleteFavoriteChallenge'>
);

export type ExploreChallengesV2QueryVariables = Types.Exact<{
  profile_id: Types.Scalars['String'];
  page: Types.Scalars['Float'];
}>;


export type ExploreChallengesV2Query = (
  { __typename?: 'Query' }
  & { exploreChallengesV2: (
    { __typename?: 'ChallengeShowCaseResponse' }
    & { page_info: (
      { __typename?: 'PaginationInfo' }
      & Pick<Types.PaginationInfo, 'current_page' | 'offset' | 'total_item_count' | 'has_next_page' | 'has_previous_page'>
    ), items: Array<(
      { __typename?: 'ChallengeShowCaseType' }
      & Pick<Types.ChallengeShowCaseType, 'name' | 'key' | 'type'>
      & { content: Array<(
        { __typename?: 'Challenge' }
        & Pick<Types.Challenge, 'id' | 'eligible_spotlight' | 'name' | 'image_avatar' | 'image_cover' | 'physical_event'>
        & { configuration?: Types.Maybe<(
          { __typename?: 'ChallengeConfiguration' }
          & Pick<Types.ChallengeConfiguration, 'is_paid'>
        )> }
      )> }
    )> }
  ) }
);

export type FindAllUsersCurrentPointQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type FindAllUsersCurrentPointQuery = (
  { __typename?: 'Query' }
  & { findAllUsersCurrentPoint: Array<(
    { __typename?: 'UserEventSupportPointType' }
    & Pick<Types.UserEventSupportPointType, 'check_time' | 'event_support_point_id'>
    & { support_point: (
      { __typename?: 'EventSupportPointType' }
      & Pick<Types.EventSupportPointType, 'name'>
    ), subscription: (
      { __typename?: 'UserChallenges' }
      & Pick<Types.UserChallenges, 'athlete_identification' | 'short_id'>
      & { category?: Types.Maybe<(
        { __typename?: 'ChallengeCategories' }
        & Pick<Types.ChallengeCategories, 'id' | 'order' | 'name'>
      )>, user: (
        { __typename?: 'User' }
        & Pick<Types.User, 'firstname' | 'lastname'>
        & { profile?: Types.Maybe<(
          { __typename?: 'Profile' }
          & Pick<Types.Profile, 'profile_avatar'>
        )> }
      ) }
    ) }
  )> }
);

export type FindEventSupportPointsQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type FindEventSupportPointsQuery = (
  { __typename?: 'Query' }
  & { findEventSupportPoints: Array<(
    { __typename?: 'EventSupportPointType' }
    & Pick<Types.EventSupportPointType, 'id' | 'name' | 'latitude' | 'longitude'>
  )> }
);

export type GetActiveUserChallengesQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  user_id?: Types.Maybe<Types.Scalars['String']>;
  profile_id: Types.Scalars['String'];
}>;


export type GetActiveUserChallengesQuery = (
  { __typename?: 'Query' }
  & { getActiveUserChallenges: Array<(
    { __typename?: 'Challenge' }
    & Pick<Types.Challenge, 'id' | 'name' | 'challenge_type' | 'creator_id' | 'image_avatar' | 'image_cover' | 'isFavorite'>
    & { creator: (
      { __typename?: 'User' }
      & { profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'profile_avatar'>
      )> }
    ) }
  )> }
);

export type GetActivityDetailQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetActivityDetailQuery = (
  { __typename?: 'Query' }
  & { getActivityDetail: (
    { __typename?: 'Activity' }
    & Pick<Types.Activity, 'name' | 'distance' | 'resource_state' | 'external_id' | 'third_party_data_source_slug' | 'upload_id' | 'total_elevation_gain' | 'moving_time_seconds' | 'id' | 'average_speed' | 'suspicious' | 'duplicated' | 'calories' | 'start_date' | 'start_date_local' | 'elapsed_time_seconds' | 'polyline' | 'bounds' | 'summary_polyline'>
    & { activity_sent_third_party?: Types.Maybe<Array<(
      { __typename?: 'ActivitySentThirdPartyType' }
      & Pick<Types.ActivitySentThirdPartyType, 'third_party_data_source_id' | 'done'>
    )>>, challenges: Array<(
      { __typename?: 'Challenge' }
      & Pick<Types.Challenge, 'id' | 'name' | 'image_avatar'>
    )>, user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstname' | 'lastname'>
      & { profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'id' | 'username' | 'profile_avatar'>
      )> }
    ) }
  ) }
);

export type AllChallengeAttachedFilesQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  challenge_id: Types.Scalars['String'];
}>;


export type AllChallengeAttachedFilesQuery = (
  { __typename?: 'Query' }
  & { allChallengeAttachedFiles: Array<(
    { __typename?: 'ChallengeAttachedFiles' }
    & Pick<Types.ChallengeAttachedFiles, 'id' | 'name' | 'description' | 'extension' | 'link'>
  )> }
);

export type GetCommentsQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
  pagination: Types.PaginationInput;
}>;


export type GetCommentsQuery = (
  { __typename?: 'Query' }
  & { getChallengeComments: Array<(
    { __typename?: 'Comment' }
    & Pick<Types.Comment, 'id' | 'challenge_id' | 'claps_count' | 'created_at' | 'text'>
    & { profile: (
      { __typename?: 'Profile' }
      & Pick<Types.Profile, 'id' | 'username' | 'profile_avatar'>
    ), childComments?: Types.Maybe<Array<(
      { __typename?: 'Comment' }
      & Pick<Types.Comment, 'id' | 'text' | 'created_at' | 'claps_count'>
      & { profile: (
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'id' | 'username' | 'profile_avatar'>
      ), claps?: Types.Maybe<Array<(
        { __typename?: 'CommentClap' }
        & Pick<Types.CommentClap, 'profile_id' | 'count'>
      )>> }
    )>>, claps?: Types.Maybe<Array<(
      { __typename?: 'CommentClap' }
      & Pick<Types.CommentClap, 'profile_id' | 'count'>
    )>> }
  )> }
);

export type GetChallengeImagesQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type GetChallengeImagesQuery = (
  { __typename?: 'Query' }
  & { getChallengeImages: Array<(
    { __typename?: 'ChallengeImages' }
    & Pick<Types.ChallengeImages, 'id' | 'link' | 'order'>
  )> }
);

export type GetChallengeRankInformationQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type GetChallengeRankInformationQuery = (
  { __typename?: 'Query' }
  & { getChallengeRankInformation: (
    { __typename?: 'ChallengeRankSummaryResponse' }
    & { subscribed_highlights: (
      { __typename?: 'HighlightsOfCchallengeInRankResponse' }
      & { highlight_by_greater_distance?: Types.Maybe<(
        { __typename?: 'UserChallenges' }
        & Pick<Types.UserChallenges, 'total_distance'>
        & { user: (
          { __typename?: 'User' }
          & Pick<Types.User, 'firstname' | 'lastname'>
          & { profile?: Types.Maybe<(
            { __typename?: 'Profile' }
            & Pick<Types.Profile, 'profile_avatar' | 'username' | 'user_id'>
          )> }
        ) }
      )>, highlight_by_greater_altimetry?: Types.Maybe<(
        { __typename?: 'UserChallenges' }
        & Pick<Types.UserChallenges, 'total_altimetry'>
        & { user: (
          { __typename?: 'User' }
          & Pick<Types.User, 'firstname' | 'lastname'>
          & { profile?: Types.Maybe<(
            { __typename?: 'Profile' }
            & Pick<Types.Profile, 'profile_avatar' | 'username' | 'user_id'>
          )> }
        ) }
      )>, highlight_by_greater_ride?: Types.Maybe<(
        { __typename?: 'UserChallenges' }
        & { user: (
          { __typename?: 'User' }
          & Pick<Types.User, 'firstname' | 'lastname'>
          & { profile?: Types.Maybe<(
            { __typename?: 'Profile' }
            & Pick<Types.Profile, 'profile_avatar' | 'username' | 'user_id'>
          )> }
        ), activities?: Types.Maybe<Array<(
          { __typename?: 'ChallengeActivity' }
          & { activity: (
            { __typename?: 'Activity' }
            & Pick<Types.Activity, 'name' | 'distance'>
          ) }
        )>> }
      )>, highlight_by_greater_total_time?: Types.Maybe<(
        { __typename?: 'UserChallenges' }
        & Pick<Types.UserChallenges, 'total_time_seconds'>
        & { user: (
          { __typename?: 'User' }
          & Pick<Types.User, 'firstname' | 'lastname'>
          & { profile?: Types.Maybe<(
            { __typename?: 'Profile' }
            & Pick<Types.Profile, 'profile_avatar' | 'username' | 'user_id'>
          )> }
        ) }
      )> }
    ), challenge_statistics: (
      { __typename?: 'ChallengeStatisticsResponse' }
      & Pick<Types.ChallengeStatisticsResponse, 'total_distance' | 'total_altimetry' | 'total_time_ride' | 'total_rides'>
    ), participants_statistics: (
      { __typename?: 'ChallengeParticipantsStatisticsResponse' }
      & Pick<Types.ChallengeParticipantsStatisticsResponse, 'count_subscribers' | 'count_followed_by_me' | 'count_who_followe_me' | 'count_gender_male' | 'count_gender_female'>
    ) }
  ) }
);

export type GetChallengeRanksQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  data: Types.GetRanksInput;
}>;


export type GetChallengeRanksQuery = (
  { __typename?: 'Query' }
  & { getChallengeRanks: Array<(
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'id' | 'user_id' | 'registration_date' | 'end_date' | 'total_time_seconds' | 'total_distance' | 'total_altimetry' | 'total_rides' | 'classification' | 'completed'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstname' | 'lastname'>
      & { profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'id' | 'username' | 'profile_avatar'>
      )> }
    ) }
  )> }
);

export type GetChallengeSubscriptionsQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type GetChallengeSubscriptionsQuery = (
  { __typename?: 'Query' }
  & { getChallengeSubscriptions: Array<(
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'registration_date'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstname' | 'lastname'>
      & { profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'id' | 'username' | 'profile_avatar'>
      )> }
    ) }
  )> }
);

export type GetChallengeWithdrawalAddressesQueryVariables = Types.Exact<{
  data: Types.FindWithdrawalAddressesInput;
}>;


export type GetChallengeWithdrawalAddressesQuery = (
  { __typename?: 'Query' }
  & { getChallengeWithdrawalAddresses: Array<(
    { __typename?: 'WithdrawalAddress' }
    & Pick<Types.WithdrawalAddress, 'name' | 'id' | 'zip_code' | 'address_line_one' | 'address_line_two' | 'reference_point' | 'city_id'>
    & { city: (
      { __typename?: 'City' }
      & Pick<Types.City, 'name'>
      & { state: (
        { __typename?: 'State' }
        & Pick<Types.State, 'abbreviation'>
      ) }
    ) }
  )> }
);

export type GetChallengeDetailQueryVariables = Types.Exact<{
  data: Types.GetChallengeDetailInput;
}>;


export type GetChallengeDetailQuery = (
  { __typename?: 'Query' }
  & { getChallengeDetail: (
    { __typename?: 'Challenge' }
    & Pick<Types.Challenge, 'id' | 'name' | 'creator_id' | 'start_date_registration' | 'end_date_registration' | 'temporarily_unavailable' | 'start_date' | 'end_date' | 'description' | 'challenge_type' | 'image_avatar' | 'image_cover' | 'claps_count' | 'count_comments' | 'count_subscribe' | 'count_view' | 'physical_event' | 'date_for_drawn' | 'has_categories' | 'isFavorite'>
    & { user_extraordinary_actions?: Types.Maybe<Array<(
      { __typename?: 'UserEventExtraordinaryActionType' }
      & Pick<Types.UserEventExtraordinaryActionType, 'id' | 'user_id' | 'bonus_subscription' | 'buy_after_registration_closes'>
    )>>, subscription_prices: Array<(
      { __typename?: 'EventSubscriptionPriceType' }
      & Pick<Types.EventSubscriptionPriceType, 'id' | 'challenge_id' | 'value' | 'date_initial' | 'active' | 'created_at' | 'updated_at'>
    )>, support_points?: Types.Maybe<Array<(
      { __typename?: 'EventSupportPointType' }
      & Pick<Types.EventSupportPointType, 'id' | 'name' | 'latitude' | 'longitude'>
    )>>, products?: Types.Maybe<Array<(
      { __typename?: 'ProductType' }
      & Pick<Types.ProductType, 'id' | 'only_award' | 'name' | 'description' | 'date_initial' | 'date_end' | 'available' | 'order' | 'has_cost' | 'allow_buy_without_subscription' | 'free_field' | 'active' | 'challenge_id'>
      & { awards_products?: Types.Maybe<(
        { __typename?: 'AwardProductType' }
        & Pick<Types.AwardProductType, 'award_id'>
      )>, prices?: Types.Maybe<Array<(
        { __typename?: 'ProductPriceType' }
        & Pick<Types.ProductPriceType, 'value' | 'date_initial' | 'active'>
      )>>, images?: Types.Maybe<Array<(
        { __typename?: 'ProductImageType' }
        & Pick<Types.ProductImageType, 'link' | 'order' | 'active'>
      )>>, variations?: Types.Maybe<Array<(
        { __typename?: 'ProductVariationType' }
        & Pick<Types.ProductVariationType, 'id' | 'product_id' | 'text' | 'description' | 'available_quantity' | 'available' | 'order' | 'active'>
        & { prices?: Types.Maybe<Array<(
          { __typename?: 'ProductVariationPriceType' }
          & Pick<Types.ProductVariationPriceType, 'value' | 'date_initial' | 'active'>
        )>>, images?: Types.Maybe<Array<(
          { __typename?: 'ProductVariationImageType' }
          & Pick<Types.ProductVariationImageType, 'link' | 'order' | 'active'>
        )>> }
      )>> }
    )>>, challenge_images: Array<(
      { __typename?: 'ChallengeImages' }
      & Pick<Types.ChallengeImages, 'id' | 'link' | 'order'>
    )>, challenge_categories: Array<(
      { __typename?: 'ChallengeCategories' }
      & Pick<Types.ChallengeCategories, 'id' | 'name' | 'description'>
      & { category_configuration?: Types.Maybe<(
        { __typename?: 'CategoryConfiguration' }
        & Pick<Types.CategoryConfiguration, 'max_altimetry_goal_value' | 'altimetry_goal_value' | 'max_distance_goal_value' | 'distance_goal_value'>
      )> }
    )>, company: (
      { __typename?: 'Company' }
      & Pick<Types.Company, 'id' | 'fantasy_name' | 'zip_code'>
      & { profile: (
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'profile_avatar'>
      ) }
    ), configuration?: Types.Maybe<(
      { __typename?: 'ChallengeConfiguration' }
      & Pick<Types.ChallengeConfiguration, 'altimetry_goal_value' | 'max_altimetry_goal_value' | 'distance_goal_value' | 'max_distance_goal_value' | 'unique_ride' | 'accumulation' | 'is_paid' | 'classification_by_award' | 'max_time_goal_value' | 'min_time_goal_value' | 'allows_category_change' | 'has_paid_kit' | 'deadline_category_change'>
    )>, claps?: Types.Maybe<Array<(
      { __typename?: 'Clap' }
      & Pick<Types.Clap, 'profile_id' | 'count'>
    )>>, user_challenges: Array<(
      { __typename?: 'UserChallenges' }
      & Pick<Types.UserChallenges, 'id' | 'user_id' | 'completed' | 'registration_date' | 'classification' | 'paid' | 'amount_paid' | 'amount_to_pay' | 'ready_to_withdraw' | 'withdrawal_date' | 'short_id' | 'created_at' | 'last_payment_id'>
      & { subscription_status?: Types.Maybe<(
        { __typename?: 'SubscriptionStatus' }
        & { status_description: (
          { __typename?: 'SubscriptionStatusDescription' }
          & Pick<Types.SubscriptionStatusDescription, 'id' | 'code' | 'name' | 'description'>
          & { translations: Array<(
            { __typename?: 'SubscriptionStatusTranslation' }
            & Pick<Types.SubscriptionStatusTranslation, 'language_code' | 'name' | 'description'>
          )> }
        ) }
      )>, products_bought: Array<(
        { __typename?: 'ProductPurchasedType' }
        & Pick<Types.ProductPurchasedType, 'id' | 'value' | 'quantity' | 'free_value' | 'user_challenge_id'>
        & { related_payment?: Types.Maybe<(
          { __typename?: 'ProductPurchasedUserPaymentType' }
          & { payment: (
            { __typename?: 'Payment' }
            & Pick<Types.Payment, 'is_paid'>
          ) }
        )>, product: (
          { __typename?: 'ProductType' }
          & Pick<Types.ProductType, 'id' | 'name'>
        ), variation: (
          { __typename?: 'ProductVariationType' }
          & Pick<Types.ProductVariationType, 'id' | 'text' | 'description'>
          & { images?: Types.Maybe<Array<(
            { __typename?: 'ProductVariationImageType' }
            & Pick<Types.ProductVariationImageType, 'id' | 'link' | 'active'>
          )>> }
        ) }
      )>, withdrawal_address?: Types.Maybe<(
        { __typename?: 'WithdrawalAddress' }
        & Pick<Types.WithdrawalAddress, 'id' | 'name' | 'challenge_id' | 'zip_code' | 'address_line_one' | 'address_line_two' | 'reference_point'>
      )>, category?: Types.Maybe<(
        { __typename?: 'ChallengeCategories' }
        & Pick<Types.ChallengeCategories, 'id' | 'name' | 'description'>
        & { category_configuration?: Types.Maybe<(
          { __typename?: 'CategoryConfiguration' }
          & Pick<Types.CategoryConfiguration, 'max_altimetry_goal_value' | 'altimetry_goal_value' | 'max_distance_goal_value' | 'distance_goal_value' | 'maximum_time_goal_value' | 'minimum_time_goal_value'>
        )> }
      )> }
    )>, awards?: Types.Maybe<Array<(
      { __typename?: 'ChallengeAwards' }
      & Pick<Types.ChallengeAwards, 'id' | 'position' | 'name' | 'description' | 'price' | 'quantity' | 'only_for_draw'>
      & { awards_products?: Types.Maybe<Array<(
        { __typename?: 'AwardProductType' }
        & { product: (
          { __typename?: 'ProductType' }
          & Pick<Types.ProductType, 'name'>
          & { images?: Types.Maybe<Array<(
            { __typename?: 'ProductImageType' }
            & Pick<Types.ProductImageType, 'link' | 'order'>
          )>> }
        ) }
      )>>, award_volumes?: Types.Maybe<Array<(
        { __typename?: 'AwardVolume' }
        & Pick<Types.AwardVolume, 'id' | 'height' | 'width' | 'weight' | 'depth'>
      )>>, awardsImages: Array<(
        { __typename?: 'ChallengeAwardsImages' }
        & Pick<Types.ChallengeAwardsImages, 'order' | 'link'>
      )> }
    )>>, winners?: Types.Maybe<Array<(
      { __typename?: 'UserChallenges' }
      & { award?: Types.Maybe<(
        { __typename?: 'ChallengeAwards' }
        & Pick<Types.ChallengeAwards, 'name'>
        & { awardsImages: Array<(
          { __typename?: 'ChallengeAwardsImages' }
          & Pick<Types.ChallengeAwardsImages, 'link'>
        )> }
      )>, user: (
        { __typename?: 'User' }
        & Pick<Types.User, 'firstname' | 'lastname' | 'id'>
        & { profile?: Types.Maybe<(
          { __typename?: 'Profile' }
          & Pick<Types.Profile, 'profile_avatar'>
        )> }
      ) }
    )>>, challenges_attached_files: Array<(
      { __typename?: 'ChallengeAttachedFiles' }
      & Pick<Types.ChallengeAttachedFiles, 'id' | 'name' | 'description' | 'extension' | 'link'>
    )>, challenges_external_links_attached: Array<(
      { __typename?: 'ChallengeExternalLinksAttached' }
      & Pick<Types.ChallengeExternalLinksAttached, 'id' | 'name' | 'description' | 'favicon_image_link' | 'link'>
    )>, summary: (
      { __typename?: 'ChallengeSummary' }
      & Pick<Types.ChallengeSummary, 'count_subscribe' | 'count_claps' | 'count_comments'>
    ), products_purchased_without_subscription: Array<(
      { __typename?: 'ProductPurchasedType' }
      & Pick<Types.ProductPurchasedType, 'id' | 'product_id' | 'value' | 'free_value' | 'product_variation_id' | 'canceled' | 'quantity'>
      & { related_payment?: Types.Maybe<(
        { __typename?: 'ProductPurchasedUserPaymentType' }
        & { payment: (
          { __typename?: 'Payment' }
          & Pick<Types.Payment, 'id' | 'created_at' | 'resource_payment_id' | 'origin_payment_id' | 'payment_processor_id' | 'country_id' | 'bill_expiration_date' | 'value' | 'is_paid' | 'declined' | 'pix_qrcode' | 'pix_expiration_date' | 'returned' | 'entrance' | 'processed' | 'profile_id' | 'user_id' | 'bill_barcode' | 'bill_link' | 'status' | 'updated_at' | 'humanized_message' | 'installments'>
          & { card?: Types.Maybe<(
            { __typename?: 'Card' }
            & Pick<Types.Card, 'last_digits' | 'brand'>
          )> }
        ) }
      )>, product: (
        { __typename?: 'ProductType' }
        & Pick<Types.ProductType, 'name' | 'description'>
      ), variation: (
        { __typename?: 'ProductVariationType' }
        & Pick<Types.ProductVariationType, 'id' | 'text' | 'description'>
        & { images?: Types.Maybe<Array<(
          { __typename?: 'ProductVariationImageType' }
          & Pick<Types.ProductVariationImageType, 'id' | 'link' | 'order'>
        )>> }
      ) }
    )> }
  ) }
);

export type GetDetailedSubscriptionQueryVariables = Types.Exact<{
  data: Types.GetDetailedSubscriptionInput;
}>;


export type GetDetailedSubscriptionQuery = (
  { __typename?: 'Query' }
  & { getDetailedSubscription: (
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'id' | 'user_id' | 'challenge_category_id' | 'short_id' | 'paid' | 'amount_paid' | 'last_payment_id' | 'amount_to_pay' | 'created_at'>
    & { subscription_status?: Types.Maybe<(
      { __typename?: 'SubscriptionStatus' }
      & { status_description: (
        { __typename?: 'SubscriptionStatusDescription' }
        & { translations: Array<(
          { __typename?: 'SubscriptionStatusTranslation' }
          & Pick<Types.SubscriptionStatusTranslation, 'name'>
        )> }
      ) }
    )>, products_bought: Array<(
      { __typename?: 'ProductPurchasedType' }
      & Pick<Types.ProductPurchasedType, 'id' | 'value' | 'quantity' | 'free_value'>
      & { product: (
        { __typename?: 'ProductType' }
        & Pick<Types.ProductType, 'id' | 'name'>
        & { images?: Types.Maybe<Array<(
          { __typename?: 'ProductImageType' }
          & Pick<Types.ProductImageType, 'id' | 'link'>
        )>> }
      ), variation: (
        { __typename?: 'ProductVariationType' }
        & Pick<Types.ProductVariationType, 'id' | 'text' | 'description'>
        & { images?: Types.Maybe<Array<(
          { __typename?: 'ProductVariationImageType' }
          & Pick<Types.ProductVariationImageType, 'id' | 'link' | 'active'>
        )>> }
      ) }
    )>, award_subscription_references?: Types.Maybe<Array<(
      { __typename?: 'AwardSubscription' }
      & { award: (
        { __typename?: 'ChallengeAwards' }
        & Pick<Types.ChallengeAwards, 'name' | 'price'>
      ) }
    )>>, last_payment?: Types.Maybe<(
      { __typename?: 'Payment' }
      & Pick<Types.Payment, 'id' | 'interest_free_amount' | 'pix_qrcode' | 'pix_expiration_date' | 'created_at' | 'resource_payment_id' | 'origin_payment_id' | 'payment_processor_id' | 'country_id' | 'bill_expiration_date' | 'value' | 'is_paid' | 'declined' | 'returned' | 'entrance' | 'processed' | 'origin_resource_id' | 'profile_id' | 'user_id' | 'status' | 'installments' | 'bill_link' | 'updated_at'>
      & { card?: Types.Maybe<(
        { __typename?: 'Card' }
        & Pick<Types.Card, 'last_digits' | 'brand'>
      )> }
    )>, category?: Types.Maybe<(
      { __typename?: 'ChallengeCategories' }
      & Pick<Types.ChallengeCategories, 'id' | 'name' | 'order'>
    )>, user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstname' | 'lastname' | 'date_of_birth' | 'legal_registry_number' | 'team_name' | 'gender' | 'phone'>
      & { city?: Types.Maybe<(
        { __typename?: 'City' }
        & Pick<Types.City, 'name'>
        & { state: (
          { __typename?: 'State' }
          & Pick<Types.State, 'name'>
        ) }
      )>, profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'profile_avatar'>
      )> }
    ) }
  ) }
);

export type GetSubscriptionPaymentsQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type GetSubscriptionPaymentsQuery = (
  { __typename?: 'Query' }
  & { getSubscriptionPayments: Array<(
    { __typename?: 'SubscriptionPayment' }
    & Pick<Types.SubscriptionPayment, 'id' | 'payment_id' | 'award_id'>
    & { payment: (
      { __typename?: 'Payment' }
      & Pick<Types.Payment, 'id' | 'resource_payment_id' | 'origin_payment_id' | 'payment_processor_id' | 'country_id' | 'bill_expiration_date' | 'value' | 'is_paid' | 'declined' | 'returned' | 'entrance' | 'processed' | 'origin_resource_id' | 'profile_id' | 'user_id' | 'status' | 'installments' | 'bill_link' | 'created_at' | 'updated_at'>
      & { card?: Types.Maybe<(
        { __typename?: 'Card' }
        & Pick<Types.Card, 'last_digits' | 'brand'>
      )> }
    ), award: (
      { __typename?: 'ChallengeAwards' }
      & Pick<Types.ChallengeAwards, 'id' | 'name' | 'description' | 'price' | 'challenge_id'>
      & { awardsImages: Array<(
        { __typename?: 'ChallengeAwardsImages' }
        & Pick<Types.ChallengeAwardsImages, 'link'>
      )> }
    ) }
  )> }
);

export type GetSubscriptionProgressQueryVariables = Types.Exact<{
  data: Types.GetUserChallengeProgressInput;
}>;


export type GetSubscriptionProgressQuery = (
  { __typename?: 'Query' }
  & { getSubscriptionProgress: (
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'id' | 'challenge_id' | 'classification' | 'completed' | 'total_time_seconds' | 'total_distance' | 'total_altimetry' | 'total_rides' | 'paid'>
    & { category?: Types.Maybe<(
      { __typename?: 'ChallengeCategories' }
      & Pick<Types.ChallengeCategories, 'id'>
      & { category_configuration?: Types.Maybe<(
        { __typename?: 'CategoryConfiguration' }
        & Pick<Types.CategoryConfiguration, 'altimetry_goal_value' | 'distance_goal_value' | 'maximum_time_goal_value' | 'minimum_time_goal_value'>
      )> }
    )>, user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstname' | 'lastname'>
      & { profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'id' | 'username' | 'profile_avatar'>
      )> }
    ), activities?: Types.Maybe<Array<(
      { __typename?: 'ChallengeActivity' }
      & { activity: (
        { __typename?: 'Activity' }
        & Pick<Types.Activity, 'id' | 'third_party_data_source_slug' | 'name' | 'distance' | 'start_date_local' | 'start_date' | 'elapsed_time_seconds' | 'total_elevation_gain' | 'calories' | 'user_id'>
      ) }
    )>>, challenge: (
      { __typename?: 'Challenge' }
      & Pick<Types.Challenge, 'name' | 'image_avatar' | 'start_date' | 'end_date' | 'challenge_type'>
      & { configuration?: Types.Maybe<(
        { __typename?: 'ChallengeConfiguration' }
        & Pick<Types.ChallengeConfiguration, 'distance_goal_value' | 'altimetry_goal_value'>
      )> }
    ) }
  ) }
);

export type GetSubscriptionsOfAChallengeQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  data: Types.ListChallengeSubscriptionsInput;
}>;


export type GetSubscriptionsOfAChallengeQuery = (
  { __typename?: 'Query' }
  & { getSubscriptionsOfAChallenge: (
    { __typename?: 'SubscriptionsPaginatedResponse' }
    & { page_info: (
      { __typename?: 'PaginationInfo' }
      & Pick<Types.PaginationInfo, 'current_page' | 'offset' | 'total_item_count' | 'has_next_page' | 'has_previous_page'>
    ), subscriptions: Array<(
      { __typename?: 'UserChallenges' }
      & Pick<Types.UserChallenges, 'id' | 'paid' | 'short_id'>
      & { last_payment?: Types.Maybe<(
        { __typename?: 'Payment' }
        & Pick<Types.Payment, 'status'>
      )>, user: (
        { __typename?: 'User' }
        & Pick<Types.User, 'id' | 'firstname' | 'lastname'>
        & { profile?: Types.Maybe<(
          { __typename?: 'Profile' }
          & Pick<Types.Profile, 'profile_avatar'>
        )>, city?: Types.Maybe<(
          { __typename?: 'City' }
          & Pick<Types.City, 'name'>
          & { state: (
            { __typename?: 'State' }
            & Pick<Types.State, 'name'>
          ) }
        )> }
      ) }
    )> }
  ) }
);

export type GetUserChallengeProgressQueryVariables = Types.Exact<{
  data: Types.GetUserChallengeProgressInput;
}>;


export type GetUserChallengeProgressQuery = (
  { __typename?: 'Query' }
  & { getUserChallengeProgress: (
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'challenge_id' | 'classification' | 'completed' | 'total_time_seconds' | 'total_distance' | 'total_altimetry' | 'total_rides'>
    & { category?: Types.Maybe<(
      { __typename?: 'ChallengeCategories' }
      & Pick<Types.ChallengeCategories, 'id'>
      & { category_configuration?: Types.Maybe<(
        { __typename?: 'CategoryConfiguration' }
        & Pick<Types.CategoryConfiguration, 'altimetry_goal_value' | 'distance_goal_value' | 'maximum_time_goal_value' | 'minimum_time_goal_value'>
      )> }
    )>, user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstname' | 'lastname'>
      & { profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'id' | 'username' | 'profile_avatar'>
      )> }
    ), activities?: Types.Maybe<Array<(
      { __typename?: 'ChallengeActivity' }
      & { activity: (
        { __typename?: 'Activity' }
        & Pick<Types.Activity, 'id' | 'third_party_data_source_slug' | 'name' | 'distance' | 'start_date_local' | 'start_date' | 'elapsed_time_seconds' | 'total_elevation_gain' | 'calories' | 'user_id'>
      ) }
    )>>, challenge: (
      { __typename?: 'Challenge' }
      & Pick<Types.Challenge, 'name' | 'image_avatar' | 'start_date' | 'end_date' | 'challenge_type'>
      & { configuration?: Types.Maybe<(
        { __typename?: 'ChallengeConfiguration' }
        & Pick<Types.ChallengeConfiguration, 'distance_goal_value' | 'altimetry_goal_value'>
      )> }
    ) }
  ) }
);

export type MarkSubscriptionAsWithdrawnMutationVariables = Types.Exact<{
  data: Types.MarkSubscriptionAsWithdrawnInput;
}>;


export type MarkSubscriptionAsWithdrawnMutation = (
  { __typename?: 'Mutation' }
  & { markSubscriptionAsWithdrawn: (
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'id' | 'withdrawal_date'>
  ) }
);

export type RemoveActivityFromAllChallengeProgressMutationVariables = Types.Exact<{
  data: Types.DeleteUserChallengeActivityInput;
}>;


export type RemoveActivityFromAllChallengeProgressMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'removeActivityFromAllChallengeProgress'>
);

export type ShowAllChallengesV2QueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  data: Types.ShowAllChallengesInput;
}>;


export type ShowAllChallengesV2Query = (
  { __typename?: 'Query' }
  & { showAllChallengesV2: (
    { __typename?: 'ChallengesPaginatedResponse' }
    & { page_info: (
      { __typename?: 'PaginationInfo' }
      & Pick<Types.PaginationInfo, 'current_page' | 'offset' | 'total_item_count' | 'has_next_page' | 'has_previous_page'>
    ), items: Array<(
      { __typename?: 'Challenge' }
      & Pick<Types.Challenge, 'id' | 'eligible_spotlight' | 'name' | 'image_avatar' | 'image_cover' | 'physical_event'>
      & { configuration?: Types.Maybe<(
        { __typename?: 'ChallengeConfiguration' }
        & Pick<Types.ChallengeConfiguration, 'is_paid'>
      )> }
    )> }
  ) }
);

export type SubscribeUserChallengeMutationVariables = Types.Exact<{
  award_data?: Types.Maybe<Types.ChallengePaymentInput>;
  payment_data?: Types.Maybe<Types.PaymentInput>;
  challenge_award_requests?: Types.Maybe<Array<Types.ChallengeAwardAdditionalRequestInput> | Types.ChallengeAwardAdditionalRequestInput>;
  data: Types.SubscribeUserChallengeInput;
  products_purchased?: Types.Maybe<Array<Types.ProductPurchasedInput> | Types.ProductPurchasedInput>;
}>;


export type SubscribeUserChallengeMutation = (
  { __typename?: 'Mutation' }
  & { subscribeUserChallenge: (
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'registration_date' | 'payment_id'>
  ) }
);

export type SubscriptionsWithAwardAlreadyWithdrawnQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  challenge_id: Types.Scalars['String'];
}>;


export type SubscriptionsWithAwardAlreadyWithdrawnQuery = (
  { __typename?: 'Query' }
  & { subscriptionsWithAwardAlreadyWithdrawn: (
    { __typename?: 'SubscriptionsPaginatedResponse' }
    & { page_info: (
      { __typename?: 'PaginationInfo' }
      & Pick<Types.PaginationInfo, 'current_page' | 'offset' | 'total_item_count' | 'has_next_page' | 'has_previous_page'>
    ), subscriptions: Array<(
      { __typename?: 'UserChallenges' }
      & Pick<Types.UserChallenges, 'withdrawal_date' | 'athlete_identification' | 'short_id'>
      & { category?: Types.Maybe<(
        { __typename?: 'ChallengeCategories' }
        & Pick<Types.ChallengeCategories, 'id' | 'order' | 'name'>
      )>, user: (
        { __typename?: 'User' }
        & Pick<Types.User, 'firstname' | 'lastname'>
        & { profile?: Types.Maybe<(
          { __typename?: 'Profile' }
          & Pick<Types.Profile, 'profile_avatar'>
        )> }
      ) }
    )> }
  ) }
);

export type UnsubscribeUserChallengeMutationVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type UnsubscribeUserChallengeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'unsubscribeUserChallenge'>
);

export type UpdateSubscriptionMutationVariables = Types.Exact<{
  data: Types.UpdateSubscriptionInput;
}>;


export type UpdateSubscriptionMutation = (
  { __typename?: 'Mutation' }
  & { updateSubscription: (
    { __typename?: 'UpdateSubscriptionResponse' }
    & Pick<Types.UpdateSubscriptionResponse, 'status' | 'message'>
    & { subscription: (
      { __typename?: 'UserChallenges' }
      & { user: (
        { __typename?: 'User' }
        & Pick<Types.User, 'firstname' | 'lastname'>
      ) }
    ) }
  ) }
);

export type UpdateWithdrawalAddressMutationVariables = Types.Exact<{
  data: Types.UpdateSubscriptionWithdrawalAddressInput;
}>;


export type UpdateWithdrawalAddressMutation = (
  { __typename?: 'Mutation' }
  & { updateWithdrawalAddress: (
    { __typename?: 'UserChallenges' }
    & Pick<Types.UserChallenges, 'id'>
  ) }
);

export type AssociateUserToCompanyMutationVariables = Types.Exact<{
  data: Types.AssociateUserWithCompanyInput;
}>;


export type AssociateUserToCompanyMutation = (
  { __typename?: 'Mutation' }
  & { associateUserToCompany: (
    { __typename?: 'UsersCompanies' }
    & Pick<Types.UsersCompanies, 'creator' | 'company_id' | 'user_id' | 'company_function_id'>
  ) }
);

export type DeleteAssociationUserWithCompanyMutationVariables = Types.Exact<{
  data: Types.DeleteAssociationUserWithCompanyInput;
}>;


export type DeleteAssociationUserWithCompanyMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'deleteAssociationUserWithCompany'>
);

export type ListCompanyUsersQueryVariables = Types.Exact<{
  company_id: Types.Scalars['String'];
}>;


export type ListCompanyUsersQuery = (
  { __typename?: 'Query' }
  & { listCompanyUsers: Array<(
    { __typename?: 'UsersCompanies' }
    & Pick<Types.UsersCompanies, 'creator' | 'user_id'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'firstname' | 'lastname'>
      & { profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'profile_avatar'>
      )> }
    ) }
  )> }
);

export type PaymentFragmentFragment = (
  { __typename?: 'Payment' }
  & Pick<Types.Payment, 'id' | 'resource_payment_id' | 'origin_payment_id' | 'payment_processor_id' | 'country_id' | 'bill_expiration_date' | 'value' | 'is_paid' | 'declined' | 'returned' | 'entrance' | 'processed' | 'profile_id' | 'user_id' | 'status' | 'installments' | 'bill_link' | 'created_at' | 'updated_at'>
  & { card?: Types.Maybe<(
    { __typename?: 'Card' }
    & Pick<Types.Card, 'last_digits' | 'brand'>
  )> }
);

export type GetCityQueryVariables = Types.Exact<{
  data: Types.CitiesInput;
  pagination: Types.PaginationInput;
}>;


export type GetCityQuery = (
  { __typename?: 'Query' }
  & { getCity: Array<(
    { __typename?: 'City' }
    & Pick<Types.City, 'id' | 'name'>
  )> }
);

export type GetAllStatesQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
}>;


export type GetAllStatesQuery = (
  { __typename?: 'Query' }
  & { getStates: Array<(
    { __typename?: 'State' }
    & Pick<Types.State, 'id' | 'name' | 'abbreviation'>
  )> }
);

export type RegisterAppleUserMutationVariables = Types.Exact<{
  data: Types.CreateAppleUserInput;
}>;


export type RegisterAppleUserMutation = (
  { __typename?: 'Mutation' }
  & { registerAppleUser: (
    { __typename?: 'LoginResponse' }
    & Pick<Types.LoginResponse, 'accessToken' | 'refreshToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'staff' | 'firstname' | 'lastname' | 'email'>
    ), profile?: Types.Maybe<(
      { __typename?: 'Profile' }
      & Pick<Types.Profile, 'id' | 'profile_avatar'>
    )> }
  ) }
);

export type LoginEmailLoginMutationVariables = Types.Exact<{
  data: Types.LoginUserInput;
}>;


export type LoginEmailLoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<Types.LoginResponse, 'accessToken' | 'refreshToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstname' | 'lastname' | 'email' | 'staff'>
      & { profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'id' | 'profile_avatar'>
      )> }
    ) }
  ) }
);

export type RegisterFacebookUserMutationVariables = Types.Exact<{
  data: Types.CreateFacebookUserInput;
}>;


export type RegisterFacebookUserMutation = (
  { __typename?: 'Mutation' }
  & { registerFacebookUser: (
    { __typename?: 'LoginResponse' }
    & Pick<Types.LoginResponse, 'accessToken' | 'refreshToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'staff' | 'firstname' | 'lastname' | 'email'>
    ), profile?: Types.Maybe<(
      { __typename?: 'Profile' }
      & Pick<Types.Profile, 'id' | 'profile_avatar' | 'profile_cover'>
    )> }
  ) }
);

export type RegisterGoogleUserMutationVariables = Types.Exact<{
  data: Types.CreateGoogleUserInput;
}>;


export type RegisterGoogleUserMutation = (
  { __typename?: 'Mutation' }
  & { registerGoogleUser: (
    { __typename?: 'LoginResponse' }
    & Pick<Types.LoginResponse, 'accessToken' | 'refreshToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'staff' | 'firstname' | 'lastname' | 'email'>
    ), profile?: Types.Maybe<(
      { __typename?: 'Profile' }
      & Pick<Types.Profile, 'id' | 'profile_avatar' | 'profile_cover'>
    )> }
  ) }
);

export type BuyProductMutationVariables = Types.Exact<{
  payment_data: Types.PaymentInput;
  user_data: Types.ChallengeUserDataInput;
  products_chosen: Array<Types.BuyProductInput> | Types.BuyProductInput;
}>;


export type BuyProductMutation = (
  { __typename?: 'Mutation' }
  & { buyProduct: (
    { __typename?: 'BuyProductResponse' }
    & Pick<Types.BuyProductResponse, 'message' | 'status' | 'payment_id'>
  ) }
);

export type CalculateFreightQuoteMutationVariables = Types.Exact<{
  data: Types.CreateFreightQuoteInput;
}>;


export type CalculateFreightQuoteMutation = (
  { __typename?: 'Mutation' }
  & { calculateFreightQuote: (
    { __typename?: 'ChallengeFreightQuote' }
    & Pick<Types.ChallengeFreightQuote, 'value'>
  ) }
);

export type CalculateInstallmentsQueryVariables = Types.Exact<{
  data: Types.InstallmentsInput;
}>;


export type CalculateInstallmentsQuery = (
  { __typename?: 'Query' }
  & { calculateInstallments: (
    { __typename?: 'InstallmentsResponse' }
    & Pick<Types.InstallmentsResponse, 'installments'>
  ) }
);

export type GetPaymentsOfASubscriptionQueryVariables = Types.Exact<{
  data: Types.RetrieveSubscriptionPaymentsInput;
}>;


export type GetPaymentsOfASubscriptionQuery = (
  { __typename?: 'Query' }
  & { getPaymentsOfASubscription: Array<(
    { __typename?: 'SubscriptionPayment' }
    & Pick<Types.SubscriptionPayment, 'id' | 'payment_id' | 'award_id'>
    & { payment: (
      { __typename?: 'Payment' }
      & Pick<Types.Payment, 'id' | 'interest_free_amount' | 'pix_qrcode' | 'pix_expiration_date' | 'created_at' | 'resource_payment_id' | 'origin_payment_id' | 'payment_processor_id' | 'country_id' | 'bill_expiration_date' | 'value' | 'is_paid' | 'declined' | 'returned' | 'entrance' | 'processed' | 'origin_resource_id' | 'profile_id' | 'user_id' | 'status' | 'installments' | 'bill_link' | 'updated_at'>
      & { card?: Types.Maybe<(
        { __typename?: 'Card' }
        & Pick<Types.Card, 'last_digits' | 'brand'>
      )> }
    ), award: (
      { __typename?: 'ChallengeAwards' }
      & Pick<Types.ChallengeAwards, 'id' | 'name' | 'description' | 'price' | 'challenge_id'>
      & { awardsImages: Array<(
        { __typename?: 'ChallengeAwardsImages' }
        & Pick<Types.ChallengeAwardsImages, 'link'>
      )> }
    ) }
  )> }
);

export type GetProductsByChallengeIdQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type GetProductsByChallengeIdQuery = (
  { __typename?: 'Query' }
  & { getProductsByChallengeId: Array<(
    { __typename?: 'ProductType' }
    & Pick<Types.ProductType, 'id' | 'name' | 'description' | 'date_initial' | 'date_end' | 'available' | 'order' | 'has_cost' | 'allow_buy_without_subscription' | 'free_field' | 'active' | 'challenge_id'>
    & { variations?: Types.Maybe<Array<(
      { __typename?: 'ProductVariationType' }
      & Pick<Types.ProductVariationType, 'id' | 'product_id' | 'text' | 'description' | 'available_quantity' | 'available' | 'order' | 'active'>
      & { prices?: Types.Maybe<Array<(
        { __typename?: 'ProductVariationPriceType' }
        & Pick<Types.ProductVariationPriceType, 'value' | 'date_initial' | 'active'>
      )>>, images?: Types.Maybe<Array<(
        { __typename?: 'ProductVariationImageType' }
        & Pick<Types.ProductVariationImageType, 'link' | 'order' | 'active'>
      )>> }
    )>> }
  )> }
);

export type GetChallengeProductsPurchasedQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  data: Types.ListAllChallengeProductsPurchasedInput;
}>;


export type GetChallengeProductsPurchasedQuery = (
  { __typename?: 'Query' }
  & { getChallengeProductsPurchased: (
    { __typename?: 'ProductsPurchasedPaginated' }
    & { productsPurchased: Array<(
      { __typename?: 'ProductPurchasedType' }
      & Pick<Types.ProductPurchasedType, 'user_challenge_id' | 'id' | 'product_id' | 'value' | 'free_value' | 'product_variation_id' | 'canceled' | 'user_id' | 'quantity' | 'created_at' | 'updated_at'>
      & { variation: (
        { __typename?: 'ProductVariationType' }
        & Pick<Types.ProductVariationType, 'id' | 'text'>
      ), product: (
        { __typename?: 'ProductType' }
        & Pick<Types.ProductType, 'name'>
        & { images?: Types.Maybe<Array<(
          { __typename?: 'ProductImageType' }
          & Pick<Types.ProductImageType, 'link'>
        )>> }
      ), user: (
        { __typename?: 'User' }
        & Pick<Types.User, 'id' | 'name' | 'firstname' | 'lastname' | 'email' | 'gender' | 'stature' | 'weight' | 'phone' | 'date_of_birth' | 'legal_registry_number' | 'team_name'>
      ), subscription?: Types.Maybe<(
        { __typename?: 'UserChallenges' }
        & Pick<Types.UserChallenges, 'id' | 'created_at' | 'challenge_id' | 'user_id' | 'challenge_category_id' | 'short_id' | 'registration_date' | 'end_date' | 'classification' | 'total_time' | 'total_distance' | 'total_altimetry' | 'total_friends' | 'total_rides' | 'drawn' | 'completed' | 'paid' | 'start_time_first_activity' | 'amount_paid' | 'amount_to_pay' | 'amount_freight' | 'payment_id' | 'last_payment_id' | 'challenge_withdrawal_address_id' | 'withdrawal_date' | 'ready_to_withdraw' | 'user_marked_withdrawn' | 'bonus_subscription' | 'total_time_seconds' | 'athlete_identification' | 'updated_at'>
        & { subscription_status?: Types.Maybe<(
          { __typename?: 'SubscriptionStatus' }
          & Pick<Types.SubscriptionStatus, 'id' | 'user_challenge_id' | 'subscription_status_id'>
          & { status_description: (
            { __typename?: 'SubscriptionStatusDescription' }
            & Pick<Types.SubscriptionStatusDescription, 'id' | 'code' | 'name' | 'description'>
            & { translations: Array<(
              { __typename?: 'SubscriptionStatusTranslation' }
              & Pick<Types.SubscriptionStatusTranslation, 'language_code' | 'name' | 'description'>
            )> }
          ) }
        )>, last_payment?: Types.Maybe<(
          { __typename?: 'Payment' }
          & PaymentFragmentFragment
        )> }
      )>, related_payment?: Types.Maybe<(
        { __typename?: 'ProductPurchasedUserPaymentType' }
        & { payment: (
          { __typename?: 'Payment' }
          & PaymentFragmentFragment
        ) }
      )> }
    )>, page_info: (
      { __typename?: 'PaginationInfo' }
      & Pick<Types.PaginationInfo, 'current_page' | 'offset' | 'total_item_count' | 'has_next_page' | 'has_previous_page'>
    ) }
  ) }
);

export type GetProductsAcquiredQueryVariables = Types.Exact<{
  data: Types.GetProductsAcquiredInput;
}>;


export type GetProductsAcquiredQuery = (
  { __typename?: 'Query' }
  & { getProductsAcquired: Array<(
    { __typename?: 'ProductPurchasedType' }
    & Pick<Types.ProductPurchasedType, 'id' | 'product_id' | 'value' | 'free_value' | 'product_variation_id' | 'canceled' | 'quantity'>
    & { related_payment?: Types.Maybe<(
      { __typename?: 'ProductPurchasedUserPaymentType' }
      & { payment: (
        { __typename?: 'Payment' }
        & Pick<Types.Payment, 'id' | 'created_at' | 'resource_payment_id' | 'origin_payment_id' | 'payment_processor_id' | 'country_id' | 'bill_expiration_date' | 'value' | 'is_paid' | 'declined' | 'returned' | 'entrance' | 'processed' | 'profile_id' | 'user_id' | 'bill_barcode' | 'bill_link' | 'status' | 'updated_at' | 'humanized_message' | 'installments'>
        & { card?: Types.Maybe<(
          { __typename?: 'Card' }
          & Pick<Types.Card, 'last_digits' | 'brand'>
        )> }
      ) }
    )>, product: (
      { __typename?: 'ProductType' }
      & Pick<Types.ProductType, 'name' | 'description'>
    ), variation: (
      { __typename?: 'ProductVariationType' }
      & Pick<Types.ProductVariationType, 'id' | 'text' | 'description'>
      & { images?: Types.Maybe<Array<(
        { __typename?: 'ProductVariationImageType' }
        & Pick<Types.ProductVariationImageType, 'id' | 'link' | 'order'>
      )>> }
    ) }
  )> }
);

export type ChangeHealthConnectionsMutationVariables = Types.Exact<{
  data: Types.ChangeHealthConnectionsInput;
}>;


export type ChangeHealthConnectionsMutation = (
  { __typename?: 'Mutation' }
  & { changeHealthConnections: (
    { __typename?: 'DataCompiled' }
    & Pick<Types.DataCompiled, '_id' | 'user_id' | 'integrated_with_google_fit' | 'integrated_with_apple_health' | 'integrated_with_garmin' | 'integrated_with_polar' | 'has_company' | 'last_upload_google_fit' | 'last_upload_apple_health'>
  ) }
);

export type UserCompaniesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserCompaniesQuery = (
  { __typename?: 'Query' }
  & { userCompanies: Array<(
    { __typename?: 'Company' }
    & Pick<Types.Company, 'id' | 'fantasy_name' | 'site'>
    & { profile: (
      { __typename?: 'Profile' }
      & Pick<Types.Profile, 'id' | 'profile_avatar' | 'profile_cover'>
    ) }
  )> }
);

export type CreateActivityV2MutationVariables = Types.Exact<{
  activities_data: Array<Types.CreateActivityInput> | Types.CreateActivityInput;
}>;


export type CreateActivityV2Mutation = (
  { __typename?: 'Mutation' }
  & { createActivityV2: (
    { __typename?: 'HealthActivityResponse' }
    & Pick<Types.HealthActivityResponse, 'status' | 'message'>
  ) }
);

export type CreateActivityFromCrawlerMutationVariables = Types.Exact<{
  activityKey: Types.Scalars['String'];
}>;


export type CreateActivityFromCrawlerMutation = (
  { __typename?: 'Mutation' }
  & { createActivityFromCrawler: (
    { __typename?: 'CrawledActivityResponse' }
    & Pick<Types.CrawledActivityResponse, 'status' | 'message'>
  ) }
);

export type CreateCardMutationVariables = Types.Exact<{
  data: Types.CreateCardInput;
}>;


export type CreateCardMutation = (
  { __typename?: 'Mutation' }
  & { createCard: (
    { __typename?: 'Card' }
    & Pick<Types.Card, 'id' | 'name' | 'brand' | 'last_digits' | 'external_id' | 'holder_name' | 'first_digits' | 'valid' | 'expiration_date' | 'main' | 'legal_holder_number'>
  ) }
);

export type DeleteCardMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteCardMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'deleteCard'>
);

export type DisconnectGarminMutationVariables = Types.Exact<{
  data: Types.DisconnectThirdPartyProviderInput;
}>;


export type DisconnectGarminMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'disconnectGarmin'>
);

export type DisconnectPolarMutationVariables = Types.Exact<{
  data: Types.DisconnectThirdPartyProviderInput;
}>;


export type DisconnectPolarMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'disconnectPolar'>
);

export type FindPaymentQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type FindPaymentQuery = (
  { __typename?: 'Query' }
  & { findPayment: (
    { __typename?: 'Payment' }
    & Pick<Types.Payment, 'id' | 'resource_payment_id' | 'origin_payment_id' | 'payment_processor_id' | 'country_id' | 'bill_expiration_date' | 'value' | 'is_paid' | 'declined' | 'returned' | 'entrance' | 'processed' | 'profile_id' | 'user_id' | 'bill_barcode' | 'bill_link' | 'status' | 'created_at' | 'updated_at' | 'humanized_message' | 'installments' | 'pix_qrcode' | 'pix_expiration_date'>
    & { card?: Types.Maybe<(
      { __typename?: 'Card' }
      & Pick<Types.Card, 'last_digits' | 'brand'>
    )> }
  ) }
);

export type FollowProfileMutationVariables = Types.Exact<{
  data: Types.FollowProfileInput;
}>;


export type FollowProfileMutation = (
  { __typename?: 'Mutation' }
  & { followProfile: (
    { __typename?: 'FollowingProfile' }
    & Pick<Types.FollowingProfile, '_id'>
  ) }
);

export type GetAwardSubscriptionPaymentQueryVariables = Types.Exact<{
  data: Types.GetAwardSubscriptionInput;
}>;


export type GetAwardSubscriptionPaymentQuery = (
  { __typename?: 'Query' }
  & { getAwardSubscriptionPayment: (
    { __typename?: 'AwardSubscription' }
    & Pick<Types.AwardSubscription, 'award_id'>
    & { award: (
      { __typename?: 'ChallengeAwards' }
      & Pick<Types.ChallengeAwards, 'id' | 'name' | 'description' | 'price'>
      & { awardsImages: Array<(
        { __typename?: 'ChallengeAwardsImages' }
        & Pick<Types.ChallengeAwardsImages, 'id' | 'link'>
      )>, challenge_award_additional_requests: Array<(
        { __typename?: 'ChallengeAwardAdditionalRequest' }
        & { additional_request: (
          { __typename?: 'AdditionalRequest' }
          & Pick<Types.AdditionalRequest, 'id' | 'request' | 'image_reference' | 'has_cost' | 'price_request'>
        ), possible_request_response?: Types.Maybe<(
          { __typename?: 'PossiblelRequestResponse' }
          & Pick<Types.PossiblelRequestResponse, 'id' | 'response' | 'image_reference' | 'price'>
        )> }
      )> }
    ) }
  ) }
);

export type GetCardsQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  user_id: Types.Scalars['String'];
}>;


export type GetCardsQuery = (
  { __typename?: 'Query' }
  & { getCards: Array<(
    { __typename?: 'Card' }
    & Pick<Types.Card, 'id' | 'name' | 'brand' | 'last_digits' | 'external_id' | 'holder_name' | 'first_digits' | 'valid' | 'expiration_date' | 'main' | 'legal_holder_number'>
  )> }
);

export type GetCompaniesQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  search_text: Types.Scalars['String'];
}>;


export type GetCompaniesQuery = (
  { __typename?: 'Query' }
  & { getCompanies: (
    { __typename?: 'CompaniesPaginatedResponse' }
    & { page_info: (
      { __typename?: 'PaginationInfo' }
      & Pick<Types.PaginationInfo, 'current_page' | 'offset' | 'total_item_count' | 'has_next_page' | 'has_previous_page'>
    ), companies?: Types.Maybe<Array<(
      { __typename?: 'Company' }
      & Pick<Types.Company, 'id'>
    )>> }
  ) }
);

export type GetProfileQueryVariables = Types.Exact<{
  data: Types.GetProfileDetailInput;
}>;


export type GetProfileQuery = (
  { __typename?: 'Query' }
  & { getProfile: (
    { __typename?: 'Profile' }
    & Pick<Types.Profile, 'id' | 'user_id' | 'username' | 'followers_count' | 'following_count' | 'official' | 'profile_avatar' | 'profile_cover' | 'description' | 'is_follower'>
    & { user: (
      { __typename?: 'User' }
      & Pick<Types.User, 'phone' | 'street_number' | 'id' | 'email' | 'staff' | 'count_challenges_participates' | 'activities_count' | 'firstname' | 'lastname' | 'gender' | 'stature' | 'date_of_birth' | 'weight' | 'address_line_one' | 'address_line_two' | 'legal_registry_number' | 'zip_code' | 'has_social_login' | 'blacklist' | 'team_name'>
      & { city?: Types.Maybe<(
        { __typename?: 'City' }
        & Pick<Types.City, 'id' | 'name'>
        & { state: (
          { __typename?: 'State' }
          & Pick<Types.State, 'abbreviation' | 'id'>
        ) }
      )>, last_challenge?: Types.Maybe<(
        { __typename?: 'Challenge' }
        & Pick<Types.Challenge, 'name'>
      )> }
    ) }
  ) }
);

export type GetSubscriptionActivitiesQueryVariables = Types.Exact<{
  data: Types.RetrieveSubscriptionActivitiesInput;
}>;


export type GetSubscriptionActivitiesQuery = (
  { __typename?: 'Query' }
  & { getSubscriptionActivities: Array<(
    { __typename?: 'ChallengeActivity' }
    & Pick<Types.ChallengeActivity, 'activity_id'>
    & { activity: (
      { __typename?: 'Activity' }
      & Pick<Types.Activity, 'id' | 'name' | 'distance' | 'total_elevation_gain' | 'start_date_local' | 'start_date' | 'suspicious' | 'duplicated' | 'moving_time_seconds' | 'elapsed_time_seconds' | 'third_party_data_source_slug'>
    ) }
  )> }
);

export type GetUserActivitiesV2QueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
}>;


export type GetUserActivitiesV2Query = (
  { __typename?: 'Query' }
  & { getUserActivitiesV2: (
    { __typename?: 'ActivitiesListResponse' }
    & { activities: Array<(
      { __typename?: 'Activity' }
      & Pick<Types.Activity, 'id' | 'name' | 'distance' | 'total_elevation_gain' | 'start_date_local' | 'suspicious' | 'duplicated' | 'moving_time_seconds' | 'elapsed_time_seconds' | 'third_party_data_source_slug' | 'bounds' | 'summary_polyline' | 'min_bounds' | 'max_bounds' | 'thumbnail' | 'processing'>
    )>, page_info: (
      { __typename?: 'PaginationInfo' }
      & Pick<Types.PaginationInfo, 'current_page' | 'offset' | 'total_item_count' | 'has_next_page' | 'has_previous_page'>
    ) }
  ) }
);

export type GetUserChallengeActivitiesQueryVariables = Types.Exact<{
  challenge_id: Types.Scalars['String'];
}>;


export type GetUserChallengeActivitiesQuery = (
  { __typename?: 'Query' }
  & { getUserChallengeActivities: Array<(
    { __typename?: 'ChallengeActivity' }
    & Pick<Types.ChallengeActivity, 'activity_id'>
    & { activity: (
      { __typename?: 'Activity' }
      & Pick<Types.Activity, 'id' | 'name' | 'distance' | 'total_elevation_gain' | 'start_date_local' | 'start_date' | 'suspicious' | 'duplicated' | 'moving_time_seconds' | 'elapsed_time_seconds' | 'third_party_data_source_slug'>
    ) }
  )> }
);

export type GetUserDataCompiledQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetUserDataCompiledQuery = (
  { __typename?: 'Query' }
  & { getUserDataCompiled: (
    { __typename?: 'ThirdPartyDataCompiled' }
    & { data_compiled: (
      { __typename?: 'DataCompiled' }
      & Pick<Types.DataCompiled, '_id' | 'user_id' | 'integrated_with_apple_health' | 'integrated_with_google_fit' | 'integrated_with_garmin' | 'integrated_with_polar' | 'has_company' | 'last_upload_google_fit' | 'last_upload_apple_health' | 'last_upload_polar' | 'last_upload_garmin' | 'view_welcome_screen' | 'integrated_with_strava'>
    ), third_party_data?: Types.Maybe<Array<(
      { __typename?: 'ThirdPartyDataSource' }
      & Pick<Types.ThirdPartyDataSource, 'id_data_source'>
      & { third_party_data_source: (
        { __typename?: 'ThirdPartyProvider' }
        & Pick<Types.ThirdPartyProvider, 'slug'>
      ) }
    )>> }
  ) }
);

export type GetUserDataFromCrawledActivityQueryVariables = Types.Exact<{
  url: Types.Scalars['String'];
}>;


export type GetUserDataFromCrawledActivityQuery = (
  { __typename?: 'Query' }
  & { getUserDataFromCrawledActivity: (
    { __typename?: 'GetUserActivityContentResponse' }
    & Pick<Types.GetUserActivityContentResponse, 'name' | 'avatar' | 'type' | 'distance' | 'time' | 'elevation' | 'date' | 'address' | 'person_name' | 'key'>
  ) }
);

export type GetUserNotificationsQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  data: Types.ListUserNotificationsInput;
}>;


export type GetUserNotificationsQuery = (
  { __typename?: 'Query' }
  & { getUserNotifications: (
    { __typename?: 'NotificationScalar' }
    & Pick<Types.NotificationScalar, 'date' | 'unread_notifications_count'>
    & { notifications: Array<(
      { __typename?: 'Notification' }
      & Pick<Types.Notification, '_id' | 'recipient_id' | 'notification_content' | 'sender_username' | 'sender_profile_avatar' | 'read' | 'deep_linking' | 'media_url' | 'created_at'>
    )> }
  ) }
);

export type MarkNotificationsAsReadMutationVariables = Types.Exact<{
  data: Types.ListUserNotificationsInput;
}>;


export type MarkNotificationsAsReadMutation = (
  { __typename?: 'Mutation' }
  & { markNotificationsAsRead: Array<(
    { __typename?: 'Notification' }
    & Pick<Types.Notification, 'push_title' | 'read'>
  )> }
);

export type ReattemptSubscriptionPaymentMutationVariables = Types.Exact<{
  award_data: Types.ChallengePaymentInput;
  payment_data: Types.PaymentInput;
}>;


export type ReattemptSubscriptionPaymentMutation = (
  { __typename?: 'Mutation' }
  & { reattemptSubscriptionPayment: (
    { __typename?: 'SuccessfulPaymentResponse' }
    & Pick<Types.SuccessfulPaymentResponse, 'title' | 'message' | 'payment_id'>
  ) }
);

export type SearchUsersQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
  search_text: Types.Scalars['String'];
}>;


export type SearchUsersQuery = (
  { __typename?: 'Query' }
  & { searchUsers: (
    { __typename?: 'UsersPaginatedResponse' }
    & { users?: Types.Maybe<Array<(
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'firstname' | 'lastname' | 'email' | 'gender' | 'stature' | 'weight' | 'phone' | 'date_of_birth' | 'has_social_login' | 'city_id' | 'active' | 'address_line_one' | 'address_line_two' | 'street_number' | 'legal_registry_number' | 'zip_code' | 'strava_permission_activities' | 'staff' | 'blacklist' | 'team_name' | 'created_at' | 'updated_at' | 'count_challenges_participates' | 'activities_count'>
      & { city?: Types.Maybe<(
        { __typename?: 'City' }
        & Pick<Types.City, 'id' | 'name' | 'slug' | 'status' | 'id_locale'>
        & { state: (
          { __typename?: 'State' }
          & Pick<Types.State, 'abbreviation'>
        ) }
      )>, profile?: Types.Maybe<(
        { __typename?: 'Profile' }
        & Pick<Types.Profile, 'id' | 'username' | 'followers_count' | 'following_count' | 'official' | 'profile_avatar' | 'profile_cover' | 'description' | 'user_id' | 'is_follower'>
      )> }
    )>>, page_info: (
      { __typename?: 'PaginationInfo' }
      & Pick<Types.PaginationInfo, 'current_page' | 'offset' | 'total_item_count' | 'has_next_page' | 'has_previous_page'>
    ) }
  ) }
);

export type SendMailMutationVariables = Types.Exact<{
  data: Types.SendEmailInput;
}>;


export type SendMailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'sendMail'>
);

export type UnfollowProfileMutationVariables = Types.Exact<{
  data: Types.FollowProfileInput;
}>;


export type UnfollowProfileMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'unfollowProfile'>
);

export type UpdateCardMutationVariables = Types.Exact<{
  data: Types.UpdateCardInput;
  id: Types.Scalars['String'];
}>;


export type UpdateCardMutation = (
  { __typename?: 'Mutation' }
  & { updateCard: (
    { __typename?: 'Card' }
    & Pick<Types.Card, 'id' | 'name'>
  ) }
);

export type UpdateProfilePersonalMutationVariables = Types.Exact<{
  data: Types.UpdateProfilePersonalInput;
}>;


export type UpdateProfilePersonalMutation = (
  { __typename?: 'Mutation' }
  & { updateProfilePersonal: (
    { __typename?: 'Profile' }
    & Pick<Types.Profile, 'id' | 'username' | 'description'>
  ) }
);

export type UpdateUserDataCompiledMutationVariables = Types.Exact<{
  data: Types.UpdateUserDataCompiledInput;
}>;


export type UpdateUserDataCompiledMutation = (
  { __typename?: 'Mutation' }
  & { updateUserDataCompiled: (
    { __typename?: 'DataCompiled' }
    & Pick<Types.DataCompiled, '_id'>
  ) }
);

export type VerifyEmailCodeMutationVariables = Types.Exact<{
  data: Types.VerifyEmailInput;
}>;


export type VerifyEmailCodeMutation = (
  { __typename?: 'Mutation' }
  & { verifyEmailCode: (
    { __typename?: 'VerifyEmailResponse' }
    & Pick<Types.VerifyEmailResponse, 'email'>
  ) }
);
