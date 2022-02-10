import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, UIManager } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-simple-toast';
import { useSetRecoilState } from 'recoil';
import { RootStackParamList } from '~/routes.types';
import { useUserToken, useOfflineChallenge } from '~/hooks';
import { useGetChallengeDetailLazyQuery } from '~/graphql/autogenerate/hooks';
import LoadingChallenge from '~/screens/Challenge/Challenge.Description/components/LoadingChallenge';
import MainComponent from './components/MainScreen';
import { useStoreState } from '~/store';
import { selectedAwardAtom } from '~/screens/Challenge/Challenge.Description/components/ModalizeComponent';

type ChallengeDescriptionRouteProp = RouteProp<
  RootStackParamList,
  'Challenge.Description'
>;

type ChallengeDescriptionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Challenge.Description'
>;

type Props = {
  route: ChallengeDescriptionRouteProp;
  navigation: ChallengeDescriptionNavigationProp;
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function Detailed({ route, navigation }: Props): JSX.Element {
  const setUserSubscribed = useSetRecoilState(selectedAwardAtom);
  const [customData, setData] = useState();
  const networkIsConnected = useStoreState(
    (state) => state.network.isConnected,
  );
  const { profileID } = useUserToken();
  const id = useRef(route.params.challenge_id);
  const { exploreChallenges, handleRealmSaveDashboard } = useOfflineChallenge(
    route.params.challenge_id,
  );

  const hasFetched = useRef(false);

  const [fetch, { data, loading }] = useGetChallengeDetailLazyQuery({
    fetchPolicy: 'no-cache',
    onError: (e) => console.log(e.message),
  });

  useEffect(() => {
    setUserSubscribed(undefined);
  }, []);

  useEffect(() => {
    if (data) {
      handleRealmSaveDashboard(data);
    }
  }, [data]);

  const variables = useMemo(() => {
    return {
      data: {
        id: id.current,
        profile_id: profileID,
      },
    };
  }, [profileID, route.params.challenge_id]);

  const memoizedCallback = useCallback(() => {
    if (
      id.current &&
      profileID.length > 0 &&
      !data?.getChallengeDetail &&
      networkIsConnected
    ) {
      fetch({
        variables,
      });
      console.log('variables: ', variables);
    }
  }, [variables, networkIsConnected]);

  useEffect(() => {
    if (!hasFetched.current && profileID) {
      hasFetched.current = true;
      memoizedCallback();
    }
  }, [memoizedCallback, profileID]);

  useEffect(() => {
    if (exploreChallenges && !data && !networkIsConnected) {
      setData(exploreChallenges);
      Toast.show(
        'Você está offline. Alguns dados podem estar desatualizados.',
        Toast.LONG,
      );
    } else if (data) {
      setData(data);
    }
  }, [networkIsConnected, exploreChallenges, data]);

  if (!customData) return <LoadingChallenge navigation={navigation} />;

  const Main = memo(
    (props) => <MainComponent {...props} />,
    (prevProps, nextProps) => prevProps !== nextProps,
  );

  return (
    <Main
      key="main"
      challenge_id={route.params.challenge_id}
      navigation={navigation}
      data={customData}
    />
  );
}

export default memo(
  Detailed,
  (prevProps, nextProps) => prevProps !== nextProps,
);
