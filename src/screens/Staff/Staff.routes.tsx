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
import SearchUsers from '~/screens/Staff/SearchUsers';

export const staffRoutes: RoutesInterface[] = [
  {
    name: 'Staff.SearchUsers',
    component: SearchUsers,
  },
];
