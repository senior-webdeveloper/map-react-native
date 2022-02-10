import { addMinutes, intervalToDuration } from 'date-fns';

export default function handleTimeWithMinutes(
  time: number | null | undefined,
): number | string {
  const actualDate = new Date();
  if (time) {
    const newDate = addMinutes(new Date(), time);
    const { hours, minutes, seconds } = intervalToDuration({
      start: actualDate,
      end: newDate,
    });
    if (hours || minutes || seconds) {
      return `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
  }

  return '-';
}
