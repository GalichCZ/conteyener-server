import { IDeclarationStatusRepository } from './interfaces';
import {
  DeclarationStatusInput,
  DeclarationStatusOutput,
} from '../models/DeclarationStatus.model';
import { DeclarationStatusModel } from '../models';
import { Transaction } from 'sequelize';

class DeclarationStatusRepository implements IDeclarationStatusRepository {
  async create(
    providerInput: DeclarationStatusInput
  ): Promise<DeclarationStatusOutput> {
    const provider = await DeclarationStatusModel.create(providerInput);
    return provider.toJSON() as DeclarationStatusOutput;
  }

  async update(
    id: string,
    providerInput: Partial<DeclarationStatusInput>
  ): Promise<DeclarationStatusOutput | null> {
    const provider = await DeclarationStatusModel.findByPk(id);
    if (!provider) {
      return null;
    }

    await provider.update(providerInput);
    return provider.toJSON() as DeclarationStatusOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await DeclarationStatusModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<DeclarationStatusOutput | null> {
    const provider = await DeclarationStatusModel.findByPk(id);
    if (!provider) {
      return null;
    }

    return provider.toJSON() as DeclarationStatusOutput;
  }

  async findAll(): Promise<DeclarationStatusOutput[]> {
    const providers = await DeclarationStatusModel.findAll();
    return providers.map(
      (provider) => provider.toJSON() as DeclarationStatusOutput
    );
  }

  async deleteByDeclarationIds(
    declarationIds: string[],
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await DeclarationStatusModel.destroy({
      where: { declaration_number_id: declarationIds },
      ...options,
    });

    return deletedCount > 0;
  }

  getAllColumnValues(columnName: string): Promise<any> {
    return Promise.resolve(undefined);
  }
}

export default DeclarationStatusRepository;
