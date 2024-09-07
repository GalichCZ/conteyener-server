import { IBaseRepository } from './base-repository.interface';
import {
  FollowingDeliveryMethodInput,
  FollowingDeliveryMethodOutput,
} from '../../models/FollowingDeliveryMethod.model';
import { Transaction } from 'sequelize';

export interface IFollowingDeliveryMethodRepository
  extends IBaseRepository<
    FollowingDeliveryMethodInput,
    FollowingDeliveryMethodOutput
  > {
  deleteByFollowingId(id: string, transaction?: Transaction): Promise<boolean>;
}
