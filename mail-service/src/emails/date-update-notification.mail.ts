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
  } = data;

  return `
               <div>
                 <h3>Номер контейнера ${container_number}</h3>
                 <h3>Км. до станции назначения ${km_to_dist}</h3>
                 <table style="border-collapse: collapse; width: 100%;">
                   <tr>
                      <td style="border: 1px solid black; padding: 8px;">ETA</td>
                      <td style="border: 1px solid black; padding: 8px;">Дата ДО</td>
                      <td style="border: 1px solid black; padding: 8px;">Дата выпуска декларации</td>
                      <td style="border: 1px solid black; padding: 8px;">Дата отправки по ЖД</td>
                      <td style="border: 1px solid black; padding: 8px;">Дата прибытия по ЖД</td>
                      <td style="border: 1px solid black; padding: 8px;">Дата прибытия на склад</td>
                   </tr>
                   <tr>
                      <td style="border: 1px solid black; padding: 8px;">${formatDate(eta)} ${eta_update ? 'Фактическая' : 'Расчетная'}</td>
                      <td style="border: 1px solid black; padding: 8px;">${formatDate(date_do)} ${date_do_update ? 'Фактическая' : 'Расчетная'}</td>
                      <td style="border: 1px solid black; padding: 8px;">${formatDate(declaration_issue_date)} ${declaration_issue_date_update ? 'Фактическая' : 'Расчетная'}</td>
                      <td style="border: 1px solid black; padding: 8px;">${formatDate(train_depart_date)} ${train_depart_date_update ? 'Фактическая' : 'Расчетная'}</td>
                      <td style="border: 1px solid black; padding: 8px;">${formatDate(train_arrive_date)} ${train_arrive_date_update ? 'Фактическая' : 'Расчетная'}</td>
                      <td style="border: 1px solid black; padding: 8px;">${formatDate(store_arrive_date)} ${store_arrive_date_update ? 'Фактическая' : 'Расчетная'}</td>
                   </tr>
                 </table>
               </div>
            `;
};
