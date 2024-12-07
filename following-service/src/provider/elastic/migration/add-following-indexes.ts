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
} from '../../../db/models';
import elasticClient from '../elastic';
import { FOLLOWING_INDEX } from '../indicies';
import { FollowingOutput } from '../../../db/models/Following.model';
import { StoreOutput } from '../../../db/models/Store.model';
import { StockPlaceOutput } from '../../../db/models/StockPlace.model';
import { ContainerTypeOutput } from '../../../db/models/ContainerType.model';
import { DeliveryMethodOutput } from '../../../db/models/DeliveryMethod.model';
import { ProviderOutput } from '../../../db/models/Provider.model';
import { OrderNumberOutput } from '../../../db/models/OrderNumber.model';
import { DeclarationOutput } from '../../../db/models/Declaration.model';
import { KmToDistCalculateOutput } from '../../../db/models/KmToDistCalculate.model';

export const addFollowingIndexes = async () => {
  try {
    const followings = await FollowingModel.findAll({
      where: {
        hidden: false,
      },
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
        {
          model: ContainerTypeModel,
          as: 'container_types', // Alias for the ContainerTypeModel
        },
      ],
    });
    for (const _following of followings) {
      const following = _following as unknown as FollowingOutput & {
        stores?: StoreOutput;
        stock_places?: StockPlaceOutput;
        container_types?: ContainerTypeOutput;
        delivery_methods?: DeliveryMethodOutput;
        providers?: ProviderOutput[];
        order_numbers?: OrderNumberOutput[];
        declarations?: DeclarationOutput[];
        simple_products?: SimpleProductModel[];
        km_to_dist_calculate?: KmToDistCalculateOutput;
      };

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
          store: following.stores?.name,
          stock_place: following.stock_places?.name,
          container_type: following.container_types?.type_name,
          delivery_method: following.delivery_methods?.method,
          declaration_number: following.declarations?.map((d) => d.number),
          km_to_dist: following.km_to_dist_calculate?.km_to_dist,
          simple_product_name: following.simple_products?.map(
            (s) => s.simple_name
          ),
          order_number: following.order_numbers?.map((o) => o.number),
          providers: following.providers?.map((p) => p.name),
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};
