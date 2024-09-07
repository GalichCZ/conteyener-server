import { TimeStampsType } from './TimeStamps.type';

export interface FollowingDeliveryChannelType extends TimeStampsType {
  id: string;
  delivery_channel_id: string;
  following_id: string;
}
