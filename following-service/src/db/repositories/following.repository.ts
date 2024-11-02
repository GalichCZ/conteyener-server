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
        where: search
          ? {
              name: {
                [Op.or]: {
                  [Op.iLike]: `%${search}%`, // Case-insensitive search for provider name
                },
              },
            }
          : {},
      },
      // Add any other necessary models here
    ];
    const where: any = {};

    filters.forEach((filter) => {
      const { scope, column, value, is_foreign, is_array, belongs_to } = filter;

      if (belongs_to) {
        const parentModel = include.find((inc: any) => inc.as === belongs_to);
        const relatedModel = parentModel.include.find(
          (inc: any) => inc.as === scope
        );

        if (relatedModel && parentModel) {
          if (is_array) {
          } else {
            //check if it has where
            const where = relatedModel.where;
            if (where) {
              where[Op.and].push({ [value.toLowerCase()]: true });
            } else {
              relatedModel.where = {
                [Op.and]: [{ [value.toLowerCase()]: true }],
              };
            }
          }
        }
      }

      if (scope === 'following' && !is_foreign) {
        if (is_array) {
          if (where[column]) {
            where[column][Op.or].push({ [Op.overlap]: [value] });
          } else {
            where[column] = { [Op.or]: [{ [Op.overlap]: [value] }] };
          }
        } else {
          if (where[column]) {
            where[column][Op.or].push(value);
          } else {
            where[column] = { [Op.or]: [value] };
          }
        }
      }

      if (scope === 'following' && is_foreign) {
        const includeModel = include.find((inc: any) => inc.as === column);

        const specificColumns: { [key: string]: string } = {
          stores: 'name',
          stock_places: 'name',
          container_types: 'type_name',
          delivery_methods: 'method',
        };

        if (includeModel) {
          if (is_array) {
            if (
              includeModel.where &&
              includeModel.where[specificColumns[column]]
            ) {
              includeModel.where[specificColumns[column]][Op.or].push({
                [Op.overlap]: [value],
              });
            } else {
              includeModel.where = {
                [specificColumns[column]]: {
                  [Op.or]: [{ [Op.overlap]: [value] }],
                },
              };
            }
          } else {
            if (
              includeModel.where &&
              includeModel.where[specificColumns[column]]
            ) {
              includeModel.where[specificColumns[column]][Op.or].push(value);
            } else {
              includeModel.where = {
                [specificColumns[column]]: { [Op.or]: [value] },
              };
            }
          }
        }
      }

      if (scope !== 'following' && !belongs_to) {
        const relatedModel = include.find((inc: any) => inc.as === scope);
        if (relatedModel) {
          if (is_array) {
            if (relatedModel.where && relatedModel.where[column]) {
              relatedModel.where[column][Op.or].push({ [Op.overlap]: [value] });
            } else {
              relatedModel.where = {
                [column]: { [Op.or]: [{ [Op.overlap]: [value] }] },
              };
            }
          } else {
            if (relatedModel.where && relatedModel.where[column]) {
              relatedModel.where[column][Op.or].push(value);
            } else {
              relatedModel.where = { [column]: { [Op.or]: [value] } };
            }
          }
        }
      }
    });

    if (search) {
      where[Op.or as any] = [
        // Search directly on the following table
        { inside_number: { [Op.overlap]: [search] } },
        { proform_number: { [Op.overlap]: [search] } },
        { container_number: { [Op.iLike]: `%${search}%` } },
        { importers: { [Op.overlap]: [search] } },
        { conditions: { [Op.overlap]: [search] } },
        { direction: { [Op.iLike]: `%${search}%` } },
        { agent: { [Op.iLike]: `%${search}%` } },
        { place_of_dispatch: { [Op.iLike]: `%${search}%` } },
        { line: { [Op.iLike]: `%${search}%` } },
        { port: { [Op.iLike]: `%${search}%` } },
        { expeditor: { [Op.iLike]: `%${search}%` } },
        { destination_station: { [Op.iLike]: `%${search}%` } },
        { pickup: { [Op.iLike]: `%${search}%` } },
        { fraht: { [Op.iLike]: `%${search}%` } },

        // Search through related models via foreign keys (joined models)
        { '$stores.name$': { [Op.iLike]: `%${search}%` } },
        { '$stock_places.name$': { [Op.iLike]: `%${search}%` } },
        { '$container_types.type_name$': { [Op.iLike]: `%${search}%` } },
        { '$delivery_methods.method$': { [Op.iLike]: `%${search}%` } },

        // Search in tables with following_id as a foreign key
        { '$order_numbers.number$': { [Op.iLike]: `%${search}%` } },
        { '$declarations.number$': { [Op.iLike]: `%${search}%` } },
        Number(search)
          ? { '$km_to_dist_calculate.km_to_dist$': { [Op.eq]: Number(search) } }
          : {},
        { '$simple_products.simple_name$': { [Op.iLike]: `%${search}%` } },

        // Add any other relevant related tables here
      ];
    }

    const followings = await FollowingModel.findAll({
      where,
      include,
    });

    return followings.map((following) => following.toJSON() as FollowingOutput);
  }
}

export default FollowingRepository;
