import { TimeStampsType } from './TimeStamps.type';

export interface DeclarationType extends TimeStampsType {
  id: string;
  number: string;
  following_id: string;
}
