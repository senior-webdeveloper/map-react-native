import React, { useCallback, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { useNavigation } from '@react-navigation/native';
import { Box, Icons, Typography } from '~/components';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '~/helpers/convertPixelToDP';
import useTimer, {
  formatTime,
  isActiveTimer,
  isPausedTimer,
  timerAtom,
  timerSelector,
} from '~/hooks/useTimer';
import { ShowSpeed } from '~/screens/Home/Tabs/Monitor/screens/Maps/components/ShowSpeed';
import { ShowDistance } from '~/screens/Home/Tabs/Monitor/screens/Maps/components/ShowDistance';
import { useLocationUpdates } from '~/screens/Home/Tabs/Monitor/screens/Maps/hooks/useLocationUpdates';

export const activityDistanceAtom = atom({
  key: 'activityDistanceAtom',
  default: 0,
});

export const currentSpeedAtom = atom({
  key: 'currentSpeedAtom',
  default: 0,
});

export const coordinatesAtom = atom<number[][]>({
  key: 'coordinates',
  default: [],
});

export function MapControls({ navigation }): JSX.Element {
  const { startLocationCapture, removeLocationUpdates } = useLocationUpdates();
  const { formattedTimer } = useRecoilValue(timerSelector);
  const isActive = useRecoilValue(isActiveTimer);
  const isPaused = useRecoilValue(isPausedTimer);
  const { handleStart, handlePause, handleResume } = useTimer();
  const modalPosition = 'initial';
  const modalizeRef = useRef<Modalize>(null);

  const startActivity = useCallback(() => {
    if (isPaused) {
      handleResume();
    } else {
      handleStart();
    }
    startLocationCapture();
    if (modalizeRef.current) {
      modalizeRef.current.open();
    }
  }, [isPaused, startLocationCapture, handleResume, handleStart]);

  const stopActivity = useCallback(() => {
    handlePause();
    removeLocationUpdates();
  }, []);

  return (
    <>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding={18}
      >
        <Box
          as={TouchableOpacity}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="blue"
          width={1}
          py={14}
          px={24}
          borderRadius={100}
          onPress={() => startActivity()}
        >
          <Typography color="white">Iniciar Atividade</Typography>
          <Icons name="arrow_forward" color="white" width={24} height={24} />
        </Box>
      </Box>

      <Modalize
        ref={modalizeRef}
        snapPoint={350}
        modalHeight={heightPercentageToDP('90')}
        panGestureEnabled={false}
        closeOnOverlayTap={false}
        overlayStyle={{
          backgroundColor: 'transparent',
        }}
      >
        <Box height={350} justifyContent="space-between" p={3}>
          <Box width={1}>
            <Box width={1} alignItems="center" mb={17} mt={16}>
              <Typography type="monitorLabel">tempo</Typography>
              <Typography type="bigger">{formattedTimer}</Typography>
            </Box>
            <Box
              flexDirection={modalPosition === 'initial' ? 'row' : 'column'}
              width={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <ShowDistance />
              <ShowSpeed />
            </Box>
          </Box>

          {isActive && !isPaused ? (
            <Box
              as={TouchableOpacity}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              backgroundColor="white"
              borderColor="red"
              borderWidth={1}
              width={1}
              py={14}
              px={24}
              borderRadius={100}
              onPress={() => {
                stopActivity();
              }}
            >
              <Typography color="red">Parar</Typography>
            </Box>
          ) : null}

          {isActive && isPaused ? (
            <Box
              flexDirection="row"
              alignItems="center"
              width={1}
              justifyContent="space-between"
              px={4}
            >
              <Box
                as={TouchableOpacity}
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                backgroundColor="white"
                borderColor="#0564FF"
                borderWidth={1}
                width={0.45}
                py={14}
                px={24}
                borderRadius={100}
                onPress={() => startActivity()}
              >
                <Typography color="blue">Continuar</Typography>
              </Box>

              <Box
                as={TouchableOpacity}
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                backgroundColor="#0564FF"
                width={0.45}
                py={14}
                px={24}
                borderRadius={100}
                onPress={() => {
                  navigation.navigate('SaveActivity');
                }}
              >
                <Typography color="white">Concluir</Typography>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Modalize>
    </>
  );
}
