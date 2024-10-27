import { OutDate } from "./out-date";

export type RottenData = Array<{
  out_dates: OutDate[];
  container_number: string;
  _id: string;
}>;
