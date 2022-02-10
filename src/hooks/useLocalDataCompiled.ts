import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { captureMessage } from '@sentry/react-native';
import { useStoreActions, useStoreState } from '~/store';
import {
  useGetProfileLazyQuery,
  useGetUserDataCompiledLazyQuery,
} from '~/graphql/autogenerate/hooks';
import { dbCLient, IDataCompiledSchema, IUserSchema } from '~/db';
import { DataCompiled, Profile } from '~/graphql/autogenerate/schemas';
import { useUserToken } from '.';
import { GetProfileQuery } from '~/graphql/autogenerate/operations';

function useLocalDataCompiled(): {
  compiledDataLocal: DataCompiled | undefined;
  localLoading: boolean;
  profileData: GetProfileQuery | undefined;
} {
  const hasFetched = useRef(false);
  const { profileID, userID } = useUserToken();
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const saveData = useStoreActions(
    (actions) => actions.compiledData.saveDataCompiled,
  );
  const compiledDataLocal = useStoreState(
    (state) => state.compiledData.dataCompiled,
  );
  const setUserProfile = useStoreActions(
    (actions) => actions.profile.saveUserInfo,
  );

  const handleRealmSaveProfile = async (data: Profile) => {
    try {
      const realmUser = await dbCLient();

      // const userIdAsync = await AsyncStorage.getItem('@riderize::user_id');

      if (userID) {
        const userLocal = realmUser.objectForPrimaryKey<IUserSchema>(
          'User',
          userID,
        );

        if (userLocal) {
          realmUser.write(() => {
            userLocal.profile.description = data.description
              ? data.description
              : '';
            userLocal.profile.followers_count = data.followers_count
              ? data.followers_count
              : 0;
            userLocal.profile.following_count = data.following_count
              ? data.following_count
              : 0;
            userLocal.profile.is_follower = data.is_follower;
            userLocal.profile.official = data.official ?? false;
            userLocal.profile.profile_avatar = data.profile_avatar ?? '';
            userLocal.profile.profile_cover = data.profile_cover ?? '';
            userLocal.profile.user_id = data.user_id ?? '';
            userLocal.profile.username = data.username ?? '';
            userLocal.firstname = data.user.firstname ?? '';
            userLocal.lastname = data.user.lastname ?? '';
            userLocal.email = data.user.email ?? '';
            userLocal.activities_count = data.user.activities_count ?? 0;
            userLocal.address_line_one = data.user.address_line_one ?? '';
            userLocal.address_line_two = data.user.address_line_two ?? '';
            userLocal.date_of_birth = data.user.date_of_birth
              ? data.user.date_of_birth
              : '';
            userLocal.gender = data.user.gender ?? '';
            userLocal.has_social_login = data.user.has_social_login;
            userLocal.legal_registry_number =
              data.user.legal_registry_number ?? '';
            userLocal.phone = data.user.phone ?? '';
            userLocal.staff = data.user.staff;
            userLocal.stature = data.user.stature ?? 0;
            userLocal.street_number = data.user.street_number ?? '';
            userLocal.weight = data.user.weight ?? 0;
            userLocal.zip_code = data.user.zip_code ?? '';
            userLocal.blacklist = data.user.blacklist;
            userLocal.team_name = data.user.team_name;
          });
        } else {
          realmUser.write(() => {
            realmUser.create<IUserSchema>('User', {
              id: data.user.id,
              activities_count: data.user.activities_count
                ? data.user.activities_count
                : 0,
              address_line_one: data.user.address_line_one
                ? data.user.address_line_one
                : '',
              address_line_two: data.user.address_line_two
                ? data.user.address_line_two
                : '',
              blacklist: data.user.blacklist,
              email: data.user.email ? data.user.email : '',
              firstname: data.user.firstname ? data.user.firstname : '',
              gender: data.user.gender ? data.user.gender : '',
              lastname: data.user.lastname ? data.user.lastname : '',
              name: data.user.name ? data.user.name : '',
              phone: data.user.phone ? data.user.phone : '',
              staff: data.user.staff ? data.user.staff : false,
              stature: data.user.stature ? data.user.stature : 0,
              street_number: data.user.street_number
                ? data.user.street_number
                : '',
              weight: data.user.weight ? data.user.weight : 0,
              zip_code: data.user.zip_code ? data.user.zip_code : '',
              team_name: data.user.team_name ? data.user.team_name : '',
              has_social_login: data.user.has_social_login ?? false,
              city_id: data.user.city_id ?? '',
              active: data.user.active ?? true,
              date_of_birth: data.user.date_of_birth
                ? data.user.date_of_birth
                : '',
              legal_registry_number: data.user.legal_registry_number
                ? data.user.legal_registry_number
                : '',
              strava_permission_activities:
                data.user.strava_permission_activities ?? false,
              profile: { ...data, company_id: data.company_id ?? '' },
            });
          });
        }
        setLocalLoading(false);
        return;
      }
      setLocalLoading(false);
    } catch (error) {
      setLocalLoading(false);
    }
    setLocalLoading(false);

    // realmUser.close();
  };
  const [getProfile, { data: profileData }] = useGetProfileLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted: (e) => {
      setUserProfile(e);
      handleRealmSaveProfile(e.getProfile);
    },
  });

  useEffect(() => {
    if (profileData) {
      setUserProfile(profileData);
      handleRealmSaveProfile(profileData.getProfile);
    }
  }, [profileData]);

  const handleRealmSaveCompiledData = async (data: DataCompiled) => {
    try {
      const realm = await dbCLient();
      saveData({ ...data });
      const userIdAsync = await AsyncStorage.getItem('@riderize::user_id');

      const compiledData = realm.objectForPrimaryKey<IDataCompiledSchema>(
        'CompiledData',
        data._id,
      );
      if (compiledData) {
        realm.write(() => {
          compiledData.hasCompany = data.has_company;
          compiledData.integratedWithAppleHealth =
            data.integrated_with_apple_health;
          compiledData.integratedWithGarmin = data.integrated_with_garmin;
          compiledData.integratedWithPolar = data.integrated_with_polar;
          compiledData.integratedWithStravaCrawler =
            data.integrated_with_strava_crawler ?? false;
          compiledData.lastAppVersionUsed = data.last_app_version_used;
          compiledData.viewWelcomeScreen = data.view_welcome_screen;
          compiledData.verifiedPhone = data.verified_phone ?? false;
          compiledData.userId = data.user_id;
          compiledData.lastDeviceUsed = data.last_device_used;
          compiledData.lastPlatformUsed = data.last_platform_used;
          compiledData.lastTimeUsed = data.last_time_used;
          compiledData.integratedWithStrava = data.integrated_with_strava;
        });
      } else {
        realm.write(() => {
          realm.create<IDataCompiledSchema>('CompiledData', {
            _id: data._id,
            hasCompany: data.has_company,
            integratedWithAppleHealth: data.integrated_with_apple_health,
            integratedWithGarmin: data.integrated_with_garmin,
            integratedWithPolar: data.integrated_with_polar,
            integratedWithStravaCrawler:
              data.integrated_with_strava_crawler ?? false,
            lastAppVersionUsed: data.last_app_version_used,
            viewWelcomeScreen: data.view_welcome_screen,
            verifiedPhone: data.verified_phone ?? false,
            userId: data.user_id,
            lastDeviceUsed: data.last_device_used,
            lastPlatformUsed: data.last_platform_used,
            lastTimeUsed: data.last_time_used,
            lastUploadAppleHealth: data.last_upload_apple_health,
            integratedWithStrava: data.integrated_with_strava,
          });
        });
      }
      if (userIdAsync) {
        const userLocal = realm.objectForPrimaryKey<IUserSchema>(
          'User',
          userIdAsync,
        );
        if (userLocal) {
          setLocalLoading(false);
          return;
        }
      }
      if (data.view_welcome_screen === true) {
        // realm.close();
      }
    } catch (error) {
      setLocalLoading(false);
    }
  };
  const [fetch] = useGetUserDataCompiledLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted: (e) => {
      handleRealmSaveCompiledData(e.getUserDataCompiled.data_compiled);
    },
  });

  // Trata dos dados locais
  const handleRealmLocalData = useCallback(async () => {
    const realm = await dbCLient();
    const userIdAsync = await AsyncStorage.getItem('@riderize::user_id');

    if (userIdAsync) {
      const userLocal = realm.objectForPrimaryKey<IUserSchema>(
        'User',
        userIdAsync,
      );

      if (userLocal) {
        setUserProfile({
          getProfile: {
            description: userLocal.profile?.description,
            followers_count: userLocal.profile?.followers_count ?? 0,
            following_count: userLocal.profile?.following_count ?? 0,
            id: userLocal.profile?.id ?? '',
            is_follower: userLocal.profile?.is_follower,
            official: userLocal.profile?.official ?? false,
            profile_avatar: userLocal.profile?.profile_avatar,
            profile_cover: userLocal.profile?.profile_cover,
            user_id: userLocal.profile?.user_id ?? '',
            username: userLocal.profile?.username ?? '',
            user: {
              firstname: userLocal.firstname,
              lastname: userLocal.lastname,
              email: userLocal.email,
              activities_count: userLocal.activities_count,
              address_line_one: userLocal.address_line_one,
              address_line_two: userLocal.address_line_two,
              date_of_birth: userLocal.date_of_birth,
              gender: userLocal.gender ?? '',
              has_social_login: userLocal.has_social_login,
              id: userLocal.id,
              legal_registry_number: userLocal.legal_registry_number,
              phone: userLocal.phone,
              staff: userLocal.staff,
              stature: userLocal.stature,
              street_number: userLocal.street_number,
              weight: userLocal.weight,
              zip_code: userLocal.zip_code,
              blacklist: userLocal.blacklist,
              team_name: userLocal.team_name,
            },
          },
        });
      }

      const compiledDataLocalStorage =
        realm.objects<IDataCompiledSchema>('CompiledData');

      const filteredLocalDataCompiled = compiledDataLocalStorage.filter(
        (el) => el.userId === userIdAsync,
      );

      if (filteredLocalDataCompiled && filteredLocalDataCompiled.length > 0) {
        const localCompiledData = filteredLocalDataCompiled[0];
        saveData({
          _id: localCompiledData._id,
          has_company: localCompiledData.hasCompany,
          integrated_with_apple_health:
            localCompiledData.integratedWithAppleHealth,
          integrated_with_garmin: localCompiledData.integratedWithGarmin,
          integrated_with_polar: localCompiledData.integratedWithPolar,
          integrated_with_strava_crawler:
            localCompiledData.integratedWithStravaCrawler ?? false,
          last_app_version_used: localCompiledData.lastAppVersionUsed,
          view_welcome_screen: localCompiledData.viewWelcomeScreen,
          verified_phone: localCompiledData.verifiedPhone ?? false,
          user_id: localCompiledData.userId,
          last_device_used: localCompiledData.lastDeviceUsed,
          last_platform_used: localCompiledData.lastPlatformUsed,
          last_time_used: localCompiledData.lastTimeUsed,
          last_upload_apple_health: localCompiledData.lastUploadAppleHealth,
          integrated_with_google_fit: false,
          integrated_with_strava:
            localCompiledData.integratedWithStrava ?? false,
        });
        setLocalLoading(false);
      }
    }
    // realm.close();
  }, []);

  useEffect(() => {
    handleRealmLocalData();

    if (!hasFetched.current) {
      if (profileID && profileID.length > 0) {
        console.log(
          '🚀 ~ file: useLocalDataCompiled.ts ~ line 306 ~ useEffect ~ hasFetched.current',
          { profile_id_accessed: profileID, profile_id_requesting: profileID },
        );
        fetch();
        getProfile({
          variables: {
            data: {
              profile_id_accessed: profileID,
              profile_id_requesting: profileID,
            },
          },
        });
      }
      // hasFetched.current = true;
    }
  }, [fetch, getProfile, handleRealmLocalData, profileID]);

  return { compiledDataLocal, localLoading, profileData };
}

export { useLocalDataCompiled };
