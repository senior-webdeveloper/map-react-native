import React, { useEffect } from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  GetChallengeDetailQuery,
  GetDetailedSubscriptionQuery,
} from '~/graphql/autogenerate/operations';
import { RootStackParamList } from '~/routes.types';
import { Card } from '~/graphql/autogenerate/schemas';

import ChallengeAdministrationMenu from './screens/Challenge.Administration.Menu/Challenge.Administration.Menu.screen';
import ChallengeAdministrationQrCode from './screens/Challenge.Administration.QrCode/Challenge.Administration.QrCode.screen';
import ChallengeAdministrationUserInformation from './screens/Challenge.Administration.UserInformation/Challenge.Administration.UserInformation.screen';
import ChallengeAdministrationListUsers from './screens/Challenge.Administration.ListUsers/Challenge.Administration.ListUsers.screen';
import ChallengeAdministrationListUsersHasAwards from './screens/Challenge.Administration.ListUsersHasAwards/Challenge.Administration.ListUsersHasAwards.screen';
import ChallengeAdministrationCheckin from './screens/Challenge.Administration.Checkin/Challenge.Administration.Checkin.screen';
import ChallengeListUsersInEventPoints from './screens/Challenge.Administration.ListUsersInEventPoints/Challenge.Administration.ListUsersInEventPoints.screen';
import ChallengeAdministrationUserAssociation from './screens/Challenge.Administration.UserAssociation/Challenge.Administration.UserAssociation.screen';
import ChallengeAdministrationListUsersForStaff from './screens/Challenge.Administration.ListUsersForStaff/Challenge.Administration.ListUsersForStaff.screen';
import ChallengeAdministrationListProducts from './screens/Challenge.Administration.ListProducts/Challenge.Administration.ListProducts.screen';
import ChallengeAdministrationProductInformation from '~/screens/Challenge/Challenge.Administration/screens/Challenge.Administration.ProductInformation/Challenge.Administration.ProductInformation.screen';
import { ProductPurchasedType } from '~/generated/graphql';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.Administration'
>;
type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Administration'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

interface RootParams {
  challenge_id: string;
  rootNavigation: ChallengeDescriptionNavigationProp;
  data: GetChallengeDetailQuery;
}

interface QrCodeScreenParams extends RootParams {
  title: string;
  type: 'Subscription' | 'Product';
  user_subscribe_id?: string;
  user_id?: string;
  userData?: GetDetailedSubscriptionQuery;
  id_to_associate?: string;
}

interface UserIformationScreenParams extends RootParams {
  subscription_id: string;
}

interface ProductIformationScreenParams extends RootParams {
  product: ProductPurchasedType;
}

export type ChallengeAdministrationRouteList = {
  'Challenge.Administration.Menu': RootParams;
  'Challenge.Administration.QrCode': QrCodeScreenParams;
  'Challenge.Administration.UserInformation': UserIformationScreenParams;
  'Challenge.Administration.ProductInformation': ProductIformationScreenParams;
  'Challenge.Administration.ListUsersForStaff': RootParams;
  'Challenge.Administration.ListProducts': RootParams;
  'Challenge.Administration.ListUsers': RootParams & {
    findUserSubscription?: boolean;
  };
  'Challenge.Administration.ListUsersHasAwards': RootParams;
  'Challenge.Administration.Checkin': RootParams;
  'Challenge.Administration.ListUsersInEventPoints': RootParams;
  'Challenge.Administration.UserAssociation': QrCodeScreenParams;
};

const AppStack = createStackNavigator<ChallengeAdministrationRouteList>();

export default function PaymentAward({
  route,
  navigation,
}: Props): JSX.Element {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'pop',
        animationEnabled: true,
      }}
      initialRouteName="Challenge.Administration.Menu"
    >
      <AppStack.Screen
        name="Challenge.Administration.UserAssociation"
        component={ChallengeAdministrationUserAssociation}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
      <AppStack.Screen
        name="Challenge.Administration.Menu"
        component={ChallengeAdministrationMenu}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="Challenge.Administration.ProductInformation"
        component={ChallengeAdministrationProductInformation}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="Challenge.Administration.Checkin"
        component={ChallengeAdministrationCheckin}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="Challenge.Administration.ListProducts"
        component={ChallengeAdministrationListProducts}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="Challenge.Administration.ListUsersInEventPoints"
        component={ChallengeListUsersInEventPoints}
      />

      <AppStack.Screen
        name="Challenge.Administration.QrCode"
        component={ChallengeAdministrationQrCode}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="Challenge.Administration.UserInformation"
        component={ChallengeAdministrationUserInformation}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="Challenge.Administration.ListUsers"
        component={ChallengeAdministrationListUsers}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="Challenge.Administration.ListUsersForStaff"
        component={ChallengeAdministrationListUsersForStaff}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="Challenge.Administration.ListUsersHasAwards"
        component={ChallengeAdministrationListUsersHasAwards}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
    </AppStack.Navigator>
  );
}
