import { TimeStampsType } from './TimeStamps.type';

export interface FollowingProviderType extends TimeStampsType {
  id: string;
  provider_id: string;
  following_id: string;
}
