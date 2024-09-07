import { IBaseRepository } from './base-repository.interface';
import {
  KmToDistCalculateInput,
  KmToDistCalculateOutput,
} from '../../models/KmToDistCalculate.model';

export interface IKmToDistCalculateRepository
  extends IBaseRepository<KmToDistCalculateInput, KmToDistCalculateOutput> {
  deleteByFollowingId(followingId: string): Promise<boolean>;
}
