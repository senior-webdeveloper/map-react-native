import React from 'react';
// import AppleHealthKit from 'rn-apple-healthkit';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthObserver,
  HealthInputOptions,
} from 'react-native-health';
import { Platform } from 'react-native';
import { isPast } from 'date-fns';
import * as Sentry from '@sentry/react-native';
import { isArray } from 'lodash';
import base64 from 'react-native-base64';
import {
  useChangeHealthConnectionsMutation,
  useCreateActivityV2Mutation,
  useGetUserDataCompiledQuery,
} from '~/graphql/autogenerate/hooks';
import { useStoreActions } from '~/store';
import { useAppleHealthQueue } from '.';
import { getThirtyDays } from '~/helpers/getLatestThirtyDays';
import { dbActivities, IAppleHealthActivitiesSchema } from '~/db';

type statusType = 'NotDetermined' | 'SharingDenied' | 'SharingAuthorized';

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.DistanceCycling],
    write: [AppleHealthKit.Constants.Permissions.DistanceCycling],
  },
} as HealthKitPermissions;

export function useAppleHealthActivities(): {
  getActivities?: () => Promise<void>;
  loading?: boolean;
  error?: string;
  success?: boolean;
  connected?: boolean;
} {
  const { loading: loadingPayload, saveMonitorLocal } = useAppleHealthQueue();
  const days = getThirtyDays();
  const setQueue = useStoreActions(
    (actions) => actions.appleHealthQueue.setQueue,
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [connected, setCnnected] = React.useState<boolean>();
  const [createActivityMutation] = useCreateActivityV2Mutation({
    onCompleted: () => setSuccess(true),
  });
  const { data } = useGetUserDataCompiledQuery();

  async function getActivities(): Promise<void> {
    const realm = await dbActivities();

    AppleHealthKit.initHealthKit(permissions, async (err, resultsInitial) => {
      if (err) {
        Sentry.captureMessage(`error em iniciar o Apple Health: ${err} `);
        setLoading(false);
        return;
      }
      setCnnected(true);

      if (resultsInitial) {
        if (isArray(days) && days.length > 0) {
          for (const date of days) {
            const options = {
              // unit: 'meter', // optional; default 'meter'
              date, // optional; default now
              includeManuallyAdded: true, // optional: default true
            } as HealthInputOptions;
            AppleHealthKit.getDistanceCycling(options, (err, results) => {
              if (err) {
                Sentry.captureException(new Error(err));
              }
              if (results.value > 0) {
                const encodedId = base64.encode(
                  `${results.startDate}-${Math.floor(results.value) / 1000}`,
                );
                const currentActivitySaved = realm.objectForPrimaryKey<IAppleHealthActivitiesSchema>(
                  'AppleActivity',
                  encodedId,
                );

                if (currentActivitySaved) {
                  realm.write(() => {
                    currentActivitySaved.distance =
                      Math.floor(results.value) / 1000;
                  });
                } else {
                  realm.write(() => {
                    realm.create<IAppleHealthActivitiesSchema>(
                      'AppleActivity',
                      {
                        id: encodedId,
                        distance: Math.floor(results.value) / 1000,
                        endDate: results.endDate,
                        startDate: results.startDate,
                        send: false,
                      },
                    );
                  });
                }
              }
            });
          }
        }

        setTimeout(() => {
          saveMonitorLocal();
        }, 50);

        setLoading(false);
        setSuccess(true);
      }
    });
  }

  if (Platform.OS === 'ios') {
    return { getActivities, loading, success, connected };
  }
  const error = 'Somente IOS';
  return { error };
}
