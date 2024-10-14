import { IBaseRepository } from './base-repository.interface';
import {
  KmToDistCalculateInput,
  KmToDistCalculateOutput,
} from '../../models/KmToDistCalculate.model';
import { Transaction } from 'sequelize';

export interface IKmToDistCalculateRepository
  extends IBaseRepository<KmToDistCalculateInput, KmToDistCalculateOutput> {
  deleteByFollowingId(followingId: string): Promise<boolean>;
  updateByFollowingId(
    followingId: string,
    input: Partial<KmToDistCalculateInput>,
    transaction?: Transaction
  ): Promise<KmToDistCalculateOutput | null>;
}
