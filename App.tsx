import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import 'react-native-gesture-handler';
import codePush from 'react-native-code-push';
import { ApolloProvider } from '@apollo/client';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import { StoreProvider } from 'easy-peasy';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OneSignal from 'react-native-onesignal';
import { init } from '@sentry/react-native';
import { LogBox, useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { APP_ID, ENVIRONMENT } from '@env';
import { RecoilRoot } from 'recoil';
import store from '~/store';
import Routes from './src/routes';
import { useApolloLink } from '~/hooks';
import { darkTheme, lightTheme } from '~/global/themes';

const App: React.FC = () => {
  const routeNameRef = React.useRef('');
  console.disableYellowBox = true;
  const navigationRef = useNavigationContainerRef();
  LogBox.ignoreLogs([
    'Expected style',
    'You have mounted RecyclerListView',
    '^Require cycle',
    'Animated: `useNativeDriver`',
  ]);
  const colorScheme = useColorScheme();
  const { client } = useApolloLink();
  init({
    dsn: 'https://c076d785ffa843958c1503aa6abe5fec@o257193.ingest.sentry.io/5363883',
    environment: ENVIRONMENT,
  });

  React.useEffect(() => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(APP_ID);
  }, []);

  async function getOnStateChange() {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      console.log('previousRouteName: ', previousRouteName);
      console.log('currentRouteName: ', currentRouteName);
      await analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    }
    routeNameRef.current = currentRouteName;
  }

  return (
    <RecoilRoot>
      <ThemeProvider theme={colorScheme === 'light' ? lightTheme : darkTheme}>
        <ApolloProvider client={client}>
          <StoreProvider store={store}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                if (navigationRef.getCurrentRoute()) {
                  routeNameRef.current = navigationRef?.getCurrentRoute().name;
                }
              }}
              onStateChange={getOnStateChange}
            >
              <SafeAreaProvider>
                <Routes />
              </SafeAreaProvider>
            </NavigationContainer>
          </StoreProvider>
        </ApolloProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default codePush(App);
