import React from 'react';
import { useRecoilValue } from 'recoil';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { Box, Typography } from '~/components';
import {
  activityDistanceAtom,
  currentSpeedAtom,
} from '~/screens/Home/Tabs/Monitor/screens/Maps/components/MapControls';

export function ShowDistance() {
  const distance = useRecoilValue(activityDistanceAtom);
  return (
    <Box
      width={widthPercentageToDP('50') - 16}
      alignItems="center"
      justifyContent="center"
    >
      <Typography
        type="small"
        // type={modalPosition === 'initial' ? 'small' : 'monitorLabel'}
      >
        distância (km)
      </Typography>
      <Typography
        type="h2"
        // type={modalPosition === 'initial' ? 'h2' : 'bigger'}
      >
        {distance < 1000
          ? Number(distance / 1000).toFixed(2)
          : Number(distance / 1000).toFixed(2)}
      </Typography>
    </Box>
  );
}
