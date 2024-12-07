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
  IsDocsModel,
  KmToDistCalculateModel,
  OrderNumberModel,
  ProviderModel,
  SimpleProductModel,
  StockPlaceModel,
  StoreModel,
} from '../models';
import { Op, Transaction } from 'sequelize';
import { FollowingType } from '../models/interfaces';
import {
  FilterBody,
  WhereConditions,
  WhereConditionsScopes,
} from '../../types/where-conditions';
import { removeDuplicates } from '../../utils/remove-duplicates';
import { onGet } from '../../services/following/elastic-crud/on-get';
import { followingFilterHandler } from './utils/following-filter-handler';

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
          as: 'delivery_methods', // Alias for the DeliveryMethodModel
        },
        {
          model: DeliveryChannelModel,
          as: 'delivery_channels', // Alias for the DeliveryChannelModel
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
          as: 'delivery_channels', // Alias for the DeliveryChannelModel
        },
        {
          model: StoreModel,
          as: 'stores', // Alias for the StoreModel
        },
        {
          model: StockPlaceModel,
          as: 'stock_places', // Alias for the StockPlaceModel
        },
        {
          model: ContainerTypeModel,
          as: 'container_types', // Alias for the ContainerTypeModel
        },
        {
          model: DeliveryMethodModel,
          as: 'delivery_methods', // Alias for the DeliveryMethodModel
        },
        {
          model: ProviderModel,
          as: 'providers', // Alias for the ProviderModel
        },
        {
          model: OrderNumberModel, // Include OrderNumberModel
          as: 'order_numbers', // Alias used in the hasMany relationship
          include: [
            {
              model: IsDocsModel,
              as: 'is_docs',
            },
          ],
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

    if (!array.length) return [];

    return removeDuplicates(array);
  }

  async filterAndSearch(
    whereConditions: WhereConditionsScopes,
    foreignValues: WhereConditions[],
    searchString: string,
    filtersBody: FilterBody
  ): Promise<FollowingOutput[] | null> {
    const { filters, search } = filtersBody;

    /*
      {filters: [
        key: string,
        value: any,
        is_elastic: boolean
      ]}
     */

    const include: any = [
      {
        model: StoreModel,
        as: 'stores',
      },
      {
        model: StockPlaceModel,
        as: 'stock_places',
      },
      {
        model: ContainerTypeModel,
        as: 'container_types',
      },
      {
        model: DeliveryMethodModel,
        as: 'delivery_methods',
      },
      {
        model: CalculatedDateModel,
        as: 'calculated_dates',
      },
      {
        model: DeclarationModel,
        as: 'declarations',
      },
      {
        model: KmToDistCalculateModel,
        as: 'km_to_dist_calculate',
      },
      {
        model: OrderNumberModel,
        as: 'order_numbers',
        include: [
          {
            model: IsDocsModel,
            as: 'is_docs',
            required: true,
          },
        ],
        required: true,
      },
      {
        model: SimpleProductModel,
        as: 'simple_products',
      },
      {
        model: ProviderModel,
        as: 'providers', // Alias for the ProviderModel
      },
      // Add any other necessary models here
    ];
    const where: any = {
      hidden: false,
    };

    if (search === '' && !filters.length) {
      const result = await FollowingModel.findAll({
        where,
        include,
      });

      return result.map((following) => following.toJSON() as FollowingOutput);
    }

    const result = await onGet(search, filters);

    const noElasticFilters = filters.filter((f) => !f.is_elastic);

    if (noElasticFilters.length > 0) {
      followingFilterHandler(noElasticFilters, where, include);
    }

    if (result.length > 0) {
      where['id'] = { [Op.in]: result };
    }

    const followings = await FollowingModel.findAll({
      where,
      include,
    });

    return followings.map((following) => following.toJSON() as FollowingOutput);
  }
}

export default FollowingRepository;
