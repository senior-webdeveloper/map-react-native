import { RoutesInterface } from '~/routes.types';
import UserActivities from './User.Activities/User.Activities.screen';
import UserAppleWelcomeConfirmCode from './User.AppleWelcome/User.AppleWelcomeConfirmCode.screen';
import UserAppleWelcomeEmail from './User.AppleWelcome/User.AppleWelcomeEmail.screen';
import UserAppleWelcomeName from './User.AppleWelcome/UserAppleWelcomeName.screen';
import UserConnectedMonitors from './User.ConnectedMonitors/User.ConnectedMonitors.screen';
import UserCreditCardsCreate from './User.CreditCardsCreate/User.CreditCardsCreate.screen';
import UserCreditCardsDetail from './User.CreditCardsDetail/User.CreditCardsDetail.screen';
import UserEditProfileAddress from './User.EditProfileAddress/User.EditProfileAddress.screen';
import UserEditProfileAndPhoto from './User.EditProfileAndPhoto/User.EditProfileAndPhoto.screen';
import UserEditProfileInfo from './User.EditProfileInfo/User.EditProfileInfo.screen';
import UserEditProfileMain from './User.EditProfileMain/User.EditProfileMain.screen';
import UserEditProfilePersonalData from './User.EditProfilePersonalData/User.EditProfilePersonalData.screen';
import UserEmailLogin from './User.EmailLogin/User.EmailLogin.screen';
import UserEmailSignup from './User.EmailSignUp/User.EmailSignUp.screen';
import UserListCreditCards from './User.ListCreditCards/User.ListCreditCards.screen';
import UserProfile from './User.Profile/User.Profile.screen';
import UserRecoverEmail from './User.RecoverEmail/User.RecoverEmail.screen';
import UserRecoverPassword from './User.RecoverPassword/User.RecoverPassword.screen';
import UserSpecificMonitor from './User.SpecificMonitor/User.SpecificMonitor.screen';
import UserSpecificMonitorHelp from './User.SpecificMonitorHelp/User.SpecificMonitorHelp.screen';
import UserVisitorProfile from './User.VisitorProfile/User.VisitorProfile.screen';
import UserWelcome from './User.Welcome/User.Welcome.screen';

export const userRoutes: RoutesInterface[] = [
  {
    name: 'User.Activities',
    component: UserActivities,
  },
  {
    name: 'User.AppleWelcomeName',
    component: UserAppleWelcomeName,
  },
  {
    name: 'User.AppleWelcomeEmail',
    component: UserAppleWelcomeEmail,
  },
  {
    name: 'User.AppleWelcomeConfirmCode',
    component: UserAppleWelcomeConfirmCode,
  },
  {
    name: 'User.ConnectedMonitors',
    component: UserConnectedMonitors,
  },
  {
    name: 'User.ListCreditCards',
    component: UserListCreditCards,
  },
  {
    name: 'User.CreditCardsCreate',
    component: UserCreditCardsCreate,
  },
  {
    name: 'User.CreditCardsDetail',
    component: UserCreditCardsDetail,
  },
  {
    name: 'User.EditProfileAddress',
    component: UserEditProfileAddress,
  },
  {
    name: 'User.EditProfileAndPhoto',
    component: UserEditProfileAndPhoto,
  },
  {
    name: 'User.EditProfileInfo',
    component: UserEditProfileInfo,
  },
  {
    name: 'User.EditProfileMain',
    component: UserEditProfileMain,
  },
  {
    name: 'User.EmailLogin',
    component: UserEmailLogin,
  },
  {
    name: 'User.EmailSignUp',
    component: UserEmailSignup,
  },
  {
    name: 'User.Profile',
    component: UserProfile,
  },
  {
    name: 'User.RecoverEmail',
    component: UserRecoverEmail,
  },
  {
    name: 'User.RecoverPassword',
    component: UserRecoverPassword,
  },
  {
    name: 'User.SpecificMonitor',
    component: UserSpecificMonitor,
  },
  {
    name: 'User.SpecificMonitorHelp',
    component: UserSpecificMonitorHelp,
  },
  {
    name: 'User.VisitorProfile',
    component: UserVisitorProfile,
  },
  {
    name: 'User.EditProfilePersonalData',
    component: UserEditProfilePersonalData,
  },
  {
    name: 'User.Welcome',
    component: UserWelcome,
    initialParams: { name: 'Rider' },
  },
];
