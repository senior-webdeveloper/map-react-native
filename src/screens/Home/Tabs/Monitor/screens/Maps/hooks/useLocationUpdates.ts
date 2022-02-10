import React, { useCallback, useRef, useState } from 'react';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { captureMessage } from '@sentry/react-native';
import haversine from 'haversine-distance';
import { useSetRecoilState } from 'recoil';
import {
  activityDistanceAtom,
  coordinatesAtom,
  currentSpeedAtom,
} from '~/screens/Home/Tabs/Monitor/screens/Maps/components/MapControls';

interface LocationUpdates {
  startLocationCapture: () => void;
  removeLocationUpdates: () => void;
}

export function useLocationUpdates(): LocationUpdates {
  const localCoords = useRef<number[][]>([]);
  const previousCoords = useRef<GeoPosition>(null);
  const setSpeed = useSetRecoilState(currentSpeedAtom);
  const setDistance = useSetRecoilState(activityDistanceAtom);
  const setCoords = useSetRecoilState(coordinatesAtom);

  const watchId = useRef<number>(null);

  const removeLocationUpdates = useCallback(() => {
    if (watchId.current !== null) {
      // stopForegroundService();
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      // setObserving(false);
    }
  }, []);

  const handleLocationUpdates = (props: GeoPosition) => {
    setSpeed(props.coords.speed);
    if (props.coords.speed && props.coords.speed > 1) {
      // if (
      //   props.coords.speed > 5 &&
      //   previousCoords &&
      //   props.coords.heading !== previousCoords?.coords.heading
      // ) {
      //   console.log(
      //     ' props.coords.speed > 5 &&' +
      //       '        previousCoords &&' +
      //       '        props.coords.heading !== previousCoords?.coords.heading : ',
      //     props.coords.speed > 5 &&
      //       previousCoords &&
      //       props.coords.heading !== previousCoords?.coords.heading,
      //   );
      //   // handleAutomaticPauseStop();
      // } else
      if (localCoords.current.length >= 1) {
        localCoords.current = [
          ...localCoords.current,
          [props.coords.longitude, props.coords.latitude],
        ];
        setCoords([
          ...localCoords.current,
          [props.coords.longitude, props.coords.latitude],
        ]);

        // saveMonitorLocal(props);
        if (previousCoords.current) {
          const a = {
            latitude: previousCoords.current.coords.latitude,
            longitude: previousCoords.current.coords.longitude,
          };
          const b = {
            latitude: props.coords.latitude,
            longitude: props.coords.longitude,
          };
          const distanceInHaversine = haversine(a, b);
          if (distanceInHaversine) {
            setDistance((prevState) => prevState + distanceInHaversine);
          }
        }
      } else {
        localCoords.current = [[props.coords.longitude, props.coords.latitude]];
        setCoords([[props.coords.longitude, props.coords.latitude]]);
      }
    } else {
      // handleAutomaticPauseStart();
    }
    previousCoords.current = props;
  };

  const startLocationCapture = useCallback(() => {
    watchId.current = Geolocation.watchPosition(
      (props) => {
        handleLocationUpdates(props);
      },
      (error) => {
        captureMessage(`|Erro no monitor| ${error.code}: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        showsBackgroundLocationIndicator: true,
        accuracy: {
          android: 'high',
          ios: 'bestForNavigation',
        },
      },
    );
  }, []);

  return {
    startLocationCapture,
    removeLocationUpdates,
  };
}
