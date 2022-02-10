import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import StepFive from './steps/StepFive';
import StepFour from './steps/StepFour';
import StepOne from './steps/StepOne';
import StepThree from './steps/StepThree';
import StepTwo from './steps/StepTwo';

export type RootStackEmailSignupParamList = {
  StepOne: undefined;
  StepTwo: { email: string };
  StepThree: { email: string };
  StepFour: { email: string; phone: string };
  StepFive: { email: string; phone: string };
};

const AppStack = createStackNavigator<RootStackEmailSignupParamList>();

export default function UserEmailSignup(): JSX.Element {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'pop',
        animationEnabled: true,
      }}
      mode="modal"
      headerMode="screen"
      initialRouteName="StepOne"
    >
      <AppStack.Screen name="StepOne" component={StepOne} />
      <AppStack.Screen name="StepTwo" component={StepTwo} />
      <AppStack.Screen name="StepThree" component={StepThree} />
      <AppStack.Screen name="StepFour" component={StepFour} />
      <AppStack.Screen name="StepFive" component={StepFive} />
    </AppStack.Navigator>
  );
}
