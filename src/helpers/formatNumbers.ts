export default function formatNumber(
  number: number,
  { hasDot = true, digits = 2 }: { hasDot?: boolean; digits: number },
): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: hasDot ? digits : 0,
    maximumFractionDigits: hasDot ? digits : 0,
  }).format(number);
}
