import React, { useEffect } from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Platform } from 'react-native';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import { RootStackParamList } from '~/routes.types';
import {
  Card,
  UserEventExtraordinaryActionType,
} from '~/graphql/autogenerate/schemas';

import SelectOptions from './screens/Payment.SelectOptions.screen';
import SelectAddress from './screens/Payment.SelectAddress.screen';
import SelectMethod from './screens/Payment.SelectMethod.screen';
import SelectInstallments from './screens/Payment.SelectInstallments.screen';
import Confirmation from './screens/Payment.Confirmation.screen';
import ShippingCoast from './screens/Payment.ShippingCoast.screen';
import SelectMode from './screens/Payment.SelectMode.screen';
import BillingAddress from './screens/Payment.BillingAddress.screen';
import { useUserInfo } from '~/hooks';
import AddLegalRegisterNumber from './screens/Payment.AddLegalRegisterNumber.screen';
import AddPhoneNumber from './screens/Payment.AddPhoneNumber.screen';
import PersonalInformation from './screens/Payment.PersonalInformation.screen';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.PaymentAward'
>;
type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.PaymentAward'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

interface RootParams {
  data: GetChallengeDetailQuery;
  award_index: number;
  award_id: string;
  rootNavigation: ChallengeDescriptionNavigationProp;
  category_id?: string;
  category_index?: number;
  is_retry?: boolean;
  calculate_freight_quote_value?: number;
  firstElementId?: string;
  hasOptions?: boolean;
  has_subscription?: boolean;
  extraordinaryActions?: UserEventExtraordinaryActionType;
}
interface SelectMethodProps extends RootParams {
  has_address: boolean;
  challenge_withdrawal_address_id?: string;
}
interface PaymentInformations extends SelectMethodProps {
  payment_method: 'credit_card' | 'boleto' | 'pix';
  selected_card?: Card;
}

interface InstallmentsProps {
  installments_quantity: number;
  total_amount: number;
  installment_value: number;
}

export interface ConfirmationProps extends RootParams {
  payment_method: 'credit_card' | 'boleto';
  selected_card?: Card;
  installments: InstallmentsProps;
  challenge_withdrawal_address_id?: string;
}

export type PaymentAwardRootParamList = {
  selectOptions: RootParams;
  selectMethod: SelectMethodProps;
  selectAddress: RootParams;
  legalRegisterNumber: SelectMethodProps;
  personalInformation: SelectMethodProps;
  phoneNumber: RootParams;
  createCard: RootParams;
  shippingCoast: SelectMethodProps;
  confirmation: ConfirmationProps;
  addPhoneNumber: SelectMethodProps;
  selectInstallments: PaymentInformations;
  addLegalRegisterNumber: SelectMethodProps;
  selectMode: RootParams;
  billingAddress: RootParams;
};

const AppStack = createStackNavigator<PaymentAwardRootParamList>();

export default function PaymentAward({
  route,
  navigation,
}: Props): JSX.Element {
  const { data, award_index } = route.params;
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
        animationEnabled: true,
      }}
      initialRouteName={
        data.getChallengeDetail.products &&
        data.getChallengeDetail.products.length > 0
          ? 'selectOptions'
          : data?.getChallengeDetail.has_categories
          ? 'selectMode'
          : 'selectAddress'
      }
    >
      <AppStack.Screen
        name="selectOptions"
        component={SelectOptions}
        options={{
          gestureEnabled: false,
        }}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="addLegalRegisterNumber"
        component={AddLegalRegisterNumber}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="addPhoneNumber"
        component={AddPhoneNumber}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="selectAddress"
        component={SelectAddress}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
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
      <AppStack.Screen
        name="shippingCoast"
        component={ShippingCoast}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
      <AppStack.Screen
        name="selectMode"
        component={SelectMode}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="billingAddress"
        component={BillingAddress}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="personalInformation"
        component={PersonalInformation}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
    </AppStack.Navigator>
  );
}
