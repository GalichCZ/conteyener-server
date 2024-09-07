import { TimeStampsType } from './TimeStamps.type';

export interface KmToDistCalculateType extends TimeStampsType {
  id: string;
  km_to_dist: number;
  km_was_updated: boolean;
  following_id: string;
}
