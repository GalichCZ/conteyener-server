import { TimeStampsType } from './TimeStamps.type';

export interface StoreType extends TimeStampsType {
  id: string;
  name: string;
  receiver: string;
  address: string;
  contact: string;
  note: string;
}
