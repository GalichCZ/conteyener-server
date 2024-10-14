import { IBaseRepository } from './base-repository.interface';
import {
  DeclarationStatusInput,
  DeclarationStatusOutput,
} from '../../models/DeclarationStatus.model';
import { Transaction } from 'sequelize';

export interface IDeclarationStatusRepository
  extends IBaseRepository<DeclarationStatusInput, DeclarationStatusOutput> {
  deleteByDeclarationIds(
    declarationIds: string[],
    transaction?: Transaction
  ): Promise<boolean>;
}
