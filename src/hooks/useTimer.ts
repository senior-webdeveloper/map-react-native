import { useState, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { addSeconds, differenceInSeconds } from 'date-fns';
import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';
import { cartState, subscriptionPrice } from '~/recoil/atoms';

export const formatTime = (timer) => {
  const minutes = Math.floor(timer / 60);

  const getSeconds = `0${timer % 60}`.slice(-2);
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

  return `${getHours}:${getMinutes}:${getSeconds}`;
};

export const timerAtom = atom({
  key: 'monitorTimer',
  default: 0,
});

export const timerSelector = selector({
  key: 'timerSelector',
  get: ({ get }) => {
    const timer = get(timerAtom);
    const formattedTimer = formatTime(timer);

    return {
      timer,
      formattedTimer,
    };
  },
});

export const isActiveTimer = atom({
  key: 'isActiveTimer',
  default: false,
});

export const isPausedTimer = atom({
  key: 'isPausedTimer',
  default: false,
});

function useTimer(): {
  isActive: boolean;
  isPaused: boolean;
  handleStart: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleReset: () => void;
} {
  const [timer, setTimer] = useRecoilState(timerAtom);
  const [isActive, setIsActive] = useRecoilState(isActiveTimer);
  const [isPaused, setIsPaused] = useRecoilState(isPausedTimer);
  const lastResumeTime = useRef<number>(0);
  const countRef = useRef(null);

  const handleStart = useCallback(() => {
    const starterTime = new Date();
    setIsActive(true);
    setIsPaused(false);
    countRef.current = setInterval(() => {
      const end = new Date();
      setTimer(differenceInSeconds(end, starterTime));
    }, 1000);
  }, []);

  const handlePause = () => {
    lastResumeTime.current = timer;
    console.log('timer2: ', timer);
    clearInterval(countRef.current);
    setIsPaused(true);
  };

  const handleResume = useCallback(() => {
    setIsPaused(false);
    console.log('lastResumeTime', lastResumeTime.current);
    const starterTime = new Date();
    countRef.current = setInterval(() => {
      const end = new Date();
      setTimer(lastResumeTime.current + differenceInSeconds(end, starterTime));
    }, 1000);
  }, []);

  const handleReset = useCallback(() => {
    clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  }, []);

  return {
    isActive,
    isPaused,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
  };
}

export default useTimer;
