import { StoreInput, StoreOutput } from '../../models/Store.model';
import { IBaseRepository } from './base-repository.interface';

export interface IStoreRepository
  extends IBaseRepository<StoreInput, StoreOutput> {}
