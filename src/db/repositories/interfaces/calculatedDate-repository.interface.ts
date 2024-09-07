import { IBaseRepository } from './base-repository.interface';
import {
  CalculatedDateInput,
  CalculatedDateOutput,
} from '../../models/CalculatedDate.model';

export interface ICalculatedDateRepository
  extends IBaseRepository<CalculatedDateInput, CalculatedDateOutput> {
  deleteByFollowingId(followingId: string): Promise<boolean>;
}
