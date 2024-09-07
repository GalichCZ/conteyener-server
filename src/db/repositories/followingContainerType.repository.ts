import {
  FollowingContainerTypeInput,
  FollowingContainerTypeOutput,
} from '../models/FollowingContainerType.model';
import { FollowingContainerTypeModel } from '../models';
import { IFollowingContainerTypeRepository } from './interfaces';
import { Transaction } from 'sequelize';

class FollowingContainerTypeRepository
  implements IFollowingContainerTypeRepository
{
  async create(
    data: FollowingContainerTypeInput,
    transaction?: Transaction
  ): Promise<FollowingContainerTypeOutput> {
    const record = await FollowingContainerTypeModel.create(data, {
      transaction,
    });
    return record.toJSON() as FollowingContainerTypeOutput;
  }

  async update(
    id: string,
    data: Partial<FollowingContainerTypeInput>
  ): Promise<FollowingContainerTypeOutput | null> {
    const record = await FollowingContainerTypeModel.findByPk(id);
    if (!record) {
      return null;
    }

    await record.update(data);
    return record.toJSON() as FollowingContainerTypeOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await FollowingContainerTypeModel.destroy({
      where: { id },
    });
    return deletedCount > 0;
  }

  async deleteByFollowingId(
    followingId: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await FollowingContainerTypeModel.destroy({
      where: { following_id: followingId },
      ...options,
    });
    return deletedCount > 0;
  }

  async findById(id: string): Promise<FollowingContainerTypeOutput | null> {
    const record = await FollowingContainerTypeModel.findByPk(id);
    if (!record) {
      return null;
    }

    return record.toJSON() as FollowingContainerTypeOutput;
  }

  async findAll(): Promise<FollowingContainerTypeOutput[]> {
    const records = await FollowingContainerTypeModel.findAll();
    return records.map(
      (record) => record.toJSON() as FollowingContainerTypeOutput
    );
  }
}

export default FollowingContainerTypeRepository;
