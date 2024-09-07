import { TimeStampsType } from './TimeStamps.type';

export interface CalculatedDatesType extends TimeStampsType {
  id: string;
  etd: Date;
  eta: Date;
  eta_update: boolean;
  date_do: Date;
  date_do_update: boolean;
  declaration_issue_date: Date;
  declaration_issue_date_update: boolean;
  train_depart_date: Date;
  train_depart_date_update: boolean;
  train_arrive_date: Date;
  train_arrive_date_update: boolean;
  store_arrive_date: Date;
  store_arrive_date_update: boolean;
  following_id: string;
}
