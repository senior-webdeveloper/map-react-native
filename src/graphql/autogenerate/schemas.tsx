export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Parse string date to type Date */
  CacheDate: any;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type ActivitiesListResponse = {
  __typename?: 'ActivitiesListResponse';
  activities: Array<Activity>;
  page_info: PaginationInfo;
};

export type Activity = {
  __typename?: 'Activity';
  id: Scalars['ID'];
  resource_state?: Maybe<Scalars['Float']>;
  external_id?: Maybe<Scalars['String']>;
  upload_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  distance?: Maybe<Scalars['Float']>;
  /** @deprecated To have the seconds of the time we are using now the field moving_time_seconds */
  moving_time?: Maybe<Scalars['Float']>;
  moving_time_seconds?: Maybe<Scalars['Float']>;
  /** @deprecated To have the seconds of the time we are using now the field elapsed_time_seconds */
  elapsed_time?: Maybe<Scalars['Float']>;
  elapsed_time_seconds?: Maybe<Scalars['Float']>;
  total_elevation_gain?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
  start_date?: Maybe<Scalars['CacheDate']>;
  start_date_local?: Maybe<Scalars['CacheDate']>;
  timezone?: Maybe<Scalars['Float']>;
  utc_offset?: Maybe<Scalars['Float']>;
  achievement_count?: Maybe<Scalars['Float']>;
  kudos_count?: Maybe<Scalars['Float']>;
  comment_count?: Maybe<Scalars['Float']>;
  athlete_count?: Maybe<Scalars['Float']>;
  photo_count?: Maybe<Scalars['Float']>;
  workout_type?: Maybe<Scalars['Float']>;
  start_latitude?: Maybe<Scalars['Float']>;
  start_longitude?: Maybe<Scalars['Float']>;
  end_latitude?: Maybe<Scalars['Float']>;
  end_longitude?: Maybe<Scalars['String']>;
  polyline?: Maybe<Scalars['String']>;
  summary_polyline?: Maybe<Scalars['String']>;
  trainer?: Maybe<Scalars['Boolean']>;
  commute?: Maybe<Scalars['Boolean']>;
  manual?: Maybe<Scalars['Boolean']>;
  private_profile?: Maybe<Scalars['Boolean']>;
  flagged?: Maybe<Scalars['Boolean']>;
  gear_id?: Maybe<Scalars['String']>;
  average_speed?: Maybe<Scalars['Float']>;
  max_speed?: Maybe<Scalars['Float']>;
  max_speed_ms?: Maybe<Scalars['Float']>;
  average_cadence?: Maybe<Scalars['Float']>;
  average_temp?: Maybe<Scalars['Float']>;
  average_watts?: Maybe<Scalars['Float']>;
  weighted_average_watts?: Maybe<Scalars['Float']>;
  kilojoules?: Maybe<Scalars['Float']>;
  device_watts?: Maybe<Scalars['Boolean']>;
  has_heartrate?: Maybe<Scalars['Boolean']>;
  max_watts?: Maybe<Scalars['Boolean']>;
  elev_high?: Maybe<Scalars['Boolean']>;
  elev_low?: Maybe<Scalars['Boolean']>;
  pr_count?: Maybe<Scalars['Boolean']>;
  total_photo_count?: Maybe<Scalars['Boolean']>;
  has_kudoed?: Maybe<Scalars['Boolean']>;
  suffer_score?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  calories?: Maybe<Scalars['Float']>;
  device_name?: Maybe<Scalars['String']>;
  segment_leaderboard_opt_out?: Maybe<Scalars['Boolean']>;
  leaderboard_opt_out?: Maybe<Scalars['Boolean']>;
  location_city?: Maybe<Scalars['String']>;
  location_state?: Maybe<Scalars['String']>;
  location_country?: Maybe<Scalars['String']>;
  visibility?: Maybe<Scalars['String']>;
  average_heartrate?: Maybe<Scalars['Float']>;
  max_heartrate?: Maybe<Scalars['Float']>;
  heartrate_opt_out?: Maybe<Scalars['Boolean']>;
  display_hide_heartrate_option?: Maybe<Scalars['Boolean']>;
  perceived_exertion?: Maybe<Scalars['Float']>;
  prefer_perceived_exertion?: Maybe<Scalars['Boolean']>;
  user_id?: Maybe<Scalars['String']>;
  protein_percentage?: Maybe<Scalars['Float']>;
  carbohydrate_percentage?: Maybe<Scalars['Float']>;
  fat_percentage?: Maybe<Scalars['Float']>;
  url_original_file?: Maybe<Scalars['String']>;
  provider_id?: Maybe<Scalars['String']>;
  photo_image_primary?: Maybe<Scalars['String']>;
  total_ascent?: Maybe<Scalars['Float']>;
  total_descent?: Maybe<Scalars['Float']>;
  total_cycles?: Maybe<Scalars['Float']>;
  extension_file?: Maybe<Scalars['String']>;
  third_party_data_source_slug?: Maybe<Scalars['String']>;
  low_fidelity_origin: Scalars['Boolean'];
  suspicious: Scalars['Boolean'];
  duplicated: Scalars['Boolean'];
  is_private: Scalars['Boolean'];
  min_bounds?: Maybe<Array<Scalars['Float']>>;
  max_bounds?: Maybe<Array<Scalars['Float']>>;
  bounds?: Maybe<Array<Maybe<Array<Maybe<Scalars['Float']>>>>>;
  average_speed_ms?: Maybe<Scalars['Float']>;
  processing: Scalars['Boolean'];
  thumbnail?: Maybe<Scalars['String']>;
  challenges: Array<Challenge>;
  created_at: Scalars['CacheDate'];
  thir_party_data_source: ThirdPartyProvider;
  user: User;
  activity_sent_third_party?: Maybe<Array<ActivitySentThirdPartyType>>;
};

export type ActivitySentThirdPartyType = {
  __typename?: 'ActivitySentThirdPartyType';
  id: Scalars['ID'];
  activity_id: Scalars['String'];
  third_party_data_source_id: Scalars['String'];
  activity_external_id?: Maybe<Scalars['String']>;
  response_status?: Maybe<Scalars['String']>;
  response_error?: Maybe<Scalars['String']>;
  done: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
};

export type AdditionalRequest = {
  __typename?: 'AdditionalRequest';
  id: Scalars['ID'];
  request: Scalars['String'];
  image_reference?: Maybe<Scalars['String']>;
  has_cost: Scalars['Boolean'];
  price_request?: Maybe<Scalars['Float']>;
  order: Scalars['Float'];
  free_field: Scalars['Boolean'];
  expiration_date?: Maybe<Scalars['CacheDate']>;
  possible_request_response: Array<PossiblelRequestResponse>;
};

export type AdditionalRequestInput = {
  request: Scalars['String'];
  order?: Maybe<Scalars['Float']>;
  image_reference?: Maybe<Scalars['String']>;
  price_request?: Maybe<Scalars['Float']>;
  free_field?: Maybe<Scalars['Boolean']>;
  has_cost?: Maybe<Scalars['Boolean']>;
  expiration_date?: Maybe<Scalars['DateTime']>;
  possible_request_response: Array<CreatePossibleRequestResponseInput>;
};

export type AddressResponse = {
  __typename?: 'AddressResponse';
  name: Scalars['String'];
  zip_code: Scalars['String'];
  street_address: Scalars['String'];
  street_number: Scalars['Float'];
  neighborhood: Scalars['String'];
  complement?: Maybe<Scalars['String']>;
  reference_point?: Maybe<Scalars['String']>;
  city_id: Scalars['String'];
  is_billing_address: Scalars['Boolean'];
  user_id?: Maybe<Scalars['String']>;
  company_id?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  created_at?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

export type AddressType = {
  __typename?: 'AddressType';
  id: Scalars['ID'];
  name: Scalars['String'];
  zip_code: Scalars['String'];
  street_address: Scalars['String'];
  street_number: Scalars['Float'];
  neighborhood: Scalars['String'];
  complement?: Maybe<Scalars['String']>;
  reference_point?: Maybe<Scalars['String']>;
  city_id: Scalars['String'];
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  city: City;
};

export type AdvancedFiltersToFindProductsPurchasedInput = {
  payment_statuses?: Maybe<Array<Scalars['String']>>;
  origin_payment_ids?: Maybe<Array<Scalars['String']>>;
  genders?: Maybe<Array<Scalars['String']>>;
  is_subscribed?: Maybe<Scalars['Boolean']>;
  product_ids?: Maybe<Array<Scalars['String']>>;
};

export type AdvancedFiltersToFindSubscriptionsInput = {
  payment_statuses?: Maybe<Array<Scalars['String']>>;
  origin_payment_ids?: Maybe<Array<Scalars['String']>>;
  completed?: Maybe<Scalars['Boolean']>;
  genders?: Maybe<Array<Scalars['String']>>;
  category_ids?: Maybe<Array<Scalars['String']>>;
  subscription_status_ids?: Maybe<Array<Scalars['String']>>;
  award_ids?: Maybe<Array<Scalars['String']>>;
};

export type AppData = {
  __typename?: 'AppData';
  _id: Scalars['ID'];
  platform: Scalars['String'];
  latest_version_store: Scalars['String'];
  latest_version_code_push: Scalars['String'];
};

export type AppDataInput = {
  platform: Scalars['String'];
  latest_version_store: Scalars['String'];
  latest_version_code_push: Scalars['String'];
};

export type AssociateUserWithCompanyInput = {
  user_id: Scalars['String'];
  company_id: Scalars['String'];
  creator: Scalars['Boolean'];
};

export type AuthorizationPostageResponse = {
  __typename?: 'AuthorizationPostageResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type AwardAdditionalRequests = {
  __typename?: 'AwardAdditionalRequests';
  additional_request_id: Scalars['String'];
  additional_request?: Maybe<AdditionalRequest>;
};

export type AwardProductType = {
  __typename?: 'AwardProductType';
  award_id: Scalars['String'];
  product_id: Scalars['String'];
  award: ChallengeAwards;
  product: ProductType;
};

export type AwardSubscription = {
  __typename?: 'AwardSubscription';
  user_challenge_id: Scalars['String'];
  award_id: Scalars['String'];
  user_id?: Maybe<Scalars['String']>;
  challenge_id?: Maybe<Scalars['String']>;
  award: ChallengeAwards;
};

export type AwardVolume = {
  __typename?: 'AwardVolume';
  id: Scalars['ID'];
  award_id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  height: Scalars['Float'];
  width: Scalars['Float'];
  depth: Scalars['Float'];
  weight: Scalars['Float'];
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
};

export type Bank = {
  __typename?: 'Bank';
  id: Scalars['ID'];
  name_short: Scalars['String'];
  name_long: Scalars['String'];
  swift_code: Scalars['String'];
  ispb_brazil: Scalars['Float'];
  compe_brazil: Scalars['Float'];
};

export type BestResultsAwardsResponse = {
  __typename?: 'BestResultsAwardsResponse';
  title: Scalars['String'];
  awards?: Maybe<Array<ChallengeAwards>>;
};

export type BestResultsChallengesResponse = {
  __typename?: 'BestResultsChallengesResponse';
  title: Scalars['String'];
  challenges?: Maybe<Array<Challenge>>;
};

export type BuyProductInput = {
  product_id: Scalars['String'];
  product_variation_id?: Maybe<Scalars['String']>;
  quantity: Scalars['Float'];
  free_value?: Maybe<Scalars['String']>;
};

export type BuyProductResponse = {
  __typename?: 'BuyProductResponse';
  status: Scalars['String'];
  message: Scalars['String'];
  payment_id: Scalars['String'];
};


export type Card = {
  __typename?: 'Card';
  id: Scalars['String'];
  name: Scalars['String'];
  external_id: Scalars['String'];
  brand: Scalars['String'];
  holder_name: Scalars['String'];
  first_digits: Scalars['Float'];
  last_digits: Scalars['Float'];
  valid: Scalars['Boolean'];
  expiration_date: Scalars['Float'];
  main?: Maybe<Scalars['Boolean']>;
  legal_holder_number: Scalars['String'];
};

export type CategoryConfiguration = {
  __typename?: 'CategoryConfiguration';
  challenge_category_id?: Maybe<Scalars['String']>;
  altimetry_goal_value?: Maybe<Scalars['Float']>;
  distance_goal_value?: Maybe<Scalars['Float']>;
  max_distance_goal_value?: Maybe<Scalars['Float']>;
  max_altimetry_goal_value?: Maybe<Scalars['Float']>;
  maximum_time_goal_value?: Maybe<Scalars['Int']>;
  minimum_time_goal_value?: Maybe<Scalars['Int']>;
};

export type Challenge = {
  __typename?: 'Challenge';
  id: Scalars['ID'];
  name: Scalars['String'];
  challenge_type: Scalars['String'];
  start_date: Scalars['CacheDate'];
  end_date: Scalars['CacheDate'];
  start_date_registration: Scalars['CacheDate'];
  end_date_registration: Scalars['CacheDate'];
  has_achievement: Scalars['Boolean'];
  internal_test: Scalars['Boolean'];
  eligible_spotlight?: Maybe<Scalars['Boolean']>;
  description: Scalars['String'];
  image_avatar: Scalars['String'];
  image_spotlight?: Maybe<Scalars['String']>;
  image_cover: Scalars['String'];
  rank: Scalars['Boolean'];
  count_subscribe: Scalars['Float'];
  accept_installments: Scalars['Boolean'];
  count_unsubscribed: Scalars['Float'];
  count_view: Scalars['Float'];
  claps_count: Scalars['Float'];
  count_comments: Scalars['Float'];
  commissioning_model_id?: Maybe<Scalars['String']>;
  commissioning_model?: Maybe<CommissioningModelType>;
  products?: Maybe<Array<ProductType>>;
  claps?: Maybe<Array<Clap>>;
  comments?: Maybe<Array<Comment>>;
  company_id?: Maybe<Scalars['String']>;
  creator_id?: Maybe<Scalars['String']>;
  prestart_visibility: Scalars['Boolean'];
  isFavorite?: Maybe<Scalars['Boolean']>;
  summary: ChallengeSummary;
  launch_date?: Maybe<Scalars['CacheDate']>;
  registration_limit?: Maybe<Scalars['Int']>;
  date_for_drawn?: Maybe<Scalars['CacheDate']>;
  date_of_drawn?: Maybe<Scalars['CacheDate']>;
  physical_event: Scalars['Boolean'];
  has_categories?: Maybe<Scalars['Boolean']>;
  temporarily_unavailable: Scalars['Boolean'];
  published: Scalars['Boolean'];
  user_challenges: Array<UserChallenges>;
  winners?: Maybe<Array<UserChallenges>>;
  awards?: Maybe<Array<ChallengeAwards>>;
  configuration?: Maybe<ChallengeConfiguration>;
  company: Company;
  products_purchased_without_subscription: Array<ProductPurchasedType>;
  subscription_prices: Array<EventSubscriptionPriceType>;
  creator: User;
  challenge_images: Array<ChallengeImages>;
  challenges_attached_files: Array<ChallengeAttachedFiles>;
  challenges_external_links_attached: Array<ChallengeExternalLinksAttached>;
  challenge_categories: Array<ChallengeCategories>;
  user_extraordinary_actions?: Maybe<Array<UserEventExtraordinaryActionType>>;
  support_points?: Maybe<Array<EventSupportPointType>>;
  event_routes?: Maybe<Array<EventRoutesType>>;
};

export type ChallengeActivity = {
  __typename?: 'ChallengeActivity';
  activity_id: Scalars['String'];
  activity: Activity;
  user_id?: Maybe<Scalars['String']>;
  challenge_id?: Maybe<Scalars['String']>;
  user_challenge_id: Scalars['String'];
};

export type ChallengeAttachedFiles = {
  __typename?: 'ChallengeAttachedFiles';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
};

export type ChallengeAwardAdditionalRequest = {
  __typename?: 'ChallengeAwardAdditionalRequest';
  award_id: Scalars['String'];
  user_challenge_id: Scalars['String'];
  free_value?: Maybe<Scalars['String']>;
  additional_request: AdditionalRequest;
  possible_request_response?: Maybe<PossiblelRequestResponse>;
};

export type ChallengeAwardAdditionalRequestInput = {
  award_id: Scalars['String'];
  additional_request_id: Scalars['String'];
  possible_request_response_id?: Maybe<Scalars['String']>;
  free_value?: Maybe<Scalars['String']>;
};

export type ChallengeAwardDeliveryAddress = {
  __typename?: 'ChallengeAwardDeliveryAddress';
  user_challenge_id: Scalars['String'];
  city_id: Scalars['String'];
  address_line_one: Scalars['String'];
  address_line_two?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  tracking_code?: Maybe<Scalars['String']>;
  tracking_link?: Maybe<Scalars['String']>;
  shipping_company?: Maybe<Scalars['String']>;
  date_generated_authorization?: Maybe<Scalars['CacheDate']>;
  date_delivery?: Maybe<Scalars['CacheDate']>;
  authorization_code?: Maybe<Scalars['String']>;
  postage_deadline?: Maybe<Scalars['CacheDate']>;
  correios_ar: Scalars['String'];
  correios_vd?: Maybe<Scalars['Float']>;
  correios_type?: Maybe<Scalars['String']>;
  correios_packing: Scalars['Float'];
  date_posted?: Maybe<Scalars['CacheDate']>;
  postage_cost?: Maybe<Scalars['Float']>;
  quoted_value?: Maybe<Scalars['Float']>;
  street_address: Scalars['String'];
  street_number: Scalars['String'];
  reference_point?: Maybe<Scalars['String']>;
  complement?: Maybe<Scalars['String']>;
  neighborhood: Scalars['String'];
};

export type ChallengeAwards = {
  __typename?: 'ChallengeAwards';
  id: Scalars['ID'];
  challenge_id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  position?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  only_for_draw?: Maybe<Scalars['Boolean']>;
  subscribers_limit?: Maybe<Scalars['Float']>;
  active: Scalars['Boolean'];
  price?: Maybe<Scalars['Float']>;
  production_time: Scalars['Float'];
  awards_remaining?: Maybe<Scalars['Float']>;
  award_volumes?: Maybe<Array<AwardVolume>>;
  awardsImages: Array<ChallengeAwardsImages>;
  awardAdditionalRequest: Array<AwardAdditionalRequests>;
  challenge_award_additional_requests: Array<ChallengeAwardAdditionalRequest>;
  product_purchased?: Maybe<Array<ProductPurchasedType>>;
  awards_products?: Maybe<Array<AwardProductType>>;
};

export type ChallengeAwardsImages = {
  __typename?: 'ChallengeAwardsImages';
  id: Scalars['ID'];
  link: Scalars['String'];
  order: Scalars['Int'];
  active: Scalars['Boolean'];
};

export type ChallengeCategories = {
  __typename?: 'ChallengeCategories';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  order?: Maybe<Scalars['Float']>;
  /** @deprecated To get the configuration of a category now there is a new field called category_configuration */
  configuration?: Maybe<ChallengeConfiguration>;
  category_configuration?: Maybe<CategoryConfiguration>;
};

export type ChallengeConfiguration = {
  __typename?: 'ChallengeConfiguration';
  id: Scalars['ID'];
  challenge_id: Scalars['String'];
  challenge_category_id?: Maybe<Scalars['String']>;
  coverage_array: Array<Scalars['String']>;
  pass_faster: Scalars['Boolean'];
  first_to_complete: Scalars['Boolean'];
  accumulation: Scalars['Boolean'];
  altimetry_goal_value?: Maybe<Scalars['Float']>;
  distance_goal_value?: Maybe<Scalars['Float']>;
  max_distance_goal_value?: Maybe<Scalars['Float']>;
  max_altimetry_goal_value?: Maybe<Scalars['Float']>;
  max_time_goal_value?: Maybe<Scalars['Int']>;
  min_time_goal_value?: Maybe<Scalars['Int']>;
  unique_ride: Scalars['Boolean'];
  is_draw: Scalars['Boolean'];
  is_win_prizes: Scalars['Boolean'];
  award_at_address: Scalars['Boolean'];
  automatic_draw: Scalars['Boolean'];
  is_paid: Scalars['Boolean'];
  classification_by_award: Scalars['Boolean'];
  accept_withdrawal: Scalars['Boolean'];
  allows_category_change?: Maybe<Scalars['Boolean']>;
  deadline_category_change?: Maybe<Scalars['CacheDate']>;
  days_to_complete?: Maybe<Scalars['Float']>;
  only_riderize_provider: Scalars['Boolean'];
  has_paid_kit: Scalars['Boolean'];
  managed_by_riderize: Scalars['Boolean'];
  challenge_shipping_type_code?: Maybe<Scalars['String']>;
  challenge_shipping_type?: Maybe<ChallengeShippingType>;
};

export type ChallengeExternalLinksAttached = {
  __typename?: 'ChallengeExternalLinksAttached';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  favicon_image_link?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
};

export type ChallengeFreightQuote = {
  __typename?: 'ChallengeFreightQuote';
  id: Scalars['ID'];
  user_id: Scalars['String'];
  award_id: Scalars['String'];
  weight: Scalars['Float'];
  zip_origin: Scalars['String'];
  zip_destination: Scalars['String'];
  value: Scalars['Float'];
};

export type ChallengeImages = {
  __typename?: 'ChallengeImages';
  id: Scalars['ID'];
  link: Scalars['String'];
  order?: Maybe<Scalars['Float']>;
};

export type ChallengeParticipantsStatisticsResponse = {
  __typename?: 'ChallengeParticipantsStatisticsResponse';
  count_subscribers: Scalars['Float'];
  count_followed_by_me: Scalars['Float'];
  count_who_followe_me: Scalars['Float'];
  count_gender_male: Scalars['Float'];
  count_gender_female: Scalars['Float'];
};

export type ChallengePaymentInput = {
  chosen_award_id?: Maybe<Scalars['String']>;
};

export type ChallengeRankSummaryResponse = {
  __typename?: 'ChallengeRankSummaryResponse';
  subscribed_highlights: HighlightsOfCchallengeInRankResponse;
  challenge_statistics: ChallengeStatisticsResponse;
  participants_statistics: ChallengeParticipantsStatisticsResponse;
};

export type ChallengeSegments = {
  __typename?: 'ChallengeSegments';
  challenge_id: Scalars['String'];
  strava_segment_id: Scalars['Float'];
  sequence: Scalars['Int'];
};

export type ChallengeShippingType = {
  __typename?: 'ChallengeShippingType';
  code: Scalars['String'];
  name: Scalars['String'];
  message_in_app: Scalars['String'];
  active: Scalars['Boolean'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  translations?: Maybe<Array<ChallengeShippingTypeTranslation>>;
};

export type ChallengeShippingTypeTranslation = {
  __typename?: 'ChallengeShippingTypeTranslation';
  challenge_shipping_type_code: Scalars['String'];
  language_code: Scalars['String'];
  name: Scalars['String'];
  message_in_app: Scalars['String'];
  active: Scalars['Boolean'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  challenge_shipping_type: Array<ChallengeShippingType>;
};

export type ChallengeShowCaseAvailable = {
  __typename?: 'ChallengeShowCaseAvailable';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  file_key: Scalars['String'];
  type: Scalars['String'];
};

export type ChallengeShowCaseResponse = {
  __typename?: 'ChallengeShowCaseResponse';
  items: Array<ChallengeShowCaseType>;
  page_info: PaginationInfo;
};

export type ChallengeShowCaseType = {
  __typename?: 'ChallengeShowCaseType';
  name: Scalars['String'];
  key: Scalars['String'];
  type: Scalars['String'];
  order: Scalars['Int'];
  content: Array<Challenge>;
};

export type ChallengeStatisticsResponse = {
  __typename?: 'ChallengeStatisticsResponse';
  total_distance?: Maybe<Scalars['Float']>;
  total_altimetry?: Maybe<Scalars['Float']>;
  total_time_ride?: Maybe<Scalars['Float']>;
  total_rides?: Maybe<Scalars['Float']>;
};

export type ChallengeSummary = {
  __typename?: 'ChallengeSummary';
  _id: Scalars['ID'];
  challenge_id: Scalars['String'];
  count_view?: Maybe<Scalars['Float']>;
  count_comments?: Maybe<Scalars['Float']>;
  count_subscribe?: Maybe<Scalars['Float']>;
  count_unsubscribed?: Maybe<Scalars['Float']>;
  count_claps?: Maybe<Scalars['Float']>;
  total_paid?: Maybe<Scalars['Float']>;
  total_to_pay?: Maybe<Scalars['Float']>;
  total_to_receive?: Maybe<Scalars['Float']>;
};

export type ChallengeType = {
  __typename?: 'ChallengeType';
  challenge_type: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export type ChallengeUserDataInput = {
  user_id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type ChallengesBestResultsByTypeInput = {
  term_of_search: Scalars['String'];
  type: Scalars['String'];
};

export type ChallengesCategoriesRoutesType = {
  __typename?: 'ChallengesCategoriesRoutesType';
  challenge_category_id: Scalars['String'];
  event_route_id: Scalars['String'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  challenge_category: ChallengeCategories;
  event_routes: EventRoutesType;
};

export type ChallengesPaginatedResponse = {
  __typename?: 'ChallengesPaginatedResponse';
  items: Array<Challenge>;
  page_info: PaginationInfo;
};

export type ChangeHealthConnectionsInput = {
  integrated_with_google_fit?: Maybe<Scalars['Boolean']>;
  integrated_with_apple_health?: Maybe<Scalars['Boolean']>;
};

export type ChangeSubscriptionCategoryInput = {
  user_challenge_id: Scalars['String'];
  challenge_category_id: Scalars['String'];
  isOrganizerOrStaff?: Maybe<Scalars['Boolean']>;
};

export type CitiesInput = {
  state_id: Scalars['String'];
};

export type City = {
  __typename?: 'City';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  status: Scalars['Boolean'];
  id_locale?: Maybe<Scalars['String']>;
  state: State;
};

export type CityByZipCodeResponse = {
  __typename?: 'CityByZipCodeResponse';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Clap = {
  __typename?: 'Clap';
  challenge_id: Scalars['String'];
  profile_id: Scalars['String'];
  profile: Profile;
  count: Scalars['Float'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['ID'];
  challenge_id: Scalars['String'];
  profile_id: Scalars['String'];
  claps_count?: Maybe<Scalars['Float']>;
  profile: Profile;
  parent_challenge_comment_id?: Maybe<Scalars['String']>;
  childComments?: Maybe<Array<Comment>>;
  claps?: Maybe<Array<CommentClap>>;
  text: Scalars['String'];
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
};

export type CommentClap = {
  __typename?: 'CommentClap';
  challenge_comment_id: Scalars['String'];
  profile_id: Scalars['String'];
  profile: Profile;
  count: Scalars['Float'];
};

export type CommissioningModelTranslationType = {
  __typename?: 'CommissioningModelTranslationType';
  language_code: Scalars['String'];
  commissioning_model_id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  percentage: Scalars['Float'];
  minimum_installment_amount: Scalars['Float'];
  interest_rate: Scalars['Float'];
  max_installments: Scalars['Float'];
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
};

export type CommissioningModelType = {
  __typename?: 'CommissioningModelType';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  translations: Array<CommissioningModelTranslationType>;
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
};

export type CompaniesPaginatedResponse = {
  __typename?: 'CompaniesPaginatedResponse';
  companies?: Maybe<Array<Company>>;
  page_info: PaginationInfo;
};

export type Company = {
  __typename?: 'Company';
  id: Scalars['ID'];
  business_name: Scalars['String'];
  fantasy_name: Scalars['String'];
  email: Scalars['String'];
  phone_number: Scalars['String'];
  site: Scalars['String'];
  register_number: Scalars['String'];
  register_number_region: Scalars['Float'];
  address_one: Scalars['String'];
  address_two: Scalars['String'];
  zip_code: Scalars['String'];
  count_challenges: Scalars['Float'];
  challenges_subscription_count: Scalars['Float'];
  challenges_award_count: Scalars['Float'];
  company_type_id: Scalars['String'];
  city_id: Scalars['String'];
  active: Scalars['Boolean'];
  profile: Profile;
  company_addresses?: Maybe<Array<CompanyAddressType>>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export type CompanyAddressType = {
  __typename?: 'CompanyAddressType';
  address_id: Scalars['String'];
  company_id: Scalars['String'];
  is_billing_address: Scalars['Boolean'];
  address: AddressType;
  company: Company;
};

export type CompanyBankAccount = {
  __typename?: 'CompanyBankAccount';
  id: Scalars['ID'];
  name: Scalars['String'];
  agency: Scalars['String'];
  agency_digit?: Maybe<Scalars['String']>;
  account: Scalars['String'];
  account_digit?: Maybe<Scalars['String']>;
  associated_document?: Maybe<Scalars['String']>;
  default_account: Scalars['Boolean'];
};

export type Complaint = {
  __typename?: 'Complaint';
  id: Scalars['ID'];
  complaint_type_id: Scalars['String'];
  resource: Scalars['String'];
  resource_id: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
};

export type ComplaintType = {
  __typename?: 'ComplaintType';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type ComplaintTypeTranslation = {
  __typename?: 'ComplaintTypeTranslation';
  complaint_type_id: Scalars['String'];
  language_code: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type ComplaintTypeTranslationInput = {
  complaint_type_id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  language_code: Scalars['String'];
};

export type CrawledActivityResponse = {
  __typename?: 'CrawledActivityResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type CreateActivityInput = {
  distance?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
  start_date?: Maybe<Scalars['String']>;
  end_date?: Maybe<Scalars['String']>;
  calories?: Maybe<Scalars['Float']>;
  device_name?: Maybe<Scalars['String']>;
  provider_id?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
};

export type CreateAddressInput = {
  name: Scalars['String'];
  zip_code: Scalars['String'];
  street_address: Scalars['String'];
  street_number: Scalars['Float'];
  neighborhood: Scalars['String'];
  complement?: Maybe<Scalars['String']>;
  reference_point?: Maybe<Scalars['String']>;
  city_id: Scalars['String'];
  is_billing_address: Scalars['Boolean'];
};

export type CreateAppleUserInput = {
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  apple_id: Scalars['String'];
};

export type CreateAwardDeliveryAddressInput = {
  challenge_id?: Maybe<Scalars['String']>;
  city_id: Scalars['String'];
  user_challenge_id?: Maybe<Scalars['String']>;
  address_line_one: Scalars['String'];
  address_line_two?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  tracking_code?: Maybe<Scalars['String']>;
  tracking_link?: Maybe<Scalars['String']>;
  shipping_company?: Maybe<Scalars['String']>;
  delivery?: Maybe<Scalars['Boolean']>;
  street_address: Scalars['String'];
  street_number: Scalars['String'];
  reference_point?: Maybe<Scalars['String']>;
  complement?: Maybe<Scalars['String']>;
  neighborhood: Scalars['String'];
};

export type CreateAwardImagesInput = {
  challenge_id: Scalars['String'];
  award_id: Scalars['String'];
  link: Scalars['String'];
  order: Scalars['Float'];
  active: Scalars['Boolean'];
};

export type CreateAwardImagesResponse = {
  __typename?: 'CreateAwardImagesResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type CreateAwardVolumeInput = {
  award_id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  height: Scalars['Float'];
  width: Scalars['Float'];
  depth: Scalars['Float'];
  weight: Scalars['Float'];
};

export type CreateBankInput = {
  name_short: Scalars['String'];
  name_long: Scalars['String'];
  swift_code: Scalars['String'];
  ispb_brazil: Scalars['Float'];
  compe_brazil: Scalars['Float'];
  country_id?: Maybe<Scalars['String']>;
};

export type CreateCardInput = {
  card_number: Scalars['String'];
  card_expiration_date: Scalars['String'];
  card_holder_name: Scalars['String'];
  card_cvv: Scalars['String'];
  name: Scalars['String'];
  legal_holder_number: Scalars['String'];
};

export type CreateCategoryConfigurationInput = {
  altimetry_goal_value?: Maybe<Scalars['Float']>;
  distance_goal_value?: Maybe<Scalars['Float']>;
  maximum_time_goal_value?: Maybe<Scalars['Int']>;
  minimum_time_goal_value?: Maybe<Scalars['Int']>;
  max_distance_goal_value?: Maybe<Scalars['Float']>;
  max_altimetry_goal_value?: Maybe<Scalars['Float']>;
};

export type CreateChallengeAttachedFilesInput = {
  challenge_id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  link: Scalars['String'];
};

export type CreateChallengeAwardImageInput = {
  link: Scalars['String'];
  order: Scalars['Int'];
  active: Scalars['Boolean'];
};

export type CreateChallengeAwardInput = {
  award_name?: Maybe<Scalars['String']>;
  award_description?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  subscribers_limit?: Maybe<Scalars['Float']>;
  only_for_draw?: Maybe<Scalars['Boolean']>;
  production_time?: Maybe<Scalars['Float']>;
  award_images?: Maybe<Array<CreateChallengeAwardImageInput>>;
  additional_request?: Maybe<Array<AdditionalRequestInput>>;
};

export type CreateChallengeCategoriesInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  order?: Maybe<Scalars['Float']>;
  challenge_id?: Maybe<Scalars['String']>;
  configuration: CreateCategoryConfigurationInput;
};

export type CreateChallengeConfigurationInput = {
  coverage_array: Array<Scalars['String']>;
  pass_faster: Scalars['Boolean'];
  first_to_complete: Scalars['Boolean'];
  accumulation: Scalars['Boolean'];
  altimetry_goal_value?: Maybe<Scalars['Float']>;
  distance_goal_value?: Maybe<Scalars['Float']>;
  max_distance_goal_value?: Maybe<Scalars['Float']>;
  max_altimetry_goal_value?: Maybe<Scalars['Float']>;
  max_time_goal_value?: Maybe<Scalars['Int']>;
  min_time_goal_value?: Maybe<Scalars['Int']>;
  unique_ride: Scalars['Boolean'];
  is_draw: Scalars['Boolean'];
  is_win_prizes: Scalars['Boolean'];
  award_at_address: Scalars['Boolean'];
  automatic_draw: Scalars['Boolean'];
  is_paid: Scalars['Boolean'];
  classification_by_award?: Maybe<Scalars['Boolean']>;
  accept_withdrawal?: Maybe<Scalars['Boolean']>;
  allows_category_change?: Maybe<Scalars['Boolean']>;
  deadline_category_change?: Maybe<Scalars['DateTime']>;
  days_to_complete?: Maybe<Scalars['Float']>;
  only_riderize_provider?: Maybe<Scalars['Boolean']>;
  has_paid_kit?: Maybe<Scalars['Boolean']>;
  managed_by_riderize?: Maybe<Scalars['Boolean']>;
  challenge_shipping_type_code?: Maybe<Scalars['String']>;
};

export type CreateChallengeConfigurationSegmentsInput = {
  challenge_id: Scalars['String'];
  strava_segment_id: Scalars['Float'];
  sequence: Scalars['Int'];
};

export type CreateChallengeExternalLinksAttachedInput = {
  challenge_id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  link: Scalars['String'];
};

export type CreateChallengeImagesInput = {
  challenge_id: Scalars['String'];
  link: Scalars['String'];
  order: Scalars['Int'];
};

export type CreateChallengeInput = {
  name: Scalars['String'];
  creator_id: Scalars['String'];
  company_id: Scalars['String'];
  challenge_type: Scalars['String'];
  internal_test?: Maybe<Scalars['Boolean']>;
  eligible_spotlight?: Maybe<Scalars['Boolean']>;
  image_spotlight?: Maybe<Scalars['String']>;
  start_date: Scalars['DateTime'];
  end_date: Scalars['DateTime'];
  has_achievement: Scalars['Boolean'];
  description: Scalars['String'];
  image_avatar?: Maybe<Scalars['String']>;
  start_date_registration?: Maybe<Scalars['DateTime']>;
  end_date_registration?: Maybe<Scalars['DateTime']>;
  image_cover?: Maybe<Scalars['String']>;
  rank: Scalars['Boolean'];
  prestart_visibility: Scalars['Boolean'];
  launch_date?: Maybe<Scalars['DateTime']>;
  registration_limit?: Maybe<Scalars['Float']>;
  date_for_drawn?: Maybe<Scalars['DateTime']>;
  accept_installments?: Maybe<Scalars['Boolean']>;
  has_categories: Scalars['Boolean'];
  commissioning_model_id?: Maybe<Scalars['String']>;
};

export type CreateChallengeShippingTypeInput = {
  code: Scalars['String'];
  name: Scalars['String'];
  message_in_app: Scalars['String'];
};

export type CreateChallengeShippingTypeTranslationInput = {
  challenge_shipping_type_code: Scalars['String'];
  language_code: Scalars['String'];
  name: Scalars['String'];
  message_in_app: Scalars['String'];
};

export type CreateChallengeShowCaseInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  file_key: Scalars['String'];
  type: Scalars['String'];
  order: Scalars['Float'];
};

export type CreateClapInput = {
  challenge_id: Scalars['String'];
  profile_id: Scalars['String'];
  count: Scalars['Float'];
};

export type CreateCommentClapInput = {
  challenge_comment_id: Scalars['String'];
  profile_id: Scalars['String'];
  count: Scalars['Float'];
};

export type CreateCommentInput = {
  challenge_id: Scalars['String'];
  parent_challenge_comment_id?: Maybe<Scalars['String']>;
  profile_id: Scalars['String'];
  text: Scalars['String'];
};

export type CreateCommissioningModelInput = {
  name: Scalars['String'];
  description: Scalars['String'];
};

export type CreateCommissioningModelTranslationInput = {
  language_code: Scalars['String'];
  commissioning_model_id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  percentage: Scalars['Float'];
  minimum_installment_amount: Scalars['Float'];
  interest_rate: Scalars['Float'];
  max_installments?: Maybe<Scalars['Float']>;
};

export type CreateCompanyAddressInput = {
  company_id: Scalars['String'];
  name: Scalars['String'];
  zip_code: Scalars['String'];
  street_address: Scalars['String'];
  street_number: Scalars['Float'];
  neighborhood: Scalars['String'];
  complement?: Maybe<Scalars['String']>;
  reference_point?: Maybe<Scalars['String']>;
  city_id: Scalars['String'];
  is_billing_address: Scalars['Boolean'];
};

export type CreateCompanyBankAccountInput = {
  name: Scalars['String'];
  agency: Scalars['String'];
  agency_digit?: Maybe<Scalars['String']>;
  account: Scalars['String'];
  account_digit?: Maybe<Scalars['String']>;
  associated_document?: Maybe<Scalars['String']>;
  default_account?: Maybe<Scalars['Boolean']>;
  company_id: Scalars['String'];
  bank_id: Scalars['String'];
};

export type CreateCompanyInput = {
  business_name: Scalars['String'];
  fantasy_name?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phone_number: Scalars['String'];
  site?: Maybe<Scalars['String']>;
  register_number?: Maybe<Scalars['String']>;
  register_number_region?: Maybe<Scalars['Float']>;
  address_one?: Maybe<Scalars['String']>;
  address_two?: Maybe<Scalars['String']>;
  company_type_id?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  city_id?: Maybe<Scalars['String']>;
};

export type CreateComplaintInput = {
  complaint_type_id: Scalars['String'];
  resource: Scalars['String'];
  resource_id: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
};

export type CreateComplaintTypeInput = {
  name: Scalars['String'];
  description: Scalars['String'];
};

export type CreateEventRouteFromExistentActivityInput = {
  challenge_id: Scalars['String'];
  activity_id: Scalars['String'];
};

export type CreateEventRoutePoiInput = {
  challenge_id: Scalars['String'];
  name: Scalars['String'];
  event_route_id: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
};

export type CreateEventSubscriptionPriceInput = {
  challenge_id: Scalars['String'];
  value: Scalars['Float'];
  date_initial: Scalars['DateTime'];
};

export type CreateEventSupportPointInput = {
  challenge_id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  opening_time?: Maybe<Scalars['DateTime']>;
  closing_time?: Maybe<Scalars['DateTime']>;
  available_mechanic?: Maybe<Scalars['Boolean']>;
  available_food?: Maybe<Scalars['Boolean']>;
  start: Scalars['Boolean'];
  finish: Scalars['Boolean'];
  order: Scalars['Float'];
};

export type CreateFacebookUserInput = {
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  facebook_id: Scalars['Float'];
  profile_avatar?: Maybe<Scalars['String']>;
};

export type CreateFreightQuoteInput = {
  user_id: Scalars['String'];
  award_id: Scalars['String'];
  zip_origin: Scalars['String'];
  zip_destination: Scalars['String'];
};

export type CreateGoogleUserInput = {
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  email: Scalars['String'];
  google_id: Scalars['String'];
  profile_avatar?: Maybe<Scalars['String']>;
};

export type CreateMonitorActivityInput = {
  distance: Scalars['Float'];
  elapsed_time: Scalars['Float'];
  moving_time: Scalars['Float'];
  start_date: Scalars['DateTime'];
  total_elevation_gain?: Maybe<Scalars['Float']>;
  total_ascent?: Maybe<Scalars['Float']>;
  total_descent?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  device_name: Scalars['String'];
  visibility?: Maybe<Scalars['String']>;
  is_private?: Maybe<Scalars['Boolean']>;
  gps_points: Array<GpsPointsInput>;
  send_to_strava: Scalars['Boolean'];
  strava_id_data_source?: Maybe<Scalars['String']>;
};

export type CreatePaymentApprovedAtAntifraudInput = {
  transaction_id_of_current_payment: Scalars['String'];
  transaction_id_of_the_previous_payment?: Maybe<Scalars['String']>;
  challenge_id?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

export type CreatePaymentApprovedAtAntifraudResponse = {
  __typename?: 'CreatePaymentApprovedAtAntifraudResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type CreatePossibleRequestResponseInput = {
  response: Scalars['String'];
  order?: Maybe<Scalars['Float']>;
  image_reference?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
};

export type CreateProductImageInput = {
  product_id: Scalars['String'];
  link: Scalars['String'];
  order: Scalars['Float'];
  challenge_id: Scalars['String'];
};

export type CreateProductImageResponse = {
  __typename?: 'CreateProductImageResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type CreateProductInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  date_initial?: Maybe<Scalars['DateTime']>;
  date_end?: Maybe<Scalars['DateTime']>;
  only_award?: Maybe<Scalars['Boolean']>;
  available: Scalars['Boolean'];
  order: Scalars['Float'];
  has_cost: Scalars['Boolean'];
  allow_buy_without_subscription: Scalars['Boolean'];
  free_field: Scalars['Boolean'];
  challenge_id?: Maybe<Scalars['String']>;
  award_id?: Maybe<Scalars['String']>;
};

export type CreateProductPriceInput = {
  product_id: Scalars['String'];
  challenge_id: Scalars['String'];
  value: Scalars['Float'];
  date_initial: Scalars['DateTime'];
};

export type CreateProductVariationImageInput = {
  link: Scalars['String'];
  order: Scalars['Float'];
  product_variation_id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type CreateProductVariationInput = {
  product_id: Scalars['String'];
  text: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  available_quantity?: Maybe<Scalars['Float']>;
  available: Scalars['Boolean'];
  order: Scalars['Float'];
  challenge_id?: Maybe<Scalars['String']>;
};

export type CreateProductVariationPriceInput = {
  value: Scalars['Float'];
  date_initial: Scalars['DateTime'];
  product_variation_id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type CreateStravaUserInput = {
  username?: Maybe<Scalars['String']>;
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  strava_city: Scalars['String'];
  strava_country: Scalars['String'];
  strava_state: Scalars['String'];
  gender: Scalars['String'];
  paid_strava: Scalars['Boolean'];
  profile_avatar: Scalars['String'];
  strava_id: Scalars['Float'];
  access_token: Scalars['String'];
  token_type: Scalars['String'];
  expires: Scalars['Float'];
};

export type CreateSuggestionInput = {
  text: Scalars['String'];
  score: Scalars['Float'];
};

export type CreateThirdPartyDataInput = {
  name: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
  is_gps: Scalars['Boolean'];
  active: Scalars['Boolean'];
};

export type CreateUserEventExtraordinaryActionInput = {
  user_id: Scalars['String'];
  challenge_id?: Maybe<Scalars['String']>;
  bonus_subscription?: Maybe<Scalars['Boolean']>;
  buy_after_registration_closes?: Maybe<Scalars['Boolean']>;
};

export type CreateUserEventSupportPointInput = {
  athlete_identification: Scalars['String'];
  challenge_id: Scalars['String'];
  event_support_point_id: Scalars['String'];
  check_time: Scalars['DateTime'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  user_check: Scalars['Boolean'];
};

export type CreateWithdrawalAddressInput = {
  name: Scalars['String'];
  challenge_id: Scalars['String'];
  zip_code: Scalars['String'];
  address_line_one: Scalars['String'];
  address_line_two: Scalars['String'];
  reference_point: Scalars['String'];
  city_id: Scalars['String'];
};

export type DataCompiled = {
  __typename?: 'DataCompiled';
  _id: Scalars['ID'];
  user_id: Scalars['String'];
  integrated_with_google_fit: Scalars['Boolean'];
  integrated_with_apple_health: Scalars['Boolean'];
  integrated_with_strava_crawler: Scalars['Boolean'];
  integrated_with_garmin: Scalars['Boolean'];
  integrated_with_polar: Scalars['Boolean'];
  integrated_with_strava: Scalars['Boolean'];
  has_company: Scalars['Boolean'];
  verified_phone: Scalars['Boolean'];
  last_upload_google_fit?: Maybe<Scalars['DateTime']>;
  last_upload_apple_health?: Maybe<Scalars['DateTime']>;
  last_upload_polar?: Maybe<Scalars['DateTime']>;
  last_upload_garmin?: Maybe<Scalars['DateTime']>;
  last_platform_used?: Maybe<Scalars['String']>;
  last_app_version_used?: Maybe<Scalars['String']>;
  last_device_used?: Maybe<Scalars['String']>;
  last_time_used?: Maybe<Scalars['String']>;
  view_welcome_screen?: Maybe<Scalars['Boolean']>;
};


export type DeleteAddressInput = {
  user_id?: Maybe<Scalars['String']>;
  company_id?: Maybe<Scalars['String']>;
  address_id: Scalars['String'];
};

export type DeleteAssociationProductToAwardInput = {
  product_id: Scalars['String'];
  award_id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type DeleteAssociationUserWithCompanyInput = {
  user_id: Scalars['String'];
  company_id: Scalars['String'];
};

export type DeleteAwardResponse = {
  __typename?: 'DeleteAwardResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type DeleteChallengeCategoryInput = {
  id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type DeleteCommissioningModelTranslationInput = {
  language_code: Scalars['String'];
  commissioning_model_id: Scalars['String'];
};

export type DeleteCompanyAddressInput = {
  company_id: Scalars['String'];
  address_id: Scalars['String'];
};

export type DeleteComplaintTypeTranslationInput = {
  complaint_type_id: Scalars['String'];
  language_code: Scalars['String'];
};

export type DeleteEventRoutePoiInput = {
  poi_id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type DeleteEventSubscriptionPriceInput = {
  id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type DeleteInput = {
  id: Scalars['String'];
};

export type DeleteProductImageInput = {
  id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type DeleteProductPriceInput = {
  id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type DeleteProductVariationInput = {
  id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type DeleteProductVariationPriceInput = {
  id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type DeleteUserChallengeActivityInput = {
  challenge_id?: Maybe<Scalars['String']>;
  activity_id: Scalars['String'];
  user_id?: Maybe<Scalars['String']>;
};

export type DeleteUserEventExtraordinaryActionInput = {
  id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type DisconnectThirdPartyProviderInput = {
  id_data_source: Scalars['String'];
};

export type DuplicateProductVariationInput = {
  product_id: Scalars['String'];
  text: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  available_quantity?: Maybe<Scalars['Float']>;
  available: Scalars['Boolean'];
  order: Scalars['Float'];
  images: Array<CreateProductVariationImageInput>;
  prices: Array<CreateProductVariationPriceInput>;
};

export type EventRouteCoordinates = {
  __typename?: 'EventRouteCoordinates';
  _id: Scalars['ID'];
  event_route_id: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  elevation: Scalars['Float'];
  order: Scalars['Float'];
  event_routes: EventRoutesType;
};

export type EventRoutesPoisType = {
  __typename?: 'EventRoutesPoisType';
  id: Scalars['ID'];
  name: Scalars['String'];
  event_route_id: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  event_routes: EventRoutesType;
};

export type EventRoutesSupportPointsType = {
  __typename?: 'EventRoutesSupportPointsType';
  event_route_id: Scalars['String'];
  event_support_point_id: Scalars['String'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  event_routes: EventRoutesType;
  event_support_point: EventSupportPointType;
};

export type EventRoutesType = {
  __typename?: 'EventRoutesType';
  id: Scalars['ID'];
  challenge_id: Scalars['String'];
  name: Scalars['String'];
  distance: Scalars['Float'];
  altimetry?: Maybe<Scalars['Float']>;
  polyline: Scalars['String'];
  summary_polyline: Scalars['String'];
  route_thumbnail_image: Scalars['String'];
  min_bounds: Array<Scalars['Float']>;
  max_bounds: Array<Scalars['Float']>;
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  challenge: Challenge;
  event_routes_pois?: Maybe<Array<EventRoutesPoisType>>;
  challenges_categories_routes?: Maybe<Array<ChallengesCategoriesRoutesType>>;
  event_routes_support_points?: Maybe<Array<EventRoutesSupportPointsType>>;
  event_route_coordinates?: Maybe<Array<EventRouteCoordinates>>;
};

export type EventSubscriptionPriceType = {
  __typename?: 'EventSubscriptionPriceType';
  id: Scalars['ID'];
  challenge_id: Scalars['String'];
  value: Scalars['Float'];
  date_initial: Scalars['CacheDate'];
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
};

export type EventSupportPointType = {
  __typename?: 'EventSupportPointType';
  id: Scalars['ID'];
  challenge_id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  opening_time?: Maybe<Scalars['CacheDate']>;
  closing_time?: Maybe<Scalars['CacheDate']>;
  available_mechanic?: Maybe<Scalars['Boolean']>;
  available_food?: Maybe<Scalars['Boolean']>;
  start: Scalars['Boolean'];
  finish: Scalars['Boolean'];
  order: Scalars['Float'];
  active: Scalars['Boolean'];
  challenge: Challenge;
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  event_routes_support_points: Array<EventRoutesSupportPointsType>;
};

export type ExtraordinaryActionsOfChallengeResponse = {
  __typename?: 'ExtraordinaryActionsOfChallengeResponse';
  extraordinary_actions: Array<UserEventExtraordinaryActionType>;
  page_info: PaginationInfo;
};

export type FavoriteUserChallenge = {
  __typename?: 'FavoriteUserChallenge';
  challenge_id: Scalars['String'];
  profile_id: Scalars['String'];
  challenge: Challenge;
};

export type FavoriteUserChallengeInput = {
  challenge_id: Scalars['String'];
  profile_id: Scalars['String'];
};

export type FindAddressByZipCodeResponse = {
  __typename?: 'FindAddressByZipCodeResponse';
  street_address: Scalars['String'];
  zip_code: Scalars['String'];
  city: CityByZipCodeResponse;
  state: StateByZipCodeResponse;
};

export type FindSegmentsByLocationInput = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  range: Scalars['Float'];
};

export type FindWithdrawalAddressesInput = {
  challenge_id: Scalars['String'];
};

export type FollowProfileInput = {
  profile_main_id: Scalars['String'];
  profile_following_id: Scalars['String'];
};

export type FollowingProfile = {
  __typename?: 'FollowingProfile';
  _id: Scalars['ID'];
  profile_main_id: Scalars['String'];
  profile_following_id: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export type GetAddressToDeliverAwardInput = {
  user_challenge_id: Scalars['String'];
};

export type GetAllPoisByEventRouteInput = {
  event_route_id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type GetAwardSubscriptionInput = {
  challenge_id?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
  user_challenge_id?: Maybe<Scalars['String']>;
};

export type GetChallengeAwardAdditionalRequestInput = {
  award_id: Scalars['String'];
  user_challenge_id?: Maybe<Scalars['String']>;
  challenge_id?: Maybe<Scalars['String']>;
};

export type GetChallengeAwardsInput = {
  challenge_id: Scalars['String'];
};

export type GetChallengeDetailInput = {
  id: Scalars['String'];
  profile_id: Scalars['String'];
};

export type GetChallengesByTypeInput = {
  type: Scalars['String'];
  profile_id: Scalars['String'];
};

export type GetCommissioningModelTranslationInput = {
  language_code: Scalars['String'];
  commissioning_model_id: Scalars['String'];
};

export type GetDetailedEventRoutePoiInput = {
  poi_id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type GetDetailedSubscriptionInput = {
  id?: Maybe<Scalars['String']>;
  short_id?: Maybe<Scalars['String']>;
};

export type GetExtraordinaryEventsOfChallengeInput = {
  challenge_id: Scalars['String'];
  bonus_subscription?: Maybe<Scalars['Boolean']>;
  buy_after_registration_closes?: Maybe<Scalars['Boolean']>;
};

export type GetProductsAcquiredInput = {
  user_id?: Maybe<Scalars['String']>;
  challenge_id?: Maybe<Scalars['String']>;
};

export type GetProfileDetailInput = {
  profile_id_requesting: Scalars['String'];
  profile_id_accessed: Scalars['String'];
};

export type GetRanksInput = {
  challenge_id: Scalars['String'];
  key: Scalars['String'];
};

export type GetSegmentByNameInput = {
  name: Scalars['String'];
  page: Scalars['Float'];
  offset: Scalars['Float'];
};

export type GetUserActivityContentResponse = {
  __typename?: 'GetUserActivityContentResponse';
  name: Scalars['String'];
  person_name: Scalars['String'];
  avatar: Scalars['String'];
  type: Scalars['String'];
  distance: Scalars['Float'];
  time: Scalars['String'];
  elevation: Scalars['Float'];
  date: Scalars['String'];
  address: Scalars['String'];
  key: Scalars['String'];
};

export type GetUserChallengeProgressInput = {
  user_id: Scalars['String'];
  challenge_id: Scalars['String'];
  user_challenge_id?: Maybe<Scalars['String']>;
};

export type GpsPointsInput = {
  time: Scalars['DateTime'];
  speed: Scalars['Float'];
  coordinates: Array<Scalars['Float']>;
};

export type HealthActivityResponse = {
  __typename?: 'HealthActivityResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type HighlightsOfCchallengeInRankResponse = {
  __typename?: 'HighlightsOfCchallengeInRankResponse';
  highlight_by_greater_distance?: Maybe<UserChallenges>;
  highlight_by_greater_altimetry?: Maybe<UserChallenges>;
  highlight_by_greater_ride?: Maybe<UserChallenges>;
  highlight_by_greater_total_time?: Maybe<UserChallenges>;
};

export type InstallmentsInput = {
  amount: Scalars['Float'];
  challenge_id?: Maybe<Scalars['String']>;
};

export type InstallmentsResponse = {
  __typename?: 'InstallmentsResponse';
  installments: Array<Scalars['JSONObject']>;
};


export type ListAllChallengeProductsPurchasedInput = {
  challenge_id: Scalars['String'];
  search_text?: Maybe<Scalars['String']>;
  advanced_filters?: Maybe<AdvancedFiltersToFindProductsPurchasedInput>;
};

export type ListChallengeSubscriptionsInput = {
  challenge_id: Scalars['String'];
  search_text?: Maybe<Scalars['String']>;
  advanced_filters?: Maybe<AdvancedFiltersToFindSubscriptionsInput>;
};

export type ListChallengesUserCreatedInput = {
  profile_id: Scalars['String'];
  creator_id: Scalars['String'];
};

export type ListCompaniesResponse = {
  __typename?: 'ListCompaniesResponse';
  title: Scalars['String'];
  companies?: Maybe<Array<Company>>;
};

export type ListUserNotificationsInput = {
  profile_id: Scalars['String'];
  timestamp: Scalars['Float'];
};

export type LocaleType = {
  __typename?: 'LocaleType';
  language_code: Scalars['String'];
  ddi_phone?: Maybe<Scalars['Float']>;
  currency_code: Scalars['String'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  name?: Maybe<Scalars['String']>;
  name_native_language?: Maybe<Scalars['String']>;
  date_format?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  user: User;
  profile?: Maybe<Profile>;
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MarkSubscriptionAsWithdrawnInput = {
  challenge_id: Scalars['String'];
  subscription_user_id: Scalars['String'];
  user_id_who_marked_the_withdraw: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createChallenge: Challenge;
  updateChallenge: Challenge;
  updateChallengeConfiguration: ChallengeConfiguration;
  deleteChallenge: Scalars['Boolean'];
  createChallengeShippingType: ChallengeShippingType;
  createChallengeShippingTypeTranslation: ChallengeShippingTypeTranslation;
  updateChallengeShippingType: ChallengeShippingType;
  updateChallengeShippingTypeTranslation: ChallengeShippingTypeTranslation;
  deleteChallengeShippingType: Scalars['Boolean'];
  deleteChallengeShippingTypeTranslation: Scalars['Boolean'];
  subscribeUserChallenge: UserChallenges;
  buyAwardUserAlreadySubscribed: UserChallenges;
  reattemptSubscriptionPayment: SuccessfulPaymentResponse;
  setupSubscriptionToWithdraw: SetupSubscriptionsToWithdrawResponse;
  markSubscriptionAsWithdrawn: UserChallenges;
  updateWithdrawalAddress: UserChallenges;
  changeSubscriptionCategory: UserChallenges;
  buyProduct: BuyProductResponse;
  updateSubscription: UpdateSubscriptionResponse;
  unsubscribeUserChallenge: Scalars['Boolean'];
  createChallengeSegment: ChallengeSegments;
  Register: User;
  registerGoogleUser: LoginResponse;
  registerAppleUser: LoginResponse;
  registerFacebookUser: LoginResponse;
  registerStravaUser: User;
  createThirdPartyDataSource: ThirdPartyProvider;
  sendMail: Scalars['String'];
  verifyEmailCode: VerifyEmailResponse;
  verifyPhoneNumber: VerifyPhoneNumberResponse;
  codeRecovery: VerifyPhoneNumberResponse;
  login: LoginResponse;
  createCompany: Company;
  unactivateCompany: Company;
  associateUserToCompany: UsersCompanies;
  deleteAssociationUserWithCompany: Scalars['Boolean'];
  updateUser: User;
  changeHealthConnections: DataCompiled;
  changeUserPassword: User;
  reactivateUser: User;
  deleteWithoutVerifyUser: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  unactivateUser: User;
  registerAddress: User;
  disconnectPolar: Scalars['Boolean'];
  disconnectGarmin: Scalars['Boolean'];
  updateUserDataCompiled: DataCompiled;
  updateProfilePersonal: Profile;
  updateProfileCompany: Profile;
  createClap: Clap;
  undoClap: Clap;
  createComment: Comment;
  updateComment: Comment;
  deleteComment: Comment;
  createCommentClap: CommentClap;
  undoCommentClap: CommentClap;
  addAwardChallenge: ChallengeAwards;
  updateAwards: Array<ChallengeAwards>;
  deleteAward: DeleteAwardResponse;
  createTerm: Term;
  TermAccepted: TermAccepted;
  addfavoriteChallenge: FavoriteUserChallenge;
  deleteFavoriteChallenge: Scalars['Boolean'];
  followProfile: FollowingProfile;
  unfollowProfile: Scalars['Boolean'];
  /** @deprecated A new version of this mutation was launched in order to receive these activities by an array */
  createActivity: Activity;
  createActivityV2: HealthActivityResponse;
  createMonitorActivity: Activity;
  createActivityFromCrawler: CrawledActivityResponse;
  sendActivityToProvider: SendActivityToProviderResponse;
  /** @deprecated Now it is necessary to pass the user_id at the input of this mutation. In favor of this mutation use now deleteChallengeProgressActivityV2 */
  revaluateChallengeProgress: Scalars['Boolean'];
  deleteChallengeProgressActivity: Scalars['Boolean'];
  deleteChallengeProgressActivityV2: Scalars['Boolean'];
  removeActivityFromAllChallengeProgress: Scalars['Boolean'];
  markNotificationsAsRead: Array<Notification>;
  updateUserSettings: Settings;
  createComplaint: Complaint;
  createSuggestion: Suggestion;
  createPaymentApprovedAtAntifraud: CreatePaymentApprovedAtAntifraudResponse;
  createBank: Bank;
  changeBank: Bank;
  deleteBank: Scalars['Boolean'];
  changeSettingsProfileNotifications: SettingsProfileNotifications;
  createComplaintType: ComplaintType;
  createComplaintTypeTranslation: ComplaintTypeTranslation;
  updateComplaintType: ComplaintType;
  updateComplaintTypeTranslation: ComplaintTypeTranslation;
  deleteComplaintType: Scalars['Boolean'];
  deleteComplaintTypeTranslation: Scalars['Boolean'];
  createChallengeImage: Array<ChallengeImages>;
  updateChallengeImage: Array<ChallengeImages>;
  deleteChallengeImage: Scalars['Boolean'];
  createCompanyBankAccount: CompanyBankAccount;
  updateCompanyBankAccount: CompanyBankAccount;
  deleteCompanyBankAccount: Scalars['Boolean'];
  createCard: Card;
  updateCard: Card;
  deleteCard: Scalars['Boolean'];
  /** @deprecated To create an address to deliver the award it will be necessary to use the user_challenge_id now */
  createAwardDeliveryAddress: ChallengeAwardDeliveryAddress;
  createAddressToDeliverAward: ChallengeAwardDeliveryAddress;
  /** @deprecated To update an address to deliver the award it will be necessary to use the user_challenge_id now */
  updateAwardDeliveryAddress: ChallengeAwardDeliveryAddress;
  updateAddressToDeliverAward: ChallengeAwardDeliveryAddress;
  createChallengeShowCase: ChallengeShowCaseAvailable;
  addChallengeFilesAttached: ChallengeAttachedFiles;
  addChallengeExternalLinksAttached: ChallengeExternalLinksAttached;
  deleteExternalLinkAttached: Scalars['Boolean'];
  createAppData: AppData;
  updateAppData: AppData;
  createWithdrawalAddresses: Array<WithdrawalAddress>;
  createAwardVolume: AwardVolume;
  updateAwardVolume: AwardVolume;
  deleteAwardVolume: Scalars['Boolean'];
  calculateFreightQuote: ChallengeFreightQuote;
  generateAuthorizationPostage: AuthorizationPostageResponse;
  updateAuthorizationPostage: AuthorizationPostageResponse;
  addAwardImages: CreateAwardImagesResponse;
  createCategory: ChallengeCategories;
  deleteCategory: Scalars['Boolean'];
  updateCategories: Array<ChallengeCategories>;
  createCommissioningModel: CommissioningModelType;
  updateCommissioningModel: CommissioningModelType;
  deleteCommissioningModel: Scalars['Boolean'];
  createCommissioningModelTranslation: CommissioningModelTranslationType;
  updateCommissioningModelTranslation: CommissioningModelTranslationType;
  deleteCommissioningModelTranslation: Scalars['Boolean'];
  createProduct: ProductType;
  updateProduct: ProductType;
  deleteProduct: Scalars['Boolean'];
  associateProductToAward: AwardProductType;
  deleteAssociationProductToAward: Scalars['Boolean'];
  createProductVariation: ProductVariationType;
  duplicateProductVariation: ProductVariationType;
  updateProductVariation: ProductVariationType;
  deleteProductVariation: Scalars['Boolean'];
  createProductVariationPrice: ProductVariationPriceType;
  updateProductVariationPrice: ProductVariationPriceType;
  deleteProductVariationPrice: Scalars['Boolean'];
  createProductVariationImage: CreateProductImageResponse;
  updateProductVariationImageOrder: ProductVariationImageType;
  deleteProductVariationImage: Scalars['Boolean'];
  createUserAddress: AddressResponse;
  updateUserAddress: AddressResponse;
  deleteUserAddress: Scalars['Boolean'];
  createCompanyAddress: AddressResponse;
  updateCompanyAddress: AddressResponse;
  deleteCompanyAddress: Scalars['Boolean'];
  createProductImage: CreateProductImageResponse;
  updateProductImageOrder: ProductImageType;
  deleteProductImage: Scalars['Boolean'];
  createEventSupportPoint: EventSupportPointType;
  updateEventSupportPoint: EventSupportPointType;
  deleteEventSupportPoint: Scalars['Boolean'];
  createUserPassageAtSupportPoint: PointsPassageResponse;
  createUserEventExtraordinaryAction: UserEventExtraordinaryActionType;
  updateUserEventExtraordinaryAction: UserEventExtraordinaryActionType;
  deleteUserEventExtraordinaryAction: Scalars['Boolean'];
  createEventSubscriptionPrice: EventSubscriptionPriceType;
  updateEventSubscriptionPrice: EventSubscriptionPriceType;
  deleteEventSubscriptionPrice: Scalars['Boolean'];
  createProductPrice: ProductPriceType;
  updateProductPrice: ProductPriceType;
  deleteProductPrice: Scalars['Boolean'];
  createEventRouteFromExistentActivity: EventRoutesType;
  updateEventRoute: EventRoutesType;
  deleteEventRoute: Scalars['Boolean'];
  createEventRoutePoi: EventRoutesPoisType;
  deleteEventRoutePoi: Scalars['Boolean'];
  updateEventRoutePoi: EventRoutesPoisType;
};


export type MutationCreateChallengeArgs = {
  challenge_award: Array<CreateChallengeAwardInput>;
  challenge_categories?: Maybe<Array<CreateChallengeCategoriesInput>>;
  challenge_configuration?: Maybe<CreateChallengeConfigurationInput>;
  challenge: CreateChallengeInput;
};


export type MutationUpdateChallengeArgs = {
  data: UpdateChallengeInput;
  id: Scalars['String'];
};


export type MutationUpdateChallengeConfigurationArgs = {
  data: UpdateChallengeConfigurationInput;
};


export type MutationDeleteChallengeArgs = {
  id: Scalars['String'];
};


export type MutationCreateChallengeShippingTypeArgs = {
  data: CreateChallengeShippingTypeInput;
};


export type MutationCreateChallengeShippingTypeTranslationArgs = {
  data: CreateChallengeShippingTypeTranslationInput;
};


export type MutationUpdateChallengeShippingTypeArgs = {
  data: UpdateChallengeShippingTypeInput;
};


export type MutationUpdateChallengeShippingTypeTranslationArgs = {
  data: UpdateChallengeShippingTypeTranslationInput;
};


export type MutationDeleteChallengeShippingTypeArgs = {
  code: Scalars['String'];
};


export type MutationDeleteChallengeShippingTypeTranslationArgs = {
  language_code: Scalars['String'];
  challenge_shipping_type_code: Scalars['String'];
};


export type MutationSubscribeUserChallengeArgs = {
  shipping_address_id?: Maybe<Scalars['String']>;
  products_purchased?: Maybe<Array<ProductPurchasedInput>>;
  award_data?: Maybe<ChallengePaymentInput>;
  payment_data?: Maybe<PaymentInput>;
  challenge_award_requests?: Maybe<Array<ChallengeAwardAdditionalRequestInput>>;
  data: SubscribeUserChallengeInput;
};


export type MutationBuyAwardUserAlreadySubscribedArgs = {
  shipping_address_id?: Maybe<Scalars['String']>;
  products_purchased?: Maybe<Array<ProductPurchasedInput>>;
  award_data?: Maybe<ChallengePaymentInput>;
  payment_data?: Maybe<PaymentInput>;
  data: SubscribeUserChallengeInput;
};


export type MutationReattemptSubscriptionPaymentArgs = {
  award_data: ChallengePaymentInput;
  payment_data: PaymentInput;
};


export type MutationSetupSubscriptionToWithdrawArgs = {
  subscription_data?: Maybe<Array<SetupSubscriptionToWithdrawInput>>;
};


export type MutationMarkSubscriptionAsWithdrawnArgs = {
  data: MarkSubscriptionAsWithdrawnInput;
};


export type MutationUpdateWithdrawalAddressArgs = {
  data: UpdateSubscriptionWithdrawalAddressInput;
};


export type MutationChangeSubscriptionCategoryArgs = {
  data: ChangeSubscriptionCategoryInput;
};


export type MutationBuyProductArgs = {
  award_id?: Maybe<Scalars['String']>;
  payment_data: PaymentInput;
  user_data: ChallengeUserDataInput;
  products_chosen: Array<BuyProductInput>;
};


export type MutationUpdateSubscriptionArgs = {
  data: UpdateSubscriptionInput;
};


export type MutationUnsubscribeUserChallengeArgs = {
  challenge_id: Scalars['String'];
};


export type MutationCreateChallengeSegmentArgs = {
  data: CreateChallengeConfigurationSegmentsInput;
};


export type MutationRegisterArgs = {
  data: RegisterUserInput;
};


export type MutationRegisterGoogleUserArgs = {
  data: CreateGoogleUserInput;
};


export type MutationRegisterAppleUserArgs = {
  data: CreateAppleUserInput;
};


export type MutationRegisterFacebookUserArgs = {
  data: CreateFacebookUserInput;
};


export type MutationRegisterStravaUserArgs = {
  scope: Scalars['String'];
  data: CreateStravaUserInput;
};


export type MutationCreateThirdPartyDataSourceArgs = {
  data: CreateThirdPartyDataInput;
};


export type MutationSendMailArgs = {
  data: SendEmailInput;
};


export type MutationVerifyEmailCodeArgs = {
  data: VerifyEmailInput;
};


export type MutationVerifyPhoneNumberArgs = {
  data: PhoneInput;
};


export type MutationCodeRecoveryArgs = {
  data: SmsCodeInput;
};


export type MutationLoginArgs = {
  data: LoginUserInput;
};


export type MutationCreateCompanyArgs = {
  data: CreateCompanyInput;
};


export type MutationUnactivateCompanyArgs = {
  id: Scalars['String'];
};


export type MutationAssociateUserToCompanyArgs = {
  data: AssociateUserWithCompanyInput;
};


export type MutationDeleteAssociationUserWithCompanyArgs = {
  data: DeleteAssociationUserWithCompanyInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['String'];
};


export type MutationChangeHealthConnectionsArgs = {
  data: ChangeHealthConnectionsInput;
};


export type MutationChangeUserPasswordArgs = {
  data: RecoverUserPasswordInput;
};


export type MutationReactivateUserArgs = {
  email: Scalars['String'];
};


export type MutationDeleteWithoutVerifyUserArgs = {
  data: DeleteInput;
};


export type MutationDeleteUserArgs = {
  data: VerifyEmailInput;
};


export type MutationUnactivateUserArgs = {
  id: Scalars['String'];
};


export type MutationRegisterAddressArgs = {
  data: RegisterAddressInput;
};


export type MutationDisconnectPolarArgs = {
  data: DisconnectThirdPartyProviderInput;
};


export type MutationDisconnectGarminArgs = {
  data: DisconnectThirdPartyProviderInput;
};


export type MutationUpdateUserDataCompiledArgs = {
  data: UpdateUserDataCompiledInput;
};


export type MutationUpdateProfilePersonalArgs = {
  data: UpdateProfilePersonalInput;
};


export type MutationUpdateProfileCompanyArgs = {
  data: UpdateProfileCompanyInput;
};


export type MutationCreateClapArgs = {
  data: CreateClapInput;
};


export type MutationUndoClapArgs = {
  data: CreateClapInput;
};


export type MutationCreateCommentArgs = {
  data: CreateCommentInput;
};


export type MutationUpdateCommentArgs = {
  text: Scalars['String'];
  id: Scalars['String'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['String'];
};


export type MutationCreateCommentClapArgs = {
  data: CreateCommentClapInput;
};


export type MutationUndoCommentClapArgs = {
  data: CreateCommentClapInput;
};


export type MutationAddAwardChallengeArgs = {
  challenge_award: CreateChallengeAwardInput;
  challenge_id: Scalars['String'];
};


export type MutationUpdateAwardsArgs = {
  awards: Array<UpdateAwardInput>;
};


export type MutationDeleteAwardArgs = {
  award_id: Scalars['String'];
};


export type MutationCreateTermArgs = {
  data: RegisterTermInput;
};


export type MutationTermAcceptedArgs = {
  data: TermAcceptedInput;
};


export type MutationAddfavoriteChallengeArgs = {
  data: FavoriteUserChallengeInput;
};


export type MutationDeleteFavoriteChallengeArgs = {
  data: FavoriteUserChallengeInput;
};


export type MutationFollowProfileArgs = {
  data: FollowProfileInput;
};


export type MutationUnfollowProfileArgs = {
  data: FollowProfileInput;
};


export type MutationCreateActivityArgs = {
  data: CreateActivityInput;
};


export type MutationCreateActivityV2Args = {
  activities_data: Array<CreateActivityInput>;
};


export type MutationCreateMonitorActivityArgs = {
  data: CreateMonitorActivityInput;
};


export type MutationCreateActivityFromCrawlerArgs = {
  activityKey: Scalars['String'];
};


export type MutationSendActivityToProviderArgs = {
  data: SendActivityToProviderInput;
};


export type MutationRevaluateChallengeProgressArgs = {
  challenge_id: Scalars['String'];
};


export type MutationDeleteChallengeProgressActivityArgs = {
  data: DeleteUserChallengeActivityInput;
};


export type MutationDeleteChallengeProgressActivityV2Args = {
  data: DeleteUserChallengeActivityInput;
};


export type MutationRemoveActivityFromAllChallengeProgressArgs = {
  data: DeleteUserChallengeActivityInput;
};


export type MutationMarkNotificationsAsReadArgs = {
  data: ListUserNotificationsInput;
};


export type MutationUpdateUserSettingsArgs = {
  data: UserSettingsInput;
};


export type MutationCreateComplaintArgs = {
  data: CreateComplaintInput;
};


export type MutationCreateSuggestionArgs = {
  data: CreateSuggestionInput;
};


export type MutationCreatePaymentApprovedAtAntifraudArgs = {
  data: CreatePaymentApprovedAtAntifraudInput;
};


export type MutationCreateBankArgs = {
  data: CreateBankInput;
};


export type MutationChangeBankArgs = {
  data: UpdateBankInput;
};


export type MutationDeleteBankArgs = {
  id: Scalars['String'];
};


export type MutationChangeSettingsProfileNotificationsArgs = {
  data: UpdateSettingsProfileNotificationInput;
};


export type MutationCreateComplaintTypeArgs = {
  data: CreateComplaintTypeInput;
};


export type MutationCreateComplaintTypeTranslationArgs = {
  data: ComplaintTypeTranslationInput;
};


export type MutationUpdateComplaintTypeArgs = {
  data: UpdateComplaintTypeInput;
};


export type MutationUpdateComplaintTypeTranslationArgs = {
  data: ComplaintTypeTranslationInput;
};


export type MutationDeleteComplaintTypeArgs = {
  id: Scalars['String'];
};


export type MutationDeleteComplaintTypeTranslationArgs = {
  data: DeleteComplaintTypeTranslationInput;
};


export type MutationCreateChallengeImageArgs = {
  challenge_images: Array<CreateChallengeImagesInput>;
};


export type MutationUpdateChallengeImageArgs = {
  data: Array<UpdateChallengeImagesInput>;
};


export type MutationDeleteChallengeImageArgs = {
  ids: Array<Scalars['String']>;
};


export type MutationCreateCompanyBankAccountArgs = {
  data: CreateCompanyBankAccountInput;
};


export type MutationUpdateCompanyBankAccountArgs = {
  data: UpdateCompanyBankAccountInput;
};


export type MutationDeleteCompanyBankAccountArgs = {
  id: Scalars['String'];
};


export type MutationCreateCardArgs = {
  data: CreateCardInput;
};


export type MutationUpdateCardArgs = {
  data: UpdateCardInput;
  id: Scalars['String'];
};


export type MutationDeleteCardArgs = {
  id: Scalars['String'];
};


export type MutationCreateAwardDeliveryAddressArgs = {
  data: CreateAwardDeliveryAddressInput;
};


export type MutationCreateAddressToDeliverAwardArgs = {
  data: CreateAwardDeliveryAddressInput;
};


export type MutationUpdateAwardDeliveryAddressArgs = {
  data: UpdateAwardDeliveryAddressInput;
};


export type MutationUpdateAddressToDeliverAwardArgs = {
  data: UpdateAwardDeliveryAddressInput;
};


export type MutationCreateChallengeShowCaseArgs = {
  data: CreateChallengeShowCaseInput;
};


export type MutationAddChallengeFilesAttachedArgs = {
  data: CreateChallengeAttachedFilesInput;
};


export type MutationAddChallengeExternalLinksAttachedArgs = {
  data: CreateChallengeExternalLinksAttachedInput;
};


export type MutationDeleteExternalLinkAttachedArgs = {
  id: Scalars['String'];
};


export type MutationCreateAppDataArgs = {
  data: AppDataInput;
};


export type MutationUpdateAppDataArgs = {
  data: AppDataInput;
};


export type MutationCreateWithdrawalAddressesArgs = {
  withdrawal_addresses: Array<CreateWithdrawalAddressInput>;
};


export type MutationCreateAwardVolumeArgs = {
  data: CreateAwardVolumeInput;
};


export type MutationUpdateAwardVolumeArgs = {
  data: UpdateAwardVolumeInput;
};


export type MutationDeleteAwardVolumeArgs = {
  id: Scalars['String'];
};


export type MutationCalculateFreightQuoteArgs = {
  data: CreateFreightQuoteInput;
};


export type MutationGenerateAuthorizationPostageArgs = {
  subscription_ids: Array<Scalars['String']>;
};


export type MutationUpdateAuthorizationPostageArgs = {
  subscription_id: Scalars['String'];
};


export type MutationAddAwardImagesArgs = {
  award_images: Array<CreateAwardImagesInput>;
};


export type MutationCreateCategoryArgs = {
  data: CreateChallengeCategoriesInput;
};


export type MutationDeleteCategoryArgs = {
  data: DeleteChallengeCategoryInput;
};


export type MutationUpdateCategoriesArgs = {
  categories: Array<UpdateChallengeCategoriesInput>;
};


export type MutationCreateCommissioningModelArgs = {
  data: CreateCommissioningModelInput;
};


export type MutationUpdateCommissioningModelArgs = {
  data: UpdateCommissioningModelInput;
};


export type MutationDeleteCommissioningModelArgs = {
  id: Scalars['String'];
};


export type MutationCreateCommissioningModelTranslationArgs = {
  data: CreateCommissioningModelTranslationInput;
};


export type MutationUpdateCommissioningModelTranslationArgs = {
  data: UpdateCommissioningModelTranslationInput;
};


export type MutationDeleteCommissioningModelTranslationArgs = {
  data: DeleteCommissioningModelTranslationInput;
};


export type MutationCreateProductArgs = {
  data: CreateProductInput;
};


export type MutationUpdateProductArgs = {
  data: UpdateProductInput;
};


export type MutationDeleteProductArgs = {
  id: Scalars['String'];
};


export type MutationAssociateProductToAwardArgs = {
  data: RelateProductToAwardInput;
};


export type MutationDeleteAssociationProductToAwardArgs = {
  data: DeleteAssociationProductToAwardInput;
};


export type MutationCreateProductVariationArgs = {
  data: CreateProductVariationInput;
};


export type MutationDuplicateProductVariationArgs = {
  data: DuplicateProductVariationInput;
};


export type MutationUpdateProductVariationArgs = {
  data: UpdateProductVariationInput;
};


export type MutationDeleteProductVariationArgs = {
  data: DeleteProductVariationInput;
};


export type MutationCreateProductVariationPriceArgs = {
  data: CreateProductVariationPriceInput;
};


export type MutationUpdateProductVariationPriceArgs = {
  data: UpdateProductVariationPriceInput;
};


export type MutationDeleteProductVariationPriceArgs = {
  data: DeleteProductVariationPriceInput;
};


export type MutationCreateProductVariationImageArgs = {
  product_variation_images: Array<CreateProductVariationImageInput>;
};


export type MutationUpdateProductVariationImageOrderArgs = {
  data: UpdateProductImageOrderInput;
};


export type MutationDeleteProductVariationImageArgs = {
  data: DeleteProductImageInput;
};


export type MutationCreateUserAddressArgs = {
  data: CreateAddressInput;
};


export type MutationUpdateUserAddressArgs = {
  data: UpdateAddressInput;
};


export type MutationDeleteUserAddressArgs = {
  data: DeleteAddressInput;
};


export type MutationCreateCompanyAddressArgs = {
  data: CreateCompanyAddressInput;
};


export type MutationUpdateCompanyAddressArgs = {
  data: UpdateCompanyAddressInput;
};


export type MutationDeleteCompanyAddressArgs = {
  data: DeleteCompanyAddressInput;
};


export type MutationCreateProductImageArgs = {
  product_images: Array<CreateProductImageInput>;
};


export type MutationUpdateProductImageOrderArgs = {
  data: UpdateProductImageOrderInput;
};


export type MutationDeleteProductImageArgs = {
  data: DeleteProductImageInput;
};


export type MutationCreateEventSupportPointArgs = {
  data: CreateEventSupportPointInput;
};


export type MutationUpdateEventSupportPointArgs = {
  data: UpdateEventSupportPointInput;
};


export type MutationDeleteEventSupportPointArgs = {
  id: Scalars['String'];
};


export type MutationCreateUserPassageAtSupportPointArgs = {
  passages_registered: Array<CreateUserEventSupportPointInput>;
};


export type MutationCreateUserEventExtraordinaryActionArgs = {
  data: CreateUserEventExtraordinaryActionInput;
};


export type MutationUpdateUserEventExtraordinaryActionArgs = {
  data: UpdateUserEventExtraordinaryActionInput;
};


export type MutationDeleteUserEventExtraordinaryActionArgs = {
  data: DeleteUserEventExtraordinaryActionInput;
};


export type MutationCreateEventSubscriptionPriceArgs = {
  data: CreateEventSubscriptionPriceInput;
};


export type MutationUpdateEventSubscriptionPriceArgs = {
  data: UpdateEventSubscriptionPriceInput;
};


export type MutationDeleteEventSubscriptionPriceArgs = {
  data: DeleteEventSubscriptionPriceInput;
};


export type MutationCreateProductPriceArgs = {
  data: CreateProductPriceInput;
};


export type MutationUpdateProductPriceArgs = {
  data: UpdateProductPriceInput;
};


export type MutationDeleteProductPriceArgs = {
  data: DeleteProductPriceInput;
};


export type MutationCreateEventRouteFromExistentActivityArgs = {
  data: CreateEventRouteFromExistentActivityInput;
};


export type MutationUpdateEventRouteArgs = {
  data: UpdateEventRouteInput;
};


export type MutationDeleteEventRouteArgs = {
  event_route_id: Scalars['String'];
};


export type MutationCreateEventRoutePoiArgs = {
  data: CreateEventRoutePoiInput;
};


export type MutationDeleteEventRoutePoiArgs = {
  data: DeleteEventRoutePoiInput;
};


export type MutationUpdateEventRoutePoiArgs = {
  data: UpdateEventRoutePoiInput;
};

export type Notification = {
  __typename?: 'Notification';
  _id: Scalars['ID'];
  recipient_id: Scalars['String'];
  sender_profile_avatar?: Maybe<Scalars['String']>;
  sender_username?: Maybe<Scalars['String']>;
  notification_content: Scalars['String'];
  push_title?: Maybe<Scalars['String']>;
  push_subtitle?: Maybe<Scalars['String']>;
  push_content?: Maybe<Scalars['String']>;
  media_url?: Maybe<Scalars['String']>;
  deep_linking?: Maybe<Scalars['String']>;
  universal_link: Scalars['String'];
  read: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
};

export type NotificationScalar = {
  __typename?: 'NotificationScalar';
  unread_notifications_count: Scalars['Float'];
  notifications: Array<Notification>;
  date: Scalars['DateTime'];
};

export type Origin = {
  __typename?: 'Origin';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  translation: OriginTranslation;
};

export type OriginTranslation = {
  __typename?: 'OriginTranslation';
  language_code: Scalars['String'];
  origin_payment_id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  current_page: Scalars['Float'];
  offset: Scalars['Float'];
  total_item_count: Scalars['Float'];
  has_next_page: Scalars['Boolean'];
  has_previous_page: Scalars['Boolean'];
};

export type PaginationInput = {
  page: Scalars['Float'];
  offset: Scalars['Float'];
};

export type Payment = {
  __typename?: 'Payment';
  id: Scalars['String'];
  resource_payment_id: Scalars['String'];
  origin_payment_id: Scalars['String'];
  payment_processor_id: Scalars['String'];
  country_id: Scalars['String'];
  bill_expiration_date?: Maybe<Scalars['CacheDate']>;
  value: Scalars['Float'];
  is_paid: Scalars['Boolean'];
  declined: Scalars['Boolean'];
  returned: Scalars['Boolean'];
  entrance: Scalars['Boolean'];
  processed: Scalars['Boolean'];
  origin_resource_id?: Maybe<Scalars['String']>;
  user_card_id?: Maybe<Scalars['String']>;
  profile_id: Scalars['String'];
  user_id: Scalars['String'];
  user: User;
  bill_link?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  refuse_reason?: Maybe<Scalars['String']>;
  humanized_message?: Maybe<Scalars['String']>;
  acquirer_return_code: Scalars['String'];
  acquirer_name?: Maybe<Scalars['String']>;
  tid: Scalars['String'];
  nsu: Scalars['String'];
  cost?: Maybe<Scalars['String']>;
  antifraud_score?: Maybe<Scalars['String']>;
  bill_barcode?: Maybe<Scalars['String']>;
  authorization_code?: Maybe<Scalars['String']>;
  authorized_amount?: Maybe<Scalars['Float']>;
  paid_amount?: Maybe<Scalars['Float']>;
  refunded_amount?: Maybe<Scalars['Float']>;
  installments?: Maybe<Scalars['Float']>;
  split_rules?: Maybe<Scalars['String']>;
  antifraud_metadata?: Maybe<Scalars['String']>;
  antifraud_order_id?: Maybe<Scalars['String']>;
  pix_qrcode?: Maybe<Scalars['String']>;
  pix_expiration_date?: Maybe<Scalars['CacheDate']>;
  effective_payment_date?: Maybe<Scalars['CacheDate']>;
  interest_free_amount?: Maybe<Scalars['Float']>;
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  origin_payment: Origin;
  card?: Maybe<Card>;
  product_purchased_user_payment?: Maybe<ProductPurchasedUserPaymentType>;
};

export type PaymentInput = {
  value_paid?: Maybe<Scalars['Float']>;
  value_without_fee?: Maybe<Scalars['Float']>;
  payment_method?: Maybe<Scalars['String']>;
  resource_paid_id?: Maybe<Scalars['String']>;
  external_card_id?: Maybe<Scalars['String']>;
  installments?: Maybe<Scalars['String']>;
  cancel_waiting_payments?: Maybe<Scalars['Boolean']>;
};

export type PhoneInput = {
  phone: Scalars['String'];
  isRegister?: Maybe<Scalars['Boolean']>;
};

export type PointsPassageResponse = {
  __typename?: 'PointsPassageResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type PossiblelRequestResponse = {
  __typename?: 'PossiblelRequestResponse';
  id: Scalars['ID'];
  response: Scalars['String'];
  image_reference?: Maybe<Scalars['String']>;
  additional_request_id: Scalars['String'];
  price?: Maybe<Scalars['Float']>;
  order: Scalars['Float'];
};

export type ProductImageType = {
  __typename?: 'ProductImageType';
  id: Scalars['ID'];
  link: Scalars['String'];
  order: Scalars['Float'];
  product_id: Scalars['String'];
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  product: ProductType;
};

export type ProductPriceType = {
  __typename?: 'ProductPriceType';
  id: Scalars['ID'];
  product_id: Scalars['String'];
  value: Scalars['Float'];
  date_initial: Scalars['CacheDate'];
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  product: ProductType;
};

export type ProductPurchasedInput = {
  product_id: Scalars['String'];
  product_variation_id: Scalars['String'];
  free_value?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Float']>;
  award_id?: Maybe<Scalars['String']>;
};

export type ProductPurchasedType = {
  __typename?: 'ProductPurchasedType';
  id: Scalars['ID'];
  product_id: Scalars['String'];
  value?: Maybe<Scalars['Float']>;
  free_value?: Maybe<Scalars['String']>;
  product_variation_id?: Maybe<Scalars['String']>;
  canceled: Scalars['Boolean'];
  user_id: Scalars['String'];
  user_challenge_id?: Maybe<Scalars['String']>;
  award_id?: Maybe<Scalars['String']>;
  quantity: Scalars['Float'];
  variation: ProductVariationType;
  product: ProductType;
  user: User;
  related_payment?: Maybe<ProductPurchasedUserPaymentType>;
  subscription?: Maybe<UserChallenges>;
  award?: Maybe<ChallengeAwards>;
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
};

export type ProductPurchasedUserPaymentType = {
  __typename?: 'ProductPurchasedUserPaymentType';
  id: Scalars['ID'];
  product_purchased_user_id: Scalars['String'];
  payment_id: Scalars['String'];
  active: Scalars['Boolean'];
  payment: Payment;
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  product_purchased: ProductPurchasedType;
};

export type ProductType = {
  __typename?: 'ProductType';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  date_initial?: Maybe<Scalars['CacheDate']>;
  date_end?: Maybe<Scalars['CacheDate']>;
  available: Scalars['Boolean'];
  order: Scalars['Float'];
  has_cost: Scalars['Boolean'];
  allow_buy_without_subscription: Scalars['Boolean'];
  free_field: Scalars['Boolean'];
  active: Scalars['Boolean'];
  only_award?: Maybe<Scalars['Boolean']>;
  challenge_id?: Maybe<Scalars['String']>;
  images?: Maybe<Array<ProductImageType>>;
  variations?: Maybe<Array<ProductVariationType>>;
  prices?: Maybe<Array<ProductPriceType>>;
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  product_purchased?: Maybe<ProductPurchasedType>;
  awards_products?: Maybe<AwardProductType>;
};

export type ProductVariationImageType = {
  __typename?: 'ProductVariationImageType';
  id: Scalars['ID'];
  link: Scalars['String'];
  order: Scalars['Float'];
  product_variation_id: Scalars['String'];
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  product_variation: ProductVariationType;
};

export type ProductVariationPriceType = {
  __typename?: 'ProductVariationPriceType';
  id: Scalars['ID'];
  value: Scalars['Float'];
  date_initial: Scalars['CacheDate'];
  product_variation_id: Scalars['String'];
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  product_variation: ProductVariationType;
};

export type ProductVariationType = {
  __typename?: 'ProductVariationType';
  id: Scalars['ID'];
  product_id: Scalars['String'];
  text: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** @deprecated This field was droped in favor of available_quantity */
  initial_quantity?: Maybe<Scalars['Float']>;
  available_quantity?: Maybe<Scalars['Float']>;
  available: Scalars['Boolean'];
  order: Scalars['Float'];
  active: Scalars['Boolean'];
  prices?: Maybe<Array<ProductVariationPriceType>>;
  images?: Maybe<Array<ProductVariationImageType>>;
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  product: ProductType;
  product_purchased_user?: Maybe<ProductPurchasedType>;
};

export type ProductsPurchasedPaginated = {
  __typename?: 'ProductsPurchasedPaginated';
  productsPurchased: Array<ProductPurchasedType>;
  page_info: PaginationInfo;
};

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['ID'];
  username: Scalars['String'];
  followers_count: Scalars['Float'];
  following_count: Scalars['Float'];
  official: Scalars['Boolean'];
  profile_avatar?: Maybe<Scalars['String']>;
  profile_cover?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  user_id: Scalars['String'];
  company_id: Scalars['String'];
  is_follower?: Maybe<Scalars['Boolean']>;
  user: User;
};

export type ProfileSchedule = {
  __typename?: 'ProfileSchedule';
  _id: Scalars['ID'];
  profile_id: Scalars['String'];
  resource_key: Scalars['String'];
  date_occurrence?: Maybe<Scalars['DateTime']>;
  title: Scalars['String'];
  subtitle: Scalars['String'];
  deep_link: Scalars['String'];
  web_link: Scalars['String'];
  image_link: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getCity: Array<City>;
  getCityByCountry: Array<City>;
  getCitiesByName: Array<City>;
  getStates: Array<State>;
  getStatesByCountry: Array<State>;
  getStatesByName: Array<State>;
  listChallengeCategories: Array<ChallengeCategories>;
  listChallengesBySubscriptionCount: Array<Challenge>;
  /** @deprecated In order to paginate the results this query is being deprecated in favor of 'explorePopularChallenges' */
  exploreChallenges: Array<ChallengeShowCaseType>;
  exploreChallengesV2: ChallengeShowCaseResponse;
  getChallengesManagedByUser: ChallengesPaginatedResponse;
  getFavoriteChallenges: Array<Challenge>;
  getChallengeDetail: Challenge;
  getChallengesPreLaunched: Array<Challenge>;
  /** @deprecated In order to return the results of this query paginated we're gonna use the 'showAllChallengesV2 instead of 'showAllChallenges' */
  showAllChallenges: Array<Challenge>;
  showAllChallengesV2: ChallengesPaginatedResponse;
  getChallengesByType: Array<Challenge>;
  getChallengesByCompany: Array<Challenge>;
  getActiveUserChallenges: Array<Challenge>;
  getChallengesUserCreated: Array<Challenge>;
  getRecentlyChallenges: Array<Challenge>;
  getMostAccessedChallenges: Array<Challenge>;
  getChallenge: Challenge;
  getFinishedUserChallenges: Array<Challenge>;
  validatePublication: Array<Scalars['String']>;
  challengeTypes: Array<ChallengeType>;
  bestResultsChallenges: BestResultsChallengesResponse;
  bestResultsChallengesByType: BestResultsChallengesResponse;
  bestResultsChallengesByCoverage: BestResultsChallengesResponse;
  bestResultsOfEndedChallenges: BestResultsChallengesResponse;
  bestResultsOfChallengesByCompany: BestResultsChallengesResponse;
  getChallengeSubscriptions: Array<UserChallenges>;
  getChallengeRankInformation: ChallengeRankSummaryResponse;
  getChallengeWithConfiguration: Challenge;
  getChallengeRanks: Array<UserChallenges>;
  getChallengeProductsAlreadyPurchased: ProductsPurchasedPaginated;
  getDetailedProductPurchased: ProductPurchasedType;
  getChallengeShippingTypeMessageTranslated: ChallengeShippingType;
  listChallengeShippingTypes: Array<ChallengeShippingType>;
  listChallengeShippingTypesTranslated: Array<ChallengeShippingType>;
  listChallengeAwardWinners: Array<UserChallenges>;
  /** @deprecated In order to get the subscription progress now it has to be passed the user_challenge_id instead of the challenge_id */
  getUserChallengeProgress: UserChallenges;
  getSubscriptionProgress: UserChallenges;
  /** @deprecated In order to retrieve the payments from a challenge now it is going to be used the user_challenge_id */
  getSubscriptionPayments: Array<SubscriptionPayment>;
  getPaymentsOfASubscription: Array<SubscriptionPayment>;
  /** @deprecated To get the award bought by an user now it is going to be used the user_challenge_id instead of the user_id and challenge_id */
  getAwardSubscriptionPayment: AwardSubscription;
  getAwardAcquired: AwardSubscription;
  getSubscriptionsWithAlreadyShippedAward: Array<UserChallenges>;
  checkSubscriptionShippingStatus: UserChallenges;
  getSubscriptionsReadyToPost: Array<UserChallenges>;
  getDetailedSubscription: UserChallenges;
  getProductsAcquired: Array<ProductPurchasedType>;
  subscriptionsWithAwardAlreadyWithdrawn: SubscriptionsPaginatedResponse;
  getSubscriptionsOfAChallenge: SubscriptionsPaginatedResponse;
  userCompanies: Array<Company>;
  listCompanyUsers: Array<UsersCompanies>;
  getCompanyById: Company;
  getCompanies: CompaniesPaginatedResponse;
  bestCompaniesResult: ListCompaniesResponse;
  searchUsers: UsersPaginatedResponse;
  userProfileFindEmail: User;
  userProfileFindPhone: User;
  checkEmail: User;
  getUserDataCompiled: ThirdPartyDataCompiled;
  listAllThirdPartyDataActived: Array<ThirdPartyDataSource>;
  getSegmentById: Segment;
  getSegmentsByName: Array<Segment>;
  getSegmentsByLocation: Array<Segment>;
  getProfile: Profile;
  getSchedule: Array<ProfileSchedule>;
  checkUsername: Scalars['Boolean'];
  getChallengeComments: Array<Comment>;
  getAward: ChallengeAwards;
  getChallengeAwards: Array<ChallengeAwards>;
  bestResultsOfAwards: BestResultsAwardsResponse;
  checkProfileIsFollower: Scalars['Boolean'];
  /** @deprecated This query will be paginated in order to give a better experience to the user. Now use getUserActivitiesV2 */
  getUserActivities: Array<Activity>;
  getUserActivitiesV2: ActivitiesListResponse;
  getUserDataFromCrawledActivity: GetUserActivityContentResponse;
  getActivityDetail: Activity;
  /** @deprecated To search for the activities of a given subscription we are going to use the user_challenge_id instead of the challenge_id and user_id. */
  getUserChallengeActivities: Array<ChallengeActivity>;
  getSubscriptionActivities: Array<ChallengeActivity>;
  getUserNotifications: NotificationScalar;
  getUserSettings: Settings;
  payments: Array<Payment>;
  findPayment: Payment;
  calculateInstallments: InstallmentsResponse;
  getBanks: Array<Bank>;
  getSettingsProfileNotifications: SettingsProfileNotifications;
  listComplaintsTypesTranslation: Array<ComplaintTypeTranslation>;
  getComplaintTypeTranslation: ComplaintTypeTranslation;
  getChallengeImages: Array<ChallengeImages>;
  getCompanyBankAccounts: Array<CompanyBankAccount>;
  getCard: Card;
  getCards: Array<Card>;
  /** @deprecated To retrieve the additional requests of a subscription now it will be necessary to use the user_challenge_id instead of the challenge_id */
  getChallegeAwardAdditionalRequest: ChallengeAwardAdditionalRequest;
  getSubscriptionAwardAdditionalRequest: ChallengeAwardAdditionalRequest;
  /** @deprecated To search for address pointed for award delivery now we are going to use the user_challenge_id instead of the user_id and challenge_id */
  getAwardDeliveryAddress: ChallengeAwardDeliveryAddress;
  getAddressToDeliverAward: ChallengeAwardDeliveryAddress;
  allChallengeAttachedFiles: Array<ChallengeAttachedFiles>;
  allChallengeExternalLinksAttached: Array<ChallengeExternalLinksAttached>;
  getAppData: AppData;
  getChallengeWithdrawalAddresses: Array<WithdrawalAddress>;
  getAwardVolumes?: Maybe<Array<AwardVolume>>;
  getCommissioningModelDetail: CommissioningModelType;
  getCommissioningModelsAvailable: Array<CommissioningModelType>;
  getCommissioningModelTranslation: CommissioningModelTranslationType;
  getProductsByChallengeId: Array<ProductType>;
  getProductVariations: Array<ProductVariationType>;
  getProductVariationPrices: Array<ProductVariationPriceType>;
  getProductVariationImages: Array<ProductVariationImageType>;
  getUserAddresses: Array<UserAddressType>;
  findAddressByZipCode: FindAddressByZipCodeResponse;
  getCompanyAddresses: Array<CompanyAddressType>;
  getProductImages: Array<ProductImageType>;
  findEventSupportPoints: Array<EventSupportPointType>;
  findUsersThatPassedInThePoint: UserEventSupportPointPaginatedResponse;
  findPointsThatUserAlreadyPassed: Array<UserEventSupportPointType>;
  findAllUsersCurrentPoint: Array<UserEventSupportPointType>;
  getExtraordinaryEventsOfChallenge: ExtraordinaryActionsOfChallengeResponse;
  findEventSubscriptionPrices: Array<EventSubscriptionPriceType>;
  getProductPrices: Array<ProductPriceType>;
  getDetailedEventRoute: EventRoutesType;
  getAllRoutesByChallenge: Array<EventRoutesType>;
  getDetailedEventRoutePoi: EventRoutesPoisType;
  getAllPoisByEventRoute: Array<EventRoutesPoisType>;
  getChallengeProductsPurchased: ProductsPurchasedPaginated;
  listAllLocales: Array<LocaleType>;
};


export type QueryGetCityArgs = {
  data: CitiesInput;
  pagination: PaginationInput;
};


export type QueryGetCityByCountryArgs = {
  country_id: Scalars['String'];
  pagination: PaginationInput;
};


export type QueryGetCitiesByNameArgs = {
  name: Scalars['String'];
  pagination: PaginationInput;
};


export type QueryGetStatesArgs = {
  pagination: PaginationInput;
};


export type QueryGetStatesByCountryArgs = {
  country_id: Scalars['String'];
  pagination: PaginationInput;
};


export type QueryGetStatesByNameArgs = {
  name: Scalars['String'];
  pagination: PaginationInput;
};


export type QueryListChallengeCategoriesArgs = {
  challenge_id: Scalars['String'];
};


export type QueryExploreChallengesArgs = {
  profile_id: Scalars['String'];
  page: Scalars['Float'];
};


export type QueryExploreChallengesV2Args = {
  profile_id: Scalars['String'];
  page: Scalars['Float'];
};


export type QueryGetChallengesManagedByUserArgs = {
  pagination: PaginationInput;
};


export type QueryGetFavoriteChallengesArgs = {
  profile_id: Scalars['String'];
  pagination: PaginationInput;
};


export type QueryGetChallengeDetailArgs = {
  data: GetChallengeDetailInput;
};


export type QueryGetChallengesPreLaunchedArgs = {
  profile_id: Scalars['String'];
  pagination: PaginationInput;
};


export type QueryShowAllChallengesArgs = {
  pagination: PaginationInput;
  data: ShowAllChallengesInput;
};


export type QueryShowAllChallengesV2Args = {
  pagination: PaginationInput;
  data: ShowAllChallengesInput;
};


export type QueryGetChallengesByTypeArgs = {
  pagination: PaginationInput;
  data: GetChallengesByTypeInput;
};


export type QueryGetChallengesByCompanyArgs = {
  pagination: PaginationInput;
  company_id: Scalars['String'];
};


export type QueryGetActiveUserChallengesArgs = {
  pagination: PaginationInput;
  user_id?: Maybe<Scalars['String']>;
  profile_id: Scalars['String'];
};


export type QueryGetChallengesUserCreatedArgs = {
  pagination: PaginationInput;
  data: ListChallengesUserCreatedInput;
};


export type QueryGetRecentlyChallengesArgs = {
  pagination: PaginationInput;
};


export type QueryGetMostAccessedChallengesArgs = {
  pagination: PaginationInput;
};


export type QueryGetChallengeArgs = {
  id: Scalars['String'];
};


export type QueryGetFinishedUserChallengesArgs = {
  pagination: PaginationInput;
  profile_id: Scalars['String'];
};


export type QueryValidatePublicationArgs = {
  challenge_id: Scalars['String'];
};


export type QueryBestResultsChallengesArgs = {
  pagination: PaginationInput;
  term_of_search: Scalars['String'];
};


export type QueryBestResultsChallengesByTypeArgs = {
  pagination: PaginationInput;
  data: ChallengesBestResultsByTypeInput;
};


export type QueryBestResultsChallengesByCoverageArgs = {
  pagination: PaginationInput;
  place_to_search: Scalars['String'];
};


export type QueryBestResultsOfEndedChallengesArgs = {
  pagination: PaginationInput;
  term_of_search: Scalars['String'];
};


export type QueryBestResultsOfChallengesByCompanyArgs = {
  pagination: PaginationInput;
  term_of_search: Scalars['String'];
};


export type QueryGetChallengeSubscriptionsArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetChallengeRankInformationArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetChallengeWithConfigurationArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetChallengeRanksArgs = {
  pagination: PaginationInput;
  data: GetRanksInput;
};


export type QueryGetChallengeProductsAlreadyPurchasedArgs = {
  pagination: PaginationInput;
  challenge_id: Scalars['String'];
};


export type QueryGetDetailedProductPurchasedArgs = {
  id: Scalars['String'];
};


export type QueryGetChallengeShippingTypeMessageTranslatedArgs = {
  challenge_shipping_type_code: Scalars['String'];
};


export type QueryListChallengeAwardWinnersArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetUserChallengeProgressArgs = {
  data: GetUserChallengeProgressInput;
};


export type QueryGetSubscriptionProgressArgs = {
  data: GetUserChallengeProgressInput;
};


export type QueryGetSubscriptionPaymentsArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetPaymentsOfASubscriptionArgs = {
  data: RetrieveSubscriptionPaymentsInput;
};


export type QueryGetAwardSubscriptionPaymentArgs = {
  data: GetAwardSubscriptionInput;
};


export type QueryGetAwardAcquiredArgs = {
  data: GetAwardSubscriptionInput;
};


export type QueryGetSubscriptionsWithAlreadyShippedAwardArgs = {
  challenge_id: Scalars['String'];
};


export type QueryCheckSubscriptionShippingStatusArgs = {
  user_challenge_id: Scalars['String'];
};


export type QueryGetSubscriptionsReadyToPostArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetDetailedSubscriptionArgs = {
  data: GetDetailedSubscriptionInput;
};


export type QueryGetProductsAcquiredArgs = {
  data: GetProductsAcquiredInput;
};


export type QuerySubscriptionsWithAwardAlreadyWithdrawnArgs = {
  pagination: PaginationInput;
  challenge_id: Scalars['String'];
};


export type QueryGetSubscriptionsOfAChallengeArgs = {
  pagination: PaginationInput;
  data: ListChallengeSubscriptionsInput;
};


export type QueryListCompanyUsersArgs = {
  company_id: Scalars['String'];
};


export type QueryGetCompanyByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetCompaniesArgs = {
  pagination: PaginationInput;
  search_text: Scalars['String'];
};


export type QueryBestCompaniesResultArgs = {
  pagination: PaginationInput;
  term_of_search: Scalars['String'];
};


export type QuerySearchUsersArgs = {
  pagination: PaginationInput;
  search_text: Scalars['String'];
};


export type QueryUserProfileFindEmailArgs = {
  email: Scalars['String'];
};


export type QueryUserProfileFindPhoneArgs = {
  phone: Scalars['String'];
};


export type QueryCheckEmailArgs = {
  email: Scalars['String'];
};


export type QueryGetSegmentByIdArgs = {
  id: Scalars['Float'];
};


export type QueryGetSegmentsByNameArgs = {
  data: GetSegmentByNameInput;
};


export type QueryGetSegmentsByLocationArgs = {
  data: FindSegmentsByLocationInput;
};


export type QueryGetProfileArgs = {
  data: GetProfileDetailInput;
};


export type QueryGetScheduleArgs = {
  profile_id: Scalars['String'];
  pagination: PaginationInput;
};


export type QueryCheckUsernameArgs = {
  username: Scalars['String'];
};


export type QueryGetChallengeCommentsArgs = {
  pagination: PaginationInput;
  challenge_id: Scalars['String'];
};


export type QueryGetAwardArgs = {
  award_id: Scalars['String'];
};


export type QueryGetChallengeAwardsArgs = {
  data: GetChallengeAwardsInput;
};


export type QueryBestResultsOfAwardsArgs = {
  pagination: PaginationInput;
  term_of_search: Scalars['String'];
};


export type QueryCheckProfileIsFollowerArgs = {
  data: FollowProfileInput;
};


export type QueryGetUserActivitiesV2Args = {
  pagination: PaginationInput;
};


export type QueryGetUserDataFromCrawledActivityArgs = {
  url: Scalars['String'];
};


export type QueryGetActivityDetailArgs = {
  id: Scalars['String'];
};


export type QueryGetUserChallengeActivitiesArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetSubscriptionActivitiesArgs = {
  data: RetrieveSubscriptionActivitiesInput;
};


export type QueryGetUserNotificationsArgs = {
  pagination: PaginationInput;
  data: ListUserNotificationsInput;
};


export type QueryPaymentsArgs = {
  profile_id: Scalars['String'];
  pagination: PaginationInput;
};


export type QueryFindPaymentArgs = {
  id: Scalars['String'];
};


export type QueryCalculateInstallmentsArgs = {
  data: InstallmentsInput;
};


export type QueryGetBanksArgs = {
  pagination: PaginationInput;
};


export type QueryGetSettingsProfileNotificationsArgs = {
  profile_id: Scalars['String'];
};


export type QueryGetComplaintTypeTranslationArgs = {
  complaint_type_id: Scalars['String'];
};


export type QueryGetChallengeImagesArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetCompanyBankAccountsArgs = {
  pagination: PaginationInput;
  company_id: Scalars['String'];
};


export type QueryGetCardArgs = {
  id: Scalars['String'];
};


export type QueryGetCardsArgs = {
  pagination: PaginationInput;
  user_id: Scalars['String'];
};


export type QueryGetChallegeAwardAdditionalRequestArgs = {
  data: GetChallengeAwardAdditionalRequestInput;
};


export type QueryGetSubscriptionAwardAdditionalRequestArgs = {
  data: GetChallengeAwardAdditionalRequestInput;
};


export type QueryGetAwardDeliveryAddressArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetAddressToDeliverAwardArgs = {
  data: GetAddressToDeliverAwardInput;
};


export type QueryAllChallengeAttachedFilesArgs = {
  pagination: PaginationInput;
  challenge_id: Scalars['String'];
};


export type QueryAllChallengeExternalLinksAttachedArgs = {
  pagination: PaginationInput;
  challenge_id: Scalars['String'];
};


export type QueryGetAppDataArgs = {
  platform: Scalars['String'];
};


export type QueryGetChallengeWithdrawalAddressesArgs = {
  data: FindWithdrawalAddressesInput;
};


export type QueryGetAwardVolumesArgs = {
  award_id: Scalars['String'];
};


export type QueryGetCommissioningModelDetailArgs = {
  id: Scalars['String'];
};


export type QueryGetCommissioningModelTranslationArgs = {
  data: GetCommissioningModelTranslationInput;
};


export type QueryGetProductsByChallengeIdArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetProductVariationsArgs = {
  product_id: Scalars['String'];
};


export type QueryGetProductVariationPricesArgs = {
  product_variation_id: Scalars['String'];
};


export type QueryGetProductVariationImagesArgs = {
  product_variation_id: Scalars['String'];
};


export type QueryGetUserAddressesArgs = {
  user_id?: Maybe<Scalars['String']>;
};


export type QueryFindAddressByZipCodeArgs = {
  zip_code: Scalars['String'];
};


export type QueryGetCompanyAddressesArgs = {
  company_id: Scalars['String'];
};


export type QueryGetProductImagesArgs = {
  product_id: Scalars['String'];
};


export type QueryFindEventSupportPointsArgs = {
  challenge_id: Scalars['String'];
};


export type QueryFindUsersThatPassedInThePointArgs = {
  pagination: PaginationInput;
  event_support_point_id: Scalars['String'];
};


export type QueryFindPointsThatUserAlreadyPassedArgs = {
  user_challenge_id: Scalars['String'];
};


export type QueryFindAllUsersCurrentPointArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetExtraordinaryEventsOfChallengeArgs = {
  pagination: PaginationInput;
  data: GetExtraordinaryEventsOfChallengeInput;
};


export type QueryFindEventSubscriptionPricesArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetProductPricesArgs = {
  product_id: Scalars['String'];
};


export type QueryGetDetailedEventRouteArgs = {
  route_id: Scalars['String'];
};


export type QueryGetAllRoutesByChallengeArgs = {
  challenge_id: Scalars['String'];
};


export type QueryGetDetailedEventRoutePoiArgs = {
  data: GetDetailedEventRoutePoiInput;
};


export type QueryGetAllPoisByEventRouteArgs = {
  data: GetAllPoisByEventRouteInput;
};


export type QueryGetChallengeProductsPurchasedArgs = {
  pagination: PaginationInput;
  data: ListAllChallengeProductsPurchasedInput;
};

export type RecoverUserPasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type RegisterAddressInput = {
  address_line_one?: Maybe<Scalars['String']>;
  address_line_two?: Maybe<Scalars['String']>;
  city_id?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  street_number?: Maybe<Scalars['String']>;
};

export type RegisterTermInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  link: Scalars['String'];
  language_code: Scalars['String'];
};

export type RegisterUserInput = {
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  gender?: Maybe<Scalars['String']>;
  stature?: Maybe<Scalars['Float']>;
  weight?: Maybe<Scalars['Float']>;
  phone: Scalars['String'];
  city_id?: Maybe<Scalars['String']>;
};

export type RelateProductToAwardInput = {
  product_id: Scalars['String'];
  award_id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type RetrieveSubscriptionActivitiesInput = {
  user_challenge_id: Scalars['String'];
};

export type RetrieveSubscriptionPaymentsInput = {
  user_challenge_id: Scalars['String'];
};

export type Segment = {
  __typename?: 'Segment';
  segments_strava_id: Scalars['ID'];
  name: Scalars['String'];
  activity_type: Scalars['String'];
  distance: Scalars['Float'];
  average_grade: Scalars['Float'];
  maximum_grade: Scalars['Float'];
  elevation_high: Scalars['Float'];
  elevation_low: Scalars['Float'];
  start_latitude: Scalars['Float'];
  start_longitude: Scalars['Float'];
  end_latitude: Scalars['Float'];
  end_longitude: Scalars['Float'];
  climb_category: Scalars['Float'];
  city: Scalars['String'];
  state: Scalars['String'];
  country: Scalars['String'];
  private_segment: Scalars['Boolean'];
  hazardous: Scalars['Boolean'];
  created_at_strava: Scalars['DateTime'];
  updated_at_strava: Scalars['DateTime'];
  total_elevation_gain: Scalars['Float'];
  effort_count: Scalars['Float'];
  athlete_count: Scalars['Float'];
  star_count: Scalars['Float'];
  polyline: Scalars['String'];
  elev_difference: Scalars['Float'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export type SendActivityToProviderInput = {
  activity_id: Scalars['String'];
  provider_to_send_slug: Scalars['String'];
};

export type SendActivityToProviderResponse = {
  __typename?: 'SendActivityToProviderResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type SendEmailInput = {
  email: Scalars['String'];
  isRegister?: Maybe<Scalars['Boolean']>;
};

export type Settings = {
  __typename?: 'Settings';
  user_id: Scalars['ID'];
  measuring_unit: Scalars['String'];
  dark_theme: Scalars['Boolean'];
  color_theme_device: Scalars['Boolean'];
  send_activities_to_strava: Scalars['Boolean'];
};

export type SettingsProfileNotifications = {
  __typename?: 'SettingsProfileNotifications';
  _id: Scalars['ID'];
  profile_id: Scalars['String'];
  comments_push: Scalars['Boolean'];
  comments_email: Scalars['Boolean'];
  comment_response_push: Scalars['Boolean'];
  comment_response_email: Scalars['Boolean'];
  comment_claps_push: Scalars['Boolean'];
  comment_claps_email: Scalars['Boolean'];
  claps_push: Scalars['Boolean'];
  claps_email: Scalars['Boolean'];
  messages_received_push: Scalars['Boolean'];
  messages_received_email: Scalars['Boolean'];
  message_request_push: Scalars['Boolean'];
  message_request_email: Scalars['Boolean'];
  followers_request_push: Scalars['Boolean'];
  followers_request_email: Scalars['Boolean'];
  follower_new_push: Scalars['Boolean'];
  follower_new_email: Scalars['Boolean'];
  mentions_push: Scalars['Boolean'];
  mentions_email: Scalars['Boolean'];
  challenge_reminder_push: Scalars['Boolean'];
  challenge_reminder_email: Scalars['Boolean'];
  challenge_subscribed_received_push: Scalars['Boolean'];
  challenge_subscribed_received_email: Scalars['Boolean'];
  maintenance_reminder_push: Scalars['Boolean'];
  maintenance_reminder_email: Scalars['Boolean'];
  activities_received_push: Scalars['Boolean'];
  activities_received_email: Scalars['Boolean'];
};

export type SetupSubscriptionToWithdrawInput = {
  user_id: Scalars['String'];
  challenge_id: Scalars['String'];
};

export type SetupSubscriptionsToWithdrawResponse = {
  __typename?: 'SetupSubscriptionsToWithdrawResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type ShowAllChallengesInput = {
  key: Scalars['String'];
  profile_id: Scalars['String'];
};

export type SmsCodeInput = {
  code: Scalars['String'];
  phone: Scalars['String'];
  isRegister?: Maybe<Scalars['Boolean']>;
};

export type State = {
  __typename?: 'State';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  abbreviation: Scalars['String'];
  active: Scalars['Boolean'];
  id_locale: Scalars['String'];
  country_id: Scalars['String'];
};

export type StateByZipCodeResponse = {
  __typename?: 'StateByZipCodeResponse';
  id: Scalars['String'];
  name: Scalars['String'];
  abbreviation: Scalars['String'];
};

export type SubscribeUserChallengeInput = {
  profile_id?: Maybe<Scalars['String']>;
  challenge_id?: Maybe<Scalars['String']>;
  challenge_category_id?: Maybe<Scalars['String']>;
  registration_date?: Maybe<Scalars['DateTime']>;
  additional_request?: Maybe<Array<ChallengeAwardAdditionalRequestInput>>;
  challenge_withdrawal_address_id?: Maybe<Scalars['String']>;
  amount_freight?: Maybe<Scalars['Float']>;
  cancel_previous_subscription?: Maybe<Scalars['Boolean']>;
  bonus_subscription?: Maybe<Scalars['Boolean']>;
  interest_free_amount?: Maybe<Scalars['Float']>;
};

export type SubscriptionPayment = {
  __typename?: 'SubscriptionPayment';
  id: Scalars['String'];
  user_challenge_id: Scalars['String'];
  user_id?: Maybe<Scalars['String']>;
  challenge_id?: Maybe<Scalars['String']>;
  payment_id: Scalars['String'];
  award_id: Scalars['String'];
  award: ChallengeAwards;
  subscription: UserChallenges;
  payment: Payment;
};

export type SubscriptionStatus = {
  __typename?: 'SubscriptionStatus';
  id: Scalars['ID'];
  user_challenge_id: Scalars['String'];
  subscription_status_id: Scalars['String'];
  status_description: SubscriptionStatusDescription;
};

export type SubscriptionStatusDescription = {
  __typename?: 'SubscriptionStatusDescription';
  id: Scalars['ID'];
  code: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  translations: Array<SubscriptionStatusTranslation>;
};

export type SubscriptionStatusTranslation = {
  __typename?: 'SubscriptionStatusTranslation';
  language_code: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type SubscriptionsPaginatedResponse = {
  __typename?: 'SubscriptionsPaginatedResponse';
  subscriptions: Array<UserChallenges>;
  page_info: PaginationInfo;
};

export type SuccessfulPaymentResponse = {
  __typename?: 'SuccessfulPaymentResponse';
  title: Scalars['String'];
  message: Scalars['String'];
  payment_id: Scalars['String'];
};

export type Suggestion = {
  __typename?: 'Suggestion';
  id: Scalars['ID'];
  text: Scalars['String'];
  score: Scalars['Float'];
  user_id: Scalars['String'];
};

export type Term = {
  __typename?: 'Term';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  link: Scalars['String'];
  companies: Scalars['Boolean'];
  default: Scalars['Boolean'];
  active: Scalars['Boolean'];
  language_code: Scalars['Boolean'];
};

export type TermAccepted = {
  __typename?: 'TermAccepted';
  id: Scalars['ID'];
  user_id: Scalars['String'];
  term_id: Scalars['String'];
};

export type TermAcceptedInput = {
  language_code: Scalars['String'];
};

export type ThirdPartyDataCompiled = {
  __typename?: 'ThirdPartyDataCompiled';
  data_compiled: DataCompiled;
  third_party_data?: Maybe<Array<ThirdPartyDataSource>>;
};

export type ThirdPartyDataSource = {
  __typename?: 'ThirdPartyDataSource';
  user_id: Scalars['ID'];
  user: User;
  access_token?: Maybe<Scalars['String']>;
  token_secret?: Maybe<Scalars['String']>;
  token_type?: Maybe<Scalars['String']>;
  expires?: Maybe<Scalars['Float']>;
  id_data_source?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  third_party_data_source: ThirdPartyProvider;
};

export type ThirdPartyProvider = {
  __typename?: 'ThirdPartyProvider';
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
  is_gps: Scalars['Boolean'];
  active: Scalars['Boolean'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  user_third_party_data_source: Array<ThirdPartyDataSource>;
};

export type UpdateAddressInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  street_address?: Maybe<Scalars['String']>;
  street_number?: Maybe<Scalars['String']>;
  neighborhood?: Maybe<Scalars['String']>;
  complement?: Maybe<Scalars['String']>;
  reference_point?: Maybe<Scalars['String']>;
  city_id?: Maybe<Scalars['String']>;
  is_billing_address?: Maybe<Scalars['Boolean']>;
};

export type UpdateAwardDeliveryAddressInput = {
  challenge_id?: Maybe<Scalars['String']>;
  user_challenge_id?: Maybe<Scalars['String']>;
  city_id?: Maybe<Scalars['String']>;
  address_line_one: Scalars['String'];
  address_line_two?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  tracking_code?: Maybe<Scalars['String']>;
  tracking_link?: Maybe<Scalars['String']>;
  shipping_company?: Maybe<Scalars['String']>;
  delivery?: Maybe<Scalars['Boolean']>;
  street_address: Scalars['String'];
  street_number: Scalars['String'];
  reference_point?: Maybe<Scalars['String']>;
  complement?: Maybe<Scalars['String']>;
  neighborhood: Scalars['String'];
};

export type UpdateAwardInput = {
  id: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  only_for_draw?: Maybe<Scalars['Boolean']>;
  subscribers_limit?: Maybe<Scalars['Float']>;
  production_time?: Maybe<Scalars['Float']>;
};

export type UpdateAwardVolumeInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
  depth?: Maybe<Scalars['Float']>;
  weight?: Maybe<Scalars['Float']>;
};

export type UpdateBankInput = {
  id: Scalars['String'];
  name_short?: Maybe<Scalars['String']>;
  name_long?: Maybe<Scalars['String']>;
  swift_code?: Maybe<Scalars['String']>;
  ispb_brazil?: Maybe<Scalars['Float']>;
  compe_brazil?: Maybe<Scalars['Float']>;
  country_id?: Maybe<Scalars['String']>;
};

export type UpdateCardInput = {
  name?: Maybe<Scalars['String']>;
  main?: Maybe<Scalars['Boolean']>;
};

export type UpdateChallengeCategoriesInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Float']>;
  altimetry_goal_value?: Maybe<Scalars['Float']>;
  distance_goal_value?: Maybe<Scalars['Float']>;
  max_altimetry_goal_value?: Maybe<Scalars['Float']>;
  max_distance_goal_value?: Maybe<Scalars['Float']>;
  minimum_time_goal_value?: Maybe<Scalars['Float']>;
  maximum_time_goal_value?: Maybe<Scalars['Float']>;
};

export type UpdateChallengeConfigurationInput = {
  id: Scalars['String'];
  pass_faster?: Maybe<Scalars['Boolean']>;
  first_to_complete?: Maybe<Scalars['Boolean']>;
  accumulation?: Maybe<Scalars['Boolean']>;
  altimetry_goal_value?: Maybe<Scalars['Float']>;
  distance_goal_value?: Maybe<Scalars['Float']>;
  max_time_goal_value?: Maybe<Scalars['Float']>;
  min_time_goal_value?: Maybe<Scalars['Float']>;
  unique_ride?: Maybe<Scalars['Boolean']>;
  coverage_array?: Maybe<Array<Scalars['String']>>;
  is_draw?: Maybe<Scalars['Boolean']>;
  is_win_prizes?: Maybe<Scalars['Boolean']>;
  award_at_address?: Maybe<Scalars['Boolean']>;
  automatic_draw?: Maybe<Scalars['Boolean']>;
  is_paid?: Maybe<Scalars['Boolean']>;
  accept_withdrawal?: Maybe<Scalars['Boolean']>;
  allows_category_change?: Maybe<Scalars['Boolean']>;
  deadline_category_change?: Maybe<Scalars['DateTime']>;
  max_distance_goal_value?: Maybe<Scalars['Float']>;
  max_altimetry_goal_value?: Maybe<Scalars['Float']>;
  only_riderize_provider?: Maybe<Scalars['Boolean']>;
  has_paid_kit?: Maybe<Scalars['Boolean']>;
  managed_by_riderize?: Maybe<Scalars['Boolean']>;
  challenge_shipping_type_code?: Maybe<Scalars['String']>;
};

export type UpdateChallengeImagesInput = {
  id: Scalars['String'];
  order?: Maybe<Scalars['Int']>;
};

export type UpdateChallengeInput = {
  name?: Maybe<Scalars['String']>;
  challenge_type?: Maybe<Scalars['String']>;
  start_date_registration?: Maybe<Scalars['DateTime']>;
  end_date_registration?: Maybe<Scalars['DateTime']>;
  launch_date?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  has_achievement?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  registration_limit?: Maybe<Scalars['Float']>;
  internal_test?: Maybe<Scalars['Boolean']>;
  date_for_drawn?: Maybe<Scalars['DateTime']>;
  date_of_drawn?: Maybe<Scalars['DateTime']>;
  temporarily_unavailable?: Maybe<Scalars['Boolean']>;
  canceled?: Maybe<Scalars['Boolean']>;
  reason_for_cancellation?: Maybe<Scalars['String']>;
  image_avatar?: Maybe<Scalars['String']>;
  image_cover?: Maybe<Scalars['String']>;
  has_categories?: Maybe<Scalars['Boolean']>;
  accept_installments?: Maybe<Scalars['Boolean']>;
  eligible_spotlight?: Maybe<Scalars['Boolean']>;
  image_spotlight?: Maybe<Scalars['String']>;
  published?: Maybe<Scalars['Boolean']>;
  commissioning_model_id?: Maybe<Scalars['String']>;
  physical_event?: Maybe<Scalars['Boolean']>;
};

export type UpdateChallengeShippingTypeInput = {
  code: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  message_in_app?: Maybe<Scalars['String']>;
};

export type UpdateChallengeShippingTypeTranslationInput = {
  challenge_shipping_type_code: Scalars['String'];
  language_code: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  message_in_app?: Maybe<Scalars['String']>;
};

export type UpdateCommissioningModelInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type UpdateCommissioningModelTranslationInput = {
  language_code: Scalars['String'];
  commissioning_model_id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  percentage?: Maybe<Scalars['Float']>;
  minimum_installment_amount?: Maybe<Scalars['Float']>;
  interest_rate?: Maybe<Scalars['Float']>;
  max_installments?: Maybe<Scalars['Float']>;
};

export type UpdateCompanyAddressInput = {
  address_id: Scalars['String'];
  company_id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  street_address?: Maybe<Scalars['String']>;
  street_number?: Maybe<Scalars['Float']>;
  neighborhood?: Maybe<Scalars['String']>;
  complement?: Maybe<Scalars['String']>;
  reference_point?: Maybe<Scalars['String']>;
  city_id?: Maybe<Scalars['String']>;
  is_billing_address?: Maybe<Scalars['Boolean']>;
};

export type UpdateCompanyBankAccountInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  agency: Scalars['String'];
  agency_digit?: Maybe<Scalars['String']>;
  account: Scalars['String'];
  account_digit?: Maybe<Scalars['String']>;
  associated_document?: Maybe<Scalars['String']>;
  default_account: Scalars['Boolean'];
  bank_id: Scalars['String'];
};

export type UpdateComplaintTypeInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type UpdateEventRouteInput = {
  event_route_id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  coordinates?: Maybe<Array<Array<Scalars['Float']>>>;
};

export type UpdateEventRoutePoiInput = {
  poi_id: Scalars['String'];
  challenge_id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
};

export type UpdateEventSubscriptionPriceInput = {
  id: Scalars['String'];
  value?: Maybe<Scalars['Float']>;
  date_initial?: Maybe<Scalars['DateTime']>;
};

export type UpdateEventSupportPointInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  opening_time?: Maybe<Scalars['DateTime']>;
  closing_time?: Maybe<Scalars['DateTime']>;
  available_mechanic?: Maybe<Scalars['Boolean']>;
  available_food?: Maybe<Scalars['Boolean']>;
  start?: Maybe<Scalars['Boolean']>;
  finish?: Maybe<Scalars['Boolean']>;
  order?: Maybe<Scalars['Float']>;
};

export type UpdateProductImageOrderInput = {
  id: Scalars['String'];
  order?: Maybe<Scalars['Float']>;
  challenge_id: Scalars['String'];
};

export type UpdateProductInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  date_initial?: Maybe<Scalars['DateTime']>;
  date_end?: Maybe<Scalars['DateTime']>;
  only_award?: Maybe<Scalars['Boolean']>;
  available?: Maybe<Scalars['Boolean']>;
  order?: Maybe<Scalars['Float']>;
  has_cost?: Maybe<Scalars['Boolean']>;
  allow_buy_without_subscription?: Maybe<Scalars['Boolean']>;
  free_field?: Maybe<Scalars['Boolean']>;
  challenge_id?: Maybe<Scalars['String']>;
};

export type UpdateProductPriceInput = {
  id: Scalars['String'];
  challenge_id: Scalars['String'];
  value?: Maybe<Scalars['Float']>;
  date_initial?: Maybe<Scalars['DateTime']>;
};

export type UpdateProductVariationInput = {
  id: Scalars['String'];
  challenge_id?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  available_quantity?: Maybe<Scalars['Float']>;
  available?: Maybe<Scalars['Boolean']>;
  order?: Maybe<Scalars['Float']>;
};

export type UpdateProductVariationPriceInput = {
  id: Scalars['String'];
  challenge_id: Scalars['String'];
  value?: Maybe<Scalars['Float']>;
  date_initial?: Maybe<Scalars['DateTime']>;
};

export type UpdateProfileCompanyInput = {
  description?: Maybe<Scalars['String']>;
  profile_avatar: Scalars['String'];
  profile_cover: Scalars['String'];
  username: Scalars['String'];
  address_one: Scalars['String'];
  address_two: Scalars['String'];
  zip_code?: Maybe<Scalars['String']>;
  city_id?: Maybe<Scalars['String']>;
  fantasy_name: Scalars['String'];
  business_name: Scalars['String'];
  register_number: Scalars['String'];
  site: Scalars['String'];
  company_id: Scalars['String'];
  profile_id: Scalars['String'];
  phone_number: Scalars['String'];
};

export type UpdateProfilePersonalInput = {
  description?: Maybe<Scalars['String']>;
  profile_avatar?: Maybe<Scalars['String']>;
  profile_cover?: Maybe<Scalars['String']>;
  legal_registry_number?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  user_id?: Maybe<Scalars['String']>;
  stature?: Maybe<Scalars['Float']>;
  weight?: Maybe<Scalars['Float']>;
  gender?: Maybe<Scalars['String']>;
  date_of_birth?: Maybe<Scalars['DateTime']>;
  address_line_one?: Maybe<Scalars['String']>;
  address_line_two?: Maybe<Scalars['String']>;
  city_id?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  street_number?: Maybe<Scalars['String']>;
  phone_number?: Maybe<Scalars['String']>;
  team_name?: Maybe<Scalars['String']>;
};

export type UpdateSettingsProfileNotificationInput = {
  profile_id: Scalars['String'];
  comments_push?: Maybe<Scalars['Boolean']>;
  comments_email?: Maybe<Scalars['Boolean']>;
  comment_response_push?: Maybe<Scalars['Boolean']>;
  comment_response_email?: Maybe<Scalars['Boolean']>;
  comment_claps_push?: Maybe<Scalars['Boolean']>;
  comment_claps_email?: Maybe<Scalars['Boolean']>;
  claps_push?: Maybe<Scalars['Boolean']>;
  claps_email?: Maybe<Scalars['Boolean']>;
  messages_received_push?: Maybe<Scalars['Boolean']>;
  messages_received_email?: Maybe<Scalars['Boolean']>;
  message_request_push?: Maybe<Scalars['Boolean']>;
  message_request_email?: Maybe<Scalars['Boolean']>;
  followers_request_push?: Maybe<Scalars['Boolean']>;
  followers_request_email?: Maybe<Scalars['Boolean']>;
  follower_new_push?: Maybe<Scalars['Boolean']>;
  follower_new_email?: Maybe<Scalars['Boolean']>;
  mentions_push?: Maybe<Scalars['Boolean']>;
  mentions_email?: Maybe<Scalars['Boolean']>;
  challenge_reminder_push?: Maybe<Scalars['Boolean']>;
  challenge_reminder_email?: Maybe<Scalars['Boolean']>;
  challenge_subscribed_received_push?: Maybe<Scalars['Boolean']>;
  challenge_subscribed_received_email?: Maybe<Scalars['Boolean']>;
  maintenance_reminder_push?: Maybe<Scalars['Boolean']>;
  maintenance_reminder_email?: Maybe<Scalars['Boolean']>;
  activities_received_push?: Maybe<Scalars['Boolean']>;
  activities_received_email?: Maybe<Scalars['Boolean']>;
};

export type UpdateSubscriptionInput = {
  id: Scalars['String'];
  challenge_id?: Maybe<Scalars['String']>;
  athlete_identification?: Maybe<Scalars['String']>;
};

export type UpdateSubscriptionResponse = {
  __typename?: 'UpdateSubscriptionResponse';
  status: Scalars['String'];
  message: Scalars['String'];
  subscription: UserChallenges;
};

export type UpdateSubscriptionWithdrawalAddressInput = {
  challenge_id: Scalars['String'];
  challenge_withdrawal_address_id: Scalars['String'];
  user_id: Scalars['String'];
};

export type UpdateUserDataCompiledInput = {
  last_platform_used?: Maybe<Scalars['String']>;
  last_app_version_used?: Maybe<Scalars['String']>;
  last_device_used?: Maybe<Scalars['String']>;
  last_time_used?: Maybe<Scalars['String']>;
  integrated_with_strava_crawler?: Maybe<Scalars['Boolean']>;
  integrated_with_polar?: Maybe<Scalars['Boolean']>;
  integrated_with_garmin?: Maybe<Scalars['Boolean']>;
  has_company?: Maybe<Scalars['Boolean']>;
  verified_phone?: Maybe<Scalars['Boolean']>;
  view_welcome_screen?: Maybe<Scalars['Boolean']>;
};

export type UpdateUserEventExtraordinaryActionInput = {
  id: Scalars['String'];
  bonus_subscription?: Maybe<Scalars['Boolean']>;
  buy_after_registration_closes?: Maybe<Scalars['Boolean']>;
};

export type UpdateUserInput = {
  name?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  stature?: Maybe<Scalars['Float']>;
  weight?: Maybe<Scalars['Float']>;
  phone?: Maybe<Scalars['String']>;
  date_of_birth?: Maybe<Scalars['DateTime']>;
  city_id?: Maybe<Scalars['String']>;
  legal_registry_number?: Maybe<Scalars['String']>;
  team_name?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  stature?: Maybe<Scalars['Float']>;
  weight?: Maybe<Scalars['Float']>;
  phone?: Maybe<Scalars['String']>;
  date_of_birth?: Maybe<Scalars['CacheDate']>;
  has_social_login: Scalars['Boolean'];
  city_id?: Maybe<Scalars['String']>;
  city?: Maybe<City>;
  active: Scalars['Boolean'];
  address_line_one?: Maybe<Scalars['String']>;
  address_line_two?: Maybe<Scalars['String']>;
  street_number?: Maybe<Scalars['String']>;
  legal_registry_number?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  strava_permission_activities: Scalars['Boolean'];
  staff: Scalars['Boolean'];
  blacklist: Scalars['Boolean'];
  team_name?: Maybe<Scalars['String']>;
  companies: Array<UsersCompanies>;
  payments: Array<Payment>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  profile?: Maybe<Profile>;
  last_challenge?: Maybe<Challenge>;
  count_challenges_participates?: Maybe<Scalars['Float']>;
  user_event_extraordinary_action?: Maybe<Array<UserEventExtraordinaryActionType>>;
  activities_count?: Maybe<Scalars['Float']>;
};

export type UserAddressType = {
  __typename?: 'UserAddressType';
  address_id: Scalars['String'];
  user_id: Scalars['String'];
  is_billing_address: Scalars['Boolean'];
  address: AddressType;
};

export type UserChallenges = {
  __typename?: 'UserChallenges';
  id: Scalars['ID'];
  challenge_id: Scalars['String'];
  user_id: Scalars['String'];
  challenge_category_id?: Maybe<Scalars['String']>;
  short_id?: Maybe<Scalars['String']>;
  user: User;
  registration_date?: Maybe<Scalars['CacheDate']>;
  end_date?: Maybe<Scalars['CacheDate']>;
  classification?: Maybe<Scalars['Float']>;
  total_time?: Maybe<Scalars['Float']>;
  total_distance?: Maybe<Scalars['Float']>;
  total_altimetry?: Maybe<Scalars['Float']>;
  total_friends?: Maybe<Scalars['Float']>;
  total_rides?: Maybe<Scalars['Float']>;
  drawn: Scalars['Boolean'];
  completed: Scalars['Boolean'];
  paid?: Maybe<Scalars['Boolean']>;
  start_time_first_activity?: Maybe<Scalars['CacheDate']>;
  amount_paid?: Maybe<Scalars['Float']>;
  amount_to_pay?: Maybe<Scalars['Float']>;
  amount_freight?: Maybe<Scalars['Float']>;
  payment_id?: Maybe<Scalars['String']>;
  last_payment_id?: Maybe<Scalars['String']>;
  challenge_withdrawal_address_id?: Maybe<Scalars['String']>;
  withdrawal_date?: Maybe<Scalars['CacheDate']>;
  ready_to_withdraw?: Maybe<Scalars['Boolean']>;
  user_marked_withdrawn?: Maybe<Scalars['Boolean']>;
  bonus_subscription?: Maybe<Scalars['Boolean']>;
  total_time_seconds?: Maybe<Scalars['Float']>;
  athlete_identification?: Maybe<Scalars['String']>;
  interest_free_amount?: Maybe<Scalars['Float']>;
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
  challenge: Challenge;
  last_payment?: Maybe<Payment>;
  activities?: Maybe<Array<ChallengeActivity>>;
  award_subscription_references?: Maybe<Array<AwardSubscription>>;
  award?: Maybe<ChallengeAwards>;
  award_shipping_address?: Maybe<ChallengeAwardDeliveryAddress>;
  points_already_passed: Array<UserEventSupportPointType>;
  subscription_status?: Maybe<SubscriptionStatus>;
  products_bought: Array<ProductPurchasedType>;
  category?: Maybe<ChallengeCategories>;
  withdrawal_address?: Maybe<WithdrawalAddress>;
  product_purchased: ProductPurchasedType;
};

export type UserEventExtraordinaryActionType = {
  __typename?: 'UserEventExtraordinaryActionType';
  id: Scalars['ID'];
  user_id: Scalars['String'];
  challenge_id: Scalars['String'];
  bonus_subscription?: Maybe<Scalars['Boolean']>;
  buy_after_registration_closes?: Maybe<Scalars['Boolean']>;
  user: User;
  challenge?: Maybe<Challenge>;
  active: Scalars['Boolean'];
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
};

export type UserEventSupportPointPaginatedResponse = {
  __typename?: 'UserEventSupportPointPaginatedResponse';
  user_event_support_points: Array<UserEventSupportPointType>;
  page_info: PaginationInfo;
};

export type UserEventSupportPointType = {
  __typename?: 'UserEventSupportPointType';
  user_challenge_id: Scalars['String'];
  event_support_point_id: Scalars['String'];
  check_time: Scalars['CacheDate'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  user_check: Scalars['Boolean'];
  subscription: UserChallenges;
  support_point: EventSupportPointType;
  created_at: Scalars['CacheDate'];
  updated_at: Scalars['CacheDate'];
};

export type UserSettingsInput = {
  measuring_unit: Scalars['String'];
  dark_theme: Scalars['Boolean'];
  color_theme_device: Scalars['Boolean'];
  send_activities_to_strava: Scalars['Boolean'];
};

export type UsersCompanies = {
  __typename?: 'UsersCompanies';
  creator: Scalars['Boolean'];
  company_id: Scalars['String'];
  user_id: Scalars['String'];
  company_function_id: Scalars['String'];
  company: Company;
  user: User;
};

export type UsersPaginatedResponse = {
  __typename?: 'UsersPaginatedResponse';
  users?: Maybe<Array<User>>;
  page_info: PaginationInfo;
};

export type VerifyEmailInput = {
  email: Scalars['String'];
  code: Scalars['String'];
  isRegister?: Maybe<Scalars['Boolean']>;
};

export type VerifyEmailResponse = {
  __typename?: 'VerifyEmailResponse';
  email?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type VerifyPhoneNumberResponse = {
  __typename?: 'VerifyPhoneNumberResponse';
  user?: Maybe<User>;
  codeStatus?: Maybe<Scalars['String']>;
};

export type WithdrawalAddress = {
  __typename?: 'WithdrawalAddress';
  id: Scalars['ID'];
  name: Scalars['String'];
  challenge_id: Scalars['String'];
  zip_code: Scalars['String'];
  address_line_one: Scalars['String'];
  address_line_two?: Maybe<Scalars['String']>;
  reference_point?: Maybe<Scalars['String']>;
  city_id: Scalars['String'];
  city: City;
};
