import { IBaseRepository } from './base-repository.interface';
import {
  OrderNumberInput,
  OrderNumberOutput,
} from '../../models/OrderNumber.model';

export interface IOrderNumberRepository
  extends IBaseRepository<OrderNumberInput, OrderNumberOutput> {
  isAtLeastOneOrderNumber(order_numbers: string[]): Promise<string[]>;
  createOrderNumbers(
    order_numbers: string[],
    following_id: string
  ): Promise<OrderNumberOutput[]>;
  deleteByFollowingId(following_id: string): Promise<boolean>;
}
