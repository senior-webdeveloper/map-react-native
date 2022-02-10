import * as Sentry from '@sentry/react-native';
import { Maybe } from '~/generated/graphql';

export default function formatSecondsInHours(
  sec?: number | Maybe<number>,
): string {
  const currentSeconds = sec || 0;
  let hours = Math.floor(currentSeconds / 3600);
  let minutes = Math.floor((currentSeconds - hours * 3600) / 60);
  let seconds = currentSeconds - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}
