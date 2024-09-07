import { IContainerTypeRepository } from './interfaces';
import { ContainerTypeModel } from '../models';
import {
  ContainerTypeInput,
  ContainerTypeOutput,
} from '../models/ContainerType.model';
import { Transaction } from 'sequelize';

class ContainerTypeRepository implements IContainerTypeRepository {
  async create(
    providerInput: ContainerTypeInput
  ): Promise<ContainerTypeOutput> {
    const provider = await ContainerTypeModel.create(providerInput);
    return provider.toJSON() as ContainerTypeOutput;
  }

  async update(
    id: string,
    providerInput: Partial<ContainerTypeInput>
  ): Promise<ContainerTypeOutput | null> {
    const provider = await ContainerTypeModel.findByPk(id);
    if (!provider) {
      return null;
    }

    await provider.update(providerInput);
    return provider.toJSON() as ContainerTypeOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await ContainerTypeModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findById(
    id: string,
    transaction?: Transaction
  ): Promise<ContainerTypeOutput | null> {
    const options = transaction ? { transaction } : {};
    const provider = await ContainerTypeModel.findByPk(id, options);
    if (!provider) {
      return null;
    }

    return provider.toJSON() as ContainerTypeOutput;
  }

  async findAll(): Promise<ContainerTypeOutput[]> {
    const providers = await ContainerTypeModel.findAll();
    return providers.map(
      (provider) => provider.toJSON() as ContainerTypeOutput
    );
  }
}

export default ContainerTypeRepository;
