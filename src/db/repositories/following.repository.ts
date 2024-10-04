import { IFollowingRepository } from './interfaces';
import followingModel, {
  FollowingInput,
  FollowingOutput,
} from '../models/Following.model';
import {
  CalculatedDateModel,
  ContainerTypeModel,
  DeclarationModel,
  DeliveryChannelModel,
  DeliveryMethodModel,
  FollowingModel,
  KmToDistCalculateModel,
  OrderNumberModel,
  ProviderModel,
  SimpleProductModel,
  StockPlaceModel,
  StoreModel,
} from '../models';
import { Transaction } from 'sequelize';
import { FollowingType } from '../models/interfaces';

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
    followingInput: Partial<FollowingType>
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

  async findById(
    id: string,
    transaction?: Transaction
  ): Promise<FollowingOutput | null> {
    const options = transaction ? { transaction } : {};
    const following = await FollowingModel.findByPk(id, {
      include: [
        {
          model: DeliveryMethodModel,
          as: 'delivery_method', // Alias for the DeliveryMethodModel
        },
        {
          model: DeliveryChannelModel,
          as: 'deliveryChannel', // Alias for the DeliveryChannelModel
        },
        {
          model: CalculatedDateModel,
          as: 'calculated_dates',
        },
        {
          model: KmToDistCalculateModel,
          as: 'km_to_dist_calculate',
        },
      ],
      ...options,
    });
    if (!following) {
      return null;
    }

    return following.toJSON() as FollowingOutput;
  }

  async findAll(): Promise<FollowingOutput[]> {
    const followings = await FollowingModel.findAll({
      include: [
        {
          model: DeliveryChannelModel,
          as: 'deliveryChannel', // Alias for the DeliveryChannelModel
        },
        {
          model: StoreModel,
          as: 'store', // Alias for the StoreModel
        },
        {
          model: StockPlaceModel,
          as: 'stockPlace', // Alias for the StockPlaceModel
        },
        {
          model: ContainerTypeModel,
          as: 'containerType', // Alias for the ContainerTypeModel
        },
        {
          model: DeliveryMethodModel,
          as: 'delivery_method', // Alias for the DeliveryMethodModel
        },
        {
          model: ProviderModel,
          as: 'providers', // Alias for the ProviderModel
        },
        {
          model: OrderNumberModel, // Include OrderNumberModel
          as: 'order_numbers', // Alias used in the hasMany relationship
        },
        {
          model: DeclarationModel,
          as: 'declarations',
        },
        {
          model: SimpleProductModel,
          as: 'simple_products',
        },
        {
          model: CalculatedDateModel,
          as: 'calculated_dates',
        },
        {
          model: KmToDistCalculateModel,
          as: 'km_to_dist_calculate',
        },
      ],
    });
    return followings.map((following) => following.toJSON() as FollowingOutput);
  }

  async findByContainerNumber(
    container_number: string,
    transaction?: Transaction
  ): Promise<FollowingOutput | null> {
    const options = transaction ? { transaction } : {};

    const following = await followingModel.findOne({
      where: { hidden: false, container_number },
      ...options,
    });

    if (!following) {
      return null;
    }

    return following.toJSON() as FollowingOutput;
  }

  async startTransaction(): Promise<Transaction> {
    return FollowingModel.sequelize!.transaction();
  }

  async getAllColumnValues(columnName: string): Promise<any> {
    const values = await followingModel.findAll({
      attributes: [columnName],
    });

    const mapped = values.map((value) => value.get(columnName));

    const array: any = [];
    mapped.forEach((m) => {
      console.log(Array.isArray(m));
      if (Array.isArray(m)) {
        array.push(...m);
      } else {
        array.push(m);
      }
    });

    return array.filter(
      (value: any, index: number, self: any) => self.indexOf(value) === index
    );
  }
}

export default FollowingRepository;
