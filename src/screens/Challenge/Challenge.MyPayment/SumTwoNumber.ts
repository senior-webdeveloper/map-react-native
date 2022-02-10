export function sumTwoNumber(a?: number, b?: number): number {
  let aInt = 0;
  let bInt = 0;
  if (a && !Number.isNaN(a)) {
    aInt = a;
  }
  if (b && !Number.isNaN(b)) {
    bInt = b;
  }

  return aInt + bInt;
}
