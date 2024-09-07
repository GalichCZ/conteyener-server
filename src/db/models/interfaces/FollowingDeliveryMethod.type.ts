import { TimeStampsType } from './TimeStamps.type';

export interface FollowingDeliveryMethodType extends TimeStampsType {
  id: string;
  delivery_method_id: string;
  following_id: string;
}
