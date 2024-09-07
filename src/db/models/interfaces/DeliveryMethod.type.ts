import { TimeStampsType } from './TimeStamps.type';

export interface DeliveryMethodType extends TimeStampsType {
  id: string;
  method: string;
  description: string;
}
