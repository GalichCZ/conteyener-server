/*
 * this is old typed interface
 * used in old version of following service
 * */
export interface Following {
  _id: string;
  container_number: string;
  eta: string;
  eta_update: boolean;
  date_do: string;
  date_do_update: boolean;
  declaration_issue_date: string;
  declaration_issue_date_update: boolean;
  train_depart_date: string;
  train_depart_date_update: boolean;
  train_arrive_date: string;
  train_arrive_date_update: boolean;
  store_arrive_date: string;
  store_arrive_date_update: boolean;
}
