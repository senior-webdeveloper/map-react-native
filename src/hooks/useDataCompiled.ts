import React from 'react';
import { useGetUserDataCompiledLazyQuery } from '~/graphql/autogenerate/hooks';
import { useStoreActions, useStoreState } from '~/store';

export function useDataCompiled() {
  const setUserDataCompiled = useStoreActions(
    (action) => action.userInfoCompiled.saveUserInfo,
  );

  const [fetch, { data, loading, refetch }] = useGetUserDataCompiledLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted: (e) => {
      console.log(
        'integrado com strava? ',
        e.getUserDataCompiled.data_compiled.integrated_with_strava,
      );
      setUserDataCompiled(e.getUserDataCompiled.data_compiled);
    },
  });

  return { data, payload: data, fetch, refetch, loading };
}
