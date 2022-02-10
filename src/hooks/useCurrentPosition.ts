import React from 'react';
import Geolocation from 'react-native-geolocation-service';

interface Coordinates {
  latitude: string;
  longitude: string;
}

export function useCurrentPosition(): {
  coords: Coordinates | undefined;
} {
  const [coords, setCoords] = React.useState<Coordinates>();

  React.useEffect(() => {
    Geolocation.getCurrentPosition((position) => {
      setCoords({
        latitude: String(position.coords.latitude),
        longitude: String(position.coords.longitude),
      });
    });
  }, []);

  return { coords };
}
