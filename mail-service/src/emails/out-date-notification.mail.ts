import { RottenData } from '../types/out-date-notification';
import { formatDate } from '../utils/format-date';

const DATE_LABELS: Record<string, string> = {
  eta: 'ETA',
  date_do: 'Дата ДО',
  declaration_issue_date: 'Дата выпуска декларации',
  train_depart_date: 'Дата отправки по ЖД',
  train_arrive_date: 'Дата прибытия по ЖД',
  store_arrive_date: 'Дата прибытия на склад',
};

export const outDateNotificationMail = (notifications: RottenData) => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #fb511e; color: #ffffff; padding: 20px;">
          <h1 style="margin: 0;">Уведомление о задержке этапов</h1>
        </div>

        <div style="padding: 30px;">
          ${notifications
            .map(({ container_number, out_dates }) => {
              // Generate the table rows for each date type
              const datesListHtml = out_dates
                .map(({ date_type, date }) => {
                  return `
                    <tr>
                      <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: left;">${DATE_LABELS[date_type]}</td>
                      <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: left;">${formatDate(date)}</td>
                    </tr>`;
                })
                .join('');

              // Construct the HTML for each container's notification
              return `
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #d9534f; font-size: 18px;">Контейнер ${container_number}</h3>
                  <p style="font-size: 16px; color: #333333;">Имеет задержку на следующих этапах:</p>
                  <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
                    <thead>
                      <tr>
                        <th style="border: 1px solid #e0e0e0; padding: 10px; background-color: #f2f2f2; text-align: left;">Этап</th>
                        <th style="border: 1px solid #e0e0e0; padding: 10px; background-color: #f2f2f2; text-align: left;">Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${datesListHtml}
                    </tbody>
                  </table>
                </div>`;
            })
            .join('')}
        </div>
      </div>

      <div style="margin-top: 20px; font-size: 12px; color: #999999;">
        © 2024 Patriot. Все права защищены.
      </div>
    </div>
  `;
};
