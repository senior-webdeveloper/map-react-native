export default function convertBigNumbers(value: number): string {
  // const convert = new Intl.NumberFormat('pt-BR', {
  //   maximumFractionDigits: 1,
  // });
  // if (value >= 1000000) {
  //   return `${convert.format(value / 1000000)}M`;
  // }
  // if (value >= 1000) {
  //   return `${convert.format(value / 1000)}K`;
  // }
  return String(value);
}
