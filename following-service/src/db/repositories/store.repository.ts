import { IStoreRepository } from './interfaces';
import { StoreInput, StoreOutput } from '../models/Store.model';
import { StoreModel } from '../models';
import { Transaction } from 'sequelize';
import { removeDuplicates } from '../../utils/remove-duplicates';

class StoreRepository implements IStoreRepository {
  async create(storeInput: StoreInput): Promise<StoreOutput> {
    const store = await StoreModel.create(storeInput);
    return store.toJSON() as StoreOutput;
  }

  async update(
    id: string,
    storeInput: Partial<StoreInput>
  ): Promise<StoreOutput | null> {
    const store = await StoreModel.findByPk(id);
    if (!store) {
      return null;
    }

    await store.update(storeInput);
    return store.toJSON() as StoreOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await StoreModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findById(
    id: string,
    transaction?: Transaction
  ): Promise<StoreOutput | null> {
    const options = transaction ? { transaction } : {};
    const store = await StoreModel.findByPk(id, options);
    if (!store) {
      return null;
    }

    return store.toJSON() as StoreOutput;
  }

  async findAll(): Promise<StoreOutput[]> {
    const stores = await StoreModel.findAll();
    return stores.map((store) => store.toJSON() as StoreOutput);
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    const values = await StoreModel.findAll({
      attributes: ['name'],
    });

    const array = values.map((value) => value.get('name'));

    return removeDuplicates(array);
  }
}

export default StoreRepository;
