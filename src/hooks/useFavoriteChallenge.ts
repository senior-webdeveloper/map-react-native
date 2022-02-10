import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import {
  Mutation,
  MutationAddfavoriteChallengeArgs,
  MutationDeleteFavoriteChallengeArgs,
} from '~/generated/graphql';
import { useUserToken } from './useUserToken';

const FAVORITE_CHALLENGE = gql`
  mutation addfavoriteChallenge($data: FavoriteUserChallengeInput!) {
    addfavoriteChallenge(data: $data) {
      challenge_id
    }
  }
`;
interface IFavoritePayload {
  addfavoriteChallenge: Mutation['addfavoriteChallenge'];
}

const UNFAVORITE_CHALLENGE = gql`
  mutation deleteFavoriteChallenge($data: FavoriteUserChallengeInput!) {
    deleteFavoriteChallenge(data: $data)
  }
`;
interface IUnFavoritePayload {
  deleteFavoriteChallenge: Mutation['deleteFavoriteChallenge'];
}

export function useFavoriteChallenge(): (
  challenge_id: string,
  isFavorite: boolean,
) => Promise<void> {
  const [favoriteChallenge] = useMutation<
    IFavoritePayload,
    MutationAddfavoriteChallengeArgs
  >(FAVORITE_CHALLENGE, {
    onError: (e) => Alert.alert(`Error`, e.message),
  });
  const { profileID } = useUserToken();
  const [unfavoriteChallenge] = useMutation<
    IUnFavoritePayload,
    MutationDeleteFavoriteChallengeArgs
  >(UNFAVORITE_CHALLENGE, {
    onError: (e) => Alert.alert(`Error`, e.message),
  });
  async function makeFavorite(challenge_id: string, isFavorite: boolean) {
    if (!isFavorite) {
      const response = await favoriteChallenge({
        variables: {
          data: {
            challenge_id,
            profile_id: profileID,
          },
        },
      });
    } else {
      const response = await unfavoriteChallenge({
        variables: {
          data: {
            challenge_id,
            profile_id: profileID,
          },
        },
      });
    }
  }
  return makeFavorite;
}
