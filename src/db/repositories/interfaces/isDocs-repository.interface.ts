import { IBaseRepository } from './base-repository.interface';
import { IsDocsInput, IsDocsOutput } from '../../models/IsDoc.model';
import { Transaction } from 'sequelize';

export interface IIsDocsRepository
  extends IBaseRepository<IsDocsInput, IsDocsOutput> {
  createIsDocs(orderNumberIds: string[]): Promise<IsDocsOutput[]>;
  deleteByOrderNumberIds(
    orderNumberIds: string[],
    transaction?: Transaction
  ): Promise<boolean>;
}
