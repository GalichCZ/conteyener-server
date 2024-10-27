import { CrowdEmail } from './crowd-email';

export interface DateUpdateNotification {
  container_number: string;
  eta: string;
  date_do: string;
  declaration_issue_date: string;
  train_depart_date: string;
  train_arrive_date: string;
  store_arrive_date: string;
  eta_update: boolean;
  date_do_update: boolean;
  declaration_issue_date_update: boolean;
  train_depart_date_update: boolean;
  train_arrive_date_update: boolean;
  store_arrive_date_update: boolean;
  km_to_dist: { dist_was_updated: boolean; km_to_dist: number };
}

export type DateNotification = {
  notification: DateUpdateNotification;
} & CrowdEmail;
