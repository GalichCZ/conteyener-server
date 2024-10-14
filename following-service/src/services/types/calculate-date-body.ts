export enum DateType {
  eta = 'eta',
  date_do = 'date_do',
  declaration_issue_date = 'declaration_issue_date',
  train_depart_date = 'train_depart_date',
  train_arrive_date = 'train_arrive_date',
  store_arrive_date = 'store_arrive_date',
}

export type DateTypeKey = keyof typeof DateType;

export interface CalculateDateBody {
  date_type: DateTypeKey;
  date: Date;
  delivery_channel_id: string;
  following_id: string;
}
