import { TimeStampsType } from './TimeStamps.type';

export interface CalculatedDatesType extends TimeStampsType {
  id: string;
  etd: Date;
  eta: Date | null;
  eta_update: boolean;
  date_do: Date | null;
  date_do_update: boolean;
  declaration_issue_date: Date | null;
  declaration_issue_date_update: boolean;
  train_depart_date: Date | null;
  train_depart_date_update: boolean;
  train_arrive_date: Date | null;
  train_arrive_date_update: boolean;
  store_arrive_date: Date | null;
  store_arrive_date_update: boolean;
  following_id: string;
}
