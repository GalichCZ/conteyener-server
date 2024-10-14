import { TimeStampsType } from './TimeStamps.type';

export interface StockPlaceType extends TimeStampsType {
  id: string;
  name: string;
  contact: string;
  address: string;
  note: string;
}
