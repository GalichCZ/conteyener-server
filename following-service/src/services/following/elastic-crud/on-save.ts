import { FollowingOutput } from '../../../db/models/Following.model';
import { OrderNumberOutput } from '../../../db/models/OrderNumber.model';
import {
  ContainerTypeModel,
  DeclarationModel,
  DeliveryMethodModel,
  FollowingModel,
  KmToDistCalculateModel,
  OrderNumberModel,
  ProviderModel,
  SimpleProductModel,
  StockPlaceModel,
  StoreModel,
} from '../../../db/models';
import elasticClient from '../../../provider/elastic/elastic';
import { FOLLOWING_INDEX } from '../../../provider/elastic/indicies';
import { Transaction } from 'sequelize';
import { DeliveryMethodOutput } from '../../../db/models/DeliveryMethod.model';
import { StoreOutput } from '../../../db/models/Store.model';
import { ContainerTypeOutput } from '../../../db/models/ContainerType.model';
import { StockPlaceOutput } from '../../../db/models/StockPlace.model';
import { ProductOutput } from '../../../db/models/SimpleProduct.model';
import { DeclarationOutput } from '../../../db/models/Declaration.model';
import { KmToDistCalculateOutput } from '../../../db/models/KmToDistCalculate.model';

interface OnSaveParams {
  following: FollowingOutput;
  transaction: Transaction;
  order_numbers?: OrderNumberOutput[];
  deliveryMethod?: DeliveryMethodOutput;
  store?: StoreOutput;
  containerType?: ContainerTypeOutput;
  stockPlace?: StockPlaceOutput;
  simpleProducts?: ProductOutput[];
  declarationNumberModels?: DeclarationOutput[];
  kmToDist?: KmToDistCalculateOutput;
}

export const onSave = async ({
  following,
  order_numbers,
  transaction,
  deliveryMethod,
  store,
  containerType,
  stockPlace,
  simpleProducts,
  declarationNumberModels,
  kmToDist,
}: OnSaveParams) => {
  try {
    const options = transaction ? { transaction } : {};

    const queriedStore = store
      ? store
      : await StoreModel.findByPk(following.store_id);

    const queriedStockPlace = stockPlace
      ? stockPlace
      : await StockPlaceModel.findByPk(following.stock_place_id);

    const queriedContainerType = containerType
      ? containerType
      : await ContainerTypeModel.findByPk(following.container_type_id, options);

    const queriedDeliveryMethod = deliveryMethod
      ? deliveryMethod
      : await DeliveryMethodModel.findByPk(following.delivery_method_id);

    const declarations = declarationNumberModels
      ? declarationNumberModels
      : await DeclarationModel.findAll({
          where: {
            following_id: following.id,
          },
          ...options,
        });

    const queriedKmToDist = kmToDist
      ? kmToDist
      : await KmToDistCalculateModel.findOne({
          where: {
            following_id: following.id,
          },
          ...options,
        });

    const orderNumbersModels = order_numbers
      ? order_numbers
      : await OrderNumberModel.findAll({
          where: {
            following_id: following.id,
          },
          ...options,
        });

    const queriedFollowing = await FollowingModel.findByPk(following.id, {
      include: [
        {
          model: ProviderModel,
          as: 'providers', // Alias for the ProviderModel
          attributes: ['name'], // Only fetch the name field from Provider
        },
      ],
      ...options,
    });

    const followingProviders = queriedFollowing as FollowingModel & {
      providers: ProviderModel[];
    };

    const queriedSimpleProducts = simpleProducts
      ? simpleProducts
      : await SimpleProductModel.findAll({
          where: {
            following_id: following.id,
          },
          ...options,
        });

    const declarationNumbers = declarations?.map((d) => d.number);
    const orderNumbers = orderNumbersModels?.map((d) => d.number);
    const providers = followingProviders?.providers?.map((p) => p.name);
    const simpleNames = queriedSimpleProducts?.map((d) => d.simple_name);

    await elasticClient.index({
      index: FOLLOWING_INDEX,
      id: following.id,
      body: {
        id: following.id,
        inside_number: following.inside_number,
        proform_number: following.proform_number,
        container_number: following.container_number,
        importers: following.importers,
        conditions: following.conditions,
        direction: following.direction,
        agent: following.agent,
        place_of_dispatch: following.place_of_dispatch,
        line: following.line,
        port: following.port,
        expeditor: following.expeditor,
        destination_station: following.destination_station,
        pickup: following.pickup,
        fraht_account: following.fraht,
        store: queriedStore?.name,
        stock_place: queriedStockPlace?.name,
        container_type: queriedContainerType?.type_name,
        delivery_method: queriedDeliveryMethod?.method,
        declaration_number: declarationNumbers,
        km_to_dist: queriedKmToDist?.km_to_dist,
        simple_product_name: simpleNames,
        order_number: orderNumbers,
        providers: providers,
      },
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw error;
  }
};
