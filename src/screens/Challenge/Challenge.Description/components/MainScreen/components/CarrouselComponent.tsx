import { TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import LottieView from 'lottie-react-native';
import { width } from 'styled-system';
import * as Styled from '~/screens/Challenge/Challenge.Description/components/MainScreen/styles';
import { clapsRunning } from '~/screens/Challenge/Challenge.Description/components/MainScreen/components/ClapsComponent';
import { Box } from '~/components';
import { widthPercentageToDP } from '~/helpers/convertPixelToDP';

export function CarrouselComponent(props: { onPress: () => void; uri: T }) {
  const clapAnimation = useRef<LottieView>(null);

  const clapsIsRunning = useRecoilValue(clapsRunning);

  useEffect(() => {
    if (clapAnimation.current) {
      if (clapsIsRunning) {
        clapAnimation?.current.play();
      } else {
        clapAnimation?.current.reset();
      }
    }
  }, [clapsIsRunning]);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={props.onPress}>
      <Styled.HighlightImage
        source={{
          uri: props.uri,
        }}
        resizeMethod="scale"
        progressiveRenderingEnabled
        loadingIndicatorSource={{
          uri: props.uri,
        }}
        imageStyle={{ borderRadius: 16 }}
      />
      {clapsIsRunning ? (
        <Box
          position="absolute"
          bottom={150}
          left={widthPercentageToDP('50') - 50}
          backgroundColor="rgba(22, 28, 37, 0.17)"
          width={100}
          height={100}
          borderRadius={100}
        >
          <LottieView
            ref={clapAnimation}
            source={require('./animation/claps.json')}
            loop={clapsIsRunning}
            style={{
              width: 100,
              height: 100,
              alignItems: 'center',
            }}
          />
        </Box>
      ) : null}
    </TouchableOpacity>
  );
}
