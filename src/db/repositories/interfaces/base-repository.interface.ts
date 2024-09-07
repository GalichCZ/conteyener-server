import { Transaction } from 'sequelize';

export interface IBaseRepository<I, O> {
  create(item: I, transaction?: Transaction): Promise<O>;
  update(
    id: string,
    item: Partial<I>,
    transaction?: Transaction
  ): Promise<O | null>;
  delete(id: string, transaction?: Transaction): Promise<boolean>;
  findById(id: string): Promise<O | null>;
  findAll(): Promise<O[]>;
}
