import { ISimpleProductRepository } from './interfaces';
import { ProductInput, ProductOutput } from '../models/SimpleProduct.model';
import { SimpleProductModel } from '../models';
import { Op, Transaction } from 'sequelize';
import { ProductBody } from '../../services/types/FollowingBody';

class SimpleProductRepository implements ISimpleProductRepository {
  async deleteMissingProducts(
    missingIds: string[],
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await SimpleProductModel.destroy({
      where: { id: { [Op.in]: missingIds } },
      ...options,
    });
    return deletedCount > 0;
  }

  async createSimpleProducts(
    simpleProducts: string[],
    following_id: string,
    transaction?: Transaction
  ): Promise<ProductOutput[]> {
    const options = transaction ? { transaction } : {};
    const products = await SimpleProductModel.bulkCreate(
      simpleProducts.map((p) => ({ simple_name: p, following_id })),
      options
    );
    return products.map((p) => p.toJSON() as ProductOutput);
  }

  async getProductsByFollowingId(
    following_id: string,
    transaction?: Transaction
  ): Promise<ProductOutput[]> {
    const options = transaction ? { transaction } : {};
    return await SimpleProductModel.findAll({
      where: { following_id },
      ...options,
    });
  }

  async create(
    providerInput: ProductInput,
    transaction?: Transaction
  ): Promise<ProductOutput> {
    const options = transaction ? { transaction } : {};
    const provider = await SimpleProductModel.create(providerInput, {
      ...options,
    });
    return provider.toJSON() as ProductOutput;
  }

  async update(
    id: string,
    providerInput: Partial<ProductInput>
  ): Promise<ProductOutput | null> {
    const provider = await SimpleProductModel.findByPk(id);
    if (!provider) {
      return null;
    }

    await provider.update(providerInput);
    return provider.toJSON() as ProductOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await SimpleProductModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async deleteByFollowingId(id: string, transaction?: Transaction) {
    const options = transaction ? { transaction } : {};
    const deletedCount = await SimpleProductModel.destroy({
      where: { following_id: id },
      ...options,
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<ProductOutput | null> {
    const provider = await SimpleProductModel.findByPk(id);
    if (!provider) {
      return null;
    }

    return provider.toJSON() as ProductOutput;
  }

  async findAll(): Promise<ProductOutput[]> {
    const providers = await SimpleProductModel.findAll();
    return providers.map((provider) => provider.toJSON() as ProductOutput);
  }

  async updateManyByProductIds(
    products_input: ProductBody[],
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const inputProductsWithIds = products_input.filter(({ id }) => id);

    for (const inputProductsWithId of inputProductsWithIds) {
      const product = await SimpleProductModel.findByPk(
        inputProductsWithId.id!,
        {
          ...options,
        }
      );
      if (!product) {
        return false;
      }

      await this.update(product.id, { simple_name: inputProductsWithId.name });
    }

    return true;
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    const values = await SimpleProductModel.findAll({
      attributes: [columnName],
    });

    return values.map((value) => value.get(columnName));
  }
}

export default SimpleProductRepository;
