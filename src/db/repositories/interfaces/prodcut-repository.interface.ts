import { IBaseRepository } from './base-repository.interface';
import { ProductInput, ProductOutput } from '../../models/Product.model';
import { Transaction } from 'sequelize';

export interface IProductRepository
  extends IBaseRepository<ProductInput, ProductOutput> {
  deleteByFollowingId(id: string, transaction?: Transaction): Promise<boolean>;
}
