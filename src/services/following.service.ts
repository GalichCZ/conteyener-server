import OrderNumberRepository from '../db/repositories/orderNumber.repository';
import GError from '../error-handler/GError';
import DeliveryMethodRepository from '../db/repositories/deliveryMethod.repository';
import StoreRepository from '../db/repositories/store.repository';
import ContainerTypeRepository from '../db/repositories/containerType.repository';
import { DeliveryMethodOutput } from '../db/models/DeliveryMethod.model';
import { StoreOutput } from '../db/models/Store.model';
import { ContainerTypeOutput } from '../db/models/ContainerType.model';
import { FollowingInput } from '../db/models/Following.model';
import FollowingRepository from '../db/repositories/following.repository';
import IsDocsRepository from '../db/repositories/isDocs.repository';
import FollowingStoreRepository from '../db/repositories/followingStore.repository';
import FollowingProviderRepository from '../db/repositories/followingProvider.repository';
import FollowingDeliveryMethodRepository from '../db/repositories/followingDeliveryMethod.repository';
import FollowingContainerTypeRepository from '../db/repositories/followingContainerType.repository';
import { Transaction } from 'sequelize';
import FollowingDeliveryChannelRepository from '../db/repositories/followingDeliveryChannel.repository';
import ProductRepository from '../db/repositories/product.repository';
import DeclarationRepository from '../db/repositories/declaration.repository';
import DeclarationStatusRepository from '../db/repositories/declarationStatus.repository';
import FollowingStockPlaceRepository from '../db/repositories/followingStockPlace.repository';
import KmToDistCalculateRepository from '../db/repositories/kmToDistCalculate.repository';
import CalculatedDateRepository from '../db/repositories/calculatedDate.repository';

class FollowingService {
  private _orderNumberRepository = new OrderNumberRepository();
  private _productRepository = new ProductRepository();
  private _deliveryMethodRepository = new DeliveryMethodRepository();
  private _storeRepository = new StoreRepository();
  private _containerTypeRepository = new ContainerTypeRepository();
  private _followingRepository = new FollowingRepository();
  private _isDocsRepository = new IsDocsRepository();
  private _followingStoreRepository = new FollowingStoreRepository();
  private _followingStockPlaceRepository = new FollowingStockPlaceRepository();
  private _followingProviderRepository = new FollowingProviderRepository();
  private _followingDeliveryMethodRepository =
    new FollowingDeliveryMethodRepository();
  private _followingContainerTypeRepository =
    new FollowingContainerTypeRepository();
  private _followingDeliveryChannelRepository =
    new FollowingDeliveryChannelRepository();
  private _declarationRepository = new DeclarationRepository();
  private _declarationStatusRepository = new DeclarationStatusRepository();
  private _kmToDistCalculateRepository = new KmToDistCalculateRepository();
  private _calculatedDateRepository = new CalculatedDateRepository();

  async getFollowings() {
    return await this._followingRepository.findAll();
  }

  async deleteFollowing(id: string) {
    const transaction = await this._followingRepository.startTransaction();
    let transactionStarted = false;

    const following = await this._followingRepository.findById(id);

    if (!following) {
      throw new GError({
        message: `Following does not exist`,
        status: 404,
        methodName: this.deleteFollowing.name,
        serviceName: FollowingService.name,
      });
    }

    try {
      transactionStarted = true;

      await Promise.all([
        this._followingContainerTypeRepository.deleteByFollowingId(
          id,
          transaction
        ),
        this._followingDeliveryChannelRepository.deleteByFollowingId(
          id,
          transaction
        ),
        this._followingDeliveryMethodRepository.deleteByFollowingId(
          id,
          transaction
        ),
        this._followingStockPlaceRepository.deleteByFollowingId(
          id,
          transaction
        ),
        this._followingProviderRepository.deleteByFollowingId(id, transaction),
        this._kmToDistCalculateRepository.deleteByFollowingId(id, transaction),
        this._followingStoreRepository.deleteByFollowingId(id, transaction),
        this._productRepository.deleteByFollowingId(id, transaction),
        this._calculatedDateRepository.deleteByFollowingId(id, transaction),
      ]);

      const orderNumbers =
        await this._orderNumberRepository.findAllByFollowingId(id, transaction);
      await this._isDocsRepository.deleteByOrderNumberIds(
        orderNumbers.map((o) => o.id),
        transaction
      );
      await this._orderNumberRepository.deleteByFollowingId(id, transaction);

      const declarations =
        await this._declarationRepository.findAllByFollowingId(id, transaction);
      await this._declarationStatusRepository.deleteByDeclarationIds(
        declarations.map((d) => d.id),
        transaction
      );
      await this._declarationRepository.deleteByFollowingId(id, transaction);

      await this._followingRepository.delete(id, transaction);

      await transaction.commit();
    } catch (error) {
      if (transactionStarted) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async createFollowing(followingBody: any) {
    const transaction = await this._followingRepository.startTransaction();

    try {
      const {
        order_number,
        delivery_method,
        store: store_id,
        container_type,
        request_date,
        importers,
        conditions,
        agent,
        direction,
        place_of_dispatch,
        providers,
      } = followingBody;

      await this.checkExistingOrderNumbers(order_number, transaction);

      const deliveryMethod = await this.getDeliveryMethod(
        delivery_method,
        transaction
      );

      const store = await this.getStore(store_id, transaction);

      const containerType = await this.getContainerType(
        container_type,
        transaction
      );

      const followingInput: FollowingInput = {
        request_date,
        importers,
        conditions,
        agent,
        direction,
        place_of_dispatch,
        hidden: false,
      };

      const following = await this._followingRepository.create(
        followingInput,
        transaction
      );

      console.log(following, 'fuck');

      const orderNumbers = await this._orderNumberRepository.createOrderNumbers(
        order_number,
        following.id,
        transaction
      );

      await this._isDocsRepository.createIsDocs(
        orderNumbers.map((oN) => oN.id),
        transaction
      );

      await this._followingStoreRepository.create(
        {
          store_id: store.id,
          following_id: following.id,
        },
        transaction
      );

      await this._followingDeliveryMethodRepository.create(
        {
          delivery_method_id: deliveryMethod.id,
          following_id: following.id,
        },
        transaction
      );

      await this._followingContainerTypeRepository.create(
        {
          container_type_id: containerType.id,
          following_id: following.id,
        },
        transaction
      );

      await this._followingProviderRepository.createMany(
        providers,
        following.id,
        transaction
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async checkExistingOrderNumbers(
    order_number: string[],
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
        methodName: this.createFollowing.name,
        serviceName: FollowingService.name,
      });
    }
  }

  private async getDeliveryMethod(
    delivery_method: string,
    transaction?: Transaction
  ): Promise<DeliveryMethodOutput> {
    const deliveryMethod = await this._deliveryMethodRepository.findById(
      delivery_method,
      transaction
    );
    if (!deliveryMethod) {
      throw new GError({
        message: `Delivery method does not exist`,
        status: 400,
        methodName: this.createFollowing.name,
        serviceName: FollowingService.name,
      });
    }
    return deliveryMethod;
  }

  private async getStore(
    store_id: string,
    transaction?: Transaction
  ): Promise<StoreOutput> {
    const store = await this._storeRepository.findById(store_id, transaction);
    if (!store) {
      throw new GError({
        message: `Store does not exist`,
        status: 400,
        methodName: this.createFollowing.name,
        serviceName: FollowingService.name,
      });
    }
    return store;
  }

  private async getContainerType(
    container_type: string,
    transaction?: Transaction
  ): Promise<ContainerTypeOutput> {
    const containerType = await this._containerTypeRepository.findById(
      container_type,
      transaction
    );
    if (!containerType) {
      throw new GError({
        message: `Container type does not exist`,
        status: 400,
        methodName: this.createFollowing.name,
        serviceName: FollowingService.name,
      });
    }
    return containerType;
  }
}

export default FollowingService;
