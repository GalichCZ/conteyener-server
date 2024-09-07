import { IBaseRepository } from './base-repository.interface';
import {
  FollowingStoreInput,
  FollowingStoreOutput,
} from '../../models/FollowingStore.model';
import { Transaction } from 'sequelize';

export interface IFollowingStoreRepository
  extends IBaseRepository<FollowingStoreInput, FollowingStoreOutput> {
  deleteByFollowingId(id: string, transaction?: Transaction): Promise<boolean>;
}
