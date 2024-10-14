import { IKmToDistCalculateRepository } from './interfaces';
import {
  KmToDistCalculateInput,
  KmToDistCalculateOutput,
} from '../models/KmToDistCalculate.model';
import { KmToDistCalculateModel } from '../models';
import { Transaction } from 'sequelize';
import { removeDuplicates } from '../../utils/remove-duplicates';

class KmToDistCalculateRepository implements IKmToDistCalculateRepository {
  async create(
    input: KmToDistCalculateInput
  ): Promise<KmToDistCalculateOutput> {
    const record = await KmToDistCalculateModel.create(input);
    return record.toJSON() as KmToDistCalculateOutput;
  }

  async update(
    id: string,
    input: Partial<KmToDistCalculateInput>
  ): Promise<KmToDistCalculateOutput | null> {
    const record = await KmToDistCalculateModel.findByPk(id);
    if (!record) {
      return null;
    }

    await record.update(input);
    return record.toJSON() as KmToDistCalculateOutput;
  }

  async updateByFollowingId(
    followingId: string,
    input: Partial<KmToDistCalculateInput>,
    transaction?: Transaction
  ): Promise<KmToDistCalculateOutput | null> {
    const options = transaction ? { transaction } : {};
    const record = await KmToDistCalculateModel.findOne({
      where: { following_id: followingId },
      ...options,
    });
    if (!record) {
      return null;
    }

    await record.update(input);
    return record.toJSON() as KmToDistCalculateOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await KmToDistCalculateModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<KmToDistCalculateOutput | null> {
    const record = await KmToDistCalculateModel.findByPk(id);
    if (!record) {
      return null;
    }

    return record.toJSON() as KmToDistCalculateOutput;
  }

  async findAll(): Promise<KmToDistCalculateOutput[]> {
    const records = await KmToDistCalculateModel.findAll();
    return records.map((record) => record.toJSON() as KmToDistCalculateOutput);
  }

  async deleteByFollowingId(
    followingId: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};

    const deletedCount = await KmToDistCalculateModel.destroy({
      where: { following_id: followingId },
      ...options,
    });

    return deletedCount > 0;
  }

  async startTransaction() {
    return await KmToDistCalculateModel.sequelize!.transaction();
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    const values = await KmToDistCalculateModel.findAll({
      attributes: [columnName],
    });

    const array = values.map((value) => value.get(columnName));

    return removeDuplicates(array);
  }
}

export default KmToDistCalculateRepository;
