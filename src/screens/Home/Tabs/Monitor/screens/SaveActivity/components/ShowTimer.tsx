import React from 'react';
import { useRecoilValue } from 'recoil';
import { Box, Typography } from '~/components';
import { timerSelector } from '~/hooks/useTimer';

export function ShowTimer() {
  const { formattedTimer } = useRecoilValue(timerSelector);

  return (
    <Box width={1} alignItems="center" mb={17} mt={16}>
      <Typography type="monitorLabel">tempo</Typography>
      <Typography type="bigger">{formattedTimer}</Typography>
    </Box>
  );
}
