import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { User } from '~/graphql/autogenerate/schemas';
import { useGetProfileLazyQuery } from '~/graphql/autogenerate/hooks';
import { GetProfileQuery } from '~/graphql/autogenerate/operations';

interface ResponseProps {
  userID: string;
  profileID: string;
  acesstoken: string;
  refreshtoken: string;
  expiresDate: string;
  userinfo?: User;
  profile: GetProfileQuery | undefined;
}

export function useUserToken(): ResponseProps {
  const [userID, setUserID] = useState<string>('');
  const [profileID, setProfileID] = useState<string>('');
  const [acesstoken, setAcessToken] = useState<string>('');
  const [refreshtoken, setRefreshToken] = useState<string>('');
  const [expiresDate, setExpiresDate] = useState<string>('');
  const [userinfo, setUserInfo] = useState<User>();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (userinfo) {
      hasFetched.current = true;
    }
  }, [userinfo]);

  const getData = async () => {
    const userIdAsync = await AsyncStorage.getItem('@riderize::user_id');

    const accessTokenAsync = await AsyncStorage.getItem(
      `@riderize::${userIdAsync}:acesstoken:`,
    );

    const refreshTokenAsync = await AsyncStorage.getItem(
      `@riderize::${userIdAsync}:refreshtoken:`,
    );

    const profileIdAsync = await AsyncStorage.getItem(
      `@riderize::${userIdAsync}:profileid:`,
    );

    const userInfoAsync = await AsyncStorage.getItem(
      `@riderize::${userIdAsync}:userinfo:`,
    );

    if (
      accessTokenAsync &&
      refreshTokenAsync &&
      userIdAsync &&
      profileIdAsync
    ) {
      setAcessToken(accessTokenAsync);
      setRefreshToken(refreshTokenAsync);
      setUserID(userIdAsync);
      setProfileID(profileIdAsync);
      if (userInfoAsync) setUserInfo(JSON.parse(userInfoAsync));
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return {
    userID,
    profileID,
    acesstoken,
    refreshtoken,
    userinfo,
    expiresDate,
  };
}
