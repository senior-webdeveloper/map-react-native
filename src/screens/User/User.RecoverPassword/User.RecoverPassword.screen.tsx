import { RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '~/routes';
import StepOne from './steps/RecoverPassword.StepOne';
import StepThree from './steps/RecoverPassword.StepThree';
import StepTwo from './steps/RecoverPassword.StepTwo';

type UserType = {
  email: string;
  name: string;
  phone: string;
  avatar: string;
};

type SelectedMethod = 'email' | 'phone';

export type RootStackRecoverPasswordParamList = {
  'RecoverPassword.StepOne': UserType;
  'RecoverPassword.StepTwo': { user: UserType; selectedMethod: SelectedMethod };
  'RecoverPassword.StepThree': UserType;
};
type StepTwoNavigationProp = RouteProp<
  RootStackParamList,
  'User.RecoverPassword'
>;
type Props = {
  route: StepTwoNavigationProp;
};
const AppStack = createStackNavigator<RootStackRecoverPasswordParamList>();

const UserRecoverPassword: React.FC<Props> = ({ route }) => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'pop',
        animationEnabled: true,
      }}
      mode="modal"
      headerMode="screen"
      initialRouteName="RecoverPassword.StepOne"
    >
      <AppStack.Screen
        name="RecoverPassword.StepOne"
        component={StepOne}
        initialParams={route.params}
      />
      <AppStack.Screen
        name="RecoverPassword.StepTwo"
        component={StepTwo}
        initialParams={{ user: route.params, selectedMethod: 'phone' }}
      />
      <AppStack.Screen
        name="RecoverPassword.StepThree"
        component={StepThree}
        initialParams={route.params}
      />
    </AppStack.Navigator>
  );
};
export default UserRecoverPassword;
