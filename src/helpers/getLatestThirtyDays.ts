import { addDays } from 'date-fns';

function getThirtyDays(): string[] {
  // Get the current date
  const myDate = addDays(new Date(), 1);
  const nowY = myDate.getFullYear();
  const nowM = myDate.getMonth() + 1;
  const nowD = myDate.getDate();
  const enddateStr = `${nowY}-${nowM < 10 ? `0${nowM}` : nowM}-${
    nowD < 10 ? `0${nowD}` : nowD
  }`; // Current date
  const enddate = new Date(enddateStr);

  // Get the date thirty days ago
  const lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30); // The last number 30 can be changed, meaning 30 days
  const lastY = lw.getFullYear();
  const lastM = lw.getMonth() + 1;
  const lastD = lw.getDate();
  const startdateStr = `${lastY}-${lastM < 10 ? `0${lastM}` : lastM}-${
    lastD < 10 ? `0${lastD}` : lastD
  }`; // The date before thirty days
  const startDate = new Date(startdateStr);

  const dateList: string[] = [];
  while (true) {
    startDate.setDate(startDate.getDate() + 1);
    if (startDate.getTime() <= enddate.getTime()) {
      // startDate.getFullYear () gets the year, no year is added here
      dateList.push(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
        ).toISOString(),
      );
    } else {
      break;
    }
  }
  return dateList;
}

export { getThirtyDays };
