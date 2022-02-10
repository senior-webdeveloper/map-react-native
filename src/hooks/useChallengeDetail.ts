import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useGetChallengeDetailQuery } from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks/useUserToken';

export default function useChallengeDetail({ challenge_id }) {
  const { profileID } = useUserToken();
  const [data, setData] = useState({ current: null });
  const { loading } = useGetChallengeDetailQuery({
    variables: {
      data: {
        id: challenge_id,
        profile_id: profileID,
      },
    },
    fetchPolicy: 'network-only',
    partialRefetch: true,

    onError: (e) => Alert.alert('ERRO: ', e.message),
    onCompleted: (e) => {
      setData({ current: e });
      // getActivitiesLazy();
    },
  });

  return { data, loading };
}
