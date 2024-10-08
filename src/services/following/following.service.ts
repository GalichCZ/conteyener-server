import OrderNumberRepository from '../../db/repositories/orderNumber.repository';
import GError from '../../error-handler/GError';
import DeliveryMethodRepository from '../../db/repositories/deliveryMethod.repository';
import StoreRepository from '../../db/repositories/store.repository';
import ContainerTypeRepository from '../../db/repositories/containerType.repository';
import FollowingRepository from '../../db/repositories/following.repository';
import IsDocsRepository from '../../db/repositories/isDocs.repository';
import FollowingProviderRepository from '../../db/repositories/followingProvider.repository';
import { Transaction } from 'sequelize';
import SimpleProductRepository from '../../db/repositories/simpleProduct.repository';
import DeclarationRepository from '../../db/repositories/declaration.repository';
import DeclarationStatusRepository from '../../db/repositories/declarationStatus.repository';
import KmToDistCalculateRepository from '../../db/repositories/kmToDistCalculate.repository';
import CalculatedDateRepository from '../../db/repositories/calculatedDate.repository';
import StockPlaceRepository from '../../db/repositories/stockPlace.repository';
import DeliveryChannelRepository from '../../db/repositories/deliveryChannel.repository';
import ProductSpecificationRepository from '../../db/repositories/productSpecification.repository';
import ProviderRepository from '../../db/repositories/provider.repository';
import { IBaseRepository } from '../../db/repositories/interfaces';

class FollowingService {
  constructor(
    protected _orderNumberRepository = new OrderNumberRepository(),
    protected _simpleProductRepository = new SimpleProductRepository(),
    protected _deliveryMethodRepository = new DeliveryMethodRepository(),
    protected _deliveryChannelRepository = new DeliveryChannelRepository(),
    protected _storeRepository = new StoreRepository(),
    protected _containerTypeRepository = new ContainerTypeRepository(),
    protected _followingRepository = new FollowingRepository(),
    protected _isDocsRepository = new IsDocsRepository(),
    protected _followingProviderRepository = new FollowingProviderRepository(),
    protected _declarationRepository = new DeclarationRepository(),
    protected _declarationStatusRepository = new DeclarationStatusRepository(),
    protected _kmToDistCalculateRepository = new KmToDistCalculateRepository(),
    protected _calculatedDateRepository = new CalculatedDateRepository(),
    protected _stockPlaceRepository = new StockPlaceRepository(),
    protected _productSpecificationRepository = new ProductSpecificationRepository(),
    protected _providerRepository = new ProviderRepository(),
    protected _repositoriesMap: { [key: string]: any } = {
      stock_places: new StockPlaceRepository(),
      container_types: new ContainerTypeRepository(),
      stores: new StoreRepository(),
      delivery_methods: new DeliveryMethodRepository(),
      delivery_channels: new DeliveryChannelRepository(),
      followings: new FollowingRepository(),
      providers: new ProviderRepository(),
      km_to_dist_calculates: new KmToDistCalculateRepository(),
      order_numbers: new OrderNumberRepository(),
      calculated_dates: new CalculatedDateRepository(),
      declarations: new DeclarationRepository(),
      simple_products: new SimpleProductRepository(),
      is_docs: new IsDocsRepository(),
    }
  ) {}

  async getFollowings() {
    return await this._followingRepository.findAll();
  }

  async getFilterKeys(params: any) {
    try {
      const { entity_name, entity_column } = params;

      const repository: IBaseRepository<any, any> =
        this._repositoriesMap[entity_name];

      return await repository.getAllColumnValues(entity_column);
    } catch (error) {
      throw error;
    }
  }

  protected async checkExistingOrderNumbers(
    order_number: string[],
    methodName: string,
    transaction?: Transaction
  ): Promise<void> {
    const existingOrderNumbers =
      await this._orderNumberRepository.isAtLeastOneOrderNumber(
        order_number,
        transaction
      );

    if (existingOrderNumbers.length > 0) {
      throw new GError({
        message: `Order number already exists - ${existingOrderNumbers.join(', ')}`,
        status: 400,
        methodName,
        serviceName: FollowingService.name,
      });
    }
  }
}

export default FollowingService;
