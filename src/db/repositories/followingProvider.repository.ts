import {
  FollowingProviderInput,
  FollowingProviderOutput,
} from '../models/FollowingProvider.model';
import { FollowingProviderModel } from '../models';
import { IFollowingProviderRepository } from './interfaces';
import { Transaction } from 'sequelize';
import { getMissingStringsFromInput } from '../../utils/getMissingStringsFromInput';

class FollowingProviderRepository implements IFollowingProviderRepository {
  async deleteMissingProvidersRelations(
    inputIds: string[],
    followingId: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const relatedProviderIds = await this.getByFollowingId(
      followingId,
      transaction
    );
    const dbIds = relatedProviderIds.map((r) => r.provider_id);
    const missingIds = getMissingStringsFromInput(inputIds, dbIds);
    const deleteCount = await FollowingProviderModel.destroy({
      where: { following_id: followingId, provider_id: missingIds },
      ...options,
    });

    return deleteCount > 0;
  }

  async getByFollowingId(
    followingId: string,
    transaction?: Transaction
  ): Promise<FollowingProviderOutput[]> {
    const options = transaction ? { transaction } : {};
    const followingProviders = await FollowingProviderModel.findAll({
      where: { following_id: followingId },
      ...options,
    });
    return followingProviders.map(
      (followingProvider) =>
        followingProvider.toJSON() as FollowingProviderOutput
    );
  }

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
    const existing = await this.getByFollowingId(followingId, transaction);
    let providersToMap = providerIds;
    if (existing.length) {
      providersToMap = providerIds.filter(
        (id) => !existing.find((e) => e.provider_id === id)
      );
    }
    await FollowingProviderModel.bulkCreate(
      providersToMap.map((id) => ({
        provider_id: id,
        following_id: followingId,
      })),
      options
    );
  }
}

export default FollowingProviderRepository;
