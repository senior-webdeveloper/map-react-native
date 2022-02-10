import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useStoreActions, useStoreState } from '~/store';
import {
  useGetProfileLazyQuery,
  useGetUserDataCompiledLazyQuery,
} from '~/graphql/autogenerate/hooks';
import { dbCLient, IProfileSchema, IUserSchema } from '~/db';
import { Profile, User } from '~/graphql/autogenerate/schemas';
import { useUserToken } from './useUserToken';

function useLocalProfile() {
  const { profileID } = useUserToken();
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  const handleRealmSaveProfile = async (data: Profile) => {
    const userIdAsync = await AsyncStorage.getItem('@riderize::user_id');

    if (userIdAsync) {
      const userLocal = realmUser.objectForPrimaryKey<IUserSchema>(
        'User',
        userIdAsync,
      );
    }
    if (userLocal) {
      // realm.write(() => {
      // });
    } else {
      realmUser.write(() => {
        realmUser.create<IUserSchema>('User', {
          ...data.user,
          profile: data,
        });
      });
    }

    realmUser.close();
  };

  const [getProfile] = useGetProfileLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted: (e) => {
      handleRealmSaveProfile(e.getProfile);
    },
  });
  // const [fetch] = useGetUserDataCompiledLazyQuery({
  //   onCompleted: (e) => {
  //     handleRealmSaveProfile(e.getUserDataCompiled.data_compiled);
  //     setLoadingProfile(false);
  //   },
  // });

  const handleRealmLocalData = async () => {
    const realmProfile = await dbCLient();
    const userIdAsync = await AsyncStorage.getItem('@riderize::user_id');

    if (userIdAsync) {
      const userLocal = realmProfile.objectForPrimaryKey<IUserSchema>(
        'User',
        userIdAsync,
      );
    }

    realmProfile.close();
  };

  useEffect(() => {
    handleRealmLocalData();
    getProfile({
      variables: {
        data: {
          profile_id_accessed: profileID,
          profile_id_requesting: profileID,
        },
      },
    });
    // fetch();
  }, []);

  return { loadingProfile };
}

export { useLocalProfile };
