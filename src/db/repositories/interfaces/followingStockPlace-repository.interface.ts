import { IBaseRepository } from './base-repository.interface';
import {
  FollowingStockPlaceInput,
  FollowingStockPlaceOutput,
} from '../../models/FollowingStockPlace.model';

export interface IFollowingStockPlaceRepository
  extends IBaseRepository<FollowingStockPlaceInput, FollowingStockPlaceOutput> {
  deleteByFollowingId(id: string): Promise<boolean>;
}
