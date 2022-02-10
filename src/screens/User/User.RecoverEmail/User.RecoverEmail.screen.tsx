import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import StepOne from './steps/RecoverEmail.StepOne';
import StepThree from './steps/RecoverEmail.StepThree';
import StepTwo from './steps/RecoverEmail.StepTwo';

type UserType = {
  email: string;
  firstname: string;
  lastname: string;
  avatar: string;
};

export type RootStackEmailRecoverParamList = {
  'RecoverEmail.StepOne': undefined;
  'RecoverEmail.StepTwo': { phone: string; user: UserType };
  'RecoverEmail.StepThree': { phone: string; user: UserType };
};

const AppStack = createStackNavigator<RootStackEmailRecoverParamList>();

export default function UserRecoverEmail(): JSX.Element {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'pop',
        animationEnabled: true,
      }}
      mode="modal"
      headerMode="screen"
      initialRouteName="RecoverEmail.StepOne"
    >
      <AppStack.Screen name="RecoverEmail.StepOne" component={StepOne} />
      <AppStack.Screen name="RecoverEmail.StepTwo" component={StepTwo} />
      <AppStack.Screen name="RecoverEmail.StepThree" component={StepThree} />
    </AppStack.Navigator>
  );
}
