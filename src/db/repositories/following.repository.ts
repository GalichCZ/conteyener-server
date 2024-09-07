import { IFollowingRepository } from './interfaces';
import { FollowingInput, FollowingOutput } from '../models/Following.model';
import { DeliveryChannelModel, FollowingModel, StoreModel } from '../models';
import { Transaction } from 'sequelize';

class FollowingRepository implements IFollowingRepository {
  async create(
    followingInput: FollowingInput,
    transaction?: Transaction
  ): Promise<FollowingOutput> {
    const following = await FollowingModel.create(followingInput, {
      transaction,
    });
    return following.toJSON() as FollowingOutput;
  }

  async update(
    id: string,
    followingInput: Partial<FollowingInput>
  ): Promise<FollowingOutput | null> {
    const following = await FollowingModel.findByPk(id);
    if (!following) {
      return null;
    }

    await following.update(followingInput);
    return following.toJSON() as FollowingOutput;
  }

  async delete(id: string, transaction?: Transaction): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await FollowingModel.destroy({
      where: { id },
      ...options,
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<FollowingOutput | null> {
    const following = await FollowingModel.findByPk(id);
    if (!following) {
      return null;
    }

    return following.toJSON() as FollowingOutput;
  }

  async findAll(): Promise<FollowingOutput[]> {
    const followings = await FollowingModel.findAll({
      include: [DeliveryChannelModel, StoreModel],
    });
    return followings.map((following) => following.toJSON() as FollowingOutput);
  }

  async startTransaction(): Promise<Transaction> {
    return FollowingModel.sequelize!.transaction();
  }
}

export default FollowingRepository;
