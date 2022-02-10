import React, { MutableRefObject } from 'react';
import FastImage from 'react-native-fast-image';
import { PUBLIC_STORAGE } from '@env';
import { Modalize } from 'react-native-modalize';
import { TouchableOpacity } from 'react-native';
import { useSetRecoilState } from 'recoil';
import { Box, Icons, Typography } from '~/components';
import { GetChallengeDetailQuery } from '~/graphql/autogenerate/operations';
import { showModalizeBottomButton } from '~/screens/Challenge/Challenge.Description/components/ModalizeComponent';

interface FreemiumCallInterface {
  data: GetChallengeDetailQuery;
  modalizeRef: MutableRefObject<Modalize>;
}

export function FreemiumCall({
  data,
  modalizeRef,
}: FreemiumCallInterface): JSX.Element {
  const setShowModalizeBottomButton = useSetRecoilState(
    showModalizeBottomButton,
  );
  return (
    <Box marginTop={3} px={3}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        backgroundColor="blue"
        borderRadius={16}
        p={3}
        alignItems="center"
      >
        {data.getChallengeDetail.user_challenges &&
        data.getChallengeDetail.user_challenges.length > 0 &&
        data.getChallengeDetail.user_challenges[0].completed ? (
          <Box height={150}>
            <Typography color="white" type="h5">
              Parabéns,{'\n'}
              Desafio Concluído!
            </Typography>
            <Typography color="white" type="caption">
              Leve para casa muito{'\n'}mais que memórias,{'\n'}aproveite
            </Typography>

            <Box
              as={TouchableOpacity}
              flexDirection="row"
              alignItems="center"
              backgroundColor="white"
              borderRadius={16}
              justifyContent="center"
              py={1}
              marginTop={3}
              onPress={() => {
                setShowModalizeBottomButton(false);
                modalizeRef.current.open();
              }}
            >
              <Typography color="blue">Compre agora</Typography>
              <Icons
                name="arrow_forward"
                width={16}
                height={16}
                color="#0564FF"
              />
            </Box>
          </Box>
        ) : (
          <Box height={150} justifyContent="space-between">
            <Typography color="white" type="h5">
              Kit do desafio
            </Typography>
            <Typography color="white" type="caption">
              Leve para casa muito{'\n'}mais que memórias,{'\n'}aproveite
            </Typography>

            <Box
              as={TouchableOpacity}
              flexDirection="row"
              alignItems="center"
              backgroundColor="white"
              borderRadius={16}
              justifyContent="center"
              py={1}
              marginTop={3}
              onPress={() => {
                setShowModalizeBottomButton(false);
                modalizeRef.current.open();
              }}
            >
              <Typography color="blue">Compre agora</Typography>
              <Icons
                name="arrow_forward"
                width={16}
                height={16}
                color="#0564FF"
              />
            </Box>
          </Box>
        )}

        <Box>
          <FastImage
            source={{
              uri: `${PUBLIC_STORAGE}/${
                data.getChallengeDetail.awards[0].awardsImages[
                  data.getChallengeDetail.awards[0].awardsImages.findIndex(
                    (el) => el.order === 1,
                  )
                ].link
              }`,
            }}
            style={{
              width: 160,
              height: 160,
              borderRadius: 4,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
