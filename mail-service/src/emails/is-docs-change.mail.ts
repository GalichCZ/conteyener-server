import { IsDocsNotification } from '../types/is-docs-updates';
import { formatDateWithTime } from '../utils/format-date-with-time';

const CHANGE_TYPES: Record<string, string> = {
  switched_true: 'Документ добавлен',
  switched_false: 'Документ убран',
  comment_changed: 'Изменен комментарий',
  comment_added: 'Добавлен комментарий',
  comment_deleted: 'Удален комментарий',
};
const DOC_NAMES: Record<string, string> = {
  pi: 'PI',
  ci: 'CI',
  pl: 'PL',
  ss_ds: 'СС/ДС',
  contract_agrees: 'Контракт и действующие доп. соглашения',
  cost_agrees: 'Стоимостные доп. соглашения',
  instruction: 'Инструкция',
  common_comment: 'Общий комментарий',
  ed: 'ED',
  co: 'CO',
  bill: 'Счет',
};

export const isDocsChangeMail = (data: IsDocsNotification) => {
  const { changes, order_number } = data;

  const changesArrayHtml = changes.map(
    ({ change_type, doc_name, date, comment_value }) => {
      const changeText = CHANGE_TYPES[change_type];
      const doc = DOC_NAMES[doc_name.toLowerCase()];
      const isComment =
        change_type === 'comment_changed' || change_type === 'comment_added';
      const formattedDate = formatDateWithTime(date);
      return `
        <li style="margin-bottom: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #ffffff;">
          <strong style="color: #fb511e;">${changeText}</strong> <br/>
          <span style="color: #555;">${doc}</span> <br/>
          <span style="font-size: 0.9em; color: #999;">${formattedDate}</span> <br/>
          ${isComment ? `<span style="color: #333;">Комментарий: ${comment_value}</span>` : ''}
        </li>`;
    }
  );

  const changesListHtml = `
      <ul style="list-style-type: none; padding: 0; margin: 0;">
        ${changesArrayHtml.join('')}
      </ul>
    `;

  return `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #fb511e; color: #ffffff; padding: 20px;">
            <h1 style="margin: 0;">Обновления по заказу ${order_number}</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333333;">Детали обновлений:</p>
            ${changesListHtml}
          </div>
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999999;">
            © 2024 Patriot. Все права защищены.
        </div>
      </div>
    `;
};
