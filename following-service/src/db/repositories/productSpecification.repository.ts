import { IProductSpecificationRepository } from './interfaces/productSpecification-repository.interface';
import ProductSpecificationModel, {
  ProductSpecificationInput,
  ProductSpecificationOutput,
} from '../models/ProductSpecification.model';
import { Op, Transaction } from 'sequelize';

class ProductSpecificationRepository
  implements IProductSpecificationRepository
{
  async deleteBySimpleProductIds(
    ids: string[],
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await ProductSpecificationModel.destroy({
      where: { simple_product_id: { [Op.in]: ids } },
      ...options,
    });

    return deletedCount > 0;
  }
  async create(
    item: ProductSpecificationInput,
    transaction?: Transaction
  ): Promise<ProductSpecificationOutput> {
    return Promise.resolve({} as ProductSpecificationOutput);
  }

  async delete(id: string, transaction?: Transaction): Promise<boolean> {
    return Promise.resolve(false);
  }

  async findAll(): Promise<ProductSpecificationOutput[]> {
    return Promise.resolve([]);
  }

  async findById(id: string): Promise<ProductSpecificationOutput | null> {
    return Promise.resolve(null);
  }

  async update(
    id: string,
    item: Partial<ProductSpecificationInput>,
    transaction?: Transaction
  ): Promise<ProductSpecificationOutput | null> {
    return Promise.resolve(null);
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    return Promise.resolve(undefined);
  }
}

export default ProductSpecificationRepository;
