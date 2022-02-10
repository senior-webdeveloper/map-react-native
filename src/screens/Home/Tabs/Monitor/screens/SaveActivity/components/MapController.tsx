import React from 'react';
import { useRecoilValue } from 'recoil';
import { lineString as makeLineString } from '@turf/helpers';
import MapboxGL, { LineLayerProps } from '@react-native-mapbox-gl/maps';
import { isActiveTimer } from '~/hooks/useTimer';
import { coordinatesAtom } from './MapControls';
import { heightPercentageToDP } from '~/helpers/convertPixelToDP';

const LineLayerStyleTwo: LineLayerProps = {
  id: 'lineLayer',
  style: {
    lineWidth: 5,
    lineJoin: 'bevel',
    lineColor: '#0564FF',
  },
};

export function MapController(): JSX.Element {
  const isActive = useRecoilValue(isActiveTimer);
  const coords = useRecoilValue(coordinatesAtom);

  return (
    <MapboxGL.MapView style={{ flex: 1 }} styleURL={MapboxGL.StyleURL.Outdoors}>
      <MapboxGL.Camera
        zoomLevel={20}
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
      {coords && coords.length >= 2 && isActive && (
        <MapboxGL.ShapeSource id="shapeSource" shape={makeLineString(coords)}>
          <MapboxGL.LineLayer {...LineLayerStyleTwo} />
        </MapboxGL.ShapeSource>
      )}
    </MapboxGL.MapView>
  );
}
