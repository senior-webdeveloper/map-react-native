import React, { useCallback, useRef } from 'react';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
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
import { ShowTimer } from '~/screens/Home/Tabs/Monitor/screens/Maps/components/ShowTimer';

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

export function MapControls(): JSX.Element {
  const { startLocationCapture, removeLocationUpdates } = useLocationUpdates();
  const { handleStart, handlePause, handleResume } = useTimer();
  const modalizeRef = useRef<Modalize>(null);

  return (
    <>
      <Modalize
        ref={modalizeRef}
        modalHeight={heightPercentageToDP('70')}
        alwaysOpen={heightPercentageToDP('70')}
        panGestureEnabled={false}
        closeOnOverlayTap={false}
        overlayStyle={{
          backgroundColor: 'transparent',
        }}
        rootStyle={{
          zIndex: 1,
        }}
      >
        <Box height={heightPercentageToDP('70')} justifyContent="space-between">
          <Box
            flexDirection="row"
            py={3}
            justifyContent="space-between"
            px={3}
            backgroundColor="white"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
          >
            <Box flexDirection="row">
              <Box>
                <Typography type="small">Tempo</Typography>
                {/* <Typography type="h3">{formatTime(timer)}</Typography> */}
              </Box>

              <Box ml={17}>
                <Typography type="small">Distância</Typography>
                {/* <Typography type="h3"> */}
                {/*  {Number(distance / 1000).toFixed(2)} km */}
                {/* </Typography> */}
              </Box>

              <Box ml={17}>
                <Typography type="small">Elevação</Typography>
                <Typography type="h3">78 m</Typography>
              </Box>
            </Box>

            <Box alignItems="flex-end">
              <Typography type="small">Conquistas</Typography>

              <Box flexDirection="row" alignItems="center">
                <Icons
                  name="new-trophy"
                  color="#FDC746"
                  style={{ marginRight: 4 }}
                />
                <Icons
                  name="new-trophy"
                  color="#CCCCCC"
                  style={{ marginRight: 4 }}
                />
                <Typography type="h3">02</Typography>
              </Box>
            </Box>
          </Box>
          <Box flex={1} as={ScrollView}>
            <Box paddingTop={24} paddingLeft={3} paddingBottom={2}>
              <Typography type="h3">Personalize sua atividade</Typography>
            </Box>

            <Box>
              <TextInput
                placeholder="Dê um título para sua pedalada"
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#A1A8B1',
                  color: '#161C25',
                  fontFamily: 'NeuzeitGro-Reg',
                  fontSize: 16,
                }}
                placeholderTextColor="rgba(0, 0, 0, 0.6)"
              />

              <TextInput
                placeholder="Adicione uma descrição"
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#A1A8B1',
                  color: '#161C25',
                  fontFamily: 'NeuzeitGro-Reg',
                  fontSize: 16,
                }}
                placeholderTextColor="rgba(0, 0, 0, 0.6)"
              />
            </Box>

            <Box>
              <Box
                flexDirection="row"
                alignItems="center"
                p={18}
                justifyContent="space-between"
                borderBottomWidth={0.5}
                borderBottomColor="rgba(0, 0, 0, 0.6)"
                as={TouchableOpacity}
                // onPress={() => {
                //   if (modalizeRefSelect.current) {
                //     modalizeRefSelect?.current.open();
                //   }
                // }}
              >
                <Box flexDirection="row" alignItems="center">
                  <Icons name="bike" width={24} height={24} color="#0564FF" />
                  <Typography ml={3}>Integracoes</Typography>
                </Box>

                <Box flexDirection="row" alignItems="center">
                  {/* {values.send_to_strava ? ( */}
                  {/*  <Icons name="strava-crawler" height={20} /> */}
                  {/* ) : null} */}

                  <Icons
                    name="arrow_forward"
                    width={24}
                    height={24}
                    marginLeft={10}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box p={3}>
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
            >
              <Typography color="white">Salvar</Typography>
              <Icons
                name="arrow_forward"
                color="white"
                width={24}
                height={24}
              />
            </Box>
          </Box>
        </Box>
      </Modalize>
    </>
  );
}
