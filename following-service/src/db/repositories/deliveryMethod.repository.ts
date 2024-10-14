import { IDeliveryMethodRepository } from './interfaces';
import {
  DeliveryMethodInput,
  DeliveryMethodOutput,
} from '../models/DeliveryMethod.model';
import { DeliveryMethodModel } from '../models';
import { Transaction } from 'sequelize';
import { removeDuplicates } from '../../utils/remove-duplicates';

class DeliveryMethodRepository implements IDeliveryMethodRepository {
  async create(
    providerInput: DeliveryMethodInput
  ): Promise<DeliveryMethodOutput> {
    const provider = await DeliveryMethodModel.create(providerInput);
    return provider.toJSON() as DeliveryMethodOutput;
  }

  async update(
    id: string,
    providerInput: Partial<DeliveryMethodInput>
  ): Promise<DeliveryMethodOutput | null> {
    const provider = await DeliveryMethodModel.findByPk(id);
    if (!provider) {
      return null;
    }

    await provider.update(providerInput);
    return provider.toJSON() as DeliveryMethodOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await DeliveryMethodModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findById(
    id: string,
    transaction?: Transaction
  ): Promise<DeliveryMethodOutput | null> {
    const options = transaction ? { transaction } : {};
    const provider = await DeliveryMethodModel.findByPk(id, options);
    if (!provider) {
      return null;
    }

    return provider.toJSON() as DeliveryMethodOutput;
  }

  async findAll(): Promise<DeliveryMethodOutput[]> {
    const providers = await DeliveryMethodModel.findAll();
    return providers.map(
      (provider) => provider.toJSON() as DeliveryMethodOutput
    );
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    const values = await DeliveryMethodModel.findAll({
      attributes: ['method'],
    });

    const array = values.map((value) => value.get('method'));

    return removeDuplicates(array);
  }
}

export default DeliveryMethodRepository;
