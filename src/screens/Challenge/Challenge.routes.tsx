import { RoutesInterface } from '~/routes.types';
import ChallengeDescription from './Challenge.Description/Challenge.Description.screen';
import ChallengeAddressToSend from './Challenge.AddressToSend/Challenge.AddressToSend.screen';
import ChallengeBuyedAward from './Challenge.BuyedAward/Challenge.BuyedAward.screen';
import ChallengeDownloads from './Challenge.Downloads/Challenge.Downloads.screen';
import ChallengeGalleryDetail from './Challenge.GalleryDetail/Challenge.GalleryDetail.screen';
import ChallengeImageGallery from './Challenge.ImageGallery/Challenge.ImageGallery.screen';
import ChallengeLinks from './Challenge.Links/Challenge.Links.screen';
import ChallengeMyPayment from './Challenge.MyPayment/Challenge.MyPayment.screen';
import ChallengePaymentAward from './Challenge.PaymentAward/PaymentAward.routes';
import ChallengePaymentHistoric from './Challenge.PaymentHistoric/Challenge.PaymentHistoric.screen';
import ChallengeRetryPayment from './Challenge.RetryPayment/RetryPaymentAward.routes';
import ChallengeSuccessPayment from './Challenge.SuccessPayment/Challenge.SuccessPayment';
import ChallengeComments from './Challenge.Comments/Challenge.Comments.screen';
import ChallengeLegalInfo from './Challenge.LegalInfo/Challenge.LegalInfo.screen';
import ChallengeStatsAndHighlights from './Challenge.StatsAndHighlights/Challenge.StatsAndHighlights.screen';
import ChallengeClassification from './Challenge.Classification/Challenge.Classification.screen';
import ChallengeCompareResults from './Challenge.CompareResults/Challenge.CompareResults.screen';
import ChallengeShowSpecificActivity from './Challenge.ShowSpecificAcitivity/Challenge.ShowSpecificAcitivity.screen';
import ChallengeSendAwardsInformation from './Challenge.SendAwardsInformation/Challenge.SendAwardsInformation.screen';
import ChallengeSubscribedWihoutMonitors from './Challenge.SubscribedWihoutMonitors/Challenge.SubscribedWihoutMonitors.screen';
import ChallengeSubscribedWithMonitors from './Challenge.SubscribedWithMonitors/Challenge.SubscribedWithMonitors.screen';
import ChallengeUserActivities from './Challenge.UserActivities/Challenge.UserActivities.screen';
import ChallengeWinnerAwards from './Challenge.WinnerAwards/Challenge.WinnerAwards.screen';
import ChallengeWinners from './Challenge.Winners/Challenge.Winners.screen';
import ChallengeManuallyProgress from './Challenge.ManuallyProgress/Challenge.ManuallyProgress.screen';
import ChallengeSeeMoreChallenge from './Challenge.SeeMoreChallenge/Challenge.SeeMoreChallenge.screen';
import ChallengeChangeAddressToReceive from './Challenge.ChangeAddressToReceive/Challenge.ChangeAddressToReceive.screen';
import ChallengeShowSpecificMap from './Challenge.ShowSpecificMap/Challenge.ShowSpecificMap.screen';
import ProductsDescription from './Products.Description/Products.Description.screen';
import ProductsShowcase from './Products.Showcase/Products.Showcase.screen';
import ChallengeChangeCategory from './Challenge.ChangeCategory/Challenge.ChangeCategory.screen';
import ChallengeDescriptionInfo from './Challenge.DescriptionInfo/Challenge.DescriptionInfo.screen';
import ChallengeAdministration from './Challenge.Administration/Challenge.Administration.routes';
import ChallengeShareSubscription from '~/screens/Challenge/Challenge.ShareSubscription/Challenge.ShareSubscription';

export const challengeRoutes: RoutesInterface[] = [
  {
    name: 'Challenge.ShareSubscription',
    component: ChallengeShareSubscription,
  },
  {
    name: 'Challenge.Administration',
    component: ChallengeAdministration,
  },
  {
    name: 'Challenge.DescriptionInfo',
    component: ChallengeDescriptionInfo,
  },
  {
    name: 'Challenge.Description',
    component: ChallengeDescription,
  },
  {
    name: 'Challenge.AddressToSend',
    component: ChallengeAddressToSend,
  },
  {
    name: 'Challenge.BuyedAward',
    component: ChallengeBuyedAward,
    initialParams: undefined,
  },
  {
    name: 'Challenge.Downloads',
    component: ChallengeDownloads,
  },
  {
    name: 'Challenge.GalleryDetail',
    component: ChallengeGalleryDetail,
  },
  {
    name: 'Challenge.ImageGallery',
    component: ChallengeImageGallery,
  },
  {
    name: 'Challenge.Links',
    component: ChallengeLinks,
  },
  {
    name: 'Challenge.MyPayment',
    component: ChallengeMyPayment,
  },
  {
    name: 'Challenge.PaymentAward',
    component: ChallengePaymentAward,
    initialParams: undefined,
    options: { gestureEnabled: false },
  },
  {
    name: 'Challenge.PaymentHistoric',
    component: ChallengePaymentHistoric,
  },
  {
    name: 'Challenge.RetryPayment',
    component: ChallengeRetryPayment,
    initialParams: { cancel_waiting_payments: false },
  },
  {
    name: 'Challenge.SuccessPayment',
    component: ChallengeSuccessPayment,
    options: { gestureEnabled: false },
  },
  {
    name: 'Challenge.Comments',
    component: ChallengeComments,
  },
  {
    name: 'Challenge.LegalInfo',
    component: ChallengeLegalInfo,
  },
  {
    name: 'Challenge.StatsAndHighlights',
    component: ChallengeStatsAndHighlights,
  },
  {
    name: 'Challenge.Classification',
    component: ChallengeClassification,
    initialParams: { goal_altimetric: 1, goal_distance: 1 },
  },
  {
    name: 'Challenge.CompareResults',
    component: ChallengeCompareResults,
  },
  {
    name: 'Challenge.ShowSpecificActivity',
    component: ChallengeShowSpecificActivity,
  },
  {
    name: 'Challenge.SendAwardsInformation',
    component: ChallengeSendAwardsInformation,
  },
  {
    name: 'Challenge.SubscribedWithoutMonitors',
    component: ChallengeSubscribedWihoutMonitors,
    initialParams: { challenge_type: 'distance' },
  },
  {
    name: 'Challenge.SubscribedWithMonitors',
    component: ChallengeSubscribedWithMonitors,
  },
  {
    name: 'Challenge.UserActivities',
    component: ChallengeUserActivities,
  },
  {
    name: 'Challenge.WinnerAwards',
    component: ChallengeWinnerAwards,
    initialParams: { challenge_name: '' },
  },
  {
    name: 'Challenge.Winners',
    component: ChallengeWinners,
  },
  {
    name: 'Challenge.ManuallyProgress',
    component: ChallengeManuallyProgress,
    initialParams: { challenge_type: 'distance' },
  },
  {
    name: 'Challenge.SeeMoreChallenge',
    component: ChallengeSeeMoreChallenge,
  },
  {
    name: 'Challenge.ChangeAddressToReceive',
    component: ChallengeChangeAddressToReceive,
  },
  {
    name: 'Challenge.ShowSpecificMap',
    component: ChallengeShowSpecificMap,
  },
  {
    name: 'Products.Description',
    component: ProductsDescription,
  },
  {
    name: 'Products.Showcase',
    component: ProductsShowcase,
  },
  {
    name: 'Challenge.ChangeCategory',
    component: ChallengeChangeCategory,
  },
];
