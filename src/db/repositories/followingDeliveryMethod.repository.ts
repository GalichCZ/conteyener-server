import {
  FollowingDeliveryMethodInput,
  FollowingDeliveryMethodOutput,
} from '../models/FollowingDeliveryMethod.model';
import { FollowingDeliveryMethodModel } from '../models';
import { IFollowingDeliveryMethodRepository } from './interfaces';
import { Transaction } from 'sequelize';

class FollowingDeliveryMethodRepository
  implements IFollowingDeliveryMethodRepository
{
  async create(
    data: FollowingDeliveryMethodInput,
    transaction?: Transaction
  ): Promise<FollowingDeliveryMethodOutput> {
    const record = await FollowingDeliveryMethodModel.create(data, {
      transaction,
    });
    return record.toJSON() as FollowingDeliveryMethodOutput;
  }

  async update(
    id: string,
    data: Partial<FollowingDeliveryMethodInput>
  ): Promise<FollowingDeliveryMethodOutput | null> {
    const record = await FollowingDeliveryMethodModel.findByPk(id);
    if (!record) {
      return null;
    }

    await record.update(data);
    return record.toJSON() as FollowingDeliveryMethodOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await FollowingDeliveryMethodModel.destroy({
      where: { id },
    });
    return deletedCount > 0;
  }

  async deleteByFollowingId(
    id: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await FollowingDeliveryMethodModel.destroy({
      where: { following_id: id },
      ...options,
    });
    return deletedCount > 0;
  }

  async findById(id: string): Promise<FollowingDeliveryMethodOutput | null> {
    const record = await FollowingDeliveryMethodModel.findByPk(id);
    if (!record) {
      return null;
    }

    return record.toJSON() as FollowingDeliveryMethodOutput;
  }

  async findAll(): Promise<FollowingDeliveryMethodOutput[]> {
    const records = await FollowingDeliveryMethodModel.findAll();
    return records.map(
      (record) => record.toJSON() as FollowingDeliveryMethodOutput
    );
  }
}

export default FollowingDeliveryMethodRepository;
