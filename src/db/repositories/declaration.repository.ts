import { DeclarationModel } from '../models';
import {
  DeclarationInput,
  DeclarationOutput,
} from '../models/Declaration.model';
import { IDeclarationRepository } from './interfaces/declaration-repository.interface';
import { Transaction } from 'sequelize';

class DeclarationRepository implements IDeclarationRepository {
  async create(input: DeclarationInput): Promise<DeclarationOutput> {
    const declaration = await DeclarationModel.create(input);
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
}

export default DeclarationRepository;
