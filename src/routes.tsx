import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import React, { memo, useCallback, useRef } from 'react';
import SplashScreen from 'react-native-splash-screen';
import branch from 'react-native-branch';
import codePush from 'react-native-code-push';
import { captureException } from '@sentry/react-native';
import Home from './screens/Home';
import Login from './screens/Login';
import CommercialAccount from './screens/CommercialAccount';
import { RootStackParamList, RoutesInterface } from '~/routes.types';

import { awardsRoutes } from '~/screens/Awards/Awards.routes';
import { activityRoutes } from '~/screens/Activity/Activity.routes';
import { challengeRoutes } from '~/screens/Challenge/Challenge.routes';
import { permissionsRoutes } from '~/screens/Permissions/Permissions.routes';
import { userRoutes } from '~/screens/User/User.routes';
import { productsRoutes } from '~/screens/Products/Products.routes';
import { staffRoutes } from '~/screens/Staff/Staff.routes';

import Playground from '~/screens/Playground/Playground.screen';
import CustomPlayground from '~/Playground';

const AppStack = createStackNavigator<RootStackParamList>();

export default function Routes(): JSX.Element {
  const hasToken = useRef(false);
  const hasRefreshToken = useRef(false);
  const [loading, setLoading] = React.useState(false);
  const [animationLoading, setAnimationLoading] = React.useState(false);

  const getData = useCallback(async () => {
    try {
      const userIDAsyncStorage = await AsyncStorage.getItem(
        '@riderize::user_id',
      );

      const universalToken = await AsyncStorage.getItem(
        `@riderize::${userIDAsyncStorage}:acesstoken:`,
      );

      const universalRefreshToken = await AsyncStorage.getItem(
        `@riderize::${userIDAsyncStorage}:refreshtoken:`,
      );

      if (universalToken && userIDAsyncStorage && universalRefreshToken) {
        hasToken.current = true;
        hasRefreshToken.current = true;
        setLoading(true);
      } else if (animationLoading) {
        hasToken.current = false;
        hasRefreshToken.current = false;
        setLoading(true);
      }
      await codePush.sync({
        installMode: codePush.InstallMode.ON_NEXT_RESUME,
        mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
      });
      SplashScreen.hide();
    } catch (e) {
      captureException(e);
    }
  }, [animationLoading]);

  React.useEffect(() => {
    if (animationLoading) {
      getData();
    }
  }, [animationLoading, getData]);

  React.useEffect(() => {
    const handleLinkBranch = async () => {
      const lastParams = await branch.getLatestReferringParams();
      if (lastParams) {
        setAnimationLoading(true);
        getData();
      }
    };
    handleLinkBranch();
  }, [getData]);

  function Router({
    name,
    component,
    initialParams,
    options,
  }: RoutesInterface) {
    return (
      <AppStack.Screen
        key={name}
        name={name}
        component={memo(component)}
        initialParams={initialParams}
        options={options}
      />
    );
  }

  return (
    <>
      {loading && (
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
          }}
          initialRouteName={
            !hasToken.current && !hasRefreshToken.current ? 'Login' : 'Home'
          }
        >
          <AppStack.Screen
            name="CustomPlayground"
            component={CustomPlayground}
          />
          <AppStack.Screen name="Playground" component={Playground} />
          {/* Products Routes */}
          {productsRoutes.map(Router)}

          {/* Awards Routes: */}
          {awardsRoutes.map(Router)}

          {/* Activities Routes: */}
          {activityRoutes.map(Router)}

          {/* Challenge Routes: */}
          {challengeRoutes.map(Router)}

          {/* User Routes: */}
          {userRoutes.map(Router)}

          {/* Permissions Routes: */}
          {permissionsRoutes.map(Router)}

          {/* Staff Routes: */}
          {staffRoutes.map(Router)}

          {/* Common Routes: */}
          <AppStack.Screen
            name="Home"
            component={Home}
            initialParams={{ accepted_initial_screen: false }}
          />
          <AppStack.Screen name="Login" component={Login} />
          <AppStack.Screen
            name="CommercialAccount"
            component={CommercialAccount}
          />
        </AppStack.Navigator>
      )}
    </>
  );
}
