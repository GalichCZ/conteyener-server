import { IBaseRepository } from './base-repository.interface';
import { FollowingInput, FollowingOutput } from '../../models/Following.model';
import { Transaction } from 'sequelize';

export interface IFollowingRepository
  extends IBaseRepository<FollowingInput, FollowingOutput> {
  startTransaction(): Promise<Transaction>;
}
