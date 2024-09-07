import { IBaseRepository } from './base-repository.interface';
import { ProviderInput, ProviderOutput } from '../../models/Provider.model';

export interface IProviderRepository
  extends IBaseRepository<ProviderInput, ProviderOutput> {}
