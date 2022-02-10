import React from 'react';
import { useRecoilValue } from 'recoil';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';
import { Box, Typography } from '~/components';
import { currentSpeedAtom } from '~/screens/Home/Tabs/Monitor/screens/Maps/components/MapControls';

export function ShowSpeed() {
  const speed = useRecoilValue(currentSpeedAtom);
  return (
    <Box
      width={widthPercentageToDP('50') - 16}
      alignItems="center"
      // mt={modalPosition === 'initial' ? 0 : 17}
      mt={0}
      justifyContent="center"
    >
      <Typography
        type="small"
        // type={modalPosition === 'initial' ? 'small' : 'monitorLabel'}
      >
        velocidade (km/h)
      </Typography>
      <Typography
        type="h2"
        // type={modalPosition === 'initial' ? 'h2' : 'bigger'}
      >
        {!Number.isInteger(speed * 3.6)
          ? Number(speed > 0 ? speed * 3.6 : 0).toFixed(1)
          : Number(speed > 0 ? speed * 3.6 : 0).toFixed(0)}
      </Typography>
    </Box>
  );
}
