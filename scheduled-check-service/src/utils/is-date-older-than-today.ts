import dayjs from "dayjs";

export function isDateOlderThanToday(date: string, today: Date) {
  const givenDate = dayjs(date);
  return givenDate.isBefore(today, "day");
}
