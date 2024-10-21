import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDateWithTime(date: string | Date) {
  if (!date) return '';

  const moscowDate = dayjs(date).tz('Europe/Moscow');

  return moscowDate.format('DD/MM/YYYY HH:mm');
}
