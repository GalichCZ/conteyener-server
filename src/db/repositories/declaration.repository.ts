import { DeclarationModel } from '../models';
import {
  DeclarationInput,
  DeclarationOutput,
} from '../models/Declaration.model';
import { IDeclarationRepository } from './interfaces';
import { Op, Transaction } from 'sequelize';
import { getMissingStringsFromInput } from '../../utils';

class DeclarationRepository implements IDeclarationRepository {
  async deleteMissingDeclarations(
    inputIds: string[],
    following_id: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const declarations = await this.getDeclarationsByFollowingId(
      following_id,
      transaction
    );
    const declarationIds = declarations.map((d) => d.id);
    const missingIds = getMissingStringsFromInput(inputIds, declarationIds);
    const deletedCount = await DeclarationModel.destroy({
      where: { id: { [Op.in]: missingIds } },
      ...options,
    });
    return deletedCount > 0;
  }

  async getDeclarationsByFollowingId(
    following_id: string,
    transaction?: Transaction
  ): Promise<DeclarationOutput[]> {
    const options = transaction ? { transaction } : {};
    return await DeclarationModel.findAll({
      where: { following_id },
      ...options,
    });
  }

  async create(
    input: DeclarationInput,
    transaction?: Transaction
  ): Promise<DeclarationOutput> {
    const options = transaction ? { transaction } : {};
    const declaration = await DeclarationModel.create(input, { ...options });
    return declaration.toJSON() as DeclarationOutput;
  }

  async update(
    id: string,
    input: Partial<DeclarationInput>
  ): Promise<DeclarationOutput | null> {
    const declaration = await DeclarationModel.findByPk(id);
    if (!declaration) {
      return null;
    }

    await declaration.update(input);
    return declaration.toJSON() as DeclarationOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await DeclarationModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async deleteByFollowingId(
    id: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await DeclarationModel.destroy({
      where: { following_id: id },
      ...options,
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<DeclarationOutput | null> {
    const declaration = await DeclarationModel.findByPk(id);
    if (!declaration) {
      return null;
    }

    return declaration.toJSON() as DeclarationOutput;
  }

  async findAll(): Promise<DeclarationOutput[]> {
    const declarations = await DeclarationModel.findAll();
    return declarations.map(
      (declaration) => declaration.toJSON() as DeclarationOutput
    );
  }

  async findAllByFollowingId(
    id: string,
    transaction?: Transaction
  ): Promise<DeclarationOutput[]> {
    const options = transaction ? { transaction } : {};

    const declarations = await DeclarationModel.findAll({
      where: { following_id: id },
      ...options,
    });

    return declarations.map(
      (declaration) => declaration.toJSON() as DeclarationOutput
    );
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    const values = await DeclarationModel.findAll({
      attributes: [columnName],
    });

    return values.map((value) => value.get(columnName));
  }
}

export default DeclarationRepository;
