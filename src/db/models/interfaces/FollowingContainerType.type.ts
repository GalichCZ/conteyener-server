import { TimeStampsType } from './TimeStamps.type';

export interface FollowingContainerTypeType extends TimeStampsType {
  id: string;
  container_type_id: string;
  following_id: string;
}
