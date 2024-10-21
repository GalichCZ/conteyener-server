import { OutDate } from '../types/out-date-notification';
import { formatDate } from '../utils/format-date';

const DATE_LABELS: Record<string, string> = {
  eta: 'ETA',
  date_do: 'Дата ДО',
  declaration_issue_date: 'Дата выпуска декларации',
  train_depart_date: 'Дата отправки по ЖД',
  train_arrive_date: 'Дата прибытия по ЖД',
  store_arrive_date: 'Дата прибытия на склад',
};

export const outDateNotificationMail = (
  container_number: string,
  out_dates: OutDate[]
) => {
  const datesListHtml = out_dates
    .map(({ date_type, date }) => {
      return `
      <tr>
        <td style="border: 1px solid black; padding: 8px;">${DATE_LABELS[date_type]}</td>
        <td style="border: 1px solid black; padding: 8px;">${formatDate(date)}</td>
      </tr>`;
    })
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h3 style="color: #d9534f;">Уведомление о задержке этапов</h3>
      <p>Контейнер <strong>${container_number}</strong> имеет задержку на следующих этапах:</p>
      <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">Этап</th>
            <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">Дата</th>
          </tr>
        </thead>
        <tbody>
          ${datesListHtml}
        </tbody>
      </table>
    </div>
  `;
};
