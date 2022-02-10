import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Maps from './screens/Maps/Maps.screen';
import { SaveMonitorActivity } from './screens/SaveActivity/Save.screen';

const AppStack = createStackNavigator();

export default function Monitor({ navigation }): JSX.Element {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Maps"
    >
      <AppStack.Screen
        name="Maps"
        component={Maps}
        initialParams={{ routeNavigation: navigation }}
      />
      <AppStack.Screen
        name="SaveActivity"
        component={SaveMonitorActivity}
        initialParams={{ routeNavigation: navigation }}
      />
    </AppStack.Navigator>
  );
}
