import { TimeStampsType } from './TimeStamps.type';

export interface SimpleProductType extends TimeStampsType {
  id: string;
  simple_name: string;
  following_id: string;
}
