import { TimeStampsType } from './TimeStamps.type';

export interface FollowingStockPlaceType extends TimeStampsType {
  id: string;
  stock_place_id: string;
  following_id: string;
}
