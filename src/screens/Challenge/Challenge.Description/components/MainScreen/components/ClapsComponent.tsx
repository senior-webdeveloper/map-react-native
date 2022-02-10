import React, { useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { atom, useRecoilState } from 'recoil';
import { TitleText, Typography } from '~/components';
import * as Styled from '~/screens/Challenge/Challenge.Description/components/MainScreen/styles';
import convertBigNumbers from '~/helpers/convertBigNumbers';
import { useCreateClapMutation } from '~/graphql/autogenerate/hooks';
import { useUserToken } from '~/hooks';

export const clapsRunning = atom({
  key: 'clapsRunning',
  default: false,
});

export function ClapsComponent({ challengeDetail, myInitialClaps }) {
  const [_, setClapsIsRunning] = useRecoilState(clapsRunning);
  const [createClapMutation] = useCreateClapMutation();
  const [countNewClaps, setCountNewClaps] = useState<number>(myInitialClaps);
  const ballAnimatedValue = useRef(new Animated.Value(0)).current;
  const clapAnimation = useRef<LottieView>(null);
  const [runningClap, setRunningClap] = useState(false);
  const opacityClapBaloon = useState(new Animated.Value(0))[0];
  const countClaps = useRef();
  const { profileID, userID } = useUserToken();
  let timer;

  function addClaps(): void {
    setClapsIsRunning(true);
    setRunningClap(true);
    clapAnimation.current?.play();
    if (countClaps.current > 0) {
      if (countNewClaps < 50) {
        countClaps.current += 1;
        setCountNewClaps((prevState) => prevState + 1);
      } else if (countNewClaps > 50) {
        setCountNewClaps(50);
      }
    } else if (countNewClaps < 50) {
      countClaps.current += +1;
      setCountNewClaps((prevState) => prevState + 1);
    } else if (countNewClaps > 50) {
      setCountNewClaps(50);
    }

    this.timer = setTimeout(addClaps, 100);
  }

  async function stopTimer() {
    setTimeout(() => {
      setClapsIsRunning(false);
    }, 240);

    setRunningClap(false);
    clapAnimation.current?.pause();
    clearTimeout(this.timer);
    await createClapMutation({
      variables: {
        data: {
          challenge_id: challengeDetail.id!,
          profile_id: profileID,
          count:
            countClaps.current > 50
              ? 50
              : countClaps.current > 0
              ? countClaps.current
              : 1,
        },
      },
    });
  }

  const moveBallUp = () => {
    Animated.timing(ballAnimatedValue, {
      toValue: -0.09,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const yVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350],
  });

  function fade() {
    setClapsIsRunning(true);
    Animated.timing(opacityClapBaloon, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    moveBallUp();
    setRunningClap(true);
    if (countNewClaps < 50) {
      countClaps.current = countNewClaps + 1;
      setCountNewClaps(countClaps.current);
    }
    clapAnimation.current?.play();
    setTimeout(() => {
      Animated.timing(opacityClapBaloon, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() =>
        Animated.timing(ballAnimatedValue, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }).start(),
      );

      // setTimeout(() => {
      //   setClapsIsRunning(false);
      // }, 500);

      // moveBallDown();
      // stopTimer();
    }, 500);
  }

  function fadeIn() {
    Animated.timing(opacityClapBaloon, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setTimeout(() => addClaps(), 650);
    moveBallUp();
  }

  function fadeOut() {
    Animated.timing(opacityClapBaloon, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() =>
      Animated.timing(ballAnimatedValue, {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
      }).start(),
    );

    // moveBallDown();
    setTimeout(() => stopTimer(), 500);
  }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            transform: [
              {
                translateY: yVal,
              },
            ],
          },
          {
            width: 30,
            height: 30,
            position: 'absolute',
            opacity: opacityClapBaloon,
            borderRadius: 30,
            backgroundColor: 'rgba(5, 100, 255, 1)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          },
        ]}
      >
        <TitleText style={{ color: 'white', fontSize: 13, lineHeight: 14 }}>
          {countNewClaps < 50
            ? countNewClaps === 0
              ? `+ 1`
              : `+ ${countNewClaps}`
            : '+ 50'}
        </TitleText>
      </Animated.View>
      <Styled.Action
        hitSlop={{
          bottom: 10,
          left: 20,
          right: 20,
          top: 20,
        }}
        onPress={fade}
        onLongPress={fadeIn}
        onPressOut={fadeOut}
        activeOpacity={0.8}
      >
        <LottieView
          ref={clapAnimation}
          source={require('../../../assets/clapblack.json')}
          loop={runningClap}
          style={{
            width: 40,
          }}
        />

        <Typography marginRight={16}>
          <Typography
            marginLeft={8}
            style={{
              color:
                countClaps.current > 0 || countNewClaps > 0
                  ? '#0564FF'
                  : '#161C25',
            }}
          >
            {convertBigNumbers(
              challengeDetail?.summary?.count_claps +
                (countNewClaps > 50 ? 50 : countNewClaps) -
                myInitialClaps,
            )}
          </Typography>{' '}
          {challengeDetail.summary.count_claps > 0 || countNewClaps > 0
            ? ''
            : 'Palma'}
        </Typography>
      </Styled.Action>
    </View>
  );
}
