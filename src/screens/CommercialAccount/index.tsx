import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Carousel from './Carrousel';
import RegisterCommercial from './RegisterCommercial';

const AppStack = createStackNavigator();

export default function CommercialAccount(): JSX.Element {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'pop',
        animationEnabled: true,
      }}
      mode="modal"
      headerMode="screen"
      initialRouteName="RegisterCommercial"
    >
      <AppStack.Screen name="Carousel" component={Carousel} />
      <AppStack.Screen
        name="RegisterCommercial"
        component={RegisterCommercial}
      />
    </AppStack.Navigator>
  );
}
