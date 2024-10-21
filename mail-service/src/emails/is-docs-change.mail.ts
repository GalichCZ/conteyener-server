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
        <li style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          <strong>${changeText}</strong> <br/>
          <span style="color: #555;">${doc}</span> <br/>
          <span style="font-size: 0.9em; color: #999;">${formattedDate}</span> <br/>
          <span style="color: #333;">${isComment ? 'Комментарий: ' + comment_value : ''}</span>
        </li>`;
    }
  );

  const changesListHtml = `
      <ul style="list-style-type: none; padding: 0;">
        ${changesArrayHtml.join('')}
      </ul>
    `;

  return `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h3 style="color: #0066cc;">Заказ ${order_number}</h3>
        <br/>
        ${changesListHtml} 
      </div>
    `;
};
