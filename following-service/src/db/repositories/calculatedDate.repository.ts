import { ICalculatedDateRepository } from './interfaces';
import { CalculatedDateModel } from '../models';
import {
  CalculatedDateInput,
  CalculatedDateOutput,
} from '../models/CalculatedDate.model';
import { Transaction } from 'sequelize';
import { removeDuplicates } from '../../utils/remove-duplicates';

class CalculatedDateRepository implements ICalculatedDateRepository {
  async deleteByFollowingId(
    followingId: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await CalculatedDateModel.destroy({
      where: { following_id: followingId },
      ...options,
    });

    return deletedCount > 0;
  }

  async findByFollowingId(
    followingId: string,
    transaction?: Transaction
  ): Promise<CalculatedDateOutput | null> {
    const options = transaction ? { transaction } : {};
    const record = await CalculatedDateModel.findOne({
      where: { following_id: followingId },
      ...options,
    });
    if (!record) {
      return null;
    }
    return record.toJSON() as CalculatedDateOutput;
  }

  async create(input: CalculatedDateInput): Promise<CalculatedDateOutput> {
    const record = await CalculatedDateModel.create(input);
    return record.toJSON() as CalculatedDateOutput;
  }

  async update(
    id: string,
    input: Partial<CalculatedDateInput>,
    transaction?: Transaction
  ): Promise<CalculatedDateOutput | null> {
    const record = await CalculatedDateModel.findByPk(id);
    if (!record) {
      return null;
    }

    await record.update(input);
    return record.toJSON() as CalculatedDateOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await CalculatedDateModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<CalculatedDateOutput | null> {
    const record = await CalculatedDateModel.findByPk(id);
    if (!record) {
      return null;
    }

    return record.toJSON() as CalculatedDateOutput;
  }

  async findAll(): Promise<CalculatedDateOutput[]> {
    const records = await CalculatedDateModel.findAll();
    return records.map((record) => record.toJSON() as CalculatedDateOutput);
  }

  async startTransaction() {
    return await CalculatedDateModel.sequelize!.transaction();
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    const values = await CalculatedDateModel.findAll({
      attributes: [columnName],
    });

    const array = values.map((value) => value.get(columnName));

    if (!array.length) return [];

    return removeDuplicates(array);
  }
}

export default CalculatedDateRepository;
