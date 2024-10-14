import {
  DeclarationInput,
  DeclarationOutput,
} from '../../models/Declaration.model';
import { IBaseRepository } from './base-repository.interface';
import { Transaction } from 'sequelize';

export interface IDeclarationRepository
  extends IBaseRepository<DeclarationInput, DeclarationOutput> {
  deleteByFollowingId(id: string, transaction?: Transaction): Promise<boolean>;
  findAllByFollowingId(
    id: string,
    transaction?: Transaction
  ): Promise<DeclarationOutput[]>;
  deleteMissingDeclarations(
    inputIds: string[],
    following_id: string,
    transaction?: Transaction
  ): Promise<boolean>;
  getDeclarationsByFollowingId(
    following_id: string,
    transaction?: Transaction
  ): Promise<DeclarationOutput[]>;
}
