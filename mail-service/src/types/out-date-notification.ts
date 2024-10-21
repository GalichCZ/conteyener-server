import { CrowdEmail } from './crowd-email';

export type OutDate = {
  date_type: string;
  date: string;
};

export type OutDateNotification = {
  out_dates: OutDate[];
  container_number: string;
} & CrowdEmail;
