import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Notifications from './screens/Settings.Notifications';
import AllSettings from './screens/AllSettings';
import BankSettings from './screens/BankSettings';

const AppStack = createStackNavigator();

export default function Settings(): JSX.Element {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'pop',
        animationEnabled: true,
      }}
      mode="modal"
      headerMode="screen"
      initialRouteName="AllSettings"
    >
      <AppStack.Screen name="AllSettings" component={AllSettings} />
      <AppStack.Screen name="BankSettings" component={BankSettings} />
      <AppStack.Screen name="Settings.Notification" component={Notifications} />
      <AppStack.Screen name="Detailed" component={AllSettings} />
    </AppStack.Navigator>
  );
}
