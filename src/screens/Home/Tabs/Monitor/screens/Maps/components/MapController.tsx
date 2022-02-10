import React, { useState } from 'react';
import { selector, useRecoilValue } from 'recoil';
import { lineString as makeLineString } from '@turf/helpers';
import MapboxGL, { LineLayerProps } from '@react-native-mapbox-gl/maps';
import simplify from '@turf/simplify';
import { isActiveTimer } from '~/hooks/useTimer';
import { coordinatesAtom } from './MapControls';

const LineLayerStyleTwo: LineLayerProps = {
  id: 'lineLayer',
  style: {
    lineWidth: 5,
    lineJoin: 'bevel',
    lineColor: '#0564FF',
  },
};

export const simplifyedCoordAtom = selector({
  key: 'simplifyedCoordAtom',
  get: ({ get }) => {
    const coords = get(coordinatesAtom);
    let simplifyedCoord;

    if (coords && coords.length > 1) {
      simplifyedCoord = makeLineString(coords);
    } else {
      simplifyedCoord = undefined;
    }

    return {
      simplifyedCoord,
    };
  },
});

export function MapController(): JSX.Element {
  const [zoomLevel, setZoomLevel] = useState(21);
  const isActive = useRecoilValue(isActiveTimer);
  const coords = useRecoilValue(simplifyedCoordAtom);

  return (
    <MapboxGL.MapView
      style={{ flex: 1 }}
      styleURL={MapboxGL.StyleURL.Outdoors}
      onDidFinishRenderingMap={() => {
        setZoomLevel(21);
      }}
      onDidFinishRenderingMapFully={() => {
        setZoomLevel(21);
      }}
      animated
    >
      <MapboxGL.Camera
        zoomLevel={zoomLevel || 21}
        followUserLocation
        followUserMode={MapboxGL.UserTrackingModes.Follow}
      />
      <MapboxGL.UserLocation
        visible
        showsUserHeadingIndicator
        animated
        androidRenderMode="compass"
        renderMode="native"
      />
      {coords && coords.simplifyedCoord && isActive && (
        <MapboxGL.ShapeSource id="shapeSource" shape={coords.simplifyedCoord}>
          <MapboxGL.LineLayer {...LineLayerStyleTwo} />
        </MapboxGL.ShapeSource>
      )}
    </MapboxGL.MapView>
  );
}
