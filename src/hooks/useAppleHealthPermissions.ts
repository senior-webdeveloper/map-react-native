import React, { useEffect } from 'react';
import AppleHealthKit from 'react-native-health';
import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import { useChangeHealthConnectionsMutation } from '~/graphql/autogenerate/hooks';

type status = 'NotDetermined' | 'SharingDenied' | 'SharingAuthorized';

export function useAppleHealthPermissions(): {
  getPermission?: () => void;
  loading?: boolean;
  error?: string;
  status?: status;
} {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [status, setRequiredStatus] = React.useState<status>();
  const [
    changeHealthConnectionsMutation,
  ] = useChangeHealthConnectionsMutation();

  async function getStatus(): Promise<status> {
    const response = await AppleHealthKit.authorizationStatusForType(
      'DistanceCycling',
    );
    setRequiredStatus(response);
    return response;
  }
  function getPermission(): void {
    const options = {
      permissions: {
        read: ['Height', 'Weight', 'DistanceCycling'],
        write: ['Height', 'Weight', 'DistanceCycling'],
      },
    };

    AppleHealthKit.initHealthKit(options, async (err, results) => {
      if (err) {
        setLoading(false);
        return;
      }

      if (results === 1) {
        setLoading(false);
      }
    });
  }
  const changeMutation = React.useCallback(async () => {
    const { data } = await changeHealthConnectionsMutation({
      variables: {
        data: {
          integrated_with_apple_health: status === 'SharingAuthorized',
        },
      },
    });
  }, [changeHealthConnectionsMutation, status]);
  React.useEffect(() => {
    changeMutation();
  }, [status]);
  React.useEffect(() => {
    getStatus();
  });
  if (Platform.OS === 'ios') {
    return { getPermission, loading, status };
  }

  return {
    getPermission: () => {},
    loading,
    status,
  };
}
