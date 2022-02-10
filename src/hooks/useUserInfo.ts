import React, { useCallback, useEffect, useRef } from 'react';
import { ApolloError, QueryLazyOptions } from '@apollo/client';
import { useGetProfileLazyQuery } from '~/graphql/autogenerate/hooks';
import { GetProfileQuery } from '~/graphql/autogenerate/operations';
import { useUserToken } from './useUserToken';
import { Exact, GetProfileDetailInput } from '~/graphql/autogenerate/schemas';
import { useStoreActions, useStoreState } from '~/store';

interface ResponseProps {
  data?: GetProfileQuery;
  loading: boolean;
  error?: ApolloError;
  refetch: (
    options?:
      | QueryLazyOptions<Exact<{ data: GetProfileDetailInput }>>
      | undefined,
  ) => void;
}

export function useUserInfo(): ResponseProps {
  const hasFetched = useRef(false);
  const userProfile = useStoreState((state) => state.profile.payload);
  const setUserProfile = useStoreActions(
    (actions) => actions.profile.saveUserInfo,
  );
  const { profileID } = useUserToken();
  const [
    fetchProfile,
    { data, loading, error, refetch },
  ] = useGetProfileLazyQuery();

  useEffect(() => {
    if (data) {
      setUserProfile(data);
    }
  }, [data]);

  useEffect(() => {
    if (
      profileID &&
      profileID.length > 0 &&
      !data?.getProfile &&
      !userProfile &&
      !hasFetched.current
    ) {
      hasFetched.current = true;
      fetchProfile({
        variables: {
          data: {
            profile_id_accessed: profileID,
            profile_id_requesting: profileID,
          },
        },
      });
    }
  }, [data?.getProfile, fetchProfile, profileID, userProfile]);

  return { data, loading, error, refetch };
}
