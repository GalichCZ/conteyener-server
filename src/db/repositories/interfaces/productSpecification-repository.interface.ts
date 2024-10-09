import { IBaseRepository } from './base-repository.interface';
import {
  ProductSpecificationInput,
  ProductSpecificationOutput,
} from '../../models/ProductSpecification.model';
import { Transaction } from 'sequelize';

export interface IProductSpecificationRepository
  extends IBaseRepository<
    ProductSpecificationInput,
    ProductSpecificationOutput
  > {
  deleteBySimpleProductIds(
    ids: string[],
    transaction?: Transaction
  ): Promise<boolean>;
}
