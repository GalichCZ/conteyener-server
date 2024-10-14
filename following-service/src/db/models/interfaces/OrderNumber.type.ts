import { TimeStampsType } from './TimeStamps.type';

export interface OrderNumberType extends TimeStampsType {
  id: string;
  number: string;
  following_id: string;
}
