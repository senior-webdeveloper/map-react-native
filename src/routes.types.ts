import { Image } from 'react-native';
import { JSXElementConstructor, ReactElement } from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';
import {
  Card,
  Activity,
  Challenge,
  ChallengeAwards,
  Profile,
  SubscriptionPayment,
  User,
  UserChallenges,
  ChallengeAttachedFiles,
  ChallengeExternalLinksAttached,
  ProductType,
  UserEventExtraordinaryActionType,
} from '~/graphql/autogenerate/schemas';

import {
  GetActivityDetailQuery,
  GetChallengeDetailQuery,
  GetDetailedSubscriptionQuery,
  GetSubscriptionProgressQuery,
} from '~/graphql/autogenerate/operations';

type UserType = {
  email: string;
  name: string;
  phone: string;
  avatar: string;
};

interface Card {
  __typename: string;
  brand: string;
  expiration_date: string;
  external_id: string;
  first_digits: string;
  holder_name: string;
  id: string;
  last_digits: string;
  legal_holder_number: string;
  main: boolean;
  name: string;
  valid: boolean;
}

type Keys =
  | ['generalRankOrderedByDistance', 'generalRankOrderedByAltimetry']
  | ['maleRankOrderedByDistance', 'maleRankOrderedByAltimetry']
  | ['femaleRankOrderedByDistance', 'femaleRankOrderedByAltimetry']
  | [
      'subscriptionsFollowedByMeOrderedByDistance',
      'subscriptionsFollowedByMeOrderedByAltimetry',
    ]
  | [
      'subscriptionsWhoFollowsMeOrderedByDistance',
      'subscriptionsWhoFollowsMeOrderedByAltimetry',
    ];

export type RootStackParamList = {
  'Challenge.ShareSubscription': {
    short_id: string;
    data: GetChallengeDetailQuery;
  };
  'Staff.SearchUsers': {
    searchForCompany?: boolean;
    company_id?: string;
  };
  'Activity.Create': undefined;
  'User.RecoverPassword': UserType;
  DetailedChallenge: undefined;
  ThirdPartyConnect: undefined;
  Home: undefined;
  Login: undefined;
  'User.EmailSignUp': undefined;
  'User.RecoverEmail': undefined;
  'User.EmailLogin': undefined;
  GenericProfile: undefined;
  'User.EditProfileInfo': { user: Profile };
  'User.Profile': undefined;
  EmailSignup: undefined;
  'Challenge.Comments': { challenge_id: string };
  CommercialAccount: undefined;
  'Challenge.Downloads': {
    challenge_id: string;
    files: ChallengeAttachedFiles[];
  };
  'Challenge.Links': {
    links: ChallengeExternalLinksAttached[];
  };
  'Challenge.Description': { challenge_id: string };
  'Challenge.ImageGallery': { images: string[] };
  'Challenge.GalleryDetail': {
    imageOnDetailIIndex: number;
    images: [];
  };
  'Challenge.SeeMoreChallenge': {
    key: string;
    title: string;
    profile_id: string;
  };
  'User.ConnectedMonitors': undefined;
  'Challenge.LegalInfo': undefined;
  'Challenge.DescriptionInfo': { description: string };
  'Permission.Camera': undefined;
  'Permission.Write': undefined;
  'Permission.Location': undefined;
  'Permission.Notifications': undefined;
  'Permission.AppleHealth': undefined;
  'User.Activities': undefined;
  'Challenge.ShowSpecificMap': {
    polyline: string;
    data: GetActivityDetailQuery;
  };
  'Challenge.AddressToSend': {
    user_challenge_id: string;
    challenge_id: string;
    physical_event: boolean;
    data: GetChallengeDetailQuery;
    last_payment_id?: string | null;
  };
  'Challenge.ChangeAddressToReceive': {
    user_challenge_id: string;
    challenge_id: string;
    physical_event: boolean;
    data: GetChallengeDetailQuery;
    last_payment_id?: string | null;
  };
  'Challenge.ChangeCategory': {
    user_challenge_id: string;
    data: GetChallengeDetailQuery;
  };
  'Challenge.UserActivities': {
    challenge_id: string;
    user_id: string;
    user_challenge_id: string;
    data: GetChallengeDetailQuery;
    user_challenges: GetSubscriptionProgressQuery;
  };
  'Challenges.RankingFilter': {
    challenge_id: string;
    challenge_type: string;
    goal: number;
  };
  'Challenge.Classification': {
    key: Keys;
    challenge_id: string;
    challenge: Challenge;
    challenge_type: string;
    my_subscribed_date: string;
    filterName: string;
    goal_distance: number;
    goal_altimetric?: number;
    user_challenges?: Activity[];
    has_classification: boolean;
  };
  'Challenge.CompareResults': {
    challenge: Challenge;
    user_id: string;
    subscription_id: string;
    user_activities?: Activity[];
    user: UserChallenges;
    subscribed_date: string;
    my_subscribed_date: string;
    selected_user_info: UserChallenges; // <--
  };
  'Challenge.ShowSpecificActivity': {
    id: string;
    user?: User;
    subscribed_date: string;
    profile: Profile;
    registration_date: string;
  };
  'Challenge.StatsAndHighlights': {
    challenge_id: string;
    challenge: Challenge;
    user_activities?: Activity[];
    my_subscribed_date: string;
    challenge_type: string;
    goal_distance: number;
    goal_altimetric?: number;
    award?: ChallengeAwards[];
  };
  'Challenge.WinnerAwards': {
    challenge_name: string;
    winner: UserChallenges;
  };
  'Challenge.SubscribedWithoutMonitors': {
    challenge_type: 'altimetric' | 'distance';
    challenge_id: string;
  };
  'Challenge.SubscribedWithMonitors': undefined;
  'Challenge.Winners': {
    challenge_id: string;
    isCreator: boolean;
  };
  'Challenge.SendAwardsInformation': {
    userChallenges: UserChallenges;
  };
  'Challenge.ManuallyProgress': { challenge_type: 'altimetric' | 'distance' };
  'User.ListCreditCards': undefined;
  'User.CreditCardsDetail': { creditCard: Card };
  'User.CreditCardsCreate': undefined;
  'Activity.StravaLink': { link?: string };
  'Challenge.MyPayment': {
    categorySelected?: string;
    user_challenge_id: string;
    challenge_id: string;
    physical_event: boolean;
    data: GetChallengeDetailQuery;
    last_payment_id?: string | null;
    subscribe: () => void;
  };
  AwardsShowcase: {
    awards: ChallengeAwards[];
    title: string;
    subscribe: () => Promise<void>;
    showSubscribe: boolean;
    hasClickedOnSubscribe: boolean;
    isPaid: boolean;
  };
  'Products.Showcase': {
    products: ProductType[];
    title: string;
    showBuyMore: boolean;
    subscribe: () => Promise<void>;
    showSubscribe: boolean;
    hasClickedOnSubscribe: boolean;
    isPaid: boolean;
    data: GetChallengeDetailQuery;
    extraordinaryActions?: UserEventExtraordinaryActionType;
  };
  'Award.Description': {
    award: ChallengeAwards;
    title: string;
    subscribe: () => Promise<void>;
    showSubscribe: boolean;
    hasClickedOnSubscribe: boolean;
    isPaid: boolean;
    award_index: number;
  };
  'Products.Description': {
    product: ProductType;
    title: string;
    subscribe: () => Promise<void>;
    showSubscribe: boolean;
    hasClickedOnSubscribe: boolean;
    isPaid: boolean;
    award_index: number;
    showBuyMore: boolean;
    data: GetChallengeDetailQuery;
  };
  'User.SpecificMonitor': {
    name: string;
    image: Image;
    title: string;
    description: string;
    last_upload: string;
  };
  'User.SpecificMonitorHelp': {
    id: string;
    name: string;
    image: Image;
  };
  'User.VisitorProfile': {
    profile_id: string;
  };
  'Challenge.PaymentAward': {
    data: GetChallengeDetailQuery;
    has_subscription?: boolean;
    award_index: number;
    award_id: string;
  };
  'Challenge.PaymentHistoric': {
    data: GetChallengeDetailQuery;
    challenge_id: string;
    award: ChallengeAwards;
    payment_id: string;
    payment_historic: SubscriptionPayment[];
    value: number;
    last_payment?: SubscriptionPayment;
    interest_free_amount?: number;
  };
  'Challenge.RetryPayment': {
    award: ChallengeAwards;
    data: GetChallengeDetailQuery;
    value: number;
    cancel_waiting_payments: boolean;
  };
  'Payment.RetryPayment': {
    award: ChallengeAwards;
    data: GetChallengeDetailQuery;
    cancel_waiting_payments: boolean;
    value: number;
  };
  'Challenge.SuccessPayment': {
    payment_id: string;
    challenge_id: string;
    data: GetChallengeDetailQuery;
    award_index: number;
    award_id: string;
    award?: ChallengeAwards;
    error_in_payment: boolean;
    hasSubscribed?: boolean;
  };
  'User.EditProfileMain': Profile;
  'User.EditProfileAndPhoto': Profile;
  'User.EditProfileAddress': Profile;
  'User.EditProfilePersonalData': Profile;
  'Challenge.BuyedAward': {
    award: ChallengeAwards;
    value: number;
    physical_event: boolean;
    data: GetChallengeDetailQuery;
    subscription_status: GetDetailedSubscriptionQuery;
  };
  'User.AppleWelcomeName': undefined;
  'User.AppleWelcomeEmail': { hasPrevious: boolean };
  'User.AppleWelcomeConfirmCode': { email: string };
  'User.Welcome': undefined;
  'Products.BuyProduct': {
    data: GetChallengeDetailQuery;
    firstElementId?: string;
  };
  'Products.SuccessPayment': {
    message: string;
    status: string;
    error_in_payment?: string;
    payment_id: string;
  };
  'Products.BuyedProduct': {
    user_challenge_id?: string;
    data: GetChallengeDetailQuery;
  };
  'Challenge.Administration': {
    challenge_id: string;
    data: GetChallengeDetailQuery;
  };
};

export interface RoutesInterface {
  name: keyof RootStackParamList;
  options?: StackNavigationOptions;
  component: (
    any,
  ) => ReactElement<any, string | JSXElementConstructor<any>> | null;
  initialParams?: any;
}
