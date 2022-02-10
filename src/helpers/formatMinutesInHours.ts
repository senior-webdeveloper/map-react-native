export default function formatMinutesInHours(minutes: number): string {
  return `${
    Math.floor(minutes / 60) < 10
      ? `0${Math.floor(minutes / 60)}`
      : Math.floor(minutes / 60)
  }:${
    Number(minutes % 60) < 10
      ? `0${Number(minutes % 60)}`
      : Number(minutes % 60)
  }:00`;
}
