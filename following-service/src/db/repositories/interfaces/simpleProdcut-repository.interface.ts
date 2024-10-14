import { IBaseRepository } from './base-repository.interface';
import { ProductInput, ProductOutput } from '../../models/SimpleProduct.model';
import { Transaction } from 'sequelize';
import { ProductBody } from '../../../services/types/FollowingBody';

export interface ISimpleProductRepository
  extends IBaseRepository<ProductInput, ProductOutput> {
  deleteByFollowingId(id: string, transaction?: Transaction): Promise<boolean>;
  deleteMissingProducts(
    missingIds: string[],
    transaction?: Transaction
  ): Promise<boolean>;
  getProductsByFollowingId(
    following_id: string,
    transaction?: Transaction
  ): Promise<ProductOutput[]>;
  updateManyByProductIds(
    products_input: ProductBody[],
    transaction?: Transaction
  ): Promise<boolean>;
  createSimpleProducts(
    simpleProducts: string[],
    following_id: string,
    transaction?: Transaction
  ): Promise<ProductOutput[]>;
}
