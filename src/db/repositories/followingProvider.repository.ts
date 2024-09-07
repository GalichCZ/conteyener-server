import {
  FollowingProviderInput,
  FollowingProviderOutput,
} from '../models/FollowingProvider.model';
import { FollowingProviderModel } from '../models';
import { IFollowingProviderRepository } from './interfaces';
import { Transaction } from 'sequelize';

class FollowingProviderRepository implements IFollowingProviderRepository {
  async create(data: FollowingProviderInput): Promise<FollowingProviderOutput> {
    const record = await FollowingProviderModel.create(data);
    return record.toJSON() as FollowingProviderOutput;
  }

  async update(
    id: string,
    data: Partial<FollowingProviderInput>
  ): Promise<FollowingProviderOutput | null> {
    const record = await FollowingProviderModel.findByPk(id);
    if (!record) {
      return null;
    }

    await record.update(data);
    return record.toJSON() as FollowingProviderOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await FollowingProviderModel.destroy({
      where: { id },
    });
    return deletedCount > 0;
  }

  async deleteByFollowingId(
    id: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await FollowingProviderModel.destroy({
      where: { following_id: id },
      ...options,
    });
    return deletedCount > 0;
  }

  async findById(id: string): Promise<FollowingProviderOutput | null> {
    const record = await FollowingProviderModel.findByPk(id);
    if (!record) {
      return null;
    }

    return record.toJSON() as FollowingProviderOutput;
  }

  async findAll(): Promise<FollowingProviderOutput[]> {
    const records = await FollowingProviderModel.findAll();
    return records.map((record) => record.toJSON() as FollowingProviderOutput);
  }

  async createMany(
    providerIds: string[],
    followingId: string,
    transaction?: Transaction
  ): Promise<void> {
    const options = transaction ? { transaction } : {};
    await FollowingProviderModel.bulkCreate(
      providerIds.map((id) => ({
        provider_id: id,
        following_id: followingId,
      })),
      options
    );
  }
}

export default FollowingProviderRepository;
