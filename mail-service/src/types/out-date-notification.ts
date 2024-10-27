import { CrowdEmail } from './crowd-email';

export type OutDate = {
  date_type: string;
  date: string;
};

export type RottenData = Array<{
  out_dates: OutDate[];
  container_number: string;
}>;

export type OutDateNotification = {
  rotten_data: RottenData;
} & CrowdEmail;
