import React, { useEffect } from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import { RootStackParamList } from '~/routes.types';
import { Card, ChallengeAwards } from '~/graphql/autogenerate/schemas';

import SelectMethod from './screens/Payment.SelectMethod.screen';
import SelectInstallments from './screens/Payment.SelectInstallments.screen';
import Confirmation from './screens/Payment.Confirmation.screen';
import ShippingCoast from './screens/Payment.ShippingCoast.screen';
import SelectMode from './screens/Payment.SelectMode.screen';

import { useUserInfo } from '~/hooks';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Payment.RetryPayment'
>;
type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Payment.RetryPayment'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

interface RootParams {
  award: ChallengeAwards;
  data: GetChallengeDetailQuery;
  rootNavigation: ChallengeDescriptionNavigationProp;
  value: number;
  cancel_waiting_payments: boolean;
}

interface PaymentInformations extends RootParams {
  payment_method: 'credit_card' | 'boleto';
  selected_card?: Card;
}

interface InstallmentsProps {
  installments_quantity: number;
  total_amount: number;
  installment_value: number;
}

interface ConfirmationProps extends RootParams {
  payment_method: 'credit_card' | 'boleto';
  selected_card?: Card;
  installments: InstallmentsProps;
}

export type RetryPaymentAwardRootParamList = {
  selectMethod: RootParams;
  confirmation: ConfirmationProps;
  selectInstallments: PaymentInformations;
};

const AppStack = createStackNavigator<RetryPaymentAwardRootParamList>();

export default function ChallengeRetryPayment({
  route,
  navigation,
}: Props): JSX.Element {
  const { data: userProfile, refetch: getUserProfile } = useUserInfo();

  useEffect(() => {
    if (getUserProfile) {
      getUserProfile();
    }
  }, [getUserProfile, userProfile]);

  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'pop',
        animationEnabled: true,
      }}
      mode="modal"
      headerMode="screen"
      initialRouteName="selectMethod"
    >
      <AppStack.Screen
        name="selectMethod"
        component={SelectMethod}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
      <AppStack.Screen
        name="selectInstallments"
        component={SelectInstallments}
        initialParams={{
          rootNavigation: navigation,
          ...route.params,
        }}
      />
      <AppStack.Screen
        name="confirmation"
        component={Confirmation}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
    </AppStack.Navigator>
  );
}
