import { IBaseRepository } from './base-repository.interface';
import {
  CalculatedDateInput,
  CalculatedDateOutput,
} from '../../models/CalculatedDate.model';
import { Transaction } from 'sequelize';

export interface ICalculatedDateRepository
  extends IBaseRepository<CalculatedDateInput, CalculatedDateOutput> {
  deleteByFollowingId(followingId: string): Promise<boolean>;
  findByFollowingId(
    followingId: string,
    transaction?: Transaction
  ): Promise<CalculatedDateOutput | null>;
}
