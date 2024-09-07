import { IBaseRepository } from './base-repository.interface';
import {
  FollowingContainerTypeInput,
  FollowingContainerTypeOutput,
} from '../../models/FollowingContainerType.model';

export interface IFollowingContainerTypeRepository
  extends IBaseRepository<
    FollowingContainerTypeOutput,
    FollowingContainerTypeInput
  > {
  deleteByFollowingId(id: string): Promise<boolean>;
}
