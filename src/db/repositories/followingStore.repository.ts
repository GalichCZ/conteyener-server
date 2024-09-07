import {
  FollowingStoreInput,
  FollowingStoreOutput,
} from '../models/FollowingStore.model';
import { FollowingStoreModel } from '../models';
import { IFollowingStoreRepository } from './interfaces';
import { Transaction } from 'sequelize';

class FollowingStoreRepository implements IFollowingStoreRepository {
  async create(
    data: FollowingStoreInput,
    transaction?: Transaction
  ): Promise<FollowingStoreOutput> {
    const record = await FollowingStoreModel.create(data, { transaction });
    return record.toJSON() as FollowingStoreOutput;
  }

  async update(
    id: string,
    data: Partial<FollowingStoreInput>
  ): Promise<FollowingStoreOutput | null> {
    const record = await FollowingStoreModel.findByPk(id);
    if (!record) {
      return null;
    }

    await record.update(data);
    return record.toJSON() as FollowingStoreOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await FollowingStoreModel.destroy({ where: { id } });
    return deletedCount > 0;
  }

  async deleteByFollowingId(id: string, transaction?: Transaction) {
    const options = transaction ? { transaction } : {};
    const deletedCount = await FollowingStoreModel.destroy({
      where: { following_id: id },
      ...options,
    });
    return deletedCount > 0;
  }

  async findById(id: string): Promise<FollowingStoreOutput | null> {
    const record = await FollowingStoreModel.findByPk(id);
    if (!record) {
      return null;
    }

    return record.toJSON() as FollowingStoreOutput;
  }

  async findAll(): Promise<FollowingStoreOutput[]> {
    const records = await FollowingStoreModel.findAll();
    return records.map((record) => record.toJSON() as FollowingStoreOutput);
  }
}

export default FollowingStoreRepository;
