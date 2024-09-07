import {
  FollowingStockPlaceInput,
  FollowingStockPlaceOutput,
} from '../models/FollowingStockPlace.model';
import { FollowingStockPlaceModel } from '../models';
import { IFollowingStockPlaceRepository } from './interfaces';
import { Transaction } from 'sequelize';

class FollowingStockPlaceRepository implements IFollowingStockPlaceRepository {
  async create(
    data: FollowingStockPlaceInput
  ): Promise<FollowingStockPlaceOutput> {
    const record = await FollowingStockPlaceModel.create(data);
    return record.toJSON() as FollowingStockPlaceOutput;
  }

  async update(
    id: string,
    data: Partial<FollowingStockPlaceInput>
  ): Promise<FollowingStockPlaceOutput | null> {
    const record = await FollowingStockPlaceModel.findByPk(id);
    if (!record) {
      return null;
    }

    await record.update(data);
    return record.toJSON() as FollowingStockPlaceOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await FollowingStockPlaceModel.destroy({
      where: { id },
    });
    return deletedCount > 0;
  }

  async findById(id: string): Promise<FollowingStockPlaceOutput | null> {
    const record = await FollowingStockPlaceModel.findByPk(id);
    if (!record) {
      return null;
    }

    return record.toJSON() as FollowingStockPlaceOutput;
  }

  async findAll(): Promise<FollowingStockPlaceOutput[]> {
    const records = await FollowingStockPlaceModel.findAll();
    return records.map(
      (record) => record.toJSON() as FollowingStockPlaceOutput
    );
  }

  async deleteByFollowingId(
    id: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};

    const deletedCount = await FollowingStockPlaceModel.destroy({
      where: { following_id: id },
      ...options,
    });

    return deletedCount > 0;
  }
}

export default FollowingStockPlaceRepository;
