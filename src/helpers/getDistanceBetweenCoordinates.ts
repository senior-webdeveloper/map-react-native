/**
 * **Get distance between two coordinates**
 * -you must enter two values, each of which is an array containing a latitude and a longitude of each coordinate.-
 * @param value1 The fist coordinate.
 * @param value2 The second coordinate.
 * @returns returns the distance between two coordinates.
 */

const distanceOfCoordinates = (value1: number[], value2: number[]): number => {
  const lat1 = value1[0];
  const lon1 = value1[1];
  const lat2 = value2[0];
  const lon2 = value2[1];
  const rad = (x: number): number => {
    return (x * Math.PI) / 180;
  };

  const R = 6378.137;
  const dLat = rad(lat2 - lat1);
  const dLong = rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  const e = d / 2;
  return Number(e.toFixed(2));
};

export { distanceOfCoordinates };
