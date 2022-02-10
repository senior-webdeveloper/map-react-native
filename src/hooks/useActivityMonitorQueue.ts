import React, { useEffect, useRef, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import { captureMessage } from '@sentry/react-native';
import RNFS from 'react-native-fs';
import { Alert, Share } from 'react-native';
import { IMonitorSchema, dbMonitorQueue } from '~/db';
import { useStoreActions, useStoreState } from '~/store';
import {
  GetUserActivitiesDocument,
  useCreateMonitorActivityMutation,
} from '~/graphql/autogenerate/hooks';

export function useActivityMonitorQueue(): {
  saveMonitorLocal: () => Promise<void>;
  loading: boolean;
} {
  const lastUploadedActivity = useRef(0);
  const [loading, setLoading] = useState(false);
  const [createActivityMutation] = useCreateMonitorActivityMutation({
    onCompleted: (e) => console.log('Completou: ', e),
    onError: (e) => console.log('error: ', e.message),
  });

  async function saveFileIntoDevice(activity) {
    captureMessage(RNFS.DocumentDirectoryPath);
    RNFS.writeFile(
      `${RNFS.DocumentDirectoryPath}/activity.txt`,
      JSON.stringify(activity),
    )
      .then((message) => {
        Share.share({
          url: `${RNFS.DocumentDirectoryPath}/activity.txt`,
          title: 'TESTE FILE',
        });
      })
      .catch(() => Alert.alert('ERRO'));
  }

  const setSyncLoading = useStoreActions(
    (actions) => actions.monitor.setSyncLoading,
  );
  const setCurrentActivity = useStoreActions(
    (actions) => actions.monitor.setCurrentActivity,
  );
  const currentAcitivity = useStoreState(
    (state) => state.monitor.currentAcitivity,
  );

  const saveMonitorLocal = async (called) => {
    const realm = await dbMonitorQueue();

    const localMonitor = realm.objects<IMonitorSchema>('ActivityQueue');
    if (localMonitor && localMonitor.length > 0) {
      localMonitor.map(async (activity, index) => {
        setLoading(true);
        // setSyncLoading(true);
        if (
          currentAcitivity === index &&
          lastUploadedActivity.current === index
        ) {
          setCurrentActivity(index + 1);
          lastUploadedActivity.current = index + 1;
          captureMessage(
            `tamanho das coordenadas: ${activity.coordinates.length}`,
          );
          console.log('ENTROU AQUI PRA SALVAR', {
            device_name: activity.device_name,
            distance: activity.distance,
            elapsed_time: activity.elapsed_time,
            moving_time: activity.moving_time,
            start_date: activity.start_date,
            description:
              activity.description && activity.description?.length > 1
                ? activity.description
                : null,
            name:
              activity.name && activity.name.length > 1 ? activity.name : null,
            is_private: activity.visibility === 'me',
            total_ascent: 0,
            total_descent: 0,
            total_elevation_gain: 0,
            visibility: activity.visibility,
            send_to_strava: false,
          });
          console.log('gps_points: ', activity.coordinates);
          await saveFileIntoDevice({
            device_name: activity.device_name,
            distance: Math.floor(activity.distance),
            elapsed_time: activity.elapsed_time,
            gps_points: activity.coordinates,
            moving_time: activity.moving_time,
            start_date: activity.start_date,
            description:
              activity.description && activity.description?.length > 1
                ? activity.description
                : null,
            name:
              activity.name && activity.name.length > 1 ? activity.name : null,
            is_private: activity.visibility === 'me',
            total_ascent: 0,
            total_descent: 0,
            total_elevation_gain: 0,
            visibility: activity.visibility,
            send_to_strava: true,
          });
          await createActivityMutation({
            variables: {
              data: {
                device_name: activity.device_name,
                distance: Math.floor(activity.distance),
                elapsed_time: activity.elapsed_time,
                gps_points: activity.coordinates,
                moving_time: activity.moving_time,
                start_date: activity.start_date,
                description:
                  activity.description && activity.description?.length > 1
                    ? activity.description
                    : null,
                name:
                  activity.name && activity.name.length > 1
                    ? activity.name
                    : null,
                is_private: activity.visibility === 'me',
                total_ascent: 0,
                total_descent: 0,
                total_elevation_gain: 0,
                visibility: activity.visibility,
                send_to_strava: activity?.send_to_strava
                  ? activity?.send_to_strava
                  : false,
              },
            },
          });

          realm.write(() => {
            realm.delete(activity);
          });

          setLoading(false);
        }
      });

      setCurrentActivity(0);
      lastUploadedActivity.current = 0;
      setCurrentActivity(0);
      if (called) {
        called.current = false;
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSyncLoading(loading);
  }, [loading]);

  return { saveMonitorLocal, loading };
}
