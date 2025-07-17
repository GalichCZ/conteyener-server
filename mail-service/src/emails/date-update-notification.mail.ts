import { DateUpdateNotification } from '../types/date-update-notification';
import { formatDate } from '../utils/format-date';

export const dateUpdateNotificationMail = (data: DateUpdateNotification) => {
  const {
    eta,
    date_do,
    declaration_issue_date,
    train_depart_date,
    train_arrive_date,
    store_arrive_date,
    train_depart_date_update,
    train_arrive_date_update,
    eta_update,
    date_do_update,
    declaration_issue_date_update,
    store_arrive_date_update,
    container_number,
    km_to_dist,
    products,
  } = data;

  return `
   <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 900px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #fb511e; color: #ffffff; padding: 20px;">
            <h1 style="margin: 0;">Обновление данных по контейнеру ${container_number}</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333333;">Км. до станции назначения: ${km_to_dist.km_to_dist}</p>
            <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">Товар</th>
                <th style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">ETA</th>
                <th style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">Дата ДО</th>
                <th style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">Дата выпуска декларации</th>
                <th style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">Дата отправки по ЖД</th>
                <th style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">Дата прибытия по ЖД</th>
                <th style="border: 1px solid #ddd; padding: 10px; font-size: 14px;">Дата прибытия на склад</th>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; color: #333333;">${products.join('\n')}</td>
                <td style="border: 1px solid #ddd; padding: 10px; color: #333333;">${formatDate(eta)} ${eta_update ? 'Фактическая' : 'Расчетная'}</td>
                <td style="border: 1px solid #ddd; padding: 10px; color: #333333;">${formatDate(date_do)} ${date_do_update ? 'Фактическая' : 'Расчетная'}</td>
                <td style="border: 1px solid #ddd; padding: 10px; color: #333333;">${formatDate(declaration_issue_date)} ${declaration_issue_date_update ? 'Фактическая' : 'Расчетная'}</td>
                <td style="border: 1px solid #ddd; padding: 10px; color: #333333;">${formatDate(train_depart_date)} ${train_depart_date_update ? 'Фактическая' : 'Расчетная'}</td>
                <td style="border: 1px solid #ddd; padding: 10px; color: #333333;">${formatDate(train_arrive_date)} ${train_arrive_date_update ? 'Фактическая' : 'Расчетная'}</td>
                <td style="border: 1px solid #ddd; padding: 10px; color: #333333;">${formatDate(store_arrive_date)} ${store_arrive_date_update ? 'Фактическая' : 'Расчетная'}</td>
              </tr>
            </table>
          </div>
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999999;">
          © 2024 Patriot. Все права защищены.
        </div>
      </div>`;
};
