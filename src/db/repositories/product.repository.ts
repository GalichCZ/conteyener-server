import { IBaseRepository, IProductRepository } from './interfaces';
import { ProductInput, ProductOutput } from '../models/Product.model';
import { ProductModel } from '../models';
import { Transaction } from 'sequelize';

class ProductRepository implements IProductRepository {
  async create(providerInput: ProductInput): Promise<ProductOutput> {
    const provider = await ProductModel.create(providerInput);
    return provider.toJSON() as ProductOutput;
  }

  async update(
    id: string,
    providerInput: Partial<ProductInput>
  ): Promise<ProductOutput | null> {
    const provider = await ProductModel.findByPk(id);
    if (!provider) {
      return null;
    }

    await provider.update(providerInput);
    return provider.toJSON() as ProductOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await ProductModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async deleteByFollowingId(id: string, transaction?: Transaction) {
    const options = transaction ? { transaction } : {};
    const deletedCount = await ProductModel.destroy({
      where: { following_id: id },
      ...options,
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<ProductOutput | null> {
    const provider = await ProductModel.findByPk(id);
    if (!provider) {
      return null;
    }

    return provider.toJSON() as ProductOutput;
  }

  async findAll(): Promise<ProductOutput[]> {
    const providers = await ProductModel.findAll();
    return providers.map((provider) => provider.toJSON() as ProductOutput);
  }
}

export default ProductRepository;
