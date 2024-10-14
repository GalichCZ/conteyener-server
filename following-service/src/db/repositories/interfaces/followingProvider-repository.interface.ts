import { IBaseRepository } from './base-repository.interface';
import {
  FollowingProviderInput,
  FollowingProviderOutput,
} from '../../models/FollowingProvider.model';

export interface IFollowingProviderRepository
  extends IBaseRepository<FollowingProviderInput, FollowingProviderOutput> {
  createMany(providerIds: string[], followingId: string): Promise<void>;
}
