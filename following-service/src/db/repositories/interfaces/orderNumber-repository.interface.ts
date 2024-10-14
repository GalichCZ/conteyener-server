import { IBaseRepository } from './base-repository.interface';
import {
  OrderNumberInput,
  OrderNumberOutput,
} from '../../models/OrderNumber.model';
import { Transaction } from 'sequelize';
import { OrderNumber } from '../../../services/types/FollowingBody';

export interface IOrderNumberRepository
  extends IBaseRepository<OrderNumberInput, OrderNumberOutput> {
  isAtLeastOneOrderNumber(order_numbers: string[]): Promise<string[]>;
  createOrderNumbers(
    order_numbers: string[],
    following_id: string
  ): Promise<OrderNumberOutput[]>;
  deleteByFollowingId(following_id: string): Promise<boolean>;
  deleteMissingOrderNumbers(
    missingIds: string[],
    transaction?: Transaction
  ): Promise<boolean>;
  updateManyByOrderNumberIds(
    order_numbers_input: OrderNumber[],
    transaction?: Transaction
  ): Promise<boolean>;
}
