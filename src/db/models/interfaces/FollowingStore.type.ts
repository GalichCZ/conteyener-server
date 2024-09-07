import { TimeStampsType } from './TimeStamps.type';

export interface FollowingStoreType extends TimeStampsType {
  id: string;
  store_id: string;
  following_id: string;
}
