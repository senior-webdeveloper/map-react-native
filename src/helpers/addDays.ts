function addDays(date: Date, days: number): Date {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
}

export default addDays;
