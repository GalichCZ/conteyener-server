import {
  FollowingDeliveryChannelInput,
  FollowingDeliveryChannelOutput,
} from '../models/FollowingDeliveryChannel.model';
import { FollowingDeliveryChannelModel } from '../models';
import { IFollowingDeliveryChannelRepository } from './interfaces';
import { Transaction } from 'sequelize';

class FollowingDeliveryChannelRepository
  implements IFollowingDeliveryChannelRepository
{
  async create(
    data: FollowingDeliveryChannelInput
  ): Promise<FollowingDeliveryChannelOutput> {
    const record = await FollowingDeliveryChannelModel.create(data);
    return record.toJSON() as FollowingDeliveryChannelOutput;
  }

  async update(
    id: string,
    data: Partial<FollowingDeliveryChannelInput>
  ): Promise<FollowingDeliveryChannelOutput | null> {
    const record = await FollowingDeliveryChannelModel.findByPk(id);
    if (!record) {
      return null;
    }

    await record.update(data);
    return record.toJSON() as FollowingDeliveryChannelOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await FollowingDeliveryChannelModel.destroy({
      where: { id },
    });
    return deletedCount > 0;
  }

  async deleteByFollowingId(
    id: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await FollowingDeliveryChannelModel.destroy({
      where: { following_id: id },
      ...options,
    });
    return deletedCount > 0;
  }

  async findById(id: string): Promise<FollowingDeliveryChannelOutput | null> {
    const record = await FollowingDeliveryChannelModel.findByPk(id);
    if (!record) {
      return null;
    }

    return record.toJSON() as FollowingDeliveryChannelOutput;
  }

  async findAll(): Promise<FollowingDeliveryChannelOutput[]> {
    const records = await FollowingDeliveryChannelModel.findAll();
    return records.map(
      (record) => record.toJSON() as FollowingDeliveryChannelOutput
    );
  }
}

export default FollowingDeliveryChannelRepository;
