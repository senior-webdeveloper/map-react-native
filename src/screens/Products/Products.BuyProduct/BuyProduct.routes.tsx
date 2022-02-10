import React, { useEffect } from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import { RootStackParamList } from '~/routes.types';
import { Card } from '~/graphql/autogenerate/schemas';

import SelectOptions from './screens/BuyProduct.SelectOptions.screen';
import SelectAddress from './screens/BuyProduct.SelectAddress.screen';
import SelectMethod from './screens/BuyProduct.SelectMethod.screen';
import SelectInstallments from './screens/BuyProduct.SelectInstallments.screen';
import Confirmation from './screens/BuyProduct.Confirmation.screen';
import ShippingCoast from './screens/BuyProduct.ShippingCoast.screen';
import BillingAddress from './screens/BuyProduct.BillingAddress.screen';
import AddPhoneNumber from '~/screens/Products/Products.BuyProduct/screens/BuyProduct.AddPhoneNumber.screen';
import { useUserInfo } from '~/hooks';
import PersonalInformation from './screens/BuyProduct.PersonalInformation.screen';

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

interface ConfirmationProps extends RootParams {
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
  const { data } = route.params;
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
      initialRouteName="selectOptions"
    >
      <AppStack.Screen
        name="selectOptions"
        component={(props) => <SelectOptions {...props} />}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
        options={{
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name="selectAddress"
        component={(props) => <SelectAddress {...props} />}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
      <AppStack.Screen
        name="addPhoneNumber"
        component={(props) => <AddPhoneNumber {...props} />}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
      <AppStack.Screen
        name="selectMethod"
        component={(props) => <SelectMethod {...props} />}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
      <AppStack.Screen
        name="selectInstallments"
        component={(props) => <SelectInstallments {...props} />}
        initialParams={{
          rootNavigation: navigation,
          ...route.params,
        }}
      />
      <AppStack.Screen
        name="confirmation"
        component={(props) => <Confirmation {...props} />}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
      <AppStack.Screen
        name="shippingCoast"
        component={(props) => <ShippingCoast {...props} />}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
      <AppStack.Screen
        name="billingAddress"
        component={(props) => <BillingAddress {...props} />}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />

      <AppStack.Screen
        name="personalInformation"
        component={(props) => <PersonalInformation {...props} />}
        initialParams={{
          ...route.params,
          rootNavigation: navigation,
        }}
      />
    </AppStack.Navigator>
  );
}
